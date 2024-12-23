import { Model, DataTypes } from "sequelize";
import db from "../utils/db";

const sequelize = db.sequelize;

export class Chat extends Model {}

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
