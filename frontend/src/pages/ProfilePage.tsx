import React, { useEffect, useState } from "react";
import api from "../api"; // axios instance
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      setProfile(res.data);
    } catch (err) {
      console.error("Profile fetch error", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const updateProfile = async () => {
    try {
      await api.put("/user/profile", profile);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error", err);
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <Navbar />
      <div className="flex w-full h-screen bg-gray-100">
        {/** ---------- LEFT SIDEBAR ---------- */}
        <aside className="w-64 bg-white shadow-md p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-gray-800">Settings</h2>
          <nav className="flex flex-col gap-3 text-gray-600">
            <a className="font-semibold text-blue-600">Profile</a>
            <a>Account</a>
            <a>Security</a>
            <a>Notifications</a>
          </nav>
        </aside>

        {/** ---------- MAIN CONTENT ---------- */}
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-semibold mb-6 text-gray-800">
            Profile Settings
          </h1>

          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            {/** ---------- PROFILE HEADER ---------- */}
            <div className="flex items-center gap-6 mb-10">
              <img
                src={profile.avatar || "https://via.placeholder.com/80"}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover"
              />

              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {profile.name || "Your Name"}
                </h2>
                <p className="text-gray-500">{profile.email}</p>
              </div>
            </div>

            {/** ---------- FORM ---------- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            {/** ---------- BUTTON ---------- */}
            <div className="mt-10 text-right">
              <button
                onClick={updateProfile}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
