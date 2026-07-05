"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function PatientPrescriptions() {
  const router = useRouter();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await axiosInstance.get("/patient/prescription/patient");
      if (response.data.status === 200) {
        setPrescriptions(response.data.data);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        router.push("/patient/login");
      } else {
        toast.error("Failed to fetch prescriptions");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      const response = await axiosInstance.get(`/patient/prescription/download/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      toast.error("Failed to download PDF");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">Loading prescriptions...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">No prescriptions available.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {prescriptions.map((pres) => (
            <div key={pres._id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {pres.doctorId?.profile ? (
                    <img src={pres.doctorId.profile} alt={`Dr. ${pres.doctorId.name}`} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#404177]/10 flex items-center justify-center text-[#404177] font-bold text-lg">
                      {pres.doctorId?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">
                      Dr. {pres.doctorId?.name}
                    </p>
                    <p className="text-sm text-gray-500">{pres.doctorId?.speciality}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(pres.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Medicines</p>
                  <p className="text-gray-700 text-sm mt-1">{pres.medicines}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-medium">Care to be Taken</p>
                  <p className="text-gray-700 text-sm mt-1">{pres.caretotaken}</p>
                </div>
              </div>
              {pres.pdf && (
                <div className="mt-3">
                  <button
                    onClick={() => handleDownloadPDF(pres._id)}
                    className="px-4 py-2 bg-[#404177] text-white rounded-md text-sm font-semibold hover:bg-[#404177]/80"
                  >
                    Download PDF
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
