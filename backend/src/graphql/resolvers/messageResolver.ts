export enum MessageTypes {
  TEXT,
  ATTACHMENT,
}

export const messageResolvers = {
  MessageTypes: {
    TEXT: MessageTypes.TEXT,
    ATTACHMENT: MessageTypes.ATTACHMENT,
  },
};
