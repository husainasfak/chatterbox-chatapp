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
const express_1 = __importDefault(require("express"));
const api_error_1 = require("../helpers/api-error");
const auth_1 = require("../Middleware/auth");
const message_1 = __importDefault(require("../services/message"));
const router = express_1.default.Router();
const privateMessage = new message_1.default();
router.post("/send/:recipient", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const receiverId = req.params.recipient;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { content, fileUrl, conversationId } = req.body;
        const data = {
            receiverId,
            senderId,
            content,
            fileUrl,
            conversationId,
        };
        const MessageSent = yield privateMessage.sendMessage(data);
        if (MessageSent) {
            return res.json({
                success: true,
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new api_error_1.InternalServerError(error.message);
        }
    }
}));
exports.default = router;
