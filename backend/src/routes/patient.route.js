import express from "express";
import {
  PatientLogin,
  PatientRegister,
  PatientLogout,
  PatientProfile,
  PatientUpdateProfile,
  ViewDoctorCards,
  ConsultDoctor,
  ViewPrescriptions,
  DownloadPrescription
} from "../controller/patient.controller.js";
import { protectPatient } from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.js";

const patientRouter = express.Router();

patientRouter.post("/login", PatientLogin);
patientRouter.post("/register", upload.single("profile"), PatientRegister);

// Protected routes
patientRouter.post("/logout", protectPatient, PatientLogout);
patientRouter.get("/profile", protectPatient, PatientProfile);
patientRouter.put("/profile", protectPatient, upload.single("profile"), PatientUpdateProfile);
patientRouter.get("/doctors", protectPatient, ViewDoctorCards);
patientRouter.post("/consultation", protectPatient, ConsultDoctor);
patientRouter.get("/prescription/patient", protectPatient, ViewPrescriptions);
patientRouter.get("/prescription/download/:id", protectPatient, DownloadPrescription);

export default patientRouter;
