// src/pages/ForgotPassword.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.38:8000/api/forgot-password",
        {
          email,
        }
      );

      setMessage("Password reset link has been sent to your email");
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f0f7ff 0%, #e0ecff 100%)",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div className="w-full max-w-md">
        {/* Header with Logos */}
        <div
          className="rounded-t-2xl shadow-lg px-8 py-6 flex items-center justify-center gap-6"
          style={{ backgroundColor: "#0f66af" }}
        >
          <img
            src="/assets/images/logo/bajaj-icon1.svg"
            alt="Bajaj Logo"
            className="h-12 w-12"
          />
          <div className="w-px bg-white/30 h-12"></div>
          <img
            src="/assets/images/logo/dist-logo.webp"
            alt="Distributor Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-b-2xl shadow-xl px-10 pt-10 pb-12 -mt-1">
          {/* Title */}
          <h2
            className="text-center text-2xl font-bold mb-4"
            style={{ color: "#0f66af" }}
          >
            Forgot Password?
          </h2>
          <p className="text-center text-sm text-gray-600 mb-10">
            Enter your registered email id.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <i className="bi bi-person-circle absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500"></i>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center text-sm py-2 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="text-green-500 text-center text-sm py-2 bg-green-50 rounded-lg">
                {message}
              </div>
            )}

            {/* Submit Button - Outline Style */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-6 rounded-lg text-base font-semibold shadow-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "transparent",
                color: "#0f66af",
                border: "2px solid #0f66af",
                fontWeight: "600",
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "#0f66af";
                  e.target.style.color = "white";
                  e.target.style.transform = "translateY(-2px)";
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading) {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#0f66af";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link
                to="/"
                className="text-sm hover:underline"
                style={{ color: "#0f66af" }}
              >
                Back to Login
              </Link>
            </div>
          </form>

          {/* Footer - Centered */}
          <footer className="mt-4 py-2">
            <div className="flex justify-center items-center">
              {/* Powered By Section - Centered */}
              <div className="flex items-center">
                <span className="text-gray-500 text-xs border-r pr-2">
                  <i className="bi bi-lightning-charge-fill mr-1"></i>Powered by
                </span>
                <img
                  src="/assets/images/logo/2.svg"
                  alt="Powered By Logo"
                  className="h-7 ml-2"
                />
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
