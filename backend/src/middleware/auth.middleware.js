import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";

export const protectDoctor = async (req, res, next) => {
  try {
    const token = req.cookies.doctor_token;
    if (!token) {
      return res.status(401).json({ status: 401, msg: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.doctorId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in protectDoctor middleware", error.message);
    res.status(401).json({ status: 401, msg: "Not authorized, token failed" });
  }
};

export const protectPatient = async (req, res, next) => {
  try {
    const token = req.cookies.patient_token;
    if (!token) {
      return res.status(401).json({ status: 401, msg: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.patientId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in protectPatient middleware", error.message);
    res.status(401).json({ status: 401, msg: "Not authorized, token failed" });
  }
};
