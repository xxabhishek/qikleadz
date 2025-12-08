import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const location = useLocation();
  const [counts, setCounts] = useState({
    drafts: 0,
    open: 0,
    closed: 0,
    successful: 0,
    totalClaims: 0,
    converted: 0,
    unrealized: 0,
  });
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://192.168.1.38:8000/api";
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  const fetchCounts = async () => {
    try {
      setLoading(true);

      // Fetch all counts in parallel
      const [
        draftLeadsRes,
        openLeadsRes,
        convertedLeadsRes,
        unrealizedLeadsRes,
        closedLeadsRes,
      ] = await Promise.all([
        axios.get(`${API_BASE}/lead-details/draft`, {
          headers: getAuthHeaders(),
        }),
        axios.get(`${API_BASE}/lead-details/open`, {
          headers: getAuthHeaders(),
        }),
        axios.get(`${API_BASE}/leads?status=converted`, {
          headers: getAuthHeaders(),
        }),
        axios.get(`${API_BASE}/leads?status=Unrealized`, {
          headers: getAuthHeaders(),
        }),
        // Add more API calls for other counts if available
        Promise.resolve({ data: { length: 0 } }), // Placeholder for closed
      ]);

      // Get counts from responses
      const draftsCount = draftLeadsRes.data.data?.length || 0;
      const openCount = Array.isArray(openLeadsRes.data.data)
        ? openLeadsRes.data.data.length
        : openLeadsRes.data.data || 0;
      const convertedCount = Array.isArray(convertedLeadsRes.data)
        ? convertedLeadsRes.data.length
        : convertedLeadsRes.data?.length || 0;
      const unrealizedCount = Array.isArray(unrealizedLeadsRes.data)
        ? unrealizedLeadsRes.data.length
        : unrealizedLeadsRes.data?.length || 0;

      const updatedCounts = {
        drafts: draftsCount,
        open: openCount,
        closed: 0, // Update this if you have API for closed leads
        successful: convertedCount, // Using converted as successful
        totalClaims: 0, // Update this if you have claims API
        converted: convertedCount,
        unrealized: unrealizedCount,
      };

      setCounts(updatedCounts);

      // Store in localStorage for Dashboard.js to use (optional)
      localStorage.setItem("openLeadsCount", openCount.toString());
      localStorage.setItem("draftLeadsCount", draftsCount.toString());
      localStorage.setItem("convertedLeadsCount", convertedCount.toString());
      localStorage.setItem("unrealizedLeadsCount", unrealizedCount.toString());
    } catch (err) {
      console.error("Error fetching navbar counts:", err);
      // Fallback to localStorage if API fails
      const storedCounts = {
        drafts: parseInt(localStorage.getItem("draftLeadsCount") || 0),
        open: parseInt(localStorage.getItem("openLeadsCount") || 0),
        closed: parseInt(localStorage.getItem("closedLeadsCount") || 0),
        successful: parseInt(localStorage.getItem("convertedLeadsCount") || 0),
        totalClaims: parseInt(localStorage.getItem("totalClaimsCount") || 0),
        converted: parseInt(localStorage.getItem("convertedLeadsCount") || 0),
        unrealized: parseInt(localStorage.getItem("unrealizedLeadsCount") || 0),
      };
      setCounts(storedCounts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch counts when component mounts and when route changes
    fetchCounts();
  }, [location]);

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

      case "/leads/converted":
        return `Converted Leads (${counts.converted})`;

      case "/leads/unrealized":
        return `Unrealized Leads (${counts.unrealized})`;

      case "/lead-inormationold":
        return "Lead Information";

      case "/creditnote":
        return "Credit Note";

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
        {/* Left Section */}
        <div className="navbar-left-section">
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        {/* CENTER: PAGE TITLE */}
        <div className="navbar-center-section">
          <h1 className="page-title me-4 text-start">{getPageTitle()}</h1>
          {loading && (
            <span className="text-xs text-blue-200 ml-2 flex items-center">
              <i className="bi bi-arrow-clockwise animate-spin mr-1"></i>
              updating...
            </span>
          )}
        </div>

        {/* Right Section - Counts Summary (Optional) */}
        <div className="navbar-right-section">
          {!loading && (
            <div className="hidden md:flex items-center space-x-2 text-xs">
              <span className="bg-white/20 px-2 py-1 rounded">
                Drafts: {counts.drafts}
              </span>
              <span className="bg-white/20 px-2 py-1 rounded">
                Open: {counts.open}
              </span>
              <span className="bg-white/20 px-2 py-1 rounded">
                Converted: {counts.converted}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
