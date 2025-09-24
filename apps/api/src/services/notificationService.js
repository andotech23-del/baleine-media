import prisma from "../repositories/prismaClient.js";
import { reminderSettingsSchema } from "@cordia/types";

export const getSettings = async () => {
  await prisma.webhookEvent.findMany({ take: 0 });
  return {
    cadenceDays: [7, 3, 1],
    smsTemplate: "Reminder: {{patientName}} your visit is on {{appointmentDate}}",
    emailTemplate: "Hello {{patientName}}, this is a reminder for {{appointmentDate}}"
  };
};

export const updateSettings = async (data) => {
  const parsed = reminderSettingsSchema.parse(data);
  return { ...parsed };
};

export default { getSettings, updateSettings };
