import { TaskRepository, PaginatedResult } from "../repositories/task.repository";
import { ITask } from "../models/task.model";
import { NotFoundError } from "../utils/errors";
import { TaskStatus, TaskPriority } from "../constants/index";

export class TaskService {
  constructor(private readonly taskRepository = new TaskRepository()) {}

  public async createTask(taskData: {
    title: string;
    description: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    dueDate: Date;
    createdBy: string;
  }): Promise<ITask> {
    return this.taskRepository.create(taskData);
  }

  public async getTaskById(id: string): Promise<ITask> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError("Task not found");
    }
    return task;
  }

  public async updateTask(
    id: string,
    updateData: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: Date;
    }
  ): Promise<ITask> {
    const task = await this.taskRepository.update(id, updateData);
    if (!task) {
      throw new NotFoundError("Task not found");
    }
    return task;
  }

  public async deleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.softDelete(id);
    if (!task) {
      throw new NotFoundError("Task not found");
    }
  }

  public async getTasks(
    filters: {
      status?: TaskStatus;
      priority?: TaskPriority;
      dueDate?: string;
    },
    pagination: {
      page: number;
      limit: number;
      sort?: string;
      search?: string;
    }
  ): Promise<PaginatedResult<ITask>> {
    const queryFilter: any = {};

    if (filters.status) {
      queryFilter.status = filters.status;
    }
    if (filters.priority) {
      queryFilter.priority = filters.priority;
    }
    if (filters.dueDate) {
      const parsedDate = new Date(filters.dueDate);
      if (!isNaN(parsedDate.getTime())) {
        // Find tasks due on this day (from start of day to end of day)
        const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));
        queryFilter.dueDate = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    return this.taskRepository.findPaginatedTasks(queryFilter, pagination);
  }
}
