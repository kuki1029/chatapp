import { Chat, ChatMember, User, ChatMessage } from "../../models/models";

export enum MessageTypes {
  TEXT = "TEXT",
  ATTACHMENT = "ATTACHMENT",
}

interface Message {
  type: MessageTypes;
  content: String;
  time: String;
  chatId: String;
}

interface MyContext {
  res: Response;
  req: Request;
  userID: string | null;
}

export const messageResolvers = {
  MessageTypes: {
    TEXT: MessageTypes.TEXT,
    ATTACHMENT: MessageTypes.ATTACHMENT,
  },
  Query: {
    userChats: async (_: unknown, __: unknown, ctx: MyContext) => {
      console.log("AAAA");
      const chatMembers = await ChatMember.findAll({
        where: { userId: ctx.userID! },
        include: [
          {
            model: Chat,
            required: true,
          },
        ],
      });
      console.log(chatMembers);
      if (chatMembers.length === 0) {
        return [];
      }
      const chats = chatMembers.map((chatMem) => {
        const chat = chatMem.dataValues.chat;
        return {
          id: chat.dataValues.id,
          membersID: chat.dataValues.membersList,
        };
      });
      return chats;
    },
    chatMessages: async (_: unknown, args: { chatId: String }) => {
      const messages = await ChatMessage.findAll({
        where: { chatId: args.chatId },
      });
      console.log(messages);
      return messages;
    },
  },
  Mutation: {
    addMessage: async (_: unknown, args: { msg: Message }, ctx: MyContext) => {
      const { msg } = args;
      let type = "ATTACHMENT";
      if (msg.type === MessageTypes.TEXT) {
        type = "TEXT";
      }
      // const msg: Message = args; TODO: look at simplifying this.
      const createdMsg = await ChatMessage.create({
        type: type,
        content: msg.content,
        time: msg.time,
        chatId: msg.chatId,
        userId: ctx.userID,
      });
      return createdMsg;
    },
    createChat: async (
      _: unknown,
      args: { memberId: string | string[] },
      ctx: MyContext
    ) => {
      const membersID = [ctx.userID, args.memberId];

      const chat = await Chat.create({ membersList: membersID });
      console.log(chat.dataValues);
      // Create chat member entries
      if (typeof args.memberId === "string") {
        await ChatMember.create({
          chatId: chat.dataValues.id,
          userId: ctx.userID,
        });
        await ChatMember.create({
          chatId: chat.dataValues.id,
          userId: args.memberId,
        });
      } else {
        // TODO: Add group chat reference
      }
      return { id: chat.dataValues.id, membersID };
    },
    createChatWithEmail: async (
      _: unknown,
      args: { email: string },
      ctx: MyContext
    ) => {
      const user = await User.findOne({ where: { email: args.email } });
      if (!user) {
        return null;
      }
      const membersID = [ctx.userID, user.dataValues.id];
      const chat = await Chat.create({ membersList: membersID });
      // Create chat member entries
      await ChatMember.create({
        chatId: chat.dataValues.id,
        userId: ctx.userID,
      });
      await ChatMember.create({
        chatId: chat.dataValues.id,
        userId: user.dataValues.id,
      });

      return { id: chat.dataValues.id, membersID };
    },
  },
};
