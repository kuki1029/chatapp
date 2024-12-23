import { gql } from "graphql-tag";

// TODO: check type of time if it works with everything
export const messageTypeDefs = gql`
  type ChatMessage {
    id: ID!
    type: MessageTypes!
    content: String!
    sender: ID!
    time: String!
  }

  type Message {
    type: MessageTypes!
    content: String!
    time: String!
  }

  enum MessageTypes {
    TEXT
    ATTACHMENT
  }

  type Chat {
    id: ID!
    membersID: [ID!]!

  }

  type Query {
    userChats(): [Chat!]!
    chatMessages(): [Message!]!
  }

  type Mutation {
    addMessage(content: Message!, type: MessageTypes!): Boolean
    createChat(withID: ID!): Boolean
  }
`;
