import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { listInvoices, createInvoice, paymentLink, stripeWebhook } from "../controllers/billingController.js";

const router = Router();

router.get("/invoices", authenticate(["ADMIN", "STAFF"]), listInvoices);
router.post("/invoices", authenticate(["ADMIN", "STAFF"]), createInvoice);
router.post("/invoices/:id/payment-link", authenticate(["ADMIN", "STAFF"]), paymentLink);
router.post("/stripe/webhook", stripeWebhook);

export default router;
