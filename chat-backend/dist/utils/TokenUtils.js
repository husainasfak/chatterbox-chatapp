"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.setToken = void 0;
const jwt_1 = require("./jwt");
const setToken = (res, payload) => {
    const accessToken = (0, jwt_1.generateAccessToken)(payload);
    res.cookie("accessToken", accessToken);
    const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
    res.cookie("refreshToken", refreshToken);
    return accessToken;
};
exports.setToken = setToken;
const getToken = (req) => {
    const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];
    return { accessToken, refreshToken };
};
exports.getToken = getToken;
