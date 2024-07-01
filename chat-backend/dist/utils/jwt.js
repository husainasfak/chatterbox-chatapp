"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretAccessToken = process.env.KEY;
const expiresIn = process.env.JWT_EXPIRES_IN || "1d";
const secretRefreshToken = process.env.KEY;
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, secretAccessToken, { expiresIn });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, secretRefreshToken, { expiresIn: "7d" });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secretAccessToken, (err, decoded) => {
            if (err) {
                return reject(err);
            }
            resolve(decoded);
        });
    });
};
exports.verifyToken = verifyToken;
