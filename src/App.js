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
import LeadGen from "./pages/LeadGen/LeadGen";
import ModelDetails from "./pages/LeadGen/ModelDetails";
import OpenLeads from "./pages/OpenLeads";
import ClosedLeads from "./pages/ClosedLeads";
import SuccessfulLeads from "./pages/SuccessfulLeads";
import TotalClaim from "./pages/TotalClaim";

import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import Footer from "./components/Layout/Footer";
import { LoaderProvider } from "./components/context/LoaderContext";
import LeadInformation from "./pages/LeadGen/LeadInformation";
import Summary from "./pages/LeadGen/Summary";
import DraftLeads from "./pages/LeadGen/DraftLeads";
import LeadInformationOld from "./components/LeadInformationOld";
import { Toaster } from "react-hot-toast";
import ConvertedLeads from "./pages/ConvertedLeads";
import UnrealizedLeads from "./pages/UnrealizedLeads";

// Layout component
function Layout({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname === "/"; // hide layout on login page
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (hideLayout) return <>{children}</>;

  return (
    <div className="flex h-screen flex-col">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex flex-col flex-1">
          <main className="flex-1 overflow-y-auto">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

// ProtectedRoute: user must be logged in
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;
  return children;
}

// PublicRoute: redirect logged-in user from login page
function PublicRoute({ children }) {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  <Toaster position="top-center" reverseOrder={false} />;
  return (
    <LoaderProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Login page */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            {/* Protected routes */}
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
              path="/leads/open"
              element={
                <ProtectedRoute>
                  <OpenLeads />
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
            />{" "}
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
              path="/leads/draft"
              element={
                <ProtectedRoute>
                  <DraftLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lead-inormationold"
              element={
                <ProtectedRoute>
                  <LeadInformationOld />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </LoaderProvider>
  );
}

export default App;
