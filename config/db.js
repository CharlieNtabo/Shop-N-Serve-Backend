import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const MONGOURL = process.env.MONGO_URL;
    await mongoose.connect(MONGOURL).then(() => {
      console.log("Database connected");
    });
  } catch (error) {
    console.error("Database not connected");
  }
};
