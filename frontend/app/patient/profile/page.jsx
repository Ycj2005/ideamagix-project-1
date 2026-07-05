"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

export default function PatientProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    hos: "",
    hoi: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get("/patient/profile");
      if (response.data.status === 200) {
        const user = response.data.data;
        setProfile(user);
        setFormData({
          name: user.name || "",
          age: user.age || "",
          phone: user.phone || "",
          hos: user.hos ? user.hos.join(", ") : "",
          hoi: user.hoi ? user.hoi.join(", ") : "",
        });
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        router.push("/patient/login");
      } else {
        toast.error("Failed to fetch profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [profilePic, setProfilePic] = useState(null);

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (profilePic) {
        data.append("profile", profilePic);
      }

      const response = await axiosInstance.put("/patient/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === 200) {
        toast.success("Profile updated!");
        setProfile(response.data.data);
        setEditing(false);
      } else {
        toast.error(response.data.msg || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/patient/logout");
      toast.success("Logged out");
      router.push("/patient/login");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          {profile?.profile ? (
            <img src={profile.profile} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#404177]/10 flex items-center justify-center text-[#404177] font-bold text-2xl">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800 text-lg">{profile?.name}</p>
            <p className="text-sm text-gray-500">{profile?.email}</p>
          </div>
        </div>

        {!editing ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Age</p>
                <p className="text-gray-700">{profile?.age}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-medium">Phone</p>
                <p className="text-gray-700">{profile?.phone}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-medium">History of Surgery</p>
              <p className="text-gray-700">{profile?.hos?.length > 0 ? profile.hos.join(", ") : "None"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-medium">History of Illness</p>
              <p className="text-gray-700">{profile?.hoi?.length > 0 ? profile.hoi.join(", ") : "None"}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="mt-3 px-6 py-2 bg-[#404177] text-white rounded-md text-sm font-semibold hover:bg-[#404177]/80 w-fit"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Profile Picture</label>
              <input
                type="file"
                name="profile"
                onChange={handleFileChange}
                accept="image/*"
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">History of Surgery (comma separated)</label>
              <input
                type="text"
                name="hos"
                value={formData.hos}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                placeholder="e.g. Appendicitis, Cataract"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">History of Illness (comma separated)</label>
              <input
                type="text"
                name="hoi"
                value={formData.hoi}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#404177]"
                placeholder="e.g. Diabetes, Hypertension"
              />
            </div>
            <div className="flex gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-[#24aa4d] text-white rounded-md text-sm font-semibold hover:bg-[#24aa4d]/80 disabled:bg-gray-400"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
