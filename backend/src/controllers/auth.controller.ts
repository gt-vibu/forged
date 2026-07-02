import { Response } from "express";
import { AuthService } from "../services/auth.service";
import { sendSuccess } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../types/index";

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  public register = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    const user = await this.authService.register(name, email, password);

    sendSuccess({
      res,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      statusCode: 201, // 201 Created
    });
  });

  public login = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { token, user } = await this.authService.login(email, password);

    // Also set token in cookie for secure parser
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    sendSuccess({
      res,
      message: "Login successful",
      data: {
        token,
        user,
      },
    });
  });

  public getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    // Current user attached from authenticate() middleware
    const user = req.user;

    sendSuccess({
      res,
      message: "User profile retrieved successfully",
      data: { user },
    });
  });
}
