import express from "express";
import { ConnectionDB } from "./config/Dbconn.js";
import dns from "dns";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
import patientRouter from "./routes/patient.route.js";
import cors from "cors";
import doctorRoute from "./routes/doctor.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

const pdfsDir = path.join(process.cwd(), "pdfs");
if (!fs.existsSync(pdfsDir)) {
  fs.mkdirSync(pdfsDir);
}

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://frontend-merntask-project.vercel.app"],
    credentials: true,
  })
);

app.use("/pdfs", express.static(pdfsDir));

app.use("/api/patient/", patientRouter);
app.use("/api/doctor/", doctorRoute);

app.listen(5500, () => {
  ConnectionDB();
  console.log("app is running on port 5500");
});


