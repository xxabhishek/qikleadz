// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios for API calls

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); // changed from username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(" http://localhost:8000/api/login", {
        email, // replaced username with email
        password,
      });

      // Assuming the API returns { token: "..." }
      localStorage.setItem("token", response.data.token);
      setError("");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        setError(Object.values(err.response.data.errors).flat().join(" "));
      } else {
        setError("Invalid email or password.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="w-full max-w-sm sm:max-w-md p-4">
        <div className="bg-[#f2f9ff] p-6 sm:p-8 rounded-lg shadow-sm animate-fadeIn">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src="/assets/images/logo/bajaj-logo1.svg"
              alt="Logo"
              className="w-full max-h-12 mx-auto mb-3"
            />
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative">
            {/* Email */}
            <div>
              <label className="block text-gray-500 text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0f66af]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-500 text-sm mb-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0f66af]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/* toggle icon */}
              </span>
            </div>

            {/* Remember + Forgot */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  className="h-4 w-4 text-[#0f66af] border-gray-300 rounded focus:ring-[#0f66af]"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <label
                  htmlFor="rememberMe"
                  className="ml-2 text-gray-500 text-sm"
                >
                  Remember me
                </label>
              </div>
              <a href="#" className="text-[#0f66af] text-sm hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-500 text-center text-sm mt-2">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#0f66af] text-white py-2 rounded-md text-sm hover:bg-[#084a8a] hover:scale-105 transition-all duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
