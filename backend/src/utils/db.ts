import { Sequelize } from "sequelize";
import env from "./config";

const sequelize = new Sequelize(env.DB_URL!, {
  host: "localhost",
  dialect: "postgres",
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connected to database");
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
