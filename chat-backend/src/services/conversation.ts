import Conversation from "../db/conversation";

import { ErrorHandler } from "../helpers/ErrorHandler";

class ConversationService {
  private conversationRepo: Conversation;
  constructor() {
    this.conversationRepo = new Conversation();
  }

  async checkConversationExit(user1id: string, user2id: string) {
    try {
      const isExist = await this.conversationRepo.isPrivateConversationExist(
        user1id,
        user2id
      );
      return isExist;
    } catch (err) {
      if (err instanceof Error) {
        throw new ErrorHandler(err.message, 500);
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
      const createPC = await this.conversationRepo.createPrivateConversation(
        initiatorId,
        recipientId,
        message,
        fileUrl
      );
      return createPC;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
      if (err instanceof Error) {
        throw new ErrorHandler(err.message, 500);
      }
    }
  }

  async acceptPrivateConversation(conversationId: string) {
    try {
      const acceptPC = await this.conversationRepo.acceptConversatioon(
        conversationId
      );
      return acceptPC;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
      }
      if (err instanceof Error) {
        throw new ErrorHandler(err.message, 500);
      }
    }
  }
}

export default ConversationService;
