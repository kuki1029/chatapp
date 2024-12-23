import { Model, DataTypes } from "sequelize";
import db from "../utils/db";

const sequelize = db.sequelize;

export class ChatMember extends Model {}

ChatMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "member",
  }
);
