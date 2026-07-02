import { Response } from "express";
import { TaskService } from "../services/task.service";
import { sendSuccess } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../types/index";

export class TaskController {
  constructor(private readonly taskService = new TaskService()) {}

  public createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { title, description, status, priority, dueDate } = req.body;
    const createdBy = req.user!.id; // from authenticate middleware

    const task = await this.taskService.createTask({
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy,
    });

    sendSuccess({
      res,
      message: "Task created successfully",
      data: task,
      statusCode: 201,
    });
  });

  public getTaskById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    const task = await this.taskService.getTaskById(id);

    sendSuccess({
      res,
      message: "Task retrieved successfully",
      data: task,
    });
  });

  public updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;

    const task = await this.taskService.updateTask(id, updateData);

    sendSuccess({
      res,
      message: "Task updated successfully",
      data: task,
    });
  });

  public deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { id } = req.params;

    await this.taskService.deleteTask(id);

    sendSuccess({
      res,
      message: "Task deleted successfully",
    });
  });

  public getTasks = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const { page, limit, sort, search, status, priority, dueDate } = req.query as any;

    const result = await this.taskService.getTasks(
      { status, priority, dueDate },
      { page, limit, sort, search }
    );

    sendSuccess({
      res,
      message: "Tasks retrieved successfully",
      data: result.docs,
      meta: {
        totalDocs: result.totalDocs,
        limit: result.limit,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
    });
  });
}
