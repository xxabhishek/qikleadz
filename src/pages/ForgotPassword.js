import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/forgot-password",
        {
          email,
        }
      );

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError("Unable to send reset link.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm text-gray-700">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {message && <p className="text-green-600 mt-2">{message}</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white mt-4 py-2 rounded"
          >
            Send Reset Link
          </button>
          <a href="/" className="text-[#0f66af] text-sm hover:underline">
            Go To Login
          </a>
        </form>
      </div>
    </div>
  );
}
