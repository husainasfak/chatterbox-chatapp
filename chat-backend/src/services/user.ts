import User from "../db/user";
import { ErrorHandler } from "../helpers/ErrorHandler";
import { UserType } from "../types/user";

class UserService {
  private userRepo: User;
  constructor() {
    this.userRepo = new User();
  }

  async checkUser(userName: string) {
    try {
      // check userName exist or not
      const isUserExist = await this.userRepo.checkUserName(userName);
      return isUserExist;
    } catch (err) {
      throw new ErrorHandler("Internal server error", 500);
    }
  }

  async createUser(userData: UserType) {
    try {
      const user = await this.userRepo.createUser(userData);
      return user;
    } catch (err) {
      if (err instanceof Error) {
        throw new ErrorHandler(err.message, 500);
      }
    }
  }

  async getAllUsers(searchString?: any) {
    try {
      const user = await this.userRepo.getAllUsers(searchString);
      return user;
    } catch (err) {
      if (err instanceof Error) {
        throw new ErrorHandler(err.message, 500);
      }
    }
  }
}

export default UserService;
