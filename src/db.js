import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const mongoUri = process.env.MONGO_URI;

try {
  mongoose.connect(mongoUri);
  console.log("✅ connected to the database");
} catch (error) {
  console.log(error.message);
  console.log("❗️ cannot access the database");
}
