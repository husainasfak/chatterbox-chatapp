"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversation_1 = __importDefault(require("../db/conversation"));
const ErrorHandler_1 = require("../helpers/ErrorHandler");
class ConversationService {
    constructor() {
        this.conversationRepo = new conversation_1.default();
    }
    checkConversationExit(user1id, user2id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield this.conversationRepo.isPrivateConversationExist(user1id, user2id);
                return isExist;
            }
            catch (err) {
                if (err instanceof Error) {
                    throw new ErrorHandler_1.ErrorHandler(err.message, 500);
                }
            }
        });
    }
    createPrivateConversation(initiatorId, recipientId, message, fileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createPC = yield this.conversationRepo.createPrivateConversation(initiatorId, recipientId, message, fileUrl);
                return createPC;
            }
            catch (err) {
                if (err instanceof Error) {
                    console.log(err);
                }
                if (err instanceof Error) {
                    throw new ErrorHandler_1.ErrorHandler(err.message, 500);
                }
            }
        });
    }
    acceptPrivateConversation(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const acceptPC = yield this.conversationRepo.acceptConversatioon(conversationId);
                return acceptPC;
            }
            catch (err) {
                if (err instanceof Error) {
                    console.log(err);
                }
                if (err instanceof Error) {
                    throw new ErrorHandler_1.ErrorHandler(err.message, 500);
                }
            }
        });
    }
}
exports.default = ConversationService;
