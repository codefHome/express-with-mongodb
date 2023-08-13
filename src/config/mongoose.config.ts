require("dotenv").config();
import mongoose from "mongoose";

const userName = process.env.DB_NAME;
const password = process.env.PASSWORD;
const db = process.env.DB;
const MONGODB_URI = `mongodb+srv://${userName}:${password}@${process.env.host}/${db}?retryWrites=true&w=majority`;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
