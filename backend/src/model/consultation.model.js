import mongoose from "mongoose";

const ConsultationSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  cih: {
    type: String,
  },
  recentsurgery: {
    type: String,
  },
  surgerytimespan: {
    type: String,
  },
  diabetics: {
    type: Boolean,
    default: false,
  },
  anyallergies: {
    type: String,
  },
  others: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  status: {
    type: String,
    default: "Pending",
  },
}, { timestamps: true });

const consultation =
  mongoose.models.consultation ||
  mongoose.model("consultation", ConsultationSchema);
export default consultation;
