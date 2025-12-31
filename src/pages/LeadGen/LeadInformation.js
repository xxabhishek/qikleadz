import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper";
import axios from "axios";
import toast from "react-hot-toast";
// import { useAuth } from "../../contexts/AuthContext";

const LeadInformation = () => {
  // const { user: authUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    variant,
    colors = [],
    colorSelections = {},
    totalQuantity,
    totalPrice,
    galleries,
    brands = [],
    fuelTypes = [],
    ccs = [],
    quantity,
    isAddingAnotherVehicle = false,
    existingVehicles = [],
  } = location.state || {};

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    customerLocation: "",
    customerArea: "",
    purchaseDate: "",
    followUpDate: "",
    quantity: totalQuantity || quantity || 1,
    paymentMode: "cash",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [leadId, setLeadId] = useState(null);
  const [leadDetails, setLeadDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState([]);
  const [storedLeads, setStoredLeads] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [useSameCustomerDetails, setUseSameCustomerDetails] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [locationSearchText, setLocationSearchText] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [dealerAssignedAreas, setDealerAssignedAreas] = useState([]);
  const [loadingDealerAreas, setLoadingDealerAreas] = useState(false);
  const [assignedDealerId, setAssignedDealerId] = useState(null);
  const [assignedDistributorId, setAssignedDistributorId] = useState(null);
  const [assignedDealerName, setAssignedDealerName] = useState("");
  const [assignedDistributorName, setAssignedDistributorName] = useState("");
  const [loadingDealerMapping, setLoadingDealerMapping] = useState(false);
  const [paymentModes, setPaymentModes] = useState([]);
  const [loadingPaymentModes, setLoadingPaymentModes] = useState(false);

  const [allVehiclesForCurrentLead, setAllVehiclesForCurrentLead] = useState(
    []
  );
  const [selectedCityId, setSelectedCityId] = useState(null);

  // Current vehicles from color selections
  const currentVehicles = useMemo(() => {
    return Object.entries(colorSelections)
      .filter(([_, q]) => q > 0)
      .map(([idStr, q]) => {
        const colorId = parseInt(idStr);
        const color = colors.find((c) => c.id === colorId);
        return {
          variant,
          color,
          quantity: q,
          price: color?.price || 0,
          id: `current-${Date.now()}-${colorId}`,
          isCurrent: true,
          subtotal: (color?.price || 0) * q,
        };
      });
  }, [colorSelections, colors, variant]);

  // Calculate total quantity
  const calculateTotalQuantity = useMemo(() => {
    const savedQuantity = allVehiclesForCurrentLead.reduce(
      (total, v) => total + (v.quantity || 1),
      0
    );
    const currentTotal = currentVehicles.reduce(
      (total, v) => total + v.quantity,
      0
    );
    return savedQuantity + currentTotal;
  }, [allVehiclesForCurrentLead, currentVehicles]);

  const API_BASE = "http://localhost:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  // Get current dealer ID
  // const getCurrentDealerId = () => {
  //   const possibleUserDataKeys = [
  //     "userData",
  //     "user",
  //     "currentUser",
  //     "authUser",
  //     "userInfo",
  //   ];
  //   for (const key of possibleUserDataKeys) {
  //     const storedData = localStorage.getItem(key);
  //     if (storedData) {
  //       try {
  //         const user = JSON.parse(storedData);
  //         if (user.id) return user.id;
  //         if (user.user_id) return user.user_id;
  //         if (user.dealer_id) return user.dealer_id;
  //       } catch (err) {}
  //     }
  //   }
  //   return null;
  // };


  
  const getCurrentDealerId = () => {
    const keys = ["userData", "user", "currentUser", "authUser", "userInfo"];

    for (const key of keys) {
      const storedData = localStorage.getItem(key);
      if (!storedData) continue;

      try {
        const data = JSON.parse(storedData);

        // Case 1: direct user object
        if (data?.id) return Number(data.id);
        if (data?.user_id) return Number(data.user_id);
        if (data?.dealer_id) return Number(data.dealer_id);

        // 🔥 Case 2: API response stored
        if (data?.user?.id) return Number(data.user.id);
        if (data?.user?.user_id) return Number(data.user.user_id);
        if (data?.user?.dealer_id) return Number(data.user.dealer_id);
      } catch (e) {
        console.warn("Invalid JSON in localStorage key:", key);
      }
    }

    return null;
  };

  // Get vehicle image
  const getVehicleImage = (vehicleVariant, color = null) => {
    if (!vehicleVariant || !galleries) return null;

    let gallery;
    if (color && color.id) {
      gallery = galleries.find(
        (g) => g.variant_id === vehicleVariant.id && g.color_id === color.id
      );
    }

    if (!gallery) {
      gallery = galleries.find((g) => g.variant_id === vehicleVariant.id);
    }

    if (gallery) {
      if (gallery.cover_photo_urls && gallery.cover_photo_urls.length > 0) {
        return gallery.cover_photo_urls[0];
      }
      if (gallery.first_image) {
        return gallery.first_image;
      }
    }

    return null;
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://via.placeholder.com/100x100/f3f4f6/6b7280?text=No+Image";
    }

    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    const baseUrl = API_BASE.replace("/api", "");
    const possiblePaths = [
      `${baseUrl}/storage/galleries/${imagePath}`,
      `${baseUrl}/storage/coverphotos/${imagePath}`,
      `${baseUrl}/uploads/coverPhotos/${imagePath}`,
      `${baseUrl}/uploads/galleries/${imagePath}`,
    ];

    return possiblePaths[0];
  };

  // Get vehicle price
  const getVehiclePrice = (vehicleVariant, vehicleColor = null) => {
    if (!vehicleVariant) return 0;
    if (vehicleColor && vehicleColor.price) {
      return parseFloat(vehicleColor.price);
    }
    const price =
      vehicleVariant.basic_price ||
      vehicleVariant.price ||
      vehicleVariant.ex_showroom_price ||
      vehicleVariant.on_road_price ||
      0;
    return parseFloat(price) || 0;
  };

  // Handle vehicle quantity change
  const handleVehicleQuantityChange = (vehicleId, newQuantity) => {
    const quantity = Math.max(1, newQuantity);

    const updatedVehicles = allVehiclesForCurrentLead.map((v) => {
      if (v.id === vehicleId) {
        const vehiclePrice =
          v.price || getVehiclePrice(v.variant, v.color) || 0;
        return {
          ...v,
          quantity,
          subtotal: vehiclePrice * quantity,
        };
      }
      return v;
    });

    setAllVehiclesForCurrentLead(updatedVehicles);
    localStorage.setItem(
      "allVehiclesForCurrentLead",
      JSON.stringify(updatedVehicles)
    );

    // Update form quantity
    const totalQty = updatedVehicles.reduce(
      (total, v) => total + (v.quantity || 1),
      0
    );
    setFormData((prev) => ({ ...prev, quantity: totalQty }));

    toast.success(`Quantity updated to ${quantity}`);
  };

  // Updated renderVehicleCard function
  const renderVehicleCard = (vehicle, index) => {
    if (!vehicle || !vehicle.variant) return null;

    const color = vehicle.color;
    const vehicleVariant = vehicle.variant;
    const basicPrice = getVehiclePrice(vehicleVariant, color);
    const vehicleQuantity = vehicle.quantity || 1;
    const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;
    const vehicleImage = getVehicleImage(vehicleVariant, color);

    // Find brand name
    const brand = brands.find((b) => b.id === vehicleVariant.brand_id);
    const brandName = brand ? brand.name : "Unknown Brand";

    return (
      <div
        key={`${vehicle.id || index}-${
          vehicle.isCurrent ? "current" : "saved"
        }`}
        className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-all ${
          vehicle.isCurrent ? "border-blue-500 border-2" : "border-gray-200"
        }`}
      >
        <div className="flex items-start justify-between">
          {/* Vehicle Image */}
          {vehicleImage && (
            <div className="flex-shrink-0 mr-4 relative">
              <img
                src={getFullImageUrl(vehicleImage)}
                alt={vehicleVariant.name}
                className="w-20 h-20 object-cover rounded-md border"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
                }}
              />
              <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {vehicleQuantity}
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            {/* Vehicle Header */}
            <div className="flex justify-between items-start mb-2">
              {/* <div>
                <h4 className="font-semibold text-gray-800 text-sm truncate">
                  {vehicle.isCurrent
                    ? "Current Selection"
                    : `Vehicle ${index + 1}`}
                </h4>
                {vehicle.isCurrent && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                    New
                  </span>
                )}
              </div> */}
            </div>

            {/* Vehicle Details */}
            <div className="space-y-2 text-xs">
              {/* Brand and Variant */}
              <div className="flex items-center gap-2">
                <span className="font-medium">Brand:</span>
                <span className="text-gray-600">{brandName}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-medium">Variant:</span>
                <span className="text-gray-600">{vehicleVariant.name}</span>
              </div>

              {/* Color Display */}
              {color && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Color:</span>
                  <div className="flex items-center gap-1">
                    <span
                      className="w-4 h-4 rounded-full border border-gray-400 shadow"
                      style={{ backgroundColor: color.color_code || "#cccccc" }}
                      title={color.name}
                    ></span>
                    <span className="text-xs text-gray-600">{color.name}</span>
                  </div>
                </div>
              )}

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mt-3">
                <span className="font-medium text-gray-600">Quantity:</span>
                <div className="flex items-center">
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    {/* Decrease button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (vehicleQuantity <= 1) return;
                        handleVehicleQuantityChange(
                          vehicle.id,
                          vehicleQuantity - 1
                        );
                      }}
                      disabled={vehicleQuantity <= 1}
                      className="bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-lg font-bold">-</span>
                    </button>

                    {/* Quantity display */}
                    <span className="w-12 h-8 text-center border-x border-gray-300 text-sm font-medium flex items-center justify-center bg-white">
                      {vehicleQuantity}
                    </span>

                    {/* Increase button */}
                    <button
                      type="button"
                      onClick={() => {
                        handleVehicleQuantityChange(
                          vehicle.id,
                          vehicleQuantity + 1
                        );
                      }}
                      className="bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center transition-colors"
                    >
                      <span className="text-lg font-bold">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Display */}
              {basicPrice > 0 && (
                <div className="space-y-1 mt-3 pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">
                      Unit Price:
                    </span>
                    <span className="text-green-600 font-semibold text-sm">
                      ₹{parseFloat(basicPrice).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">
                      Total Price:
                    </span>
                    <div className="text-right">
                      <p className="text-green-700 font-bold text-sm">
                        ₹{totalBasicPrice.toLocaleString("en-IN")}
                      </p>
                      {vehicleQuantity > 1 && (
                        <p className="text-green-600 text-xs">
                          (₹{parseFloat(basicPrice).toLocaleString("en-IN")} ×{" "}
                          {vehicleQuantity})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Remove button for saved vehicles */}
        {!vehicle.isCurrent && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                const updatedVehicles = allVehiclesForCurrentLead.filter(
                  (v) => v.id !== vehicle.id
                );
                setAllVehiclesForCurrentLead(updatedVehicles);
                localStorage.setItem(
                  "allVehiclesForCurrentLead",
                  JSON.stringify(updatedVehicles)
                );

                // Update form quantity
                const totalQty = updatedVehicles.reduce(
                  (total, v) => total + (v.quantity || 1),
                  0
                );
                setFormData((prev) => ({ ...prev, quantity: totalQty }));

                toast.success("Vehicle removed");
              }}
              className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Remove Vehicle
            </button>
          </div>
        )}
      </div>
    );
  };

  // Validation functions
  const validateCustomerName = (value) => {
    if (!value?.trim()) return "Customer name is required.";
    if (/\d/.test(value)) return "Customer name should not contain numbers.";
    return "";
  };

  const validatePhoneNumber = (value) => {
    const trimmed = value?.toString().trim() || "";
    if (!trimmed) return "Phone number is required.";
    if (!/^\d+$/.test(trimmed))
      return "Phone number should contain only digits.";
    if (trimmed.length !== 10) return "Phone number must be exactly 10 digits.";
    return "";
  };

  const validateCustomerLocation = (value) => {
    if (!value?.trim()) return "Location is required.";
    return "";
  };

  const validateCustomerArea = (value) => {
    if (!value?.trim()) return "Area is required.";
    return "";
  };

  const validatePurchaseDate = (value) => {
    if (!value) return "Purchase date is required.";
    const today = new Date().toISOString().split("T")[0];
    if (value < today) return "Purchase date cannot be in the past.";
    return "";
  };

  const validatePaymentMode = (value) => {
    if (!value) return "Payment mode is required.";
    return "";
  };

  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "customerName":
        error = validateCustomerName(value);
        break;
      case "phoneNumber":
        error = validatePhoneNumber(value);
        break;
      case "customerLocation":
        error = validateCustomerLocation(value);
        break;
      case "customerArea":
        error = validateCustomerArea(value);
        break;
      case "purchaseDate":
        error = validatePurchaseDate(value);
        break;
      case "paymentMode":
        error = validatePaymentMode(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  // Validation for Add Vehicle
  const validateForAddVehicle = () => {
    const newErrors = {};
    let hasErrors = false;

    const essentialFields = [
      "customerName",
      "phoneNumber",
      "customerLocation",
      "customerArea",
      "purchaseDate",
      "paymentMode",
    ];

    essentialFields.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    const totalQty = calculateTotalQuantity;
    if (totalQty < 1) {
      setErrorMessage("Total quantity must be at least 1.");
      hasErrors = true;
    }

    if (hasErrors) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return !hasErrors;
  };

  // Full validation for Submit/Save Draft
  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;

    const fieldsToValidate = [
      "customerName",
      "phoneNumber",
      "customerLocation",
      "customerArea",
      "purchaseDate",
      "paymentMode",
    ];

    fieldsToValidate.forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    const totalQty = calculateTotalQuantity;
    if (totalQty < 1) {
      setErrorMessage("Total quantity must be at least 1.");
      hasErrors = true;
    }

    if (!assignedDealerId) {
      setErrorMessage(
        "No dealer assigned for the selected area. Please contact administrator."
      );
      hasErrors = true;
    }

    if (hasErrors) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return !hasErrors;
  };

  // Handle Add Another Vehicle
  const addNewVehicle = () => {
    if (!validateForAddVehicle()) {
      toast.error(
        "Please fill in all required fields before adding another vehicle"
      );
      return;
    }

    const selectedArea = dealerAssignedAreas.find(
      (area) => area.name === formData.customerArea?.trim()
    );

    if (!selectedArea || !selectedCityId) {
      toast.error("Please select valid area and city");
      return;
    }

    // Prepare customer data to save
    const customerDataToSave = {
      ...formData,
      timestamp: new Date().getTime(),
      leadId: leadId,
      city_id: selectedCityId,
      area_id: selectedArea.id,
      dealer_id: assignedDealerId,
      distributor_id: assignedDistributorId,
      dealer_name: assignedDealerName,
      distributor_name: assignedDistributorName,
      existingVehicles: [...allVehiclesForCurrentLead, ...currentVehicles],
      isAddingAnotherVehicle: true,
    };

    // Save to localStorage
    localStorage.setItem(
      "existingCustomerData",
      JSON.stringify(customerDataToSave)
    );

    // Save all vehicles
    const allVehiclesToSave = [
      ...allVehiclesForCurrentLead,
      ...currentVehicles,
    ];
    localStorage.setItem(
      "allVehiclesForCurrentLead",
      JSON.stringify(allVehiclesToSave)
    );

    if (leadId) {
      localStorage.setItem("leadId", leadId);
    }

    toast.success("Adding Another Vehicle.");

    navigate("/leads/generate", {
      state: {
        isAddingAnotherVehicle: true,
        customerData: formData,
        existingVehicles: allVehiclesToSave,
        lockCustomerDetails: true,
        leadId: leadId,
        assignedDealerId: assignedDealerId,
        assignedDistributorId: assignedDistributorId,
      },
    });
  };

  // Handle form submit

  console.log(
    "Logged in user id from localStorage:",
    localStorage.getItem("user_id")
  );
  console.log("getCurrentDealerId():", getCurrentDealerId());

  // const handleSubmit = async () => {
  //   if (!validateForm()) return;

  //   // Define allVehiclesToSave FIRST
  //   const allVehiclesToSave = [
  //     ...allVehiclesForCurrentLead,
  //     ...currentVehicles,
  //   ];

  //   if (allVehiclesToSave.length === 0) {
  //     setErrorMessage("No vehicles selected.");
  //     return;
  //   }

  //   // Define mainVehicle SECOND
  //   const mainVehicle = allVehiclesToSave[0];

  //   if (!mainVehicle) {
  //     setErrorMessage("No vehicles selected.");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setErrorMessage(null);

  //   try {
  //     const selectedArea = dealerAssignedAreas.find(
  //       (area) => area.name === formData.customerArea?.trim()
  //     );

  //     if (!selectedArea || !selectedCityId) {
  //       throw new Error("Please select valid area and city.");
  //     }

  //     const finalLocation = formData.customerArea
  //       ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
  //       : formData.customerLocation.trim();

  //     const currentUserId = getCurrentDealerId();

  //     // Now you can use mainVehicle and allVehiclesToSave here
  //     const payload = {
  //       customer_name: formData.customerName.trim(),
  //       phone_no: formData.phoneNumber.trim(),
  //       location: finalLocation,
  //       area: formData.customerArea?.trim() || null,
  //       city_id: selectedCityId,
  //       area_id: selectedArea.id,
  //       executive_id: currentUserId,
  //       // Remove this if using Laravel auth: executive_id: authUser?.id || localStorage.getItem("user_id"),
  //       tentative_purchase_date: formData.purchaseDate || null,
  //       follow_up_date: formData.followUpDate || null,
  //       vehicle_qty: calculateTotalQuantity,
  //       payment_mode: formData.paymentMode,
  //       additional_note: formData.notes?.trim() || null,
  //       brand_id: mainVehicle.variant
  //         ? parseInt(mainVehicle.variant.brand_id, 10)
  //         : null,
  //       variant_id: mainVehicle.variant
  //         ? parseInt(mainVehicle.variant.id, 10)
  //         : null,
  //       lead_id: leadId || null,
  //       status: "Open",
  //       color_id: mainVehicle.color?.id || null,
  //       color_name: mainVehicle.color?.name || null,
  //       color_code: mainVehicle.color?.color_code || null,
  //       dealer_id: assignedDealerId,
  //       distributor_id: assignedDistributorId,
  //       vehicles: allVehiclesToSave.map((v) => ({
  //         brand_id: parseInt(v.variant.brand_id, 10),
  //         variant_id: parseInt(v.variant.id, 10),
  //         color_id: v.color?.id || null,
  //         quantity: v.quantity || 1,
  //       })),
  //     };

  //     const { data } = await axios.post(`${API_BASE}/leads`, payload, {
  //       headers: getAuthHeaders(),
  //     });

  //     if (data?.success) {
  //       const newLeadId = data.lead_id || data.lead?.id;
  //       const successMessage = assignedDealerId
  //         ? `Lead #${newLeadId} created successfully! Dealer: ${assignedDealerName}`
  //         : `Lead #${newLeadId} created successfully!`;

  //       toast.success(successMessage);

  //       // Clear localStorage
  //       clearLocalStorage();

  //       // Reset state
  //       resetFormState();

  //       navigate("/leads/open", {
  //         state: {
  //           recentLead: data.lead,
  //           submittedVariant: mainVehicle.variant,
  //           submittedLeadId: newLeadId,
  //           submittedColor: mainVehicle.color,
  //           assignedDealer: assignedDealerId,
  //           assignedDistributor: assignedDistributorId,
  //         },
  //       });
  //     }
  //   } catch (err) {
  //     const msg =
  //       err.response?.data?.message || err.message || "Submission failed.";
  //     setErrorMessage(msg);
  //     toast.error(msg);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const allVehiclesToSave = [
      ...allVehiclesForCurrentLead,
      ...currentVehicles,
    ];

    if (allVehiclesToSave.length === 0) {
      setErrorMessage("No vehicles selected.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const selectedArea = dealerAssignedAreas.find(
        (area) => area.name === formData.customerArea?.trim()
      );

      if (!selectedArea || !selectedCityId) {
        throw new Error("Please select valid area and city.");
      }

      // Get authenticated user ID from Laravel session
      // Laravel should handle auth via the Bearer token

      const payload = {
        customer_name: formData.customerName.trim(),
        phone_no: formData.phoneNumber.trim(),
        location: formData.customerLocation.trim(),
        area: formData.customerArea?.trim() || null,
        city_id: selectedCityId,
        area_id: selectedArea.id,
        // executive_id will come from auth() in Laravel
        tentative_purchase_date: formData.purchaseDate || null,
        follow_up_date: formData.followUpDate || null,
        vehicle_qty: calculateTotalQuantity,
        payment_mode: formData.paymentMode,
        additional_note: formData.notes?.trim() || null,
        lead_id: leadId || null,
        status: "Open", // Change to "Draft" for draft
        dealer_id: assignedDealerId,
        distributor_id: assignedDistributorId,
        vehicles: allVehiclesToSave.map((v) => ({
          brand_id: parseInt(v.variant.brand_id, 10),
          variant_id: parseInt(v.variant.id, 10),
          color_id: v.color?.id || null,
          quantity: v.quantity || 1,
        })),
      };

      console.log("Submitting payload:", payload); // Debug log

      const { data } = await axios.post(`${API_BASE}/leads`, payload, {
        headers: getAuthHeaders(),
      });

      if (data?.success) {
        const newLeadId = data.lead_id || data.lead?.id;
        toast.success(`Lead #${newLeadId} created successfully!`);

        // Clear localStorage
        localStorage.removeItem("allVehiclesForCurrentLead");
        localStorage.removeItem("existingCustomerData");
        localStorage.removeItem("leadId");

        // Reset form
        resetFormState();

        navigate("/leads/open", {
          state: {
            recentLead: data.lead,
            submittedLeadId: newLeadId,
          },
        });
      }
    } catch (err) {
      console.error("Submission error:", err.response || err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.debug?.error ||
        err.message ||
        "Submission failed.";

      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle save draft
  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    const selectedArea = dealerAssignedAreas.find(
      (area) => area.name === formData.customerArea
    );

    if (!selectedArea || !selectedCityId) {
      setErrorMessage("Please select valid area and city.");
      return;
    }

    const finalLocation = formData.customerArea
      ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
      : formData.customerLocation.trim();

    const currentUserId = getCurrentDealerId();
    const allVehiclesToSave = [
      ...allVehiclesForCurrentLead,
      ...currentVehicles,
    ];

    if (allVehiclesToSave.length === 0) {
      setErrorMessage("No vehicles to save.");
      return;
    }

    const mainVehicle = allVehiclesToSave[0];
    if (!mainVehicle) {
      setErrorMessage("No vehicles to save.");
      return;
    }

    const payload = {
      customer_name: formData.customerName.trim(),
      phone_no: formData.phoneNumber.trim(),
      location: finalLocation || null,
      area: formData.customerArea?.trim() || null,
      city_id: selectedCityId,
      area_id: selectedArea.id,
      executive_id: currentUserId,
      tentative_purchase_date: formData.purchaseDate || null,
      follow_up_date: formData.followUpDate || null,
      vehicle_qty: calculateTotalQuantity,
      payment_mode: formData.paymentMode,
      additional_note: formData.notes?.trim() || null,
      brand_id: mainVehicle.variant
        ? parseInt(mainVehicle.variant.brand_id, 10)
        : null,
      variant_id: mainVehicle.variant
        ? parseInt(mainVehicle.variant.id, 10)
        : null,
      lead_id: leadId || null,
      status: "Draft",
      color_id: mainVehicle.color?.id || null,
      color_name: mainVehicle.color?.name || null,
      color_code: mainVehicle.color?.color_code || null,
      dealer_id: assignedDealerId,
      distributor_id: assignedDistributorId,
      vehicles: allVehiclesToSave.map((v) => ({
        brand_id: parseInt(v.variant.brand_id, 10),
        variant_id: parseInt(v.variant.id, 10),
        color_id: v.color?.id || null,
        quantity: v.quantity || 1,
      })),
    };

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const { data } = await axios.post(`${API_BASE}/leads`, payload, {
        headers: getAuthHeaders(),
      });

      if (data?.success || data?.lead?.id) {
        const newLeadId = data.lead_id || data.lead?.id;

        clearLocalStorage();
        resetFormState();

        toast.success(`Draft saved successfully! Lead #${newLeadId}`);
        navigate("/dashboard", {
          state: {
            draftSaved: true,
            leadId: newLeadId,
          },
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Draft save failed.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear localStorage
  const clearLocalStorage = () => {
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    const itemsToClear = [
      "leadId",
      "allVehiclesForCurrentLead",
      "existingCustomerData",
      "recentSubmittedLead",
      "draftLead",
      "customerFormData",
    ];

    itemsToClear.forEach((item) => localStorage.removeItem(item));

    if (authToken) localStorage.setItem("authToken", authToken);
    if (userData) localStorage.setItem("userData", userData);
  };

  // Reset form state
  const resetFormState = () => {
    setFormData({
      customerName: "",
      phoneNumber: "",
      customerLocation: "",
      customerArea: "",
      purchaseDate: "",
      followUpDate: "",
      quantity: 1,
      paymentMode: "cash",
      notes: "",
    });
    setErrors({});
    setAllVehiclesForCurrentLead([]);
    setLeadId(null);
    setSelectedCityId(null);
    setSelectedAreaId(null);
    setLocationSearchText("");
    setAssignedDealerId(null);
    setAssignedDistributorId(null);
    setAssignedDealerName("");
    setAssignedDistributorName("");
    setErrorMessage(null);
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
      }
    } catch (err) {
      console.error("Error fetching payment modes:", err);
      setPaymentModes([]);
    } finally {
      setLoadingPaymentModes(false);
    }
  };

  // Fetch dealer mapping
  const fetchDealerDistributorMapping = async (areaId, cityId) => {
    if (!areaId || !cityId) return;

    try {
      setLoadingDealerMapping(true);
      const response = await axios.get(
        `${API_BASE}/dealer/distributor-mapping`,
        {
          headers: getAuthHeaders(),
          params: { area_id: areaId, city_id: cityId },
        }
      );
      if (response.data.success) {
        setAssignedDealerId(response.data.dealer_id);
        setAssignedDistributorId(response.data.distributor_id);
        setAssignedDealerName(response.data.dealer_name);
        setAssignedDistributorName(response.data.distributor_name);
      }
    } catch (error) {
      console.error("Error fetching dealer mapping:", error);
    } finally {
      setLoadingDealerMapping(false);
    }
  };

  // Fetch locations
  const fetchLocations = async (searchText) => {
    if (!searchText || searchText.trim().length < 2) {
      setLocations([]);
      setShowLocationDropdown(false);
      return;
    }

    try {
      setLoadingLocations(true);
      const response = await axios.get(`${API_BASE}/locations/search`, {
        headers: getAuthHeaders(),
        params: { search: searchText.trim() },
      });
      if (response.data.success) {
        setLocations(response.data.data);
        setShowLocationDropdown(response.data.data.length > 0);
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
    } finally {
      setLoadingLocations(false);
    }
  };

  // Fetch areas for city
  const fetchAreasForCity = async (cityId, cityName) => {
    if (!cityId) {
      setDealerAssignedAreas([]);
      setShowAreaDropdown(false);
      return;
    }

    try {
      setLoadingDealerAreas(true);
      const dealerId = getCurrentDealerId();
      const response = await axios.get(
        `${API_BASE}/areas/dealer-areas/${cityId}`,
        {
          headers: getAuthHeaders(),
          params: { dealer_id: dealerId },
        }
      );
      if (response.data.success) {
        setDealerAssignedAreas(response.data.data);
        setShowAreaDropdown(response.data.data.length > 0);
      }
    } catch (err) {
      console.error("Error fetching areas:", err);
    } finally {
      setLoadingDealerAreas(false);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    const { id, name, value } = e.target;
    const field = id || name;

    if (
      isAddingAnotherVehicle &&
      field !== "purchaseDate" &&
      field !== "followUpDate"
    ) {
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  // Handle location search
  const handleLocationSearchChange = (e) => {
    const value = e.target.value;
    setLocationSearchText(value);
    setFormData((prev) => ({ ...prev, customerLocation: value }));
    validateField("customerLocation", value);

    if (value.trim().length >= 2) {
      setShowLocationDropdown(true);
      fetchLocations(value);
    } else {
      setShowLocationDropdown(false);
      setLocations([]);
    }
  };

  // Handle location select
  const handleLocationSelect = (location) => {
    const value = location.city_name || location.name;
    setFormData((prev) => ({
      ...prev,
      customerLocation: value,
      customerArea: "",
    }));
    setLocationSearchText(value);
    setSelectedCityId(location.id);
    setShowLocationDropdown(false);
    setLocations([]);
    validateField("customerLocation", value);

    setAssignedDealerId(null);
    setAssignedDistributorId(null);
    setAssignedDealerName("");
    setAssignedDistributorName("");

    fetchAreasForCity(location.id, value);
  };

  // Handle area select
  const handleAreaSelect = (area) => {
    const value = area.name;
    setFormData((prev) => ({ ...prev, customerArea: value }));
    setSelectedAreaId(area.id);
    setShowAreaDropdown(false);
    validateField("customerArea", value);

    if (area.id && selectedCityId) {
      fetchDealerDistributorMapping(area.id, selectedCityId);
    }
  };

  // Handle payment mode change
  const handlePaymentModeChange = (modeName) => {
    setFormData((prev) => ({ ...prev, paymentMode: modeName }));
    validateField("paymentMode", modeName);
  };

  // Get input class
  const getInputClass = (field) => {
    const hasError = errors[field];
    return `w-full border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
        : "border-gray-300 focus:border-blue-500"
    } ${
      isAddingAnotherVehicle &&
      field !== "purchaseDate" &&
      field !== "followUpDate"
        ? "bg-gray-100 cursor-not-allowed"
        : ""
    }`;
  };

  // Quantity summary
  const renderQuantitySummary = () => {
    const savedCount = allVehiclesForCurrentLead.reduce(
      (total, v) => total + (v.quantity || 1),
      0
    );
    const currentTotal = currentVehicles.reduce(
      (total, v) => total + v.quantity,
      0
    );
    const grandTotal = calculateTotalQuantity;

    return (
      <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">
              Vehicle Quantity Summary
            </h4>
            <div className="text-sm text-gray-600">
              <p>
                • Saved Vehicles:{" "}
                <span className="font-medium">{savedCount} quantity(s)</span>
              </p>
              <p>
                • Current Selection:{" "}
                <span className="font-medium">{currentTotal} quantity(s)</span>
              </p>
              {isAddingAnotherVehicle && (
                <p className="text-blue-600 text-xs mt-1">
                  Customer details locked (adding another vehicle)
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-700">
              {grandTotal}{" "}
              <span className="text-sm font-normal">Total Quantity</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              All vehicles active
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Load data on mount
  useEffect(() => {
    const loadSavedCustomerData = () => {
      try {
        const savedData = localStorage.getItem("existingCustomerData");
        if (savedData) {
          const customerData = JSON.parse(savedData);
          const isRecent =
            new Date().getTime() - (customerData.timestamp || 0) <
            30 * 60 * 1000;

          if (isRecent) {
            let formattedDate = "";
            if (customerData.purchaseDate) {
              if (/^\d{4}-\d{2}-\d{2}$/.test(customerData.purchaseDate)) {
                formattedDate = customerData.purchaseDate;
              } else {
                const date = new Date(customerData.purchaseDate);
                if (!isNaN(date.getTime())) {
                  formattedDate = date.toISOString().split("T")[0];
                }
              }
            }

            const newFormData = {
              customerName: customerData.customerName || "",
              phoneNumber: customerData.phoneNumber || "",
              customerLocation: customerData.customerLocation || "",
              customerArea: customerData.customerArea || "",
              purchaseDate: formattedDate,
              paymentMode: customerData.paymentMode || "cash",
              quantity: customerData.quantity || 1,
              notes: customerData.notes || "",
            };

            setFormData(newFormData);
            setLocationSearchText(customerData.customerLocation || "");

            if (customerData.city_id) setSelectedCityId(customerData.city_id);
            if (customerData.area_id) setSelectedAreaId(customerData.area_id);

            if (customerData.dealer_id) {
              setAssignedDealerId(customerData.dealer_id);
              setAssignedDistributorId(customerData.distributor_id);
              setAssignedDealerName(customerData.dealer_name || "");
              setAssignedDistributorName(customerData.distributor_name || "");
            }

            if (customerData.leadId) {
              setLeadId(customerData.leadId);
            }
          }
        }
      } catch (err) {
        console.error("Error loading saved customer data:", err);
      }
    };

    const loadSavedVehicles = () => {
      try {
        const savedVehicles = localStorage.getItem("allVehiclesForCurrentLead");
        if (savedVehicles) {
          const parsedVehicles = JSON.parse(savedVehicles);
          if (Array.isArray(parsedVehicles) && parsedVehicles.length > 0) {
            setAllVehiclesForCurrentLead(parsedVehicles);
          }
        }
      } catch (err) {
        console.error("Error loading saved vehicles:", err);
      }
    };

    loadSavedCustomerData();
    loadSavedVehicles();
    fetchPaymentModes();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".location-search-container"))
        setShowLocationDropdown(false);
      if (!event.target.closest(".area-select-container"))
        setShowAreaDropdown(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="m-4">
      <Stepper step={3} />

      <div className="page-header flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-primary-blue">
          New Lead Information
        </h3>
      </div>

      {errorMessage && (
        <p className="text-red-600 font-semibold mb-4 text-sm">
          {errorMessage}
        </p>
      )}

      {renderQuantitySummary()}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 transition-colors flex items-center"
          >
            <i className="bi bi-arrow-left mr-2"></i> Back
          </button>
        </div>

        {/* Vehicle Summary Card */}
        <div className="vehicle-summary-card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-primary-blue text-xl font-semibold">
              Selected Vehicle(s)
            </h4>
            <button
              className="add-vehicle-header-btn bg-primary-blue text-white rounded-md px-4 py-2 text-sm hover:bg-hover-blue transition-colors flex items-center"
              onClick={addNewVehicle}
            >
              <i className="bi bi-plus-circle mr-2"></i> Add Vehicle
            </button>
          </div>

          {/* Vehicle Cards */}
          <div className="space-y-3">
            {[...allVehiclesForCurrentLead, ...currentVehicles].map(
              (vehicle, index) => renderVehicleCard(vehicle, index)
            )}
          </div>
        </div>

        {/* Form Grid */}
        <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Customer Name */}
            <div>
              <label
                htmlFor="customerName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                className={getInputClass("customerName")}
                required
                disabled={isAddingAnotherVehicle}
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerName}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={getInputClass("phoneNumber")}
                required
                disabled={isAddingAnotherVehicle}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* Location Search */}
            {/* Location Search Section - FIXED */}
            <div className="relative location-search-container">
              <label
                htmlFor="customerLocation"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location (City) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="customerLocation"
                  value={locationSearchText}
                  onChange={handleLocationSearchChange}
                  onFocus={() => {
                    if (locationSearchText.length >= 2) {
                      fetchLocations(locationSearchText);
                      setShowLocationDropdown(true);
                    }
                  }}
                  placeholder="Type city name (e.g., Pune, Mumbai)"
                  className={`w-full border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${
                    errors.customerLocation
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:border-blue-500"
                  } ${
                    isAddingAnotherVehicle
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  } pr-10`}
                  required
                  autoComplete="off"
                  // disabled={isAddingAnotherVehicle}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {loadingLocations ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <i className="bi bi-chevron-down text-gray-400"></i>
                  )}
                </div>
              </div>
              {errors.customerLocation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerLocation}
                </p>
              )}

              {showLocationDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {loadingLocations ? (
                    <div className="px-4 py-3 text-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-500 text-xs mt-2">
                        Searching locations...
                      </p>
                    </div>
                  ) : locations.length > 0 ? (
                    locations.map((location) => (
                      <div
                        key={location.id}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <div className="font-medium text-gray-800 text-sm">
                          {location.city_name || location.name}
                        </div>
                        {location.state_name && (
                          <div className="text-xs text-gray-500 mt-1">
                            {location.state_name}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center text-sm">
                      {locationSearchText.length >= 2
                        ? "No locations found. Try different keywords."
                        : "Type at least 2 characters to search"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Area and Dealer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Area */}
              <div className="relative area-select-container">
                <label
                  htmlFor="customerArea"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Area <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="customerArea"
                    value={formData.customerArea}
                    onChange={handleChange}
                    onClick={() =>
                      formData.customerLocation &&
                      setShowAreaDropdown(!showAreaDropdown)
                    }
                    placeholder="Select area"
                    className={`${getInputClass(
                      "customerArea"
                    )} pr-10 cursor-pointer`}
                    readOnly
                    disabled={
                      !formData.customerLocation || isAddingAnotherVehicle
                    }
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {loadingDealerAreas ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <i className="bi bi-chevron-down text-gray-400"></i>
                    )}
                  </div>
                </div>
                {errors.customerArea && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.customerArea}
                  </p>
                )}

                {showAreaDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {dealerAssignedAreas.length > 0 ? (
                      <>
                        <div className="px-3 py-2 text-xs bg-blue-50 border-b">
                          <div className="font-medium text-blue-700">
                            {getCurrentDealerId()
                              ? "Your Assigned Areas"
                              : "All Areas"}{" "}
                            for {formData.customerLocation}
                          </div>
                        </div>
                        {dealerAssignedAreas.map((area) => (
                          <div
                            key={area.id}
                            className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            onClick={() => handleAreaSelect(area)}
                          >
                            <div className="font-medium text-gray-800 text-sm">
                              {area.name}
                            </div>
                            {area.city_name && (
                              <div className="text-xs text-gray-500 mt-1">
                                {area.city_name}
                                {area.state_name && `, ${area.state_name}`}
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-center text-sm">
                        {formData.customerLocation
                          ? "No areas found for this location"
                          : "Select a location first"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Dealer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dealer(s)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={assignedDealerName || "No dealer assigned"}
                    readOnly
                    className={`w-full border p-2.5 rounded-lg text-sm ${
                      assignedDealerId
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                    }`}
                  />
                  {loadingDealerMapping && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {assignedDealerId && !loadingDealerMapping && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <i className="bi bi-check-circle text-green-500"></i>
                    </div>
                  )}
                </div>
                {assignedDistributorId && (
                  <div className="mt-1 text-xs text-gray-600">
                    Distributor: {assignedDistributorName}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Purchase Date */}
            <div>
              <label
                htmlFor="purchaseDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tentative Purchase Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className={getInputClass("purchaseDate")}
                min={new Date().toISOString().split("T")[0]}
                required
              />
              {errors.purchaseDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.purchaseDate}
                </p>
              )}
            </div>

            {/* Follow-up Date */}
            <div>
              <label
                htmlFor="followUpDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Follow-up Date
              </label>
              <input
                type="date"
                id="followUpDate"
                name="followUpDate"
                value={formData.followUpDate}
                onChange={handleChange}
                className={getInputClass("followUpDate")}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Payment Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              {loadingPaymentModes ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="payment-radio-group grid grid-cols-2 sm:flex sm:gap-2 gap-3">
                  {paymentModes.map((mode) => (
                    <div
                      key={mode.id}
                      className={`payment-option flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                        formData.paymentMode === mode.name
                          ? "border-primary-blue bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      } ${
                        isAddingAnotherVehicle
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        !isAddingAnotherVehicle &&
                        handlePaymentModeChange(mode.name)
                      }
                    >
                      <i
                        className={`bi bi-${
                          mode.name === "cash" ? "currency-dollar" : "bank"
                        } text-lg ${
                          mode.name === "cash"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      ></i>
                      <span className="text-sm font-medium">
                        {mode.name.charAt(0).toUpperCase() + mode.name.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {errors.paymentMode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.paymentMode}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="mb-6">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Additional Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional notes..."
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="action-buttons flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="bg-gray-600 text-white rounded-md px-4 py-2.5 text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <i className="bi bi-file-earmark mr-2"></i> Save as Draft
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-primary-blue text-white rounded-md px-6 py-3 font-medium flex items-center justify-center transition-all ${
              isSubmitting
                ? "opacity-80 cursor-not-allowed"
                : "hover:bg-hover-blue"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle mr-2"></i> Submit Lead
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadInformation;
