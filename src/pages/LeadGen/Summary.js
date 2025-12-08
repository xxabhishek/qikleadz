import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Summary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [storedLeads, setStoredLeads] = useState([]);
  const [brands, setBrands] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [ccs, setCcs] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE = " http://192.168.1.38:8000/api";
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  // Load stored leads and reference data
  useEffect(() => {
    loadData();
  }, [location.state]);

  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Check for leads in location state first (from navigation)
      if (location.state?.recentLead || location.state?.allLeads) {
        if (location.state.allLeads) {
          setStoredLeads(location.state.allLeads);
          localStorage.setItem(
            "recentSubmittedLead",
            JSON.stringify(location.state.allLeads)
          );
        } else if (location.state.recentLead) {
          const existingLeads = JSON.parse(
            localStorage.getItem("recentSubmittedLead") || "[]"
          );
          const updatedLeads = [...existingLeads, location.state.recentLead];
          setStoredLeads(updatedLeads);
          localStorage.setItem(
            "recentSubmittedLead",
            JSON.stringify(updatedLeads)
          );
        }
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem("recentSubmittedLead");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setStoredLeads(parsed);
          }
        }
      }

      // Show success message if we have leads
      if (storedLeads.length > 0 || location.state?.recentLead) {
        const leadCount = storedLeads.length || 1;
        if (!isRefresh) {
          Swal.fire({
            title: "Success!",
            text: `You have submitted ${leadCount} lead${
              leadCount > 1 ? "s" : ""
            }`,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#3085d6",
          });
        }
      }

      // Fetch reference data
      const headers = getAuthHeaders();
      const [brandsRes, ccsRes, fuelRes, galleriesRes] = await Promise.all([
        axios.get(`${API_BASE}/brands`, { headers }),
        axios.get(`${API_BASE}/ccs`, { headers }),
        axios.get(`${API_BASE}/fuel-types`, { headers }),
        axios.get(`${API_BASE}/galleries`, { headers }),
      ]);

      setBrands(brandsRes.data.data || brandsRes.data || []);
      setCcs(ccsRes.data.data || ccsRes.data || []);
      setFuelTypes(fuelRes.data.data || fuelRes.data || []);
      setGalleries(galleriesRes.data.data || galleriesRes.data || []);
    } catch (err) {
      console.error("Error loading data:", err);
      if (!isRefresh) {
        Swal.fire({
          title: "Error!",
          text: "Failed to load lead data",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateNewLead = () => {
    localStorage.removeItem("leadId");
    localStorage.removeItem("draftLead");
    localStorage.removeItem("existingCustomerData");
    navigate("/dashboard");
  };

  const handleViewAllLeads = () => {
    navigate("/leads/open");
  };

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  const handleRefresh = () => {
    loadData(true);
  };

  const getVariantImage = (variant) => {
    if (!variant) return null;

    const gallery = galleries.find((g) => g.variant_id === variant.id);
    if (!gallery) return null;

    let photos = [];
    try {
      photos = JSON.parse(gallery.cover_photos);
      if (!Array.isArray(photos)) photos = [gallery.cover_photos];
    } catch {
      photos = [gallery.cover_photos];
    }

    return photos[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN");
  };

  const formatPrice = (price) => {
    if (!price) return "On Request";
    return `₹${parseFloat(price).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center safe-area-top">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead summary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Lead Summary
                </h1>
                <p className="text-xs text-gray-500">Review submitted leads</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <svg
                className={`w-5 h-5 text-gray-600 ${
                  refreshing ? "animate-spin" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      {storedLeads.length > 0 && (
        <div className="px-4 py-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-blue-600">
                  {storedLeads.length}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total Leads</div>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-green-600">
                  {storedLeads.reduce(
                    (sum, lead) => sum + (lead.vehicle_qty || 1),
                    0
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">Total Vehicles</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leads List */}
      <div className="pb-20">
        {storedLeads.length > 0 ? (
          <div className="space-y-3 px-4 py-3">
            {storedLeads.map((lead, index) => (
              <div
                key={lead.id || index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden active:scale-[0.98] transition-transform"
              >
                {/* Lead Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {lead.customer_name}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.status === "Open"
                              ? "bg-green-100 text-green-800"
                              : lead.status === "Draft"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {lead.status || "Submitted"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {lead.phone_no} • {formatDate(lead.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="p-4">
                  <div className="flex space-x-3">
                    {/* Vehicle Image */}
                    {getVariantImage(lead.variant) && (
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg border overflow-hidden">
                          <img
                            src={` http://192.168.1.38:8000/uploads/coverPhotos/${getVariantImage(
                              lead.variant
                            )}`}
                            alt={lead.variant?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/64x64/f3f4f6/6b7280?text=No+Image";
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Vehicle Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                        {lead.variant?.name || "Unknown Variant"}
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="text-gray-600">Brand:</div>
                        <div className="text-gray-900 truncate">
                          {brands.find((b) => b.id === lead.variant?.brand_id)
                            ?.name ||
                            lead.brand_name ||
                            "N/A"}
                        </div>

                        <div className="text-gray-600">Fuel Type:</div>
                        <div className="text-gray-900">
                          {fuelTypes.find(
                            (f) => f.id === lead.variant?.fuel_type_id
                          )?.name || "N/A"}
                        </div>

                        <div className="text-gray-600">Price:</div>
                        <div className="text-gray-900 font-medium">
                          {formatPrice(lead.variant?.basic_price)}
                        </div>

                        <div className="text-gray-600">Qty:</div>
                        <div className="text-gray-900">
                          {lead.vehicle_qty || 1}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {(lead.location || lead.area || lead.payment_mode) && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        {lead.location && (
                          <>
                            <div className="text-gray-600">Location:</div>
                            <div className="text-gray-900 truncate">
                              {lead.location}
                            </div>
                          </>
                        )}
                        {lead.area && (
                          <>
                            <div className="text-gray-600">Area:</div>
                            <div className="text-gray-900 truncate">
                              {lead.area}
                            </div>
                          </>
                        )}
                        {lead.payment_mode && (
                          <>
                            <div className="text-gray-600">Payment:</div>
                            <div className="text-gray-900">
                              {lead.payment_mode}
                            </div>
                          </>
                        )}
                        {lead.tentative_purchase_date && (
                          <>
                            <div className="text-gray-600">Purchase Date:</div>
                            <div className="text-gray-900">
                              {formatDate(lead.tentative_purchase_date)}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {lead.additional_note && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs">
                        <div className="text-gray-600 font-medium mb-1">
                          Notes:
                        </div>
                        <div className="text-gray-900 bg-gray-50 rounded-lg p-2 text-xs">
                          {lead.additional_note}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Leads Submitted
              </h3>
              <p className="text-gray-500 mb-6 max-w-xs mx-auto text-sm">
                You haven't submitted any leads yet. Start by creating a new
                lead from the dashboard.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      {storedLeads.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bottom">
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <button
              onClick={handleCreateNewLead}
              className="bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors text-center"
            >
              New Lead
            </button>
            <button
              onClick={handleViewAllLeads}
              className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors text-center"
            >
              View All
            </button>
            <button
              onClick={handleViewDashboard}
              className="bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors text-center"
            >
              Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Summary;
