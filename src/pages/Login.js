// // src/pages/Login.js
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";

// export default function Login() {
//   const navigate = useNavigate();
//   const [showPin, setShowPin] = useState(false);
//   const [userId, setUserId] = useState("");
//   const [pin, setPin] = useState("");
//   const [error, setError] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     if (!userId || !pin) {
//       setError("Please fill in all required fields.");
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:8000/api/login", {
//         user_id: userId,
//         pin,
//       });

//       localStorage.setItem("token", response.data.token);
//       setError("");
//       navigate("/dashboard");
//     } catch (err) {
//       console.error(err);
//       if (err.response) {
//         const { status, data } = err.response;

//         if (status === 401) {
//           setError("Invalid User ID or PIN.");
//         } else if (status === 403) {
//           setError(data.error || "You do not have permission to login.");
//         } else if (status === 422 && data.errors) {
//           setError(Object.values(data.errors).flat().join(" "));
//         } else {
//           setError("Something went wrong. Please try again.");
//         }
//       } else {
//         setError("Network error. Please check your connection.");
//       }
//     }
//   };

//   //   const handleLogin = async (e) => {
//   //   e.preventDefault();

//   //   if (!userId || !pin) {
//   //     setError("Please fill in all required fields.");
//   //     return;
//   //   }

//   //   try {
//   //     // Env variable से URL लो
//   //     const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

//   //     const response = await axios.post(`${API_BASE_URL}/api/login`, {
//   //       user_id: userId,
//   //       pin,
//   //     });

//   //     localStorage.setItem("token", response.data.token);
//   //     setError("");
//   //     navigate("/dashboard");
//   //   } catch (err) {
//   //     console.error(err);
//   //     if (err.response && err.response.data && err.response.data.errors) {
//   //       setError(Object.values(err.response.data.errors).flat().join(" "));
//   //     } else {
//   //       setError("Invalid User ID or PIN.");
//   //     }
//   //   }
//   // };
//   const handlePinInput = (e) => {
//     // Allow only numeric input and limit to 4 digits
//     let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
//     setPin(value);
//   };

//   return (
//     <div
//       className="flex items-center justify-center min-h-screen"
//       style={{
//         background: "linear-gradient(135deg, #f0f7ff 0%, #e0ecff 100%)",
//         fontFamily: "'Montserrat', sans-serif",
//       }}
//     >
//       <div className="w-full max-w-md">
//         {/* Header with Logos */}
//         <div
//           className="rounded-t-2xl shadow-lg px-8 py-6 flex items-center justify-center gap-6"
//           style={{ backgroundColor: "#0f66af" }}
//         >
//           <img
//             src="/assets/images/logo/bajaj-icon2.svg"
//             alt="Bajaj Logo"
//             className="h-12 w-12"
//           />
//           {/* <div className="w-px bg-white/30 h-12"></div> */}
//           <img
//             src="/assets/images/logo/dist-logo.webp"
//             alt="Distributor Logo"
//             className="h-7 w-auto"
//           />
//         </div>

//         {/* Login Card */}
//         <div className="bg-white rounded-b-2xl shadow-xl px-10 pt-10 pb-12 -mt-1">
//           {/* Title */}
//           <h2
//             className="text-center text-2xl font-bold mb-10"
//             style={{ color: "#0f66af" }}
//           >
//             QikLeadz
//           </h2>

//           {/* Form */}
//           <form onSubmit={handleLogin} className="space-y-6">
//             {/* User ID Field */}
//             <div className="relative">
//               <i className="bi bi-person-circle absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500"></i>
//               <input
//                 type="text"
//                 placeholder="User ID"
//                 required
//                 value={userId}
//                 onChange={(e) => setUserId(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                 maxLength={10}
//               />
//             </div>

//             {/* PIN Field */}
//             <div className="relative">
//               <i className="bi bi-lock-fill absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500"></i>
//               <input
//                 type={showPin ? "text" : "password"}
//                 placeholder="PIN"
//                 required
//                 value={pin}
//                 onChange={handlePinInput}
//                 className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
//                 maxLength={4}
//               />
//               <span
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
//                 onClick={() => setShowPin(!showPin)}
//               >
//                 <i
//                   className={`bi ${
//                     showPin ? "bi-eye-slash" : "bi-eye"
//                   } text-lg`}
//                 ></i>
//               </span>
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between text-xs">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   className="w-4 h-4 text-blue-600 rounded"
//                   checked={rememberMe}
//                   onChange={() => setRememberMe(!rememberMe)}
//                 />
//                 <span className="text-gray-600">Remember me</span>
//               </label>
//               <Link
//                 to="/forgot-password"
//                 className="hover:underline"
//                 style={{ color: "#0f66af" }}
//               >
//                 Forgot PIN?
//               </Link>
//             </div>

//             {/* Error Message */}
//             {error && (
//               <div className="text-red-500 text-center text-sm py-2 bg-red-50 rounded-lg">
//                 {error}
//               </div>
//             )}

//             {/* Login Button - Outline Style */}
//             <button
//               type="submit"
//               className="w-full py-3 px-6 rounded-lg text-base font-semibold shadow-sm hover:shadow-lg transition-all duration-300"
//               style={{
//                 backgroundColor: "transparent",
//                 color: "#0f66af",
//                 border: "2px solid #0f66af",
//                 fontWeight: "600",
//               }}
//               onMouseOver={(e) => {
//                 e.target.style.backgroundColor = "#0f66af";
//                 e.target.style.color = "white";
//                 e.target.style.transform = "translateY(-2px)";
//               }}
//               onMouseOut={(e) => {
//                 e.target.style.backgroundColor = "transparent";
//                 e.target.style.color = "#0f66af";
//                 e.target.style.transform = "translateY(0)";
//               }}
//             >
//               Login
//             </button>
//           </form>

//           {/* Footer - Centered */}
//           <footer className="mt-4 py-2">
//             <div className="flex justify-center items-center">
//               {/* Powered By Section - Centered */}
//               <div className="flex items-center">
//                 <span className="text-gray-500 text-xs border-r pr-2">
//                   <i className="bi bi-lightning-charge-fill mr-1"></i>Powered by
//                 </span>
//                 <img
//                   src="/assets/images/logo/2.svg"
//                   alt="Powered By Logo"
//                   className="h-7 ml-2"
//                 />
//               </div>
//             </div>
//           </footer>
//         </div>
//       </div>
//     </div>
//   );
// }



// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [showPin, setShowPin] = useState(false);
  const [userId, setUserId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userId || !pin) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        user_id: userId,
        pin,
      });

      localStorage.setItem("token", response.data.token);
      setError("");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.response) {
        const { status, data } = err.response;

        if (status === 401) {
          setError("Invalid User ID or PIN.");
        } else if (status === 403) {
          setError(data.error || "You do not have permission to login.");
        } else if (status === 422 && data.errors) {
          setError(Object.values(data.errors).flat().join(" "));
        } else {
          setError("Something went wrong. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  const handlePinInput = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
    setPin(value);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{
        background: "linear-gradient(135deg, rgb(240 247 255 / 0%) 0%, rgb(230 239 255) 100%)",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div className="w-full max-w-xs">
        {/* Header with Logos - Original Design */}
        <div
          className="rounded-t-xl px-6 py-4 flex items-center justify-center gap-6"
          style={{ backgroundColor: "#0f66af" }}
        >
          <img
            src="/assets/images/logo/bajaj-icon2.svg"
            alt="Bajaj Logo"
            className="h-10 w-10"
          />
          <img
            src="/assets/images/logo/dist-logo.webp"
            alt="Distributor Logo"
            className="h-5 w-auto"
          />
        </div>

        {/* Login Card - Compact */}
        <div className="bg-white rounded-b-xl shadow-md px-5 pt-6 pb-6 -mt-1">
          {/* Title */}
          <h2
            className="text-center text-xl font-bold mb-6"
            style={{ color: "#0f66af" }}
          >
            QikLeadz
          </h2>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* User ID Field */}
            <div className="relative">
              <i className="bi bi-person-circle absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                placeholder="User ID"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                maxLength={10}
              />
            </div>

            {/* PIN Field */}
            <div className="relative">
              <i className="bi bi-lock-fill absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
              <input
                type={showPin ? "text" : "password"}
                placeholder="PIN"
                required
                value={pin}
                onChange={handlePinInput}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                maxLength={4}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPin(!showPin)}
              >
                <i
                  className={`bi ${
                    showPin ? "bi-eye-slash" : "bi-eye"
                  } text-gray-500`}
                ></i>
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 text-blue-600 rounded"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="hover:underline"
                style={{ color: "#0f66af" }}
              >
                Forgot PIN?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center text-xs py-1.5 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Login Button - Solid Style */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
              style={{
                backgroundColor: "#0f66af",
                color: "white",
              }}
            >
              Login
            </button>
          </form>

          {/* Footer - Centered */}
          <footer className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-center items-center">
              <div className="flex items-center">
                <span className="text-gray-500 text-xs border-r pr-2">
                  <i className="bi bi-lightning-charge-fill mr-1"></i>Powered by
                </span>
                <img
                  src="/assets/images/logo/2.svg"
                  alt="Powered By Logo"
                  className="h-5 ml-2"
                />
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}