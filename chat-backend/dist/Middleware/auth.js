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
exports.authMiddleware = void 0;
const TokenUtils_1 = require("../utils/TokenUtils");
const jwt_1 = require("../utils/jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken } = (0, TokenUtils_1.getToken)(req);
    if (!accessToken) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decodedData = yield (0, jwt_1.verifyToken)(accessToken);
        if (decodedData) {
            req.user = decodedData;
        }
        next();
    }
    catch (err) {
        console.log("[Access Token Error]", err);
        if (err instanceof jsonwebtoken_1.default.TokenExpiredError) {
            if (!refreshToken) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            try {
                console.log("Using rerfres token");
                const decodedRefresh = yield (0, jwt_1.verifyToken)(refreshToken);
                const payload = {
                    userName: decodedRefresh.userName,
                    id: decodedRefresh.id,
                    imageUrl: decodedRefresh.imageUrl,
                };
                const token = (0, TokenUtils_1.setToken)(res, payload);
                if (token) {
                    req.user = decodedRefresh;
                    next();
                }
            }
            catch (refreshErr) {
                console.log("[Refresh Token Error]", err);
                return res.status(401).json({ error: "Unauthorized" });
            }
        }
        else if (err instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
});
exports.authMiddleware = authMiddleware;
