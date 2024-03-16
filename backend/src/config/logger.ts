import winston from "winston";
import "winston-daily-rotate-file";
import dotenv from "dotenv";

dotenv.config();

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: "application-%DATE%.log",
    datePattern: "YYYY-MM-DD-HH",
    zippedArchive: true,
    maxFiles: "14d",
});

const transports =
    process.env.NODE_ENV === "production"
        ? [
              new winston.transports.File({
                  filename: "error.log",
                  level: "error",
              }),
              new winston.transports.File({
                  filename: "info.log",
                  level: "info",
              }),
              new winston.transports.File({
                  filename: "warning.log",
                  level: "warn",
              }),
              new winston.transports.File({ filename: "combined.log" }),
              fileRotateTransport,
          ]
        : [new winston.transports.Console()];

const { combine, errors, timestamp, json } = winston.format;

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(errors({ stack: true }), timestamp(), json()),
    defaultMeta: { service: "user-service" },
    transports: transports,
    exceptionHandlers: [
        new winston.transports.File({
            filename: "exceptions.log",
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: "rejection.log",
        }),
    ],
});

logger.exitOnError = false;

export default logger;
