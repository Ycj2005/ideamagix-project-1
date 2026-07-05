import patient from "../model/patient.model.js";
import doctor from "../model/doctor.model.js";
import consultation from "../model/consultation.model.js";
import prescription from "../model/prescription.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";
import fs from "fs";

export async function PatientRegister(req, res) {
  try {
    const { name, age, email, password, phone, hos, hoi, role } = req.body;
    let profile = "";
    if (req.file) {
      profile = req.file.path;
    }

    if (!name || !email || !password || !phone || !age) {
      return res.status(400).json({ status: 400, msg: "Please fill all required fields" });
    }

    const existingPatient = await patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ status: 400, msg: "Email already registered" });
    }

    const saltround = 10;
    const salt = await bcrypt.genSalt(saltround);
    let hashpass = await bcrypt.hash(password, salt);

    const hosArray = hos ? hos.toString().split(",").map((item) => item.trim()).filter((item) => item) : [];
    const hoiArray = hoi ? hoi.toString().split(",").map((item) => item.trim()).filter((item) => item) : [];

    let newPatient = await patient.create({
      profile,
      name,
      age,
      email,
      password: hashpass,
      phone,
      hos: hosArray,
      hoi: hoiArray,
      role,
    });

    res.status(201).json({
      status: 200,
      msg: "Patient registered successfully",
      data: newPatient,
    });
  } catch (error) {
    console.log("error for patient register", error?.message);
    if (error?.code === 11000) {
      return res.status(400).json({ status: 400, msg: "Email or phone already registered" });
    }
    res.status(500).json({ status: 500, msg: "Server error during registration" });
  }
}

export async function PatientLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 400, msg: "Please provide email and password" });
    }

    const user = await patient.findOne({ email });

    if (!user) {
      return res.status(400).json({ status: 400, msg: "Patient not found" });
    }

    let comparepass = await bcrypt.compare(password, user.password);
    if (!comparepass) {
      return res.status(400).json({ status: 400, msg: "Incorrect password" });
    }

    let token = jwt.sign(
      { userId: user._id, email: user.email, role: "patient" },
      JWT_SECRET,
      { expiresIn: "6d" }
    );

    res.cookie("patient_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 6 * 24 * 60 * 60 * 1000,
    });

    res.json({
      status: 200,
      msg: "Patient login successful",
      data: { _id: user._id, name: user.name, email: user.email, age: user.age, profile: user.profile },
    });
  } catch (error) {
    console.log("error for patient login", error?.message);
    res.status(500).json({ status: 500, msg: "Server error during login" });
  }
}

export async function PatientLogout(req, res) {
  try {
    res.cookie("patient_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({ status: 200, msg: "Patient logout successful" });
  } catch (error) {
    console.log("error for patient logout", error?.message);
    res.status(500).json({ status: 500, msg: "Server error during logout" });
  }
}

export async function PatientProfile(req, res) {
  try {
    const user = await patient.findById(req.patientId).select("-password");
    if (!user) {
      return res.status(404).json({ status: 404, msg: "Patient not found" });
    }
    res.json({ status: 200, data: user });
  } catch (error) {
    console.log("error for patient profile", error?.message);
    res.status(500).json({ status: 500, msg: "Server error fetching profile" });
  }
}

export async function PatientUpdateProfile(req, res) {
  try {
    const { name, age, phone } = req.body;
    let { hos, hoi } = req.body;
    let profile = null;

    if (req.file) {
      profile = req.file.path;
    }

    const user = await patient.findById(req.patientId);

    if (!user) {
      return res.status(404).json({ status: 404, msg: "Patient not found" });
    }

    user.name = name || user.name;
    user.age = age || user.age;
    user.phone = phone || user.phone;
    if (profile) user.profile = profile;

    if (hos) {
      user.hos = hos.toString().split(",").map((item) => item.trim()).filter((item) => item);
    }
    if (hoi) {
      user.hoi = hoi.toString().split(",").map((item) => item.trim()).filter((item) => item);
    }

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.json({ status: 200, msg: "Profile updated successfully", data: updatedUser });
  } catch (error) {
    console.log("error for patient update profile", error?.message);
    res.status(500).json({ status: 500, msg: "Server error updating profile" });
  }
}

export async function ViewDoctorCards(req, res) {
  try {
    const doctors = await doctor.find({}).select("-password");
    res.json({ status: 200, data: doctors });
  } catch (error) {
    console.log("error view doctors", error?.message);
    res.status(500).json({ status: 500, msg: "Server error fetching doctors" });
  }
}

export async function ConsultDoctor(req, res) {
  try {
    const { doctorId, cih, recentsurgery, surgerytimespan, diabetics, anyallergies, others, transactionId } = req.body;

    if (!doctorId) {
      return res.status(400).json({ status: 400, msg: "Doctor ID is required" });
    }

    const newConsultation = await consultation.create({
      patientId: req.patientId,
      doctorId,
      cih,
      recentsurgery,
      surgerytimespan,
      diabetics: diabetics === "true" || diabetics === true,
      anyallergies,
      others,
      transactionId,
      status: "Pending",
    });

    res.status(201).json({ status: 200, msg: "Consultation booked successfully", data: newConsultation });
  } catch (error) {
    console.log("error book consultation", error?.message);
    res.status(500).json({ status: 500, msg: "Server error booking consultation" });
  }
}

export async function ViewPrescriptions(req, res) {
  try {
    const prescriptions = await prescription
      .find({ patientId: req.patientId })
      .populate("doctorId", "name speciality profile")
      .sort({ createdAt: -1 });

    res.json({ status: 200, data: prescriptions });
  } catch (error) {
    console.log("error fetching prescriptions", error?.message);
    res.status(500).json({ status: 500, msg: "Server error fetching prescriptions" });
  }
}

export async function DownloadPrescription(req, res) {
  try {
    const { id } = req.params;
    const currentPrescription = await prescription.findOne({ _id: id, patientId: req.patientId });

    if (!currentPrescription) {
      return res.status(404).json({ status: 404, msg: "Prescription not found" });
    }

    if (!currentPrescription.pdf || !fs.existsSync(currentPrescription.pdf)) {
      return res.status(404).json({ status: 404, msg: "PDF not generated yet" });
    }

    res.download(currentPrescription.pdf);
  } catch (error) {
    console.log("error download pdf", error?.message);
    res.status(500).json({ status: 500, msg: "Server error downloading PDF" });
  }
}
