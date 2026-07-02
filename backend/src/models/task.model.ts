import { Schema, model, Document, Types } from "mongoose";
import { TaskStatus, TaskPriority } from "../constants/index";

export interface ITask extends Document {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  createdBy: Types.ObjectId;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
      required: true,
      index: true,
    },
    dueDate: {
      type: Date,
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Mongoose Query Middleware to filter out soft-deleted items by default
taskSchema.pre(/^find/, function (this: any, next) {
  // Check if we explicitly want to include deleted items
  if (!this.getFilter().includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  } else {
    // Clean up the custom option so mongoose doesn't send it to the DB
    const filter = this.getFilter();
    delete filter.includeDeleted;
    this.setQuery(filter);
  }
  next();
});

// Count Documents middleware
taskSchema.pre("countDocuments", function (this: any, next) {
  if (!this.getFilter().includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  } else {
    const filter = this.getFilter();
    delete filter.includeDeleted;
    this.setQuery(filter);
  }
  next();
});

export const TaskModel = model<ITask>("Task", taskSchema);
