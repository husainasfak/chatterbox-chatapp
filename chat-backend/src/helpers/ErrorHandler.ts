import { Request, Response, NextFunction } from "express";

export class ErrorHandler extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const ErrorHandle = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message ||= "Internal server error";
  err.statusCode ||= 500;
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandle;
