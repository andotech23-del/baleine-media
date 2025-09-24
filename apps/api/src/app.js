import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import apiRateLimiter from "./middleware/rateLimiter.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import auditLogger from "./middleware/auditLogger.js";
import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import appointmentRoutes from "./routes/appointments.js";
import messageRoutes from "./routes/messages.js";
import billingRoutes from "./routes/billing.js";
import scribeRoutes from "./routes/scribe.js";
import dashboardRoutes from "./routes/dashboard.js";
import notificationRoutes from "./routes/notifications.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
app.use(apiRateLimiter);
app.use(auditLogger);

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/scribe", scribeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
