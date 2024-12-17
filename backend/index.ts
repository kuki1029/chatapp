import express from "express";
import { ApolloServer } from "apollo-server-express";
import database from "./src/utils/db";
import { userTypeDefs } from "./src/graphql/schema/userSchema";
import { userResolvers } from "./src/graphql/resolvers/userResolver";
import cors from "cors";

var corsOptions = {
  origin: ["http://localhost:5173", "https://studio.apollographql.com"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const start = async () => {
  const app = express() as any;
  app.use(cors(corsOptions));

  const server = new ApolloServer({
    typeDefs: userTypeDefs,
    resolvers: userResolvers,
  });

  await server.start();
  server.applyMiddleware({ app });

  await database.connectToDatabase();

  app.listen({ port: 4000 }, () => {
    console.log("Apollo server is listening");
  });
};

start();
