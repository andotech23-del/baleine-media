import prisma from "../repositories/prismaClient.js";
import { sendDunningMessage } from "../services/messagingService.js";

export const dunningProcessor = async (job) => {
  const { invoiceId, attempt } = job.data;
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { patient: true }
  });
  if (!invoice) return;

  await sendDunningMessage({ invoice, attempt });

  if (invoice.status !== "PAID" && attempt < 3) {
    await job.moveToDelayed(Date.now() + 3 * 24 * 60 * 60 * 1000);
    job.update({ invoiceId, attempt: attempt + 1 });
  }
};

export default dunningProcessor;
