import prisma from "../repositories/prismaClient.js";
import { patientSchema } from "@cordia/types";

export const listPatients = async () => {
  return prisma.patient.findMany({ orderBy: { lastName: "asc" } });
};

export const getPatient = async (id) => {
  return prisma.patient.findUnique({
    where: { id },
    include: { appointments: true, invoices: true, messages: true }
  });
};

export const createPatient = async (data) => {
  const parsed = patientSchema.parse(data);
  return prisma.patient.create({ data: { ...parsed, dateOfBirth: new Date(parsed.dateOfBirth) } });
};

export const updatePatient = async (id, data) => {
  const parsed = patientSchema.partial().parse(data);
  if (parsed.dateOfBirth) {
    parsed.dateOfBirth = new Date(parsed.dateOfBirth);
  }
  return prisma.patient.update({ where: { id }, data: parsed });
};

export default { listPatients, getPatient, createPatient, updatePatient };
