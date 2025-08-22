import React, { useState, useEffect, useContext } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import DefaultImage from "../assets/images/DefaultImage.jpg"

export const ProfileScreen = () => {
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePic: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const API = axios.create({ baseURL: "http://localhost:5001" });

  const confirmSave = () => {
    setShowModal(false);
    handleSubmit(); // submit profile changes
  };

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setProfile({
          name: res.data.success.name || "",
          email: res.data.success.email || "",
          profilePic: res.data.success.profilePic || ""
        });
      } catch (err) {
        console.log(err);
      }
    };
    if (user?.token) fetchProfile();
  }, [user]);

  // Handle input changes
  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  // Handle image upload + compress
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 300; // max width or height
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 70% quality
        setProfile({ ...profile, profilePic: compressedBase64 });
      };
    };
    reader.readAsDataURL(file);
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.put(
        "/auth/update-profile",
        {
          name: profile.name,
          email: profile.email,
          profilePic: profile.profilePic
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Profile updated successfully!");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto mt-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Edit Profile
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 flex flex-col items-center w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
                <img
                    src={profile.profilePic || DefaultImage}
                    alt="Profile"
                    className="w-15 h-15 md:w-24 md:h-24 rounded-full mb-2 object-cover border-2 border-gray-300 dark:border-gray-600"
                    />

                {/* File Input */}
                <label className="mt-2 cursor-pointer px-4 py-2 bg-dark text-white rounded-lg hover:bg-secondary transition-colors duration-300">
                Change Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
            </div>

            {/* Name Input */}
            <input
                type="text"
                name="name"
                value={profile.name || ""}
                onChange={handleChange}
                placeholder="Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-primary"
            />

            {/* Email Input */}
            <input
                type="email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-primary"
            />

            {/* Save Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-dark text-white rounded-lg hover:bg-secondary transition-colors duration-300"
                >
                {loading ? "Saving..." : "Save Profile"}
            </button>
        </form>
      </div>
    </DashboardLayout>
  );
};
