import { User } from "../../models/models";
import { UserDTO } from "../../../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response, Request } from "express";
import env from "../../utils/config";

interface MyContext {
  res: Response;
  req: Request;
  userID: string | null;
}

export const userResolvers = {
  Query: {
    isLoggedIn: async (_: unknown, __: unknown, ctx: MyContext) => {
      if (ctx.userID) {
        return true;
      }
      return false;
    },
    userID: async (_: unknown, __: unknown, ctx: MyContext) => {
      return ctx.userID;
    },
  },
  Mutation: {
    signup: async (
      _: unknown,
      args: { name: string; email: string; password: string },
      ctx: MyContext
    ) => {
      const existingUser = await User.findOne({ where: { email: args.email } });
      // User already exists in DB
      if (existingUser) {
        return null;
      }
      const hashedPass = await bcrypt.hash(args.password, 10);
      const user = await User.create({
        name: args.name,
        password: hashedPass,
        email: args.email,
      });
      const token = jwt.sign(user.dataValues.id.toString(), env.SECRET);
      ctx.res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access
        secure: env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "lax", // CSRF protection
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      const userDTO: UserDTO = {
        ...user.dataValues,
      };
      return userDTO;
    },
    login: async (
      _: unknown,
      args: { name: string; email: string; password: string },
      ctx: MyContext
    ) => {
      const user = await User.findOne({ where: { email: args.email } });
      if (!user) {
        return null;
      }
      const hashMatch = await bcrypt.compare(
        args.password,
        user.dataValues.password
      );
      if (!hashMatch) {
        return null;
      }
      const token = jwt.sign(user.dataValues.id.toString(), env.SECRET);
      ctx.res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access
        secure: env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "lax", // CSRF protection
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      const userDTO: UserDTO = {
        ...user.dataValues,
      };
      console.log("RETURNED");
      return userDTO;
    },
    logout: async (_: unknown, __: unknown, ctx: MyContext) => {
      try {
        ctx.res.clearCookie("token", {
          httpOnly: true,
          sameSite: "lax",
          secure: env.NODE_ENV === "production",
        });
        return true;
      } catch {
        return false;
      }
    },
  },
};
