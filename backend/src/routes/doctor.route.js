import express from "express";
import {
  DoctorLogin,
  DoctorRegister,
  DoctorLogout,
  DoctorProfile,
  DoctorUpdateProfile,
  ViewConsultations,
  GetSingleConsultation,
  WritePrescription,
  EditPrescription,
  GenerateSendPDF
} from "../controller/doctor.controller.js";
import { protectDoctor } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const doctorRoute = express.Router();

doctorRoute.post("/login", DoctorLogin);
doctorRoute.post("/register", upload.single("profile"), DoctorRegister);

// Protected routes
doctorRoute.post("/logout", protectDoctor, DoctorLogout);
doctorRoute.get("/profile", protectDoctor, DoctorProfile);
doctorRoute.put("/profile", protectDoctor, upload.single("profile"), DoctorUpdateProfile);
doctorRoute.get("/consultations", protectDoctor, ViewConsultations);
doctorRoute.get("/consultation/:id", protectDoctor, GetSingleConsultation);
doctorRoute.post("/prescription", protectDoctor, WritePrescription);
doctorRoute.put("/prescription/:id", protectDoctor, EditPrescription);
doctorRoute.post("/generate-pdf/:id", protectDoctor, GenerateSendPDF);

export default doctorRoute;

