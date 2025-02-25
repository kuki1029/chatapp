/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  mutation login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      email\n      name\n    }\n  }\n": types.LoginDocument,
    "\n  mutation signup($name: String!, $password: String!, $email: String!) {\n    signup(name: $name, password: $password, email: $email) {\n      name\n      email\n    }\n  }\n": types.SignupDocument,
    "\n  query isLoggedIn {\n    isLoggedIn\n  }\n": types.IsLoggedInDocument,
    "\n  query LoggedInAndUserID {\n    userID\n    isLoggedIn\n  }\n": types.LoggedInAndUserIdDocument,
    "\n  mutation logout {\n    logout\n  }\n": types.LogoutDocument,
    "\n  query userID {\n    userID\n  }\n": types.UserIdDocument,
    "\n  mutation CreateChatWithEmail($email: String) {\n    createChatWithEmail(email: $email) {\n      id\n      users {\n        id\n        name\n      }\n      lastMsg\n      lastMsgTime\n    }\n  }\n": types.CreateChatWithEmailDocument,
    "\n  mutation AddMessage($msg: MessageInput!) {\n    addMessage(msg: $msg) {\n      content\n      id\n      type\n    }\n  }\n": types.AddMessageDocument,
    "\n  query UserChats {\n    userChats {\n      id\n      users {\n        id\n        name\n        avatar\n      }\n      lastMsg\n      lastMsgTime\n    }\n  }\n": types.UserChatsDocument,
    "\n  query ChatMessages($chatID: String) {\n    chatMessages(chatID: $chatID) {\n      id\n      type\n      content\n      createdAt\n      senderID\n    }\n    currentChatInfo(chatID: $chatID) {\n      id\n      name\n      avatar\n    }\n  }\n": types.ChatMessagesDocument,
    "\n  subscription NewMessage($chatId: String) {\n    newMessage(chatID: $chatId) {\n      id\n      type\n      content\n      createdAt\n      senderID\n    }\n  }\n": types.NewMessageDocument,
    "\n  subscription NewUserChat {\n    newUserChat {\n      id\n      userID\n      lastMsg\n      lastMsgTime\n    }\n  }\n": types.NewUserChatDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      email\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation login($email: String!, $password: String!) {\n    login(email: $email, password: $password) {\n      email\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation signup($name: String!, $password: String!, $email: String!) {\n    signup(name: $name, password: $password, email: $email) {\n      name\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation signup($name: String!, $password: String!, $email: String!) {\n    signup(name: $name, password: $password, email: $email) {\n      name\n      email\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query isLoggedIn {\n    isLoggedIn\n  }\n"): (typeof documents)["\n  query isLoggedIn {\n    isLoggedIn\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query LoggedInAndUserID {\n    userID\n    isLoggedIn\n  }\n"): (typeof documents)["\n  query LoggedInAndUserID {\n    userID\n    isLoggedIn\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation logout {\n    logout\n  }\n"): (typeof documents)["\n  mutation logout {\n    logout\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query userID {\n    userID\n  }\n"): (typeof documents)["\n  query userID {\n    userID\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateChatWithEmail($email: String) {\n    createChatWithEmail(email: $email) {\n      id\n      users {\n        id\n        name\n      }\n      lastMsg\n      lastMsgTime\n    }\n  }\n"): (typeof documents)["\n  mutation CreateChatWithEmail($email: String) {\n    createChatWithEmail(email: $email) {\n      id\n      users {\n        id\n        name\n      }\n      lastMsg\n      lastMsgTime\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation AddMessage($msg: MessageInput!) {\n    addMessage(msg: $msg) {\n      content\n      id\n      type\n    }\n  }\n"): (typeof documents)["\n  mutation AddMessage($msg: MessageInput!) {\n    addMessage(msg: $msg) {\n      content\n      id\n      type\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query UserChats {\n    userChats {\n      id\n      users {\n        id\n        name\n        avatar\n      }\n      lastMsg\n      lastMsgTime\n    }\n  }\n"): (typeof documents)["\n  query UserChats {\n    userChats {\n      id\n      users {\n        id\n        name\n        avatar\n      }\n      lastMsg\n      lastMsgTime\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query ChatMessages($chatID: String) {\n    chatMessages(chatID: $chatID) {\n      id\n      type\n      content\n      createdAt\n      senderID\n    }\n    currentChatInfo(chatID: $chatID) {\n      id\n      name\n      avatar\n    }\n  }\n"): (typeof documents)["\n  query ChatMessages($chatID: String) {\n    chatMessages(chatID: $chatID) {\n      id\n      type\n      content\n      createdAt\n      senderID\n    }\n    currentChatInfo(chatID: $chatID) {\n      id\n      name\n      avatar\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription NewMessage($chatId: String) {\n    newMessage(chatID: $chatId) {\n      id\n      type\n      content\n      createdAt\n      senderID\n    }\n  }\n"): (typeof documents)["\n  subscription NewMessage($chatId: String) {\n    newMessage(chatID: $chatId) {\n      id\n      type\n      content\n      createdAt\n      senderID\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  subscription NewUserChat {\n    newUserChat {\n      id\n      userID\n      lastMsg\n      lastMsgTime\n    }\n  }\n"): (typeof documents)["\n  subscription NewUserChat {\n    newUserChat {\n      id\n      userID\n      lastMsg\n      lastMsgTime\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;