import dayjs from "dayjs";
import prisma from "../repositories/prismaClient.js";
import { sendReminderMessage } from "../services/messagingService.js";

export const reminderProcessor = async (job) => {
  const { appointmentId, cadence } = job.data;
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    include: { patient: true, provider: true }
  });
  if (!appointment) {
    return;
  }
  const sendAt = dayjs(appointment.startTime).subtract(cadence, "day").toDate();
  if (sendAt > new Date()) {
    await job.moveToDelayed(sendAt.getTime());
    return;
  }
  await sendReminderMessage({ appointment, cadence });
};

export default reminderProcessor;
