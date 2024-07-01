import express, { Request, Response } from "express";

import { InternalServerError } from "../helpers/api-error";

import { authMiddleware } from "../Middleware/auth";
import ConversationService from "../services/conversation";

const router = express.Router();

const privateConService = new ConversationService();

router.get(
  "/exist/:recipient",
  authMiddleware,
  async (req: Request, res: Response) => {
    const user1Id = req.user?.id;
    const user2Id = req.params.recipient;

    try {
      const conversation = await privateConService.checkConversationExit(
        user1Id,
        user2Id
      );
      if (conversation) {
        return res.json({
          success: true,
          conversation,
        });
      } else {
        return res.json({
          success: false,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }
);

router.post(
  "/create/:recipient",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { message, filrUrl } = req.body;
      const initiatorId = req.user?.id;
      const recipientId = req.params.recipient;
      const conversation = await privateConService.createPrivateConversation(
        initiatorId,
        recipientId,
        message,
        filrUrl
      );

      if (conversation) {
        return res.json({
          success: true,
          conversation,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }
);

router.post("/accept", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { conversationId } = req.body;

    const accepted = await privateConService.acceptPrivateConversation(
      conversationId
    );

    if (accepted) {
      return res.json({
        success: true,
      });
    } else {
      return res.json({
        success: false,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
    if (error instanceof Error) {
      throw new InternalServerError(error.message);
    }
  }
});

export default router;
