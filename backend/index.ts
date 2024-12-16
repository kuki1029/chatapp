import express from "express";
import { ApolloServer } from "apollo-server-express";
import database from "./utils/db";
import { userTypeDefs } from "./graphql/schema/userSchema";
import { userResolvers } from "./graphql/resolvers/userResolver";

const start = async () => {
  const app = express() as any;

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
