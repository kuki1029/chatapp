export interface UserDTO {
  name: string;
  email: string;
  token: string;
}

export enum MessageTypes {
  TEXT = "TEXT",
  ATTACHMENT = "ATTACHMENT",
}

export enum SubTypes {
  NEW_MESSAGE = "NEW_MESSAGE",
  NEW_USERCHAT = "NEW_USERCHAT",
}

export interface Message {
  type: MessageTypes;
  content: string;
  chatID: string;
}

export interface NewMessage {
  newMessage: {
    id: string;
    chatID: string;
    content: string;
    createdAt: string;
    senderID: string;
    type: MessageTypes;
  };
}

export interface NewUserChat {
  newUserChat: {
    id: string;
    userID: string;
    lastMsg: string;
    lastMsgTime: string;
  };
}
