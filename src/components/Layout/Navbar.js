import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import axios from "axios";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const notificationRef = useRef(null);
  const prevUnreadCountRef = useRef(0);

  const API_BASE = "http://localhost:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  const playNotificationSound = () => {
    const audio = new Audio("/assets/sounds/notification.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const [
        draftLeadsRes,
        openLeadsRes,
        convertedLeadsRes,
        unrealizedLeadsRes,
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
      ]);

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
        closed: 0,
        successful: convertedCount,
        totalClaims: 0,
        converted: convertedCount,
        unrealized: unrealizedCount,
      };

      setCounts(updatedCounts);

      localStorage.setItem("openLeadsCount", openCount.toString());
      localStorage.setItem("draftLeadsCount", draftsCount.toString());
      localStorage.setItem("convertedLeadsCount", convertedCount.toString());
      localStorage.setItem("unrealizedLeadsCount", unrealizedCount.toString());
    } catch (err) {
      console.error("Error fetching navbar counts:", err);
      const storedCounts = {
        drafts: parseInt(localStorage.getItem("draftLeadsCount") || "0"),
        open: parseInt(localStorage.getItem("openLeadsCount") || "0"),
        closed: parseInt(localStorage.getItem("closedLeadsCount") || "0"),
        successful: parseInt(
          localStorage.getItem("convertedLeadsCount") || "0"
        ),
        totalClaims: parseInt(localStorage.getItem("totalClaimsCount") || "0"),
        converted: parseInt(localStorage.getItem("convertedLeadsCount") || "0"),
        unrealized: parseInt(
          localStorage.getItem("unrealizedLeadsCount") || "0"
        ),
      };
      setCounts(storedCounts);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        const response = await axios.get(`${API_BASE}/test-notifications`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        setNotifications(response.data.data || []);
        setNotificationsLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE}/executive/notifications`, {
        headers: getAuthHeaders(),
      });

      let newNotifications = [];
      if (response.data && response.data.success !== undefined) {
        newNotifications = response.data.data || [];
      } else if (Array.isArray(response.data)) {
        newNotifications = response.data;
      }

      const newUnreadCount = newNotifications.filter((n) => !n.read).length;
      if (newUnreadCount > prevUnreadCountRef.current) {
        playNotificationSound();
      }
      prevUnreadCountRef.current = newUnreadCount;

      setNotifications(newNotifications);
    } catch (err) {
      console.error("Notifications error:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
      }
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read && notif.id) {
      try {
        await axios.post(
          `${API_BASE}/executive/notifications/mark-read`,
          { notification_ids: [notif.id] },
          { headers: getAuthHeaders() }
        );
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, read: 1 } : n))
        );
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    }

    const leadMatch = notif.message.match(
      /(?:Lead|lead)\s*(?:#|No\.?)?\s*([A-Za-z0-9]+)/i
    );
    const leadNo = leadMatch ? leadMatch[1].trim() : null;

    if (leadNo) {
      navigate(`/creditnote?lead=${encodeURIComponent(leadNo)}`);
    } else {
      navigate("/creditnote");
    }

    setShowNotifications(false);
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${API_BASE}/executive/notifications/mark-all-read`,
        {},
        { headers: getAuthHeaders() }
      );
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: 1 })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
      case "/creditnote":
        return "Credit Note";
      case "/creditnotedetails":
        return "Credit Note Details";

      default:
        return "Lead Management System";
    }
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <header className="bg-[var(--primary-blue)] text-white py-3 shadow-sm relative">
      <div className="navbar-container flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="sidebar-toggle-btn mr-4 text-2xl"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="page-title text-xl font-semibold">{getPageTitle()}</h1>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          {!loading && (
            <div className="hidden md:flex items-center space-x-3 text-xs">
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

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-white hover:text-gray-200 focus:outline-none relative"
              aria-label="Notifications"
            >
              <i className="bi bi-bell text-2xl"></i>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-gray-200">
                <div className="bg-[var(--primary-blue)] text-white px-4 py-3 flex justify-between items-center">
                  <h5 className="font-semibold">Notifications</h5>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/30"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notificationsLoading ? (
                    <div className="flex justify-center p-4">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <p className="text-gray-500 p-4 text-center">
                      No new notifications
                    </p>
                  ) : (
                    <div className="space-y-1 p-2">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-3 rounded-lg border-l-4 cursor-pointer transition-colors ${
                            notif.read
                              ? "bg-gray-50 border-gray-300 hover:bg-gray-100"
                              : "bg-blue-50 border-blue-500 hover:bg-blue-100"
                          }`}
                          onClick={() => handleNotificationClick(notif)}
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notif.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
