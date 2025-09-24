import { jest } from "@jest/globals";
import { generateSoapNote, reviewSoapNote } from "../services/scribeService.js";
import prisma from "../repositories/prismaClient.js";
import { ApiError } from "../middleware/errorHandler.js";

jest.mock("../repositories/prismaClient.js");

describe("Scribe service", () => {
  beforeEach(() => {
    prisma.soapNote.create.mockReset();
    prisma.soapNote.findUnique.mockReset();
    prisma.soapNote.update.mockReset();
    prisma.staff.findFirst.mockReset();
  });

  it("creates SOAP note in pending review", async () => {
    prisma.staff.findFirst.mockResolvedValue({ id: "staff_1" });
    prisma.soapNote.create.mockResolvedValue({ id: "note_1", status: "PENDING_REVIEW" });
    const note = await generateSoapNote({ appointmentId: "appt_1", transcript: "Patient feels pain" });
    expect(note.status).toEqual("PENDING_REVIEW");
  });

  it("throws when reviewing non pending note", async () => {
    prisma.soapNote.findUnique.mockResolvedValue({ id: "note_1", status: "APPROVED" });
    await expect(
      reviewSoapNote({ soapNoteId: "note_1", reviewerId: "staff_1", approved: true })
    ).rejects.toBeInstanceOf(ApiError);
  });
});
