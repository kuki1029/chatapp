import { Chat, ChatMember, User, ChatMessage } from "../../models/models";
import { Op } from "sequelize";
import db from "../../utils/db";
import {
  MessageTypes,
  Message,
  SubTypes,
  NewMessage,
  NewUserChat,
} from "../../../types";
import { MyContext } from "../../..";
import { withFilter } from "graphql-subscriptions";

//TODO: Split up into query and mutation files
export const messageResolvers = {
  MessageTypes: {
    TEXT: MessageTypes.TEXT,
    ATTACHMENT: MessageTypes.ATTACHMENT,
  },
  Query: {
    userChats: async (_: unknown, __: unknown, ctx: MyContext) => {
      const sequelize = db.sequelize;
      if (!ctx.userID) {
        return []; // TODO: Add auth middleware so this is never null when websockets
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
            )`), // No clear simple way to do this directly in sequelize to only get chats with this userID
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
    chatMessages: async (_: unknown, args: { chatID: string }) => {
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
    currentChatInfo: async (
      _: unknown,
      { chatID }: { chatID: string },
      ctx: MyContext
    ) => {
      if (!ctx.userID) {
        return []; //TODO: Remove when auth middleware added
      }
      const chat = await Chat.findByPk(parseInt(chatID), {
        include: [
          {
            model: ChatMember,
            include: [
              {
                model: User,
              },
            ],
          },
        ],
      });
      return chat?.dataValues.members
        .filter(
          (member: any) => member.dataValues.user.dataValues.id != ctx.userID
        )
        .map((member: any) => member.dataValues.user.dataValues);
    },
  },
  Mutation: {
    addMessage: async (
      _: unknown,
      { msg }: { msg: Message },
      ctx: MyContext
    ) => {
      if (!ctx.userID) {
        return {};
      }
      const createdMsg = await ChatMessage.create({
        ...msg,
        chatId: msg.chatID,
        userId: ctx.userID,
      });
      ctx.pubsub.publish(SubTypes.NEW_MESSAGE, {
        newMessage: {
          ...createdMsg.dataValues,
          senderID: ctx.userID,
          chatID: createdMsg.dataValues.chatId,
        },
      });
      ctx.pubsub.publish(SubTypes.NEW_USERCHAT, {
        newUserChat: {
          id: msg.chatID,
          userID: ctx.userID,
          lastMsg: createdMsg.dataValues.content,
          lastMsgTime: createdMsg.dataValues.createdAt,
        },
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
      try {
        const user = await User.findByPk(memberID);
        if (!user) {
          return null;
        }
        const newChat = await Chat.create();

        const members = [user.dataValues.id, parseInt(ctx.userID)];
        await newChat.addUsers(members, newChat.dataValues.id);

        return {
          id: newChat.dataValues.id,
          users: [user],
          lastMsg: null,
          lastMsgTime: null,
        };
      } catch (error) {
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
      //TODO: Add error handling middleware
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return null;
        }
        const newChat = await Chat.create();

        const members = [user.dataValues.id, parseInt(ctx.userID)];
        await newChat.addUsers(members, newChat.dataValues.id);

        return {
          id: newChat.dataValues.id,
          users: [user],
          lastMsg: null,
          lastMsgTime: null,
        };
      } catch (error) {
        console.log(error);
        return null;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_: unknown, __: any, ctx: any) => {
          //TODO: Change any type
          //TODO: add auth here to check if chat id is part of user
          return ctx.pubsub.asyncIterableIterator(SubTypes.NEW_MESSAGE);
        },
        (payload, variables, ctx) => {
          console.log(ctx);
          // We publish the data so we know what the type is
          const data = payload as NewMessage;
          console.log(variables.chatID);
          console.log(data.newMessage.chatID == variables.chatID);
          return data.newMessage.chatID == variables.chatID;
        }
      ),
    },
    newUserChat: {
      subscribe: withFilter(
        (_: unknown, args: { userID: string } | undefined, ctx: any) => {
          console.log("-----");

          console.log(args?.userID != ctx.userID);
          if (args?.userID != ctx.userID) {
            throw new Error("401 Unauthorized");
          }
          //TODO: Change any type
          return ctx.pubsub.asyncIterableIterator(SubTypes.NEW_USERCHAT);
        },
        (payload, variables, ctx) => {
          //TODO: Add types to ctx
          console.log("=========");
          console.log(variables?.userID != ctx.userID);
          if (variables?.userID != ctx.userID) {
            return false;
          }
          // We publish the data so we know what the type is
          const data = payload as NewUserChat;
          return data.newUserChat.userID == ctx.userID;
        }
      ),
    },
  },
};
