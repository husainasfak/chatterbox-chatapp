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
const user_1 = __importDefault(require("../db/user"));
const ErrorHandler_1 = require("../helpers/ErrorHandler");
class UserService {
    constructor() {
        this.userRepo = new user_1.default();
    }
    checkUser(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check userName exist or not
                const isUserExist = yield this.userRepo.checkUserName(userName);
                return isUserExist;
            }
            catch (err) {
                throw new ErrorHandler_1.ErrorHandler("Internal server error", 500);
            }
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepo.createUser(userData);
                return user;
            }
            catch (err) {
                if (err instanceof Error) {
                    throw new ErrorHandler_1.ErrorHandler(err.message, 500);
                }
            }
        });
    }
    getAllUsers(searchString) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepo.getAllUsers(searchString);
                return user;
            }
            catch (err) {
                if (err instanceof Error) {
                    throw new ErrorHandler_1.ErrorHandler(err.message, 500);
                }
            }
        });
    }
}
exports.default = UserService;
