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
    membersIdList: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
    membersNameList: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "chat",
  }
);
