import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { index, show, create, update } from "../controllers/patientController.js";

const router = Router();

router.use(authenticate(["ADMIN", "STAFF"]));
router.get("/", index);
router.post("/", create);
router.get("/:id", show);
router.put("/:id", update);

export default router;
