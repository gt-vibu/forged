import { Response, NextFunction, RequestHandler } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../utils/errors";

export const validate = (
  schema: ZodSchema,
  target: "body" | "query" | "params" = "body"
): RequestHandler => {
  return (req: any, res: Response, next: NextFunction): void => {
    try {
      const parsedData = schema.parse(req[target]);
      // Replace target data with parsed & sanitized data
      req[target] = parsedData;
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errorDetails = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return next(new ValidationError("Request validation failed", errorDetails));
      }
      next(error);
    }
  };
};
