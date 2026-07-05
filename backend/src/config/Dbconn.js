import mongoose from "mongoose";
import { MONGODB_URI } from "./env.config.js";
export async function ConnectionDB() {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log("dbn conntected succesfully ", conn?.connection?.host);
  } catch (error) {
    console.log("error : ", error?.message);
  }
}