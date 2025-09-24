import { soapSectionSchema, transcriptSchema } from "@cordia/types";
import prisma from "../repositories/prismaClient.js";
import { ApiError } from "../middleware/errorHandler.js";

const keywords = {
  subjective: ["pain", "symptom", "feels"],
  objective: ["bp", "heart rate", "exam"],
  assessment: ["diagnosis", "likely", "assessment"],
  plan: ["plan", "recommend", "follow-up"]
};

const extractSection = (transcript, hints) => {
  const sentences = transcript.split(/\.|\n/).map((s) => s.trim());
  return (
    sentences.find((sentence) => hints.some((hint) => sentence.toLowerCase().includes(hint))) ||
    "Pending clinician input."
  );
};

export const generateSoapNote = async ({ appointmentId, transcript, authorId }) => {
  const parsed = transcriptSchema.parse({ appointmentId, transcript });
  const author = authorId || (await prisma.staff.findFirst())?.id;
  if (!author) {
    throw new ApiError(400, "No clinician available to author note");
  }

  const content = soapSectionSchema.parse({
    subjective: extractSection(parsed.transcript, keywords.subjective),
    objective: extractSection(parsed.transcript, keywords.objective),
    assessment: extractSection(parsed.transcript, keywords.assessment),
    plan: extractSection(parsed.transcript, keywords.plan)
  });
  const soapNote = await prisma.soapNote.create({
    data: {
      appointmentId: parsed.appointmentId,
      authorId: author,
      content,
      status: "PENDING_REVIEW"
    }
  });
  return soapNote;
};

export const reviewSoapNote = async ({ soapNoteId, reviewerId, approved, feedback }) => {
  const note = await prisma.soapNote.findUnique({ where: { id: soapNoteId } });
  if (!note) throw new ApiError(404, "SOAP note not found");
  if (note.status !== "PENDING_REVIEW") {
    throw new ApiError(400, "Note must be reviewed by a human before saving");
  }
  const status = approved ? "APPROVED" : "REJECTED";
  return prisma.soapNote.update({
    where: { id: soapNoteId },
    data: {
      status,
      reviewerId,
      content: approved ? note.content : { ...note.content, plan: `${note.content.plan}\nReviewer feedback: ${feedback}` }
    }
  });
};

export default { generateSoapNote, reviewSoapNote };
