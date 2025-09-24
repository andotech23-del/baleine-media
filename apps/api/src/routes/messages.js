import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { inbox, receiveReply, createInbound } from "../controllers/messageController.js";

const router = Router();

router.get("/inbox", authenticate(["ADMIN", "STAFF"]), inbox);
router.post("/reply", receiveReply);
router.post("/inbound", createInbound);

export default router;
