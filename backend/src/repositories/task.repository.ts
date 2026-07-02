import { TaskModel, ITask } from "../models/task.model";
import { BaseRepository } from "./base.repository";
import { FilterQuery } from "mongoose";

export interface PaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class TaskRepository extends BaseRepository<ITask> {
  constructor() {
    super(TaskModel);
  }

  public async softDelete(id: string): Promise<ITask | null> {
    return this.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }

  public async findPaginatedTasks(
    filter: FilterQuery<ITask>,
    options: {
      page: number;
      limit: number;
      sort?: string;
      search?: string;
    }
  ): Promise<PaginatedResult<ITask>> {
    const { page, limit, sort, search } = options;
    const skip = (page - 1) * limit;

    // Construct search filter
    const finalFilter: FilterQuery<ITask> = { ...filter };
    if (search) {
      finalFilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Determine sorting format (Express standard -fieldName or fieldName)
    let parsedSort: any = { createdAt: -1 }; // Default sort
    if (sort) {
      const isDesc = sort.startsWith("-");
      const field = isDesc ? sort.substring(1) : sort;
      parsedSort = { [field]: isDesc ? -1 : 1 };
    }

    // Execute queries in parallel
    const [docs, totalDocs] = await Promise.all([
      this.find(finalFilter, {
        sort: parsedSort,
        skip,
        limit,
        populate: "createdBy",
      }),
      this.count(finalFilter),
    ]);

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}
