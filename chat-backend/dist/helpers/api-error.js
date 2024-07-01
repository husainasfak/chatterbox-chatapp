"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnAuthorised = exports.ValidationError = exports.BadRequestError = exports.InternalServerError = exports.AppError = exports.STATUS_CODES = void 0;
exports.STATUS_CODES = {
    OK: 200,
    BAD_REQUEST: 400,
    UN_AUTHORISED: 401,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
};
class AppError extends Error {
    constructor(name, statusCode, description, isOperational, errorStack, logingErrorResponse, success = false) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = name;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.errorStack = errorStack;
        this.logError = logingErrorResponse;
        this.success = success;
        Error.captureStackTrace(this);
    }
}
exports.AppError = AppError;
// API Specific Errors
class InternalServerError extends AppError {
    constructor(name, statusCode = exports.STATUS_CODES.INTERNAL_ERROR, description = "Internal Server Error", isOperational = true) {
        super(name, statusCode, description, isOperational);
    }
}
exports.InternalServerError = InternalServerError;
// 404
class BadRequestError extends AppError {
    constructor(description = "Not found", logingErrorResponse) {
        super("NOT FOUND", exports.STATUS_CODES.NOT_FOUND, description, true, false, logingErrorResponse);
    }
}
exports.BadRequestError = BadRequestError;
// 400
class ValidationError extends AppError {
    constructor(description = "Bad request", errorStack) {
        super("BAD REQUEST", exports.STATUS_CODES.BAD_REQUEST, description, true, errorStack);
    }
}
exports.ValidationError = ValidationError;
// 401
class UnAuthorised extends AppError {
    constructor(description = "Bad request", errorStack) {
        super("UnAuthorised", exports.STATUS_CODES.UN_AUTHORISED, description, true, errorStack);
    }
}
exports.UnAuthorised = UnAuthorised;
