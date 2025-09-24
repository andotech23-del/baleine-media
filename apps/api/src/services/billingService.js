import prisma from "../repositories/prismaClient.js";
import { invoiceSchema } from "@cordia/types";
import { stripeClient } from "../utils/stripe.js";
import { webhookRetryQueue } from "../jobs/queues.js";

const insuranceAdjustments = {
  MEDICAL: 0.8,
  ROUTINE: 0.6
};

export const simulateInsuranceVerification = (patient, services = []) => {
  const coverage = insuranceAdjustments[patient.insuranceType] || 0.7;
  const baseAmount = services.reduce((acc, item) => acc + item.amount, 0);
  const insurerPortion = baseAmount * coverage;
  const patientResponsibility = baseAmount - insurerPortion;
  return {
    baseAmount,
    insurerPortion,
    patientResponsibility
  };
};

export const createEstimateAndInvoice = async ({ appointmentId, patientId, services }) => {
  const patient = await prisma.patient.findUnique({ where: { id: patientId } });
  const { baseAmount, patientResponsibility } = simulateInsuranceVerification(patient, services);
  const invoiceData = invoiceSchema.parse({
    appointmentId,
    patientId,
    amount: patientResponsibility,
    status: "SENT",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimateBreakdown: services
  });
  return prisma.invoice.create({
    data: {
      ...invoiceData,
      dueDate: new Date(invoiceData.dueDate)
    }
  });
};

export const createStripePaymentLink = async ({ invoice }) => {
  const session = await stripeClient.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Invoice ${invoice.id}`
          },
          unit_amount: Math.round(invoice.amount * 100)
        },
        quantity: 1
      }
    ],
    success_url: "https://example.com/success",
    cancel_url: "https://example.com/cancel",
    metadata: { invoiceId: invoice.id }
  });
  return session.url;
};

export const handleStripeWebhook = async (event) => {
  if (event.type === "checkout.session.completed") {
    const invoiceId = event.data.object.metadata.invoiceId;
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: "PAID" } });
    await prisma.payment.create({
      data: {
        invoiceId,
        amount: event.data.object.amount_total / 100,
        status: "SUCCEEDED",
        provider: "STRIPE",
        externalReference: event.data.object.id
      }
    });
  }
};

export const enqueueWebhookRetry = async (webhookEventId) => {
  await webhookRetryQueue.add(`webhook-${webhookEventId}`, { webhookEventId }, { attempts: 5, backoff: 1000 });
};

export default {
  simulateInsuranceVerification,
  createEstimateAndInvoice,
  createStripePaymentLink,
  handleStripeWebhook,
  enqueueWebhookRetry
};
