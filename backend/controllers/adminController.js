import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import { sendStatusEmail } from "../utils/mailer.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "ThisWillBeChangedLater", {
    expiresIn: "7d",
  });
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (admin && (await admin.comparePassword(password))) {
      res.status(200).json({
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ message: "Server error. Please check your connection and try again." });
  }
};

export const sendEmail = async (req, res) => {
  const { to, teamName, leaderName, teamId, status, reason } = req.body;

  if (!to || !teamName || !leaderName || !teamId || !status) {
    return res.status(400).json({ message: "Missing required email fields." });
  }

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Status must be 'Approved' or 'Rejected'." });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.status(503).json({ message: "Email service is not configured. Add SMTP_USER and SMTP_PASS to .env." });
  }

  try {
    await sendStatusEmail({ to, teamName, leaderName, teamId, status, reason: reason || "" });
    res.status(200).json({ message: `Email successfully sent to ${to}` });
  } catch (error) {
    console.error("Email send error:", error.message);
    res.status(500).json({ message: "Failed to send email. Check SMTP credentials in .env." });
  }
};

