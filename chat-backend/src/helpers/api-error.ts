export const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORISED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

type StatusCode = (typeof STATUS_CODES)[keyof typeof STATUS_CODES];

export class AppError extends Error {
  public name: string;
  public statusCode?: StatusCode;
  public isOperational?: boolean;
  public errorStack?: boolean;
  public logError?: any; // Update this type as per your needs
  public success: boolean;
  constructor(
    name: string,
    statusCode: StatusCode,
    description: string,
    isOperational: boolean,
    errorStack?: boolean,
    logingErrorResponse?: any,
    success: boolean = false
  ) {
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

// API Specific Errors
export class InternalServerError extends AppError {
  constructor(
    name: string,
    statusCode: StatusCode = STATUS_CODES.INTERNAL_ERROR,
    description: string = "Internal Server Error",
    isOperational: boolean = true
  ) {
    super(name, statusCode, description, isOperational);
  }
}

// 404
export class BadRequestError extends AppError {
  constructor(description: string = "Not found", logingErrorResponse?: any) {
    super(
      "NOT FOUND",
      STATUS_CODES.NOT_FOUND,
      description,
      true,
      false,
      logingErrorResponse
    );
  }
}

// 400
export class ValidationError extends AppError {
  constructor(description: string = "Bad request", errorStack?: boolean) {
    super(
      "BAD REQUEST",
      STATUS_CODES.BAD_REQUEST,
      description,
      true,
      errorStack
    );
  }
}

// 401
export class UnAuthorised extends AppError {
  constructor(description: string = "Bad request", errorStack?: boolean) {
    super(
      "UnAuthorised",
      STATUS_CODES.UN_AUTHORISED,
      description,
      true,
      errorStack
    );
  }
}
