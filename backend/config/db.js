import mongoose from "mongoose";
// const mongoose = require("mongoose");

// const dotenv = require("dotenv");
// dotenv.config();
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DTAv basr connected");
  } catch (error) {
    console.log("some thing wrong",error);
  }
};

// module.exports = connectDB;
