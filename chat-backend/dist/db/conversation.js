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
const client_1 = require("@prisma/client");
const api_error_1 = require("../helpers/api-error");
const db_1 = __importDefault(require("../services/db"));
class Conversation {
    isPrivateConversationExist(user1id, user2id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const isExist = yield db_1.default.privateConversation.findFirst({
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
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new api_error_1.InternalServerError(error.message);
                }
            }
        });
    }
    createPrivateConversation(initiatorId, recipientId, message, fileUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const con = yield db_1.default.privateConversation.create({
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
                                Object.assign({ content: message, senderId: initiatorId, receiverId: recipientId }, (fileUrl && { fileUrl })),
                            ],
                        },
                    },
                    include: {
                        participants: true,
                        messages: true,
                    },
                });
                return con;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                }
                if (error instanceof Error) {
                    throw new api_error_1.InternalServerError(error.message);
                }
            }
        });
    }
    acceptConversatioon(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const accepted = yield db_1.default.privateConversation.update({
                    where: {
                        id: conversationId,
                    },
                    data: {
                        status: client_1.RequestStatus.ACCEPTED,
                    },
                });
                return accepted;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error);
                }
                if (error instanceof Error) {
                    throw new api_error_1.InternalServerError(error.message);
                }
            }
        });
    }
}
exports.default = Conversation;
