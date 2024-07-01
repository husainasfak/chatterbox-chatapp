import express, { Request, Response } from "express";
import UserService from "../services/user";
import { InternalServerError } from "../helpers/api-error";

import { UserType } from "../types/user";
import { comparePassword, hashPassword } from "../utils/hash";
import { setToken } from "../utils/TokenUtils";
import { P } from "pino";
import { authMiddleware } from "../Middleware/auth";

const router = express.Router();

const userService = new UserService();

router.get("/exist/:userName", async (req, res) => {
  try {
    const { userName } = req.params;

    const isUserExist = await userService.checkUser(userName);
    if (isUserExist) {
      return res.json({
        success: true,
      });
    }

    return res.json({
      success: false,
    });
  } catch (err) {
    throw new InternalServerError("Internal server error");
  }
});

router.post("/create", async (req, res) => {
  try {
    const { userName, password, imageUrl } = req.body;
    const userData: UserType = { userName, imageUrl, password: "" };

    const encriptedPassword = await hashPassword(password);
    userData["password"] = encriptedPassword;

    const createUser = await userService.createUser(userData);
    if (createUser) {
      const payload = {
        id: createUser.id,
        userName: createUser.userName,
        imageUrl: createUser.imageUrl,
      };
      const token = setToken(res, payload);
      if (token) {
        return res.json({
          success: true,
          user: createUser,
        });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new InternalServerError(error.message);
    }
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { userName, password } = req.body;

    const isUserExist = await userService.checkUser(userName);
    if (isUserExist) {
      const userHashedPass = isUserExist.password;

      const isMatched = await comparePassword(password, userHashedPass);

      if (isMatched) {
        const { password, ...userWithoutPassword } = isUserExist;
        const token = setToken(res, userWithoutPassword);
        if (token) {
          return res.json({
            success: true,
          });
        }
      } else {
        return res.json({
          success: false,
          message: "Password is incorrect.",
        });
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new InternalServerError(error.message);
    }
  }
});

router.get("/check", authMiddleware, async (req, res) => {
  try {
    if (req.user) {
      return res.json({
        success: true,
        user: req.user,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new InternalServerError(error.message);
    }
  }
});

router.get("/all", async (req: Request, res: Response) => {
  try {
    const searchQuery = req.query.search;
    const users = await userService.getAllUsers(searchQuery);
    if (users) {
      return res.json({
        success: true,
        users,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new InternalServerError(error.message);
    }
  }
});

export default router;
