import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { showSettings, saveSettings } from "../controllers/notificationController.js";

const router = Router();

router.get("/settings", authenticate(["ADMIN", "STAFF"]), showSettings);
router.put("/settings", authenticate(["ADMIN", "STAFF"]), saveSettings);

export default router;
