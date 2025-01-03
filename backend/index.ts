import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { createServer } from "http";
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
import jwt from "jsonwebtoken";
import env from "./src/utils/config";
import { PubSub } from "graphql-subscriptions";
import { NewMessage } from "./types";

export interface MyContext {
  res: Response;
  req: Request;
  userID: string | null;
  pubsub: PubSub<{
    NEW_MESSAGE: NewMessage;
  }>;
}

const start = async () => {
  const pubsub = new PubSub<{
    NEW_MESSAGE: NewMessage;
  }>();
  const corsOptions = {
    origin: ["http://localhost:5173", "https://studio.apollographql.com"],
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
      context: async () => {
        return { pubsub };
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
