import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const NEW_EMAIL = "ankitumath30@gmail.com";
const NEW_PASSWORD = "apnahackathon26";
const OLD_EMAIL = "admin@squid.game";

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Remove old admin if it exists
    const deleted = await Admin.deleteOne({ email: OLD_EMAIL.toLowerCase() });
    if (deleted.deletedCount > 0) {
      console.log(`Removed old admin: ${OLD_EMAIL}`);
    }

    // Remove existing new admin (so we can recreate cleanly)
    await Admin.deleteOne({ email: NEW_EMAIL.toLowerCase() });

    // Create fresh admin with new credentials
    const admin = new Admin({ email: NEW_EMAIL, password: NEW_PASSWORD });
    await admin.save();

    console.log("✅ Admin account updated successfully!");
    console.log(`   Email   : ${NEW_EMAIL}`);
    console.log(`   Password: ${NEW_PASSWORD}`);
    process.exit(0);
  } catch (error) {
    console.error("Error resetting admin:", error.message);
    process.exit(1);
  }
};

resetAdmin();
