"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.statusCode = statusCode;
    }
}
exports.ErrorHandler = ErrorHandler;
const ErrorHandle = (err, req, res, next) => {
    err.message || (err.message = "Internal server error");
    err.statusCode || (err.statusCode = 500);
    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
exports.default = ErrorHandle;
