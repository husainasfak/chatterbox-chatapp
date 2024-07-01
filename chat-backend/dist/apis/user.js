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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../services/user"));
const api_error_1 = require("../helpers/api-error");
const hash_1 = require("../utils/hash");
const TokenUtils_1 = require("../utils/TokenUtils");
const auth_1 = require("../Middleware/auth");
const router = express_1.default.Router();
const userService = new user_1.default();
router.get("/exist/:userName", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName } = req.params;
        const isUserExist = yield userService.checkUser(userName);
        if (isUserExist) {
            return res.json({
                success: true,
            });
        }
        return res.json({
            success: false,
        });
    }
    catch (err) {
        throw new api_error_1.InternalServerError("Internal server error");
    }
}));
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password, imageUrl } = req.body;
        const userData = { userName, imageUrl, password: "" };
        const encriptedPassword = yield (0, hash_1.hashPassword)(password);
        userData["password"] = encriptedPassword;
        const createUser = yield userService.createUser(userData);
        if (createUser) {
            const payload = {
                id: createUser.id,
                userName: createUser.userName,
                imageUrl: createUser.imageUrl,
            };
            const token = (0, TokenUtils_1.setToken)(res, payload);
            if (token) {
                return res.json({
                    success: true,
                    user: createUser,
                });
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new api_error_1.InternalServerError(error.message);
        }
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, password } = req.body;
        const isUserExist = yield userService.checkUser(userName);
        if (isUserExist) {
            const userHashedPass = isUserExist.password;
            const isMatched = yield (0, hash_1.comparePassword)(password, userHashedPass);
            if (isMatched) {
                const { password } = isUserExist, userWithoutPassword = __rest(isUserExist, ["password"]);
                const token = (0, TokenUtils_1.setToken)(res, userWithoutPassword);
                if (token) {
                    return res.json({
                        success: true,
                    });
                }
            }
            else {
                return res.json({
                    success: false,
                    message: "Password is incorrect.",
                });
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new api_error_1.InternalServerError(error.message);
        }
    }
}));
router.get("/check", auth_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user) {
            return res.json({
                success: true,
                user: req.user,
            });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            throw new api_error_1.InternalServerError(error.message);
        }
    }
}));
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchQuery = req.query.search;
        const users = yield userService.getAllUsers(searchQuery);
        if (users) {
            return res.json({
                success: true,
                users,
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
