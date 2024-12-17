import { User } from "../../models/user";
import { UserDTO } from "../../../types";
import bcrypt from "bcrypt";

export const userResolvers = {
  Query: {
    allUsers: async () => {
      const users = await User.findAll({ raw: true });
      console.log(users);
      return users;
    },
  },
  Mutation: {
    signup: async (
      _: unknown,
      args: { name: string; email: string; password: string }
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
      const userDTO: UserDTO = {
        ...user.dataValues,
      };
      return userDTO;
    },
    login: async (
      _: unknown,
      args: { name: string; email: string; password: string }
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
      const userDTO: UserDTO = {
        ...user.dataValues,
      };
      return userDTO;
    },
  },
};
