import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { Logger } from "../config/logger";
import { ENV } from "../config/env";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): Response => {
  const timestamp = new Date().toISOString();
  const path = req.originalUrl;

  // Defaults
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any[] = [];

  // Log the error
  const reqId = (req as any).requestId ? `[${(req as any).requestId}] ` : "";
  Logger.error(`${reqId}Error occurred: ${err.message}`, {
    stack: err.stack,
    path,
  });

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.name === "ValidationError") {
    // Mongoose validation error
    statusCode = 422;
    message = "Database Validation Failed";
    errors = Object.values(err.errors).map((val: any) => ({
      field: val.path,
      message: val.message,
    }));
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = "Duplicate Resource Detected";
    const duplicateFields = Object.keys(err.keyValue);
    errors = duplicateFields.map((field) => ({
      field,
      message: `${field} must be unique`,
    }));
  }

  // Response payload
  const responsePayload: any = {
    success: false,
    message,
    errors,
    timestamp,
    path,
  };

  // Include stack trace only in development
  if (ENV.NODE_ENV === "development" && statusCode === 500) {
    responsePayload.stack = err.stack;
  }

  return res.status(statusCode).json(responsePayload);
};
