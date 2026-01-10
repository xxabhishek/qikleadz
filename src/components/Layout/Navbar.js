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
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);

  // User state - अब API से fetch होगा
  const [user, setUser] = useState({
    name: "Loading...",
    email: "",
  });

  const API_BASE = "http://localhost:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  // User profile fetch करना (Profile पेज जैसा ही नाम दिखाने के लिए)
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get(`${API_BASE}/user/profile`, {
        headers: getAuthHeaders(),
      });

      const fetchedUser = res.data.user;
      setUser(fetchedUser);

      // localStorage को update कर दें ताकि अन्य components में भी latest data मिले
      localStorage.setItem("user", JSON.stringify(fetchedUser));
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // Fallback: localStorage से पढ़ लो
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) {
        setUser(stored || { name: "Guest", email: "" });
      }
    }
  };

  const playNotificationSound = () => {
    const audio = new Audio("/assets/sounds/text.mp3");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const fetchCounts = async () => {
    try {
      setLoading(true);

      const [draftLeadsRes, openLeadsRes, unrealizedLeadsRes, claimsCountsRes] =
        await Promise.all([
          axios.get(`${API_BASE}/lead-details/draft`, {
            headers: getAuthHeaders(),
          }),
          axios.get(`${API_BASE}/lead-details/open`, {
            headers: getAuthHeaders(),
          }),
          axios.get(`${API_BASE}/leads?status=Unrealized`, {
            headers: getAuthHeaders(),
          }),
          axios.get(`${API_BASE}/claims/all-counts`, {
            headers: getAuthHeaders(),
          }),
        ]);

      const draftsCount = draftLeadsRes.data.data?.length || 0;
      const openCount = Array.isArray(openLeadsRes.data.data)
        ? openLeadsRes.data.data.length
        : openLeadsRes.data.count || 0;

      const unrealizedCount = Array.isArray(unrealizedLeadsRes.data)
        ? unrealizedLeadsRes.data.length
        : unrealizedLeadsRes.data?.length || 0;

      const totalClaimsCount = claimsCountsRes.data.success
        ? claimsCountsRes.data.data.total || 0
        : 0;

      let convertedCount = 0;
      try {
        const convertedLeadsRes = await axios.get(
          `${API_BASE}/leads?status=converted`,
          {
            headers: getAuthHeaders(),
          }
        );
        convertedCount =
          convertedLeadsRes.data?.data?.length ||
          convertedLeadsRes.data?.count ||
          0;
      } catch (err) {
        console.warn("Failed to fetch converted leads from leads table:", err);
        convertedCount = 0;
      }

      const updatedCounts = {
        drafts: draftsCount,
        open: openCount,
        closed: 0,
        successful: convertedCount,
        totalClaims: totalClaimsCount,
        converted: convertedCount,
        unrealized: unrealizedCount,
      };

      setCounts(updatedCounts);

      localStorage.setItem("openLeadsCount", openCount.toString());
      localStorage.setItem("draftLeadsCount", draftsCount.toString());
      localStorage.setItem("convertedLeadsCount", convertedCount.toString());
      localStorage.setItem("unrealizedLeadsCount", unrealizedCount.toString());
      localStorage.setItem("totalClaimsCount", totalClaimsCount.toString());
    } catch (err) {
      console.error("Error fetching navbar counts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = token
        ? await axios.get(`${API_BASE}/executive/notifications`, {
            headers: getAuthHeaders(),
          })
        : await axios.get(`${API_BASE}/test-notifications`);

      let newNotifications = response.data.success
        ? response.data.data || []
        : Array.isArray(response.data)
        ? response.data
        : [];

      const newUnreadCount = newNotifications.filter((n) => !n.read).length;
      if (newUnreadCount > prevUnreadCountRef.current && newUnreadCount > 0) {
        playNotificationSound();
      }
      prevUnreadCountRef.current = newUnreadCount;

      setNotifications(newNotifications);
    } catch (err) {
      console.error("Notifications error:", err);
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.read) {
      try {
        await axios.post(
          `${API_BASE}/executive/notifications/mark-read`,
          { notification_id: notif.id },
          { headers: getAuthHeaders() }
        );
        setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
      } catch (err) {
        console.error("Error marking notification as read:", err);
      }
    }

    const leadMatch = notif.message.match(
      /(?:Lead|lead)\s*(?:#|No\.?)?\s*([A-Za-z0-9]+)/i
    );
    const leadNo = leadMatch ? leadMatch[1].trim() : null;
    navigate(
      leadNo ? `/creditnote?lead=${encodeURIComponent(leadNo)}` : "/creditnote"
    );
    setShowNotifications(false);
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        `${API_BASE}/executive/notifications/mark-all-read`,
        {},
        { headers: getAuthHeaders() }
      );
      setNotifications([]);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    fetchUserData(); // User name fetch
    fetchCounts();
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [location]);

  // Close notifications on outside click
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

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      "/dashboard": "Dashboard",
      "/leads/generate": "Lead Generation",
      "/model-details": "Model Details",
      "/leadinformation": "Lead Information",
      "/leads/summary": "Lead Summary",
      "/leads/open": `Open Leads (${counts.open})`,
      "/leads/closed": `Closed Leads (${counts.closed})`,
      "/leads/successful": `Successful Leads (${counts.successful})`,
      "/leads/total-claim": `Total Claims (${counts.totalClaims})`,
      "/leads/draft": `Draft Leads (${counts.drafts})`,
      "/leads/converted": `Converted Leads (${counts.converted})`,
      "/leads/unrealized": `Unrealized Leads (${counts.unrealized})`,
      "/creditnote": "Credit Note",
      "/creditnotedetails": "Credit Note Details",
      "/profile": "My Profile",
      "/earnings": "Earnings",
    };
    return titles[path] || "Lead Management System";
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

          {/* Notifications */}
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
                          className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all ${
                            notif.read
                              ? "bg-gray-50 border-gray-300 hover:bg-gray-100 opacity-80"
                              : "bg-blue-50 border-blue-500 hover:bg-blue-100 font-semibold shadow-sm"
                          }`}
                          onClick={() => handleNotificationClick(notif)}
                        >
                          <p
                            className={`text-sm ${
                              notif.read ? "text-gray-600" : "text-gray-900"
                            }`}
                          >
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

          {/* Profile Dropdown - Profile पेज वाला ही नाम दिखेगा */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 text-white hover:text-gray-200 focus:outline-none"
              aria-label="User menu"
            >
              <i className="bi bi-person-circle text-2xl"></i>
              <span className="hidden md:block text-sm font-medium">
                {user.name}
              </span>
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-xl z-50 border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 bg-[var(--primary-blue)] text-white shadow-sm relative">
                  <div className="flex items-center space-x-3">
                    <i className="bi bi-person-circle text-4xl"></i>
                    <div>
                      <p className="text-lg font-bold">{user.name}</p>
                      <p className="text-sm opacity-90 truncate">
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    to="/profile"
                    className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => setShowProfile(false)}
                  >
                    <i className="bi bi-person me-3 text-lg"></i>
                    <span>My Profile</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
