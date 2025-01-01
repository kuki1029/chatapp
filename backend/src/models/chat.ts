import { Model, DataTypes } from "sequelize";
import db from "../utils/db";
import { User } from "./models";

const sequelize = db.sequelize;

// TODO: Think about adding types here
export class Chat extends Model {
  public addMember!: (user: User | number, options?: any) => Promise<void>;
  public addMembers!: (
    users: (User | number)[],
    options?: any
  ) => Promise<void>;
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
