import mongoose, { mongo } from "mongoose";

const DoctorSchema = new mongoose.Schema({
  profile: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    // required: true,
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
  yoe: {
    type: String,
    // required: true,
  },
  role: {
    type: String,
    default: "doctor",
  },
});

// DoctorSchema.index({ name: 1 });
// DoctorSchema.index({ email: 1 });

const doctor = mongoose.models.doctor || mongoose.model("doctor", DoctorSchema);
export default doctor;
