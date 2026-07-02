import { Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { AuthenticatedRequest } from "../types/index";
import { Logger } from "../config/logger";

export const requestIdGenerator = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const requestId = (req.headers["x-request-id"] as string) || uuidv4();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
};

export const requestLogger = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();

  // Log request arrival
  Logger.info(
    `[${req.requestId}] Incoming ${req.method} ${req.originalUrl} from ${req.ip}`
  );

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    Logger.info(
      `[${req.requestId}] Completed ${req.method} ${req.originalUrl} - Status: ${res.statusCode} in ${duration}ms`
    );
  });

  next();
};
