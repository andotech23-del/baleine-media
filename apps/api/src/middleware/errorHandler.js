import { logger } from "../utils/logger.js";

export class ApiError extends Error {
  constructor(status, message, details = {}) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, "Resource not found"));
};

export const errorHandler = (err, req, res, _next) => {
  logger.error({ err, path: req.path }, "API error");
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || "Internal server error",
      details: err.details || {}
    }
  });
};
