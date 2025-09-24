import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { ingestTranscript, review } from "../controllers/scribeController.js";

const router = Router();

router.post("/transcripts", authenticate(["ADMIN", "STAFF"]), ingestTranscript);
router.post("/notes/:id/review", authenticate(["ADMIN", "STAFF"]), review);

export default router;
