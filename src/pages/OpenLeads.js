import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Footer from "../components/Layout/Footer";
import toast from "react-hot-toast";

const VehicleEditForm = ({
  vehicle,
  index,
  brands,
  variants,
  selectedLead,
  setSelectedLead,
  handleBrandChange,
  handleVariantChange,
  handleCloseVehicle,
  API_BASE,
  getAuthHeaders,
}) => {
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedColorPrice, setSelectedColorPrice] = useState(0);

  // Fetch colors with prices when variant changes
  useEffect(() => {
    const fetchColorsWithPrices = async () => {
      if (vehicle.variant_id) {
        try {
          const response = await axios.get(
            `${API_BASE}/variants/${vehicle.variant_id}/colors-with-prices`,
            { headers: getAuthHeaders() }
          );
          const colorsWithPrices = response.data.data || [];
          setAvailableColors(colorsWithPrices);

          // Set current color price
          if (vehicle.color_id) {
            const currentColor = colorsWithPrices.find(
              (c) => c.id == vehicle.color_id
            );
            if (currentColor) {
              setSelectedColorPrice(currentColor.price);
            }
          }
        } catch (error) {
          console.error("Error fetching colors with prices:", error);
        }
      }
    };

    fetchColorsWithPrices();
  }, [vehicle.variant_id, vehicle.color_id, API_BASE, getAuthHeaders]);

  // Handle color selection
  const handleColorChange = async (colorId) => {
    const updatedLead = { ...selectedLead };
    const vehicleIndex = updatedLead.lead_details.findIndex(
      (v) => v.id === vehicle.id
    );

    // Update color ID
    updatedLead.lead_details[vehicleIndex].color_id = colorId;

    // Find selected color and its price
    const selectedColor = availableColors.find((c) => c.id == colorId);
    if (selectedColor) {
      const newPrice = selectedColor.price;
      setSelectedColorPrice(newPrice);

      // Update price in the vehicle data
      updatedLead.lead_details[vehicleIndex].color_price = newPrice;
      updatedLead.lead_details[vehicleIndex].unit_price = newPrice;

      // Calculate total price
      const quantity = updatedLead.lead_details[vehicleIndex].vehicle_qty || 1;
      updatedLead.lead_details[vehicleIndex].total_price = newPrice * quantity;
    }

    setSelectedLead(updatedLead);
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    const updatedLead = { ...selectedLead };
    const vehicleIndex = updatedLead.lead_details.findIndex(
      (v) => v.id === vehicle.id
    );

    updatedLead.lead_details[vehicleIndex].vehicle_qty = newQuantity;

    // Recalculate total price
    const unitPrice =
      selectedColorPrice ||
      vehicle.unit_price ||
      vehicle.variant?.basic_price ||
      0;
    updatedLead.lead_details[vehicleIndex].total_price =
      unitPrice * newQuantity;

    setSelectedLead(updatedLead);
  };

  // Calculate current total price
  const currentQuantity = vehicle.vehicle_qty || 1;
  const unitPrice =
    selectedColorPrice ||
    vehicle.unit_price ||
    vehicle.variant?.basic_price ||
    0;
  const totalPrice = unitPrice * currentQuantity;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
      <div className="flex justify-between items-center mb-3">
        <h6 className="text-base font-medium text-primary-blue">
          Vehicle {index + 1}
        </h6>
        <div className="flex gap-2">
          <button
            className="action-btn btn-close"
            title="Close Vehicle"
            onClick={(e) => {
              e.stopPropagation();
              handleCloseVehicle(selectedLead, vehicle.id);
            }}
          >
            <i className="bi bi-check-lg"></i>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Brand *
          </label>
          <select
            className="w-full border border-secondary-grey rounded p-2 text-sm"
            value={vehicle.brand_id || ""}
            onChange={(e) => handleBrandChange(e.target.value, index)}
          >
            <option value="" disabled>
              Select brand
            </option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Variant Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Variant *
          </label>
          <select
            className="w-full border border-secondary-grey rounded p-2 text-sm"
            value={vehicle.variant_id || ""}
            onChange={(e) => handleVariantChange(e.target.value, index)}
          >
            <option value="" disabled>
              Select variant
            </option>
            {variants
              .filter((variant) => variant.brand_id == vehicle.brand_id)
              .map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.name}
                </option>
              ))}
          </select>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Color *
          </label>
          <select
            className="w-full border border-secondary-grey rounded p-2 text-sm"
            value={vehicle.color_id || ""}
            onChange={(e) => handleColorChange(e.target.value)}
            disabled={!vehicle.variant_id}
          >
            <option value="">Select color</option>
            {availableColors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name} - ${parseFloat(color.price).toLocaleString()}
              </option>
            ))}
          </select>
          {!vehicle.variant_id && (
            <p className="text-xs text-gray-500 mt-1">
              Please select a variant first
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Quantity *
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
              onClick={() =>
                handleQuantityChange(Math.max(1, currentQuantity - 1))
              }
              disabled={currentQuantity <= 1}
            >
              -
            </button>
            <input
              type="number"
              className="w-20 text-center border border-gray-300 rounded p-1 text-sm"
              value={currentQuantity}
              min="1"
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
            />
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-gray-100 hover:bg-gray-200"
              onClick={() => handleQuantityChange(currentQuantity + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Price Display */}
        <div className="md:col-span-2">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Unit Price
                </label>
                <p className="text-lg font-semibold text-green-600">
                  ${parseFloat(unitPrice).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Total Price
                </label>
                <p className="text-lg font-bold text-green-600">
                  ${totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UNREALIZED_REASONS = {
  price: "Price too high",
  features: "Not satisfied with features",
  delivery: "Delivery timeline",
  competitor: "Found better option with competitor",
  financial: "Financial issues",
  other: "Other",
};

// Helper function to get full reason text
const getFullReasonText = (reasonCode, customReason = "") => {
  if (reasonCode === "other" && customReason.trim()) {
    return customReason.trim();
  }
  return UNREALIZED_REASONS[reasonCode] || reasonCode;
};

// Helper function to display reason (for UI)
const getDisplayReason = (reasonCode) => {
  return UNREALIZED_REASONS[reasonCode] || reasonCode;
};

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

  const [paymentModes, setPaymentModes] = useState([]);
  const [loadingPaymentModes, setLoadingPaymentModes] = useState(false);
  const [errors, setErrors] = useState({
    paymentMode: "",
  });

  const API_BASE = "http://192.168.1.38:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });
  const getImageUrl = (filename) => {
    if (!filename) {
      return "https://via.placeholder.com/100x100/f3f4f6/6b7280?text=No+Image";
    }

    const baseUrl = "http://192.168.1.38:8000";

    // Clean filename
    let cleanFilename = String(filename).trim();

    // Remove any path prefixes
    cleanFilename = cleanFilename.replace(/^.*[\\\/]/, "");

    // Check if already a full URL
    if (cleanFilename.startsWith("http")) {
      return cleanFilename;
    }

    // Add extension if missing
    if (!cleanFilename.includes(".")) {
      cleanFilename = cleanFilename + ".webp"; // or .jpg based on your files
    }

    // Try different paths in order
    const possibleUrls = [
      `${baseUrl}/storage/galleries/${cleanFilename}`, // Most likely
      `${baseUrl}/storage/coverphotos/${cleanFilename}`,
      `${baseUrl}/uploads/coverPhotos/${cleanFilename}`,
      `${baseUrl}/uploads/${cleanFilename}`,
    ];

    console.log("🖼️ Trying image URLs:", possibleUrls);

    return possibleUrls[0];
  };
  // Fetch payment modes
  const fetchPaymentModes = async () => {
    try {
      setLoadingPaymentModes(true);
      const response = await axios.get(`${API_BASE}/payment-modes`, {
        headers: getAuthHeaders(),
      });
      if (response.data.status) {
        setPaymentModes(response.data.data);
      } else {
        setPaymentModes([]);
        console.error("Failed to load payment modes");
      }
    } catch (err) {
      console.error("Error fetching payment modes:", err);
      setPaymentModes([]);
    } finally {
      setLoadingPaymentModes(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch payment modes
        await fetchPaymentModes();

        // ... rest of your existing fetch code ...
      } catch (err) {
        // ... error handling
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  // Debug useEffect
  useEffect(() => {
    console.log("=== OPEN LEADS DEBUG ===");
    console.log("All openLeads:", openLeads);
    console.log("All filteredLeads:", filteredLeads);
    if (openLeads.length > 0) {
      openLeads.forEach((lead) => {
        console.log(`Lead ${lead.id} - ${lead.customer_name}:`, {
          leadStatus: lead.status,
          vehicles: lead.lead_details?.map((v) => ({
            id: v.id,
            status: v.status,
            brand_name: v.brand_name,
            variant_name: v.variant_name,
            color_name: v.color_name,
            quantity: v.quantity,
          })),
        });
      });
    }
  }, [openLeads, filteredLeads]);

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

        console.log("Leads API Response:", leadsResponse.data);
        if (leadsResponse.data.success) {
          const leads = leadsResponse.data.data || [];
          // Filter leads that have at least one open vehicle
          const openLeadsFiltered = leads.filter((lead) =>
            lead.lead_details?.some(
              (vehicle) =>
                vehicle.status === "Open" || vehicle.status === "open"
            )
          );
          setOpenLeads(openLeadsFiltered);
          setFilteredLeads(openLeadsFiltered);
          if (openLeadsFiltered.length === 0) {
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
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredLeads(openLeads);
    } else {
      const filtered = openLeads.filter((lead) => {
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
    const selectedVariant = variants.find((v) => v.id == variantId);
    const updatedLeadDetails = [...selectedLead.lead_details];
    updatedLeadDetails[vehicleIndex] = {
      ...updatedLeadDetails[vehicleIndex],
      variant_id: variantId,
      variant_name: selectedVariant?.name || "",
      color_id: "",
      color_name: "",
      color_code: "",
    };

    setSelectedLead({
      ...selectedLead,
      lead_details: updatedLeadDetails,
    });
  };

  const handleColorChange = (colorId, vehicleIndex) => {
    const selectedColor = colors.find((c) => c.id == colorId);
    const updatedLeadDetails = [...selectedLead.lead_details];
    updatedLeadDetails[vehicleIndex] = {
      ...updatedLeadDetails[vehicleIndex],
      color_id: colorId,
      color_name: selectedColor?.name || selectedColor?.color_name || "",
      color_code: selectedColor?.color_code || "",
    };

    setSelectedLead({
      ...selectedLead,
      lead_details: updatedLeadDetails,
    });
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    setSearchTerm("");
    try {
      console.log("Refreshing leads from API...");
      const leadsResponse = await axios.get(
        `${API_BASE}/leads-by-status?status=Open`,
        { headers: getAuthHeaders() }
      );
      console.log("API Response:", leadsResponse.data);
      if (leadsResponse.data.success) {
        const leads = leadsResponse.data.data || [];
        // Enhanced filtering - only show leads with open vehicles
        const openLeadsFiltered = leads.filter((lead) => {
          const hasOpenVehicles = lead.lead_details?.some(
            (vehicle) => vehicle.status === "Open" || vehicle.status === "open"
          );
          console.log(`Lead ${lead.id} has open vehicles:`, hasOpenVehicles);
          return hasOpenVehicles;
        });
        console.log("Filtered open leads:", openLeadsFiltered);
        setOpenLeads(openLeadsFiltered);
        setFilteredLeads(openLeadsFiltered);
      } else {
        console.error("API returned error:", leadsResponse.data);
        setError(leadsResponse.data.message || "Failed to fetch open leads.");
      }
    } catch (err) {
      console.error("Refresh error:", err);
      setError("Failed to fetch open leads. Please try again later.");
    } finally {
      setLoading(false);
    }
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

  // Updated getVehicleImage function:
  const getVehicleImage = (vehicleVariant, color = null) => {
    if (!vehicleVariant || !galleries) return null;

    // First try to find gallery with matching variant AND color
    let gallery;

    if (color && color.id) {
      gallery = galleries.find(
        (g) => g.variant_id === vehicleVariant.id && g.color_id === color.id
      );
    }

    // If no color-specific gallery, find any gallery for this variant
    if (!gallery) {
      gallery = galleries.find((g) => g.variant_id === vehicleVariant.id);
    }

    if (gallery) {
      console.log("✅ Found gallery for vehicle:", {
        variant: vehicleVariant.name,
        color: color?.name,
        galleryId: gallery.id,
        hasUrls: gallery.cover_photo_urls?.length,
        firstUrl: gallery.cover_photo_urls?.[0],
      });

      // Use the first cover_photo_url if available
      if (gallery.cover_photo_urls && gallery.cover_photo_urls.length > 0) {
        return gallery.cover_photo_urls[0];
      }

      // Fallback to first_image
      if (gallery.first_image) {
        return gallery.first_image;
      }
    }

    return null;
  };

  const getAbsoluteImageUrl = (url) => {
    if (typeof url !== "string" || !url) {
      return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    if (url.startsWith("/")) {
      return `http://192.168.1.38:8000${url}`;
    }
    const cleanPath = url.replace(/^[\\/]+/, "");
    return `http://192.168.1.38:8000/uploads/coverPhotos/${cleanPath}`;
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
      return `http://192.168.1.38:8000${invoicePath}`;
    }
    return `http://192.168.1.38:8000/storage/${invoicePath}`;
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
            quantity: vehicle.quantity || 1, // Fixed: Ensure quantity is properly set
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
            quantity: vehicle.quantity || 1, // Fixed: Ensure quantity is properly set
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
          quantity: vehicle.quantity || 1, // Fixed: Ensure quantity is properly set
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
    console.log("handleCloseEntireLead called with lead:", lead?.id);
    setSelectedLead(lead);
    setCloseType("converted");
    setUnrealizedReason("");
    setOtherReason("");
    setIsCloseEntireLeadModalOpen(true);
    console.log("Modal should open now");
  };

  const handleReasonChange = (newReason) => {
    setUnrealizedReason(newReason);
    // Clear other reason if not "other"
    if (newReason !== "other") {
      setOtherReason("");
    }
  };

  const handleCloseVehicle = (lead, vehicleId) => {
    console.log("Closing vehicle:", vehicleId, "from lead:", lead.id);
    setSelectedLead(lead);
    setSelectedVehicleId(vehicleId);
    setCloseType("converted");
    setUnrealizedReason("");
    setOtherReason("");
    setIsCloseLeadModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        e.target.value = ""; // Clear the input
        setInvoiceCopy(null);
        return;
      }

      // Check file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert("Only PDF, JPG, JPEG, and PNG files are allowed");
        e.target.value = ""; // Clear the input
        setInvoiceCopy(null);
        return;
      }

      setInvoiceCopy(file);
      console.log(
        "File selected:",
        file.name,
        "Size:",
        file.size,
        "Type:",
        file.type
      );
    } else {
      setInvoiceCopy(null);
    }
  };

  const handleProcessCloseEntireLead = async () => {
    if (!selectedLead) return;

    try {
      if (closeType === "unrealized") {
        if (!unrealizedReason) {
          alert("Please select a reason for unrealized lead.");
          return;
        }

        // Validate "other" reason
        if (unrealizedReason === "other" && !otherReason.trim()) {
          alert("Please specify the reason for unrealized lead.");
          return;
        }

        const fullReasonText = getFullReasonText(unrealizedReason, otherReason);

        console.log("🔒 Closing entire lead as unrealized:", {
          lead_id: selectedLead.id,
          customer: selectedLead.customer_name,
          total_vehicles: selectedLead.lead_details?.length || 0,
          reason_code: unrealizedReason,
          reason_text: fullReasonText,
        });

        // IMPORTANT: Send 'Unrealized' (capitalized) to match backend validation
        await axios.put(
          `${API_BASE}/leads/${selectedLead.id}/close-entire`,
          {
            close_type: "Unrealized", // Capitalize to match backend
            unrealized_reason: fullReasonText, // Full descriptive text
          },
          { headers: getAuthHeaders() }
        );

        // Force refresh to get updated data
        await handleRefresh();

        // Reset states
        setIsCloseEntireLeadModalOpen(false);
        setSelectedLead(null);
        setUnrealizedReason("");
        setOtherReason("");
        alert("✅ Entire lead marked as unrealized successfully!");
      } else {
        // Converted logic
        setInvoiceNumber("");
        setInvoiceCopy(null);
        setConfirmDetails(true);
        setIsCloseEntireLeadModalOpen(false);
        setIsConvertedLeadModalOpen(true);
      }
    } catch (err) {
      console.error("❌ Failed to close entire lead:", err);
      console.error("Error response:", err.response?.data);
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

    if (closeType === "unrealized") {
      if (!unrealizedReason) {
        alert("Please select a reason for unrealized lead.");
        return;
      }

      // Validate "other" reason
      if (unrealizedReason === "other" && !otherReason.trim()) {
        alert("Please specify the reason for unrealized lead.");
        return;
      }

      try {
        const fullReasonText = getFullReasonText(unrealizedReason, otherReason);

        console.log("🔒 Closing vehicle as unrealized:", {
          vehicle_id: selectedVehicleId,
          vehicle_name: `${vehicle.brand_name} ${vehicle.variant_name}`,
          reason_code: unrealizedReason,
          reason_text: fullReasonText,
          lead_id: selectedLead.id,
          customer: selectedLead.customer_name,
        });

        // IMPORTANT: Send 'Unrealized' (capitalized) to match backend
        await axios.put(
          `${API_BASE}/lead-details/${selectedVehicleId}/close`,
          {
            close_type: "Unrealized", // Capitalize to match backend
            close_reason: fullReasonText, // Full descriptive text
          },
          { headers: getAuthHeaders() }
        );

        // Force refresh to get updated data
        await handleRefresh();

        // Reset states
        setIsCloseLeadModalOpen(false);
        setSelectedLead(null);
        setSelectedVehicleId(null);
        setUnrealizedReason("");
        setOtherReason("");
        alert("✅ Vehicle marked as unrealized successfully!");
      } catch (err) {
        console.error("❌ Failed to close vehicle:", err);
        console.error("Error response:", err.response?.data);
        alert(
          `Failed to close vehicle: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    } else {
      // Converted logic
      setInvoiceNumber("");
      setInvoiceCopy(null);
      setConfirmDetails(true);
      setIsCloseLeadModalOpen(false);
      setIsConvertedLeadModalOpen(true);
    }
  };

  const handleSubmitConvertedLead = async () => {
    if (!selectedLead) {
      alert("No lead selected");
      return;
    }

    try {
      let response;
      const headers = getAuthHeaders();

      // Define variables outside the if/else blocks
      let totalConvertedQty = 0;
      let totalOriginalQty = 0;
      let singleVehicle = null;

      if (selectedVehicleId) {
        // SINGLE VEHICLE conversion (with FormData since it might have file)
        singleVehicle = selectedLead.lead_details.find(
          (v) => v.id === selectedVehicleId
        );
        if (!singleVehicle) {
          alert("Vehicle not found");
          return;
        }

        const originalQty = singleVehicle?.vehicle_qty || 1;
        const convertedQty = singleVehicle?.converted_qty || originalQty;
        const actualPrice =
          singleVehicle?.color_price ||
          singleVehicle?.unit_price ||
          singleVehicle?.variant?.basic_price ||
          0;
        const totalPrice = actualPrice * convertedQty;

        // Set totals for single vehicle
        totalOriginalQty = originalQty;
        totalConvertedQty = convertedQty;

        const formData = new FormData();
        formData.append("close_type", "Converted");
        formData.append("invoice_no", invoiceNumber);
        formData.append("converted_quantity", convertedQty.toString());
        formData.append("unit_price", actualPrice.toString());
        formData.append("total_price", totalPrice.toString());

        if (invoiceCopy) {
          formData.append("uploaded_invoice", invoiceCopy);
          console.log("Attaching invoice file:", invoiceCopy.name);
        }

        response = await axios.put(
          `${API_BASE}/lead-details/${selectedVehicleId}/close`,
          formData,
          {
            headers: {
              ...headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // ENTIRE LEAD conversion - USE REGULAR JSON (NO FORMDATA)
        const vehiclesData = selectedLead.lead_details
          .filter((v) => v.status === "Open" || v.status === "open")
          .map((vehicle) => {
            const actualPrice =
              vehicle.color_price ||
              vehicle.unit_price ||
              vehicle.variant?.basic_price ||
              0;
            const originalQty = vehicle.vehicle_qty || 1;
            const convertedQty = vehicle.converted_qty || originalQty;
            const totalPrice = actualPrice * convertedQty;

            return {
              vehicle_id: vehicle.id,
              vehicle_qty: convertedQty,
              unit_price: actualPrice.toString(), // Ensure it's a string
              total_price: totalPrice.toString(),
            };
          });

        // Calculate totals
        totalConvertedQty = vehiclesData.reduce(
          (sum, vehicle) => sum + vehicle.vehicle_qty,
          0
        );
        totalOriginalQty = selectedLead.lead_details
          .filter((v) => v.status === "Open" || v.status === "open")
          .reduce((sum, v) => sum + (v.vehicle_qty || 1), 0);

        // Create regular JSON payload (NOT FormData)
        const payload = {
          close_type: "converted",
          invoice_no: invoiceNumber,
          vehicles_data: vehiclesData, // Send as array directly
        };

        console.log("Sending JSON payload:", JSON.stringify(payload, null, 2));
        console.log("Payload details:", {
          lead_id: selectedLead.id,
          invoice_no: invoiceNumber,
          close_type: "converted",
          vehicles_count: vehiclesData.length,
          total_converted_qty: totalConvertedQty,
        });

        response = await axios.put(
          `${API_BASE}/leads/${selectedLead.id}/close-entire`,
          payload,
          {
            headers: getAuthHeaders(), // Regular JSON headers (no multipart/form-data)
          }
        );
      }

      // Handle response - use variables that are now defined in both cases
      if (response?.data?.success) {
        const {
          converted_qty = 0,
          original_qty = 0,
          remaining_qty = 0,
          has_invoice = false,
        } = response.data;

        // Use response data if available, otherwise use calculated totals
        const finalConvertedQty = converted_qty || totalConvertedQty;
        const finalOriginalQty = original_qty || totalOriginalQty;

        let message = "✅ Conversion successful!\n\n";
        message += `Converted: ${finalConvertedQty} unit(s)\n`;
        message += `Original: ${finalOriginalQty} unit(s)\n`;

        const remaining = remaining_qty || finalOriginalQty - finalConvertedQty;
        if (remaining > 0) {
          message += `Remaining: ${remaining} unit(s)\n`;
        }

        if (has_invoice) {
          message += `\n✅ Invoice uploaded successfully!`;
        } else if (invoiceCopy && !selectedVehicleId) {
          message += `\n⚠️ Note: Invoice file was not uploaded because we used JSON format.`;
          setTimeout(() => {
            window.location.reload();
          }, 800);
        }

        alert(message);

        // Force complete refresh from API
        await handleRefresh();
        setIsConvertedLeadModalOpen(false);
        setSelectedLead(null);
        setSelectedVehicleId(null);
        setInvoiceNumber("");
        setInvoiceCopy(null);
        setConfirmDetails(true);
      } else {
        // Handle alternative response format or error
        const errorMsg = response?.data?.message || "Unknown error occurred";
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("❌ Conversion failed:", err);

      // More detailed error handling
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);

        let errorMessage =
          err.response.data?.message || "Server error occurred";

        // Check for validation errors
        if (err.response.data?.errors) {
          const validationErrors = Object.values(
            err.response.data.errors
          ).flat();
          errorMessage = validationErrors.join(", ");
        }

        // Check for specific field errors
        if (err.response.data?.errors?.uploaded_invoice) {
          errorMessage = `Invoice file error: ${err.response.data.errors.uploaded_invoice.join(
            ", "
          )}`;
        }

        // Check for vehicles_data error
        if (err.response.data?.message?.includes("vehicles_data")) {
          errorMessage = "Failed to process vehicles data. Please try again.";
        }

        // Check if it's a close_type validation error
        if (err.response.data?.message?.toLowerCase().includes("close_type")) {
          errorMessage = "Conversion type error. Please try again.";
        }

        alert(`Error: ${errorMessage}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        alert("Error: No response from server. Please check your connection.");
      } else {
        console.error("Request setup error:", err.message);
        alert(`Error: ${err.message}`);
      }
    }
  };

  const handleSaveLead = async () => {
    if (!selectedLead) return;

    try {
      // Validate payment mode
      if (!selectedLead.payment_mode?.trim()) {
        toast.error("Payment mode is required.", {
          duration: 1000,
          icon: "❌",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fca5a5",
          },
        });
        return;
      }

      // Validate payment mode against available modes
      if (paymentModes.length > 0) {
        const isValidMode = paymentModes.some(
          (mode) => mode.name === selectedLead.payment_mode.trim()
        );

        if (!isValidMode) {
          const availableModes = paymentModes.map((m) => m.name).join(", ");
          toast.error(
            `Invalid payment mode. Please select from: ${availableModes}`,
            {
              duration: 4000,
              icon: "⚠️",
              style: {
                background: "#fef3c7",
                color: "#92400e",
                border: "1px solid #fbbf24",
              },
            }
          );
          return;
        }
      }

      // Calculate total vehicle quantity
      const totalVehicleQty = selectedLead.lead_details.reduce(
        (total, vehicle) => total + (vehicle.vehicle_qty || 1),
        0
      );

      // Prepare payload
      const leadPayload = {
        customer_name: selectedLead.customer_name?.trim() || "",
        phone_no: String(selectedLead.phone_no || "").trim(),
        location: selectedLead.location?.trim() || "",
        payment_mode: selectedLead.payment_mode.trim(),
        tentative_purchase_date: selectedLead.tentative_purchase_date || null,
        vehicle_qty: totalVehicleQty,
        status: "Open",
        vehicles: selectedLead.lead_details.map((vehicle) => ({
          id: vehicle.id || null,
          brand_id: vehicle.brand_id,
          variant_id: vehicle.variant_id,
          color_id: vehicle.color_id || null,
          vehicle_qty: vehicle.vehicle_qty || 1,
          status: vehicle.status || "Open",
        })),
      };

      console.log("Sending update payload:", leadPayload);

      // Validation
      if (!leadPayload.customer_name) {
        toast.error("Customer name is required.", {
          duration: 1000,
          icon: "❌",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
          },
        });
        return;
      }

      if (!leadPayload.phone_no || !/^[0-9]{10}$/.test(leadPayload.phone_no)) {
        toast.error("Phone number must be a valid 10-digit number.", {
          duration: 1000,
          icon: "❌",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
          },
        });
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Updating lead...", {
        duration: Infinity,
      });

      try {
        const leadResponse = await axios.put(
          `${API_BASE}/leads/${selectedLead.id}/update`,
          leadPayload,
          { headers: getAuthHeaders() }
        );

        if (leadResponse.data.success) {
          // Dismiss loading toast
          toast.dismiss(loadingToast);

          // Show success toast
          toast.success("Lead updated successfully!", {
            duration: 1000,
            icon: "✅",
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #86efac",
            },
          });

          // Refresh data after update
          await handleRefresh();

          // Close modal after a short delay
          setTimeout(() => {
            setIsEditModalOpen(false);
          }, 1000);
        } else {
          throw new Error(leadResponse.data.message || "Failed to update lead");
        }
      } catch (apiError) {
        // Dismiss loading toast
        toast.dismiss(loadingToast);

        throw apiError;
      }
    } catch (err) {
      console.error("Failed to update lead:", err);

      // Show error toast
      toast.error(
        `Failed to update lead: ${err.response?.data?.message || err.message}`,
        {
          duration: 4000,
          icon: "❌",
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            border: "1px solid #fca5a5",
          },
        }
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
  // if (error && openLeads.length === 0)
  //   return <ErrorMessage message={error} onRetry={handleRefresh} />;

  return (
    <Container>
      <div className="min-h-screen bg-gray-50 font-montserrat text-sm">
        {/* Open Leads Section */}
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
                    sortLeadsByAge(e.target.value);
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
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-gray-500 text-xl font-medium mb-2">
                  {searchTerm ? "No matching leads found" : "No Open Leads"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm
                    ? "Try adjusting your search terms or clear the search to see all leads."
                    : error ||
                      "There are currently no open leads in the system."}
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
                  const openVehicleCount =
                    lead.lead_details?.filter(
                      (v) => v.status === "Open" || v.status === "open"
                    ).length || 0;
                  const totalVehicleCount = lead.lead_details?.length || 0;

                  return (
                    <div
                      key={lead.id}
                      className="lead-card bg-white p-5 rounded-lg shadow-md border-l-4 border-[var(--primary-blue)]"
                      data-lead-id={lead.id}
                    >
                      {/* Debug info - you can remove this later */}
                      {/* <div className="text-xs text-red-500 mb-2">
                      Open: {openVehicleCount}/{totalVehicleCount} vehicles
                    </div> */}

                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h6 className="text-base font-semibold text-text-dark mb-1">
                                {lead.customer_name}
                              </h6>
                              <div className="location-info">
                                <i className="bi bi-geo-alt"></i>
                                <span>{lead.location || "N/A"}</span>
                              </div>
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
                            {lead.lead_details
                              ?.filter(
                                (v) =>
                                  v.status === "Open" || v.status === "open"
                              )
                              .map((vehicle) => {
                                // Get color-specific price
                                const vehiclePrice =
                                  vehicle.color_price ||
                                  vehicle.unit_price ||
                                  vehicle.variant?.basic_price ||
                                  0;
                                const totalPrice =
                                  vehiclePrice * (vehicle.quantity || 1);

                                return (
                                  <div
                                    key={vehicle.id}
                                    className="vehicle-info"
                                  >
                                    <i className="bi bi-bicycle"></i>
                                    <span>
                                      {vehicle.brand_name || "No brand"} {}
                                      {vehicle.variant_name || "No variant"} {}
                                      {/* {vehicle.quantity || 1} -{" "} */}
                                      {vehiclePrice > 0 ? (
                                        <></>
                                      ) : (
                                        "Price on request"
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
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

        {/* VIEW LEAD MODAL */}
        {isViewModalOpen && selectedLead && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
            onClick={() => setIsViewModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
                <h5 className="text-base font-medium">Lead Details</h5>
                <button
                  type="button"
                  className="text-white hover:text-gray-200 text-lg"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              {/* Modal Body */}
              <div className="p-4 flex-1 overflow-y-auto">
                {/* Check if mobile view */}
                {window.innerWidth <= 640 ? (
                  // Mobile Concise View
                  <div className="mobile-concise-view">
                    {/* Customer Information */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                      <h6 className="text-base font-medium text-primary-blue mb-3 flex items-center">
                        <i className="bi bi-person-fill mr-2"></i> Customer
                        Information
                      </h6>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="text-sm font-medium">
                            {selectedLead.customer_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Mobile</p>
                          <p className="text-sm font-medium">
                            {selectedLead.phone_no}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium">
                            {selectedLead.location || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Payment</p>
                          <p className="text-sm font-medium">
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

                    {/* Vehicle Information */}
                    {selectedLead.lead_details
                      .filter((v) => v.status === "Open" || v.status === "open")
                      .map((vehicle, index) => {
                        const vehicleImage = getVehicleImage(vehicle);
                        return (
                          <div
                            key={vehicle.id}
                            className="bg-white p-3 rounded-lg shadow-sm mb-3 border border-secondary-grey"
                          >
                            <div className="vehicle-section">
                              <div className="flex justify-between items-center mb-3">
                                <h6 className="text-base font-medium text-primary-blue flex items-center">
                                  <i className="bi bi-bicycle mr-2"></i>{" "}
                                  {vehicle.brand_name} {vehicle.variant_name}
                                </h6>
                                {vehicle.status === "Open" ||
                                vehicle.status === "open" ? (
                                  <button
                                    className="action-btn btn-close"
                                    title="Close Vehicle"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCloseVehicle(
                                        selectedLead,
                                        vehicle.id
                                      );
                                    }}
                                  >
                                    <i className="bi bi-check-lg"></i>
                                  </button>
                                ) : (
                                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                    {vehicle.status}
                                  </span>
                                )}
                              </div>
                              <div className="flex flex-col items-center">
                                <div className="w-2/3 mb-3">
                                  <img
                                    src={vehicleImage}
                                    alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
                                    className="w-full h-auto rounded-lg"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
                                    }}
                                  />
                                </div>
                                <div className="w-full">
                                  <div className="flex justify-between items-center">
                                    <div className="text-center">
                                      <p className="text-xs text-gray-500">
                                        Color
                                      </p>
                                      <p className="text-sm font-medium">
                                        {vehicle.color_name || "N/A"}
                                      </p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs text-gray-500">
                                        Qty
                                      </p>
                                      <p className="text-sm font-medium">
                                        {vehicle.quantity || 1} {/* Fixed */}
                                      </p>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-xs text-gray-500">
                                        Price
                                      </p>
                                      <p className="text-sm font-medium">
                                        {vehicle.color_price ||
                                        vehicle.unit_price ? (
                                          <div>
                                            <span className="text-green-600 font-semibold">
                                              $
                                              {parseFloat(
                                                vehicle.color_price ||
                                                  vehicle.unit_price
                                              ).toLocaleString()}
                                            </span>
                                            {vehicle.quantity > 1 && (
                                              <p className="text-xs text-green-500">
                                                Total: $
                                                {(
                                                  parseFloat(
                                                    vehicle.color_price ||
                                                      vehicle.unit_price
                                                  ) * (vehicle.quantity || 1)
                                                ).toLocaleString()}
                                              </p>
                                            )}
                                          </div>
                                        ) : vehicle.variant?.basic_price ? (
                                          `$${parseFloat(
                                            vehicle.variant.basic_price
                                          ).toLocaleString("en-IN")}`
                                        ) : (
                                          "Price on request"
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  // Desktop Detailed View - IMAGE ON RIGHT SIDE
                  <>
                    {/* Customer Information */}
                    <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                      <h6 className="text-base font-medium text-primary-blue mb-3 flex items-center">
                        <i className="bi bi-person-fill mr-2"></i> Customer
                        Information
                      </h6>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Name
                          </label>
                          <p className="text-sm font-medium text-text-dark">
                            {selectedLead.customer_name}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Mobile
                          </label>
                          <p className="text-sm font-medium text-text-dark">
                            {selectedLead.phone_no}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Location
                          </label>
                          <p className="text-sm font-medium text-text-dark">
                            {selectedLead.location || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Address
                          </label>
                          <p className="text-sm font-medium text-text-dark">
                            {selectedLead.address || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Information - IMAGE ON RIGHT SIDE */}
                    {selectedLead.lead_details
                      .filter((v) => v.status === "Open" || v.status === "open")
                      .map((vehicle, index) => {
                        const vehicleImage = getVehicleImage(vehicle);
                        const vehiclePrice = vehicle.variant?.basic_price
                          ? `$${parseFloat(
                              vehicle.variant.basic_price
                            ).toLocaleString("en-IN")}`
                          : "Price on request";

                        return (
                          <div
                            key={vehicle.id}
                            className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <h6 className="text-base font-medium text-primary-blue">
                                {vehicle.brand_name} {vehicle.variant_name}
                              </h6>
                              <div className="flex gap-2">
                                {vehicle.status === "Open" ||
                                vehicle.status === "open" ? (
                                  <button
                                    className="action-btn btn-close"
                                    title="Close Vehicle"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCloseVehicle(
                                        selectedLead,
                                        vehicle.id
                                      );
                                    }}
                                  >
                                    <i className="bi bi-check-lg"></i>
                                  </button>
                                ) : (
                                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                                    {vehicle.status}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                              {/* LEFT SIDE - Vehicle Details */}
                              <div className="md:w-2/3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                      Brand
                                    </label>
                                    <p className="text-sm font-medium text-text-dark">
                                      {vehicle.brand_name || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                      Variant
                                    </label>
                                    <p className="text-sm font-medium text-text-dark">
                                      {vehicle.variant_name || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                      Color
                                    </label>
                                    <p className="text-sm font-medium text-text-dark">
                                      {vehicle.color_name || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                      Quantity
                                    </label>
                                    <p className="text-sm font-medium text-text-dark">
                                      {vehicle.quantity || 1} {/* Fixed */}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600">
                                      Price
                                    </label>
                                    <p className="text-sm font-medium text-text-dark">
                                      {vehicle.color_price ||
                                      vehicle.unit_price ? (
                                        <div>
                                          <span className="text-green-600 font-semibold">
                                            $
                                            {parseFloat(
                                              vehicle.color_price ||
                                                vehicle.unit_price
                                            ).toLocaleString()}
                                          </span>
                                          {vehicle.variant?.basic_price &&
                                            parseFloat(
                                              vehicle.color_price ||
                                                vehicle.unit_price
                                            ) !==
                                              parseFloat(
                                                vehicle.variant.basic_price
                                              ) && (
                                              <div className="text-xs text-gray-500"></div>
                                            )}
                                        </div>
                                      ) : vehicle.variant?.basic_price ? (
                                        `$${parseFloat(
                                          vehicle.variant.basic_price
                                        ).toLocaleString("en-IN")}`
                                      ) : (
                                        "Price on request"
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                      Payment Mode *
                                    </label>
                                    {loadingPaymentModes ? (
                                      <div className="flex items-center gap-2 p-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                        <span className="text-xs text-gray-500">
                                          Loading payment modes...
                                        </span>
                                      </div>
                                    ) : paymentModes.length > 0 ? (
                                      <select
                                        className="w-full border border-secondary-grey rounded p-2 text-sm"
                                        value={selectedLead.payment_mode || ""}
                                        onChange={(e) =>
                                          setSelectedLead((prev) => ({
                                            ...prev,
                                            payment_mode: e.target.value,
                                          }))
                                        }
                                        required
                                      >
                                        <option value="" disabled>
                                          Select payment mode
                                        </option>
                                        {paymentModes.map((mode) => (
                                          <option
                                            key={mode.id}
                                            value={mode.name}
                                          >
                                            {mode.name.charAt(0).toUpperCase() +
                                              mode.name.slice(1)}
                                            {mode.description
                                              ? ` - ${mode.description}`
                                              : ""}
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <input
                                        type="text"
                                        className="w-full border border-secondary-grey rounded p-2 text-sm"
                                        value={selectedLead.payment_mode || ""}
                                        onChange={(e) =>
                                          setSelectedLead((prev) => ({
                                            ...prev,
                                            payment_mode: e.target.value,
                                          }))
                                        }
                                        placeholder="Enter payment mode"
                                        required
                                      />
                                    )}
                                  </div>
                                  {vehicle.invoice_no && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-600">
                                        Invoice No
                                      </label>
                                      <p className="text-sm font-medium text-text-dark">
                                        {vehicle.invoice_no}
                                      </p>
                                    </div>
                                  )}
                                  {vehicle.uploaded_invoice && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-600">
                                        Invoice Copy
                                      </label>
                                      <a
                                        href={getInvoiceUrl(
                                          vehicle.uploaded_invoice
                                        )}
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

                              {/* RIGHT SIDE - Vehicle Image */}
                              <div className="md:w-1/3">
                                <img
                                  src={vehicleImage}
                                  alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
                                  className="w-full h-48 object-cover rounded-lg"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    className="btn-primary-blue rounded-md px-4 py-2 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseEntireLead(selectedLead);
                    }}
                  >
                    Close Entire Lead
                  </button>
                  <button
                    className="btn-secondary rounded-md px-4 py-2 text-sm"
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLOSE ENTIRE LEAD MODAL */}
        {isCloseEntireLeadModalOpen && selectedLead && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]"
            onClick={() => setIsCloseEntireLeadModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center">
                <h5 className="text-base font-medium">Close Entire Lead</h5>
                <button
                  type="button"
                  className="text-white hover:text-gray-200 text-lg"
                  onClick={() => setIsCloseEntireLeadModalOpen(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="p-4">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                  <h6 className="text-base font-medium text-primary-blue mb-3">
                    Close Entire Lead
                  </h6>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      You are closing the following lead:
                    </p>
                    {/* Vehicle Info Cards for all vehicles in the lead */}
                    {selectedLead.lead_details
                      ?.filter(
                        (v) => v.status === "Open" || v.status === "open"
                      )
                      .map((vehicle, index) => {
                        const vehiclePrice = vehicle.variant?.basic_price
                          ? `$${parseFloat(
                              vehicle.variant.basic_price
                            ).toLocaleString("en-IN")}`
                          : "Price on request";
                        return (
                          <div
                            key={vehicle.id}
                            className="bg-light-blue p-3 rounded-md mb-2"
                          >
                            <p className="font-medium">
                              {vehicle.brand_name} {vehicle.variant_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {vehicle.color_name} | Qty:{" "}
                              {vehicle.quantity || 1} |{" "}
                              {vehicle.color_price || vehicle.unit_price ? (
                                <span className="text-green-600 font-semibold">
                                  $
                                  {parseFloat(
                                    vehicle.color_price || vehicle.unit_price
                                  ).toLocaleString()}
                                  {vehicle.quantity > 1 && (
                                    <span className="text-green-500">
                                      {" "}
                                      (Total: $
                                      {(
                                        parseFloat(
                                          vehicle.color_price ||
                                            vehicle.unit_price
                                        ) * (vehicle.quantity || 1)
                                      ).toLocaleString()}
                                      )
                                    </span>
                                  )}
                                </span>
                              ) : vehicle.variant?.basic_price ? (
                                `$${parseFloat(
                                  vehicle.variant.basic_price
                                ).toLocaleString("en-IN")}`
                              ) : (
                                "Price on request"
                              )}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Select Close Type:
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="closeType"
                          value="converted"
                          checked={closeType === "converted"}
                          onChange={(e) => setCloseType(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Converted</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="closeType"
                          value="unrealized"
                          checked={closeType === "unrealized"}
                          onChange={(e) => setCloseType(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">Unrealized</span>
                      </label>
                    </div>
                  </div>

                  {/* Unrealized reason dropdown */}
                  {closeType === "unrealized" && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        Reason for Unrealized:
                      </label>
                      <select
                        value={unrealizedReason}
                        onChange={(e) => setUnrealizedReason(e.target.value)}
                        className="w-full border border-secondary-grey rounded p-2 text-sm mb-2"
                      >
                        <option value="" disabled>
                          Select reason
                        </option>
                        <option value="price">Price too high</option>
                        <option value="features">
                          Not satisfied with features
                        </option>
                        <option value="delivery">Delivery timeline</option>
                        <option value="competitor">
                          Found better option with competitor
                        </option>
                        <option value="financial">Financial issues</option>
                        <option value="other">Other</option>
                      </select>
                      {unrealizedReason === "other" && (
                        <textarea
                          className="w-full border border-secondary-grey rounded p-2 text-sm"
                          value={otherReason}
                          onChange={(e) => setOtherReason(e.target.value)}
                          placeholder="Please specify the reason..."
                        />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    className="btn-secondary rounded-md px-4 py-2 text-sm"
                    onClick={() => setIsCloseEntireLeadModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary-blue rounded-md px-4 py-2 text-sm"
                    onClick={handleProcessCloseEntireLead}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLOSE VEHICLE MODAL */}
        {isCloseLeadModalOpen && selectedLead && selectedVehicleId && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]"
            onClick={() => setIsCloseLeadModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center">
                <h5 className="text-base font-medium">Close Vehicle</h5>
                <button
                  type="button"
                  className="text-white hover:text-gray-200 text-lg"
                  onClick={() => setIsCloseLeadModalOpen(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    You are closing the following vehicle:
                  </p>
                  <div className="bg-light-blue p-3 rounded-md">
                    {selectedLead.lead_details.find(
                      (v) => v.id === selectedVehicleId
                    ) && (
                      <>
                        <p className="text-sm text-gray-600">
                          {
                            selectedLead.lead_details.find(
                              (v) => v.id === selectedVehicleId
                            ).color_name
                          }{" "}
                          | Qty:{" "}
                          {selectedLead.lead_details.find(
                            (v) => v.id === selectedVehicleId
                          ).quantity || 1}{" "}
                          |{" "}
                          {(() => {
                            const vehicle = selectedLead.lead_details.find(
                              (v) => v.id === selectedVehicleId
                            );
                            const price =
                              vehicle.color_price ||
                              vehicle.unit_price ||
                              vehicle.variant?.basic_price;
                            return price ? (
                              <span className="text-green-600 font-semibold">
                                ${parseFloat(price).toLocaleString()}
                                {vehicle.quantity > 1 && (
                                  <span className="text-green-500">
                                    {" "}
                                    (Total: $
                                    {(
                                      parseFloat(price) *
                                      (vehicle.quantity || 1)
                                    ).toLocaleString()}
                                    )
                                  </span>
                                )}
                              </span>
                            ) : (
                              "Price on request"
                            );
                          })()}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Select Close Type:
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="converted"
                        checked={closeType === "converted"}
                        onChange={(e) => setCloseType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Converted</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="unrealized"
                        checked={closeType === "unrealized"}
                        onChange={(e) => setCloseType(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">Unrealized</span>
                    </label>
                  </div>
                </div>

                {closeType === "unrealized" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Reason for Unrealized:
                    </label>
                    <select
                      value={unrealizedReason}
                      onChange={(e) => setUnrealizedReason(e.target.value)}
                      className="w-full border border-secondary-grey rounded p-2 text-sm mb-2"
                    >
                      <option value="" disabled selected>
                        Select reason
                      </option>
                      <option value="price">Price too high</option>
                      <option value="features">
                        Not satisfied with features
                      </option>
                      <option value="delivery">Delivery timeline</option>
                      <option value="competitor">
                        Found better option with competitor
                      </option>
                      <option value="financial">Financial issues</option>
                      <option value="other">Other</option>
                    </select>
                    {unrealizedReason === "other" && (
                      <textarea
                        className="w-full border border-secondary-grey rounded p-2 text-sm"
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        placeholder="Please specify the reason..."
                      />
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    className="btn-secondary rounded-md px-4 py-2 text-sm"
                    onClick={() => setIsCloseLeadModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary-blue rounded-md px-4 py-2 text-sm"
                    onClick={handleProcessCloseLead}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isEditModalOpen && selectedLead && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
            onClick={() => setIsEditModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
                <h5 className="text-base font-medium">Edit Lead</h5>
                <button
                  type="button"
                  className="text-white hover:text-gray-200 text-lg"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 flex-1 overflow-y-auto">
                {/* Customer Information Form */}
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                  <h6 className="text-base font-medium text-primary-blue mb-3 flex items-center">
                    <i className="bi bi-person-fill mr-2"></i> Customer
                    Information
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-secondary-grey rounded p-2 text-sm"
                        value={selectedLead.customer_name || ""}
                        onChange={(e) =>
                          setSelectedLead((prev) => ({
                            ...prev,
                            customer_name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Mobile *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-secondary-grey rounded p-2 text-sm"
                        value={selectedLead.phone_no || ""}
                        onChange={(e) =>
                          setSelectedLead((prev) => ({
                            ...prev,
                            phone_no: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        className="w-full border border-secondary-grey rounded p-2 text-sm"
                        value={selectedLead.location || ""}
                        onChange={(e) =>
                          setSelectedLead((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Payment Mode *
                      </label>

                      {loadingPaymentModes ? (
                        <div className="flex items-center gap-2 p-2 border border-gray-300 rounded bg-gray-50">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span className="text-xs text-gray-500">
                            Loading payment modes...
                          </span>
                        </div>
                      ) : paymentModes.length > 0 ? (
                        <div>
                          <select
                            className="w-full border border-secondary-grey rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selectedLead.payment_mode || ""}
                            onChange={(e) => {
                              console.log(
                                "Payment mode selected:",
                                e.target.value
                              );
                              setSelectedLead((prev) => ({
                                ...prev,
                                payment_mode: e.target.value,
                              }));
                            }}
                            required
                          >
                            <option value="" disabled>
                              {selectedLead.payment_mode
                                ? `Current: ${selectedLead.payment_mode}`
                                : "Select payment mode"}
                            </option>
                            {paymentModes.map((mode) => (
                              <option key={mode.id} value={mode.name}>
                                {mode.name.charAt(0).toUpperCase() +
                                  mode.name.slice(1)}
                                {mode.description
                                  ? ` (${mode.description})`
                                  : ""}
                              </option>
                            ))}
                          </select>

                          {/* Show current payment mode for reference */}
                          {selectedLead.payment_mode && (
                            <div className="mt-1 text-xs text-gray-500 flex items-center">
                              <svg
                                className="w-3 h-3 text-green-500 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Currently set to:{" "}
                              <span className="font-medium ml-1">
                                {selectedLead.payment_mode}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <input
                            type="text"
                            className="w-full border border-secondary-grey rounded p-2 text-sm"
                            value={selectedLead.payment_mode || ""}
                            onChange={(e) =>
                              setSelectedLead((prev) => ({
                                ...prev,
                                payment_mode: e.target.value,
                              }))
                            }
                            placeholder="Enter payment mode"
                            required
                          />
                          <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
                            <i className="bi bi-exclamation-triangle mr-1"></i>
                            Payment modes not loaded from API. Please enter
                            manually.
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vehicle Information Forms */}
                {selectedLead.lead_details
                  .filter((v) => v.status === "Open" || v.status === "open")
                  .map((vehicle, index) => (
                    <VehicleEditForm
                      key={vehicle.id}
                      vehicle={vehicle}
                      index={index}
                      brands={brands}
                      variants={variants}
                      selectedLead={selectedLead}
                      setSelectedLead={setSelectedLead}
                      handleBrandChange={handleBrandChange}
                      handleVariantChange={handleVariantChange}
                      handleCloseVehicle={handleCloseVehicle}
                      API_BASE={API_BASE}
                      getAuthHeaders={getAuthHeaders}
                    />
                  ))}

                <div className="flex justify-end mt-4 gap-3">
                  <button
                    className="btn-secondary rounded-md px-4 py-2 text-sm"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary-blue rounded-md px-4 py-2 text-sm"
                    onClick={handleSaveLead}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CONVERTED LEAD MODAL - SIMPLIFIED */}
        {isConvertedLeadModalOpen && selectedLead && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] overflow-y-auto"
            onClick={() => setIsConvertedLeadModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full mx-4 my-8 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: "calc(90vh - 70px)", // Adjust for mobile footer
                marginBottom: "70px", // Space for footer
              }}
            >
              {/* Header */}
              <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
                <h5 className="text-base font-medium">
                  Converted Lead - Invoice Details
                </h5>
                <button
                  type="button"
                  className="text-white hover:text-gray-200 text-lg"
                  onClick={() => setIsConvertedLeadModalOpen(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                <div className="p-4">
                  {/* Header */}
                  <div className="mb-4">
                    <h6 className="text-base font-semibold text-gray-800 mb-2">
                      Vehicle Conversion
                    </h6>
                    <p className="text-sm text-gray-600">
                      {selectedVehicleId
                        ? "Single Vehicle"
                        : "All Open Vehicles"}
                    </p>
                  </div>

                  {/* Vehicle Details */}
                  <div className="space-y-4 mb-6">
                    {selectedVehicleId
                      ? (() => {
                          const v = selectedLead.lead_details.find(
                            (v) => v.id === selectedVehicleId
                          );
                          if (!v) return null;

                          const actualPrice =
                            v?.color_price ||
                            v?.unit_price ||
                            v?.variant?.basic_price ||
                            0;
                          const originalQty = v?.vehicle_qty || 1;
                          const convertedQty = v?.converted_qty || originalQty;

                          return (
                            <div className="bg-gray-50 rounded-lg p-3 border">
                              <div className="mb-3">
                                <h6 className="font-semibold text-gray-800 text-sm">
                                  {v.brand_name} {v.variant_name}
                                </h6>
                                <p className="text-xs text-gray-500 mt-1">
                                  {v.color_name} • Qty: {originalQty}
                                </p>
                              </div>

                              {actualPrice ? (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Unit Price:</span>
                                    <span className="font-medium">
                                      $
                                      {parseFloat(actualPrice).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Converted Qty:</span>
                                    <select
                                      value={convertedQty}
                                      onChange={(e) => {
                                        const newQty = parseInt(e.target.value);
                                        const updatedLead = { ...selectedLead };
                                        const vehicleIndex =
                                          updatedLead.lead_details.findIndex(
                                            (vehicle) =>
                                              vehicle.id === selectedVehicleId
                                          );
                                        updatedLead.lead_details[
                                          vehicleIndex
                                        ].converted_qty = newQty;
                                        setSelectedLead(updatedLead);
                                      }}
                                      className="border rounded px-2 py-1 text-sm w-16"
                                    >
                                      {Array.from(
                                        { length: originalQty },
                                        (_, i) => (
                                          <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                          </option>
                                        )
                                      )}
                                    </select>
                                  </div>
                                  <div className="border-t pt-2">
                                    <div className="flex justify-between font-semibold">
                                      <span>Total:</span>
                                      <span>
                                        $
                                        {(
                                          actualPrice * convertedQty
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-orange-600">
                                  Price on request
                                </p>
                              )}
                            </div>
                          );
                        })()
                      : selectedLead.lead_details
                          .filter(
                            (v) => v.status === "Open" || v.status === "open"
                          )
                          .map((v) => {
                            const actualPrice =
                              v.color_price ||
                              v.unit_price ||
                              v.variant?.basic_price ||
                              0;
                            const originalQty = v.vehicle_qty || 1;
                            const convertedQty = v.converted_qty || originalQty;

                            return (
                              <div
                                key={v.id}
                                className="bg-white rounded-lg border p-3 shadow-sm"
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex-1">
                                    <h6 className="font-semibold text-gray-800 text-sm">
                                      {v.brand_name} {v.variant_name}
                                    </h6>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                      <span>{v.color_name}</span>

                                      {/* Color Circle */}
                                      {v.color_code && (
                                        <span
                                          className="w-4 h-4 rounded-full border border-gray-300 inline-block"
                                          style={{
                                            backgroundColor: v.color_code,
                                          }}
                                          title={v.color_code}
                                        ></span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                    Total Qty: {originalQty}
                                  </span>
                                </div>

                                <div className="space-y-2">
                                  {actualPrice ? (
                                    <>
                                      <div className="flex justify-between text-sm">
                                        <span>Unit Price:</span>
                                        <span className="font-medium">
                                          $
                                          {parseFloat(
                                            actualPrice
                                          ).toLocaleString()}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center text-sm">
                                        <span>Convert Qty:</span>
                                        <select
                                          value={convertedQty}
                                          onChange={(e) => {
                                            const newQty = parseInt(
                                              e.target.value
                                            );
                                            const updatedLead = {
                                              ...selectedLead,
                                            };
                                            const vehicleIndex =
                                              updatedLead.lead_details.findIndex(
                                                (vehicle) => vehicle.id === v.id
                                              );
                                            updatedLead.lead_details[
                                              vehicleIndex
                                            ].converted_qty = newQty;
                                            setSelectedLead(updatedLead);
                                          }}
                                          className="border rounded px-2 py-1 text-sm w-16"
                                        >
                                          {Array.from(
                                            { length: originalQty },
                                            (_, i) => (
                                              <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </div>
                                      <div className="border-t pt-2 mt-2">
                                        <div className="flex justify-between font-semibold text-gray-800">
                                          <span>Total:</span>
                                          <span>
                                            $
                                            {(
                                              actualPrice * convertedQty
                                            ).toLocaleString()}
                                          </span>
                                        </div>
                                        {convertedQty !== originalQty && (
                                          <p className="text-xs text-gray-500 text-right mt-1">
                                            ({convertedQty} of {originalQty}{" "}
                                            units)
                                          </p>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    <p className="text-sm text-orange-600">
                                      Price on request
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                  </div>

                  {/* Invoice Details */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <h6 className="font-semibold text-gray-800 text-sm mb-3">
                      Invoice Details
                    </h6>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Invoice Number *
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded p-2.5 text-sm"
                          value={invoiceNumber}
                          onChange={(e) => setInvoiceNumber(e.target.value)}
                          placeholder="INV-2025-001"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Upload Invoice
                        </label>
                        <div className="border border-gray-300 rounded p-2">
                          <input
                            type="file"
                            key={invoiceCopy ? "file-has-value" : "file-empty"}
                            className="w-full text-sm file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white file:text-sm"
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                        </div>
                        {invoiceCopy && (
                          <p className="text-xs text-green-600 mt-2 flex items-center">
                            <span className="mr-1">✓</span>
                            {invoiceCopy.name} (
                            {(invoiceCopy.size / 1024).toFixed(1)}KB)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    className="btn-secondary rounded-md px-5 py-2.5 text-sm font-medium"
                    onClick={() => setIsConvertedLeadModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary-blue rounded-md px-6 py-2.5 text-sm font-medium flex items-center disabled:opacity-50"
                    onClick={handleSubmitConvertedLead}
                    disabled={!invoiceNumber}
                  >
                    Submit Conversion
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
            color: var(--accent-green);
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

          .btn-teal {
            background-color: var(--accent-teal);
            color: white;
            transition: all 0.2s ease;
          }

          .btn-teal:hover {
            box-shadow: 0 4px 8px rgba(13, 148, 136, 0.3);
          }

          /* Mobile-optimized modal styles */
          .mobile-concise-view .vehicle-section {
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e5e7eb;
          }

          .mobile-concise-view .vehicle-section:last-child {
            border-bottom: none;
          }

          .mobile-concise-view .vehicle-header {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
          }

          .mobile-concise-view .vehicle-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }

          .mobile-concise-view .detail-item {
            margin-bottom: 0.5rem;
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

          @media (max-width: 640px) {
            .lead-card {
              padding: 1rem;
            }
            .mobile-actions {
              display: flex;
              gap: 8px;
              margin-top: 12px;
            }
            .desktop-actions {
              display: none;
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
      <Footer />
    </Container>
  );
}

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

//loader
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <span className="text-gray-600 font-medium">Loading...</span>
    </div>
  );
}
