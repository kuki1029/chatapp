import { gql } from "graphql-tag";

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    password: String!
    email: String!
  }

  type UserDTO {
    name: String!
    email: String!
    token: String!
  }

  type Query {
    allUsers: [User!]!
    isLoggedIn: Boolean!
    userID: String
  }

  type Mutation {
    signup(name: String!, password: String!, email: String!): UserDTO
    login(email: String!, password: String!): UserDTO
    logout: Boolean
  }
`;
