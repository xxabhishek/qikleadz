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
      <footer className="hidden lg:block bg-gray-200 text-center py-4 px-4 mt-8">
        <p className="text-gray-700 font-medium">
          © {new Date().getFullYear()} Executive Panel. All rights reserved.
        </p>
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
            <i className="bi bi-house-door-fill text-xl"></i>
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => navigate("/leads/open")}
            className={`bottom-nav-item ${
              isActive("/leads/open") ? "active" : ""
            }`}
          >
            <i className="bi bi-people-fill text-xl"></i>
            <span className="text-xs mt-1">Leads</span>
          </button>
          <button
            onClick={() => navigate("/leads/generate")}
            className={`bottom-nav-item ${
              isActive("/leads/generate") ? "active" : ""
            }`}
          >
            <i className="bi bi-plus-circle-fill text-xl"></i>
            <span className="text-xs mt-1">Add Lead</span>
          </button>
          <button
            onClick={() => navigate("/creditnote")}
            className={`bottom-nav-item ${isActive("/credit") ? "active" : ""}`}
          >
            <i className="bi bi-file-earmark-text text-xl"></i>
            <span className="text-xs mt-1">Credit</span>
          </button>
          <button
            onClick={() => navigate("/invoice")}
            className={`bottom-nav-item ${
              isActive("/invoice") ? "active" : ""
            }`}
          >
            <i className="bi bi-receipt text-xl"></i>
            <span className="text-xs mt-1">Invoice</span>
          </button>
        </nav>
      </footer>

      <style>
        {`
          /* Desktop Footer Styling */
          .hidden.lg\\:block {
            margin-top: auto; /* Push footer to bottom */
          }

          /* Mobile Bottom Navigation */
          .bottom-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 12px 0;
            z-index: 1000;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
            height: 70px;
            box-sizing: border-box;
          }

          .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            color: #6b7280;
            font-weight: 500;
            padding: 8px 12px;
            border-radius: 12px;
            transition: all 0.3s ease;
            min-width: 64px;
            text-decoration: none;
            cursor: pointer;
            border: none;
            background: transparent;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            flex: 1;
            max-width: 80px;
          }

          .bottom-nav-item i {
            font-size: 1.35rem;
            transition: all 0.3s ease;
          }

          .bottom-nav-item span {
            font-size: 0.7rem;
            line-height: 1;
          }

          .bottom-nav-item:hover,
          .bottom-nav-item.active {
            color: #0f66af;
            background-color: rgba(14, 102, 175, 0.1);
          }

          .bottom-nav-item:hover i,
          .bottom-nav-item.active i {
            color: #0f66af;
            transform: translateY(-2px);
          }

          .bottom-nav-item.active {
            font-weight: 600;
          }

          /* Add safe area for mobile devices with notches */
          @supports (padding-bottom: env(safe-area-inset-bottom)) {
            .bottom-nav {
              padding-bottom: calc(12px + env(safe-area-inset-bottom));
            }
          }

          /* Content spacing for mobile */
          @media (max-width: 1023px) {
            body, #root, .app-container {
              padding-bottom: 70px !important;
            }
            
            .page-content {
              margin-bottom: 70px;
            }
          }

          /* Hide bottom nav on desktop */
          @media (min-width: 1024px) {
            .bottom-nav {
              display: none;
            }
          }

          /* Extra small devices */
          @media (max-width: 375px) {
            .bottom-nav {
              height: 65px;
              padding: 10px 0;
            }
            
            .bottom-nav-item {
              padding: 6px 8px;
              min-width: 56px;
            }
            
            .bottom-nav-item i {
              font-size: 1.25rem;
            }
            
            .bottom-nav-item span {
              font-size: 0.65rem;
            }
          }
        `}
      </style>
    </>
  );
}
