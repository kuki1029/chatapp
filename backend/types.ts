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
}

export interface Message {
  type: MessageTypes;
  content: String;
  chatID: String;
}

export interface NewMessage {
  newMessage: {
    id: String;
    content: string;
    createdAt: string;
    senderID: string;
    type: MessageTypes;
  };
}
