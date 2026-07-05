"use client";
import Link from "next/link";
import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DoctorRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    speciality: "",
    phone: "",
    email: "",
    password: "",
    yoe: "",
  });

  const [profile, setProfile] = useState(null);

  const handleFileChange = (e) => {
    setProfile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profile) {
        data.append("profile", profile);
      }

      const response = await axiosInstance.post("/doctor/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === 200 || response.data.status === 201) {
        toast.success("Doctor registered successfully!");
        router.push("/doctor/login");
      } else {
        toast.error(response.data.msg || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex-1 bg-[#404177] flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="bg-white w-[60%] rounded-md px-5 py-5 flex flex-col items-start gap-4">
        <div className="font-semibold text-xl">Register Doctor</div>
        
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="profile" className="text-sm font-medium">Profile Picture</label>
          <input
            className="border w-full px-2 py-1.5 rounded-md focus:outline-none"
            type="file"
            id="profile"
            name="profile"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className="w-full grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="name">Name</label>
            <input
              className="border w-full px-2 py-1.5 rounded-md focus:outline-none"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email">Email</label>
            <input
              className="border w-full px-2 py-1.5 rounded-md focus:outline-none"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="speciality">Speciality</label>
            <input
              className="border w-full px-2 py-1.5 rounded-md focus:outline-none"
              type="text"
              id="speciality"
              name="speciality"
              value={formData.speciality}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="phone">Phone number</label>
            <input
              className="border w-full px-2 py-1.5 rounded-md focus:outline-none"
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-2 w-full">
            <label htmlFor="password">Password</label>
            <input
                className="border w-full px-2 py-1.5 rounded-md focus:outline-none"
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            </div>
            <div className="flex flex-col gap-2 w-full">
            <label htmlFor="yoe">Years of Experience</label>
            <input
                className="border w-full px-2 py-1.5 rounded-md focus:outline-none"
                type="text"
                id="yoe"
                name="yoe"
                value={formData.yoe}
                onChange={handleChange}
                required
            />
            </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-10 py-2 mt-2 rounded-md bg-[#24aa4d] text-white text-base cursor-pointer font-semibold transition duration-300 hover:bg-[#24aa4d]/80 disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="flex gap-1 text-[14px]">
          <span>Already registered?</span>
          <Link href={"/doctor/login"} className="text-[#013ec1] underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
}
