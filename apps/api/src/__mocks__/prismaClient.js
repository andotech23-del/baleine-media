import { jest } from "@jest/globals";

const mockPrisma = {
  staff: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    upsert: jest.fn()
  },
  patient: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    upsert: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  appointment: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  invoice: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn()
  },
  message: {
    create: jest.fn(),
    findMany: jest.fn()
  },
  payment: {
    create: jest.fn()
  },
  soapNote: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn()
  },
  webhookEvent: {
    findMany: jest.fn(),
    update: jest.fn()
  }
};

export const prisma = mockPrisma;
export default mockPrisma;
