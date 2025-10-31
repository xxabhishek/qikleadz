import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function OpenLeads() {
  const [openLeads, setOpenLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloseLeadModalOpen, setIsCloseLeadModalOpen] = useState(false);
  const [isConvertedLeadModalOpen, setIsConvertedLeadModalOpen] =
    useState(false);
  const [isCloseEntireLeadModalOpen, setIsCloseEntireLeadModalOpen] =
    useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [closeType, setCloseType] = useState("converted");
  const [unrealizedReason, setUnrealizedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceCopy, setInvoiceCopy] = useState(null);
  const [confirmDetails, setConfirmDetails] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);
  const [colors, setColors] = useState([]);

  const API_BASE = " http://localhost:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  // Refresh lead data when view modal opens
  useEffect(() => {
    if (isViewModalOpen && selectedLead) {
      const refreshSelectedLead = async () => {
        try {
          const response = await axios.get(
            `${API_BASE}/leads/${selectedLead.id}`,
            { headers: getAuthHeaders() }
          );
          if (response.data.success) {
            setSelectedLead(response.data.data);
          }
        } catch (err) {
          console.error("Failed to refresh lead data:", err);
        }
      };
      refreshSelectedLead();
    }
  }, [isViewModalOpen, selectedLead?.id]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch open leads
        const leadsResponse = await axios.get(
          `${API_BASE}/leads-by-status?status=Open`,
          { headers: getAuthHeaders() }
        );
        if (leadsResponse.data.success) {
          const leads = leadsResponse.data.data || [];
          setOpenLeads(leads);
          setFilteredLeads(leads);
          if (leads.length === 0) {
            setError("No open leads found.");
          }
        } else {
          setError(leadsResponse.data.message || "Failed to fetch open leads.");
        }
        // Fetch galleries
        const galleriesResponse = await axios.get(`${API_BASE}/galleries`, {
          headers: getAuthHeaders(),
        });
        if (galleriesResponse.data.status) {
          setGalleries(galleriesResponse.data.data || []);
        }
        // Fetch variants
        const variantsResponse = await axios.get(`${API_BASE}/variants`, {
          headers: getAuthHeaders(),
        });
        if (variantsResponse.data.data || variantsResponse.data) {
          setVariants(
            variantsResponse.data.data || variantsResponse.data || []
          );
        }
        // Fetch brands
        const brandsResponse = await axios.get(`${API_BASE}/brands`, {
          headers: getAuthHeaders(),
        });
        if (brandsResponse.data.data || brandsResponse.data) {
          setBrands(brandsResponse.data.data || brandsResponse.data || []);
        }
        // Fetch colors
        const colorsResponse = await axios.get(`${API_BASE}/colors`, {
          headers: getAuthHeaders(),
        });
        if (colorsResponse.data.data || colorsResponse.data) {
          setColors(colorsResponse.data.data || colorsResponse.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter leads based on search term
  // Filter leads based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLeads(openLeads);
    } else {
      const filtered = openLeads.filter((lead) => {
        const searchLower = searchTerm.toLowerCase();

        // Safely check customer_name (handle null/undefined)
        const customerName =
          lead.customer_name?.toLowerCase().includes(searchLower) || false;

        // Safely check location (handle null/undefined)
        const location =
          lead.location?.toLowerCase().includes(searchLower) || false;

        // Safely check phone_no - convert to string first
        const phone = lead.phone_no
          ? lead.phone_no.toString().includes(searchTerm)
          : false;

        // Check vehicle details
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
  }, [searchTerm, openLeads]);

  // Handler functions for dropdown changes
  const handleBrandChange = (brandId, vehicleIndex) => {
    setSelectedLead((prevLead) => {
      if (!prevLead) return prevLead;
      const updatedLeadDetails = [...prevLead.lead_details];
      const selectedBrand = brands.find((brand) => brand.id == brandId);
      updatedLeadDetails[vehicleIndex] = {
        ...updatedLeadDetails[vehicleIndex],
        brand_id: brandId,
        brand_name: selectedBrand?.name || "",
        variant_id: "",
        variant_name: "",
        color_id: "",
        color_name: "",
        color_code: "",
        variant: null,
        color: null,
      };
      return {
        ...prevLead,
        lead_details: updatedLeadDetails,
      };
    });
  };

  const handleVariantChange = (variantId, vehicleIndex) => {
    setSelectedLead((prevLead) => {
      if (!prevLead) return prevLead;
      const updatedLeadDetails = [...prevLead.lead_details];
      const selectedVariant = variants.find(
        (variant) => variant.id == variantId
      );
      updatedLeadDetails[vehicleIndex] = {
        ...updatedLeadDetails[vehicleIndex],
        variant_id: variantId,
        variant_name: selectedVariant?.name || "",
        color_id: "",
        color_name: "",
        color_code: "",
        variant: selectedVariant,
        color: null,
      };
      return {
        ...prevLead,
        lead_details: updatedLeadDetails,
      };
    });
  };

  const handleColorChange = (colorId, vehicleIndex) => {
    setSelectedLead((prevLead) => {
      if (!prevLead) return prevLead;
      const updatedLeadDetails = [...prevLead.lead_details];
      const selectedColor = colors.find((color) => color.id == colorId);
      updatedLeadDetails[vehicleIndex] = {
        ...updatedLeadDetails[vehicleIndex],
        color_id: colorId,
        color_name: selectedColor?.name || selectedColor?.color_name || "",
        color_code: selectedColor?.color_code || "",
        color: selectedColor,
      };
      return {
        ...prevLead,
        lead_details: updatedLeadDetails,
      };
    });
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setSearchTerm("");
    const fetchData = async () => {
      try {
        const leadsResponse = await axios.get(
          `${API_BASE}/leads-by-status?status=Open`,
          { headers: getAuthHeaders() }
        );
        if (leadsResponse.data.success) {
          const leads = leadsResponse.data.data || [];
          setOpenLeads(leads);
          setFilteredLeads(leads);
        }
      } catch (err) {
        setError("Failed to fetch open leads. Please try again later.");
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
    const currentDate = new Date();
    const leadDate = new Date(createdDate);
    const diffTime = currentDate - leadDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDraftAgeClass = (days) => {
    return days <= 3 ? "draft-new" : "draft-old";
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
    // SAFEGUARD: Only call .startsWith on strings
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

  const getInvoiceUrl = (invoicePath) => {
    if (!invoicePath) return null;
    if (
      invoicePath.startsWith("http://") ||
      invoicePath.startsWith("https://")
    ) {
      return invoicePath;
    }
    if (invoicePath.startsWith("/")) {
      return ` http://localhost:8000${invoicePath}`;
    }
    return ` http://localhost:8000/storage/${invoicePath}`;
  };

  const handleViewLead = async (lead) => {
    console.log("Opening view modal for lead:", lead.id);
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

  const handleEditLead = (lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleCloseEntireLead = (lead) => {
    setSelectedLead(lead);
    setCloseType("converted");
    setUnrealizedReason("");
    setOtherReason("");
    setIsCloseEntireLeadModalOpen(true);
  };

  const handleCloseVehicle = (lead, vehicleId) => {
    setSelectedLead(lead);
    setSelectedVehicleId(vehicleId);
    setCloseType("converted");
    setUnrealizedReason("");
    setOtherReason("");
    setIsCloseLeadModalOpen(true);
  };

  const handleProcessCloseEntireLead = async () => {
    if (!selectedLead) return;
    try {
      if (closeType === "converted") {
        setInvoiceNumber("");
        setInvoiceCopy(null);
        setConfirmDetails(true);
        setIsCloseEntireLeadModalOpen(false);
        setIsConvertedLeadModalOpen(true);
      } else {
        if (!unrealizedReason) {
          alert("Please select a reason for unrealized lead.");
          return;
        }
        const closeReason =
          unrealizedReason === "other" ? otherReason : unrealizedReason;
        console.log("Closing entire lead as unrealized:", {
          close_reason: closeReason,
        });
        await axios.put(
          `${API_BASE}/leads/${selectedLead.id}/close-entire`,
          {
            close_type: "unrealized",
            unrealized_reason: closeReason,
          },
          { headers: getAuthHeaders() }
        );
        setOpenLeads((prev) =>
          prev.filter((lead) => lead.id !== selectedLead.id)
        );
        setFilteredLeads((prev) =>
          prev.filter((lead) => lead.id !== selectedLead.id)
        );
        setIsCloseEntireLeadModalOpen(false);
        setSelectedLead(null);
        alert("Entire lead marked as unrealized successfully!");
      }
    } catch (err) {
      console.error("Failed to close entire lead:", err);
      console.error("Error response:", err.response);
      alert(
        `Failed to close entire lead: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  const handleProcessCloseLead = async () => {
    if (!selectedLead || !selectedVehicleId) return;
    const vehicle = selectedLead.lead_details.find(
      (v) => v.id === selectedVehicleId
    );
    if (!vehicle) return;
    if (closeType === "converted") {
      setInvoiceNumber("");
      setInvoiceCopy(null);
      setConfirmDetails(true);
      setIsCloseLeadModalOpen(false);
      setIsConvertedLeadModalOpen(true);
    } else {
      if (!unrealizedReason) {
        alert("Please select a reason for unrealized lead.");
        return;
      }
      try {
        const closeReason =
          unrealizedReason === "other" ? otherReason : unrealizedReason;
        console.log("Sending unrealized lead data:", {
          close_reason: closeReason,
        });
        await axios.put(
          `${API_BASE}/lead-details/${vehicle.id}/close`,
          {
            close_reason: closeReason,
          },
          { headers: getAuthHeaders() }
        );
        const updatedLead = { ...selectedLead };
        const vehicleIndex = updatedLead.lead_details.findIndex(
          (v) => v.id === selectedVehicleId
        );
        updatedLead.lead_details[vehicleIndex].status = "unrealized";
        updatedLead.lead_details[vehicleIndex].close_reason = closeReason;
        const allClosed = updatedLead.lead_details.every(
          (v) => v.status !== "open"
        );
        if (allClosed) {
          await axios.put(
            `${API_BASE}/leads/${selectedLead.id}/status`,
            { status: "closed" },
            { headers: getAuthHeaders() }
          );
          setOpenLeads((prev) =>
            prev.filter((lead) => lead.id !== selectedLead.id)
          );
          setFilteredLeads((prev) =>
            prev.filter((lead) => lead.id !== selectedLead.id)
          );
        } else {
          setOpenLeads((prev) =>
            prev.map((lead) =>
              lead.id === selectedLead.id ? updatedLead : lead
            )
          );
          setFilteredLeads((prev) =>
            prev.map((lead) =>
              lead.id === selectedLead.id ? updatedLead : lead
            )
          );
        }
        setIsCloseLeadModalOpen(false);
        setSelectedLead(null);
        setSelectedVehicleId(null);
        alert("Vehicle marked as unrealized successfully!");
      } catch (err) {
        console.error("Failed to close vehicle:", err);
        console.error("Error response:", err.response);
        alert(
          `Failed to close vehicle: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    }
  };

  const handleSubmitConvertedLead = async () => {
    if (!selectedLead) return;
    try {
      if (selectedVehicleId) {
        if (!invoiceNumber) {
          alert("Please enter invoice number.");
          return;
        }
        const response = await axios.put(
          `${API_BASE}/lead-details/${selectedVehicleId}/close`,
          { invoice_no: invoiceNumber },
          { headers: getAuthHeaders() }
        );
        const updatedLead = { ...selectedLead };
        const vehicleIndex = updatedLead.lead_details.findIndex(
          (v) => v.id === selectedVehicleId
        );
        updatedLead.lead_details[vehicleIndex].status = "converted";
        updatedLead.lead_details[vehicleIndex].invoice_no = invoiceNumber;
        const allClosed = updatedLead.lead_details.every(
          (v) => v.status !== "open"
        );
        if (allClosed) {
          await axios.put(
            `${API_BASE}/leads/${selectedLead.id}/update-status`,
            {
              status: "closed",
              lead_detail_id: selectedVehicleId,
            },
            { headers: getAuthHeaders() }
          );
          setOpenLeads((prev) =>
            prev.filter((lead) => lead.id !== selectedLead.id)
          );
          setFilteredLeads((prev) =>
            prev.filter((lead) => lead.id !== selectedLead.id)
          );
        } else {
          setOpenLeads((prev) =>
            prev.map((lead) =>
              lead.id === selectedLead.id ? updatedLead : lead
            )
          );
          setFilteredLeads((prev) =>
            prev.map((lead) =>
              lead.id === selectedLead.id ? updatedLead : lead
            )
          );
        }
        setIsConvertedLeadModalOpen(false);
        setSelectedLead(null);
        setSelectedVehicleId(null);
        alert("Vehicle converted successfully!");
      } else {
        if (!invoiceNumber) {
          alert("Please enter invoice number.");
          return;
        }
        const convertPromises = selectedLead.lead_details.map((vehicle) => {
          return axios.put(
            `${API_BASE}/lead-details/${vehicle.id}/close`,
            { invoice_no: invoiceNumber },
            { headers: getAuthHeaders() }
          );
        });
        const results = await Promise.allSettled(convertPromises);
        const rejected = results.filter(
          (result) => result.status === "rejected"
        );
        if (rejected.length > 0) {
          throw new Error(`${rejected.length} vehicles failed to convert`);
        }
        await axios.put(
          `${API_BASE}/leads/${selectedLead.id}/update-status`,
          {
            status: "closed",
            lead_detail_id: selectedLead.lead_details[0]?.id,
          },
          { headers: getAuthHeaders() }
        );
        setOpenLeads((prev) =>
          prev.filter((lead) => lead.id !== selectedLead.id)
        );
        setFilteredLeads((prev) =>
          prev.filter((lead) => lead.id !== selectedLead.id)
        );
        setIsConvertedLeadModalOpen(false);
        setSelectedLead(null);
        alert("Entire lead converted successfully!");
      }
    } catch (err) {
      console.error("Failed to convert lead:", err);
      alert(
        `Failed to convert lead: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const handleSaveLead = async () => {
    if (!selectedLead) return;
    try {
      const leadPayload = {
        customer_name: selectedLead.customer_name || "",
        phone_no: selectedLead.phone_no || "",
        location: selectedLead.location || "",
        payment_mode: selectedLead.payment_mode || "",
        tentative_purchase_date: selectedLead.tentative_purchase_date || null,
        vehicle_qty: selectedLead.lead_details?.length || 1,
        status: "Open",
      };
      if (!leadPayload.customer_name) {
        throw new Error("Customer name is required.");
      }
      if (!leadPayload.phone_no || !/^[0-9]{10}$/.test(leadPayload.phone_no)) {
        throw new Error("Phone number must be a valid 10-digit number.");
      }
      const leadResponse = await axios.put(
        `${API_BASE}/leads/${selectedLead.id}`,
        leadPayload,
        { headers: getAuthHeaders() }
      );
      if (!leadResponse.data.success) {
        throw new Error(leadResponse.data.message || "Failed to update lead");
      }
      const updatedLeadDetails = [];
      for (const vehicle of selectedLead.lead_details) {
        const vehiclePayload = {
          brand_id: vehicle.brand_id,
          variant_id: vehicle.variant_id,
          color_id: vehicle.color_id || null,
          status: vehicle.status || "Open",
        };
        if (vehicle.id) {
          const vehicleResponse = await axios.put(
            `${API_BASE}/lead-details/${vehicle.id}`,
            vehiclePayload,
            { headers: getAuthHeaders() }
          );
          if (vehicleResponse.data.success) {
            const updatedVehicle = vehicleResponse.data.data;
            const brand = brands.find((b) => b.id == updatedVehicle.brand_id);
            const variant = variants.find(
              (v) => v.id == updatedVehicle.variant_id
            );
            const color = colors.find((c) => c.id == updatedVehicle.color_id);
            updatedLeadDetails.push({
              ...updatedVehicle,
              brand: brand || null,
              variant: variant || null,
              color: color || null,
              brand_name: brand?.name || "",
              variant_name: variant?.name || "",
              color_name: color?.name || color?.color_name || "",
              color_code: color?.color_code || "",
            });
          } else {
            throw new Error(
              vehicleResponse.data.message ||
                `Failed to update vehicle ${vehicle.id}`
            );
          }
        }
      }
      setOpenLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLead.id
            ? {
                ...lead,
                ...leadResponse.data.data,
                lead_details: updatedLeadDetails,
              }
            : lead
        )
      );
      setFilteredLeads((prev) =>
        prev.map((lead) =>
          lead.id === selectedLead.id
            ? {
                ...lead,
                ...leadResponse.data.data,
                lead_details: updatedLeadDetails,
              }
            : lead
        )
      );
      setSelectedLead((prev) => ({
        ...prev,
        ...leadResponse.data.data,
        lead_details: updatedLeadDetails,
      }));
      setIsEditModalOpen(false);
      alert("Lead updated successfully!");
    } catch (err) {
      console.error("Failed to update lead:", err);
      alert(
        `Failed to update lead: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const sortLeadsByAge = (order) => {
    if (order === "newest") {
      setFilteredLeads((prev) =>
        [...prev].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
    } else {
      setFilteredLeads((prev) =>
        [...prev].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        )
      );
    }
  };

  if (loading) return <Loader />;
  if (error && openLeads.length === 0)
    return <ErrorMessage message={error} onRetry={handleRefresh} />;

  return (
    <div className="min-h-screen bg-gray-50 font-montserrat text-sm">
      {/* Open Leads Section */}
      <section className="p-4 md:p-6">
        <div className="container mx-auto px-0 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* Search Bar */}
            <div className="w-full sm:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, location, phone, vehicle..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full sm:w-80 border border-secondary-grey rounded-md px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                />
                <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Sort Controls */}
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
                  sortLeadsByAge(e.target.value);
                }}
                className="border border-secondary-grey rounded-md px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-primary-blue"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                Showing {filteredLeads.length} result
                {filteredLeads.length !== 1 ? "s" : ""} for "
                <strong>{searchTerm}</strong>"
                {filteredLeads.length === 0 && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 text-blue-600 underline hover:text-blue-800"
                  >
                    Clear search
                  </button>
                )}
              </p>
            </div>
          )}

          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-gray-500 text-xl font-medium mb-2">
                {searchTerm ? "No matching leads found" : "No Open Leads"}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms or clear the search to see all leads."
                  : error || "There are currently no open leads in the system."}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="btn-primary-blue rounded-md px-6 py-3 text-sm font-medium"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/leads/generate"
                  className="btn-primary-blue rounded-md px-6 py-3 text-sm font-medium"
                >
                  <i className="bi bi-plus-lg"></i> Create New Lead
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4" id="leadsContainer">
              {filteredLeads.map((lead) => {
                const draftAge = calculateLeadAge(lead.created_at);
                const draftAgeClass = getDraftAgeClass(draftAge);
                return (
                  <div
                    key={lead.id}
                    className="lead-card bg-white p-5 rounded-lg shadow-md"
                    data-lead-id={lead.id}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h6 className="text-base font-semibold text-text-dark mb-1">
                              {lead.customer_name}
                            </h6>
                            <p className="text-sm text-gray-600 mb-1">
                              {lead.location || "N/A"}
                            </p>
                          </div>
                          <div className="desktop-actions flex gap-2">
                            <div
                              className="action-btn btn-view"
                              title="View"
                              onClick={() => handleViewLead(lead)}
                            >
                              <i className="bi bi-eye"></i>
                            </div>
                            <div
                              className="action-btn btn-edit"
                              title="Edit"
                              onClick={() => handleEditLead(lead)}
                            >
                              <i className="bi bi-pencil"></i>
                            </div>
                            <div
                              className="action-btn btn-close"
                              title="Close Lead"
                              onClick={() => handleCloseEntireLead(lead)}
                            >
                              <i className="bi bi-check-lg"></i>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 space-y-1">
                          {lead.lead_details?.map((vehicle) => (
                            <p
                              key={vehicle.id}
                              className="text-sm text-gray-600 mb-1"
                            >
                              {vehicle.brand?.name || "No brand"} -{" "}
                              {vehicle.variant?.name || "No variant"}
                              {vehicle.color?.name &&
                                ` - ${vehicle.color.name}`}
                              {vehicle.invoice_no &&
                                ` (Invoice: ${vehicle.invoice_no})`}
                            </p>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`draft-age ${draftAgeClass}`}>
                            {draftAge} day{draftAge !== 1 ? "s" : ""}
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
                        <div className="mobile-actions flex gap-2 mt-3">
                          <div
                            className="action-btn btn-view"
                            title="View"
                            onClick={() => handleViewLead(lead)}
                          >
                            <i className="bi bi-eye"></i>
                          </div>
                          <div
                            className="action-btn btn-edit"
                            title="Edit"
                            onClick={() => handleEditLead(lead)}
                          >
                            <i className="bi bi-pencil"></i>
                          </div>
                          <div
                            className="action-btn btn-close"
                            title="Close Lead"
                            onClick={() => handleCloseEntireLead(lead)}
                          >
                            <i className="bi bi-check-lg"></i>
                          </div>
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

      {/* All your existing modals remain exactly the same */}
      {/* VIEW LEAD MODAL */}
      {isViewModalOpen && selectedLead && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
          onClick={() => setIsViewModalOpen(false)}
          key={`view-modal-${selectedLead.id}-${selectedLead.updated_at}`}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
              <h5 className="text-base font-medium">Lead Details</h5>
              <button
                type="button"
                className="text-white hover:text-gray-200 text-lg"
                onClick={() => setIsViewModalOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {/* Customer Information */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                <h6 className="text-base font-medium text-primary-blue mb-3 flex items-center">
                  <i className="bi bi-person-fill mr-2"></i> Customer
                  Information
                </h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Name
                    </label>
                    <p className="text-sm font-medium text-text-dark">
                      {selectedLead.customer_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Mobile
                    </label>
                    <p className="text-sm font-medium text-text-dark">
                      {selectedLead.phone_no}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Location
                    </label>
                    <p className="text-sm font-medium text-text-dark">
                      {selectedLead.location || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Payment Mode
                    </label>
                    <p className="text-sm font-medium text-text-dark">
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

              {/* Vehicles with Close Button Performing "Close Entire Lead" */}
              {selectedLead.lead_details.map((vehicle, index) => {
                const vehiclePrice = vehicle.variant?.basic_price
                  ? `₹${parseFloat(vehicle.variant.basic_price).toLocaleString(
                      "en-IN"
                    )}`
                  : "Price on request";
                const vehicleColor =
                  vehicle.color?.name || vehicle.color_name || "N/A";
                return (
                  <div
                    key={vehicle.id}
                    className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h6 className="text-base font-medium text-primary-blue flex items-center">
                        <i className="bi bi-bicycle mr-2"></i> Vehicle{" "}
                        {index + 1}
                      </h6>
                      {/* ✅ CLOSE BUTTON - NOW TRIGGERS "CLOSE ENTIRE LEAD" */}
                      {vehicle.status === "open" && (
                        <button
                          className="action-btn btn-close"
                          title="Close Entire Lead"
                          onClick={() => handleCloseEntireLead(selectedLead)}
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="lg:w-1/3">
                        <img
                          src={getVehicleImage(vehicle)}
                          alt={`${vehicle.brand?.name} ${vehicle.variant?.name}`}
                          className="w-full h-48 sm:h-64 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
                          }}
                        />
                      </div>
                      <div className="lg:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Brand
                            </label>
                            <p className="text-sm font-medium text-text-dark">
                              {vehicle.brand?.name || "N/A"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Variant
                            </label>
                            <p className="text-sm font-medium text-text-dark">
                              {vehicle.variant?.name || "N/A"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Color
                            </label>
                            <p className="text-sm font-medium text-text-dark">
                              {vehicleColor}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Price
                            </label>
                            <p className="text-sm font-medium text-primary-blue">
                              {vehiclePrice}
                            </p>
                          </div>
                          {vehicle.invoice_no && (
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Invoice No
                              </label>
                              <p className="text-sm font-medium text-text-dark">
                                {vehicle.invoice_no}
                              </p>
                            </div>
                          )}
                          {vehicle.uploaded_invoice && (
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Invoice Copy
                              </label>
                              <a
                                href={getInvoiceUrl(vehicle.uploaded_invoice)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-blue underline text-sm"
                              >
                                View Invoice
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                <button
                  className="btn-primary-blue rounded-md px-4 py-2 text-sm w-full sm:w-auto"
                  onClick={() => handleCloseEntireLead(selectedLead)}
                >
                  Close Entire Lead
                </button>
                <button
                  className="btn-secondary rounded-md px-4 py-2 text-sm w-full sm:w-auto"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All other modals (Close Entire Lead Modal, Edit Lead Modal, Close Vehicle Modal, Converted Lead Modal) remain exactly the same */}
      {/* ... */}

      <style jsx>{`
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
        }
        .btn-view {
          background-color: rgba(67, 97, 238, 0.1);
          color: var(--primary-blue);
        }
        .btn-edit {
          background-color: rgba(248, 150, 30, 0.1);
          color: var(--highlight-yellow);
        }
        .btn-close {
          background-color: rgba(16, 185, 129, 0.1);
          color: black;
        }
        .draft-age {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
        }
        .draft-new {
          background-color: rgba(16, 185, 129, 0.2);
          color: var(--accent-green);
        }
        .draft-old {
          background-color: rgba(239, 68, 68, 0.2);
          color: var(--accent-red);
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
        .btn-primary-blue {
          background-color: var(--primary-blue);
          color: white;
          transition: all 0.2s ease;
        }
        .btn-primary-blue:hover {
          box-shadow: 0 4px 8px rgba(67, 97, 238, 0.3);
        }
        .btn-secondary {
          background-color: #6c757d;
          color: white;
          transition: all 0.2s ease;
        }
        .btn-secondary:hover {
          box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
        }
        .btn-success {
          background-color: var(--accent-green);
          color: white;
          transition: all 0.2s ease;
        }
        .btn-success:hover {
          box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
        }
        @media (max-width: 640px) {
          .lead-card {
            padding: 1rem;
          }
          .desktop-actions {
            display: none;
          }
          .mobile-actions {
            display: flex;
            gap: 8px;
            margin-top: 12px;
          }
        }
        @media (min-width: 641px) {
          .mobile-actions {
            display: none;
          }
          .desktop-actions {
            display: flex;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

// --- Loader Component ---
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-montserrat space-y-4">
      <div className="w-16 h-16 border-4 border-primary-blue border-dashed rounded-full animate-spin"></div>
      <span className="text-gray-600 font-medium">Loading Open Leads...</span>
    </div>
  );
}

// --- Error Component ---
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] font-montserrat space-y-4">
      <i className="bi bi-exclamation-triangle text-red-500 text-4xl"></i>
      <p className="text-red-500 text-lg font-medium text-center max-w-md">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="btn-primary-blue rounded-md px-6 py-2 text-sm font-medium flex items-center"
      >
        <i className="bi bi-arrow-clockwise mr-2"></i>
        Try Again
      </button>
    </div>
  );
}
