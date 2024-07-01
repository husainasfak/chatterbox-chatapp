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
const conversation_1 = __importDefault(require("../services/conversation"));
const router = express_1.default.Router();
const privateConService = new conversation_1.default();
router.get("/exist/:recipient", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user1Id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const user2Id = req.params.recipient;
    try {
        const conversation = yield privateConService.checkConversationExit(user1Id, user2Id);
        if (conversation) {
            return res.json({
                success: true,
                conversation,
            });
        }
        else {
            return res.json({
                success: false,
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new api_error_1.InternalServerError(error.message);
        }
    }
}));
router.post("/create/:recipient", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { message, filrUrl } = req.body;
        const initiatorId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.id;
        const recipientId = req.params.recipient;
        const conversation = yield privateConService.createPrivateConversation(initiatorId, recipientId, message, filrUrl);
        if (conversation) {
            return res.json({
                success: true,
                conversation,
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
        }
        if (error instanceof Error) {
            throw new api_error_1.InternalServerError(error.message);
        }
    }
}));
router.post("/accept", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId } = req.body;
        const accepted = yield privateConService.acceptPrivateConversation(conversationId);
        if (accepted) {
            return res.json({
                success: true,
            });
        }
        else {
            return res.json({
                success: false,
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
        }
        if (error instanceof Error) {
            throw new api_error_1.InternalServerError(error.message);
        }
    }
}));
exports.default = router;
