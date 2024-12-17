import express, { Response, Request } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import database from "./src/utils/db";
import { userTypeDefs } from "./src/graphql/schema/userSchema";
import { userResolvers } from "./src/graphql/resolvers/userResolver";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import env from "./src/utils/config";

var corsOptions = {
  origin: ["http://localhost:5173", "https://studio.apollographql.com"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true,
};
interface MyContext {
  res: Response;
  req: Request;
  userID: string | null;
}

const start = async () => {
  const app = express() as any;

  const server = new ApolloServer<MyContext>({
    typeDefs: userTypeDefs,
    resolvers: userResolvers,
  });

  await server.start();

  // TODO: Check if upto date spec with apollo 4
  app.use(
    "/graphql",
    cors(corsOptions),
    cookieParser(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ res, req }): Promise<MyContext> => {
        const token = req.cookies.token;
        // TODO: Weird bug with how the types are received. See if can fix
        const typedRes = res as unknown as Response;
        const typedReq = req as unknown as Request;
        let userID = null;

        if (token) {
          try {
            const decoded = jwt.verify(token, env.SECRET) as {
              id: string;
            };
            userID = decoded.id;
          } catch (err) {
            console.log("Invalid token");
          }
        }

        return { res: typedRes, req: typedReq, userID };
      },
    })
  );

  await database.connectToDatabase();

  app.listen({ port: 4000 }, () => {
    console.log("Apollo server is listening");
  });
};

start();
