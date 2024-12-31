import { Chat, ChatMember, User, ChatMessage } from "../../models/models";
import { Op } from "sequelize";
import db from "../../utils/db";

export enum MessageTypes {
  TEXT = "TEXT",
  ATTACHMENT = "ATTACHMENT",
}

interface Message {
  type: MessageTypes;
  content: String;
  chatID: String;
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
      const sequelize = db.sequelize;
      if (!ctx.userID) {
        return []; // TODO: Add auth middleware so this is never null
      }
      const chatsWithAssociations = await Chat.findAll({
        include: [
          {
            model: ChatMember,
            include: [
              {
                model: User,
              },
            ],
          },
          {
            model: ChatMessage,
            separate: true,
            limit: 1,
            order: [["createdAt", "DESC"]],
          },
        ],
        where: {
          id: {
            [Op.in]: sequelize.literal(`(
              SELECT "chatId" FROM "members" WHERE "userId" = ${ctx.userID}
            )`), // No clear simple way to do this directly in sequelize
          },
        },
      });

      return chatsWithAssociations.map((chat) => {
        const { id, members, messages } = chat.dataValues;

        const users = members
          .map((member: any) => member.dataValues.user.dataValues)
          .filter((user: any) => user.id != ctx.userID);
        // This technically shouldn't be an array but sequelize returns array as we
        // use findAll
        const lastMsg = messages
          .map((msg: any) => msg.dataValues.content)
          .toString();
        const lastMsgTime = messages
          .map((msg: any) => msg.dataValues.createdAt)
          .toString();
        return {
          id,
          users,
          lastMsg,
          lastMsgTime,
        };
      });
    },
    chatMessages: async (_: unknown, args: { chatID: String }) => {
      const messages = await ChatMessage.findAll({
        where: { chatId: args.chatID },
      });
      return messages.map((msg) => {
        return {
          ...msg.dataValues,
          senderID: msg.dataValues.userId,
        };
      });
    },
  },
  Mutation: {
    addMessage: async (
      _: unknown,
      { msg }: { msg: Message },
      ctx: MyContext
    ) => {
      const createdMsg = await ChatMessage.create({
        ...msg,
        chatId: msg.chatID,
        userId: ctx.userID,
      });
      return {
        ...createdMsg.dataValues,
        senderID: createdMsg.dataValues.userId,
      };
    },
    createChat: async (
      _: unknown,
      args: { memberID: string },
      ctx: MyContext
    ) => {
      if (!ctx.userID) {
        return {}; //TODO: Remove with auth middleware
      }
      const membersID = [...args.memberID];

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
        users: [],
      });

      // Create chat member entries
      if (typeof args.memberID === "string") {
        await ChatMember.create({
          chatId: chat.dataValues.id,
          userId: ctx.userID,
        });
        await ChatMember.create({
          chatId: chat.dataValues.id,
          userId: args.memberID,
        });
      } else {
        // TODO: Add group chat reference
      }
      return {
        id: chat.dataValues.id,

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
