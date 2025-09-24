import prisma from "../repositories/prismaClient.js";
import { handleStripeWebhook } from "./billingService.js";

const handlers = {
  STRIPE: handleStripeWebhook
};

export const processWebhookEvent = async (event) => {
  const handler = handlers[event.provider];
  if (!handler) return;
  await prisma.webhookEvent.update({ where: { id: event.id }, data: { status: "PROCESSING" } });
  try {
    await handler(event.payload);
    await prisma.webhookEvent.update({ where: { id: event.id }, data: { status: "SUCCESS" } });
  } catch (error) {
    await prisma.webhookEvent.update({
      where: { id: event.id },
      data: { status: "FAILED", retryCount: { increment: 1 } }
    });
    throw error;
  }
};

export default { processWebhookEvent };
