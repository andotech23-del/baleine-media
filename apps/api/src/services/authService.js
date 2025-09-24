import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../repositories/prismaClient.js";
import { env } from "../config/env.js";
import { ApiError } from "../middleware/errorHandler.js";

export const authenticateUser = async ({ email, password }) => {
  const staff = await prisma.staff.findUnique({ where: { email } });
  if (!staff) {
    throw new ApiError(401, "Invalid credentials");
  }
  const valid = await bcrypt.compare(password, staff.password);
  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }
  const token = jwt.sign({ id: staff.id, role: staff.role, email: staff.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
  return { token, user: { id: staff.id, email: staff.email, role: staff.role, firstName: staff.firstName } };
};

export const issuePatientToken = (patient) => {
  const token = jwt.sign({ id: patient.id, role: "PATIENT", email: patient.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
  return token;
};

export default { authenticateUser, issuePatientToken };
