import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TestOpenLeads() {
  const [openLeads, setOpenLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = "http://localhost:8000/api";

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    console.log("🔑 Token exists:", !!token);
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      console.log(
        "🔍 Fetching from:",
        `${API_BASE}/leads-by-status?status=Open`
      );

      const response = await axios.get(
        `${API_BASE}/leads-by-status?status=Open`,
        { headers: getAuthHeaders() }
      );

      console.log("✅ API Response:", response.data);

      if (response.data.success) {
        const leads = response.data.data || [];
        console.log("📊 Leads received:", leads.length);
        console.log("📊 First lead:", leads[0]);

        setOpenLeads(leads);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Open Leads</h1>
      <button onClick={fetchLeads} style={{ marginBottom: "20px" }}>
        Refresh
      </button>

      <p>Total Leads: {openLeads.length}</p>

      {openLeads.length === 0 ? (
        <p>No leads found</p>
      ) : (
        <div style={{ marginTop: "20px" }}>
          {openLeads.map((lead) => (
            <div
              key={lead.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h3>Customer: {lead.customer_name}</h3>
              <p>Phone: {lead.phone_no}</p>
              <p>Location: {lead.location}</p>
              <p>Lead Status: {lead.status}</p>
              <p>Vehicles: {lead.lead_details?.length || 0}</p>

              {lead.lead_details && lead.lead_details.length > 0 && (
                <div style={{ marginLeft: "20px" }}>
                  <h4>Vehicles:</h4>
                  {lead.lead_details.map((vehicle) => (
                    <div key={vehicle.id}>
                      <p>
                        {vehicle.brand_name} {vehicle.variant_name} - Status:{" "}
                        <strong>{vehicle.status}</strong>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
