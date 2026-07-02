import { z } from "zod";
import { TaskStatus, TaskPriority } from "../constants/index";

export const createTaskSchema = z
  .object({
    title: z
      .string({ required_error: "Title is required" })
      .min(3, "Title must be at least 3 characters")
      .trim(),
    description: z
      .string({ required_error: "Description is required" })
      .min(5, "Description must be at least 5 characters")
      .trim(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z
      .string({ required_error: "Due date is required" })
      .datetime({ message: "Due date must be a valid ISO 8601 date string" })
      .transform((val) => new Date(val)),
  })
  .strict(); // Reject unknown fields

export const updateTaskSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").trim().optional(),
    description: z.string().min(5, "Description must be at least 5 characters").trim().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z
      .string()
      .datetime({ message: "Due date must be a valid ISO 8601 date string" })
      .transform((val) => new Date(val))
      .optional(),
  })
  .strict(); // Reject unknown fields

export const taskQuerySchema = z
  .object({
    page: z
      .string()
      .optional()
      .default("1")
      .transform((val) => {
        const num = parseInt(val, 10);
        return isNaN(num) || num < 1 ? 1 : num;
      }),
    limit: z
      .string()
      .optional()
      .default("10")
      .transform((val) => {
        const num = parseInt(val, 10);
        return isNaN(num) || num < 1 ? 10 : num;
      }),
    sort: z.string().optional(),
    search: z.string().optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    dueDate: z.string().optional(),
  })
  .strict(); // Reject unknown fields
