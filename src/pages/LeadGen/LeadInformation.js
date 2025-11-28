import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper";
import axios from "axios";
import toast from "react-hot-toast";

const LeadInformation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // const { variant, selectedColor, quantity } = location.state || {};
  const { variant, selectedColor, quantity, colorPrice } = location.state || {};
  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    customerLocation: "",
    customerArea: "",
    purchaseDate: "",
    quantity: quantity || 1,
    paymentMode: "cash",
    notes: "",
  });
  console.log("Initial formData.quantity:", formData.quantity);

  const [leadId, setLeadId] = useState(localStorage.getItem("leadId") || null);
  const [leadDetails, setLeadDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [brands, setBrands] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [ccs, setCcs] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  const [storedLeads, setStoredLeads] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [useSameCustomerDetails, setUseSameCustomerDetails] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [locationSearchText, setLocationSearchText] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedVehicleForPopup, setSelectedVehicleForPopup] = useState(null);
  const [showVehiclePopup, setShowVehiclePopup] = useState(false);
  const [variantColorPrices, setVariantColorPrices] = useState({});

  // Dealer mapping states
  const [dealerAssignedAreas, setDealerAssignedAreas] = useState([]);
  const [loadingDealerAreas, setLoadingDealerAreas] = useState(false);

  // Vehicle management state
  // const [allVehiclesForCurrentLead, setAllVehiclesForCurrentLead] = useState(
  //   []
  // );
  const [allVehiclesForCurrentLead, setAllVehiclesForCurrentLead] = useState(
    []
  );

  // CRITICAL: Track selected city ID
  const [selectedCityId, setSelectedCityId] = useState(null);

  // Overlay visibility state
  const [showVehiclesOverlay, setShowVehiclesOverlay] = useState(false);

  const API_BASE = "http://localhost:8000/api";
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  // ========== DEALER MAPPING FUNCTIONS ==========

  const getCurrentDealerId = () => {
    const possibleUserDataKeys = [
      "userData",
      "user",
      "currentUser",
      "authUser",
      "userInfo",
    ];
    for (const key of possibleUserDataKeys) {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        try {
          const user = JSON.parse(storedData);
          if (user.id) return user.id;
          if (user.user_id) return user.user_id;
          if (user.dealer_id) return user.dealer_id;
          if (user.userId) return user.userId;
        } catch (err) {}
      }
    }

    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        const payload = JSON.parse(atob(authToken.split(".")[1]));
        if (payload.user_id) return payload.user_id;
        if (payload.id) return payload.id;
        if (payload.sub) return payload.sub;
      } catch (err) {}
    }

    for (const key of possibleUserDataKeys) {
      const storedData = sessionStorage.getItem(key);
      if (storedData) {
        try {
          const user = JSON.parse(storedData);
          if (user.id) return user.id;
          if (user.user_id) return user.user_id;
        } catch (err) {}
      }
    }

    return null;
  };

  const fetchDealerAreas = async (cityName) => {
    if (!cityName || cityName.trim().length === 0) {
      setDealerAssignedAreas([]);
      setShowAreaDropdown(false);
      return;
    }

    try {
      setLoadingDealerAreas(true);
      const dealerId = getCurrentDealerId();

      if (!dealerId) {
        await fetchAllAreasForCity(cityName);
        return;
      }

      const cityResponse = await axios.get(`${API_BASE}/admin/areas`, {
        headers: getAuthHeaders(),
        params: { search: cityName.trim() },
      });

      let citiesData = [];
      if (cityResponse.data && cityResponse.data.data) {
        citiesData = cityResponse.data.data;
      } else if (Array.isArray(cityResponse.data)) {
        citiesData = cityResponse.data;
      }

      const selectedCity = citiesData.find(
        (area) => (area.city_name || area.name) === cityName
      );

      if (!selectedCity) {
        setDealerAssignedAreas([]);
        setShowAreaDropdown(false);
        return;
      }

      const cityId = selectedCity.id;

      try {
        const dealerAreasResponse = await axios.get(
          `${API_BASE}/dealer-areas`,
          {
            headers: getAuthHeaders(),
            params: { dealer_id: dealerId, city_id: cityId },
          }
        );

        let dealerAreas = [];
        if (dealerAreasResponse.data && dealerAreasResponse.data.data) {
          dealerAreas = dealerAreasResponse.data.data;
        } else if (Array.isArray(dealerAreasResponse.data)) {
          dealerAreas = dealerAreasResponse.data;
        }

        if (dealerAreas.length > 0 && dealerAreas[0].area_id) {
          const areaIds = dealerAreas[0].area_id
            .split(",")
            .map((id) => id.trim());
          const areasResponse = await axios.get(`${API_BASE}/admin/areas`, {
            headers: getAuthHeaders(),
          });
          let allAreas = areasResponse.data.data || areasResponse.data || [];

          const filteredAreas = allAreas.filter(
            (area) =>
              areaIds.includes(area.id.toString()) &&
              (area.city_name || area.name) === cityName
          );

          setDealerAssignedAreas(filteredAreas);
          setShowAreaDropdown(filteredAreas.length > 0);
        } else {
          await fetchAllAreasForCity(cityName);
        }
      } catch (dealerApiError) {
        await fetchAllAreasForCity(cityName);
      }
    } catch (err) {
      setDealerAssignedAreas([]);
      setShowAreaDropdown(false);
      await fetchAllAreasForCity(cityName);
    } finally {
      setLoadingDealerAreas(false);
    }
  };

  const fetchAllAreasForCity = async (cityName) => {
    try {
      setLoadingAreas(true);
      const response = await axios.get(`${API_BASE}/admin/areas`, {
        headers: getAuthHeaders(),
        params: { search: cityName.trim() },
      });

      let areasData = response.data.data || response.data || [];
      const cityAreas = areasData.filter(
        (area) => (area.city_name || area.name) === cityName
      );

      setDealerAssignedAreas(cityAreas);
      setShowAreaDropdown(cityAreas.length > 0);
    } catch (err) {
      setDealerAssignedAreas([]);
      setShowAreaDropdown(false);
    } finally {
      setLoadingAreas(false);
    }
  };

  const getVehicleImage = (variant, color = null) => {
    if (!variant) return null;

    // Filter galleries by variant_id AND color_id if color is provided
    let gallery;
    if (color && color.id) {
      gallery = galleries.find(
        (g) => g.variant_id === variant.id && g.color_id === color.id
      );
    }

    // Fallback to any gallery for this variant if no color-specific gallery found
    if (!gallery) {
      gallery = galleries.find((g) => g.variant_id === variant.id);
    }

    let photos = [];
    if (gallery) {
      try {
        const photoField = gallery.vehicle_photos || gallery.cover_photos;
        photos =
          typeof photoField === "string" ? JSON.parse(photoField) : photoField;
        if (!Array.isArray(photos)) photos = [photoField].filter(Boolean);
      } catch (e) {
        photos = [];
      }
    }
    return photos[0] || null;
  };

  const getVehiclePrice = (vehicleVariant, vehicleColor = null) => {
    if (!vehicleVariant) return 0;

    if (vehicleColor && vehicleColor.id === selectedColor?.id && colorPrice) {
      return parseFloat(colorPrice);
    }

    if (vehicleColor && vehicleColor.price) {
      return parseFloat(vehicleColor.price);
    }

    if (unitPrice) {
      return parseFloat(unitPrice);
    }

    const price =
      vehicleVariant.basic_price ||
      vehicleVariant.price ||
      vehicleVariant.ex_showroom_price ||
      vehicleVariant.on_road_price ||
      0;

    return parseFloat(price) || 0;
  };

  

  const renderVehicleCard = (vehicle, index, isCurrent = false) => {
  if (!vehicle || !vehicle.variant) return null;
  const mainPhoto = getVehicleImage(vehicle.variant);
  const vehicleVariant = vehicle.variant;
  const color = isCurrent ? selectedColor : vehicle.color;
  
  // Get price based on color
  const basicPrice = getVehiclePrice(vehicleVariant, color);
  const exShowroomPrice = vehicleVariant?.ex_showroom_price || 0;
  const onRoadPrice = vehicleVariant?.on_road_price || 0;
  const vehicleQuantity = vehicle.quantity || formData.quantity;
  const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;
  const totalExShowroomPrice = parseFloat(exShowroomPrice) * vehicleQuantity;
  const totalOnRoadPrice = parseFloat(onRoadPrice) * vehicleQuantity;

  const handleCardClick = () => {
    setSelectedVehicleForPopup({ vehicle, index, isCurrent });
    setShowVehiclePopup(true);
  };

  const updateVehicleQuantity = (newQuantity) => {
    if (isCurrent) {
      setFormData((prev) => ({ ...prev, quantity: newQuantity }));
    } else {
      const updatedVehicles = [...allVehiclesForCurrentLead];
      updatedVehicles[index] = {
        ...updatedVehicles[index],
        quantity: newQuantity,
      };
      setAllVehiclesForCurrentLead(updatedVehicles);
      localStorage.setItem(
        "allVehiclesForCurrentLead",
        JSON.stringify(updatedVehicles)
      );
    }
  };

  // Edit vehicle function
  const handleEditVehicle = (e) => {
    e.stopPropagation();
    navigate("/leads/generate", {
      state: {
        editVehicle: {
          ...vehicle,
          index,
          isCurrent,
          existingColor: color,
          existingQuantity: vehicleQuantity
        },
        preserveFormData: true,
        customerData: {
          customer_name: formData.customerName,
          phone_no: formData.phoneNumber,
          location: formData.customerLocation,
          area: formData.customerArea,
          purchase_date: formData.purchaseDate,
          payment_mode: formData.paymentMode,
          quantity: formData.quantity,
          notes: formData.notes,
        },
      },
    });
  };

  // Remove vehicle function
  const handleRemoveVehicle = async (e) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to remove this vehicle from the lead?"
      )
    ) {
      await removeVehicleFromLead(vehicle, index, isCurrent);
    }
  };

  return (
    <div
      key={index}
      className={`bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-all cursor-pointer ${
        isCurrent ? "border-blue-500 border-2" : "border-gray-200"
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-800 text-sm truncate">
              {isCurrent ? "Current Vehicle" : `Vehicle ${index + 1}`}
            </h4>
            <div className="flex items-center gap-1">
              {isCurrent && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
                  Current
                </span>
              )}
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Edit Button */}
                <button
                  onClick={handleEditVehicle}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors"
                  title="Edit vehicle"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                
                {/* Remove Button - Only show if not the only vehicle */}
                {(allVehiclesForCurrentLead.length > 0 || !isCurrent) && (
                  <button
                    onClick={handleRemoveVehicle}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors ml-2"
                    title="Remove vehicle"
                  >
                    <svg
                      className="w-4 h-4"
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
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Rest of the card content remains the same */}
          <div className="space-y-1 text-xs">
            <p className="text-gray-600 truncate">
              <span className="font-medium">Variant:</span>{" "}
              {vehicleVariant.name}
            </p>
            
            {/* Color Display */}
            {color && (
              <p className="text-gray-600 truncate flex items-center gap-2">
                <span className="font-medium">Color:</span>
                <span
                  className="w-5 h-5 rounded-full border border-gray-400 shadow"
                  style={{ backgroundColor: color.color_code }}
                  title={color.name}
                ></span>
                <span className="text-xs">{color.name}</span>
              </p>
            )}

            {/* Quantity with +/- controls */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-600">Quantity:</span>
              <div
                className="flex items-center border rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateVehicleQuantity(Math.max(1, vehicleQuantity - 1));
                  }}
                  disabled={vehicleQuantity <= 1}
                >
                  -
                </button>
                <span className="px-2 py-1 min-w-8 text-center font-medium">
                  {vehicleQuantity}
                </span>
                <button
                  type="button"
                  className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateVehicleQuantity(vehicleQuantity + 1);
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Color-specific Price Display */}
            <div className="space-y-1 mt-2">
              {basicPrice > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">{`$Price:`}</span>
                  <div className="text-right">
                    <p className="text-green-600 font-semibold text-sm">
                      ${parseFloat(basicPrice).toLocaleString()}
                    </p>
                    {vehicleQuantity > 1 && (
                      <p className="text-green-500 text-xs">
                        Total: ${totalBasicPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* ... rest of price display code ... */}
            </div>
          </div>
        </div>
        
        {mainPhoto && (
          <div className="ml-3 flex-shrink-0">
            <img
              src={`${API_BASE.replace(
                "/api",
                ""
              )}/uploads/coverPhotos/${mainPhoto}`}
              alt={vehicleVariant.name}
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

  const removeVehicleFromLead = async (vehicle, index, isCurrent = false) => {
    try {
      setIsSubmitting(true);

      // If it's a current vehicle (not yet saved to database)
      if (isCurrent) {
        if (
          window.confirm("Are you sure you want to remove the current vehicle?")
        ) {
          // Simply navigate back to model selection
          navigate("/leads/generate", {
            state: {
              preserveFormData: true,
              customerData: {
                customer_name: formData.customerName,
                phone_no: formData.phoneNumber,
                location: formData.customerLocation,
                area: formData.customerArea,
                purchase_date: formData.purchaseDate,
                payment_mode: formData.paymentMode,
                quantity: formData.quantity,
                notes: formData.notes,
              },
            },
          });
        }
        return;
      }

      // If it's a saved vehicle in lead_details table
      if (vehicle.id && leadId) {
        if (
          window.confirm(
            "Are you sure you want to remove this vehicle from the lead?"
          )
        ) {
          // Make API call to mark as removed in database
          const response = await axios.delete(
            `${API_BASE}/leads/${leadId}/vehicles/${vehicle.id}`,
            { headers: getAuthHeaders() }
          );

          if (response.data.success) {
            // Remove from local state
            const updatedVehicles = allVehiclesForCurrentLead.filter(
              (_, i) => i !== index
            );
            setAllVehiclesForCurrentLead(updatedVehicles);

            // Update localStorage
            localStorage.setItem(
              "allVehiclesForCurrentLead",
              JSON.stringify(updatedVehicles)
            );

            // Update lead quantity in form data based on API response
            if (
              response.data.data &&
              response.data.data.lead_vehicle_qty !== undefined
            ) {
              setFormData((prev) => ({
                ...prev,
                quantity: response.data.data.lead_vehicle_qty,
              }));
            } else {
              // Fallback: calculate locally
              const totalQuantity = updatedVehicles.reduce(
                (total, v) => total + (v.quantity || 1),
                0
              );
              setFormData((prev) => ({ ...prev, quantity: totalQuantity }));
            }

            toast.success("Vehicle removed successfully!");

            // Refresh the data to get updated state from backend
            setTimeout(() => {
              // You can either reload the page or refetch the lead data
              window.location.reload();
              // OR: refetchLeadData(); // if you have a function to refetch
            }, 1500);
          } else {
            throw new Error(
              response.data.message || "Failed to remove vehicle"
            );
          }
        }
      } else {
        // Remove from local state only (not yet saved to database)
        if (
          window.confirm(
            "Are you sure you want to remove this vehicle from selection?"
          )
        ) {
          const updatedVehicles = allVehiclesForCurrentLead.filter(
            (_, i) => i !== index
          );
          setAllVehiclesForCurrentLead(updatedVehicles);

          localStorage.setItem(
            "allVehiclesForCurrentLead",
            JSON.stringify(updatedVehicles)
          );

          // Update local quantity
          const totalQuantity = updatedVehicles.reduce(
            (total, v) => total + (v.quantity || 1),
            0
          );
          setFormData((prev) => ({ ...prev, quantity: totalQuantity }));

          toast.success("Vehicle removed from selection!");
        }
      }
    } catch (error) {
      console.error("Remove vehicle failed:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove vehicle";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

 

const renderCompactVehicleCard = (vehicle, index, isCurrent = false) => {
  if (!vehicle || !vehicle.variant) return null;
  
  const color = isCurrent ? selectedColor : vehicle.color;
  const mainPhoto = getVehicleImage(vehicle.variant, color);
  const vehicleVariant = vehicle.variant;
  
  // Get color-specific price
  const vehiclePrice = getVehiclePrice(vehicleVariant, color);
  const onRoadPrice = vehicleVariant?.on_road_price || 0;
  const vehicleQuantity = vehicle.quantity || formData.quantity;
  const totalPrice = vehiclePrice * vehicleQuantity;
  const totalOnRoadPrice = parseFloat(onRoadPrice) * vehicleQuantity;

  const handleCardClick = () => {
    setSelectedVehicleForPopup({ vehicle, index, isCurrent });
    setShowVehiclePopup(true);
  };

  const updateVehicleQuantity = (newQuantity) => {
    if (isCurrent) {
      setFormData((prev) => ({ ...prev, quantity: newQuantity }));
    } else {
      const updatedVehicles = [...allVehiclesForCurrentLead];
      updatedVehicles[index] = {
        ...updatedVehicles[index],
        quantity: newQuantity,
      };
      setAllVehiclesForCurrentLead(updatedVehicles);
      localStorage.setItem(
        "allVehiclesForCurrentLead",
        JSON.stringify(updatedVehicles)
      );
    }
  };

  // Edit vehicle function
  const handleEditVehicle = (e) => {
    e.stopPropagation();
    // Navigate to model selection with current vehicle data
    navigate("/leads/generate", {
      state: {
        editVehicle: {
          ...vehicle,
          index,
          isCurrent,
          existingColor: color,
          existingQuantity: vehicleQuantity
        },
        preserveFormData: true,
        customerData: {
          customer_name: formData.customerName,
          phone_no: formData.phoneNumber,
          location: formData.customerLocation,
          area: formData.customerArea,
          purchase_date: formData.purchaseDate,
          payment_mode: formData.paymentMode,
          quantity: formData.quantity,
          notes: formData.notes,
        },
      },
    });
  };

  // Remove vehicle function for compact card
  const handleRemoveVehicle = async (e) => {
    e.stopPropagation();
    if (
      window.confirm(
        "Are you sure you want to remove this vehicle from the lead?"
      )
    ) {
      await removeVehicleFromLead(vehicle, index, isCurrent);
    }
  };

  return (
    <div
      key={index}
      className={`bg-white rounded-lg border p-2 shadow-sm cursor-pointer ${
        isCurrent ? "border-blue-500 border-2" : "border-gray-200"
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-center space-x-2">
        {mainPhoto && (
          <div className="flex-shrink-0">
            <img
              src={`${API_BASE.replace(
                "/api",
                ""
              )}/uploads/coverPhotos/${mainPhoto}`}
              alt={vehicleVariant.name}
              className="w-full h-12 object-cover rounded border"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/48x48/f3f4f6/6b7280?text=No+Image";
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {/* Header with vehicle name and action buttons */}
              <div className="flex justify-between items-start mb-1">
                <p className="font-medium text-gray-800 text-sm truncate">
                  {vehicleVariant.name}
                </p>
                <div className="flex items-center gap-1">
                  {isCurrent && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ml-1">
                      Current
                    </span>
                  )}
                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    {/* Edit Button */}
                    <button
                      onClick={handleEditVehicle}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors"
                      title="Edit vehicle"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    
                    {/* Remove Button - Only show if not the only vehicle */}
                    {(allVehiclesForCurrentLead.length > 0 || !isCurrent) && (
                      <button
                        onClick={handleRemoveVehicle}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
                        title="Remove vehicle"
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
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Rest of the card content remains the same */}
              {/* Color Display */}
              {color && (
                <p className="text-xs text-gray-600 truncate flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300"
                    style={{ backgroundColor: color.color_code }}
                  ></span>
                  {color.name}
                </p>
              )}
              
              <p className="text-xs text-gray-600 truncate">
                {brands.find((b) => b.id === vehicleVariant.brand_id)?.name ||
                  "N/A"}{" "}
                •
                {ccs.find((c) => c.id === vehicleVariant.cc_id)?.name ||
                  "N/A"}{" "}
                •
                {fuelTypes.find((f) => f.id === vehicleVariant.fuel_type_id)
                  ?.name || "N/A"}
              </p>

              {/* Color-specific Price Display */}
              {vehiclePrice > 0 ? (
                <div>
                  <p className="text-xs text-green-600 font-medium truncate">
                    ${vehiclePrice.toLocaleString()} *
                    <small className="text-black">*On-Road Price</small>
                  </p>
                  {vehicleQuantity > 1 && (
                    <p className="text-xs text-green-700 font-semibold truncate">
                      Total: ${totalPrice.toLocaleString()}*
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-500 truncate">
                  Price on request
                </p>
              )}

              {/* Quantity with +/- controls */}
              <div className="flex items-center justify-between my-1">
                <div
                  className="flex items-center border rounded text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="px-1 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateVehicleQuantity(Math.max(1, vehicleQuantity - 1));
                    }}
                    disabled={vehicleQuantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-1 py-0.5 min-w-6 text-center font-medium">
                    {vehicleQuantity}
                  </span>
                  <button
                    type="button"
                    className="px-1 py-0.5 text-gray-600 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateVehicleQuantity(vehicleQuantity + 1);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* On Road Price Display */}
              {onRoadPrice > 0 && (
                <>
                  <p className="text-xs text-blue-600 font-medium truncate">
                    On Road: ${parseFloat(onRoadPrice).toLocaleString()}
                  </p>
                  {vehicleQuantity > 1 && (
                    <p className="text-xs text-blue-700 font-semibold truncate">
                      Total OR: ${totalOnRoadPrice.toLocaleString()}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  const renderVehiclesOverlay = () => {
    const allVehicles = [...allVehiclesForCurrentLead];
    if (variant) {
      allVehicles.push({
        variant,
        isCurrent: true,
        quantity: formData.quantity,
      });
    }

    if (allVehicles.length === 0) return null;

    // Calculate detailed price breakdown
    const totalQuantity = allVehicles.reduce((total, vehicle) => {
      return total + (vehicle.quantity || formData.quantity);
    }, 0);

    const totalBasicPrice = allVehicles.reduce((total, vehicle) => {
      const basicPrice = vehicle.variant?.basic_price || 0;
      const vehicleQuantity = vehicle.quantity || formData.quantity;
      return total + (parseFloat(basicPrice) || 0) * vehicleQuantity;
    }, 0);

    const totalExShowroomPrice = allVehicles.reduce((total, vehicle) => {
      const exShowroomPrice = vehicle.variant?.ex_showroom_price || 0;
      const vehicleQuantity = vehicle.quantity || formData.quantity;
      return total + (parseFloat(exShowroomPrice) || 0) * vehicleQuantity;
    }, 0);

    const totalOnRoadPrice = allVehicles.reduce((total, vehicle) => {
      const onRoadPrice = vehicle.variant?.on_road_price || 0;
      const vehicleQuantity = vehicle.quantity || formData.quantity;
      return total + (parseFloat(onRoadPrice) || 0) * vehicleQuantity;
    }, 0);

    // Calculate taxes and additional costs
    const totalTaxes = totalOnRoadPrice - totalExShowroomPrice;
    const rtoCost = totalOnRoadPrice * 0.05; // Example: 5% of on-road price
    const insuranceCost = totalOnRoadPrice * 0.03; // Example: 3% of on-road price
    const otherCharges = totalOnRoadPrice * 0.02; // Example: 2% of on-road price

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-[#0f66af] text-white px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold">
                Vehicle Details & Price Breakdown
              </h3>
              <button
                onClick={() => setShowVehiclesOverlay(false)}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Vehicle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              {allVehicles.map((vehicle, index) =>
                renderVehicleCard(
                  vehicle,
                  index,
                  index === allVehicles.length - 1 && variant
                )
              )}
            </div>

            {/* Detailed Price Breakdown */}
            <div className="bg-gray-50 rounded-lg border p-4 sm:p-6">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">
                Price Breakdown
              </h4>

              <div className="space-y-3">
                {/* Color-wise Price Breakdown */}
                {allVehicles.map((vehicle, index) => {
                  const vehicleVariant = vehicle.variant;
                  const color = vehicle.isCurrent
                    ? selectedColor
                    : vehicle.color;

                  // Use the actual price from the vehicle data or from ModelDetails
                  const vehiclePrice =
                    vehicle.unit_price ||
                    vehicle.color_price ||
                    getVehiclePrice(vehicleVariant, color);
                  const vehicleQuantity = vehicle.quantity || formData.quantity;
                  const totalVehiclePrice = vehiclePrice * vehicleQuantity;

                  if (vehiclePrice <= 0) return null;

                  return (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-3 last:border-b-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-gray-700 font-medium">
                            {vehicleVariant.name}
                          </span>
                          {color && (
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: color.color_code }}
                              ></span>
                              <span className="text-sm text-gray-600">
                                {color.name}
                              </span>
                              {/* Show color pricing indicator */}
                              {/* {color.price &&
                                color.price !== vehicleVariant?.basic_price && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      parseFloat(color.price) >
                                      parseFloat(
                                        vehicleVariant?.basic_price || 0
                                      )
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-green-100 text-green-700"
                                    }`}
                                  >
                                    {parseFloat(color.price) >
                                    parseFloat(vehicleVariant?.basic_price || 0)
                                      ? "Premium Color"
                                      : "Special Price"}
                                  </span>
                                )} */}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-green-600 font-semibold">
                            ${totalVehiclePrice.toLocaleString()}
                          </span>
                          {vehicleQuantity > 1 && (
                            <p className="text-sm text-gray-600">
                              (${parseFloat(vehiclePrice).toLocaleString()} ×{" "}
                              {vehicleQuantity})
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Totals Section */}
                <div className="border-t border-gray-300 pt-4">
                  {/* Total Basic Price (Sum of all vehicle prices) */}

                  {/* Ex-Showroom Price */}
                  {totalExShowroomPrice > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">
                          Ex-Showroom Price
                        </span>
                        <span className="text-xs text-gray-500">
                          (Before taxes)
                        </span>
                      </div>
                      <span className="text-blue-600 font-semibold">
                        ${totalExShowroomPrice.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Taxes & Charges Breakdown */}
                  {totalTaxes > 0 && (
                    <div className="pl-4 border-l-2 border-gray-300">
                      <h5 className="font-medium text-gray-600 mb-2">
                        Taxes & Charges:
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            RTO Registration
                          </span>
                          <span className="text-gray-700">
                            ${rtoCost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Insurance</span>
                          <span className="text-gray-700">
                            ${insuranceCost.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Other Charges</span>
                          <span className="text-gray-700">
                            ${otherCharges.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-gray-700 font-medium">
                            Total Taxes
                          </span>
                          <span className="text-gray-700 font-medium">
                            ${totalTaxes.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* On Road Price */}
                  {totalOnRoadPrice > 0 && (
                    <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-800 font-bold text-lg">
                          On Road Price
                        </span>
                        <span className="text-xs text-blue-600">
                          (Including all taxes)
                        </span>
                      </div>
                      <span className="text-blue-800 font-bold text-xl">
                        ${totalOnRoadPrice.toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Quantity Summary */}
                  <div className="flex justify-between items-center pt-3">
                    <span className="text-gray-700 font-medium">
                      Total Quantity
                    </span>
                    <span className="text-gray-800 font-semibold">
                      {totalQuantity} units
                    </span>
                  </div>

                  {/* Per Unit Calculation */}
                  {totalQuantity > 1 && totalOnRoadPrice > 0 && (
                    <div className="text-center pt-2">
                      <span className="text-sm text-gray-500">
                        (${(totalOnRoadPrice / totalQuantity).toLocaleString()}{" "}
                        per unit)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Color Pricing Summary - Only show if there are color-specific prices */}

              {/* Additional Information */}
              {/* <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>Note:</strong> Prices are indicative and may vary
                  based on location, additional accessories, and current offers.
                  Final price will be confirmed at the time of delivery.
                </p>
              </div> */}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-4 sm:px-6 py-3 bg-gray-50">
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowVehiclesOverlay(false)}
                className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // You can add any action here, like proceeding to checkout
                  console.log("Proceed with purchase");
                }}
                className="bg-[#0f66af] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // const renderSelectedVehiclesPreview = () => {
  //   const allVehicles = [...allVehiclesForCurrentLead];
  //   if (variant) {
  //     allVehicles.push({
  //       variant,
  //       isCurrent: true,
  //       quantity: formData.quantity,
  //     });
  //   }

  //   if (allVehicles.length === 0) return null;

  //   const currentVehiclesCount = allVehicles.length;
  //   const currentVehicle = variant ? { variant, isCurrent: true } : null;

  //   // Calculate totals for the preview
  //   const totalPreviewQuantity = allVehicles.reduce((total, vehicle) => {
  //     return total + (vehicle.quantity || formData.quantity);
  //   }, 0);

  //   const totalPreviewPrice = allVehicles.reduce((total, vehicle) => {
  //     const vehiclePrice = getVehiclePrice(vehicle.variant);
  //     const vehicleQuantity = vehicle.quantity || formData.quantity;
  //     return total + vehiclePrice * vehicleQuantity;
  //   }, 0);

  //   const totalPreviewOnRoadPrice = allVehicles.reduce((total, vehicle) => {
  //     const onRoadPrice = vehicle.variant?.on_road_price || 0;
  //     const vehicleQuantity = vehicle.quantity || formData.quantity;
  //     return total + (parseFloat(onRoadPrice) || 0) * vehicleQuantity;
  //   }, 0);

  //   return (
  //     <div className="mb-6">
  //       <div className="flex justify-between items-center mb-3">
  //         <div className="flex items-center gap-4">
  //           <h4 className="text-[#0f66af] text-base sm:text-lg font-semibold">
  //             Selected Vehicles ({currentVehiclesCount})
  //           </h4>

  //           {/* Quantity Controls in Preview Header */}
  //           <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1">
  //             <span className="text-sm font-medium text-[#0f66af]">
  //               Total Qty:
  //             </span>
  //             <div className="flex items-center border border-blue-200 rounded">
  //               <button
  //                 type="button"
  //                 className="px-2 py-1 text-[#0f66af] hover:bg-blue-100 disabled:opacity-50 transition-colors"
  //                 onClick={() => {
  //                   // Decrease current vehicle quantity
  //                   if (formData.quantity > 1) {
  //                     setFormData((prev) => ({
  //                       ...prev,
  //                       quantity: Math.max(1, prev.quantity - 1),
  //                     }));
  //                   }
  //                 }}
  //                 disabled={formData.quantity <= 1}
  //               >
  //                 -
  //               </button>
  //               <span className="px-2 py-1 min-w-8 text-center font-semibold text-[#0f66af]">
  //                 {formData.quantity}
  //               </span>
  //               <button
  //                 type="button"
  //                 className="px-2 py-1 text-[#0f66af] hover:bg-blue-100 transition-colors"
  //                 onClick={() => {
  //                   // Increase current vehicle quantity
  //                   setFormData((prev) => ({
  //                     ...prev,
  //                     quantity: prev.quantity + 1,
  //                   }));
  //                 }}
  //               >
  //                 +
  //               </button>
  //             </div>
  //           </div>
  //         </div>

  //         {currentVehiclesCount > 1 && (
  //           <button
  //             onClick={() => setShowVehiclesOverlay(true)}
  //             className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium flex items-center gap-1"
  //           >
  //             View All
  //             <svg
  //               className="w-3 h-3 sm:w-4 sm:h-4"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M9 5l7 7-7 7"
  //               />
  //             </svg>
  //           </button>
  //         )}
  //       </div>

  //       {/* Quick Price Summary */}
  //       {(totalPreviewPrice > 0 || totalPreviewOnRoadPrice > 0) && (
  //         <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
  //           <div className="flex flex-wrap gap-4 text-sm">
  //             {totalPreviewPrice > 0 && (
  //               <div className="flex items-center gap-2">
  //                 <span className="text-gray-600">Basic Price Total:</span>
  //                 <span className="font-semibold text-green-600">
  //                   ${totalPreviewPrice.toLocaleString()}
  //                 </span>
  //               </div>
  //             )}
  //             {totalPreviewOnRoadPrice > 0 && (
  //               <div className="flex items-center gap-2">
  //                 <span className="text-gray-600">On Road Price Total:</span>
  //                 <span className="font-semibold text-blue-600">
  //                   ${totalPreviewOnRoadPrice.toLocaleString()}
  //                 </span>
  //                 <span className="text-red-500 text-xs">*</span>
  //               </div>
  //             )}
  //             <div className="flex items-center gap-2">
  //               <span className="text-gray-600">Total Quantity:</span>
  //               <span className="font-semibold text-gray-800">
  //                 {totalPreviewQuantity} units
  //               </span>
  //             </div>
  //           </div>
  //           {totalPreviewOnRoadPrice > 0 && (
  //             <p className="text-xs text-gray-500 mt-2">
  //               <span className="text-red-500">*</span> On Road Price includes
  //               taxes, insurance, and registration fees
  //             </p>
  //           )}
  //         </div>
  //       )}

  //       {/* Mobile: Compact Cards */}
  //       <div className="block sm:hidden space-y-2">
  //         {/* Current Vehicle */}
  //         {currentVehicle &&
  //           renderCompactVehicleCard(
  //             currentVehicle,
  //             currentVehiclesCount - 1,
  //             true
  //           )}

  //         {/* Previous Vehicles - show only first 2 for preview */}
  //         {allVehiclesForCurrentLead
  //           .slice(0, 2)
  //           .map((vehicle, index) => renderCompactVehicleCard(vehicle, index))}

  //         {/* Show more indicator if there are more vehicles */}
  //         {allVehiclesForCurrentLead.length > 2 && (
  //           <div
  //             className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
  //             onClick={() => setShowVehiclesOverlay(true)}
  //           >
  //             <svg
  //               className="w-6 h-6 text-gray-400 mb-1"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M12 4v16m8-8H4"
  //               />
  //             </svg>
  //             <p className="text-gray-600 text-xs text-center">
  //               +{allVehiclesForCurrentLead.length - 2} more vehicles
  //             </p>
  //             <p className="text-gray-500 text-xs mt-0.5">Tap to view all</p>
  //           </div>
  //         )}
  //       </div>

  //       {/* Desktop: Regular Cards */}
  //       <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
  //         {/* Current Vehicle Card */}
  //         {currentVehicle &&
  //           renderVehicleCard(currentVehicle, currentVehiclesCount - 1, true)}

  //         {/* Previous Vehicles - show only first 2 for preview */}
  //         {allVehiclesForCurrentLead
  //           .slice(0, 2)
  //           .map((vehicle, index) => renderVehicleCard(vehicle, index))}

  //         {/* Show more indicator if there are more vehicles */}
  //         {allVehiclesForCurrentLead.length > 2 && (
  //           <div
  //             className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
  //             onClick={() => setShowVehiclesOverlay(true)}
  //           >
  //             <svg
  //               className="w-8 h-8 text-gray-400 mb-2"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M12 4v16m8-8H4"
  //               />
  //             </svg>
  //             <p className="text-gray-600 text-sm text-center">
  //               +{allVehiclesForCurrentLead.length - 2} more vehicles
  //             </p>
  //             <p className="text-gray-500 text-xs mt-1">Click to view all</p>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  // const renderSelectedVehiclesPreview = () => {
  //   const allVehicles = [...allVehiclesForCurrentLead];
  //   if (variant) {
  //     allVehicles.push({
  //       variant,
  //       isCurrent: true,
  //       quantity: formData.quantity,
  //     });
  //   }

  //   if (allVehicles.length === 0) return null;

  //   const currentVehiclesCount = allVehicles.length;
  //   const currentVehicle = variant ? { variant, isCurrent: true } : null;

  //   return (
  //     <div className="mb-6">
  //       {/* Clickable Header that opens price details popup */}
  //       <div
  //         className="flex justify-between items-center mb-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
  //         onClick={() => setShowVehiclesOverlay(true)}
  //       >
  //         <div className="flex items-center gap-4">
  //           <h4 className="text-[#0f66af] text-base sm:text-lg font-semibold">
  //             Selected Vehicles ({currentVehiclesCount}) - Click to view details
  //           </h4>

  //           {/* Quantity Display (not editable here) */}
  //           <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1">
  //             <span className="text-sm font-medium text-[#0f66af]">
  //               Total Qty:
  //             </span>
  //             <span className="px-2 py-1 min-w-8 text-center font-semibold text-[#0f66af]">
  //               {formData.quantity}
  //             </span>
  //           </div>
  //         </div>

  //         <div className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium flex items-center gap-1">
  //           View Price Details
  //           <svg
  //             className="w-4 h-4"
  //             fill="none"
  //             stroke="currentColor"
  //             viewBox="0 0 24 24"
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               strokeWidth="2"
  //               d="M9 5l7 7-7 7"
  //             />
  //           </svg>
  //         </div>
  //       </div>

  //       {/* Rest of your existing preview cards */}
  //       <div className="block sm:hidden space-y-2">
  //         {currentVehicle &&
  //           renderCompactVehicleCard(
  //             currentVehicle,
  //             currentVehiclesCount - 1,
  //             true
  //           )}
  //         {allVehiclesForCurrentLead
  //           .slice(0, 2)
  //           .map((vehicle, index) => renderCompactVehicleCard(vehicle, index))}
  //         {allVehiclesForCurrentLead.length > 2 && (
  //           <div
  //             className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
  //             onClick={() => setShowVehiclesOverlay(true)}
  //           >
  //             <svg
  //               className="w-6 h-6 text-gray-400 mb-1"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M12 4v16m8-8H4"
  //               />
  //             </svg>
  //             <p className="text-gray-600 text-xs text-center">
  //               +{allVehiclesForCurrentLead.length - 2} more vehicles
  //             </p>
  //             <p className="text-gray-500 text-xs mt-0.5">Tap to view all</p>
  //           </div>
  //         )}
  //       </div>

  //       <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
  //         {currentVehicle &&
  //           renderVehicleCard(currentVehicle, currentVehiclesCount - 1, true)}
  //         {allVehiclesForCurrentLead
  //           .slice(0, 2)
  //           .map((vehicle, index) => renderVehicleCard(vehicle, index))}
  //         {allVehiclesForCurrentLead.length > 2 && (
  //           <div
  //             className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
  //             onClick={() => setShowVehiclesOverlay(true)}
  //           >
  //             <svg
  //               className="w-8 h-8 text-gray-400 mb-2"
  //               fill="none"
  //               stroke="currentColor"
  //               viewBox="0 0 24 24"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 strokeWidth="2"
  //                 d="M12 4v16m8-8H4"
  //               />
  //             </svg>
  //             <p className="text-gray-600 text-sm text-center">
  //               +{allVehiclesForCurrentLead.length - 2} more vehicles
  //             </p>
  //             <p className="text-gray-500 text-xs mt-1">Click to view all</p>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // };

  const renderSelectedVehiclesPreview = () => {
    const allVehicles = [...allVehiclesForCurrentLead];
    if (variant) {
      allVehicles.push({
        variant,
        isCurrent: true,
        quantity: formData.quantity,
      });
    }

    if (allVehicles.length === 0) return null;

    const currentVehiclesCount = allVehicles.length;
    const currentVehicle = variant ? { variant, isCurrent: true } : null;

    return (
      <div className="mb-6">
        {/* Clickable Header that opens price details popup */}
        <div
          className="flex justify-between items-center mb-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => setShowVehiclesOverlay(true)}
        >
          {/* {currentVehiclesCount >1} */}
          <div className="flex items-center gap-4">
            <h4 className="text-[#0f66af] text-base sm:text-lg font-semibold">
              Selected Vehicles ({currentVehiclesCount}) - Click to view details
            </h4>

            {/* Quantity Display (not editable here) */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1">
              <span className="text-sm font-medium text-[#0f66af]">
                Total Qty:
              </span>
              <span className="px-2 py-1 min-w-8 text-center font-semibold text-[#0f66af]">
                {formData.quantity}
              </span>
            </div>
          </div>

          {currentVehiclesCount > 0 && (
            <div className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium flex items-center gap-1">
              View Price Details
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Rest of your existing preview cards */}
        <div className="block sm:hidden space-y-2">
          {currentVehicle &&
            renderCompactVehicleCard(
              currentVehicle,
              currentVehiclesCount - 1,
              true
            )}
          {allVehiclesForCurrentLead
            .slice(0, 2)
            .map((vehicle, index) => renderCompactVehicleCard(vehicle, index))}
          {allVehiclesForCurrentLead.length > 2 && (
            <div
              className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setShowVehiclesOverlay(true)}
            >
              <svg
                className="w-6 h-6 text-gray-400 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="text-gray-600 text-xs text-center">
                +{allVehiclesForCurrentLead.length - 2} more vehicles
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Tap to view all</p>
            </div>
          )}
        </div>

        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {currentVehicle &&
            renderVehicleCard(currentVehicle, currentVehiclesCount - 1, true)}
          {allVehiclesForCurrentLead
            .slice(0, 2)
            .map((vehicle, index) => renderVehicleCard(vehicle, index))}
          {allVehiclesForCurrentLead.length > 2 && (
            <div
              className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => setShowVehiclesOverlay(true)}
            >
              <svg
                className="w-8 h-8 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <p className="text-gray-600 text-sm text-center">
                +{allVehiclesForCurrentLead.length - 2} more vehicles
              </p>
              <p className="text-gray-500 text-xs mt-1">Click to view all</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderVehiclePopup = (vehicle, index, isCurrent = false) => {
    if (!vehicle || !vehicle.variant) return null;

    // const mainPhoto = getVehicleImage(vehicle.variant);
    const color = isCurrent ? selectedColor : vehicle.color;
    const mainPhoto = getVehicleImage(vehicle.variant, color);

    const vehicleVariant = vehicle.variant;
    // const color = isCurrent ? selectedColor : vehicle.color;

    // Get color-specific price
    const basicPrice = getVehiclePrice(vehicleVariant, color);
    const exShowroomPrice = vehicleVariant?.ex_showroom_price || 0;
    const onRoadPrice = vehicleVariant?.on_road_price || 0;

    const vehicleQuantity = vehicle.quantity || formData.quantity;
    const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;
    const totalExShowroomPrice = parseFloat(exShowroomPrice) * vehicleQuantity;
    const totalOnRoadPrice = parseFloat(onRoadPrice) * vehicleQuantity;

    // Calculate taxes and additional costs
    const totalTaxes = totalOnRoadPrice - totalExShowroomPrice;
    const rtoCost = totalOnRoadPrice * 0.05;
    const insuranceCost = totalOnRoadPrice * 0.03;
    const otherCharges = totalOnRoadPrice * 0.02;

    const updateVehicleQuantity = (newQuantity) => {
      if (isCurrent) {
        setFormData((prev) => ({ ...prev, quantity: newQuantity }));
      } else {
        const updatedVehicles = [...allVehiclesForCurrentLead];
        updatedVehicles[index] = {
          ...updatedVehicles[index],
          quantity: newQuantity,
        };
        setAllVehiclesForCurrentLead(updatedVehicles);
        localStorage.setItem(
          "allVehiclesForCurrentLead",
          JSON.stringify(updatedVehicles)
        );
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-[#0f66af] text-white px-4 sm:px-6 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold">
                {isCurrent ? "Current Vehicle" : `Vehicle ${index + 1}`} - Price
                Details
              </h3>
              <button
                onClick={() => setShowVehiclePopup(false)}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* Vehicle Info */}
            <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              {mainPhoto && (
                <div className="flex-shrink-0">
                  <img
                    src={`${API_BASE.replace(
                      "/api",
                      ""
                    )}/uploads/coverPhotos/${mainPhoto}`}
                    alt={vehicleVariant.name}
                    className="w-20 h-20 object-cover rounded-md border"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 text-lg mb-2">
                  {vehicleVariant.name}
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Brand:</span>{" "}
                    {brands.find((b) => b.id === vehicleVariant.brand_id)
                      ?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">CC:</span>{" "}
                    {ccs.find((c) => c.id === vehicleVariant.cc_id)?.name ||
                      "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Fuel:</span>{" "}
                    {fuelTypes.find((f) => f.id === vehicleVariant.fuel_type_id)
                      ?.name || "N/A"}
                  </p>
                  {color && (
                    <p className="flex items-center gap-2">
                      <span className="font-medium">Color:</span>
                      <span
                        className="w-4 h-4 rounded-full border border-gray-400 shadow"
                        style={{ backgroundColor: color.color_code }}
                        title={color.name}
                      ></span>
                      <span className="text-xs">{color.name}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quantity Controls */}
            {/* <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-blue-200 rounded">
                <button
                  type="button"
                  className="px-3 py-1 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors"
                  onClick={() =>
                    updateVehicleQuantity(Math.max(1, vehicleQuantity - 1))
                  }
                  disabled={vehicleQuantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-1 min-w-8 text-center font-semibold text-blue-600">
                  {vehicleQuantity}
                </span>
                <button
                  type="button"
                  className="px-3 py-1 text-blue-600 hover:bg-blue-100 transition-colors"
                  onClick={() => updateVehicleQuantity(vehicleQuantity + 1)}
                >
                  +
                </button>
              </div>
            </div> */}

            {/* Detailed Price Breakdown */}
            <div className="bg-white rounded-lg border p-4">
              <h4 className="font-bold text-gray-800 mb-4 text-lg">
                Price Breakdown
              </h4>

              <div className="space-y-3">
                {/* Color-specific Basic Price */}
                {basicPrice > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700 font-medium">
                        {color ? `${color.name} Price` : "Basic Price"}
                      </span>
                      <span className="text-xs text-gray-500">(Per unit)</span>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">
                        ${parseFloat(basicPrice).toLocaleString()}
                      </p>
                      {vehicleQuantity > 1 && (
                        <p className="text-green-500 text-sm">
                          Total: ${totalBasicPrice.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Show base price comparison if different */}
                {/* {color &&
                  variant?.basic_price &&
                  basicPrice !== parseFloat(variant.basic_price) && (
                    <div className="flex justify-between items-center py-1 text-sm text-gray-500 bg-gray-50 rounded px-2">
                      <span>Base Variant Price:</span>
                      <div className="text-right">
                        <span className="line-through">
                          ${parseFloat(variant.basic_price).toLocaleString()}
                        </span>
                        <span
                          className={`ml-2 ${
                            basicPrice > parseFloat(variant.basic_price)
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          (
                          {basicPrice > parseFloat(variant.basic_price)
                            ? "+"
                            : ""}
                          $
                          {Math.abs(
                            basicPrice - parseFloat(variant.basic_price)
                          ).toLocaleString()}
                          )
                        </span>
                      </div>
                    </div>
                  )} */}

                {/* Rest of the price breakdown remains the same */}
                {/* ... existing ex-showroom, taxes, on-road price code ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ========== FORM HANDLING ==========

  const validateForm = () => {
    const phoneStr = String(formData.phoneNumber || "").trim();
    if (!formData.customerName?.trim()) return "Customer name is required.";
    if (!/^\d{10}$/.test(phoneStr))
      return "Valid 10-digit phone number required.";
    if (!formData.customerLocation?.trim()) return "Location is required.";
    if (!formData.quantity || formData.quantity < 1)
      return "Quantity must be at least 1.";
    if (!variant) return "Please select a vehicle variant.";
    return null;
  };

  // const handleSubmit = async (action = "submit") => {
  //   const validationError = validateForm();
  //   if (validationError) {
  //     setErrorMessage(validationError);
  //     window.scrollTo({ top: 0, behavior: "smooth" }); // SCROLL TO TOP
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

  //     const totalVehicles = allVehiclesForCurrentLead.length + 1;
  //     const currentUserId = getCurrentDealerId();

  //     const payload = {
  //       customer_name: formData.customerName.trim(),
  //       phone_no: formData.phoneNumber.trim(),
  //       location: finalLocation,
  //       area: formData.customerArea?.trim() || null,
  //       city_id: selectedCityId,
  //       area_id: selectedArea.id,
  //       executive_id: currentUserId,
  //       tentative_purchase_date: formData.purchaseDate || null,
  //       vehicle_qty: totalVehicles,
  //       payment_mode: formData.paymentMode,
  //       additional_note: formData.notes?.trim() || null,
  //       brand_id: parseInt(variant.brand_id, 10),
  //       variant_id: parseInt(variant.id, 10),
  //       lead_id: leadId || null,
  //       status: action === "save_draft" ? "Draft" : "Open",
  //       // COLOR SAVED IN DB
  //       color_id: selectedColor?.id || null,
  //       color_name: selectedColor?.name || null,
  //       color_code: selectedColor?.color_code || null,
  //     };

  //     const { data } = await axios.post(`${API_BASE}/leads`, payload, {
  //       headers: getAuthHeaders(),
  //     });

  //     if (data?.lead?.id) {
  //       const newLeadId = data.lead.id;
  //       setLeadId(newLeadId);

  //       const newVehicleEntry = {
  //         ...payload,
  //         variant,
  //         lead_id: newLeadId,
  //         id: newLeadId,
  //         color: selectedColor,
  //       };
  //       const updatedVehicles = [...allVehiclesForCurrentLead, newVehicleEntry];
  //       setAllVehiclesForCurrentLead(updatedVehicles);
  //       localStorage.setItem(
  //         "allVehiclesForCurrentLead",
  //         JSON.stringify(updatedVehicles)
  //       );

  //       // SUCCESS TOAST
  //       toast.success(`Lead #${newLeadId} created successfully!`, {
  //         duration: 4000,
  //         icon: "Success",
  //         style: {
  //           borderRadius: "10px",
  //           background: "#10b981",
  //           color: "#fff",
  //         },
  //       });

  //       if (action === "submit") {
  //         clearLocalStorageForSubmit();
  //         navigate("/leads/open", {
  //           state: {
  //             recentLead: data.lead,
  //             allLeads: updatedVehicles,
  //             submittedVariant: variant,
  //             submittedLeadId: newLeadId,
  //             submittedColor: selectedColor,
  //           },
  //         });
  //       }
  //     }
  //   } catch (err) {
  //     const msg =
  //       err.response?.data?.message || err.message || "Submission failed.";
  //     setErrorMessage(msg);
  //     window.scrollTo({ top: 0, behavior: "smooth" }); // SCROLL ON ERROR
  //     toast.error(msg);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const unitPrice = colorPrice || getVehiclePrice(variant, selectedColor);

  const handleSubmit = async (action = "submit") => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

      const finalLocation = formData.customerArea
        ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
        : formData.customerLocation.trim();

      // Calculate total quantity from all vehicles
      const totalQuantity =
        allVehiclesForCurrentLead.reduce((total, vehicle) => {
          return total + (vehicle.quantity || 1);
        }, 0) + formData.quantity;

      const currentUserId = getCurrentDealerId();

      const payload = {
        customer_name: formData.customerName.trim(),
        // phone_no: formData.phoneNumber.trim(),
        phone_no: (formData.phoneNumber || "").toString().trim(),
        location: finalLocation,
        area: formData.customerArea?.trim() || null,
        city_id: selectedCityId,
        area_id: selectedArea.id,
        executive_id: currentUserId,
        tentative_purchase_date: formData.purchaseDate || null,
        // quantity: formData.quantity,
        // vehicle_qty: totalQuantity,
        unit_price: unitPrice, // Add unit price based on color
        total_price: unitPrice * formData.quantity,
        vehicle_qty: totalQuantity,
        current_vehicle_qty: formData.quantity,
        payment_mode: formData.paymentMode,
        additional_note: formData.notes?.trim() || null,
        brand_id: parseInt(variant.brand_id, 10),
        variant_id: parseInt(variant.id, 10),
        lead_id: leadId || null,
        status: action === "save_draft" ? "Draft" : "Open",
        color_id: selectedColor?.id || null,
        color_name: selectedColor?.name || null,
        color_code: selectedColor?.color_code || null,
      };

      console.log(
        "Submitting payload with total quantity:",
        payload.vehicle_qty
      );

      const { data } = await axios.post(`${API_BASE}/leads`, payload, {
        headers: getAuthHeaders(),
      });

      if (data?.lead?.id) {
        const newLeadId = data.lead.id;
        setLeadId(newLeadId);

        const newVehicleEntry = {
          ...payload,
          variant,
          lead_id: newLeadId,
          id: newLeadId,
          color: selectedColor,
          quantity: formData.quantity, // Store quantity with vehicle
        };
        const updatedVehicles = [...allVehiclesForCurrentLead, newVehicleEntry];
        setAllVehiclesForCurrentLead(updatedVehicles);
        localStorage.setItem(
          "allVehiclesForCurrentLead",
          JSON.stringify(updatedVehicles)
        );

        toast.success(`Lead #${newLeadId} created successfully!`, {
          duration: 4000,
          icon: "Success",
          style: {
            borderRadius: "10px",
            background: "#10b981",
            color: "#fff",
          },
        });

        if (action === "submit") {
          clearLocalStorageForSubmit();
          navigate("/leads/open", {
            state: {
              recentLead: data.lead,
              allLeads: updatedVehicles,
              submittedVariant: variant,
              submittedLeadId: newLeadId,
              submittedColor: selectedColor,
            },
          });
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Submission failed.";
      setErrorMessage(msg);
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSaveDraft = async () => {
  //   const validationError = validateForm();
  //   if (validationError) {
  //     setErrorMessage(validationError);
  //     return;
  //   }

  //   const selectedArea = dealerAssignedAreas.find(
  //     (area) => area.name === formData.customerArea
  //   );
  //   if (!selectedArea || !selectedCityId) {
  //     setErrorMessage("Please select valid area and city.");
  //     return;
  //   }

  //   const finalLocation = formData.customerArea
  //     ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
  //     : formData.customerLocation.trim();

  //   const totalVehicles = allVehiclesForCurrentLead.length + 1;
  //   const currentUserId = getCurrentDealerId();

  //   const payload = {
  //     customer_name: formData.customerName.trim(),
  //     phone_no: formData.phoneNumber.trim(),
  //     location: finalLocation || null,
  //     area: formData.customerArea?.trim() || null,
  //     city_id: selectedCityId,
  //     area_id: selectedArea.id,
  //     executive_id: currentUserId,
  //     tentative_purchase_date: formData.purchaseDate || null,
  //     vehicle_qty: totalVehicles,
  //     payment_mode: formData.paymentMode,
  //     additional_note: formData.notes?.trim() || null,
  //     brand_id: parseInt(variant.brand_id, 10),
  //     variant_id: parseInt(variant.id, 10),
  //     lead_id: leadId || null,
  //     status: "Draft",
  //   };

  //   try {
  //     const { data } = await axios.post(`${API_BASE}/leads`, payload, {
  //       headers: getAuthHeaders(),
  //     });
  //     if (data?.lead?.id) {
  //       const newLeadId = data.lead.id;
  //       setLeadId(newLeadId);
  //       const updatedVehicles = [
  //         ...allVehiclesForCurrentLead.map((v) => ({ ...v, status: "Draft" })),
  //         { ...payload, variant, lead_id: newLeadId, status: "Draft" },
  //       ];
  //       setAllVehiclesForCurrentLead(updatedVehicles);
  //       localStorage.setItem(
  //         "allVehiclesForCurrentLead",
  //         JSON.stringify(updatedVehicles)
  //       );
  //       localStorage.removeItem("existingCustomerData");
  //       localStorage.removeItem("leadId");
  //       alert("Draft saved!");
  //       navigate("/dashboard");
  //     }
  //   } catch (err) {
  //     setErrorMessage(err.response?.data?.message || "Draft failed.");
  //   }
  // };

  const handleSaveDraft = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

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

    // FIX: Use the actual quantity from form input
    const totalVehicles = parseInt(formData.quantity, 10) || 1;
    const currentUserId = getCurrentDealerId();

    const payload = {
      customer_name: formData.customerName.trim(),
      phone_no: formData.phoneNumber.trim(),
      location: finalLocation || null,
      area: formData.customerArea?.trim() || null,
      city_id: selectedCityId,
      area_id: selectedArea.id,
      executive_id: currentUserId,
      tentative_purchase_date: formData.purchaseDate || null,
      vehicle_qty: totalVehicles,
      current_vehicle_qty: formData.quantity || 1,
      payment_mode: formData.paymentMode,
      additional_note: formData.notes?.trim() || null,
      brand_id: parseInt(variant.brand_id, 10),
      variant_id: parseInt(variant.id, 10),
      lead_id: leadId || null,
      status: "Draft",
      // ADD COLOR INFORMATION FOR DRAFT
      color_id: selectedColor?.id || null,
      color_name: selectedColor?.name || null,
      color_code: selectedColor?.color_code || null,
    };

    try {
      const { data } = await axios.post(`${API_BASE}/leads`, payload, {
        headers: getAuthHeaders(),
      });
      if (data?.lead?.id) {
        const newLeadId = data.lead.id;
        setLeadId(newLeadId);
        const updatedVehicles = [
          ...allVehiclesForCurrentLead.map((v) => ({ ...v, status: "Draft" })),
          {
            ...payload,
            variant,
            lead_id: newLeadId,
            status: "Draft",
            color: selectedColor, // Include color in local state
          },
        ];
        setAllVehiclesForCurrentLead(updatedVehicles);
        localStorage.setItem(
          "allVehiclesForCurrentLead",
          JSON.stringify(updatedVehicles)
        );
        localStorage.removeItem("existingCustomerData");
        localStorage.removeItem("leadId");
        toast.success("Draft saved successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Draft failed.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  

  const addNewVehicle = async () => {
    try {
      let currentLeadId = leadId;

      // Get the selected area for city_id
      const selectedArea = dealerAssignedAreas.find(
        (area) => area.name === formData.customerArea?.trim()
      );
      const totalQuantity =
        allVehiclesForCurrentLead.reduce((total, vehicle) => {
          return total + (vehicle.quantity || 1);
        }, 0) + formData.quantity;

      // Validate required fields before proceeding
      if (
        !formData.customerName?.trim() ||
        !formData.phoneNumber?.trim() ||
        !formData.customerLocation?.trim()
      ) {
        setErrorMessage(
          "Please fill in all required customer details before adding another vehicle."
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (!selectedArea) {
        setErrorMessage(
          "Please select a valid area before adding another vehicle."
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (!selectedArea.city_id || !selectedArea.id) {
        setErrorMessage("Selected area is missing city or ID information.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (!currentLeadId) {
        // Create new lead with ACTUAL QUANTITY from form
        const payload = {
          customer_name: formData.customerName.trim(),
          phone_no: formData.phoneNumber.trim(),
          location: formData.customerLocation.trim(),
          area: formData.customerArea || null,
          city_id: selectedArea.city_id,
          area_id: selectedArea.id,
          executive_id: getCurrentDealerId(),
          tentative_purchase_date: formData.purchaseDate || null, // PRESERVE DATE

          vehicle_qty: totalQuantity,
          current_vehicle_qty: formData.quantity,
          // vehicle_qty: totalQuantity || 1,
          payment_mode: formData.paymentMode,
          additional_note: formData.notes?.trim() || null,
          brand_id: parseInt(variant.brand_id, 10),
          variant_id: parseInt(variant.id, 10),
          status: "Draft",
          color_id: selectedColor?.id || null,
          color_name: selectedColor?.name || null,
          color_code: selectedColor?.color_code || null,
        };

        const { data } = await axios.post(`${API_BASE}/leads`, payload, {
          headers: getAuthHeaders(),
        });

        if (data?.lead?.id) {
          currentLeadId = data.lead.id;
          setLeadId(currentLeadId);

          // Store the initial vehicle with quantity
          const initialVehicle = {
            ...payload,
            variant,
            lead_id: currentLeadId,
            id: currentLeadId,
            color: selectedColor,
            quantity: formData.quantity, // STORE QUANTITY WITH VEHICLE
          };

          setAllVehiclesForCurrentLead([initialVehicle]);
          localStorage.setItem(
            "allVehiclesForCurrentLead",
            JSON.stringify([initialVehicle])
          );
        } else {
          throw new Error("Failed to create lead");
        }
      }

      // Add the new vehicle to existing lead
      if (currentLeadId) {
        const vehiclePayload = {
          brand_id: parseInt(variant.brand_id, 10),
          variant_id: parseInt(variant.id, 10),
          status: "Draft",
          area_id: selectedArea?.id || null,
          city_id: selectedArea?.city_id || null,
          color_id: selectedColor?.id || null,
          color_name: selectedColor?.name || null,
          color_code: selectedColor?.color_code || null,
        };

        await axios.post(
          `${API_BASE}/leads/${currentLeadId}/vehicles`,
          vehiclePayload,
          { headers: getAuthHeaders() }
        );

        // Update local state with quantity
        const newVehicle = {
          variant,
          status: "Draft",
          brand_id: parseInt(variant.brand_id, 10),
          variant_id: parseInt(variant.id, 10),
          area_id: selectedArea?.id || null,
          city_id: selectedArea?.city_id || null,
          color: selectedColor,
          quantity: formData.quantity, // INCLUDE QUANTITY
        };

        const updated = [...allVehiclesForCurrentLead, newVehicle];
        setAllVehiclesForCurrentLead(updated);
        localStorage.setItem(
          "allVehiclesForCurrentLead",
          JSON.stringify(updated)
        );

        // Store COMPLETE customer data for continuity - PRESERVE DATE
        const customerDataToStore = {
          customer_name: formData.customerName,
          phone_no: formData.phoneNumber,
          location: formData.customerLocation,
          area: formData.customerArea,
          purchase_date: formData.purchaseDate, // PRESERVE DATE
          payment_mode: formData.paymentMode,
          quantity: parseInt(formData.quantity, 10) || 1,
          notes: formData.notes,
          lead_id: currentLeadId,
          timestamp: Date.now(),
          area_id: selectedArea?.id,
          city_id: selectedArea?.city_id,
          selected_color: selectedColor,
        };

        localStorage.setItem(
          "existingCustomerData",
          JSON.stringify(customerDataToStore)
        );

        // Navigate to generate new vehicle
        navigate("/leads/generate", {
          state: {
            isAddingAnotherVehicle: true,
            leadId: currentLeadId,
            customerData: customerDataToStore,
            preserveFormData: true,
          },
          replace: true,
        });
      }
    } catch (err) {
      console.error("Add vehicle failed:", err.response?.data);
      const errorMsg =
        err.response?.data?.message ||
        "Failed to add vehicle. Please check if all required fields are filled.";
      setErrorMessage(errorMsg);
      window.scrollTo({ top: 0, behavior: "smooth" });

      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const clearLocalStorageForSubmit = () => {
    const keys = [
      "leadId",
      "draftLead",
      "recentSubmittedLead",
      "existingCustomerData",
      "allVehiclesForCurrentLead",
    ];
    keys.forEach((key) => localStorage.removeItem(key));
    setStoredLeads([]);
    setAllVehiclesForCurrentLead([]);
  };

  // ========== LOCATION HANDLING ==========

  const fetchLocations = async (searchText) => {
    if (!searchText || searchText.trim().length < 2) {
      setLocations([]);
      setShowLocationDropdown(false);
      return;
    }
    try {
      setLoadingLocations(true);
      const response = await axios.get(`${API_BASE}/admin/areas`, {
        headers: getAuthHeaders(),
        params: { search: searchText.trim() },
      });
      let locationsData = response.data.data || response.data || [];
      const uniqueCities = [];
      const cityMap = new Map();
      locationsData.forEach((area) => {
        const cityName = area.city_name || area.name;
        if (cityName && !cityMap.has(cityName)) {
          cityMap.set(cityName, true);
          uniqueCities.push({
            id: area.id,
            name: cityName,
            city_name: cityName,
            state_name: area.state_name,
          });
        }
      });
      setLocations(uniqueCities);
      setShowLocationDropdown(uniqueCities.length > 0);
    } catch (err) {
      setLocations([]);
      setShowAreaDropdown(false);
      setErrorMessage("Failed to load locations.");
    } finally {
      setLoadingLocations(false);
    }
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      customerLocation: location.city_name || location.name,
      customerArea: "",
    }));
    setLocationSearchText(location.city_name || location.name);
    setSelectedCityId(location.id); // SET CITY ID
    setShowLocationDropdown(false);
    setLocations([]);
  };

  const handleAreaSelect = (area) => {
    setFormData((prev) => ({ ...prev, customerArea: area.name }));
    setSelectedAreaId(area.id);
    setShowAreaDropdown(false);
  };

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setFormData((prev) => ({ ...prev, [id || name]: value }));
    setErrorMessage(null);
  };

  const handleLocationSearchChange = (e) => {
    const value = e.target.value;
    setLocationSearchText(value);
    setShowLocationDropdown(true);
    if (!value.trim()) {
      setFormData((prev) => ({
        ...prev,
        customerLocation: "",
        customerArea: "",
      }));
      setLocations([]);
      setShowLocationDropdown(false);
    }
  };

  const handleCheckboxChange = (e) => {
    setUseSameCustomerDetails(e.target.checked);
  };

  // ========== USE EFFECTS ==========

  useEffect(() => {
    localStorage.removeItem("leadId");
    localStorage.removeItem("draftLead");
    setLeadId(null);
    setLeadDetails(null);
    setSelectedCityId(null); // Reset

    const stored = localStorage.getItem("recentSubmittedLead");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setStoredLeads(parsed);
      } catch (err) {}
    }

    const draft = localStorage.getItem("draftLead");
    if (draft) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(draft) }));
      } catch (err) {}
    }

    const vehiclesStored = localStorage.getItem("allVehiclesForCurrentLead");
    if (vehiclesStored && location.state?.isAddingAnotherVehicle) {
      try {
        setAllVehiclesForCurrentLead(JSON.parse(vehiclesStored));
      } catch (err) {}
    }
  }, []);

  useEffect(() => {
    if (location.state?.isAddingAnotherVehicle && leadId) {
      document.getElementById("customerName")?.setAttribute("disabled", true);
      document.getElementById("locationSearch")?.setAttribute("disabled", true);
      document.getElementById("customerArea")?.setAttribute("disabled", true);
      document.getElementById("purchaseDate")?.setAttribute("enabled", true);
      document
        .querySelector('input[name="paymentMode"][value="cash"]')
        ?.setAttribute("disabled", true);
      document
        .querySelector('input[name="paymentMode"][value="finance"]')
        ?.setAttribute("disabled", true);
      document.getElementById("quantity")?.setAttribute("enabled", true);
      setErrorMessage(
        "Customer details locked - Adding another vehicle to existing lead"
      );

      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
  }, [location.state?.isAddingAnotherVehicle, leadId]);

  // useEffect(() => {
  //   const loadExistingCustomerData = () => {
  //     const storedCustomerData = localStorage.getItem("existingCustomerData");
  //     const isNewLead = !location.state?.isAddingAnotherVehicle;

  //     if (isNewLead) {
  //       localStorage.removeItem("existingCustomerData");
  //       localStorage.removeItem("leadId");
  //       localStorage.removeItem("allVehiclesForCurrentLead");
  //       setAllVehiclesForCurrentLead([]);
  //       setSelectedCityId(null);
  //       setFormData({
  //         customerName: "",
  //         phoneNumber: "",
  //         customerLocation: "",
  //         customerArea: "",
  //         purchaseDate: "",
  //         quantity: 1,
  //         paymentMode: "cash",
  //         notes: "",
  //       });
  //       setLeadId(null);
  //       return;
  //     }

  //     if (storedCustomerData && location.state?.isAddingAnotherVehicle) {
  //       try {
  //         const customerData = JSON.parse(storedCustomerData);
  //         const isRecent =
  //           new Date().getTime() - customerData.timestamp < 10 * 60 * 1000;
  //         if (isRecent) {
  //           setFormData((prev) => ({
  //             ...prev,
  //             customerName: customerData.customer_name || "",
  //             phoneNumber: customerData.phone_no || "",
  //             customerLocation: customerData.location || "",
  //             customerArea: customerData.area || "",
  //             purchaseDate: customerData.purchase_date || "",
  //             paymentMode: customerData.payment_mode || "cash",
  //             quantity: customerData.quantity || 1,
  //           }));
  //           setLocationSearchText(customerData.location || "");
  //           setSelectedCityId(customerData.city_id || null); // RESTORE CITY ID

  //           const finalLeadId = customerData.lead_id || location.state?.leadId;
  //           if (finalLeadId) {
  //             setLeadId(finalLeadId);
  //             localStorage.setItem("leadId", finalLeadId);
  //           }

  //           const vehiclesStored = localStorage.getItem(
  //             "allVehiclesForCurrentLead"
  //           );
  //           if (vehiclesStored) {
  //             try {
  //               setAllVehiclesForCurrentLead(JSON.parse(vehiclesStored));
  //             } catch (err) {}
  //           }
  //         } else {
  //           localStorage.removeItem("existingCustomerData");
  //         }
  //       } catch (err) {
  //         localStorage.removeItem("existingCustomerData");
  //       }
  //     }
  //   };
  //   loadExistingCustomerData();
  // }, [location.state]);

  useEffect(() => {
    const loadExistingCustomerData = () => {
      const storedCustomerData = localStorage.getItem("existingCustomerData");
      const isNewLead = !location.state?.isAddingAnotherVehicle;

      if (isNewLead) {
        localStorage.removeItem("existingCustomerData");
        localStorage.removeItem("leadId");
        localStorage.removeItem("allVehiclesForCurrentLead");
        setAllVehiclesForCurrentLead([]);
        setSelectedCityId(null);

        // IMPORTANT: Use the quantity from location.state if available
        const initialQuantity = quantity || 1;

        setFormData({
          customerName: "",
          phoneNumber: "",
          customerLocation: "",
          customerArea: "",
          purchaseDate: "",
          quantity: initialQuantity, // Use the passed quantity
          paymentMode: "cash",
          notes: "",
        });
        setLeadId(null);
        setLocationSearchText("");
        return;
      }

      if (storedCustomerData && location.state?.isAddingAnotherVehicle) {
        try {
          const customerData = JSON.parse(storedCustomerData);
          const isRecent =
            new Date().getTime() - customerData.timestamp < 10 * 60 * 1000;

          if (isRecent) {
            // Format date properly
            let formattedDate = "";
            if (customerData.purchase_date) {
              if (/^\d{4}-\d{2}-\d{2}$/.test(customerData.purchase_date)) {
                formattedDate = customerData.purchase_date;
              } else {
                const date = new Date(customerData.purchase_date);
                if (!isNaN(date.getTime())) {
                  formattedDate = date.toISOString().split("T")[0];
                }
              }
            }

            // PRIORITIZE QUANTITY FROM MODELDETAILS OVER STORED DATA
            const finalQuantity = quantity || customerData.quantity || 1;

            setFormData((prev) => ({
              ...prev,
              customerName: customerData.customer_name || "",
              phoneNumber: customerData.phone_no || "",
              customerLocation: customerData.location || "",
              customerArea: customerData.area || "",
              purchaseDate: formattedDate,
              paymentMode: customerData.payment_mode || "cash",
              quantity: finalQuantity, // Use the passed quantity
              notes: customerData.notes || "",
            }));

            setLocationSearchText(customerData.location || "");
            setSelectedCityId(customerData.city_id || null);

            const finalLeadId = customerData.lead_id || location.state?.leadId;
            if (finalLeadId) {
              setLeadId(finalLeadId);
              localStorage.setItem("leadId", finalLeadId);
            }

            const vehiclesStored = localStorage.getItem(
              "allVehiclesForCurrentLead"
            );
            if (vehiclesStored) {
              try {
                setAllVehiclesForCurrentLead(JSON.parse(vehiclesStored));
              } catch (err) {
                console.error("Error parsing stored vehicles:", err);
              }
            }
          } else {
            localStorage.removeItem("existingCustomerData");
          }
        } catch (err) {
          console.error("Error loading customer data:", err);
          localStorage.removeItem("existingCustomerData");
        }
      }
    };

    loadExistingCustomerData();
  }, [location.state, quantity]); // Add quantity to dependency array

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = getAuthHeaders();
        const [brandsRes, ccsRes, fuelRes, galleriesRes] = await Promise.all([
          axios.get(`${API_BASE}/brands`, { headers }),
          axios.get(`${API_BASE}/ccs`, { headers }),
          axios.get(`${API_BASE}/fuel-types`, { headers }),
          axios.get(`${API_BASE}/galleries`, { headers }),
        ]);
        setBrands(brandsRes.data.data || brandsRes.data || []);
        setCcs(ccsRes.data.data || ccsRes.data || []);
        setFuelTypes(fuelRes.data.data || fuelRes.data || []);
        setGalleries(galleriesRes.data.data || galleriesRes.data || []);
      } catch (err) {}
    };
    fetchData();
  }, [variant]);

  useEffect(() => {
    const loadLead = async () => {
      if (!leadId) return;
      try {
        const res = await axios.get(`${API_BASE}/leads/${leadId}`, {
          headers: getAuthHeaders(),
        });
        const data = res.data.data || res.data;
        setLeadDetails(data);
      } catch (err) {
        localStorage.removeItem("leadId");
        setLeadId(null);
        setLeadDetails(null);
      }
    };
    loadLead();
  }, [leadId]);

  useEffect(() => {
    if (leadDetails && !localStorage.getItem("draftLead")) {
      setFormData({
        customerName: leadDetails.customer_name || "",
        phoneNumber: leadDetails.phone_no || "",
        customerLocation: leadDetails.location || "",
        customerArea: leadDetails.area || "",
        purchaseDate: leadDetails.tentative_purchase_date || "",
        quantity: leadDetails.vehicle_qty || 1,
        paymentMode: leadDetails.payment_mode || "cash",
        notes: leadDetails.additional_note || "",
      });
    }
  }, [leadDetails]);

  useEffect(() => {
    if (useSameCustomerDetails && storedLeads.length > 0) {
      const latestLead = storedLeads[storedLeads.length - 1];
      setFormData((prev) => ({
        ...prev,
        customerName: latestLead.customer_name || "",
        phoneNumber: latestLead.phone_no || "",
        customerLocation: latestLead.location || "",
        customerArea: latestLead.area || "",
        purchaseDate: latestLead.tentative_purchase_date || "",
        quantity: latestLead.vehicle_qty || 1,
        paymentMode: latestLead.payment_mode || "cash",
        notes: latestLead.additional_note || "",
      }));
    }
  }, [useSameCustomerDetails, storedLeads]);

  useEffect(() => {
    if (formData.customerLocation) {
      fetchDealerAreas(formData.customerLocation);
    } else {
      setDealerAssignedAreas([]);
      setShowAreaDropdown(false);
    }
  }, [formData.customerLocation]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (locationSearchText && locationSearchText.trim().length >= 2) {
        fetchLocations(locationSearchText);
      } else {
        setLocations([]);
        setShowLocationDropdown(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [locationSearchText]);

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

  // ========== RENDER ==========

  return (
    <div className="m-4">
      <Stepper step={3} />

      {/* Vehicles Overlay */}
      {showVehiclesOverlay && renderVehiclesOverlay()}

      {showVehiclePopup &&
        selectedVehicleForPopup &&
        renderVehiclePopup(
          selectedVehicleForPopup.vehicle,
          selectedVehicleForPopup.index,
          selectedVehicleForPopup.isCurrent
        )}

      {/* Rest of your JSX remains the same */}
      {/* {leadId && (
        <p className="text-green-600 font-semibold mb-4 text-sm sm:text-base">
          Current Lead ID: {leadId}
        </p>
      )}
      {leadId && (
        <p className="text-green-600 font-semibold mb-4 text-sm sm:text-base">
          Current Lead ID: {leadId}
        </p>
      )} */}
      {errorMessage && (
        <p className="text-red-600 font-semibold mb-4 text-sm sm:text-base">
          {errorMessage}
        </p>
      )}

      <div className="bg-[#0f66af] text-white rounded-t-xl px-4 sm:px-6 py-3 mt-4 sm:mt-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold">
          New Lead Information
        </h3>
      </div>

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-200 transition-colors flex items-center"
          >
            ← Back
          </button>
        </div>

        {/* Selected Vehicles Preview */}
        {renderSelectedVehiclesPreview()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="customerName"
                className="block font-medium mb-1 text-sm sm:text-base"
              >
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block font-medium mb-1 text-sm sm:text-base"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
                required
                pattern="\d{10}"
              />
            </div>

            <div className="relative location-search-container">
              <label
                htmlFor="locationSearch"
                className="block font-medium mb-1 text-sm sm:text-base"
              >
                Location (City) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="locationSearch"
                  value={locationSearchText}
                  onChange={handleLocationSearchChange}
                  placeholder="Search for city (e.g., Pune, Mumbai)"
                  className="w-full border p-2.5 rounded-lg pr-10 text-sm sm:text-base"
                  required
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {loadingLocations ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {showLocationDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {locations.length > 0 ? (
                    locations.map((location) => (
                      <div
                        key={location.id}
                        className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <div className="font-medium text-sm sm:text-base">
                          {location.city_name || location.name}
                        </div>
                        {location.state_name && (
                          <div className="text-xs text-gray-500">
                            {location.state_name}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-3 sm:px-4 py-2 text-gray-500 text-center text-sm sm:text-base">
                      {locationSearchText && locationSearchText.length >= 2
                        ? loadingLocations
                          ? "Searching..."
                          : "No locations found"
                        : "Type at least 2 characters to search"}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative area-select-container">
              <label
                htmlFor="customerArea"
                className="block font-medium mb-1 text-sm sm:text-base"
              >
                Area{" "}
                <span className="text-gray-500 text-xs sm:text-sm">
                  {getCurrentDealerId() ? "(Dealer Assigned)" : "(All Areas)"}
                </span>
                <span className="text-red-500">*</span>
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
                  placeholder={
                    formData.customerLocation
                      ? getCurrentDealerId()
                        ? "Select your assigned area"
                        : "Select area"
                      : "Select a city first"
                  }
                  className={`w-full border p-2.5 rounded-lg pr-10 text-sm sm:text-base ${
                    !formData.customerLocation
                      ? "bg-gray-100 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  readOnly
                  disabled={!formData.customerLocation}
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() =>
                    formData.customerLocation &&
                    setShowAreaDropdown(!showAreaDropdown)
                  }
                >
                  {loadingDealerAreas ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {showAreaDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {dealerAssignedAreas.length > 0 ? (
                    <>
                      <div className="px-3 py-2 text-xs text-green-600 bg-green-50 border-b">
                        {getCurrentDealerId()
                          ? `Your assigned areas for ${formData.customerLocation}`
                          : `All areas for ${formData.customerLocation}`}
                      </div>
                      {dealerAssignedAreas.map((area) => (
                        <div
                          key={area.id}
                          className="px-3 sm:px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                          onClick={() => handleAreaSelect(area)}
                        >
                          <div className="font-medium text-sm sm:text-base">
                            {area.name}
                          </div>
                          {area.city_name && (
                            <div className="text-xs text-gray-500">
                              {area.city_name}
                              {area.state_name && `, ${area.state_name}`}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="px-3 sm:px-4 py-2 text-gray-500 text-center text-sm sm:text-base">
                      {formData.customerLocation
                        ? loadingDealerAreas
                          ? "Loading areas..."
                          : "No areas found for this location"
                        : "Select a location first"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="purchaseDate"
                className="block font-medium mb-1 text-sm sm:text-base"
              >
                Tentative Purchase Date<span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
                min={new Date().toISOString().split("T")[0]} // This blocks past dates
              />
            </div>

            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3 sm:gap-4">
                <label className="flex items-center text-sm sm:text-base">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="cash"
                    checked={formData.paymentMode === "cash"}
                    onChange={handleChange}
                    className="mr-2"
                    required
                  />{" "}
                  Cash
                </label>
                <label className="flex items-center text-sm sm:text-base">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="finance"
                    checked={formData.paymentMode === "finance"}
                    onChange={handleChange}
                    className="mr-2"
                  />{" "}
                  Finance
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="notes"
            className="block font-medium mb-1 text-sm sm:text-base"
          >
            Additional Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional notes..."
            rows="3"
            className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
          />
        </div>

        {storedLeads.length > 0 && (
          <div className="mb-6">
            <label className="flex items-center text-sm sm:text-base">
              <input
                type="checkbox"
                checked={useSameCustomerDetails}
                onChange={handleCheckboxChange}
                className="mr-2"
              />{" "}
              Auto-Fill
            </label>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={handleSaveDraft}
            className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors order-2 sm:order-1"
          >
            Save as Draft
          </button>
          <button
            onClick={addNewVehicle}
            className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors order-3 sm:order-2"
          >
            Add Another Vehicle
          </button>
          <button
            onClick={() => handleSubmit("submit")}
            disabled={isSubmitting}
            className={`relative bg-primary-blue text-white rounded-lg px-6 py-3 font-medium flex items-center justify-center transition-all ${
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
              "Submit Lead"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadInformation;
