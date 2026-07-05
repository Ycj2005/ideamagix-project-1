"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const router = useRouter();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await axiosInstance.get("/doctor/consultations");
      if (response.data.status === 200) {
        setConsultations(response.data.data);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        router.push("/doctor/login");
      } else {
        toast.error("Failed to fetch consultations");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">Loading consultations...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-4">Patient Consultations</h2>

      {consultations.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No consultations yet.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {consultations.map((c) => (
            <div key={c._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#404177]/10 flex items-center justify-center text-[#404177] font-bold text-lg">
                  {c.patientId?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{c.patientId?.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    c.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {c.status}
                </span>
                <button
                  onClick={() => router.push(`/doctor/consultation/${c._id}`)}
                  className="px-4 py-2 bg-[#404177] text-white rounded-md text-sm font-semibold hover:bg-[#404177]/80"
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
