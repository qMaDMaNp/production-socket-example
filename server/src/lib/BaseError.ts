import { ValidationError } from 'express-validator'

export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
};

export class ApiError extends Error {
  status: number;
  errors: ValidationError[];

  constructor(statusCode: number, message: string, errors: ValidationError[] = []) {
    super(message);
    this.status = statusCode;
    this.errors = errors;
  }

  static UnauthorizedError(message?: string): ApiError {
    return new ApiError(401, message || 'User is not authorized');
  }

  static BadRequest(message: string, errors: ValidationError[] = []): ApiError {
    return new ApiError(400, message, errors);
  }
};
