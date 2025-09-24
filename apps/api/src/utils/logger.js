import pino from "pino";
import { env } from "../config/env.js";

const redactPaths = env.logging.redactPII
  ? ["req.body.email", "req.body.phone", "patient.email", "patient.phone"]
  : [];

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: redactPaths
});

export default logger;
