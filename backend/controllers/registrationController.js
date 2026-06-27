import Registration from "../models/Registration.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const createRegistration = async (req, res) => {
  try {
    const data = { ...req.body };

    // Check if files were uploaded and locate the paymentScreenshot file
    let paymentScreenshotUrl = "";
    if (req.files && req.files.length > 0) {
      const screenshotFile = req.files.find((f) => f.fieldname === "paymentScreenshot");
      if (screenshotFile) {
        try {
          const uploadResult = await uploadToCloudinary(screenshotFile.buffer);
          paymentScreenshotUrl = uploadResult.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          return res.status(500).json({ message: "Failed to upload payment screenshot to Cloudinary." });
        }
      }
    }

    // Parse memberCount as integer to match Number schema type
    if (data.memberCount) {
      data.memberCount = parseInt(data.memberCount, 10);
    }

    // Parse members if it's sent as a JSON string
    if (typeof data.members === "string") {
      try {
        data.members = JSON.parse(data.members);
      } catch (err) {
        console.error("Failed to parse members JSON string:", err);
        data.members = [];
      }
    }

    // Generate a unique teamId if not present
    if (!data.teamId) {
      data.teamId = "SQ-" + Math.floor(1000 + Math.random() * 9000);
    }

    if (paymentScreenshotUrl) {
      data.paymentScreenshot = paymentScreenshotUrl;
    }

    const registration = await Registration.create(data);
    res.status(201).json(registration);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "A registration with this Team ID or transaction ID already exists." });
    }
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRegistrationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    let query = {};
    if (id.startsWith("SQ-")) {
      query = { teamId: id };
    } else {
      query = { _id: id };
    }

    const registration = await Registration.findOne(query);

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    if (status !== undefined) {
      // Map "Approved" to "Verified" to match schema enum
      let mappedStatus = status;
      if (status === "Approved") {
        mappedStatus = "Verified";
      }
      registration.paymentStatus = mappedStatus;
    }

    if (req.admin) {
      registration.verifiedBy = req.admin.email;
    } else {
      registration.verifiedBy = "Admin";
    }

    await registration.save();
    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};