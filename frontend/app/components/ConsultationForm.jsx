"use client";
import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";import toast from "react-hot-toast";

export default function ConsultationForm({ doctor, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    cih: "",
    recentsurgery: "",
    surgerytimespan: "",
    // Step 2
    diabetics: "false",
    anyallergies: "",
    others: "",
    // Step 3
    transactionId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.cih) {
        toast.error("Please enter current illness history");
        return;
      }
    }
    if (step === 2) {
      // no required field in step 2
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.transactionId) {
      toast.error("Please enter transaction ID");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/patient/consultation", {
        doctorId: doctor._id,
        ...formData,
      });

      if (response.data.status === 200) {
        toast.success("Consultation booked successfully!");
        onClose();
      } else {
        toast.error(response.data.msg || "Booking failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-bold text-lg text-gray-800">Book Consultation</h2>
            <p className="text-sm text-gray-500">Dr. {doctor.name} — {doctor.speciality}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center px-6 pt-4 gap-2">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= s ? "bg-[#404177] text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 rounded ${step > s ? "bg-[#404177]" : "bg-gray-200"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-1">Step 1: Medical History</p>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Current Illness History <span className="text-red-500">*</span></label>
                <textarea
                  name="cih"
                  value={formData.cih}
                  onChange={handleChange}
                  rows={3}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                  placeholder="Describe your current illness..."
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Recent Surgery (if any)</label>
                <input
                  type="text"
                  name="recentsurgery"
                  value={formData.recentsurgery}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                  placeholder="Name of surgery"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Surgery Time Span</label>
                <input
                  type="text"
                  name="surgerytimespan"
                  value={formData.surgerytimespan}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                  placeholder="e.g. 2 months ago"
                />
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-1">Step 2: Additional Info</p>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Diabetic?</label>
                <select
                  name="diabetics"
                  value={formData.diabetics}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                >
                  <option value="false">Non-Diabetic</option>
                  <option value="true">Diabetic</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Any Allergies</label>
                <input
                  type="text"
                  name="anyallergies"
                  value={formData.anyallergies}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                  placeholder="e.g. Penicillin, Nuts"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Others</label>
                <textarea
                  name="others"
                  value={formData.others}
                  onChange={handleChange}
                  rows={2}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                  placeholder="Any other information..."
                />
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-1">Step 3: Payment</p>
              <div className="bg-gray-50 border rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 mb-2">Scan QR to pay consultation fee</p>
                <div className="w-32 h-32 bg-gray-200 mx-auto rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  QR Code
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Transaction ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                  placeholder="Enter your transaction ID"
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 bg-[#404177] text-white rounded-md text-sm font-semibold hover:bg-[#404177]/80"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-[#24aa4d] text-white rounded-md text-sm font-semibold hover:bg-[#24aa4d]/80 disabled:bg-gray-400"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
