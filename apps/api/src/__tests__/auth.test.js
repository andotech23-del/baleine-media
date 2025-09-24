import { jest } from "@jest/globals";
import request from "supertest";
import app from "../app.js";
import prisma from "../repositories/prismaClient.js";
import bcrypt from "bcrypt";

jest.mock("../repositories/prismaClient.js");

describe("Auth endpoints", () => {
  beforeEach(() => {
    prisma.staff.findUnique.mockReset();
  });

  it("issues JWT for valid staff credentials", async () => {
    const hashed = await bcrypt.hash("password123", 10);
    prisma.staff.findUnique.mockResolvedValue({
      id: "staff-1",
      email: "admin@cordia.test",
      firstName: "Avery",
      role: "ADMIN",
      password: hashed
    });

    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@cordia.test", password: "password123" })
      .expect(200);

    expect(response.body.token).toBeDefined();
    expect(response.body.user.email).toEqual("admin@cordia.test");
  });
});
