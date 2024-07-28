"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const express_2 = require("uploadthing/express");
const FileUpload_1 = require("../services/FileUpload");
router.use("/uploadthing", (0, express_2.createRouteHandler)({
    router: FileUpload_1.uploadRouter,
}));
exports.default = router;
