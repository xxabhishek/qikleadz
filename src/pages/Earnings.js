import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import Footer from "../components/Layout/Footer";

const API_BASE = "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
};

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <span className="text-gray-600 font-medium">Loading Earnings...</span>
    </div>
  );
}

export default function Earnings() {
  const [summary, setSummary] = useState({
    total_earnings: 0,
    this_month: 0,
    last_month: 0,
    approved_claims: 0,
    pending_claims: 0,
    rejected_claims: 0,
  });
  const [recentEarnings, setRecentEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();

        // Fetch verified credit notes for accurate earnings
        const response = await axios.get(`${API_BASE}/credit-notes`, {
          headers,
        });

        if (!response.data.success) {
          throw new Error("Failed to fetch credit notes");
        }

        const creditNotes = response.data.data || [];

        // Calculate accurate totals from credit notes
        let totalEarnings = 0;
        let thisMonthEarnings = 0;
        let lastMonthEarnings = 0;
        let approvedCount = 0;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const recentList = [];

        creditNotes.forEach((note) => {
          const incentive = parseFloat(note.total_incentive) || 0;
          totalEarnings += incentive;
          approvedCount++;

          const verifiedDate = new Date(note.verified_at);
          const noteMonth = verifiedDate.getMonth();
          const noteYear = verifiedDate.getFullYear();

          if (noteMonth === currentMonth && noteYear === currentYear) {
            thisMonthEarnings += incentive;
          } else if (
            noteMonth === (currentMonth === 0 ? 11 : currentMonth - 1) &&
            noteYear === (currentMonth === 0 ? currentYear - 1 : currentYear)
          ) {
            lastMonthEarnings += incentive;
          }

          // Add to recent list
          recentList.push({
            id: note.id,
            lead_no: note.lead_no,
            variant_name: note.variant_name,
            brand_name: note.brand_name,
            commission: incentive,
            verified_at: note.verified_at,
          });
        });

        // Sort recent by date descending and take top 10
        recentList.sort(
          (a, b) => new Date(b.verified_at) - new Date(a.verified_at)
        );
        setRecentEarnings(recentList.slice(0, 10));

        setSummary({
          total_earnings: totalEarnings,
          this_month: thisMonthEarnings,
          last_month: lastMonthEarnings,
          approved_claims: approvedCount,
          pending_claims: 0, // You can enhance with another API if needed
          rejected_claims: 0,
        });
      } catch (err) {
        console.error("Error fetching earnings:", err);
        setError("Failed to load earnings data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <Container>
        <div className="text-center py-10">
          <p className="text-red-600 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[var(--primary-blue)] text-white px-6 py-3 rounded-lg hover:bg-[#084a8a]"
          >
            Retry
          </button>
        </div>
      </Container>
    );

  return (
    <Container>
      <div className="bg-gray-100 min-h-screen py-6">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <p className="text-gray-600 mt-2">
              Manage and track vehicle sales incentives
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-[var(--primary-blue)]">
                ₹{summary.total_earnings.toLocaleString("en-IN")}
              </div>
              <p className="text-gray-600 mt-2 font-medium">Total Earnings</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-green-600">
                ₹{summary.this_month.toLocaleString("en-IN")}
              </div>
              <p className="text-gray-600 mt-2 font-medium">This Month</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 text-center">
              <div className="text-3xl font-bold text-orange-600">
                ₹{summary.last_month.toLocaleString("en-IN")}
              </div>
              <p className="text-gray-600 mt-2 font-medium">Last Month</p>
            </div>
          </div>

          {/* Claim Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-green-800 font-semibold text-xl">
                {summary.approved_claims}
              </p>
              <p className="text-green-700 text-sm mt-1">Approved Sales</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-center">
              <p className="text-yellow-800 font-semibold text-xl">
                {summary.pending_claims}
              </p>
              <p className="text-yellow-700 text-sm mt-1">Pending/Disputed</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
              <p className="text-red-800 font-semibold text-xl">
                {summary.rejected_claims}
              </p>
              <p className="text-red-700 text-sm mt-1">Rejected</p>
            </div>
          </div>

          {/* Recent Earnings List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[var(--primary-blue)]">
                Recent Earnings ({recentEarnings.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-200">
              {recentEarnings.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No successful sales yet. Keep selling! 🚀
                </div>
              ) : (
                recentEarnings.map((earning) => (
                  <div
                    key={earning.id}
                    className="p-5 hover:bg-gray-50 transition flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {earning.variant_name} ({earning.brand_name})
                      </p>
                      <p className="text-sm text-gray-600">
                        Lead No: {earning.lead_no} • Sold on{" "}
                        {new Date(earning.verified_at).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      +₹{earning.commission.toLocaleString("en-IN")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/creditnotedetails"
              className="inline-block bg-[var(--primary-blue)] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#084a8a] transition"
            >
              View All Credit Notes
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}
