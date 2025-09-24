import { jest } from "@jest/globals";
import { reminderProcessor } from "../jobs/reminderProcessor.js";
import prisma from "../repositories/prismaClient.js";
import { sendReminderMessage } from "../services/messagingService.js";

jest.mock("../repositories/prismaClient.js");
jest.mock("../services/messagingService.js", () => ({
  sendReminderMessage: jest.fn()
}));

describe("Reminder processor", () => {
  beforeEach(() => {
    prisma.appointment.findUnique.mockReset();
    sendReminderMessage.mockReset();
  });

  it("sends reminder when within cadence window", async () => {
    const appointment = {
      id: "appt-1",
      startTime: new Date(Date.now() - 60 * 60 * 1000),
      patient: { firstName: "Piper" },
      provider: { firstName: "Avery" }
    };
    prisma.appointment.findUnique.mockResolvedValue(appointment);

    await reminderProcessor({
      data: { appointmentId: appointment.id, cadence: 1 },
      moveToDelayed: jest.fn()
    });

    expect(sendReminderMessage).toHaveBeenCalledWith({ appointment, cadence: 1 });
  });
});
