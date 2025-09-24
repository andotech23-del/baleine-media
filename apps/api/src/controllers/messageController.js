import prisma from "../repositories/prismaClient.js";
import { recordInboundMessage, processPatientReply } from "../services/messagingService.js";

export const inbox = async (_req, res, next) => {
  try {
    const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const receiveReply = async (req, res, next) => {
  try {
    const { appointmentId, patientId, body } = req.body;
    const result = await processPatientReply({ appointmentId, patientId, body });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createInbound = async (req, res, next) => {
  try {
    const message = await recordInboundMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export default { inbox, receiveReply, createInbound };
