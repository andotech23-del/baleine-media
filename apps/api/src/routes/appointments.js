import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { index, create, updateStatus, ics } from "../controllers/appointmentController.js";

const router = Router();

router.use(authenticate(["ADMIN", "STAFF"]));
router.get("/", index);
router.post("/", create);
router.patch("/:id/status", updateStatus);
router.get("/:id/ics", ics);

export default router;
