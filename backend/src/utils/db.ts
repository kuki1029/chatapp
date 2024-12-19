import { Sequelize } from "sequelize";
import env from "./config";

let DB_URL = "";
if (env.NODE_ENV === "production") {
  DB_URL = env.DB_URL_PROD!;
} else {
  DB_URL = env.DB_URL!;
}

const sequelize = new Sequelize(DB_URL, {
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
