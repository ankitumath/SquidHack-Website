import express from "express";
import multer from "multer";
import { 
  createRegistration, 
  getRegistrations, 
  updateRegistrationStatus 
} from "../controllers/registrationController.js";
import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, JPEG, and PNG images are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// GET all registrations - Protected admin route
router.get("/", protectAdmin, getRegistrations);

// PUT update registration status - Protected admin route
router.put("/:id/status", protectAdmin, updateRegistrationStatus);

// Route-level middleware to catch Multer/filter errors and return 400 Bad Request
router.post(
  "/",
  (req, res, next) => {
    upload.any()(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  createRegistration
);

export default router;