import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function UnrealizedLeads() {
  const [unrealizedLeads, setUnrealizedLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);
  const [colors, setColors] = useState([]);

  const API_BASE = "http://localhost:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  // Simplified price calculation
  const getVehiclePrice = (vehicle) => {
    let price = 0;

    // Try in this order
    if (vehicle.color_price && !isNaN(parseFloat(vehicle.color_price))) {
      price = parseFloat(vehicle.color_price);
    } else if (vehicle.unit_price && !isNaN(parseFloat(vehicle.unit_price))) {
      price = parseFloat(vehicle.unit_price);
    } else if (
      vehicle.variant?.basic_price &&
      !isNaN(parseFloat(vehicle.variant.basic_price))
    ) {
      price = parseFloat(vehicle.variant.basic_price);
    } else if (vehicle.basic_price && !isNaN(parseFloat(vehicle.basic_price))) {
      price = parseFloat(vehicle.basic_price);
    } else if (vehicle.price && !isNaN(parseFloat(vehicle.price))) {
      price = parseFloat(vehicle.price);
    }

    return price;
  };

  // Total lost revenue calculation
  const getTotalLostRevenue = (lead) => {
    if (!lead.lead_details || lead.lead_details.length === 0) {
      return 0;
    }

    const total = lead.lead_details.reduce((sum, vehicle) => {
      const price = getVehiclePrice(vehicle);
      const qty = parseInt(vehicle.qty) || 1;
      return sum + price * qty;
    }, 0);

    return total;
  };

  // Fetch unrealized leads data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch unrealized leads
        const leadsResponse = await axios.get(`${API_BASE}/unrealized-leads`, {
          headers: getAuthHeaders(),
        });
        console.log("📦 Unrealized Leads API Response:", leadsResponse.data);

        if (leadsResponse.data.success) {
          const leads = leadsResponse.data.data || [];

          setUnrealizedLeads(leads);
          setFilteredLeads(leads);

          if (leads.length === 0) {
            setError("No unrealized leads found.");
          }
        } else {
          setError(
            leadsResponse.data.message || "Failed to fetch unrealized leads."
          );
        }

        // Fetch additional data for enrichment
        const [galleriesRes, variantsRes, brandsRes, colorsRes] =
          await Promise.all([
            axios.get(`${API_BASE}/galleries`, { headers: getAuthHeaders() }),
            axios.get(`${API_BASE}/variants`, { headers: getAuthHeaders() }),
            axios.get(`${API_BASE}/brands`, { headers: getAuthHeaders() }),
            axios.get(`${API_BASE}/colors`, { headers: getAuthHeaders() }),
          ]);

        if (galleriesRes.data.status) {
          setGalleries(galleriesRes.data.data || []);
        }
        if (variantsRes.data.data || variantsRes.data) {
          setVariants(variantsRes.data.data || variantsRes.data || []);
        }
        if (brandsRes.data.data || brandsRes.data) {
          setBrands(brandsRes.data.data || brandsRes.data || []);
        }
        if (colorsRes.data.data || colorsRes.data) {
          setColors(colorsRes.data.data || colorsRes.data || []);
        }
      } catch (err) {
        console.error("Error fetching unrealized leads:", err);
        setError("Failed to fetch unrealized leads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const leadsResponse = await axios.get(`${API_BASE}/unrealized-leads`, {
          headers: getAuthHeaders(),
        });
        if (leadsResponse.data.success) {
          const leads = leadsResponse.data.data || [];
          setUnrealizedLeads(leads);
          setFilteredLeads(leads);
        }
      } catch (err) {
        setError("Failed to fetch unrealized leads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  const calculateLeadAge = (createdDate) => {
    const created = new Date(createdDate);
    const current = new Date();
    const diffTime = current - created;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getVehicleImage = (vehicle) => {
    if (!vehicle?.variant_id) {
      return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
    }

    let variantGallery = null;
    if (vehicle.color_id) {
      variantGallery = galleries.find(
        (g) =>
          g.variant_id == vehicle.variant_id && g.color_id == vehicle.color_id
      );
    }
    if (!variantGallery) {
      variantGallery = galleries.find(
        (g) => g.variant_id == vehicle.variant_id
      );
    }

    if (variantGallery?.cover_photos) {
      let images = [];
      try {
        images = JSON.parse(variantGallery.cover_photos);
        if (!Array.isArray(images)) images = [variantGallery.cover_photos];
      } catch (e) {
        images = [variantGallery.cover_photos];
      }
      if (images[0]) {
        const imageUrl = getAbsoluteImageUrl(images[0]);
        return imageUrl;
      }
    }
    return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
  };

  const getAbsoluteImageUrl = (url) => {
    if (typeof url !== "string" || !url) {
      return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `http://localhost:8000${url}`;
    }
    const cleanPath = url.replace(/^[\\/]+/, "");
    return `http://localhost:8000/uploads/coverPhotos/${cleanPath}`;
  };

  const handleViewLead = async (lead) => {
    try {
      const response = await axios.get(`${API_BASE}/leads/${lead.id}`, {
        headers: getAuthHeaders(),
      });

      if (response.data.success) {
        const apiLead = response.data.data;
        const enrichedDetails = apiLead.lead_details.map((vehicle) => {
          const fullBrand = brands.find((b) => b.id == vehicle.brand_id);
          const fullVariant = variants.find((v) => v.id == vehicle.variant_id);
          const fullColor = colors.find((c) => c.id == vehicle.color_id);
          return {
            ...vehicle,
            brand: fullBrand,
            variant: fullVariant,
            color: fullColor,
            brand_name: fullBrand?.name || vehicle.brand_name || "N/A",
            variant_name: fullVariant?.name || vehicle.variant_name || "N/A",
            color_name:
              fullColor?.color_name ||
              fullColor?.name ||
              vehicle.color_name ||
              "N/A",
            color_code: fullColor?.color_code || vehicle.color_code || "",
          };
        });
        setSelectedLead({
          ...apiLead,
          lead_details: enrichedDetails,
        });
      } else {
        // Fallback to the lead data we already have
        const enrichedDetails = lead.lead_details.map((vehicle) => {
          const fullBrand = brands.find((b) => b.id == vehicle.brand_id);
          const fullVariant = variants.find((v) => v.id == vehicle.variant_id);
          const fullColor = colors.find((c) => c.id == vehicle.color_id);
          return {
            ...vehicle,
            brand: fullBrand,
            variant: fullVariant,
            color: fullColor,
            brand_name: fullBrand?.name || vehicle.brand_name || "N/A",
            variant_name: fullVariant?.name || vehicle.variant_name || "N/A",
            color_name:
              fullColor?.color_name ||
              fullColor?.name ||
              vehicle.color_name ||
              "N/A",
            color_code: fullColor?.color_code || vehicle.color_code || "",
          };
        });
        setSelectedLead({
          ...lead,
          lead_details: enrichedDetails,
        });
      }
    } catch (err) {
      console.error("Failed to refresh lead:", err);
      // Use existing lead data if API call fails
      const enrichedDetails = lead.lead_details.map((vehicle) => {
        const fullBrand = brands.find((b) => b.id == vehicle.brand_id);
        const fullVariant = variants.find((v) => v.id == vehicle.variant_id);
        const fullColor = colors.find((c) => c.id == vehicle.color_id);
        return {
          ...vehicle,
          brand: fullBrand,
          variant: fullVariant,
          color: fullColor,
          brand_name: fullBrand?.name || vehicle.brand_name || "N/A",
          variant_name: fullVariant?.name || vehicle.variant_name || "N/A",
          color_name:
            fullColor?.color_name ||
            fullColor?.name ||
            vehicle.color_name ||
            "N/A",
          color_code: fullColor?.color_code || vehicle.color_code || "",
        };
      });
      setSelectedLead({
        ...lead,
        lead_details: enrichedDetails,
      });
    }
    setIsViewModalOpen(true);
  };

  const sortLeadsByDate = (order) => {
    if (order === "newest") {
      setFilteredLeads((prev) =>
        [...prev].sort(
          (a, b) =>
            new Date(b.updated_at || b.created_at) -
            new Date(a.updated_at || a.created_at)
        )
      );
    } else {
      setFilteredLeads((prev) =>
        [...prev].sort(
          (a, b) =>
            new Date(a.updated_at || a.created_at) -
            new Date(b.updated_at || b.created_at)
        )
      );
    }
  };

  // Get unrealized reason for display
  const getUnrealizedReason = (lead) => {
    if (lead.lead_details && lead.lead_details.length > 0) {
      return lead.lead_details[0]?.close_reason || "Not specified";
    }
    return "Not specified";
  };

  if (loading) return <Loader />;
  if (error && unrealizedLeads.length === 0)
    return <ErrorMessage message={error} onRetry={handleRefresh} />;

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat text-sm">
        

      {/* Unrealized Leads Section */}
      <section className="p-4 md:p-6">
        <div className="container mx-auto px-0 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <label
                htmlFor="sortLeads"
                className="text-xs font-medium text-gray-600"
              >
                Sort Leads by Age:
              </label>
              <select
                id="sortLeads"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  sortLeadsByDate(e.target.value);
                }}
                className="border border-secondary-grey rounded-md px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-primary-blue"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-gray-500 text-xl font-medium mb-2">
                No Unrealized Leads
              </h3>
              <p className="text-gray-400 mb-6">
                There are currently no unrealized leads in the system.
              </p>
              <Link
                to="/leads/open"
                className="btn-primary-blue rounded-md px-6 py-3 text-sm font-medium inline-flex items-center"
              >
                <i className="bi bi-arrow-left mr-2"></i> View Open Leads
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4" id="leadsContainer">
              {filteredLeads.map((lead) => {
                const totalLostRevenue = getTotalLostRevenue(lead);
                const leadAge = calculateLeadAge(lead.created_at);
                const unrealizedReason = getUnrealizedReason(lead);

                return (
                  <div
                    key={lead.id}
                    className="lead-card bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 relative"
                    data-lead-id={lead.id}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 pr-12">
                        <div>
                          <h6 className="text-base font-semibold text-text-dark mb-1">
                            {lead.customer_name}
                          </h6>
                          <div className="location-info">
                            <i className="bi bi-geo-alt"></i>
                            <span>{lead.location || "N/A"}</span>
                          </div>
                        </div>
                        <div className="vehicle-info">
                          <i className="bi bi-bicycle"></i>
                          <span>
                            {lead.lead_details
                              ?.map(
                                (vehicle) =>
                                  `${vehicle.brand_name} ${vehicle.variant_name}`
                              )
                              .join(", ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="unrealized-badge">
                            Unrealized {leadAge} day{leadAge !== 1 ? "s" : ""}{" "}
                            ago
                          </span>
                          <span
                            className={`payment-badge ${
                              lead.payment_mode === "cash"
                                ? "payment-cash"
                                : "payment-finance"
                            }`}
                          >
                            {lead.payment_mode}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Lost Revenue:{" "}
                          <span className="font-semibold text-orange-600">
                            {totalLostRevenue > 0
                              ? `$${totalLostRevenue.toLocaleString("en-IN")}`
                              : "Price on request"}
                          </span>
                        </div>
                        <div className="text-sm text-red-600 mt-1 font-medium">
                          Reason: {unrealizedReason}
                        </div>
                      </div>
                    </div>
                    <div className="action-buttons">
                      <div
                        className="action-btn btn-view"
                        title="View Details"
                        onClick={() => handleViewLead(lead)}
                      >
                        <i className="bi bi-eye"></i>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* View Lead Modal */}
      {isViewModalOpen && selectedLead && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center">
              <h5 className="text-base font-medium">Unrealized Lead Details</h5>
              <button
                type="button"
                className="text-white hover:text-gray-200 text-lg"
                onClick={() => setIsViewModalOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {window.innerWidth <= 640 ? (
                // Mobile Concise View
                <div className="mobile-concise-view">
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                    <h6 className="text-base font-medium text-primary-blue mb-3">
                      <i className="bi bi-person-fill mr-2"></i> Customer
                    </h6>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="detail-label">Name</p>
                        <p className="detail-value">
                          {selectedLead.customer_name}
                        </p>
                      </div>
                      <div>
                        <p className="detail-label">Mobile</p>
                        <p className="detail-value">{selectedLead.phone_no}</p>
                      </div>
                      <div>
                        <p className="detail-label">Location</p>
                        <p className="detail-value">
                          {selectedLead.location || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="detail-label">Unrealized Date</p>
                        <p className="detail-value">
                          {new Date(
                            selectedLead.updated_at || selectedLead.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                    <h6 className="text-base font-medium text-primary-blue mb-3">
                      <i className="bi bi-exclamation-triangle mr-2"></i>{" "}
                      Unrealized Details
                    </h6>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <p className="detail-label">Reason</p>
                        <p className="detail-value text-red-600 font-semibold">
                          {getUnrealizedReason(selectedLead)}
                        </p>
                      </div>
                      <div>
                        <p className="detail-label">Lost Revenue</p>
                        <p className="detail-value text-orange-600 font-semibold">
                          {getTotalLostRevenue(selectedLead) > 0
                            ? `$${getTotalLostRevenue(
                                selectedLead
                              ).toLocaleString("en-IN")}`
                            : "Price on request"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                    <h6 className="text-base font-medium text-primary-blue mb-3">
                      <i className="bi bi-currency-dollar mr-2"></i> Payment
                      Details
                    </h6>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="detail-label">Payment Mode</p>
                        <p className="detail-value">
                          <span
                            className={`payment-badge ${
                              selectedLead.payment_mode === "cash"
                                ? "payment-cash"
                                : "payment-finance"
                            }`}
                          >
                            {selectedLead.payment_mode}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                    <h6 className="text-base font-medium text-primary-blue mb-3">
                      <i className="bi bi-bicycle mr-2"></i> Vehicles
                    </h6>
                    <div className="space-y-3">
                      {selectedLead.lead_details?.map((vehicle) => {
                        const vehiclePrice = getVehiclePrice(vehicle);
                        const vehicleTotal = vehiclePrice * (vehicle.qty || 1);
                        const vehicleImage = getVehicleImage(vehicle);

                        return (
                          <div
                            key={vehicle.id}
                            className="border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={vehicleImage}
                                alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
                                className="w-16 h-16 object-cover rounded"
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
                                }}
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                  {vehicle.brand_name} {vehicle.variant_name}
                                </p>
                                <div className="text-sm text-gray-600">
                                  <p>{vehicle.color_name || "N/A"}</p>
                                  <p>Qty: {vehicle.qty || 1}</p>
                                  <p className="text-orange-600 font-semibold">
                                    {vehiclePrice > 0
                                      ? `$${vehicleTotal.toLocaleString(
                                          "en-IN"
                                        )}`
                                      : "Price on request"}
                                  </p>
                                  {vehicle.close_reason && (
                                    <p className="text-red-600 text-xs mt-1">
                                      <span className="font-medium">
                                        Reason:
                                      </span>{" "}
                                      {vehicle.close_reason}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      className="btn-secondary rounded-md px-4 py-2 text-sm"
                      onClick={() => setIsViewModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                // Desktop Detailed View
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h6 className="text-lg font-semibold text-primary-blue mb-4">
                      <i className="bi bi-person-fill mr-2"></i> Customer
                      Details
                    </h6>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <strong>Name:</strong> {selectedLead.customer_name}
                      </div>
                      <div>
                        <strong>Mobile:</strong> {selectedLead.phone_no}
                      </div>
                      <div>
                        <strong>Location:</strong>{" "}
                        {selectedLead.location || "N/A"}
                      </div>
                      <div>
                        <strong>Unrealized Date:</strong>{" "}
                        {new Date(
                          selectedLead.updated_at || selectedLead.created_at
                        ).toLocaleDateString()}
                      </div>
                      <div>
                        <strong>Payment Mode:</strong>{" "}
                        <span
                          className={`payment-badge ${
                            selectedLead.payment_mode === "cash"
                              ? "payment-cash"
                              : "payment-finance"
                          }`}
                        >
                          {selectedLead.payment_mode}
                        </span>
                      </div>
                      <div>
                        <strong>Lost Revenue:</strong>{" "}
                        <span className="text-orange-600 font-semibold">
                          {getTotalLostRevenue(selectedLead) > 0
                            ? `$${getTotalLostRevenue(
                                selectedLead
                              ).toLocaleString("en-IN")}`
                            : "Price on request"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h6 className="text-lg font-semibold text-primary-blue mb-4">
                      <i className="bi bi-exclamation-triangle mr-2"></i>{" "}
                      Unrealized Reason
                    </h6>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-lg font-semibold text-red-800">
                        {getUnrealizedReason(selectedLead)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <h6 className="text-lg font-semibold text-primary-blue mb-4">
                      <i className="bi bi-bicycle mr-2"></i> Vehicle Details
                    </h6>
                    <div className="space-y-4">
                      {selectedLead.lead_details?.map((vehicle) => {
                        const vehiclePrice = getVehiclePrice(vehicle);
                        const vehicleTotal = vehiclePrice * (vehicle.qty || 1);
                        const vehicleImage = getVehicleImage(vehicle);

                        return (
                          <div
                            key={vehicle.id}
                            className="flex gap-4 border border-gray-200 rounded-lg p-4"
                          >
                            <div className="w-1/4">
                              <img
                                src={vehicleImage}
                                alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
                                className="w-full h-48 object-cover rounded"
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
                                }}
                              />
                            </div>
                            <div className="w-3/4">
                              <h6 className="text-lg font-semibold text-gray-800 mb-3">
                                {vehicle.brand_name} {vehicle.variant_name}
                              </h6>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <strong>Color:</strong>{" "}
                                  {vehicle.color_name || "N/A"}
                                </div>
                                <div>
                                  <strong>Quantity:</strong> {vehicle.qty || 1}
                                </div>
                                <div>
                                  <strong>Unit Price:</strong>{" "}
                                  {vehiclePrice > 0
                                    ? `$${parseFloat(
                                        vehiclePrice
                                      ).toLocaleString("en-IN")}`
                                    : "Price on request"}
                                </div>
                                <div>
                                  <strong>Total Price:</strong>{" "}
                                  <span className="text-orange-600 font-semibold">
                                    {vehiclePrice > 0
                                      ? `$${vehicleTotal.toLocaleString(
                                          "en-IN"
                                        )}`
                                      : "Price on request"}
                                  </span>
                                </div>
                                {vehicle.close_reason && (
                                  <div className="col-span-2">
                                    <strong>Vehicle Unrealized Reason:</strong>{" "}
                                    <span className="text-red-600 font-medium ml-2">
                                      {vehicle.close_reason}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-center">
                    <button
                      className="btn-secondary rounded-md px-6 py-2 text-sm"
                      onClick={() => setIsViewModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add CSS styles */}
      <style jsx>{`
        :root {
          --primary-blue: #0f66af;
          --light-blue: #f2f9ff;
          --light-grey: #ced4da;
          --hover-blue: #084a8a;
          --highlight-yellow: #ffd700;
          --secondary-grey: #e5e7eb;
          --accent-green: #10b981;
          --accent-red: #ef4444;
          --accent-teal: #0d9488;
          --text-dark: #1f2937;
          --grey: #9ca3af;
          --blue: #3b82f6;
        }

        .btn-primary-blue {
          background-color: var(--primary-blue);
          color: white;
          transition: all 0.2s ease;
        }

        .btn-primary-blue:hover {
          box-shadow: 0 4px 8px rgba(15, 102, 175, 0.3);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background-color: #6c757d;
          color: white;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
        }

        .payment-badge {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .payment-cash {
          background-color: rgba(16, 185, 129, 0.2);
          color: var(--accent-green);
        }

        .payment-finance {
          background-color: rgba(239, 68, 68, 0.2);
          color: var(--accent-red);
        }

        .unrealized-badge {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
          background-color: rgba(239, 68, 68, 0.15);
          color: var(--accent-red);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .action-buttons {
          position: absolute;
          top: 16px;
          right: 16px;
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .action-btn:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          transform: scale(1.05);
        }

        .btn-view {
          background-color: rgba(67, 97, 238, 0.1);
          color: var(--primary-blue);
        }

        .location-info {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
          margin-top: 4px;
        }

        .vehicle-info {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #6b7280;
          font-size: 14px;
          margin-top: 4px;
        }

        .mobile-concise-view .vehicle-section {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .mobile-concise-view .vehicle-section:last-child {
          border-bottom: none;
        }

        .mobile-concise-view .detail-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .mobile-concise-view .detail-value {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
}

// Loader Component
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-[var(--primary-blue)] border-dashed rounded-full animate-spin"></div>
      <span className="text-gray-600 font-medium">Loading...</span>
    </div>
  );
}

// Error Component
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <i className="bi bi-exclamation-triangle text-red-500 text-4xl"></i>
      <p className="text-red-500 text-lg font-medium text-center max-w-md">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="bg-[var(--primary-blue)] text-white rounded-lg px-6 py-2 text-sm font-medium flex items-center"
      >
        <i className="bi bi-arrow-clockwise mr-2"></i>
        Try Again
      </button>
    </div>
  );
}
