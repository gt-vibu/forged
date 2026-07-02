import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/security";
import { UnauthorizedError, ForbiddenError } from "../utils/errors";
import { AuthenticatedRequest, UserPayload } from "../types/index";
import { UserRole } from "../constants/index";
import { Logger } from "../config/logger";

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token = "";

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    // 2. Check cookies if cookie-parser is used
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      Logger.warn(`[${req.requestId}] Authentication failed: No token provided`);
      throw new UnauthorizedError("Authentication token is missing");
    }

    const decoded = verifyToken(token) as UserPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    Logger.warn(`[${req.requestId}] Authentication failed: ${error.message}`);
    next(new UnauthorizedError("Invalid or expired authentication token"));
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    // SUPER_ADMIN has access to everything
    if (req.user.role === UserRole.SUPER_ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      Logger.warn(
        `[${req.requestId}] Authorization failed: User ${req.user.id} with role ${req.user.role} tried to access resource requiring [${allowedRoles.join(", ")}]`
      );
      return next(new ForbiddenError("You are not authorized to access this resource"));
    }

    next();
  };
};
