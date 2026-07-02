import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/taskforge",
  JWT_SECRET: process.env.JWT_SECRET || "development_secret_key_taskforge_pro_2026",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  NODE_ENV: process.env.NODE_ENV || "development"
};
