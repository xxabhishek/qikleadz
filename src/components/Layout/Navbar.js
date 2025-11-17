import React, { useEffect, useState } from "react";
import { List, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const location = useLocation();
  const [counts, setCounts] = useState({
    drafts: 0,
    open: 0,
    closed: 0,
    successful: 0,
    totalClaims: 0,
  });

  useEffect(() => {
    // Example: fetch counts dynamically (for now from localStorage)
    const draftLeads = JSON.parse(localStorage.getItem("draftLeads")) || [];

    // You can extend this with more counts from localStorage or an API
    const updatedCounts = {
      drafts: draftLeads.length,
      open: parseInt(localStorage.getItem("openLeadsCount") || 0),
      closed: parseInt(localStorage.getItem("closedLeadsCount") || 0),
      successful: parseInt(localStorage.getItem("successfulLeadsCount") || 0),
      totalClaims: parseInt(localStorage.getItem("totalClaimsCount") || 0),
    };

    setCounts(updatedCounts);
  }, [location]); // refresh counts when route changes

  // Function to get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;

    switch (path) {
      case "/dashboard":
        return "Dashboard";

      case "/leads/generate":
        return "Lead Generation";

      case "/model-details":
        return "Model Details";

      case "/leadinformation":
        return "Lead Information";

      case "/leads/summary":
        return "Lead Summary";

      case "/leads/open":
        return `Open Leads (${counts.open})`;

      case "/leads/closed":
        return `Closed Leads (${counts.closed})`;

      case "/leads/successful":
        return `Successful Leads (${counts.successful})`;

      case "/leads/total-claim":
        return `Total Claims (${counts.totalClaims})`;

      case "/leads/draft":
        return `Draft Leads (${counts.drafts})`;

      case "/lead-inormationold":
        return "Lead Information";

      default:
        if (path.startsWith("/leads/")) {
          const routeName = path.split("/").pop();
          return `${
            routeName.charAt(0).toUpperCase() + routeName.slice(1)
          } Leads`;
        }
        return "Lead Management System";
    }
  };

  return (
    <header className="bg-[var(--primary-blue)] text-white py-3 shadow-sm relative">
      <div className="navbar-container">
        {/* Left Section: Toggle Button and Bajaj Logo */}
        <div className="navbar-left-section">
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <i className="bi bi-list"></i>
          </button>

          <img
            src="assets/images/logo/bajaj-icon1.svg"
            alt="Bajaj Logo"
            className="bajaj-logo"
          />
        </div>

        {/* Right Section: Distributor Logo */}
        <div className="navbar-right-section">
          <img
            src="assets/images/logo/dist-logo.webp"
            alt="Distributor Logo"
            className="distributor-logo"
          />
        </div>
      </div>
    </header>
  );
}