import { Chat, ChatMember, User, ChatMessage } from "../../models/models";
import { Op } from "sequelize";

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
      const chatMembers = await ChatMember.findAll({
        where: { userId: ctx.userID! },
        include: [
          {
            model: Chat,
            required: true,
          },
        ],
      });
      // Edge case where user has no chats
      if (chatMembers.length === 0) {
        return [];
      }
      if (!ctx.userID) {
        return;
      }
      const userId = ctx.userID;
      const user = await User.findByPk(parseInt(ctx.userID));
      const chats = chatMembers.map((chatMem) => {
        const chat = chatMem.dataValues.chat;
        return {
          id: chat.dataValues.id,
          membersID: chat.dataValues.membersIdList.filter(
            (_: any, index: Number) =>
              index !==
              chat.dataValues.membersIdList.findIndex(
                (el: Number) => el === parseInt(userId)
              )
          ),
          membersNames: chat.dataValues.membersNameList.filter(
            (_: any, index: Number) =>
              index !==
              chat.dataValues.membersNameList.findIndex(
                (el: String) => el === user?.dataValues.name
              )
          ),
        };
      });
      return chats;
    },
    chatMessages: async (_: unknown, args: { chatId: String }) => {
      const messages = await ChatMessage.findAll({
        where: { chatId: args.chatId },
      });
      const msgs = messages.map((msg) => {
        return {
          ...msg.dataValues,
          senderId: msg.dataValues.userId,
        };
      });
      return msgs;
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
      // TODO: Remove time requirement in schema or figure out format
      const createdMsg = await ChatMessage.create({
        type: type,
        content: msg.content,
        chatId: msg.chatId,
        userId: ctx.userID,
      });

      return {
        ...createdMsg.dataValues,
        senderId: createdMsg.dataValues.userId,
      };
    },
    createChat: async (
      _: unknown,
      args: { memberId: string | string[] },
      ctx: MyContext
    ) => {
      if (!ctx.userID) {
        return;
      }
      const membersID = [...args.memberId];

      const users = await User.findAll({
        where: {
          id: {
            [Op.in]: membersID, // Use Sequelize's Op.in operator
          },
        },
      });
      const membersNames = users.map((user) => user.dataValues.name);

      const mainUser = await User.findByPk(parseInt(ctx.userID));

      const chat = await Chat.create({
        membersIdList: membersID.concat(mainUser?.dataValues.id),
        membersNameList: membersNames.concat(mainUser?.dataValues.name),
      });

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
      return {
        id: chat.dataValues.id,
        membersID,
        membersNames,
        lastMsg: "",
        lastMsgTime: "",
      };
    },
    createChatWithEmail: async (
      _: unknown,
      args: { email: string },
      ctx: MyContext
    ) => {
      if (!ctx.userID) {
        return;
      }
      const user = await User.findOne({ where: { email: args.email } });
      if (!user) {
        return null;
      }
      const membersID = [user.dataValues.id];
      const users = await User.findAll({
        where: {
          id: {
            [Op.in]: membersID, // Use Sequelize's Op.in operator
          },
        },
      });

      const mainUser = await User.findByPk(parseInt(ctx.userID));

      const membersNames = users.map((user) => user.dataValues.name);
      const chat = await Chat.create({
        membersIdList: membersID.concat(mainUser?.dataValues.id),
        membersNameList: membersNames.concat(mainUser?.dataValues.name),
      });
      // Create chat member entries
      await ChatMember.create({
        chatId: chat.dataValues.id,
        userId: ctx.userID,
      });
      await ChatMember.create({
        chatId: chat.dataValues.id,
        userId: user.dataValues.id,
      });

      return {
        id: chat.dataValues.id,
        membersID,
        membersNames,
        lastMsg: "",
        lastMsgTime: "",
      };
    },
  },
};
