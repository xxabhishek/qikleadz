import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

// Same Loader as Earnings.js
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <span className="text-gray-600 font-medium">Loading Claims...</span>
    </div>
  );
}

export default function TotalClaims() {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("date-desc");

  // Modal States
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const location = useLocation();
  const filterStatus = location.state?.filterStatus || "all";

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/lead-details/claims`, {
          headers: getAuthHeaders(),
        });

        if (response.data.success) {
          setClaims(response.data.data || []);
        } else {
          setError("No claims found");
        }
      } catch (err) {
        console.error("Error fetching claims:", err);
        setError("Failed to load claims");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // Filter + Sort Logic
  useEffect(() => {
    let filtered = [...claims];

    if (filterStatus === "approved") {
      filtered = filtered.filter(
        (c) =>
          c.verification_status === "successful" ||
          c.verification_status === "credit_note_generated"
      );
    } else if (filterStatus !== "all") {
      filtered = filtered.filter((c) => c.verification_status === filterStatus);
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "date-desc":
          return (
            new Date(b.verified_at || b.updated_at) -
            new Date(a.verified_at || a.updated_at)
          );
        case "date-asc":
          return (
            new Date(a.verified_at || a.updated_at) -
            new Date(b.verified_at || a.updated_at)
          );
        case "amount-desc":
          return (b.total_price || 0) - (a.total_price || 0);
        case "amount-asc":
          return (a.total_price || 0) - (b.total_price || 0);
        case "status":
          return (a.verification_status || "").localeCompare(
            b.verification_status || ""
          );
        default:
          return 0;
      }
    });

    setFilteredClaims(filtered);
  }, [claims, filterStatus, sortOption]);

  // Open Modal
  const openClaimModal = (claim) => {
    setSelectedClaim(claim);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedClaim(null);
  };

  const getPageTitle = () => {
    switch (filterStatus) {
      case "all":
        return "Total Claims";
      case "approved":
        return "Approved Claims";
      case "disputed":
        return "Disputed Claims";
      case "rejected":
        return "Rejected Claims";
      default:
        return "Total Claims";
    }
  };

  const getStatusBadge = (status) => {
    if (status === "successful" || status === "credit_note_generated") {
      return "px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-accent-green/20 text-accent-green";
    }
    if (status === "disputed") {
      return "px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800";
    }
    if (status === "rejected") {
      return "px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-accent-red/20 text-accent-red";
    }
    return "px-2 py-1 inline-flex text-xs font-semibold rounded-full bg-gray-100 text-gray-800";
  };

  const getStatusText = (status) => {
    return status === "credit_note_generated"
      ? "Successful"
      : status?.charAt(0).toUpperCase() + status?.slice(1);
  };

  // Full Page Loader (Same as Earnings.js)
  if (loading) return <Loader />;

  return (
    <div className="bg-gray-50 min-h-screen font-montserrat text-sm">
      <div className="container-animate mx-auto px-4 py-6 max-w-7xl">
        <h1 className="text-2xl font-bold text-[var(--primary-blue)] mb-6">
          {getPageTitle()}
        </h1>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <label
              htmlFor="sortClaims"
              className="text-xs font-medium text-gray-600"
            >
              Sort by:
            </label>
            <select
              id="sortClaims"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-secondary-grey rounded-md px-3 py-1.5 text-xs bg-white focus:ring-2 focus:ring-primary-blue"
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Claims Table/Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Desktop Table */}
          <div className="overflow-x-auto hidden md:block">
            <table className="custom-table min-w-full divide-y divide-secondary-grey">
              <thead className="bg-light-blue">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-dark uppercase tracking-wider">
                    Sr. No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-dark uppercase tracking-wider">
                    Lead ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-dark uppercase tracking-wider">
                    Claim Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-dark uppercase tracking-wider">
                    Claim Amt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-dark uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-dark uppercase tracking-wider no-sort">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-grey">
                {error ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredClaims.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No claims found
                    </td>
                  </tr>
                ) : (
                  filteredClaims.map((claim, index) => (
                    <tr
                      key={claim.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text-dark">
                        {claim.lead_no || `LD${claim.lead_id}`}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {new Date(
                          claim.verified_at || claim.updated_at
                        ).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-text-dark">
                        ₹{claim.total_price?.toLocaleString() || "0"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={getStatusBadge(claim.verification_status)}
                        >
                          {getStatusText(claim.verification_status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => openClaimModal(claim)}
                          className="text-primary-blue hover:text-hover-blue transition-colors font-medium text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="mobile-cards space-y-4 p-4 md:hidden">
            {error || filteredClaims.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {error || "No claims found"}
              </div>
            ) : (
              filteredClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="claim-card bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-text-dark">
                        Lead ID: {claim.lead_no || `LD${claim.lead_id}`}
                      </p>
                      <p className="text-xs text-gray-600">
                        Date:{" "}
                        {new Date(
                          claim.verified_at || claim.updated_at
                        ).toLocaleDateString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-600">
                        Amount: ₹{claim.total_price?.toLocaleString() || "0"}
                      </p>
                      <p className="text-xs mt-1">
                        <span
                          className={getStatusBadge(claim.verification_status)}
                        >
                          {getStatusText(claim.verification_status)}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => openClaimModal(claim)}
                      className="text-primary-blue hover:text-hover-blue text-xs font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal Code (same as before) */}
      {modalOpen && selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[var(--primary-blue)]">
                  Claim Details -{" "}
                  {selectedClaim.lead_no || `LD${selectedClaim.lead_id}`}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={getStatusBadge(
                      selectedClaim.verification_status
                    )}
                  >
                    {getStatusText(selectedClaim.verification_status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Claim Amount</p>
                  <p className="text-lg font-semibold">
                    ₹{selectedClaim.total_price?.toLocaleString() || "0"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Claim Date</p>
                  <p className="font-medium">
                    {new Date(
                      selectedClaim.verified_at || selectedClaim.updated_at
                    ).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vehicle Quantity</p>
                  <p className="font-medium">
                    {selectedClaim.vehicle_qty || 1}
                  </p>
                </div>
              </div>

              {selectedClaim.verification_note && (
                <div>
                  <p className="text-sm text-gray-600">Verification Note</p>
                  <p className="mt-1 text-gray-800">
                    {selectedClaim.verification_note}
                  </p>
                </div>
              )}

              {selectedClaim.invoice_no && (
                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="font-medium">{selectedClaim.invoice_no}</p>
                </div>
              )}

              {selectedClaim.uploaded_invoice && (
                <div>
                  <p className="text-sm text-gray-600">Uploaded Invoice</p>
                  <a
                    href={`http://localhost:8000/storage/${selectedClaim.uploaded_invoice}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-blue hover:underline"
                  >
                    View Invoice
                  </a>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="w-full bg-primary-blue text-white py-3 rounded-lg font-medium hover:bg-[#084a8a] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .custom-table th {
          position: relative;
          padding-right: 2rem !important;
          cursor: pointer;
        }
        .custom-table th:hover {
          color: #0f66af;
        }
        .custom-table th::after {
          content: "\\f0dc";
          font-family: "bootstrap-icons";
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          opacity: 0.5;
          font-size: 0.75rem;
        }
        .custom-table th.no-sort::after {
          content: "";
        }
        .custom-table tr:hover {
          background-color: #f9fafb !important;
        }
      `}</style>
    </div>
  );
}
