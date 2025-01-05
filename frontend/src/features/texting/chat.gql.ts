import { gql } from '@apollo/client'

export const CREATE_CHAT_WITH_EMAIL = gql`
  mutation CreateChatWithEmail($email: String) {
    createChatWithEmail(email: $email) {
      id
      users {
        id
        name
      }
      lastMsg
      lastMsgTime
    }
  }
`

export const ADD_MESSAGE = gql`
  mutation AddMessage($msg: MessageInput!) {
    addMessage(msg: $msg) {
      content
      id
      type
    }
  }
`

export const GET_USER_CHATS = gql`
  query UserChats {
    userChats {
      id
      users {
        id
        name
        avatar
      }
      lastMsg
      lastMsgTime
    }
  }
`

export const GET_CHAT_MESSAGES_AND_USERS = gql`
  query ChatMessages($chatID: String) {
    chatMessages(chatID: $chatID) {
      id
      type
      content
      createdAt
      senderID
    }
    currentChatInfo(chatID: $chatID) {
      id
      name
      avatar
    }
  }
`

export const NEW_MESSAGE_SUB = gql`
  subscription NewMessage($chatId: String) {
    newMessage(chatID: $chatId) {
      id
      type
      content
      createdAt
      senderID
    }
  }
`

export const UPDATE_USER_CHAT = gql`
  subscription NewUserChat {
    newUserChat {
      id
      userID
      lastMsg
      lastMsgTime
    }
  }
`
