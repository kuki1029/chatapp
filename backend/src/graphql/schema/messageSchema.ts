import { gql } from "graphql-tag";

export const messageTypeDefs = gql`
  type Message {
    id: ID!
    type: MessageTypes!
    content: String!
    createdAt: String!
    senderID: ID!
  }

  input MessageInput {
    type: MessageTypes!
    content: String!
    chatID: String!
  }

  enum MessageTypes {
    TEXT
    ATTACHMENT
  }

  type ChatUserInfo {
    id: ID!
    name: String!
    avatar: String
  }

  type Chat {
    id: ID!
    users: [ChatUserInfo!]!
    lastMsg: String
    lastMsgTime: String
  }

  type Query {
    userChats: [Chat!]!
    chatMessages(chatID: String): [Message!]!
    currentChatInfo(chatID: String): [ChatUserInfo!]!
  }

  type Mutation {
    addMessage(msg: MessageInput!): Message!
    createChat(memberID: ID!): Chat
    createChatWithEmail(email: String): Chat
  }
`;
