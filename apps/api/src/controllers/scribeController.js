import { generateSoapNote, reviewSoapNote } from "../services/scribeService.js";

export const ingestTranscript = async (req, res, next) => {
  try {
    const note = await generateSoapNote({ ...req.body, authorId: req.user?.id });
    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

export const review = async (req, res, next) => {
  try {
    const { reviewerId, approved, feedback } = req.body;
    const note = await reviewSoapNote({
      soapNoteId: req.params.id,
      reviewerId,
      approved,
      feedback
    });
    res.json(note);
  } catch (error) {
    next(error);
  }
};

export default { ingestTranscript, review };
