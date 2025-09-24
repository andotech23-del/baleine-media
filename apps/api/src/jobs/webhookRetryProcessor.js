import prisma from "../repositories/prismaClient.js";
import { processWebhookEvent } from "../services/webhookService.js";

export const webhookRetryProcessor = async (job) => {
  const { webhookEventId } = job.data;
  const event = await prisma.webhookEvent.findUnique({ where: { id: webhookEventId } });
  if (!event) return;
  await processWebhookEvent(event);
};

export default webhookRetryProcessor;
