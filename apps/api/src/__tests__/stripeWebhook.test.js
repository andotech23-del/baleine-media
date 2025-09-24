import { jest } from "@jest/globals";
import { handleStripeWebhook } from "../services/billingService.js";
import prisma from "../repositories/prismaClient.js";

jest.mock("../repositories/prismaClient.js");

describe("Stripe webhook handler", () => {
  beforeEach(() => {
    prisma.invoice.update.mockReset();
    prisma.payment.create.mockReset();
  });

  it("marks invoice as paid when checkout completed", async () => {
    const event = {
      type: "checkout.session.completed",
      data: {
        object: {
          metadata: { invoiceId: "inv_1" },
          amount_total: 5000,
          id: "cs_test_123"
        }
      }
    };

    await handleStripeWebhook(event);

    expect(prisma.invoice.update).toHaveBeenCalledWith({
      where: { id: "inv_1" },
      data: { status: "PAID" }
    });
    expect(prisma.payment.create).toHaveBeenCalled();
  });
});
