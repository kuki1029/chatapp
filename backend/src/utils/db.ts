import { Sequelize } from "sequelize";
import env from "./config";

const sequelize = new Sequelize(
  `postgres://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}/${env.DATABASE}`
);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Successfully connected to database");
  } catch (err) {
    console.log(err);
    return process.exit(1);
  }
  return null;
};

export default {
  connectToDatabase,
  sequelize,
};
