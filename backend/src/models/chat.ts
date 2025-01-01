import { Model, DataTypes } from "sequelize";
import db from "../utils/db";
import { User, ChatMember } from "./models";

const sequelize = db.sequelize;

export class Chat extends Model {
  public addMember!: (user: User | number, options?: any) => Promise<void>;
  public addMembers!: (
    users: (User | number)[],
    options?: any
  ) => Promise<void>;

  public async addUsers(userID: number[], chatID: number): Promise<void> {
    try {
      const memberObj = userID.map((member) => ({
        chatId: chatID,
        userId: member,
      }));

      await ChatMember.bulkCreate(memberObj);
    } catch (error) {
      throw error;
    }
  }
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "chat",
  }
);
