import { RequestStatus } from "@prisma/client";
import { InternalServerError } from "../helpers/api-error";

import prismaClient from "../services/db";

class Conversation {
  async isPrivateConversationExist(user1id: string, user2id: string) {
    try {
      const isExist = await prismaClient.privateConversation.findFirst({
        where: {
          OR: [
            {
              initiatorId: user1id,
              recipientId: user2id,
            },
            {
              initiatorId: user2id,
              recipientId: user1id,
            },
          ],
        },
        include: {
          initiator: {
            select: {
              userName: true,
              imageUrl: true,
            },
          },
          recipient: {
            select: {
              userName: true,
              imageUrl: true,
            },
          },
          messages: {
            include: {
              sender: {
                select: {
                  userName: true,
                  imageUrl: true,
                  id: true,
                },
              },
              receiver: {
                select: {
                  userName: true,
                  imageUrl: true,
                  id: true,
                },
              },
            },
          },
          participants: true,
        },
      });
      return isExist;
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async createPrivateConversation(
    initiatorId: string,
    recipientId: string,
    message: string,
    fileUrl?: string
  ) {
    try {
      const con = await prismaClient.privateConversation.create({
        data: {
          initiatorId,
          recipientId,
          status: "PENDING",
          participants: {
            create: [
              {
                userId: initiatorId,
                hasSeenLatestMessage: true,
              },
              {
                userId: recipientId,
                hasSeenLatestMessage: false,
              },
            ],
          },

          messages: {
            create: [
              {
                content: message,
                senderId: initiatorId,
                receiverId: recipientId,
                ...(fileUrl && { fileUrl }),
              },
            ],
          },
        },
        include: {
          participants: true,
          messages: true,
        },
      });
      return con;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async acceptConversatioon(conversationId: string) {
    try {
      const accepted = await prismaClient.privateConversation.update({
        where: {
          id: conversationId,
        },
        data: {
          status: RequestStatus.ACCEPTED,
        },
      });
      return accepted;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
      }
      if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }
}

export default Conversation;
