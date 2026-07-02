import app from "./app";
import { ENV } from "./config/env";
import { connectDatabase } from "./database/index";
import { seedSuperAdmin } from "./seed/index";
import { Logger } from "./config/logger";
import http from "http";
import mongoose from "mongoose";

let server: http.Server;

// Handle Uncaught Exceptions
process.on("uncaughtException", (error: Error) => {
  Logger.error(`UNCAUGHT EXCEPTION! Shutting down... Reason: ${error.message}`);
  Logger.error(error.stack || "");
  process.exit(1);
});

const startServer = async () => {
  // 1. Connect to Database
  await connectDatabase();

  // 2. Run Database Seeding
  await seedSuperAdmin();

  // 3. Start Server
  server = app.listen(ENV.PORT, () => {
    Logger.info(
      `====================================================`
    );
    Logger.info(
      `  TaskForge Pro Backend running in [${ENV.NODE_ENV}] mode`
    );
    Logger.info(`  Local URL: http://localhost:${ENV.PORT}`)
    Logger.info(`  Docs URL:  http://localhost:${ENV.PORT}/api/docs`)
    Logger.info(
      `====================================================`
    );
  });

  // Handle Unhandled Promise Rejections
  process.on("unhandledRejection", (reason: any) => {
    Logger.error(`UNHANDLED REJECTION! Shutting down... Reason: ${reason}`);
    if (server) {
      server.close(() => {
        Logger.info("HTTP server closed.");
        mongoose.connection.close().then(() => {
          Logger.info("Database connection closed.");
          process.exit(1);
        });
      });
    } else {
      process.exit(1);
    }
  });
};

startServer();

// Graceful Shutdown Handler
const gracefulShutdown = (signal: string) => {
  Logger.warn(`${signal} received. Initiating graceful shutdown...`);

  if (server) {
    server.close(() => {
      Logger.info("HTTP server closed.");
      mongoose.connection.close().then(() => {
        Logger.info("Database connection closed.");
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
