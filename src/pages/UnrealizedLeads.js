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
  const [searchTerm, setSearchTerm] = useState("");
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

  // Enhanced price calculation function
  const getVehiclePrice = (vehicle) => {
    console.log("🔍 Vehicle data for price calculation:", vehicle);

    // Try multiple possible price fields with debugging
    const possiblePriceFields = [
      vehicle.variant?.basic_price,
      vehicle.variant?.price,
      vehicle.price,
      vehicle.variant_price,
      vehicle.basic_price,
      vehicle.vehicle_price,
    ];

    let finalPrice = 0;

    for (const price of possiblePriceFields) {
      if (price && !isNaN(parseFloat(price))) {
        finalPrice = parseFloat(price);
        console.log(`✅ Found price in field: ${price} = ${finalPrice}`);
        break;
      }
    }

    console.log(`💰 Final vehicle price: ${finalPrice}`);
    return finalPrice;
  };

  // Enhanced total revenue calculation
  const getTotalRevenue = (lead) => {
    if (!lead.lead_details || lead.lead_details.length === 0) {
      console.log("❌ No lead details found for revenue calculation");
      return 0;
    }

    console.log("📊 Calculating total revenue for lead:", lead.id);

    const total = lead.lead_details.reduce((sum, vehicle, index) => {
      const price = getVehiclePrice(vehicle);
      const qty = parseInt(vehicle.qty) || 1;
      const vehicleTotal = price * qty;

      console.log(
        `🚗 Vehicle ${index + 1}: ${price} * ${qty} = ${vehicleTotal}`
      );

      return sum + vehicleTotal;
    }, 0);

    console.log(`💰 Total revenue for lead ${lead.id}: ${total}`);
    return total;
  };

  // Fetch unrealized leads data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch unrealized leads - try multiple endpoints
        const endpoints = [
          `${API_BASE}/leads?status=Unrealized`,
          `${API_BASE}/leads?status=unrealized`,
          `${API_BASE}/leads-by-status?status=Unrealized`,
          `${API_BASE}/leads-by-status?status=unrealized`,
        ];

        let leadsResponse = null;
        let usedEndpoint = "";

        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            const response = await axios.get(endpoint, {
              headers: getAuthHeaders(),
            });
            leadsResponse = response;
            usedEndpoint = endpoint;
            console.log(`✅ Success with endpoint: ${endpoint}`, response.data);
            break;
          } catch (err) {
            console.log(
              `❌ Failed with endpoint: ${endpoint}`,
              err.response?.data
            );
            continue;
          }
        }

        if (!leadsResponse) {
          throw new Error("All endpoints failed. Please check your API.");
        }

        console.log("📦 API Response:", leadsResponse.data);

        if (leadsResponse.data.success || Array.isArray(leadsResponse.data)) {
          const leads = leadsResponse.data.data || leadsResponse.data || [];

          // Debug: Check the structure of the first lead
          if (leads.length > 0) {
            console.log("🔍 First lead structure:", leads[0]);
            console.log(
              "🔍 First lead's vehicle structure:",
              leads[0].lead_details?.[0]
            );

            // Test price calculation on first lead
            const testRevenue = getTotalRevenue(leads[0]);
            console.log("🧪 Test revenue calculation:", testRevenue);
          }

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

  // Filter leads based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLeads(unrealizedLeads);
    } else {
      const filtered = unrealizedLeads.filter((lead) => {
        const searchLower = searchTerm.toLowerCase();
        const customerName =
          lead.customer_name?.toLowerCase().includes(searchLower) || false;
        const location =
          lead.location?.toLowerCase().includes(searchLower) || false;
        const phone = lead.phone_no
          ? lead.phone_no.toString().includes(searchTerm)
          : false;
        const vehicleMatch =
          lead.lead_details?.some((vehicle) => {
            const brand =
              vehicle.brand_name?.toLowerCase().includes(searchLower) || false;
            const variant =
              vehicle.variant_name?.toLowerCase().includes(searchLower) ||
              false;
            const color =
              vehicle.color_name?.toLowerCase().includes(searchLower) || false;
            return brand || variant || color;
          }) || false;
        return customerName || location || phone || vehicleMatch;
      });
      setFilteredLeads(filtered);
    }
  }, [searchTerm, unrealizedLeads]);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setSearchTerm("");
    const fetchData = async () => {
      try {
        const endpoints = [
          `${API_BASE}/leads?status=Unrealized`,
          `${API_BASE}/leads?status=unrealized`,
          `${API_BASE}/leads-by-status?status=Unrealized`,
        ];

        let leadsResponse = null;

        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(endpoint, {
              headers: getAuthHeaders(),
            });
            leadsResponse = response;
            break;
          } catch (err) {
            continue;
          }
        }

        if (leadsResponse) {
          const leads = leadsResponse.data.data || leadsResponse.data || [];
          setUnrealizedLeads(leads);
          setFilteredLeads(leads);
        } else {
          setError("Failed to fetch unrealized leads. Please try again later.");
        }
      } catch (err) {
        setError("Failed to fetch unrealized leads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
      // Get reason from first vehicle (assuming all vehicles have same reason)
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Unrealized Leads
              </h1>
              <p className="text-gray-600">
                Leads that did not convert to sales
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search Box */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search unrealized leads..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    sortLeadsByDate(e.target.value);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-orange-400 text-6xl mb-4">📉</div>
              <h3 className="text-gray-500 text-xl font-medium mb-2">
                {searchTerm
                  ? "No matching unrealized leads found"
                  : "No Unrealized Leads"}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms or clear the search to see all unrealized leads."
                  : "There are currently no unrealized leads in the system."}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="btn-primary-blue rounded-lg px-6 py-3 text-sm font-medium"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/leads/open"
                  className="btn-primary-blue rounded-lg px-6 py-3 text-sm font-medium"
                >
                  <i className="bi bi-arrow-left mr-2"></i> View Open Leads
                </Link>
              )}
            </div>
          ) : (
            <div
              className="grid grid-cols-1 gap-4"
              id="unrealizedLeadsContainer"
            >
              {filteredLeads.map((lead) => {
                const totalRevenue = getTotalRevenue(lead);
                const leadAge = calculateLeadAge(lead.created_at);
                const unrealizedReason = getUnrealizedReason(lead);

                return (
                  <div
                    key={lead.id}
                    className="bg-white rounded-lg shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="p-4">
                      {/* Compact Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {lead.customer_name}
                          </h3>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <i className="bi bi-telephone text-xs"></i>
                              <span>{lead.phone_no}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <i className="bi bi-geo-alt text-xs"></i>
                              <span>{lead.location || "N/A"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Lost Revenue Badge */}
                        <div className="text-right">
                          <div className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
                            $
                            {totalRevenue > 0
                              ? totalRevenue.toLocaleString("en-IN")
                              : "0"}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Lost Revenue
                          </p>
                        </div>
                      </div>

                      {/* Unrealized Reason */}
                      <div className="mb-3">
                        <div className="bg-red-50 border border-red-200 rounded px-3 py-2">
                          <div className="flex items-center gap-2 text-xs">
                            <i className="bi bi-exclamation-triangle text-red-500"></i>
                            <span className="font-medium text-red-700">
                              Reason:{" "}
                            </span>
                            <span className="text-red-600">
                              {unrealizedReason}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Compact Vehicles */}
                      <div className="space-y-2">
                        {lead.lead_details?.map((vehicle) => {
                          const vehiclePrice = getVehiclePrice(vehicle);
                          const vehicleTotal =
                            vehiclePrice * (vehicle.qty || 1);

                          return (
                            <div
                              key={vehicle.id}
                              className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs"
                            >
                              <img
                                src={getVehicleImage(vehicle)}
                                alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
                                className="w-8 h-8 object-cover rounded"
                                onError={(e) => {
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">
                                  {vehicle.brand_name} {vehicle.variant_name}
                                </p>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <span>{vehicle.color_name || "N/A"}</span>
                                  <span>•</span>
                                  <span>Qty: {vehicle.qty || 1}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs font-semibold text-orange-600">
                                  {vehiclePrice > 0
                                    ? `$${vehicleTotal.toLocaleString("en-IN")}`
                                    : "Price N/A"}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Compact Footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <i className="bi bi-calendar-x text-xs"></i>
                            <span>
                              {new Date(
                                lead.updated_at || lead.created_at
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <i className="bi bi-clock text-xs"></i>
                            <span>{leadAge}d old</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <i className="bi bi-credit-card text-xs"></i>
                            <span
                              className={`payment-badge-sm ${
                                lead.payment_mode === "cash"
                                  ? "payment-cash"
                                  : "payment-finance"
                              }`}
                            >
                              {lead.payment_mode}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewLead(lead)}
                            className="flex items-center gap-1 px-3 py-1 bg-[var(--primary-blue)] text-white rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            <i className="bi bi-eye text-xs"></i>
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* VIEW UNREALIZED LEAD MODAL - Customer details in one card, vehicles below */}
      {isViewModalOpen && selectedLead && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4"
          onClick={() => setIsViewModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Light Theme */}
            <div className="bg-white border-b border-gray-200 p-6 rounded-t-xl flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <i className="bi bi-x-circle text-orange-600 text-xl"></i>
                </div>
                <div>
                  <h5 className="text-xl font-bold text-gray-800">
                    Unrealized Lead Details
                  </h5>
                  <p className="text-gray-600 text-sm">
                    Lead that did not convert to sale
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full transition-all duration-200 text-lg"
                onClick={() => setIsViewModalOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
              {/* Customer Information - Single Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg mr-4">
                      <i className="bi bi-person-circle text-blue-600 text-2xl"></i>
                    </div>
                    <h6 className="text-lg font-bold text-gray-800">
                      Customer Information
                    </h6>
                  </div>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Unrealized
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Customer Name
                    </label>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedLead.customer_name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Mobile Number
                    </label>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedLead.phone_no}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Location
                    </label>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedLead.location || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Payment Mode
                    </label>
                    <span
                      className={`payment-badge-light ${
                        selectedLead.payment_mode === "cash"
                          ? "payment-cash-light"
                          : "payment-finance-light"
                      }`}
                    >
                      {selectedLead.payment_mode}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Unrealized Date
                    </label>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(
                        selectedLead.updated_at || selectedLead.created_at
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Lost Revenue
                    </label>
                    <p className="text-sm font-bold text-orange-600">
                      ${getTotalRevenue(selectedLead).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Unrealized Reason */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <i className="bi bi-exclamation-triangle text-red-600"></i>
                      </div>
                      <div>
                        <h6 className="text-sm font-semibold text-red-800 mb-1">
                          Reason for Unrealized
                        </h6>
                        <p className="text-sm text-red-700">
                          {getUnrealizedReason(selectedLead)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Information Section */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <i className="bi bi-bicycle text-purple-600"></i>
                  </div>
                  <h6 className="text-lg font-bold text-gray-800">
                    Vehicle Details
                  </h6>
                  <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {selectedLead.lead_details?.length || 0} vehicle(s)
                  </span>
                </div>

                {/* Vehicle Cards */}
                <div className="space-y-4">
                  {selectedLead.lead_details?.map((vehicle, index) => {
                    const vehicleImage = getVehicleImage(vehicle);
                    const vehiclePrice = getVehiclePrice(vehicle);
                    const vehicleTotal = vehiclePrice * (vehicle.qty || 1);
                    const displayPrice =
                      vehiclePrice > 0
                        ? `$${vehicleTotal.toLocaleString("en-IN")}`
                        : "Price on request";

                    return (
                      <div
                        key={vehicle.id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                      >
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            {/* Vehicle Image */}
                            <div className="lg:w-1/3">
                              <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                <img
                                  src={vehicleImage}
                                  alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
                                  className="w-full h-48 object-cover"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
                                  }}
                                />
                              </div>
                            </div>

                            {/* Vehicle Details */}
                            <div className="lg:w-2/3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-500 uppercase">
                                    Brand
                                  </label>
                                  <p className="text-sm font-medium text-gray-800">
                                    {vehicle.brand_name || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-500 uppercase">
                                    Variant
                                  </label>
                                  <p className="text-sm font-medium text-gray-800">
                                    {vehicle.variant_name || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-500 uppercase">
                                    Color
                                  </label>
                                  <p className="text-sm font-medium text-gray-800">
                                    {vehicle.color_name || "N/A"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-500 uppercase">
                                    Quantity
                                  </label>
                                  <p className="text-sm font-medium text-gray-800">
                                    {vehicle.qty || 1}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-gray-500 uppercase">
                                    Total Price
                                  </label>
                                  <p className="text-sm font-bold text-orange-600">
                                    {displayPrice}
                                  </p>
                                </div>
                                {vehicle.close_reason && (
                                  <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-semibold text-gray-500 uppercase">
                                      Vehicle Unrealized Reason
                                    </label>
                                    <p className="text-sm text-red-600 font-medium">
                                      {vehicle.close_reason}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-gray-600 transition-all duration-200 font-medium"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  <i className="bi bi-x-lg"></i>
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS styles */}
      <style jsx>{`
        :root {
          --primary-blue: #0f66af;
        }

        .btn-primary-blue {
          background-color: var(--primary-blue);
          color: white;
          transition: all 0.2s ease;
        }

        .btn-primary-blue:hover {
          box-shadow: 0 4px 8px rgba(15, 102, 175, 0.3);
        }

        .payment-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .payment-badge-sm {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .payment-badge-light {
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .payment-cash {
          background-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .payment-finance {
          background-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .payment-cash-light {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .payment-finance-light {
          background-color: #fecaca;
          color: #991b1b;
          border: 1px solid #fca5a5;
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
      <span className="text-gray-600 font-medium">
        Loading...
      </span>
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
