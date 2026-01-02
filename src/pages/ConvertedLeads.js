import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Footer from "../components/Layout/Footer";

export default function ConvertedLeads() {
  const [convertedLeads, setConvertedLeads] = useState([]);
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

  // Simplified price calculation to match OpenLeads.js
  const getVehiclePrice = (vehicle) => {
    let price = 0;
    // Try in this order (same as OpenLeads.js)
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

  // Enhanced total revenue calculation
  const getTotalRevenue = (lead) => {
    if (!lead.lead_details || lead.lead_details.length === 0) {
      return 0;
    }
    const invoicedVehicles = lead.lead_details.filter(
      (vehicle) => vehicle.invoice_no && vehicle.invoice_no.trim() !== ""
    );
    const total = invoicedVehicles.reduce((sum, vehicle) => {
      const price = getVehiclePrice(vehicle);
      const qty = parseInt(vehicle.qty) || 1;
      return sum + price * qty;
    }, 0);
    return total;
  };

  // Fetch converted leads data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch converted leads
        const leadsResponse = await axios.get(`${API_BASE}/converted-leads`, {
          headers: getAuthHeaders(),
        });

        let leads = [];
        if (leadsResponse.data.success || Array.isArray(leadsResponse.data)) {
          leads = leadsResponse.data.data || leadsResponse.data || [];
        }

        console.log("Raw leads from API:", leads); // Debug log

        // 2. Fetch all enrichment data in parallel
        const [brandsRes, variantsRes, colorsRes, galleriesRes] =
          await Promise.all([
            axios.get(`${API_BASE}/brands`, { headers: getAuthHeaders() }),
            axios.get(`${API_BASE}/variants`, { headers: getAuthHeaders() }),
            axios.get(`${API_BASE}/colors`, { headers: getAuthHeaders() }),
            axios.get(`${API_BASE}/galleries`, { headers: getAuthHeaders() }),
          ]);

        const brands = brandsRes.data.data || brandsRes.data || [];
        const variants = variantsRes.data.data || variantsRes.data || [];
        const colors = colorsRes.data.data || colorsRes.data || [];
        const galleries = galleriesRes.data.status
          ? galleriesRes.data.data || []
          : [];

        console.log("Brands fetched:", brands.length); // Debug
        console.log("Variants fetched:", variants.length); // Debug

        // 3. Enrich leads with brand/variant names
        const enrichedLeads = leads.map((lead) => {
          if (!lead.lead_details || !Array.isArray(lead.lead_details)) {
            return { ...lead, lead_details: [] };
          }

          const enrichedDetails = lead.lead_details.map((vehicle) => {
            // Find brand by ID
            const brand = brands.find(
              (b) => b.id == vehicle.brand_id || b.id === vehicle.brand_id
            );

            // Find variant by ID
            const variant = variants.find(
              (v) => v.id == vehicle.variant_id || v.id === vehicle.variant_id
            );

            // Find color by ID
            const color = colors.find(
              (c) => c.id == vehicle.color_id || c.id === vehicle.color_id
            );

            console.log("Vehicle enrichment:", {
              // Debug
              vehicleId: vehicle.id,
              brandId: vehicle.brand_id,
              brandFound: !!brand,
              variantId: vehicle.variant_id,
              variantFound: !!variant,
            });

            return {
              ...vehicle,
              brand: brand || null,
              variant: variant || null,
              color: color || null,
              // Always ensure these fields exist
              brand_name: brand?.name || vehicle.brand_name || "Unknown Brand",
              variant_name:
                variant?.name || vehicle.variant_name || "Unknown Variant",
              color_name:
                color?.color_name || color?.name || vehicle.color_name || "N/A",
              color_code: color?.color_code || vehicle.color_code || "",
            };
          });

          return {
            ...lead,
            lead_details: enrichedDetails,
          };
        });

        console.log("First enriched lead:", enrichedLeads[0]); // Debug

        setConvertedLeads(enrichedLeads);
        setFilteredLeads(enrichedLeads);
        setBrands(brands);
        setVariants(variants);
        setColors(colors);
        setGalleries(galleries);

        if (enrichedLeads.length === 0) {
          setError("No converted leads found.");
        }
      } catch (err) {
        console.error("Error fetching converted leads:", err);
        setError("Failed to fetch converted leads. Please try again later.");
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
        const leadsResponse = await axios.get(`${API_BASE}/converted-leads`, {
          headers: getAuthHeaders(),
        });
        if (leadsResponse.data.success || Array.isArray(leadsResponse.data)) {
          const leads = leadsResponse.data.data || leadsResponse.data || [];
          setConvertedLeads(leads);
          setFilteredLeads(leads);
        }
      } catch (err) {
        setError("Failed to fetch converted leads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  const calculateConversionTime = (createdDate, convertedDate) => {
    const created = new Date(createdDate);
    const converted = convertedDate ? new Date(convertedDate) : new Date();
    const diffTime = converted - created;
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

  const getAbsoluteInvoiceUrl = (path) => {
    if (typeof path !== "string" || !path) {
      return null;
    }
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    if (path.startsWith("/")) {
      return `http://localhost:8000${path}`;
    }
    const cleanPath = path.replace(/^[\\/]+/, "");
    return `http://localhost:8000/uploads/invoices/${cleanPath}`;
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

  if (loading) return <Loader />;
  if (error && convertedLeads.length === 0)
    return <ErrorMessage message={error} onRetry={handleRefresh} />;

  return (
    <Container>
      <div className="min-h-screen bg-gray-50 font-montserrat text-sm">
        {/* Converted Leads Section */}
        <section className="p-4 md:p-3">
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
                  No Converted Leads
                </h3>
                <p className="text-gray-400 mb-6">
                  There are currently no converted leads in the system.
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
                  const totalRevenue = getTotalRevenue(lead);
                  const convertedDate = lead.updated_at || lead.created_at;
                  const conversionTime = calculateConversionTime(
                    lead.created_at,
                    convertedDate
                  );
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
                          <div className="vehicle-info mt-3">
                            <div className="flex items-start gap-2">
                              <i className="bi bi-bicycle mt-1"></i>
                              <div className="flex-1">
                                {lead.lead_details
                                  ?.filter((vehicle) =>
                                    vehicle.invoice_no?.trim()
                                  )
                                  .map((vehicle, index) => {
                                    // Get display name with multiple fallbacks
                                    const getDisplayName = () => {
                                      if (
                                        vehicle.brand_name &&
                                        vehicle.brand_name !==
                                          "Unknown Brand" &&
                                        vehicle.variant_name &&
                                        vehicle.variant_name !==
                                          "Unknown Variant"
                                      ) {
                                        return `${vehicle.brand_name} ${vehicle.variant_name}`;
                                      }
                                      if (
                                        vehicle.brand?.name &&
                                        vehicle.variant?.name
                                      ) {
                                        return `${vehicle.brand.name} ${vehicle.variant.name}`;
                                      }
                                      if (
                                        vehicle.brand_name ||
                                        vehicle.variant_name
                                      ) {
                                        return `${vehicle.brand_name || ""} ${
                                          vehicle.variant_name || ""
                                        }`.trim();
                                      }
                                      return `Vehicle ${
                                        vehicle.brand_id || "?"
                                      }-${vehicle.variant_id || "?"}`;
                                    };

                                    // Get vehicle price
                                    const vehiclePrice =
                                      getVehiclePrice(vehicle);
                                    const qty = parseInt(vehicle.qty) || 1;
                                    const vehicleTotal = vehiclePrice * qty;

                                    return (
                                      <div
                                        key={vehicle.id || index}
                                        className="mb-2 last:mb-0"
                                      >
                                        <div className="font-medium ">
                                          {getDisplayName()}
                                        </div>
                                      </div>
                                    );
                                  })}
                                {(!lead.lead_details ||
                                  lead.lead_details.filter((v) =>
                                    v.invoice_no?.trim()
                                  ).length === 0) && (
                                  <div className="text-gray-500 italic">
                                    No vehicles invoiced
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="converted-badge">
                              Converted {conversionTime} day
                              {conversionTime !== 1 ? "s" : ""} ago
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
                <h5 className="text-base font-medium">
                  Converted Lead Details
                </h5>
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
                          <p className="detail-value">
                            {selectedLead.phone_no}
                          </p>
                        </div>
                        <div>
                          <p className="detail-label">Location</p>
                          <p className="detail-value">
                            {selectedLead.location || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="detail-label">Converted Date</p>
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
                        <div>
                          <p className="detail-label">Total Revenue</p>
                          <p className="detail-value text-green-600 font-semibold">
                            {getTotalRevenue(selectedLead) > 0
                              ? `$${getTotalRevenue(
                                  selectedLead
                                ).toLocaleString("en-IN")}`
                              : "Price on request"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                      <h6 className="text-base font-medium text-primary-blue mb-3">
                        <i className="bi bi-bicycle mr-2"></i> Vehicles
                      </h6>
                      <div className="space-y-3">
                        {selectedLead.lead_details
                          ?.filter(
                            (vehicle) =>
                              vehicle.invoice_no &&
                              vehicle.invoice_no.trim() !== ""
                          )
                          .map((vehicle) => {
                            const vehiclePrice = getVehiclePrice(vehicle);
                            const vehicleTotal =
                              vehiclePrice * (vehicle.qty || 1);
                            const vehicleImage = getVehicleImage(vehicle);
                            const invoiceUrl = getAbsoluteInvoiceUrl(
                              vehicle.uploaded_invoice
                            );
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
                                      {vehicle.brand_name}{" "}
                                      {vehicle.variant_name}
                                    </p>
                                    <div className="text-sm text-gray-600">
                                      <p>{vehicle.color_name || "N/A"}</p>
                                      <p>Qty: {vehicle.qty || 1}</p>
                                      <p className="text-green-600 font-semibold">
                                        {vehiclePrice > 0
                                          ? `$${vehicleTotal.toLocaleString(
                                              "en-IN"
                                            )}`
                                          : "Price on request"}
                                      </p>
                                      {vehicle.invoice_no && (
                                        <div className="mt-1">
                                          <p className="text-blue-600 mb-1">
                                            Invoice: {vehicle.invoice_no}
                                          </p>
                                          {invoiceUrl && (
                                            <a
                                              href={invoiceUrl}
                                              download
                                              className="text-xs text-green-600 underline hover:text-green-800 flex items-center"
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              <i className="bi bi-download mr-1"></i>
                                              Download Uploaded Invoice
                                            </a>
                                          )}
                                        </div>
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
                          <strong>Converted Date:</strong>{" "}
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
                          <strong>Total Revenue:</strong>{" "}
                          <span className="text-green-600 font-semibold">
                            {getTotalRevenue(selectedLead) > 0
                              ? `$${getTotalRevenue(
                                  selectedLead
                                ).toLocaleString("en-IN")}`
                              : "Price on request"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border">
                      <h6 className="text-lg font-semibold text-primary-blue mb-4">
                        <i className="bi bi-bicycle mr-2"></i> Vehicle Details
                      </h6>
                      <div className="space-y-4">
                        {selectedLead.lead_details
                          ?.filter(
                            (vehicle) =>
                              vehicle.invoice_no &&
                              vehicle.invoice_no.trim() !== ""
                          )
                          .map((vehicle) => {
                            const vehiclePrice = getVehiclePrice(vehicle);
                            const vehicleTotal =
                              vehiclePrice * (vehicle.qty || 1);
                            const vehicleImage = getVehicleImage(vehicle);
                            const invoiceUrl = getAbsoluteInvoiceUrl(
                              vehicle.uploaded_invoice
                            );
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
                                    {/* {vehicle.brand_name} {vehicle.variant_name} */}
                                    {vehicle.variant_name &&
                                      vehicle.variant_name}
                                  </h6>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <strong>Color:</strong>{" "}
                                      {vehicle.color_name || "N/A"}
                                    </div>
                                    <div>
                                      <strong>Quantity:</strong>{" "}
                                      {vehicle.qty || 1}
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
                                      <span className="text-green-600 font-semibold">
                                        {vehiclePrice > 0
                                          ? `$${vehicleTotal.toLocaleString(
                                              "en-IN"
                                            )}`
                                          : "Price on request"}
                                      </span>
                                    </div>
                                    {vehicle.invoice_no && (
                                      <div className="col-span-2">
                                        <strong>Invoice No:</strong>{" "}
                                        {vehicle.invoice_no}
                                        {invoiceUrl && (
                                          <a
                                            href={invoiceUrl}
                                            download
                                            className="ml-2 text-green-600 underline hover:text-green-800 text-sm"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <i className="bi bi-download mr-1"></i>
                                            Download Uploaded Invoice
                                          </a>
                                        )}
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
          .converted-badge {
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 20px;
            font-weight: 500;
            background-color: rgba(16, 185, 129, 0.2);
            color: var(--accent-green);
            border: 1px solid rgba(16, 185, 129, 0.3);
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
      <Footer />
    </Container>
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
