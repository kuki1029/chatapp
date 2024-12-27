import { gql } from '@apollo/client'

export const CREATE_CHAT_WITH_EMAIL = gql`
  mutation CreateChatWithEmail($email: String) {
    createChatWithEmail(email: $email) {
      membersID
      id
    }
  }
`

export const ADD_MESSAGE = gql`
  mutation AddMessage($msg: MessageInput!) {
    addMessage(msg: $msg) {
      content
      id
      time
      type
    }
  }
`

export const GET_USER_CHATS = gql`
  query UserChats {
    userChats {
      id
      membersID
      membersNames
    }
  }
`

export const GET_CHAT_MESSAGES = gql`
  query ChatMessages($chatId: String) {
    chatMessages(chatId: $chatId) {
      id
      content
      time
      type
      senderId
    }
  }
`
