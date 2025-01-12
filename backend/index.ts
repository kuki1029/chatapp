import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
import http from "http";
import express from "express";
import { Response, Request } from "express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import database from "./src/utils/db";
import { resolvers } from "./src/graphql/resolvers/resolvers";
import { typeDefs } from "./src/graphql/schema/schemas";
import cors from "cors";
import cookieParser from "cookie-parser";
import { parse } from "cookie";
import jwt from "jsonwebtoken";
import env from "./src/utils/config";
import { PubSub } from "graphql-subscriptions";
import { NewMessage, NewUserChat } from "./types";

export interface MyContext {
  res: Response;
  req: Request;
  userID: string | null;
  pubsub: PubSub<{
    NEW_MESSAGE: NewMessage;
    NEW_USERCHAT: NewUserChat;
  }>;
}

const start = async () => {
  const pubsub = new PubSub<{
    NEW_MESSAGE: NewMessage;
  }>();
  const corsOptions = {
    origin: [
      "http://localhost:5173",
      "http://localhost",
      "http://chat.imkunal.ca",
      "https://studio.apollographql.com",
      "https://sandbox.embed.apollographql.com",
    ],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
  };
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Attach both Express and ApolloServer to HTTP Server
  const app = express() as any; //TODO: look into this any type
  const httpServer = createServer(app);

  // Create our WebSocket server using the HTTP server we just set up.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        const userID = handleAuth(ctx.extra.request);
        return { pubsub, userID }; //TODO: Add type here for funciton so it fixes in resolvers
      },
      onConnect: async (ctx) => {
        handleAuth(ctx.extra.request);
      },
      onSubscribe: async (ctx) => {
        handleAuth(ctx.extra.request);
      },
    },
    wsServer
  );

  // Set up ApolloServer.
  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    express.json(),
    cookieParser(),
    expressMiddleware(server, {
      context: async ({ res, req }): Promise<MyContext> => {
        const token = req.cookies.token;
        // TODO: Weird bug with how the types are received. See if can fix
        const typedRes = res as unknown as Response;
        const typedReq = req as unknown as Request;
        let userID = null;
        if (token) {
          try {
            const decoded = jwt.verify(token, env.SECRET) as unknown as string;
            userID = decoded;
          } catch (err) {
            console.log("Invalid token");
          }
        }
        return { res: typedRes, req: typedReq, userID, pubsub };
      },
    })
  );

  await database.connectToDatabase();

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}/graphql`);
  });
};

start();

// Handle authentication for websocket. Don't allow nonlogged in users to even connect
function handleAuth(request: http.IncomingMessage) {
  const cookiesHeader = request.headers["cookie"];
  if (!cookiesHeader) {
    throw new Error("401 Unauthorized");
  }
  let user = null;
  const { token } = parse(cookiesHeader);
  //TODO: Move this logic to utils or somewhere else
  if (token) {
    try {
      user = jwt.verify(token, env.SECRET) as unknown as string;
    } catch (err) {
      console.log("Invalid token");
    }
  } else {
    throw new Error("401 Unauthorized");
  }
  if (!user) {
    throw new Error("401 Unauthorized");
  }
  return user;
}
