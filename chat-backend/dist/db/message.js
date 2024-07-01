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
const api_error_1 = require("../helpers/api-error");
const db_1 = __importDefault(require("../services/db"));
class Message {
    sendMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content, fileUrl, conversationId, senderId, receiverId } = data;
            try {
                const message = yield db_1.default.privateMessage.create({
                    data: {
                        content,
                        fileUrl,
                        conversationId,
                        senderId,
                        receiverId,
                    },
                });
                return message;
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
                if (error instanceof Error) {
                    throw new api_error_1.InternalServerError(error.message);
                }
            }
        });
    }
}
exports.default = Message;
