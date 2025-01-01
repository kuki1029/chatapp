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
      { memberID }: { memberID: string },
      ctx: MyContext
    ) => {
      if (!ctx.userID) {
        return;
      }
      // Need to be able to rollback when doing multiple transactions
      const transaction = await db.sequelize.transaction();
      try {
        const user = await User.findByPk(memberID, { transaction });
        if (!user) {
          return null;
        }

        const newChat = await Chat.create({}, { transaction });

        // TODO: Lift this logic to the model definition of adding chatmembers
        const members = [user.dataValues.id, parseInt(ctx.userID)];
        const memberObj = members.map((member) => ({
          chatId: newChat.dataValues.id,
          userId: member,
        }));

        const newMember = await ChatMember.bulkCreate(memberObj, {
          transaction,
        });

        await Promise.all(
          newMember.map(async (member) => {
            await newChat.addMember(member.dataValues.id, { transaction });
          })
        );

        await transaction.commit();
        return {
          id: newChat.dataValues.id,
          users: [user],
          lastMsg: null,
          lastMsgTime: null,
        };
      } catch (error) {
        await transaction.rollback();
        console.log(error);
        return null;
      }
    },
    createChatWithEmail: async (
      _: unknown,
      { email }: { email: string },
      ctx: MyContext
    ) => {
      if (!ctx.userID) {
        return;
      }
      // Need to be able to rollback when doing multiple transactions
      const transaction = await db.sequelize.transaction();
      try {
        const user = await User.findOne({ where: { email }, transaction });
        if (!user) {
          return null;
        }

        const newChat = await Chat.create({}, { transaction });

        // TODO: Lift this logic to the model definition of adding chatmembers
        const members = [user.dataValues.id, parseInt(ctx.userID)];
        const memberObj = members.map((member) => ({
          chatId: newChat.dataValues.id,
          userId: member,
        }));

        const newMember = await ChatMember.bulkCreate(memberObj, {
          transaction,
        });

        await Promise.all(
          newMember.map(async (member) => {
            await newChat.addMember(member.dataValues.id, { transaction });
          })
        );

        await transaction.commit();
        return {
          id: newChat.dataValues.id,
          users: [user],
          lastMsg: null,
          lastMsgTime: null,
        };
      } catch (error) {
        await transaction.rollback();
        console.log(error);
        return null;
      }
    },
  },
};
