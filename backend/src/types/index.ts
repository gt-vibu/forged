import { Request } from "express";
import { UserRole } from "../constants/index";

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
  requestId?: string;
}
