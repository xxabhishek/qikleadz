import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  BarChart2,
  Settings,
  LogOut,
  FileText,
  Globe,
} from "lucide-react";
import Swal from "sweetalert2";
import GoogleTranslate from "../GoogleTranslate";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [drafts, setDrafts] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState("English");

  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // NEW

  useEffect(() => {
    const storedDrafts = JSON.parse(localStorage.getItem("draftLeads")) || [];
    setDrafts(storedDrafts);

    const savedLanguage =
      localStorage.getItem("preferredLanguage") || "English";
    setCurrentLanguage(savedLanguage);
  }, [location]);

  const menuItems = [
    { path: "/dashboard", label: "Home", icon: Home },
    { path: "/leads/generate", label: "Leads", icon: Users },
    { path: "/reports", label: "Reports", icon: BarChart2 },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  // ----------------- MOBILE LOGOUT POPUP -----------------
  const handleLogout = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("preferredLanguage");
    window.location.href = "/";
  };

  // ----------------- LANGUAGE CHANGE -----------------
  const handleLanguageChange = () => {
    Swal.fire({
      title: "Change Language",
      input: "select",
      inputOptions: {
        en: "English",
        hi: "Hindi",
        es: "Spanish",
        fr: "French",
        de: "German",
      },
      inputValue: getCurrentLanguageCode(),
      showCancelButton: true,
      confirmButtonText: "Change Language",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const languageMap = {
          en: "English",
          hi: "Hindi",
          es: "Spanish",
          fr: "French",
          de: "German",
        };

        const newLanguage = languageMap[result.value];
        setCurrentLanguage(newLanguage);
        localStorage.setItem("preferredLanguage", newLanguage);

        Swal.fire({
          title: "Language Changed!",
          text: `Application language changed to ${newLanguage}`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  };

  const getCurrentLanguageCode = () => {
    const languageMap = {
      English: "en",
      Hindi: "hi",
      Spanish: "es",
      French: "fr",
      German: "de",
    };
    return languageMap[currentLanguage] || "en";
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col p-4 h-full">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img
              src="assets/images/logo/bajaj-logo2.svg"
              alt="Logo"
              className="h-10 object-contain"
            />
          </div>

          {/* Menu Items */}
          <ul className="space-y-3 flex-1">
            {menuItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={toggleSidebar}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === path
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              </li>
            ))}
{/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
            {/* Change Language Section */}
            
          </ul>

          {/* Drafts Section */}
          {drafts.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Drafts
              </h4>
              <ul className="space-y-2">
                {drafts.map((draft) => (
                  <li key={draft.id}>
                    <Link
                      to="/leads/generate"
                      state={{ draft }}
                      onClick={toggleSidebar}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                    >
                      <FileText size={16} />
                      {draft.customerName || "Unnamed Lead"}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {showLogoutPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[999]">
    <div className="bg-white w-80 p-6 rounded-2xl shadow-xl scale-up">
      <h3 className="text-lg font-semibold text-gray-800 text-center">
        Logout
      </h3>

      <p className="text-sm text-gray-600 text-center mt-2">
        Are you sure you want to logout?
      </p>

      <div className="mt-6 space-y-3">
        <button
          onClick={confirmLogout}
          className="w-full py-3 bg-blue-200 text-black rounded-xl font-semibold"
        >
          Logout
        </button>

        <button
          onClick={() => setShowLogoutPopup(false)}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}
