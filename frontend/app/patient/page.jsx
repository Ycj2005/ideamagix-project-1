"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ConsultationForm from "../components/ConsultationForm";

export default function PatientDashboard() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axiosInstance.get("/patient/doctors");
      if (response.data.status === 200) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        router.push("/patient/login");
      } else {
        toast.error("Failed to fetch doctors");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConsultClick = (doc) => {
    setSelectedDoctor(doc);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedDoctor(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">Loading doctors...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Find a Doctor</h1>
      </div>

      {doctors.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No doctors available right now.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doc) => (
            <div key={doc._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                {doc.profile ? (
                  <img src={doc.profile} alt={`Dr. ${doc.name}`} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-[#404177]/10 flex items-center justify-center text-[#404177] font-bold text-xl">
                    {doc.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800">Dr. {doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.speciality || "General"}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Experience:</span> {doc.yoe || "N/A"} years
              </div>
              <button
                onClick={() => handleConsultClick(doc)}
                className="w-full mt-1 py-2 bg-[#24aa4d] text-white rounded-md text-sm font-semibold hover:bg-[#24aa4d]/80"
              >
                Consult
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && selectedDoctor && (
        <ConsultationForm
          doctor={selectedDoctor}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
