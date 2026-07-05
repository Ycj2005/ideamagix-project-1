"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

export default function ConsultationDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [editing, setEditing] = useState(false);

  const [prescriptionForm, setPrescriptionForm] = useState({
    medicines: "",
    caretotaken: "",
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/doctor/consultation/${id}`);
      if (response.data.status === 200) {
        setData(response.data.data);
        if (response.data.data.prescription) {
          setPrescriptionForm({
            medicines: response.data.data.prescription.medicines || "",
            caretotaken: response.data.data.prescription.caretotaken || "",
          });
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        router.push("/doctor/login");
      } else {
        toast.error("Failed to fetch consultation");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPrescriptionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();

    if (!prescriptionForm.medicines || !prescriptionForm.caretotaken) {
      toast.error("Please fill all prescription fields");
      return;
    }

    setSaving(true);

    try {
      let response;

      if (data?.prescription) {
        // Edit existing
        response = await axiosInstance.put(`/doctor/prescription/${data.prescription._id}`, prescriptionForm);
      } else {
        // Write new
        response = await axiosInstance.post("/doctor/prescription", {
          patientId: data.consultation.patientId._id,
          consultationId: id,
          ...prescriptionForm,
        });
      }

      if (response.data.status === 200) {
        toast.success(data?.prescription ? "Prescription updated!" : "Prescription saved!");
        setEditing(false);
        fetchData();
      } else {
        toast.error(response.data.msg || "Failed to save prescription");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error saving prescription");
    } finally {
      setSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!data?.prescription) {
      toast.error("Save a prescription first");
      return;
    }

    setGeneratingPdf(true);

    try {
      const response = await axiosInstance.post(`/doctor/generate-pdf/${data.prescription._id}`);
      if (response.data.status === 200) {
        toast.success("PDF generated successfully!");
        fetchData();
      } else {
        toast.error(response.data.msg || "PDF generation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating PDF");
    } finally {
      setGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  if (!data) return null;

  const { consultation, prescription } = data;
  const patient = consultation.patientId;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.push("/doctor")}
          className="text-[#404177] text-sm font-semibold hover:underline"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Consultation Details</h1>
      </div>

      {/* Patient Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="font-semibold text-gray-700 mb-3">Patient Information</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Name</p>
            <p className="text-gray-800">{patient?.name}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Age</p>
            <p className="text-gray-800">{patient?.age}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Phone</p>
            <p className="text-gray-800">{patient?.phone}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">History of Surgery</p>
            <p className="text-gray-800">{patient?.hos?.join(", ") || "None"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">History of Illness</p>
            <p className="text-gray-800">{patient?.hoi?.join(", ") || "None"}</p>
          </div>
        </div>
      </div>

      {/* Consultation Info */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
        <h2 className="font-semibold text-gray-700 mb-3">Consultation Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Current Illness</p>
            <p className="text-gray-800">{consultation.cih || "—"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Recent Surgery</p>
            <p className="text-gray-800">{consultation.recentsurgery || "None"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Surgery Time Span</p>
            <p className="text-gray-800">{consultation.surgerytimespan || "—"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Diabetic</p>
            <p className="text-gray-800">{consultation.diabetics ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Allergies</p>
            <p className="text-gray-800">{consultation.anyallergies || "None"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Others</p>
            <p className="text-gray-800">{consultation.others || "—"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Transaction ID</p>
            <p className="text-gray-800">{consultation.transactionId || "—"}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-medium">Status</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                consultation.status === "Completed"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {consultation.status}
            </span>
          </div>
        </div>
      </div>

      {/* Prescription */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Prescription</h2>
          {prescription && !editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-1.5 border border-[#404177] text-[#404177] rounded-md text-sm font-semibold hover:bg-gray-50"
            >
              Edit Prescription
            </button>
          )}
        </div>

        {!prescription || editing ? (
          <form onSubmit={handleSavePrescription} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Medicines</label>
              <textarea
                name="medicines"
                value={prescriptionForm.medicines}
                onChange={handleChange}
                rows={3}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                placeholder="List medicines with dosage..."
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Care to be Taken</label>
              <textarea
                name="caretotaken"
                value={prescriptionForm.caretotaken}
                onChange={handleChange}
                rows={3}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                placeholder="Instructions for the patient..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-[#24aa4d] text-white rounded-md text-sm font-semibold hover:bg-[#24aa4d]/80 disabled:bg-gray-400"
              >
                {saving ? "Saving..." : prescription ? "Update" : "Save Prescription"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-2">
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Medicines</p>
                <p className="text-gray-700 text-sm mt-1">{prescription.medicines}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Care to be Taken</p>
                <p className="text-gray-700 text-sm mt-1">{prescription.caretotaken}</p>
              </div>
            </div>
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPdf}
              className="px-6 py-2 bg-[#404177] text-white rounded-md text-sm font-semibold hover:bg-[#404177]/80 disabled:bg-gray-400 w-fit"
            >
              {generatingPdf ? "Generating PDF..." : "Generate & Send PDF"}
            </button>
            {prescription.pdf && (
              <p className="text-xs text-green-600 font-medium">✓ PDF generated</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
