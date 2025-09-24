import prisma from "../repositories/prismaClient.js";
import { logger } from "../utils/logger.js";

const reminderSmsTemplate = ({ appointment, cadence }) =>
  `Reminder: ${appointment.patient.firstName}, you have an appointment on ${new Date(
    appointment.startTime
  ).toLocaleString()}. Reply CONFIRM to keep or RESCHEDULE.`;

const reminderEmailTemplate = ({ appointment }) => `Hi ${appointment.patient.firstName},\n\nThis is a reminder for your appointment with ${appointment.provider.firstName} on ${new Date(appointment.startTime).toLocaleString()}.`;

export const sendReminderMessage = async ({ appointment, cadence }) => {
  const body = reminderSmsTemplate({ appointment, cadence });
  await prisma.message.create({
    data: {
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      channel: "SMS",
      direction: "OUTBOUND",
      body,
      status: "SENT"
    }
  });
  logger.info({ appointmentId: appointment.id, cadence }, "Sent SMS reminder (stub)");
  await prisma.message.create({
    data: {
      patientId: appointment.patientId,
      appointmentId: appointment.id,
      channel: "EMAIL",
      direction: "OUTBOUND",
      body: reminderEmailTemplate({ appointment }),
      status: "SENT"
    }
  });
};

export const sendDunningMessage = async ({ invoice, attempt }) => {
  const body = `Invoice ${invoice.id} is overdue. Attempt ${attempt + 1}. Please pay $${invoice.amount}.`;
  await prisma.message.create({
    data: {
      patientId: invoice.patientId,
      channel: "EMAIL",
      direction: "OUTBOUND",
      body,
      status: "SENT"
    }
  });
  logger.info({ invoiceId: invoice.id, attempt }, "Sent dunning email (stub)");
};

export const recordInboundMessage = async ({ patientId, body, channel }) => {
  return prisma.message.create({
    data: {
      patientId,
      channel,
      direction: "INBOUND",
      body,
      status: "RECEIVED"
    }
  });
};

export const processPatientReply = async ({ appointmentId, patientId, body }) => {
  const normalized = body.trim().toLowerCase();
  let status = "SCHEDULED";
  if (normalized === "confirm") {
    status = "CONFIRMED";
  } else if (normalized === "reschedule") {
    status = "CANCELLED";
  }
  if (normalized === "stop") {
    return { status: "OPT_OUT" };
  }
  const appointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status }
  });
  await recordInboundMessage({ patientId, body, channel: "SMS" });
  return appointment;
};

export default { sendReminderMessage, sendDunningMessage, recordInboundMessage, processPatientReply };
