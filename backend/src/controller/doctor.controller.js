import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.config.js";
import doctor from "../model/doctor.model.js";
import consultation from "../model/consultation.model.js";
import prescription from "../model/prescription.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export async function DoctorRegister(req, res) {
  try {
    const { name, speciality, email, password, phone, yoe, role } = req.body;
    let profile = "";
    if (req.file) {
      profile = req.file.path;
    }

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ status: 400, msg: "Please fill all required fields" });
    }

    const existingDoctor = await doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ status: 400, msg: "Email already registered" });
    }

    const saltround = 10;
    const salt = await bcrypt.genSalt(saltround);
    let hashpass = await bcrypt.hash(password, salt);

    let newDoctor = await doctor.create({
      profile,
      name,
      speciality,
      email,
      password: hashpass,
      phone,
      yoe,
      role,
    });

    res.status(201).json({
      status: 200,
      msg: "Doctor registered successfully",
      data: newDoctor,
    });
  } catch (error) {
    console.log("error for doctor register", error?.message);
    if (error?.code === 11000) {
      return res.status(400).json({ status: 400, msg: "Email or phone already registered" });
    }
    res.status(500).json({ status: 500, msg: "Server error during registration" });
  }
}

export async function DoctorLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 400, msg: "Please provide email and password" });
    }

    const user = await doctor.findOne({ email });

    if (!user) {
      return res.status(400).json({ status: 400, msg: "Doctor not found" });
    }

    let comparepass = await bcrypt.compare(password, user.password);
    if (!comparepass) {
      return res.status(400).json({ status: 400, msg: "Incorrect password" });
    }

    let token = jwt.sign(
      { userId: user._id, email: user.email, role: "doctor" },
      JWT_SECRET,
      { expiresIn: "6d" }
    );

    res.cookie("doctor_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 6 * 24 * 60 * 60 * 1000,
    });

    res.json({
      status: 200,
      msg: "Doctor login successful",
      data: { _id: user._id, name: user.name, email: user.email, speciality: user.speciality, profile: user.profile },
    });
  } catch (error) {
    console.log("error for doctor login", error?.message);
    res.status(500).json({ status: 500, msg: "Server error during login" });
  }
}

export async function DoctorLogout(req, res) {
  try {
    res.cookie("doctor_token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({ status: 200, msg: "Doctor logout successful" });
  } catch (error) {
    console.log("error for doctor logout", error?.message);
    res.status(500).json({ status: 500, msg: "Server error during logout" });
  }
}

export async function DoctorProfile(req, res) {
  try {
    const user = await doctor.findById(req.doctorId).select("-password");
    if (!user) {
      return res.status(404).json({ status: 404, msg: "Doctor not found" });
    }
    res.json({ status: 200, data: user });
  } catch (error) {
    console.log("error for doctor profile", error?.message);
    res.status(500).json({ status: 500, msg: "Server error fetching profile" });
  }
}

export async function DoctorUpdateProfile(req, res) {
  try {
    const { name, speciality, phone, yoe } = req.body;
    let profile = null;

    if (req.file) {
      profile = req.file.path;
    }

    const user = await doctor.findById(req.doctorId);

    if (!user) {
      return res.status(404).json({ status: 404, msg: "Doctor not found" });
    }

    user.name = name || user.name;
    user.speciality = speciality || user.speciality;
    user.phone = phone || user.phone;
    user.yoe = yoe || user.yoe;
    if (profile) user.profile = profile;

    const updatedUser = await user.save();
    updatedUser.password = undefined;

    res.json({ status: 200, msg: "Profile updated successfully", data: updatedUser });
  } catch (error) {
    console.log("error for doctor update profile", error?.message);
    res.status(500).json({ status: 500, msg: "Server error updating profile" });
  }
}

export async function ViewConsultations(req, res) {
  try {
    const consultations = await consultation
      .find({ doctorId: req.doctorId })
      .populate("patientId", "name age phone")
      .sort({ createdAt: -1 });

    res.json({ status: 200, data: consultations });
  } catch (error) {
    console.log("error view consultations", error?.message);
    res.status(500).json({ status: 500, msg: "Server error fetching consultations" });
  }
}

export async function GetSingleConsultation(req, res) {
  try {
    const { id } = req.params;

    const consultationData = await consultation
      .findById(id)
      .populate("patientId", "name age phone hos hoi");

    if (!consultationData) {
      return res.status(404).json({ status: 404, msg: "Consultation not found" });
    }

    const existingPrescription = await prescription.findOne({ consultationId: id });

    res.json({ status: 200, data: { consultation: consultationData, prescription: existingPrescription } });
  } catch (error) {
    console.log("error get single consultation", error?.message);
    res.status(500).json({ status: 500, msg: "Server error fetching consultation" });
  }
}

export async function WritePrescription(req, res) {
  try {
    const { patientId, consultationId, medicines, caretotaken } = req.body;

    if (!patientId || !consultationId || !medicines || !caretotaken) {
      return res.status(400).json({ status: 400, msg: "Please fill all fields" });
    }

    const newPrescription = await prescription.create({
      doctorId: req.doctorId,
      patientId,
      consultationId,
      medicines,
      caretotaken,
    });

    // Update consultation status to completed
    await consultation.findByIdAndUpdate(consultationId, { status: "Completed" });

    res.status(201).json({ status: 200, msg: "Prescription written successfully", data: newPrescription });
  } catch (error) {
    console.log("error write prescription", error?.message);
    res.status(500).json({ status: 500, msg: "Server error writing prescription" });
  }
}

export async function EditPrescription(req, res) {
  try {
    const { id } = req.params;
    const { medicines, caretotaken } = req.body;

    const updatedPrescription = await prescription.findByIdAndUpdate(
      id,
      { medicines, caretotaken },
      { new: true }
    );

    if (!updatedPrescription) {
      return res.status(404).json({ status: 404, msg: "Prescription not found" });
    }

    res.json({ status: 200, msg: "Prescription edited successfully", data: updatedPrescription });
  } catch (error) {
    console.log("error edit prescription", error?.message);
    res.status(500).json({ status: 500, msg: "Server error editing prescription" });
  }
}

export async function GenerateSendPDF(req, res) {
  try {
    const { id } = req.params;
    const currentPrescription = await prescription
      .findById(id)
      .populate("patientId", "name age")
      .populate("doctorId", "name speciality");

    if (!currentPrescription) {
      return res.status(404).json({ status: 404, msg: "Prescription not found" });
    }

    // Delete old PDF if it exists
    if (currentPrescription.pdf && fs.existsSync(currentPrescription.pdf)) {
      fs.unlinkSync(currentPrescription.pdf);
    }

    const doc = new PDFDocument({ margin: 50 });
    const pdfFileName = `prescription-${id}-${Date.now()}.pdf`;
    const pdfPath = path.join(process.cwd(), "pdfs", pdfFileName);

    // Make sure pdfs folder exists
    if (!fs.existsSync(path.join(process.cwd(), "pdfs"))) {
      fs.mkdirSync(path.join(process.cwd(), "pdfs"));
    }

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text("FindDoctor - Medical Prescription", { align: "center" });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.fontSize(13).text(`Doctor: Dr. ${currentPrescription.doctorId.name}`);
    doc.text(`Speciality: ${currentPrescription.doctorId.speciality}`);
    doc.moveDown();
    doc.text(`Patient: ${currentPrescription.patientId.name}`);
    doc.text(`Age: ${currentPrescription.patientId.age}`);
    doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`);
    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    doc.fontSize(15).text("Medicines:");
    doc.fontSize(12).text(currentPrescription.medicines);
    doc.moveDown();

    doc.fontSize(15).text("Care to be Taken:");
    doc.fontSize(12).text(currentPrescription.caretotaken);

    doc.end();

    // Save pdf path in DB
    currentPrescription.pdf = pdfPath;
    await currentPrescription.save();

    res.json({ status: 200, msg: "PDF generated successfully", data: pdfPath });
  } catch (error) {
    console.log("error generate pdf", error?.message);
    res.status(500).json({ status: 500, msg: "Server error generating PDF" });
  }
}
