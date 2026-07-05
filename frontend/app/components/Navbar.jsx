"use client";
import { Hospital } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const isDoctor = pathname.startsWith("/doctor");
  const isPatient = pathname.startsWith("/patient");

  // Auth pages — don't show logout
  const isAuthPage =
    pathname === "/doctor/login" ||
    pathname === "/doctor/register" ||
    pathname === "/patient/login" ||
    pathname === "/patient/register";

  const handleLogout = async () => {
    try {
      if (isDoctor) {
        await axiosInstance.post("/doctor/logout");
        router.push("/doctor/login");
      } else {
        await axiosInstance.post("/patient/logout");
        router.push("/patient/login");
      }
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="px-10 height-nav shadow-md w-full bg-white text-black flex items-center justify-between">
      <Link href={"/"} className="flex items-center gap-2">
        <Hospital color="#404177" />
        <div className="font-bold text-xl">FindDoctor</div>
      </Link>

      <div>
        <ul className="flex items-center gap-5">
          {!isDoctor && !isPatient && (
            <>
              <li>
                <Link href={"/"} className="underline-effect font-semibold cursor-pointer">
                  Home
                </Link>
              </li>
              <li>
                <Link href={"/patient/login"} className="underline-effect font-semibold cursor-pointer">
                  Patient Login
                </Link>
              </li>
              <li>
                <Link href={"/doctor/login"} className="underline-effect font-semibold cursor-pointer">
                  Doctor Login
                </Link>
              </li>
            </>
          )}

          {isDoctor && (
            <>
              <li>
                <Link href={"/doctor"} className="underline-effect font-semibold cursor-pointer">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href={"/doctor/profile"} className="underline-effect font-semibold cursor-pointer">
                  Profile
                </Link>
              </li>
              {!isAuthPage && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600"
                  >
                    Logout
                  </button>
                </li>
              )}
            </>
          )}

          {/* Patient pages */}
          {isPatient && (
            <>
              <li>
                <Link href={"/patient"} className="underline-effect font-semibold cursor-pointer">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href={"/patient/profile"} className="underline-effect font-semibold cursor-pointer">
                  Profile
                </Link>
              </li>
              <li>
                <Link href={"/patient/prescriptions"} className="underline-effect font-semibold cursor-pointer">
                  Prescriptions
                </Link>
              </li>
              {!isAuthPage && (
                <li>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-1.5 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600"
                  >
                    Logout
                  </button>
                </li>
              )}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
