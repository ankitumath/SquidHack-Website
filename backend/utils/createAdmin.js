import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const createDefaultAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const email = process.argv[2] || "admin@squid.game";
    const password = process.argv[3] || "FrontmanPassword456";

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.log(`Admin user with email ${email} already exists.`);
      process.exit(0);
    }

    const admin = new Admin({
      email,
      password,
    });

    await admin.save();
    console.log(`Admin user created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createDefaultAdmin();
