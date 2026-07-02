import { z } from "zod";
import { UserRole } from "../constants/index";

export const registerSchema = z
  .object({
    name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters").trim(),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format")
      .toLowerCase()
      .trim(),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain at least one number",
      })
      .refine((val) => /[^A-Za-z0-9]/.test(val), {
        message: "Password must contain at least one special character",
      }),
    role: z.nativeEnum(UserRole).optional(),
  })
  .strict(); // Reject unknown fields

export const loginSchema = z
  .object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format")
      .toLowerCase()
      .trim(),
    password: z.string({ required_error: "Password is required" }),
  })
  .strict(); // Reject unknown fields
