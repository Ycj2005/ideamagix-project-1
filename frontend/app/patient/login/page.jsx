"use client";
import Link from "next/link";
import React, { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post("/patient/login", formData);
      
      if (response.data.status === 200) {
        toast.success("Login successful!");
        router.push("/patient/profile");
      } else {
        toast.error(response.data.msg || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex-1 bg-[#404177] flex items-center justify-center p-8">
      <form onSubmit={handleSubmit} className="bg-white w-[60%] max-w-md rounded-md px-5 py-5 flex flex-col items-start gap-4">
        <div className="font-semibold text-xl">
            Patient Login
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
        <button 
          type="submit"
          disabled={loading}
          className="px-10 py-2 rounded-md bg-[#24aa4d] text-white text-base cursor-pointer font-semibold transition duration-300 hover:bg-[#24aa4d]/80 disabled:bg-gray-400"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex gap-1 text-[14px]">
            <span>Not registered yet?</span>
            <Link href={'/patient/register'} className="text-[#013ec1] underline">Register here</Link>
        </div>
      </form>
    </div>
  );
}
