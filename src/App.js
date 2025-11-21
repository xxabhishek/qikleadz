// src/App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import LeadGen from "./pages/LeadGen/LeadGen";
import ModelDetails from "./pages/LeadGen/ModelDetails";
import LeadInformation from "./pages/LeadGen/LeadInformation";
import Summary from "./pages/LeadGen/Summary";
import DraftLeads from "./pages/LeadGen/DraftLeads";

import OpenLeads from "./pages/OpenLeads";
import ClosedLeads from "./pages/ClosedLeads";
import SuccessfulLeads from "./pages/SuccessfulLeads";
import ConvertedLeads from "./pages/ConvertedLeads";
import UnrealizedLeads from "./pages/UnrealizedLeads";
import TotalClaim from "./pages/TotalClaim";

import LeadInformationOld from "./components/LeadInformationOld";

import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import Footer from "./components/Layout/Footer";
import { LoaderProvider } from "./components/context/LoaderContext";
import { Toaster } from "react-hot-toast";

// Layout wrapper that conditionally hides Navbar + Sidebar + Footer
function Layout({ children }) {
  const location = useLocation();

  // Add any public/auth paths here where layout should be hidden
  const noLayoutPaths = ["/", "/forgot-password", "/reset-password"];

  const hideLayout = noLayoutPaths.includes(location.pathname);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen flex-col">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="flex flex-col flex-1">
          <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

// Protected Route – must be logged in
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// Public Route – logged-in users get redirected away
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
    <LoaderProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />

        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/generate"
              element={
                <ProtectedRoute>
                  <LeadGen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/model-details"
              element={
                <ProtectedRoute>
                  <ModelDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leadinformation"
              element={
                <ProtectedRoute>
                  <LeadInformation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/summary"
              element={
                <ProtectedRoute>
                  <Summary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/draft"
              element={
                <ProtectedRoute>
                  <DraftLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/open"
              element={
                <ProtectedRoute>
                  <OpenLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/closed"
              element={
                <ProtectedRoute>
                  <ClosedLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/converted"
              element={
                <ProtectedRoute>
                  <ConvertedLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/unrealized"
              element={
                <ProtectedRoute>
                  <UnrealizedLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/successful"
              element={
                <ProtectedRoute>
                  <SuccessfulLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads/total-claim"
              element={
                <ProtectedRoute>
                  <TotalClaim />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lead-informationold"
              element={
                <ProtectedRoute>
                  <LeadInformationOld />
                </ProtectedRoute>
              }
            />

            {/* Optional: catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </LoaderProvider>
  );
}

export default App;
