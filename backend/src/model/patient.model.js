import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    profile: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    hos: [
      {
        type: String,
      },
    ],
    hoi: [
      {
        type: String,
      },
    ],
    role: {
      type: String,
      default: "patient",
    },
  },
  { timestamps: true },
);

// PatientSchema.index({ name: 1 });
// PatientSchema.index({ email: 1 });

const patient =
  mongoose.models.patient || mongoose.model("patient", PatientSchema);
export default patient;
