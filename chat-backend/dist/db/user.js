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
const ErrorHandler_1 = require("../helpers/ErrorHandler");
const db_1 = __importDefault(require("../services/db"));
class User {
    checkUserName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.default.user.findFirst({
                    where: {
                        userName,
                    },
                });
                return user;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new api_error_1.InternalServerError(error.message);
                }
            }
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName, password, imageUrl } = userData;
            try {
                const user = yield db_1.default.user.create({
                    data: {
                        userName,
                        password,
                        imageUrl,
                    },
                });
                return user;
            }
            catch (err) {
                if (err instanceof Error) {
                    throw new ErrorHandler_1.ErrorHandler(err.message, 500);
                }
            }
        });
    }
    finishUserCreation(userName, password, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield db_1.default.user.create({
                    data: {
                        userName,
                        password: password,
                        imageUrl: imageUrl,
                    },
                });
                return user;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new api_error_1.InternalServerError(error.message);
                }
            }
        });
    }
    getAllUsers(searchString) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(searchString);
            try {
                const users = yield db_1.default.user.findMany({
                    where: searchString
                        ? {
                            OR: [{ userName: { contains: searchString } }],
                        }
                        : {},
                });
                return users;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new api_error_1.InternalServerError(error.message);
                }
            }
        });
    }
}
exports.default = User;
