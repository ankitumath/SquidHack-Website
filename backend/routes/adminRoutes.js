import express from "express";
import { loginAdmin, sendEmail } from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/send-email", protectAdmin, sendEmail);

export default router;
