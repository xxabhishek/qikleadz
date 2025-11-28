// src/components/Layout/Footer.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Footer */}
      <footer className="hidden lg:block bg-gray-200 text-center p-2">
        <p>© {new Date().getFullYear()} Executive Panel</p>
      </footer>

      {/* Mobile Bottom Navigation */}
      <footer className="lg:hidden">
        <nav className="bottom-nav">
          <button
            onClick={() => navigate("/dashboard")}
            className={`bottom-nav-item ${
              isActive("/dashboard") ? "active" : ""
            }`}
          >
            <i className="bi bi-house-door-fill"></i>
            <span>Home</span>
          </button>
          <button
            onClick={() => navigate("/leads/open")}
            className={`bottom-nav-item ${
              isActive("/leads/open") ? "active" : ""
            }`}
          >
            <i className="bi bi-people-fill"></i>
            <span>Leads</span>
          </button>
          <button
            onClick={() => navigate("/leads/generate")}
            className={`bottom-nav-item ${
              isActive("/leads/generate") ? "active" : ""
            }`}
          >
            <i className="bi bi-plus-circle-fill"></i>
            <span>Add Lead</span>
          </button>
          <button
            onClick={() => navigate("/credit")}
            className={`bottom-nav-item ${isActive("/credit") ? "active" : ""}`}
          >
            <i className="bi bi-file-earmark-text"></i>
            <span>Credit</span>
          </button>
          <button
            onClick={() => navigate("/invoice")}
            className={`bottom-nav-item ${
              isActive("/invoice") ? "active" : ""
            }`}
          >
            <i className="bi bi-receipt"></i>
            <span>Invoice</span>
          </button>
        </nav>
      </footer>

      <style>
        {`
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  font-size: 11px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  min-width: 60px;
  text-decoration: none;
  cursor: pointer;
  border: none;
  background: transparent;
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.bottom-nav-item i {
  font-size: 1.5rem; /* Increased from 1.25rem to 1.5rem */
  transition: all 0.3s ease;
}

.bottom-nav-item:hover,
.bottom-nav-item.active {
  color: #0f66af;
  background-color: #e0f2fe;
}

.bottom-nav-item:hover i,
.bottom-nav-item.active i {
  color: #0f66af;
  transform: scale(1.15);
}

/* Hide bottom nav on desktop */
@media (min-width: 1024px) {
  .bottom-nav {
    display: none;
  }
}

/* Ensure proper spacing for mobile */
@media (max-width: 768px) {
  body {
    padding-bottom: 80px;
  }
}
        `}
      </style>
    </>
  );
}
