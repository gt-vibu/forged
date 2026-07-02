import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { ENV } from "./config/env";
import { swaggerSpec } from "./config/swagger";
import swaggerUi from "swagger-ui-express";
import { requestIdGenerator, requestLogger } from "./middlewares/requestLogger";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import { apiRateLimiter } from "./middlewares/rateLimiter";
import { authRoutes } from "./routes/auth.routes";
import { taskRoutes } from "./routes/task.routes";
import { sendSuccess } from "./utils/apiResponse";

const app: Application = express();

// 1. Trust proxy (needed for accurate rate limiting when behind NGINX or load balancers)
app.set("trust proxy", 1);

// 2. Request ID Generator and Logger
app.use(requestIdGenerator);
app.use(requestLogger);

// 3. Security Middlewares
app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// 4. Performance Middlewares
app.use(compression());

// 5. Body & Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 6. Global Rate Limiting (exclude doc routes if preferred, but good for APIs)
app.use("/api/v1", apiRateLimiter);

// 7. Health Check Endpoints (requested /health and /ready)
app.get("/health", (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED";
  sendSuccess({
    res,
    message: "Service health status is healthy",
    data: {
      status: "UP",
      database: dbStatus,
      uptime: process.uptime(),
      timestamp: new Date(),
    },
  });
});

app.get("/ready", (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState === 1;
  if (!dbStatus) {
    res.status(503).json({
      success: false,
      message: "Service is not ready - Database disconnected",
    });
    return;
  }
  sendSuccess({
    res,
    message: "Service is ready",
    data: {
      ready: true,
      timestamp: new Date(),
    },
  });
});

// 8. Swagger Documentation Router
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 9. API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// 10. 404 & Global Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
