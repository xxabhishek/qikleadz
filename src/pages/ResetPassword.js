import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://192.168.1.38:8000/api/reset-password",
        {
          token,
          email,
          password,
          password_confirmation: confirmPassword,
        }
      );

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError("Invalid token or password mismatch.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>

        <form onSubmit={handleReset}>
          <label className="block mb-2 text-sm">New Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block mt-3 mb-2 text-sm">Confirm Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {message && <p className="text-green-600 mt-2">{message}</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button className="w-full bg-blue-600 text-white mt-4 py-2 rounded">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
