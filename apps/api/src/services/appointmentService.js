import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import prisma from "../repositories/prismaClient.js";
import { appointmentSchema } from "@cordia/types";
import { reminderQueue } from "../jobs/queues.js";

export const listAppointments = async () => {
  return prisma.appointment.findMany({
    include: { patient: true, provider: true },
    orderBy: { startTime: "asc" }
  });
};

export const getAppointmentById = async (id) => {
  return prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, provider: true }
  });
};

export const createAppointment = async (data) => {
  const parsed = appointmentSchema.parse(data);
  const appointment = await prisma.appointment.create({
    data: {
      ...parsed,
      startTime: new Date(parsed.startTime),
      endTime: new Date(parsed.endTime)
    }
  });
  await scheduleReminders(appointment.id);
  return appointment;
};

export const updateAppointmentStatus = async (id, status) => {
  return prisma.appointment.update({ where: { id }, data: { status } });
};

export const scheduleReminders = async (appointmentId) => {
  const cadences = [7, 3, 1];
  await Promise.all(
    cadences.map((cadence) =>
      reminderQueue.add(`reminder-${appointmentId}-${cadence}-${uuid()}`, { appointmentId, cadence })
    )
  );
};

export const generateICS = (appointment) => {
  const start = dayjs(appointment.startTime).format("YYYYMMDDTHHmmss");
  const end = dayjs(appointment.endTime).format("YYYYMMDDTHHmmss");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${appointment.id}`,
    `DTSTAMP:${dayjs().format("YYYYMMDDTHHmmssZ")}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Appointment with ${appointment.patient?.firstName || "Patient"}`,
    `LOCATION:${appointment.location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\n");
};

export default {
  listAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentStatus,
  scheduleReminders,
  generateICS
};
