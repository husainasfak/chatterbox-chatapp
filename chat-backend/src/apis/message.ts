import express, { Request, Response } from "express";

import { InternalServerError } from "../helpers/api-error";

import { authMiddleware } from "../Middleware/auth";

import MessageService from "../services/message";
import { json } from "stream/consumers";

const router = express.Router();

const privateMessage = new MessageService();

router.post(
  "/send/:recipient",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const receiverId: string = req.params.recipient;
      const senderId: string = req.user?.id;
      const { content, fileUrl, conversationId } = req.body;
      const data = {
        receiverId,
        senderId,
        content,
        fileUrl,
        conversationId,
      };
      const MessageSent = await privateMessage.sendMessage(data);
      if (MessageSent) {
        return res.json({
          success: true,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }
);

export default router;
