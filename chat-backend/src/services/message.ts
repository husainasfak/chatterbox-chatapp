import Message from "../db/message";
import { ErrorHandler } from "../helpers/ErrorHandler";
import { PrivateMessage } from "../types/types";

class MessageService {
  private MessageRepo: Message;
  constructor() {
    this.MessageRepo = new Message();
  }

  async sendMessage(messageData: PrivateMessage) {
    try {
      const message = await this.MessageRepo.sendMessage(messageData);
      return message;
    } catch (err) {
      if (err instanceof Error) {
        throw new ErrorHandler(err.message, 500);
      }
    }
  }
}

export default MessageService;
