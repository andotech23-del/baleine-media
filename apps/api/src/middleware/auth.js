import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { ApiError } from "./errorHandler.js";

export const authenticate = (roles = []) => (req, _res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return next(new ApiError(401, "Authentication required"));
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (roles.length > 0 && !roles.includes(payload.role)) {
      return next(new ApiError(403, "Insufficient role permissions"));
    }
    req.user = payload;
    return next();
  } catch (error) {
    return next(new ApiError(401, "Invalid token", { cause: error.message }));
  }
};
