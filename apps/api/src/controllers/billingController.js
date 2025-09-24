import prisma from "../repositories/prismaClient.js";
import {
  createEstimateAndInvoice,
  createStripePaymentLink,
  handleStripeWebhook,
  enqueueWebhookRetry
} from "../services/billingService.js";
import { ApiError } from "../middleware/errorHandler.js";

export const listInvoices = async (_req, res, next) => {
  try {
    const invoices = await prisma.invoice.findMany({ include: { patient: true } });
    res.json(invoices);
  } catch (error) {
    next(error);
  }
};

export const createInvoice = async (req, res, next) => {
  try {
    const invoice = await createEstimateAndInvoice(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    next(error);
  }
};

export const paymentLink = async (req, res, next) => {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
    if (!invoice) throw new ApiError(404, "Invoice not found");
    const url = await createStripePaymentLink({ invoice });
    res.json({ url });
  } catch (error) {
    next(error);
  }
};

export const stripeWebhook = async (req, res, next) => {
  try {
    await handleStripeWebhook(req.body);
    res.json({ received: true });
  } catch (error) {
    await enqueueWebhookRetry(req.body.id);
    next(error);
  }
};

export default { listInvoices, createInvoice, paymentLink, stripeWebhook };
