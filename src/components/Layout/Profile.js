// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return (window.location.href = "/");

      const res = await axios.get("http://localhost:8000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
      setLoading(false);
    } catch (err) {
      setError("Session expired. Please login again.");
      localStorage.removeItem("token");
      setLoading(false);
    }
  };

  const handleChangePin = async (e) => {
    e.preventDefault();
    if (newPin !== confirmPin)
      return Swal.fire("Error", "PIN does not match", "error");

    setPinLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/user/change-pin",
        { old_pin: oldPin, new_pin: newPin },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire("Success", "PIN updated", "success");
      setOldPin("");
      setNewPin("");
      setConfirmPin("");
    } catch {
      Swal.fire("Error", "Incorrect current PIN", "error");
    } finally {
      setPinLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <button
          onClick={() => (window.location.href = "/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Login Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-sm mx-auto">
        {/* App Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-semibold">
            {user.name[0]}
          </div>
          <h1 className="mt-3 text-xl font-semibold">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-xl p-4 mb-5">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-500">User ID</span>
            <span className="font-medium">{user.user_id}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-500">Mobile</span>
            <span className="font-medium">{user.mobile || "NA"}</span>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-500">Role</span>
            <span className="font-medium capitalize">
              {user.role_name || "Sales Executive"}
            </span>
          </div>
        </div>

        {/* Change PIN */}
        <div className="bg-white rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-4">Change PIN</h2>

          <form onSubmit={handleChangePin} className="space-y-3">
            <input
              type="password"
              placeholder="Current PIN"
              maxLength="4"
              value={oldPin}
              onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="New PIN"
              maxLength="4"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Confirm PIN"
              maxLength="4"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
              className="w-full px-4 py-3 border rounded-lg"
              required
            />

            <button
              type="submit"
              disabled={pinLoading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg"
            >
              {pinLoading ? "Updating..." : "Update PIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
