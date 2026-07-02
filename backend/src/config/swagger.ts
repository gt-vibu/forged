import swaggerJSDoc from "swagger-jsdoc";
import { ENV } from "./env";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TaskForge Pro API Documentation",
      version: "1.0.0",
      description: "Production-grade, highly secure enterprise Task Management API.",
    },
    servers: [
      {
        url: `http://localhost:${ENV.PORT}/api/v1`,
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: <token>",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
