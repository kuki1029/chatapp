import dotenv from "dotenv";

dotenv.config();

export default {
  DATABASE: process.env.POSTGRES_DB,
  DB_URL: process.env.POSTGRES_DB_URL,
  DB_URL_PROD: process.env.POSTGRES_DB_URL_PROD,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.POSTGRES_PASSWORD,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET_KEY,
  NODE_ENV: process.env.NODE_ENV,
};
