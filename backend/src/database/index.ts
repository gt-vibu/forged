import mongoose from "mongoose";
import { ENV } from "../config/env";
import { Logger } from "../config/logger";

export const connectDatabase = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI);
    Logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    Logger.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  Logger.error(`MongoDB connection error event: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  Logger.warn("MongoDB connection disconnected");
});
