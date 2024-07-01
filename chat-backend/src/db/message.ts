import { InternalServerError } from "../helpers/api-error";

import prismaClient from "../services/db";
import { PrivateMessage } from "../types/types";

class Message {
  async sendMessage(data: PrivateMessage) {
    const { content, fileUrl, conversationId, senderId, receiverId } = data;
    try {
      const message = await prismaClient.privateMessage.create({
        data: {
          content,
          fileUrl,
          conversationId,
          senderId,
          receiverId,
        },
      });
      return message;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }
}

export default Message;
