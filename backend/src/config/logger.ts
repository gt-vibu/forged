import winston from "winston";
import path from "path";
import fs from "fs";

// Create logs directory if it doesn't exist
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
  )
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

const transports = [
  // Console logging
  new winston.transports.Console({
    format: consoleFormat,
  }),
  // Error log file
  new winston.transports.File({
    filename: path.join(logDir, "error.log"),
    level: "error",
    format,
  }),
  // Warning log file
  new winston.transports.File({
    filename: path.join(logDir, "warn.log"),
    level: "warn",
    format,
  }),
  // Info/Combined log file
  new winston.transports.File({
    filename: path.join(logDir, "combined.log"),
    format,
  }),
];

export const Logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  levels,
  transports,
});
