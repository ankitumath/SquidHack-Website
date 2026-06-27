import dotenv from "dotenv";
import mongoose from "mongoose";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Remove existing admins (optional during development)
    await Admin.deleteMany({});

    const admin = await Admin.create({
      email: "admin@squidhack.com",
      password: "admin123",
    });

    console.log("✅ Admin created successfully");
    console.log("Email:", admin.email);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();