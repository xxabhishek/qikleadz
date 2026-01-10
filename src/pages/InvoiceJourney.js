import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "../components/Container";
import Footer from "../components/Layout/Footer";

const API_BASE = "http://localhost:8000/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  Accept: "application/json",
});

export default function InvoiceJourney() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeneratedInvoices = async () => {
      try {
        const response = await axios.get(`${API_BASE}/credit-notes`, {
          headers: getAuthHeaders(),
        });

        if (response.data.success) {
          const notes = response.data.data || [];

          // Transform to invoice format
          const transformed = notes.map((note, index) => ({
            id: note.lead_id,
            number: `INV${String(index + 1).padStart(3, "0")}`,
            date: new Date(note.verified_at).toLocaleDateString("en-GB"),
            creditNotes: 1,
            totalLeads: 1,
            amount: note.total_incentive,
            status: "download", // Sab generated hain toh download se start
          }));

          setInvoices(transformed);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratedInvoices();
  }, []);

  const updateStatus = (id, newStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: newStatus } : inv))
    );
  };

  const getStepClass = (status, step) => {
    const steps = ["generated", "download", "submitted", "received"];
    const current = steps.indexOf(status);
    const thisStep = steps.indexOf(step);
    if (thisStep < current) return "completed";
    if (thisStep === current) return "active";
    return "pending";
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-[var(--primary-blue)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Invoice Journey...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="bg-gray-100 min-h-screen">
        

        <section className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-white rounded-lg shadow-sm p-4 md:p-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-bold">{invoice.number}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                    <p>
                      Date:{" "}
                      <span className="font-semibold">{invoice.date}</span>
                    </p>
                    <p>
                      Credit Notes:{" "}
                      <span className="font-semibold">
                        {invoice.creditNotes}
                      </span>
                    </p>
                    <p>
                      Total Leads:{" "}
                      <span className="font-semibold">
                        {invoice.totalLeads}
                      </span>
                    </p>
                    <p>
                      Amount:{" "}
                      <span className="font-semibold">
                        ₹{invoice.amount.toLocaleString("en-IN")}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-[#f2f9ff] p-4 rounded-lg">
                  <h4 className="text-sm font-semibold mb-4">
                    Invoice Journey
                  </h4>
                  <div className="flex justify-between items-center relative flex-wrap gap-4">
                    {["generated", "download", "submitted", "received"].map(
                      (step) => {
                        const isActive =
                          getStepClass(invoice.status, step) === "active";
                        const isCompleted =
                          getStepClass(invoice.status, step) === "completed";

                        const icons = {
                          generated: "bi-receipt",
                          download: "bi-download",
                          submitted: "bi-send-check",
                          received: "bi-currency-dollar",
                        };
                        const labels = {
                          generated: "Generated",
                          download: "Download",
                          submitted: "Submitted",
                          received: "Received",
                        };

                        return (
                          <div
                            key={step}
                            className="text-center flex-1 min-w-[100px]"
                          >
                            <div
                              className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-2 
                            ${
                              isCompleted
                                ? "bg-green-500 text-white"
                                : isActive
                                ? "bg-[var(--primary-blue)] text-white"
                                : "bg-gray-300 text-gray-600"
                            }`}
                            >
                              <i className={`bi ${icons[step]} text-xl`}></i>
                            </div>
                            <p className="text-xs font-medium">
                              {labels[step]}
                            </p>

                            {/* Actions */}
                            <div className="mt-3">
                              {step === "download" && !isCompleted && (
                                <button
                                  onClick={() => {
                                    alert(
                                      `Invoice ${invoice.number} downloaded!`
                                    );
                                    updateStatus(invoice.id, "download");
                                  }}
                                  className="text-xs bg-[var(--primary-blue)] text-white px-4 py-2 rounded hover:bg-[var(--hover-blue)]"
                                >
                                  Download
                                </button>
                              )}
                              {step === "download" && isCompleted && (
                                <button
                                  disabled
                                  className="text-xs bg-gray-400 text-white px-4 py-2 rounded opacity-70 cursor-not-allowed"
                                >
                                  Downloaded
                                </button>
                              )}
                              {step === "submitted" && isActive && (
                                <div className="flex justify-center items-center gap-2">
                                  <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      e.target.checked &&
                                      updateStatus(invoice.id, "submitted")
                                    }
                                  />
                                  <label className="text-xs">
                                    Mark as Submitted
                                  </label>
                                </div>
                              )}
                              {step === "submitted" && isCompleted && (
                                <button
                                  disabled
                                  className="text-xs bg-green-600 text-white px-4 py-2 rounded"
                                >
                                  Submitted
                                </button>
                              )}
                              {step === "received" && isActive && (
                                <select
                                  className="text-xs border rounded px-3 py-1"
                                  onChange={(e) => {
                                    if (e.target.value === "yes")
                                      updateStatus(invoice.id, "received");
                                  }}
                                >
                                  <option value="">Select</option>
                                  <option value="yes">Received</option>
                                  <option value="no">Not Received</option>
                                </select>
                              )}
                              {step === "received" &&
                                invoice.status === "received" && (
                                  <button
                                    disabled
                                    className="text-xs bg-green-600 text-white px-4 py-2 rounded"
                                  >
                                    Received
                                  </button>
                                )}
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </Container>
  );
}
