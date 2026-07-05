import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;