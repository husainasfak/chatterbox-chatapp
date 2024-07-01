import { InternalServerError } from "../helpers/api-error";
import { ErrorHandler } from "../helpers/ErrorHandler";
import prismaClient from "../services/db";
import { UserType } from "../types/user";

class User {
  async checkUserName(userName: string) {
    try {
      const user = await prismaClient.user.findFirst({
        where: {
          userName,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async createUser(userData: UserType) {
    const { userName, password, imageUrl } = userData;
    try {
      const user = await prismaClient.user.create({
        data: {
          userName,
          password,
          imageUrl,
        },
      });
      return user;
    } catch (err) {
      if (err instanceof Error) {
        throw new ErrorHandler(err.message, 500);
      }
    }
  }

  async finishUserCreation(
    userName: string,
    password: string,
    imageUrl: string
  ) {
    try {
      const user = await prismaClient.user.create({
        data: {
          userName,
          password: password,
          imageUrl: imageUrl,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async getAllUsers(searchString?: any) {
    console.log(searchString);
    try {
      const users = await prismaClient.user.findMany({
        where: searchString
          ? {
              OR: [{ userName: { contains: searchString } }],
            }
          : {},
      });
      return users;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }
}

export default User;
