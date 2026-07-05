import mongoose from "mongoose";

const PerscreptionSchema = new mongoose.Schema({
  consultationId: {
    type: mongoose.Types.ObjectId,
    ref: "consultation",
  },
  doctorId: {
    type: mongoose.Types.ObjectId,
    ref: "doctor",
  },
  patientId: {
    type: mongoose.Types.ObjectId,
    ref: "patient",
  },
  caretotaken: {
    type: String,
    required: true,
  },
  medicines: {
    type: String,
    required: true,
  },
  pdf: {
    type: String,
  },
});

const perscription =
  mongoose.models.perscription ||
  mongoose.model("perscription", PerscreptionSchema);
export default perscription;
