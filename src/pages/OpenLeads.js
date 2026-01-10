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
  const [nextFollowUpDate, setNextFollowUpDate] = useState("");
  const [selectedLeadForFollowUp, setSelectedLeadForFollowUp] = useState(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpRemark, setFollowUpRemark] = useState("");

  const [followUpHistory, setFollowUpHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const API_BASE = "http://localhost:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });
  const getImageUrl = (filename) => {
    if (!filename) {
      return "https://via.placeholder.com/100x100/f3f4f6/6b7280?text=No+Image";
    }

    const baseUrl = "http://localhost:8000";

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

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch galleries with proper structure
      const galleriesResponse = await axios.get(`${API_BASE}/galleries`, {
        headers: getAuthHeaders(),
        params: {
          with_images: true,
          include: "variant,color",
          all: true, // Add this if you want all galleries
        },
      });

      console.log("📸 Galleries API Response:", galleriesResponse.data);

      if (galleriesResponse.data.status || galleriesResponse.data.success) {
        const galleriesData =
          galleriesResponse.data.data || galleriesResponse.data || [];

        // Log first few galleries to understand structure
        console.log("📸 First 3 galleries:", galleriesData.slice(0, 3));

        // Process galleries to match LeadGen structure
        const enrichedGalleries = galleriesData.map((gallery) => {
          // Try to extract first_image from various possible fields
          let first_image =
            gallery.first_image ||
            gallery.image ||
            gallery.cover_image ||
            gallery.cover_photo ||
            (gallery.images && gallery.images[0]);

          // If first_image is still not found, check cover_photo_urls
          if (
            !first_image &&
            gallery.cover_photo_urls &&
            gallery.cover_photo_urls.length > 0
          ) {
            first_image = gallery.cover_photo_urls[0];
          }

          // Parse cover_photos if it's a string
          let cover_photos = gallery.cover_photos;
          if (
            typeof cover_photos === "string" &&
            cover_photos.startsWith("[")
          ) {
            try {
              cover_photos = JSON.parse(cover_photos);
            } catch (e) {
              console.error("Error parsing cover_photos:", e);
              cover_photos = [];
            }
          }

          return {
            ...gallery,
            id: gallery.id,
            variant_id: gallery.variant_id,
            color_id: gallery.color_id,
            first_image: first_image,
            cover_photo_urls: gallery.cover_photo_urls || [],
            cover_photos: cover_photos || gallery.cover_photos || [],
            image_base_url:
              gallery.image_base_url ||
              "http://localhost:8000/storage/galleries/",
          };
        });

        console.log("📸 Enriched galleries:", enrichedGalleries.length);
        setGalleries(enrichedGalleries);
      }

      // Rest of your fetch code...
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  // Replace your current useEffect with this:
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(
          "🔄 FETCHING DATA FROM:",
          `${API_BASE}/leads-by-status?status=Open`
        );

        // Fetch open leads
        const leadsResponse = await axios.get(
          `${API_BASE}/leads-by-status?status=Open`,
          { headers: getAuthHeaders() }
        );

        console.log("✅ API RESPONSE STATUS:", leadsResponse.status);
        console.log("✅ API RESPONSE DATA:", leadsResponse.data);

        if (leadsResponse.data.success) {
          const leads = leadsResponse.data.data || [];
          console.log("📊 RAW LEADS FROM API:", leads);
          console.log("📊 NUMBER OF LEADS:", leads.length);

          // Filter leads that have at least one open vehicle
          const openLeadsFiltered = leads.filter((lead) => {
            const hasOpenVehicles = lead.lead_details?.some((vehicle) => {
              const isOpen =
                vehicle.status === "Open" || vehicle.status === "open";
              console.log(
                `Vehicle ${vehicle.id} status: ${vehicle.status}, isOpen: ${isOpen}`
              );
              return isOpen;
            });
            console.log(
              `Lead ${lead.id} (${lead.customer_name}) has open vehicles: ${hasOpenVehicles}`
            );
            return hasOpenVehicles;
          });

          console.log("🎯 FILTERED OPEN LEADS:", openLeadsFiltered);
          console.log("🎯 FILTERED COUNT:", openLeadsFiltered.length);
          setOpenLeads(openLeadsFiltered);
          setFilteredLeads(openLeadsFiltered);

          if (openLeadsFiltered.length === 0 && leads.length > 0) {
            console.log("⚠️ WARNING: Leads exist but none passed the filter!");
            setError(
              `Found ${leads.length} leads but none have open vehicles. Check vehicle statuses.`
            );
          } else if (openLeadsFiltered.length === 0) {
            setError("No open leads found.");
          }
        } else {
          console.error("❌ API returned error:", leadsResponse.data);
          setError(leadsResponse.data.message || "Failed to fetch open leads.");
        }

        // ✅ ADDED: FETCH GALLERIES
        console.log("🖼️ FETCHING GALLERIES FROM:", `${API_BASE}/galleries`);
        try {
          const galleriesResponse = await axios.get(`${API_BASE}/galleries`, {
            headers: getAuthHeaders(),
            params: {
              all: true, // Get all galleries
              with_variant: true, // Include variant info
              with_color: true, // Include color info
            },
          });

          console.log("🖼️ GALLERIES RESPONSE:", galleriesResponse.data);

          if (galleriesResponse.data.success || galleriesResponse.data.status) {
            const galleriesData =
              galleriesResponse.data.data || galleriesResponse.data || [];
            console.log("🖼️ GALLERIES DATA:", galleriesData.length, "items");

            // Process galleries to match expected format
            const processedGalleries = galleriesData.map((gallery) => {
              // Extract first image from various possible fields
              let first_image =
                gallery.first_image ||
                gallery.image ||
                gallery.cover_image ||
                gallery.cover_photo ||
                (gallery.images && gallery.images[0]) ||
                (gallery.cover_photos &&
                  Array.isArray(gallery.cover_photos) &&
                  gallery.cover_photos[0]) ||
                (gallery.cover_photo_urls &&
                  Array.isArray(gallery.cover_photo_urls) &&
                  gallery.cover_photo_urls[0]);

              // Parse cover_photos if it's a string
              let cover_photos = gallery.cover_photos;
              if (
                typeof cover_photos === "string" &&
                cover_photos.startsWith("[")
              ) {
                try {
                  cover_photos = JSON.parse(cover_photos);
                } catch (e) {
                  console.error("Error parsing cover_photos:", e);
                  cover_photos = [];
                }
              }

              return {
                id: gallery.id,
                variant_id: gallery.variant_id,
                color_id: gallery.color_id,
                brand_id: gallery.brand_id,
                first_image: first_image,
                cover_photo_urls: gallery.cover_photo_urls || [],
                cover_photos: cover_photos || gallery.cover_photos || [],
                images: gallery.images || [],
                image: gallery.image,
                cover_image: gallery.cover_image,
                cover_photo: gallery.cover_photo,
                image_base_url:
                  gallery.image_base_url ||
                  "http://localhost:8000/storage/galleries/",
                // Keep all original data
                ...gallery,
              };
            });

            console.log("🖼️ PROCESSED GALLERIES:", processedGalleries.length);
            console.log("🖼️ FIRST PROCESSED GALLERY:", processedGalleries[0]);
            setGalleries(processedGalleries);
          } else {
            console.error(
              "❌ Failed to fetch galleries:",
              galleriesResponse.data
            );
          }
        } catch (galleryError) {
          console.error("❌ Error fetching galleries:", galleryError);
          // Try alternative endpoint
          try {
            const altResponse = await axios.get(`${API_BASE}/vehicles/images`, {
              headers: getAuthHeaders(),
            });
            if (altResponse.data.data) {
              console.log(
                "🖼️ Using alternative endpoint:",
                altResponse.data.data.length
              );
              setGalleries(altResponse.data.data);
            }
          } catch (altErr) {
            console.error("❌ Alternative fetch also failed:", altErr);
          }
        }

        // ✅ ADDED: FETCH VARIANTS (needed for image matching)
        try {
          const variantsResponse = await axios.get(`${API_BASE}/variants`, {
            headers: getAuthHeaders(),
          });
          if (variantsResponse.data.data) {
            setVariants(variantsResponse.data.data);
          }
        } catch (variantsError) {
          console.error("❌ Error fetching variants:", variantsError);
        }

        // ✅ ADDED: FETCH BRANDS (needed for image matching)
        try {
          const brandsResponse = await axios.get(`${API_BASE}/brands`, {
            headers: getAuthHeaders(),
          });
          if (brandsResponse.data.data) {
            setBrands(brandsResponse.data.data);
          }
        } catch (brandsError) {
          console.error("❌ Error fetching brands:", brandsError);
        }

        // ✅ ADDED: FETCH COLORS (needed for image matching)
        try {
          const colorsResponse = await axios.get(`${API_BASE}/colors`, {
            headers: getAuthHeaders(),
          });
          if (colorsResponse.data.data) {
            setColors(colorsResponse.data.data);
          }
        } catch (colorsError) {
          console.error("❌ Error fetching colors:", colorsError);
        }
      } catch (err) {
        console.error("❌ FETCH ERROR:", err);
        console.error("Error response:", err.response?.data);
        setError(
          `Failed to fetch data: ${err.message}. Please check console for details.`
        );
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

        const sortedLeads = openLeadsFiltered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

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

  const handleOpenFollowUpModal = (lead) => {
    console.log("Opening follow-up modal for lead:", lead.id);
    setSelectedLeadForFollowUp(lead);
    setNextFollowUpDate(lead.follow_up_date || "");
    setFollowUpRemark(lead.follow_up_remark || "");
    setIsFollowUpModalOpen(true);
  };

  const getDaysRemaining = (followUpDate) => {
    if (!followUpDate) return null;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Parse the follow-up date safely
      const followUp = new Date(followUpDate);

      // Check if the date is valid
      if (isNaN(followUp.getTime())) {
        console.error("Invalid follow-up date:", followUpDate);
        return null;
      }

      followUp.setHours(0, 0, 0, 0);

      const diffTime = followUp - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0)
        return { text: "Follow-up Today!", type: "today", days: 0 };
      if (diffDays === 1)
        return { text: "Follow-up Tomorrow", type: "tomorrow", days: 1 };
      if (diffDays > 1)
        return {
          text: `In ${diffDays} days`,
          type: "upcoming",
          days: diffDays,
        };
      if (diffDays < 0) {
        const overdueDays = Math.abs(diffDays);
        return {
          text: `Overdue by ${overdueDays} day${overdueDays !== 1 ? "s" : ""}`,
          type: "overdue",
          days: diffDays,
        };
      }
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return null;
    }

    return null;
  };
  const fetchUpcomingFollowUps = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/leads/upcoming-follow-ups`,
        {
          headers: getAuthHeaders(),
          params: { days: 7 }, // Next 7 days
        }
      );

      if (response.data.success) {
        // You could display these in a separate section or notification
        console.log("Upcoming follow-ups:", response.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch upcoming follow-ups:", err);
    }
  };

  // Update your handleSaveFollowUpDate function
  const handleSaveFollowUpDate = async () => {
    if (!selectedLeadForFollowUp) {
      toast.error("No lead selected");
      return;
    }

    if (!nextFollowUpDate) {
      toast.error("Please select a follow-up date");
      return;
    }

    if (!followUpRemark.trim()) {
      toast.error("Please add a remark for the follow-up");
      return;
    }

    console.log("=== SAVING FOLLOW-UP ===");
    console.log("Lead ID:", selectedLeadForFollowUp.id);
    console.log("Date:", nextFollowUpDate);
    console.log("Remark:", followUpRemark);

    try {
      const loadingToast = toast.loading("Saving follow-up...");

      const followUpData = {
        follow_up_date: nextFollowUpDate,
        follow_up_remark: followUpRemark.trim(),
      };

      const response = await axios.put(
        `${API_BASE}/leads/${selectedLeadForFollowUp.id}/update-follow-up`,
        followUpData,
        {
          headers: getAuthHeaders(),
          timeout: 10000,
        }
      );

      toast.dismiss(loadingToast);

      console.log("API Response:", response.data);

      if (response.data.success) {
        toast.success("Follow-up saved successfully!", {
          duration: 3000,
          icon: "✅",
        });

        // Update the lead in local state with the latest follow-up
        const updatedLeads = openLeads.map((lead) => {
          if (lead.id === selectedLeadForFollowUp.id) {
            return {
              ...lead,
              follow_up_date: response.data.data.follow_up_date,
              follow_up_remark: response.data.data.follow_up_remark,
            };
          }
          return lead;
        });

        setOpenLeads(updatedLeads);
        setFilteredLeads(updatedLeads);

        // Close modal
        setIsFollowUpModalOpen(false);
        setSelectedLeadForFollowUp(null);
        setNextFollowUpDate("");
        setFollowUpRemark("");
      } else {
        throw new Error(response.data.message || "Save failed");
      }
    } catch (err) {
      console.error("Error saving follow-up:", err);

      let errorMessage = err.response?.data?.message || err.message;

      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      }

      toast.error(`Error: ${errorMessage}`, {
        duration: 4000,
        icon: "❌",
      });
    }
  };
  const loadFollowUpHistory = async (leadId, leadName = "") => {
    try {
      console.log("Loading follow-up history for lead:", leadId);

      const response = await axios.get(
        `${API_BASE}/leads/${leadId}/follow-up-history`,
        {
          headers: getAuthHeaders(),
          timeout: 10000,
        }
      );

      console.log("History response:", response.data);

      if (response.data.success) {
        setFollowUpHistory(response.data.data || []);
        setSelectedLeadForFollowUp({
          id: leadId,
          customer_name: leadName || "Customer",
        });
        setShowHistoryModal(true);
      } else {
        toast.error(response.data.message || "Failed to load history");
      }
    } catch (err) {
      console.error("Failed to load follow-up history:", err);
      toast.error("Failed to load follow-up history");
    }
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
    console.log("🖼️ Getting color-specific image for vehicle:", {
      id: vehicle.id,
      brand: vehicle.brand_name,
      variant: vehicle.variant_name,
      variantId: vehicle.variant_id,
      colorId: vehicle.color_id,
      colorName: vehicle.color_name,
      galleriesCount: galleries.length,
    });

    if (!galleries || galleries.length === 0) {
      console.log("❌ No galleries available");
      return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
    }

    const variantId = vehicle.variant_id;
    const colorId = vehicle.color_id;

    // 1. FIRST PRIORITY: Exact match (variant + color)
    if (variantId && colorId) {
      const exactGallery = galleries.find(
        (g) => g.variant_id == variantId && g.color_id == colorId
      );

      if (exactGallery) {
        console.log("🎯 Found exact variant+color gallery:", exactGallery.id);
        const imageUrl = extractImageFromGallery(exactGallery);
        if (imageUrl) return imageUrl;
      }
    }

    // 2. SECOND PRIORITY: Variant match (any color)
    if (variantId) {
      const variantGallery = galleries.find((g) => g.variant_id == variantId);
      if (variantGallery) {
        console.log("🔍 Found variant gallery (any color):", variantGallery.id);
        const imageUrl = extractImageFromGallery(variantGallery);
        if (imageUrl) return imageUrl;
      }
    }

    // 3. THIRD PRIORITY: Find any gallery for this brand
    const brandId = vehicle.brand_id;
    if (brandId) {
      // Find any variant for this brand
      const brandVariant = variants.find((v) => v.brand_id == brandId);
      if (brandVariant) {
        const brandGallery = galleries.find(
          (g) => g.variant_id == brandVariant.id
        );
        if (brandGallery) {
          console.log("🏍️ Found brand gallery:", brandGallery.id);
          const imageUrl = extractImageFromGallery(brandGallery);
          if (imageUrl) return imageUrl;
        }
      }
    }

    console.log("❌ No matching gallery found");
    return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
  };

  // Helper function to extract image from gallery
  const extractImageFromGallery = (gallery) => {
    if (!gallery) return null;

    console.log("📸 Extracting image from gallery:", gallery.id);

    // Try different image fields in order of priority
    const imageFields = [
      "first_image",
      "image",
      "cover_image",
      "cover_photo",
      // Array fields
      "cover_photo_urls",
      "cover_photos",
      "images",
    ];

    for (const field of imageFields) {
      const value = gallery[field];

      if (!value) continue;

      console.log(`🔍 Checking ${field}:`, value);

      // Handle array fields
      if (Array.isArray(value) && value.length > 0) {
        const firstItem = value[0];
        if (typeof firstItem === "string") {
          return processImageUrl(firstItem);
        }
      }
      // Handle string JSON arrays (like "['image1.jpg', 'image2.jpg']")
      else if (typeof value === "string" && value.startsWith("[")) {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const firstItem = parsed[0];
            if (typeof firstItem === "string") {
              return processImageUrl(firstItem);
            }
          }
        } catch (e) {
          console.error("Error parsing JSON array:", e);
        }
      }
      // Handle direct string URLs
      else if (typeof value === "string") {
        return processImageUrl(value);
      }
    }

    return null;
  };

  // Process image URL to ensure it's complete
  const processImageUrl = (url) => {
    if (!url) return null;

    let cleanUrl = url.trim();

    // Remove brackets and quotes if present
    cleanUrl = cleanUrl.replace(/[\[\]"\']/g, "");

    // If already a full URL, return as is
    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
      console.log("✅ Direct URL:", cleanUrl);
      return cleanUrl;
    }

    // Remove leading slash if present
    if (cleanUrl.startsWith("/")) {
      cleanUrl = cleanUrl.substring(1);
    }

    // Construct full URL
    let fullUrl;
    if (cleanUrl.includes("storage/")) {
      fullUrl = `http://localhost:8000/${cleanUrl}`;
    } else if (cleanUrl.includes("galleries/")) {
      fullUrl = `http://localhost:8000/${cleanUrl}`;
    } else {
      fullUrl = `http://localhost:8000/storage/galleries/${cleanUrl}`;
    }

    console.log("✅ Constructed URL:", fullUrl);
    return fullUrl;
  };

  // UPDATED: Improved getAbsoluteImageUrl function
  const getAbsoluteImageUrl = (url) => {
    if (!url || typeof url !== "string") {
      console.log("❌ Invalid URL:", url);
      return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
    }

    let cleanUrl = url.trim();
    console.log("🔄 Processing URL:", cleanUrl);

    // If it's already a full URL, return as is
    if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
      return cleanUrl;
    }

    // Remove leading slash if present
    if (cleanUrl.startsWith("/")) {
      cleanUrl = cleanUrl.substring(1);
    }

    // Check common patterns
    if (cleanUrl.includes("storage/")) {
      // Already in storage format
      return `http://localhost:8000/${cleanUrl}`;
    }

    if (cleanUrl.includes("galleries/")) {
      return `http://localhost:8000/${cleanUrl}`;
    }

    // Default: assume it's in galleries folder
    return `http://localhost:8000/storage/galleries/${cleanUrl}`;
  };

  // Add image loading states
  const [imageLoading, setImageLoading] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  const handleImageLoad = (vehicleId) => {
    setImageLoading((prev) => ({ ...prev, [vehicleId]: false }));
  };

  const handleImageError = (vehicleId) => {
    setImageLoading((prev) => ({ ...prev, [vehicleId]: false }));
    setImageErrors((prev) => ({ ...prev, [vehicleId]: true }));
  };

  // UPDATED: Proper Laravel storage URL handling
  // const getAbsoluteImageUrl = (url) => {
  //   if (!url || typeof url !== "string") {
  //     console.log("❌ Invalid URL:", url);
  //     return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
  //   }

  //   // Clean the URL
  //   let cleanUrl = url.trim();

  //   console.log("🔄 Processing URL:", cleanUrl);

  //   // If it's already a full URL, return as is
  //   if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
  //     return cleanUrl;
  //   }

  //   // Remove leading slash if present
  //   if (cleanUrl.startsWith("/")) {
  //     cleanUrl = cleanUrl.substring(1);
  //   }

  //   // IMPORTANT: Laravel storage path pattern
  //   // Your images are in storage/app/public/galleries
  //   // The public URL should be /storage/galleries/[filename]

  //   // Check if it's already in storage format
  //   if (cleanUrl.includes("storage/")) {
  //     return `http://localhost:8000/${cleanUrl}`;
  //   }

  //   // Check if it's a galleries image
  //   if (cleanUrl.includes("galleries")) {
  //     // Extract just the filename
  //     const filename = cleanUrl.split("/").pop();
  //     return `http://localhost:8000/storage/galleries/${filename}`;
  //   }

  //   // Default: assume it's in galleries folder
  //   return `http://localhost:8000/storage/galleries/${cleanUrl}`;
  // };

  // Add this debug function
  const debugGalleryImages = () => {
    console.log("=== GALLERY IMAGE DEBUG ===");
    console.log("Total galleries:", galleries.length);

    if (galleries.length > 0) {
      galleries.forEach((gallery, index) => {
        console.log(`Gallery ${index + 1}:`, {
          id: gallery.id,
          variant_id: gallery.variant_id,
          color_id: gallery.color_id,
          cover_photo_urls: gallery.cover_photo_urls,
          first_image: gallery.first_image,
          // Check all image properties
          allKeys: Object.keys(gallery).filter(
            (key) =>
              key.includes("image") ||
              key.includes("photo") ||
              key.includes("url")
          ),
        });
      });
    }
  };

  // Call this in useEffect to debug
  useEffect(() => {
    if (galleries.length > 0) {
      debugGalleryImages();
    }
  }, [galleries]);

  const getInvoiceUrl = (invoicePath) => {
    if (!invoicePath) return null;
    if (
      invoicePath.startsWith("http://") ||
      invoicePath.startsWith("https://")
    ) {
      return invoicePath;
    }
    if (invoicePath.startsWith("/")) {
      return `http://localhost:8000${invoicePath}`;
    }
    return `http://localhost:8000/storage/${invoicePath}`;
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

  // const handleSubmitConvertedLead = async () => {
  //   if (!selectedLead) {
  //     alert("No lead selected");
  //     return;
  //   }

  //   try {
  //     let response;
  //     const headers = getAuthHeaders();

  //     // Define variables outside the if/else blocks
  //     let totalConvertedQty = 0;
  //     let totalOriginalQty = 0;
  //     let singleVehicle = null;

  //     if (selectedVehicleId) {
  //       // SINGLE VEHICLE conversion (with FormData since it might have file)
  //       singleVehicle = selectedLead.lead_details.find(
  //         (v) => v.id === selectedVehicleId
  //       );
  //       if (!singleVehicle) {
  //         alert("Vehicle not found");
  //         return;
  //       }

  //       const originalQty = singleVehicle?.vehicle_qty || 1;
  //       const convertedQty = singleVehicle?.converted_qty || originalQty;
  //       const actualPrice =
  //         singleVehicle?.color_price ||
  //         singleVehicle?.unit_price ||
  //         singleVehicle?.variant?.basic_price ||
  //         0;
  //       const totalPrice = actualPrice * convertedQty;

  //       // Set totals for single vehicle
  //       totalOriginalQty = originalQty;
  //       totalConvertedQty = convertedQty;

  //       const formData = new FormData();
  //       formData.append("close_type", "Converted");
  //       formData.append("invoice_no", invoiceNumber);
  //       formData.append("converted_quantity", convertedQty.toString());
  //       formData.append("unit_price", actualPrice.toString());
  //       formData.append("total_price", totalPrice.toString());

  //       if (invoiceCopy) {
  //         formData.append("uploaded_invoice", invoiceCopy);
  //         console.log("Attaching invoice file:", invoiceCopy.name);
  //       }

  //       response = await axios.put(
  //         `${API_BASE}/lead-details/${selectedVehicleId}/close`,
  //         formData,
  //         {
  //           headers: {
  //             ...headers,
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );
  //     } else {
  //       // ENTIRE LEAD conversion - USE REGULAR JSON (NO FORMDATA)
  //       const vehiclesData = selectedLead.lead_details
  //         .filter((v) => v.status === "Open" || v.status === "open")
  //         .map((vehicle) => {
  //           const actualPrice =
  //             vehicle.color_price ||
  //             vehicle.unit_price ||
  //             vehicle.variant?.basic_price ||
  //             0;
  //           const originalQty = vehicle.vehicle_qty || 1;
  //           const convertedQty = vehicle.converted_qty || originalQty;
  //           const totalPrice = actualPrice * convertedQty;

  //           return {
  //             vehicle_id: vehicle.id,
  //             vehicle_qty: convertedQty,
  //             unit_price: actualPrice.toString(), // Ensure it's a string
  //             total_price: totalPrice.toString(),
  //           };
  //         });

  //       // Calculate totals
  //       totalConvertedQty = vehiclesData.reduce(
  //         (sum, vehicle) => sum + vehicle.vehicle_qty,
  //         0
  //       );
  //       totalOriginalQty = selectedLead.lead_details
  //         .filter((v) => v.status === "Open" || v.status === "open")
  //         .reduce((sum, v) => sum + (v.vehicle_qty || 1), 0);

  //       // Create regular JSON payload (NOT FormData)
  //       const payload = {
  //         close_type: "converted",
  //         invoice_no: invoiceNumber,
  //         vehicles_data: vehiclesData, // Send as array directly
  //       };

  //       console.log("Sending JSON payload:", JSON.stringify(payload, null, 2));
  //       console.log("Payload details:", {
  //         lead_id: selectedLead.id,
  //         invoice_no: invoiceNumber,
  //         close_type: "converted",
  //         vehicles_count: vehiclesData.length,
  //         total_converted_qty: totalConvertedQty,
  //       });

  //       response = await axios.put(
  //         `${API_BASE}/leads/${selectedLead.id}/close-entire`,
  //         payload,
  //         {
  //           headers: getAuthHeaders(), // Regular JSON headers (no multipart/form-data)
  //         }
  //       );
  //     }

  //     // Handle response - use variables that are now defined in both cases
  //     if (response?.data?.success) {
  //       const {
  //         converted_qty = 0,
  //         original_qty = 0,
  //         remaining_qty = 0,
  //         has_invoice = false,
  //       } = response.data;

  //       // Use response data if available, otherwise use calculated totals
  //       const finalConvertedQty = converted_qty || totalConvertedQty;
  //       const finalOriginalQty = original_qty || totalOriginalQty;

  //       let message = "✅ Conversion successful!\n\n";
  //       message += `Converted: ${finalConvertedQty} unit(s)\n`;
  //       message += `Original: ${finalOriginalQty} unit(s)\n`;

  //       const remaining = remaining_qty || finalOriginalQty - finalConvertedQty;
  //       if (remaining > 0) {
  //         message += `Remaining: ${remaining} unit(s)\n`;
  //       }

  //       if (has_invoice) {
  //         message += `\n✅ Invoice uploaded successfully!`;
  //       } else if (invoiceCopy && !selectedVehicleId) {
  //         message += `\n⚠️ Note: Invoice file was not uploaded because we used JSON format.`;
  //         setTimeout(() => {
  //           window.location.reload();
  //         }, 800);
  //       }

  //       alert(message);

  //       // Force complete refresh from API
  //       await handleRefresh();
  //       setIsConvertedLeadModalOpen(false);
  //       setSelectedLead(null);
  //       setSelectedVehicleId(null);
  //       setInvoiceNumber("");
  //       setInvoiceCopy(null);
  //       setConfirmDetails(true);
  //     } else {
  //       // Handle alternative response format or error
  //       const errorMsg = response?.data?.message || "Unknown error occurred";
  //       throw new Error(errorMsg);
  //     }
  //   } catch (err) {
  //     console.error("❌ Conversion failed:", err);

  //     // More detailed error handling
  //     if (err.response) {
  //       console.error("Response data:", err.response.data);
  //       console.error("Response status:", err.response.status);

  //       let errorMessage =
  //         err.response.data?.message || "Server error occurred";

  //       // Check for validation errors
  //       if (err.response.data?.errors) {
  //         const validationErrors = Object.values(
  //           err.response.data.errors
  //         ).flat();
  //         errorMessage = validationErrors.join(", ");
  //       }

  //       // Check for specific field errors
  //       if (err.response.data?.errors?.uploaded_invoice) {
  //         errorMessage = `Invoice file error: ${err.response.data.errors.uploaded_invoice.join(
  //           ", "
  //         )}`;
  //       }

  //       // Check for vehicles_data error
  //       if (err.response.data?.message?.includes("vehicles_data")) {
  //         errorMessage = "Failed to process vehicles data. Please try again.";
  //       }

  //       // Check if it's a close_type validation error
  //       if (err.response.data?.message?.toLowerCase().includes("close_type")) {
  //         errorMessage = "Conversion type error. Please try again.";
  //       }

  //       alert(`Error: ${errorMessage}`);
  //     } else if (err.request) {
  //       console.error("No response received:", err.request);
  //       alert("Error: No response from server. Please check your connection.");
  //     } else {
  //       console.error("Request setup error:", err.message);
  //       alert(`Error: ${err.message}`);
  //     }
  //   }
  // };

  // const handleSubmitConvertedLead = async () => {
  //   if (!selectedLead) {
  //     alert("No lead selected");
  //     return;
  //   }

  //   try {
  //     // For multiple vehicles
  //     if (!selectedVehicleId) {
  //       // Prepare vehicles data
  //       const vehiclesData = selectedLead.lead_details
  //         .filter((v) => v.status === "Open" || v.status === "open")
  //         .map((vehicle) => {
  //           const actualPrice =
  //             vehicle.color_price ||
  //             vehicle.unit_price ||
  //             vehicle.variant?.basic_price ||
  //             0;
  //           const originalQty = vehicle.vehicle_qty || 1;
  //           const convertedQty = vehicle.converted_qty || originalQty;
  //           const totalPrice = actualPrice * convertedQty;
  //           const invoiceNo = vehicle.invoice_no || "";

  //           if (!invoiceNo) {
  //             throw new Error(`Invoice number missing for vehicle: ${vehicle.brand_name} ${vehicle.variant_name}`);
  //           }

  //           return {
  //             vehicle_id: vehicle.id,
  //             vehicle_qty: convertedQty,
  //             unit_price: actualPrice.toString(),
  //             total_price: totalPrice.toString(),
  //             invoice_no: invoiceNo,
  //           };
  //         });

  //       // 🎯 Create JSON payload (not FormData)
  //       const payload = {
  //         close_type: "converted",
  //         vehicles_data: vehiclesData, // Already an array
  //       };

  //       console.log("Sending JSON payload:", payload);

  //       // Show loading
  //       setIsConvertedLeadModalOpen(false);
  //       const loadingToast = toast.loading("Processing conversion...");

  //       try {
  //         // 🎯 Send as JSON
  //         const response = await axios.put(
  //           `${API_BASE}/leads/${selectedLead.id}/close-entire`,
  //           payload,
  //           {
  //             headers: {
  //               'Authorization': `Bearer ${localStorage.getItem("authToken")}`,
  //               'Content-Type': 'application/json',
  //             }
  //           }
  //         );

  //         toast.dismiss(loadingToast);

  //         if (response.data.success) {
  //           toast.success("Conversion successful!", { duration: 3000 });

  //           // Handle file uploads separately if needed
  //           await uploadInvoiceFilesSeparately(selectedLead.id, vehiclesData);

  //           await handleRefresh();
  //           setSelectedLead(null);
  //         } else {
  //           throw new Error(response.data.message || "Conversion failed");
  //         }
  //       } catch (apiError) {
  //         toast.dismiss(loadingToast);
  //         console.error("API Error:", apiError.response?.data || apiError.message);
  //         throw apiError;
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Conversion error:", err);
  //     toast.error(`Error: ${err.message}`, { duration: 5000 });

  //     // Reopen modal for validation errors
  //     if (err.message.includes("invoice number")) {
  //       setIsConvertedLeadModalOpen(true);
  //     }
  //   }
  // };

  // const handleSubmitConvertedLead = async () => {
  //   if (!selectedLead) {
  //     toast.error("No lead selected");
  //     return;
  //   }

  //   try {
  //     // Prepare vehicles data (only open vehicles)
  //     const openVehicles = selectedLead.lead_details.filter(
  //       (v) => v.status?.toLowerCase() === "open"
  //     );

  //     if (openVehicles.length === 0) {
  //       toast.error("No open vehicles to convert");
  //       return;
  //     }

  //     // Build vehicles_data array
  //     const vehiclesData = openVehicles.map((vehicle) => {
  //       const actualPrice =
  //         vehicle.color_price ||
  //         vehicle.unit_price ||
  //         vehicle.variant?.basic_price ||
  //         0;

  //       const originalQty = vehicle.vehicle_qty || 1;
  //       const convertedQty = vehicle.converted_qty || originalQty;
  //       const totalPrice = actualPrice * convertedQty;
  //       const invoiceNo = vehicle.invoice_no?.trim() || "";

  //       if (!invoiceNo) {
  //         throw new Error(
  //           `Invoice number missing for vehicle: ${vehicle.brand_name} ${vehicle.variant_name}`
  //         );
  //       }

  //       return {
  //         vehicle_id: vehicle.id,
  //         vehicle_qty: convertedQty,
  //         unit_price: String(actualPrice),
  //         total_price: String(totalPrice),
  //         invoice_no: invoiceNo,
  //       };
  //     });

  //     // Convert to JSON string
  //     const vehiclesDataJson = JSON.stringify(vehiclesData);

  //     console.log("=== FINAL VEHICLES DATA (JSON STRING) ===");
  //     console.log(vehiclesDataJson);

  //     // Create FormData
  //     const formData = new FormData();

  //     // MUST: close_type
  //     formData.append("close_type", "converted");

  //     // MUST: vehicles_data as JSON string
  //     formData.append("vehicles_data", vehiclesDataJson);
  //     formData.append("vehicles_data", JSON.stringify(vehiclesData)); // ← Yeh string hona chahiye

  //     // Append individual invoice files (if any)
  //     openVehicles.forEach((vehicle) => {
  //       if (vehicle.invoice_file) {
  //         formData.append(`invoice_files[${vehicle.id}]`, vehicle.invoice_file);
  //         console.log(
  //           `Added file for vehicle ${vehicle.id}: ${vehicle.invoice_file.name}`
  //         );
  //       }
  //     });

  //     // Debug: Print entire FormData
  //     console.log("=== FORM DATA ENTRIES ===");
  //     for (let [key, value] of formData.entries()) {
  //       if (value instanceof File) {
  //         console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
  //       } else {
  //         console.log(`${key}: ${value}`);
  //       }
  //     }

  //     // API call
  //     setIsConvertedLeadModalOpen(false);
  //     // const loadingToast = toast.loading("Converting lead...");

  //     const response = await axios.put(
  //       `${API_BASE}/leads/${selectedLead.id}/close-entire-with-files`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //           // NO 'Content-Type' here - browser will set multipart/form-data automatically
  //         },
  //       }
  //     );

  //     // toast.dismiss(loadingToast);

  //     if (response.data.success) {
  //       toast.success("Lead converted successfully!", { duration: 3000 });
  //       await handleRefresh();
  //       setSelectedLead(null);
  //       setSelectedVehicleId(null);
  //     } else {
  //       throw new Error(response.data.message || "Conversion failed");
  //     }
  //   } catch (err) {
  //     // toast.dismiss(loadingToast);
  //     console.error("Conversion error:", err);
  //     toast.error(`Error: ${err.message || "Unknown error"}`, {
  //       duration: 5000,
  //     });
  //   }
  // };

  const handleSubmitConvertedLead = async () => {
    if (!selectedLead) {
      toast.error("No lead selected");
      return;
    }

    try {
      // 1️⃣ Get only OPEN vehicles
      const openVehicles = selectedLead.lead_details.filter(
        (v) => v.status?.toLowerCase() === "open"
      );

      if (openVehicles.length === 0) {
        toast.error("No open vehicles to convert");
        return;
      }

      // 2️⃣ Validation: invoice number required
      const missingInvoice = openVehicles.some(
        (v) => !v.invoice_no || !v.invoice_no.trim()
      );

      if (missingInvoice) {
        toast.error("All vehicles must have an invoice number");
        return;
      }

      // 3️⃣ Prepare vehicles_data
      const vehiclesData = openVehicles.map((vehicle) => {
        const qty = vehicle.converted_qty || vehicle.vehicle_qty || 1;
        const unitPrice =
          vehicle.color_price ||
          vehicle.unit_price ||
          vehicle.variant?.basic_price ||
          0;

        return {
          vehicle_id: vehicle.id,
          vehicle_qty: qty,
          unit_price: String(unitPrice),
          total_price: String(unitPrice * qty),
          invoice_no: vehicle.invoice_no.trim(),
        };
      });

      // 4️⃣ Create FormData
      const formData = new FormData();
      formData.append("close_type", "converted");

      // 🔥 IMPORTANT (PUT spoofing)
      formData.append("_method", "PUT");

      // 5️⃣ Append vehicles_data
      vehiclesData.forEach((vehicle, index) => {
        formData.append(
          `vehicles_data[${index}][vehicle_id]`,
          vehicle.vehicle_id
        );
        formData.append(
          `vehicles_data[${index}][vehicle_qty]`,
          vehicle.vehicle_qty
        );
        formData.append(
          `vehicles_data[${index}][unit_price]`,
          vehicle.unit_price
        );
        formData.append(
          `vehicles_data[${index}][total_price]`,
          vehicle.total_price
        );
        formData.append(
          `vehicles_data[${index}][invoice_no]`,
          vehicle.invoice_no
        );
      });

      // 6️⃣ Append invoice files (keyed by vehicle ID)
      openVehicles.forEach((vehicle) => {
        if (vehicle.invoice_file instanceof File) {
          formData.append(`invoice_files[${vehicle.id}]`, vehicle.invoice_file);
          console.log(
            `Added file: ${vehicle.invoice_file.name} for vehicle ${vehicle.id}`
          );
        }
      });

      // 7️⃣ Debug FormData (optional – keep while testing)
      console.log("=== SENDING FORMDATA ===");
      for (let [key, value] of formData.entries()) {
        console.log(
          key,
          value instanceof File
            ? `${value.name} (File, ${value.size} bytes)`
            : value
        );
      }

      // 8️⃣ API call (POST + _method=PUT)
      const loadingToast = toast.loading("Converting lead...");

      const response = await axios.post(
        `${API_BASE}/leads/${selectedLead.id}/close-entire-with-files`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            // ❌ DO NOT set Content-Type
          },
        }
      );

      toast.dismiss(loadingToast);

      // 9️⃣ Success
      if (response.data.success) {
        toast.success("Lead converted successfully!", { duration: 3000 });
        await handleRefresh();
        setIsConvertedLeadModalOpen(false);
        setSelectedLead(null);
        setSelectedVehicleId(null);
      } else {
        throw new Error(response.data.message || "Conversion failed");
      }
    } catch (err) {
      console.error("Conversion error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong", {
        duration: 5000,
      });
    }
  };

  // Separate function to upload invoice files
  const uploadInvoiceFilesSeparately = async (leadId, vehiclesData) => {
    const filesToUpload = selectedLead.lead_details
      .filter((v) => v.status === "Open" || v.status === "open")
      .filter((v) => v.invoice_file)
      .map((vehicle) => ({
        vehicle_id: vehicle.id,
        invoice_no: vehicle.invoice_no,
        file: vehicle.invoice_file,
      }));

    if (filesToUpload.length === 0) return;

    console.log("Uploading invoice files separately:", filesToUpload.length);

    for (const item of filesToUpload) {
      try {
        const formData = new FormData();
        formData.append("invoice_file", item.file);
        formData.append("invoice_no", item.invoice_no);

        await axios.post(
          `${API_BASE}/leads/${leadId}/vehicles/${item.vehicle_id}/upload-invoice`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        console.log(`Uploaded invoice for vehicle ${item.vehicle_id}`);
      } catch (error) {
        console.error(
          `Failed to upload invoice for vehicle ${item.vehicle_id}:`,
          error
        );
        // Continue with other files even if one fails
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
  if (error && openLeads.length === 0)
    return <ErrorMessage message={error} onRetry={handleRefresh} />;

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

                  // Enhanced Follow-up Status Calculation
                  // Enhanced Follow-up Status Calculation
                  const followUpStatus = (() => {
                    if (!lead.follow_up_date) return null;

                    try {
                      const daysRemaining = getDaysRemaining(
                        lead.follow_up_date
                      );
                      if (!daysRemaining) return null;

                      const { type, days } = daysRemaining;

                      if (type === "today") {
                        return {
                          text: "Follow-up Today!",
                          icon: "bi-exclamation-circle-fill",
                          color: "bg-red-100 text-red-700 border-red-300",
                          days: 0,
                        };
                      } else if (type === "tomorrow") {
                        return {
                          text: "Follow-up Tomorrow",
                          icon: "bi-exclamation-triangle-fill",
                          color:
                            "bg-orange-100 text-orange-700 border-orange-300",
                          days: 1,
                        };
                      } else if (type === "upcoming" && days > 1) {
                        return {
                          text: `In ${days} days`,
                          icon: "bi-calendar-check",
                          color: "bg-green-100 text-green-700 border-green-300",
                          days: days,
                        };
                      } else if (type === "overdue") {
                        const overdueDays = Math.abs(days);
                        return {
                          text: `Overdue by ${overdueDays} day${
                            overdueDays > 1 ? "s" : ""
                          }`,
                          icon: "bi-exclamation-diamond-fill",
                          color:
                            "bg-red-100 text-red-800 border-red-400 font-semibold",
                          days: days,
                        };
                      }
                    } catch (error) {
                      console.error(
                        "Error calculating follow-up status:",
                        error
                      );
                      return null;
                    }

                    return null;
                  })();

                  return (
                    <div
                      key={lead.id}
                      className="lead-card bg-white p-5 rounded-lg shadow-md border-l-4 border-[var(--primary-blue)]"
                      data-lead-id={lead.id}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Customer Name + Follow-up Status Badge */}
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h6 className="text-base font-semibold text-text-dark truncate">
                              {lead.customer_name}
                            </h6>

                            {/* Always show upcoming/overdue status prominently */}
                            {followUpStatus && (
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${followUpStatus.color}`}
                                title={`Follow-up date: ${new Date(
                                  lead.follow_up_date
                                ).toLocaleDateString()}`}
                              >
                                <i
                                  className={`bi ${followUpStatus.icon} text-sm`}
                                ></i>
                                {followUpStatus.text}
                              </span>
                            )}
                          </div>

                          {/* Location */}
                          <div className="location-info mb-3">
                            <i className="bi bi-geo-alt"></i>
                            <span>{lead.location || "N/A"}</span>
                          </div>

                          {/* Vehicle Info */}
                          <div className="mt-2 space-y-1">
                            {lead.lead_details
                              ?.filter(
                                (v) =>
                                  v.status === "Open" || v.status === "open"
                              )
                              .map((vehicle) => (
                                <div key={vehicle.id} className="vehicle-info">
                                  <i className="bi bi-bicycle"></i>
                                  <span>
                                    {vehicle.brand_name || "No brand"}{" "}
                                    {vehicle.variant_name || "No variant"}
                                  </span>
                                </div>
                              ))}
                          </div>

                          {/* Age + Payment Badge */}
                          <div className="flex items-center gap-2 mt-3">
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

                          {/* Optional: Still show remark icon if exists */}
                          {lead.follow_up_remark && (
                            <div className="mt-2 text-xs text-gray-600 flex items-center gap-1">
                              <i className="bi bi-chat-left-text text-blue-500"></i>
                              <span className="italic">Has remark</span>
                            </div>
                          )}
                        </div>

                        {/* Desktop Action Buttons */}
                        <div className="desktop-actions flex gap-2 flex-shrink-0">
                          <div className="action-item flex flex-col items-center">
                            <div
                              className="action-btn btn-follow-up"
                              title="Set Follow-up Date"
                              onClick={() => handleOpenFollowUpModal(lead)}
                            >
                              <i className="bi bi-calendar-plus"></i>
                            </div>
                            <span className="action-label text-xs mt-1">
                              Follow-up
                            </span>
                          </div>

                          <div className="action-item flex flex-col items-center">
                            <div
                              className="action-btn btn-history"
                              title="View Follow-up History"
                              onClick={() =>
                                loadFollowUpHistory(lead.id, lead.customer_name)
                              }
                            >
                              <i className="bi bi-clock-history"></i>
                            </div>
                            <span className="action-label text-xs mt-1">
                              History
                            </span>
                          </div>

                          <div className="action-item flex flex-col items-center">
                            <div
                              className="action-btn btn-view"
                              title="View"
                              onClick={() => handleViewLead(lead)}
                            >
                              <i className="bi bi-eye"></i>
                            </div>
                            <span className="action-label text-xs mt-1">
                              View
                            </span>
                          </div>

                          <div className="action-item flex flex-col items-center">
                            <div
                              className="action-btn btn-edit"
                              title="Edit"
                              onClick={() => handleEditLead(lead)}
                            >
                              <i className="bi bi-pencil"></i>
                            </div>
                            <span className="action-label text-xs mt-1">
                              Edit
                            </span>
                          </div>

                          <div className="action-item flex flex-col items-center">
                            <div
                              className="action-btn btn-close"
                              title="Close Lead"
                              onClick={() => handleCloseEntireLead(lead)}
                            >
                              <i className="bi bi-check-lg"></i>
                            </div>
                            <span className="action-label text-xs mt-1">
                              Close
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Follow-up Date Section - ABOVE MOBILE ACTIONS */}
                      {/* Follow-up Date Section - ABOVE MOBILE ACTIONS */}
                      {lead.follow_up_date && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <i className="bi bi-calendar2-week text-blue-600 text-lg"></i>
                                <div>
                                  <div className="text-sm font-medium text-gray-800">
                                    Next Follow-up
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {(() => {
                                      try {
                                        const date = new Date(
                                          lead.follow_up_date
                                        );
                                        if (isNaN(date.getTime())) {
                                          return "Invalid date";
                                        }
                                        return date.toLocaleDateString(
                                          "en-US",
                                          {
                                            weekday: "long",
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                          }
                                        );
                                      } catch (error) {
                                        console.error(
                                          "Error formatting date:",
                                          error
                                        );
                                        return "Invalid date";
                                      }
                                    })()}
                                  </div>
                                </div>
                              </div>

                              {followUpStatus && (
                                <div
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${followUpStatus.color}`}
                                >
                                  <i
                                    className={`bi ${followUpStatus.icon} mr-1`}
                                  ></i>
                                  {followUpStatus.text}
                                </div>
                              )}
                            </div>

                            <div className="text-xs text-gray-500">
                              Last updated:{" "}
                              {(() => {
                                try {
                                  if (!lead.updated_at) return "N/A";
                                  const date = new Date(lead.updated_at);
                                  if (isNaN(date.getTime())) return "N/A";
                                  return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  });
                                } catch (error) {
                                  return "N/A";
                                }
                              })()}
                            </div>
                          </div>

                          {lead.follow_up_remark && (
                            <div className="mt-2 pt-2 border-t border-blue-100">
                              <div className="flex items-start gap-2">
                                <i className="bi bi-chat-left-text text-blue-500 mt-0.5"></i>
                                <div>
                                  <div className="text-xs font-medium text-gray-700 mb-1">
                                    Remark:
                                  </div>
                                  <div className="text-sm text-gray-600 italic">
                                    "{lead.follow_up_remark}"
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mobile Actions */}
                      <div className="mobile-actions flex flex-wrap gap-2 mt-4">
                        <div className="action-item flex items-center gap-1 px-2 py-1 rounded bg-gray-50 hover:bg-gray-100">
                          <div
                            className="action-btn btn-follow-up"
                            title="Set Follow-up Date"
                            onClick={() => handleOpenFollowUpModal(lead)}
                          >
                            <i className="bi bi-calendar-plus"></i>
                          </div>
                          <span className="action-label text-xs font-medium text-gray-700">
                            Follow-up
                          </span>
                        </div>

                        <div className="action-item flex items-center gap-1 px-2 py-1 rounded bg-gray-50 hover:bg-gray-100">
                          <div
                            className="action-btn btn-history"
                            title="View Follow-up History"
                            onClick={() =>
                              loadFollowUpHistory(lead.id, lead.customer_name)
                            }
                          >
                            <i className="bi bi-clock-history"></i>
                          </div>
                          <span className="action-label text-xs font-medium text-gray-700">
                            History
                          </span>
                        </div>

                        <div className="action-item flex items-center gap-1 px-2 py-1 rounded bg-gray-50 hover:bg-gray-100">
                          <div
                            className="action-btn btn-view"
                            title="View"
                            onClick={() => handleViewLead(lead)}
                          >
                            <i className="bi bi-eye"></i>
                          </div>
                          <span className="action-label text-xs font-medium text-gray-700">
                            View
                          </span>
                        </div>

                        <div className="action-item flex items-center gap-1 px-2 py-1 rounded bg-gray-50 hover:bg-gray-100">
                          <div
                            className="action-btn btn-edit"
                            title="Edit"
                            onClick={() => handleEditLead(lead)}
                          >
                            <i className="bi bi-pencil"></i>
                          </div>
                          <span className="action-label text-xs font-medium text-gray-700">
                            Edit
                          </span>
                        </div>

                        <div className="action-item flex items-center gap-1 px-2 py-1 rounded bg-gray-50 hover:bg-gray-100">
                          <div
                            className="action-btn btn-close"
                            title="Close Lead"
                            onClick={() => handleCloseEntireLead(lead)}
                          >
                            <i className="bi bi-check-lg"></i>
                          </div>
                          <span className="action-label text-xs font-medium text-gray-700">
                            Close
                          </span>
                        </div>
                      </div>

                      {/* <button
                        onClick={() => {
                          if (selectedLead) {
                            selectedLead.lead_details.forEach(
                              (vehicle, index) => {
                                const imgUrl = getVehicleImage(vehicle);
                                console.log(`Vehicle ${index + 1}:`, {
                                  brand: vehicle.brand_name,
                                  variant: vehicle.variant_name,
                                  url: imgUrl,
                                });

                                // Test load the image
                                const testImg = new Image();
                                testImg.onload = () =>
                                  console.log(`✅ Image ${index + 1} loads OK`);
                                testImg.onerror = () =>
                                  console.log(
                                    `❌ Image ${index + 1} fails to load`
                                  );
                                testImg.src = imgUrl;
                              }
                            );
                          }
                        }}
                        className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded z-50"
                      >
                        Test Images
                      </button> */}
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
                  <div className="mobile-concise-view flex flex-col h-full">
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
                                <div className="w-full mb-3">
                                  {/* In your vehicle display */}
                                  <img
                                    src={vehicleImage}
                                    alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                    onLoad={() => handleImageLoad(vehicle.id)}
                                    onError={(e) => {
                                      handleImageError(vehicle.id);
                                      e.target.src =
                                        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
                                    }}
                                    style={{
                                      opacity: imageLoading[vehicle.id] ? 0 : 1,
                                      transition: "opacity 0.3s",
                                    }}
                                  />

                                  {/* Loading indicator */}
                                  {imageLoading[vehicle.id] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                      <div className="w-8 h-8 border-2 border-blue-500 border-dashed rounded-full animate-spin"></div>
                                    </div>
                                  )}
                                </div>
                                <div className="w-full">
                                  <div className="grid grid-cols-3 gap-2 mb-3">
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
                                        {vehicle.quantity || 1}
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

                    {/* Spacer to push buttons to bottom */}
                    <div className="flex-grow"></div>

                    {/* Mobile View Buttons - FIXED AT BOTTOM */}
                    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 mt-4 shadow-lg">
                      <div className="flex gap-2">
                        <button
                          className="flex-1 bg-blue-600 text-white rounded-md px-4 py-3 text-sm font-medium hover:bg-blue-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseEntireLead(selectedLead);
                          }}
                        >
                          Close Entire Lead
                        </button>
                        <button
                          className="flex-1 bg-gray-200 text-gray-700 rounded-md px-4 py-3 text-sm font-medium hover:bg-gray-300 transition-colors"
                          onClick={() => setIsViewModalOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
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
                                      {vehicle.quantity || 1}
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

                    {/* Desktop View Buttons */}
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
                  </>
                )}
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

                {/* MOBILE VIEW BUTTONS - STICKY BOTTOM */}
                {window.innerWidth <= 640 ? (
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 -mb-4">
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-gray-200 text-gray-700 rounded-md px-4 py-3 text-sm font-medium hover:bg-gray-300 transition-colors"
                        onClick={() => setIsEditModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 bg-[var(--primary-blue)] text-white rounded-md px-4 py-3 text-sm font-medium hover:bg-blue-700 transition-colors"
                        onClick={handleSaveLead}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  /* DESKTOP VIEW BUTTONS */
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
                )}
              </div>
            </div>
          </div>
        )}

        {/* CONVERTED LEAD MODAL - SIMPLIFIED */}
        {/* CONVERTED LEAD MODAL - MULTIPLE INVOICE SUPPORT */}
        {isConvertedLeadModalOpen && selectedLead && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] overflow-y-auto"
            onClick={() => setIsConvertedLeadModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full mx-4 my-8 flex flex-col"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxHeight: "calc(90vh - 70px)",
                marginBottom: "70px",
              }}
            >
              {/* Header */}
              <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
                <h5 className="text-base font-medium">
                  {selectedVehicleId
                    ? "Convert Vehicle"
                    : "Convert Entire Lead"}
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
                    <h6 className="text-base font-medium text-primary-blue mb-3">
                      {selectedVehicleId
                        ? "Vehicle Conversion"
                        : "Convert Lead Invoice Details"}
                    </h6>
                  </div>

                  {/* Vehicle Details with Individual Invoice Inputs */}
                  <div className="space-y-4 mb-6">
                    {selectedVehicleId
                      ? // Single Vehicle Mode
                        (() => {
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
                            <div
                              key={v.id}
                              className="bg-white rounded-lg border p-4 shadow-sm"
                            >
                              <div className="mb-4">
                                <h6 className="font-semibold text-gray-800 text-sm mb-1">
                                  {v.brand_name} {v.variant_name}
                                </h6>
                                <p className="text-xs text-gray-500">
                                  {v.color_name} • Original Qty: {originalQty}
                                </p>
                              </div>

                              {actualPrice ? (
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center text-sm">
                                    <span>Unit Price:</span>
                                    <span className="font-medium">
                                      $
                                      {parseFloat(actualPrice).toLocaleString()}
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-center text-sm">
                                    <span>Convert Quantity:</span>
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
                                      className="border rounded px-2 py-1 text-sm w-20"
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

                                  <div className="border-t pt-3">
                                    <div className="flex justify-between font-semibold text-sm mb-1">
                                      <span>Total Price:</span>
                                      <span className="text-green-600">
                                        $
                                        {(
                                          actualPrice * convertedQty
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    {convertedQty !== originalQty && (
                                      <p className="text-xs text-gray-500 text-right">
                                        ({convertedQty} of {originalQty} units)
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-orange-600">
                                  Price on request
                                </p>
                              )}

                              {/* Individual Invoice Section */}
                              <div className="mt-4 pt-4 border-t">
                                <h6 className="font-semibold text-gray-800 text-sm mb-3">
                                  Invoice Details for this Vehicle
                                </h6>

                                <div className="space-y-3">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                      Invoice Number *
                                    </label>
                                    <input
                                      type="text"
                                      className="w-full border border-gray-300 rounded p-2.5 text-sm"
                                      value={
                                        v.invoice_no || invoiceNumber || ""
                                      }
                                      onChange={(e) => {
                                        const updatedLead = { ...selectedLead };
                                        const vehicleIndex =
                                          updatedLead.lead_details.findIndex(
                                            (vehicle) =>
                                              vehicle.id === selectedVehicleId
                                          );
                                        updatedLead.lead_details[
                                          vehicleIndex
                                        ].invoice_no = e.target.value;
                                        setSelectedLead(updatedLead);
                                      }}
                                      placeholder="INV-2025-001"
                                      required
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                      Upload Invoice (Optional)
                                    </label>
                                    <div className="border border-gray-300 rounded p-2">
                                      <input
                                        type="file"
                                        className="w-full text-sm file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:bg-blue-600 file:text-white file:text-sm"
                                        onChange={(e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            // Validate file
                                            if (file.size > 2 * 1024 * 1024) {
                                              alert(
                                                "File size must be less than 2MB"
                                              );
                                              e.target.value = "";
                                              return;
                                            }

                                            const allowedTypes = [
                                              "application/pdf",
                                              "image/jpeg",
                                              "image/jpg",
                                              "image/png",
                                            ];

                                            if (
                                              !allowedTypes.includes(file.type)
                                            ) {
                                              alert(
                                                "Only PDF, JPG, JPEG, and PNG files are allowed"
                                              );
                                              e.target.value = "";
                                              return;
                                            }

                                            const updatedLead = {
                                              ...selectedLead,
                                            };
                                            const vehicleIndex =
                                              updatedLead.lead_details.findIndex(
                                                (vehicle) =>
                                                  vehicle.id ===
                                                  selectedVehicleId
                                              );
                                            updatedLead.lead_details[
                                              vehicleIndex
                                            ].invoice_file = file;
                                            setSelectedLead(updatedLead);
                                          }
                                        }}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                      />
                                    </div>
                                    {v.invoice_file && (
                                      <p className="text-xs text-green-600 mt-2 flex items-center">
                                        <span className="mr-1">✓</span>
                                        {v.invoice_file.name} (
                                        {(v.invoice_file.size / 1024).toFixed(
                                          1
                                        )}
                                        KB)
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      : // Multiple Vehicles Mode
                        selectedLead.lead_details
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
                                className="bg-white rounded-lg border p-4 shadow-sm"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h6 className="font-semibold text-gray-800 text-sm">
                                      {v.brand_name} {v.variant_name}
                                    </h6>
                                    <div className="flex items-center gap-2 text-xs text-gray-600">
                                      <span>{v.color_name}</span>
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

                                <div className="space-y-3">
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
                                          className="border rounded px-2 py-1 text-sm w-20"
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
                                        <div className="flex justify-between font-semibold text-gray-800 text-sm">
                                          <span>Vehicle Total:</span>
                                          <span className="text-green-600">
                                            $
                                            {(
                                              actualPrice * convertedQty
                                            ).toLocaleString()}
                                          </span>
                                        </div>
                                        {convertedQty !== originalQty && (
                                          <p className="text-xs text-gray-500 text-right">
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

                                  {/* Individual Invoice Section for Each Vehicle */}
                                  <div className="mt-3 pt-3 border-t">
                                    <h6 className="font-semibold text-gray-800 text-sm mb-2">
                                      Invoice for this Vehicle
                                    </h6>

                                    <div className="space-y-2">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                          Invoice Number *
                                        </label>
                                        <input
                                          type="text"
                                          className="w-full border border-gray-300 rounded p-2 text-sm"
                                          value={v.invoice_no || ""}
                                          onChange={(e) => {
                                            const updatedLead = {
                                              ...selectedLead,
                                            };
                                            const vehicleIndex =
                                              updatedLead.lead_details.findIndex(
                                                (vehicle) => vehicle.id === v.id
                                              );
                                            updatedLead.lead_details[
                                              vehicleIndex
                                            ].invoice_no = e.target.value;
                                            setSelectedLead(updatedLead);
                                          }}
                                          placeholder="INV-2025-XXX"
                                          required
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                          Upload Invoice (Optional)
                                        </label>
                                        <input
                                          type="file"
                                          className="w-full text-xs border border-gray-300 rounded p-1.5"
                                          onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                              // Validate file
                                              if (file.size > 2 * 1024 * 1024) {
                                                alert(
                                                  "File size must be less than 2MB"
                                                );
                                                e.target.value = "";
                                                return;
                                              }

                                              const allowedTypes = [
                                                "application/pdf",
                                                "image/jpeg",
                                                "image/jpg",
                                                "image/png",
                                              ];

                                              if (
                                                !allowedTypes.includes(
                                                  file.type
                                                )
                                              ) {
                                                alert(
                                                  "Only PDF, JPG, JPEG, and PNG files are allowed"
                                                );
                                                e.target.value = "";
                                                return;
                                              }

                                              const updatedLead = {
                                                ...selectedLead,
                                              };
                                              const vehicleIndex =
                                                updatedLead.lead_details.findIndex(
                                                  (vehicle) =>
                                                    vehicle.id === v.id
                                                );
                                              updatedLead.lead_details[
                                                vehicleIndex
                                              ].invoice_file = file;
                                              setSelectedLead(updatedLead);
                                            }
                                          }}
                                          accept=".pdf,.jpg,.jpeg,.png"
                                        />
                                        {v.invoice_file && (
                                          <p className="text-xs text-green-600 mt-1 flex items-center">
                                            <span className="mr-1">✓</span>
                                            {v.invoice_file.name} (
                                            {(
                                              v.invoice_file.size / 1024
                                            ).toFixed(1)}
                                            KB)
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                  </div>

                  {/* Validation Summary */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h6 className="font-semibold text-gray-800 text-sm mb-2">
                      Validation Summary
                    </h6>
                    <div className="text-sm text-gray-600">
                      {selectedVehicleId ? (
                        <p>
                          Please ensure invoice number is provided for this
                          vehicle.
                        </p>
                      ) : (
                        <>
                          <p className="mb-1">
                            Ensure all vehicles have invoice numbers:
                          </p>
                          <ul className="list-disc pl-5">
                            {selectedLead.lead_details
                              .filter(
                                (v) =>
                                  v.status === "Open" || v.status === "open"
                              )
                              .map((v, idx) => (
                                <li
                                  key={v.id}
                                  className={
                                    !v.invoice_no
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }
                                >
                                  Vehicle {idx + 1}:{" "}
                                  {v.invoice_no
                                    ? "✓ Has invoice"
                                    : "✗ Missing invoice"}
                                </li>
                              ))}
                          </ul>
                        </>
                      )}
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
                    disabled={
                      selectedVehicleId
                        ? !selectedLead.lead_details.find(
                            (v) => v.id === selectedVehicleId
                          )?.invoice_no
                        : selectedLead.lead_details
                            .filter(
                              (v) => v.status === "Open" || v.status === "open"
                            )
                            .some((v) => !v.invoice_no)
                    }
                  >
                    <i className="bi bi-check-circle mr-2"></i>
                    Submit Conversion
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SIMPLIFIED FOLLOW-UP DATE MODAL */}
        {isFollowUpModalOpen && selectedLeadForFollowUp && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002]"
            onClick={() => setIsFollowUpModalOpen(false)}
          >
            <div
              className="bg-white rounded-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center">
                <h5 className="text-base font-medium">Set Follow-up Date</h5>
                <button
                  type="button"
                  className="text-white hover:text-gray-200 text-lg"
                  onClick={() => setIsFollowUpModalOpen(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Customer:{" "}
                    <span className="font-medium">
                      {selectedLeadForFollowUp.customer_name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    Phone: {selectedLeadForFollowUp.phone_no}
                  </p>

                  {/* Follow-up Date */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Follow-up Date *
                    </label>
                    <input
                      type="date"
                      className="w-full border border-secondary-grey rounded p-2.5 text-sm"
                      value={nextFollowUpDate}
                      onChange={(e) => setNextFollowUpDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>

                  {/* Remark/Notes */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Remark / Notes *
                      <span className="text-gray-400 text-xs ml-1">
                        (Required)
                      </span>
                    </label>
                    <textarea
                      className="w-full border border-secondary-grey rounded p-2.5 text-sm"
                      value={followUpRemark}
                      onChange={(e) => setFollowUpRemark(e.target.value)}
                      placeholder="Add remark about this follow-up..."
                      rows="3"
                      maxLength="500"
                      required
                    />
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {followUpRemark.length}/500 characters
                    </div>
                  </div>

                  {/* View History Button */}
                  <button
                    type="button"
                    className="w-full mb-4 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-md border border-purple-200 hover:bg-purple-100 transition-colors flex items-center justify-center"
                    onClick={() => {
                      setIsFollowUpModalOpen(false);
                      loadFollowUpHistory(
                        selectedLeadForFollowUp.id,
                        selectedLeadForFollowUp.customer_name
                      );
                    }}
                  >
                    <i className="bi bi-clock-history mr-2"></i>
                    View Follow-up History
                  </button>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                    onClick={() => {
                      setIsFollowUpModalOpen(false);
                      setSelectedLeadForFollowUp(null);
                      setNextFollowUpDate("");
                      setFollowUpRemark("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-blue rounded-md hover:bg-hover-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSaveFollowUpDate}
                    disabled={!nextFollowUpDate || !followUpRemark.trim()}
                  >
                    Save Follow-up
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* FOLLOW-UP HISTORY MODAL */}
        {showHistoryModal && selectedLeadForFollowUp && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1003]"
            onClick={() => setShowHistoryModal(false)}
          >
            <div
              className="bg-white rounded-lg max-w-3xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center">
                <div>
                  <h5 className="text-base font-medium flex items-center">
                    Follow-up History
                  </h5>
                  <p className="text-xs text-purple-200 mt-1">
                    Customer: {selectedLeadForFollowUp.customer_name}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-white hover:text-gray-200 text-lg"
                  onClick={() => setShowHistoryModal(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="p-4 flex-1 overflow-y-auto">
                {followUpHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-5xl mb-4">
                      <i className="bi bi-calendar-x"></i>
                    </div>
                    <h4 className="text-gray-500 text-lg font-medium mb-2">
                      No Follow-up History
                    </h4>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                      No follow-up records found for this customer. Set the
                      first follow-up date to start tracking.
                    </p>
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-blue rounded-md hover:bg-hover-blue transition-colors"
                      onClick={() => {
                        setShowHistoryModal(false);
                        setIsFollowUpModalOpen(true);
                      }}
                    >
                      <i className="bi bi-calendar-plus mr-2"></i>
                      Set First Follow-up
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Total Follow-ups: {followUpHistory.length}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">
                          Sorted by: Upcoming first
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Sort follow-ups by days remaining (ascending) */}
                      {followUpHistory
                        .slice() // Create a copy to avoid mutating original
                        .sort((a, b) => {
                          const today = new Date();
                          const dateA = new Date(a.follow_up_date);
                          const dateB = new Date(b.follow_up_date);
                          const diffA = dateA - today;
                          const diffB = dateB - today;

                          // Sort by days remaining (ascending)
                          // If both are past dates, show most recent first
                          if (diffA < 0 && diffB < 0) {
                            return dateB - dateA; // Most recent past date first
                          }
                          // If one is past and one is future, future comes first
                          if (diffA < 0) return 1;
                          if (diffB < 0) return -1;
                          // Both are future, sort by soonest first
                          return diffA - diffB;
                        })
                        .map((item, index) => {
                          const today = new Date();
                          const followUpDate = new Date(item.follow_up_date);
                          const diffTime = followUpDate - today;
                          const diffDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24)
                          );
                          const isToday = diffDays === 0;
                          const isPast = diffDays < 0;
                          const isUpcoming = diffDays > 0;

                          return (
                            <div
                              key={item.id}
                              className={`p-4 rounded-lg border ${
                                isToday
                                  ? "bg-yellow-50 border-yellow-200 shadow-sm"
                                  : isPast
                                  ? "bg-red-50 border-red-200"
                                  : index === 0 && isUpcoming
                                  ? "bg-green-50 border-green-200 shadow-sm"
                                  : "bg-white border-gray-200"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                      isToday
                                        ? "bg-yellow-100 text-yellow-600"
                                        : isPast
                                        ? "bg-red-100 text-red-600"
                                        : isUpcoming && index === 0
                                        ? "bg-green-100 text-green-600"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    <i className="bi bi-calendar-check"></i>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-800">
                                      {followUpDate.toLocaleDateString(
                                        "en-US",
                                        {
                                          weekday: "short",
                                          year: "numeric",
                                          month: "short",
                                          day: "numeric",
                                        }
                                      )}
                                    </span>
                                    {isToday && (
                                      <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                                        Today
                                      </span>
                                    )}
                                    {isPast && (
                                      <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                        Overdue
                                      </span>
                                    )}
                                    {isUpcoming && index === 0 && (
                                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                        Upcoming
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {/* <div className="flex items-center">
                                    <i className="bi bi-person-circle mr-1"></i>
                                    {item.executive_name}
                                  </div> */}
                                  <div className="mt-1">
                                    <i className="bi bi-clock mr-1"></i>
                                    {new Date(item.created_at).toLocaleString()}
                                  </div>
                                </div>
                              </div>

                              <div className="ml-11">
                                <div className="bg-white p-3 rounded-lg border border-gray-100">
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {item.follow_up_remark}
                                  </p>
                                </div>

                                <div className="mt-2 flex items-center text-xs text-gray-500">
                                  <i className="bi bi-info-circle mr-1"></i>
                                  <span>
                                    {isToday
                                      ? "Follow-up is today!"
                                      : isPast
                                      ? `Overdue by ${Math.abs(diffDays)} day${
                                          Math.abs(diffDays) !== 1 ? "s" : ""
                                        }`
                                      : `In ${diffDays} day${
                                          diffDays !== 1 ? "s" : ""
                                        }`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    onClick={() => setShowHistoryModal(false)}
                  >
                    Close
                  </button>
                  {followUpHistory.length > 0 && (
                    <button
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
                      onClick={() => {
                        setShowHistoryModal(false);
                        setIsFollowUpModalOpen(true);
                      }}
                    >
                      <i className="bi bi-calendar-plus mr-2"></i>
                      Add New Follow-up
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Add CSS styles */}
        <style>{`
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
          // Add to your existing CSS
          .btn-follow-up {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
          }

          .btn-follow-up:hover {
            background-color: rgba(59, 130, 246, 0.2);
          }

          .btn-history {
            background-color: rgba(147, 51, 234, 0.1);
            color: #8b5cf6;
          }

          .btn-history:hover {
            background-color: rgba(147, 51, 234, 0.2);
          }

          /* Update lead card follow-up display */
          .follow-up-badge {
            background-color: #f3e8ff;
            color: #7c3aed;
            border: 1px solid #ddd6fe;
          }

          .follow-up-badge:hover {
            background-color: #e9d5ff;
          }
          // Add to your existing CSS
          .quick-date-btn {
            transition: all 0.2s ease;
          }

          .quick-date-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .character-counter {
            font-variant-numeric: tabular-nums;
          }

          /* Modal scrollable content */
          .modal-content-scroll {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 #f1f5f9;
          }

          .modal-content-scroll::-webkit-scrollbar {
            width: 6px;
          }

          .modal-content-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
          }

          .modal-content-scroll::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
            border-radius: 3px;
          }
          .action-item {
            cursor: pointer;
          }

          .action-btn {
            /* Your existing button styles */
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            border-radius: 0.25rem;
            transition: all 0.2s ease;
          }

          .action-label {
            color: #666;
            font-weight: 500;
            transition: color 0.2s ease;
          }

          .action-item:hover .action-label {
            color: #333;
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
