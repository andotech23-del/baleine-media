import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { overview, runRpa } from "../controllers/dashboardController.js";

const router = Router();

router.get("/", authenticate(["ADMIN", "STAFF"]), overview);
router.post("/simulate-rpa", authenticate(["ADMIN", "STAFF"]), runRpa);

export default router;
