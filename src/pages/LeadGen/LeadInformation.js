// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Stepper from "../../components/Stepper";
// import axios from "axios";
// import toast from "react-hot-toast";

// const LeadInformation = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { variant, selectedColor, quantity, colorPrice } = location.state || {};
//   const [formData, setFormData] = useState({
//     customerName: "",
//     phoneNumber: "",
//     customerLocation: "",
//     customerArea: "",
//     purchaseDate: "",
//     quantity: quantity || 1,
//     paymentMode: "cash",
//     notes: "",
//   });

//   const [leadId, setLeadId] = useState(localStorage.getItem("leadId") || null);
//   const [leadDetails, setLeadDetails] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [brands, setBrands] = useState([]);
//   const [fuelTypes, setFuelTypes] = useState([]);
//   const [ccs, setCcs] = useState([]);
//   const [galleries, setGalleries] = useState([]);
//   const [areas, setAreas] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [storedLeads, setStoredLeads] = useState([]);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [useSameCustomerDetails, setUseSameCustomerDetails] = useState(false);
//   const [loadingAreas, setLoadingAreas] = useState(false);
//   const [loadingLocations, setLoadingLocations] = useState(false);
//   const [showAreaDropdown, setShowAreaDropdown] = useState(false);
//   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
//   const [locationSearchText, setLocationSearchText] = useState("");
//   const [selectedAreaId, setSelectedAreaId] = useState(null);
//   const [selectedVehicleForPopup, setSelectedVehicleForPopup] = useState(null);
//   const [showVehiclePopup, setShowVehiclePopup] = useState(false);
//   const [variantColorPrices, setVariantColorPrices] = useState({});

//   // Dealer mapping states
//   const [dealerAssignedAreas, setDealerAssignedAreas] = useState([]);
//   const [loadingDealerAreas, setLoadingDealerAreas] = useState(false);

//   // NEW: Dealer distributor mapping states
//   const [assignedDealerId, setAssignedDealerId] = useState(null);
//   const [assignedDistributorId, setAssignedDistributorId] = useState(null);
//   const [assignedDealerName, setAssignedDealerName] = useState("");
//   const [assignedDistributorName, setAssignedDistributorName] = useState("");
//   const [loadingDealerMapping, setLoadingDealerMapping] = useState(false);

//   // Vehicle management state
//   const [allVehiclesForCurrentLead, setAllVehiclesForCurrentLead] = useState(
//     []
//   );
//   const [selectedCityId, setSelectedCityId] = useState(null);
//   const [showVehiclesOverlay, setShowVehiclesOverlay] = useState(false);

//   const API_BASE = "http://localhost:8000/api";

//   const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   // ========== DEALER MAPPING FUNCTIONS ==========

//   const getCurrentDealerId = () => {
//     const possibleUserDataKeys = [
//       "userData",
//       "user",
//       "currentUser",
//       "authUser",
//       "userInfo",
//     ];
//     for (const key of possibleUserDataKeys) {
//       const storedData = localStorage.getItem(key);
//       if (storedData) {
//         try {
//           const user = JSON.parse(storedData);
//           if (user.id) return user.id;
//           if (user.user_id) return user.user_id;
//           if (user.dealer_id) return user.dealer_id;
//           if (user.userId) return user.userId;
//         } catch (err) {}
//       }
//     }

//     const authToken = localStorage.getItem("authToken");
//     if (authToken) {
//       try {
//         const payload = JSON.parse(atob(authToken.split(".")[1]));
//         if (payload.user_id) return payload.user_id;
//         if (payload.id) return payload.id;
//         if (payload.sub) return payload.sub;
//       } catch (err) {}
//     }

//     for (const key of possibleUserDataKeys) {
//       const storedData = sessionStorage.getItem(key);
//       if (storedData) {
//         try {
//           const user = JSON.parse(storedData);
//           if (user.id) return user.id;
//           if (user.user_id) return user.user_id;
//         } catch (err) {}
//       }
//     }

//     return null;
//   };

//   // NEW: Fetch dealer and distributor mapping
//   const fetchDealerDistributorMapping = async (areaId, cityId) => {
//     if (!areaId || !cityId) {
//       setAssignedDealerId(null);
//       setAssignedDistributorId(null);
//       setAssignedDealerName("");
//       setAssignedDistributorName("");
//       return;
//     }

//     try {
//       setLoadingDealerMapping(true);
//       const response = await axios.get(
//         `${API_BASE}/dealer/distributor-mapping`,
//         {
//           headers: getAuthHeaders(),
//           params: {
//             area_id: areaId,
//             city_id: cityId,
//           },
//         }
//       );

//       if (response.data.success) {
//         setAssignedDealerId(response.data.dealer_id);
//         setAssignedDistributorId(response.data.distributor_id);
//         setAssignedDealerName(response.data.dealer_name);
//         setAssignedDistributorName(response.data.distributor_name);

//         toast.success(`Dealer assigned: ${response.data.dealer_name}`);
//       } else {
//         setAssignedDealerId(null);
//         setAssignedDistributorId(null);
//         setAssignedDealerName("");
//         setAssignedDistributorName("");
//         console.warn("No dealer mapping found for this area");
//       }
//     } catch (error) {
//       console.error("Error fetching dealer mapping:", error);
//       setAssignedDealerId(null);
//       setAssignedDistributorId(null);
//       setAssignedDealerName("");
//       setAssignedDistributorName("");
//     } finally {
//       setLoadingDealerMapping(false);
//     }
//   };

//   const fetchDealerAreas = async (cityName) => {
//     if (!cityName || cityName.trim().length === 0) {
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//       return;
//     }

//     try {
//       setLoadingDealerAreas(true);
//       const dealerId = getCurrentDealerId();

//       if (!dealerId) {
//         await fetchAllAreasForCity(cityName);
//         return;
//       }

//       const cityResponse = await axios.get(`${API_BASE}/admin/areas`, {
//         headers: getAuthHeaders(),
//         params: { search: cityName.trim() },
//       });

//       let citiesData = [];
//       if (cityResponse.data && cityResponse.data.data) {
//         citiesData = cityResponse.data.data;
//       } else if (Array.isArray(cityResponse.data)) {
//         citiesData = cityResponse.data;
//       }

//       const selectedCity = citiesData.find(
//         (area) => (area.city_name || area.name) === cityName
//       );

//       if (!selectedCity) {
//         setDealerAssignedAreas([]);
//         setShowAreaDropdown(false);
//         return;
//       }

//       const cityId = selectedCity.id;

//       try {
//         const dealerAreasResponse = await axios.get(
//           `${API_BASE}/dealer-areas`,
//           {
//             headers: getAuthHeaders(),
//             params: { dealer_id: dealerId, city_id: cityId },
//           }
//         );

//         let dealerAreas = [];
//         if (dealerAreasResponse.data && dealerAreasResponse.data.data) {
//           dealerAreas = dealerAreasResponse.data.data;
//         } else if (Array.isArray(dealerAreasResponse.data)) {
//           dealerAreas = dealerAreasResponse.data;
//         }

//         if (dealerAreas.length > 0 && dealerAreas[0].area_id) {
//           const areaIds = dealerAreas[0].area_id
//             .split(",")
//             .map((id) => id.trim());
//           const areasResponse = await axios.get(`${API_BASE}/admin/areas`, {
//             headers: getAuthHeaders(),
//           });
//           let allAreas = areasResponse.data.data || areasResponse.data || [];

//           const filteredAreas = allAreas.filter(
//             (area) =>
//               areaIds.includes(area.id.toString()) &&
//               (area.city_name || area.name) === cityName
//           );

//           setDealerAssignedAreas(filteredAreas);
//           setShowAreaDropdown(filteredAreas.length > 0);
//         } else {
//           await fetchAllAreasForCity(cityName);
//         }
//       } catch (dealerApiError) {
//         await fetchAllAreasForCity(cityName);
//       }
//     } catch (err) {
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//       await fetchAllAreasForCity(cityName);
//     } finally {
//       setLoadingDealerAreas(false);
//     }
//   };

//   const fetchAllAreasForCity = async (cityName) => {
//     try {
//       setLoadingAreas(true);
//       const response = await axios.get(`${API_BASE}/admin/areas`, {
//         headers: getAuthHeaders(),
//         params: { search: cityName.trim() },
//       });

//       let areasData = response.data.data || response.data || [];
//       const cityAreas = areasData.filter(
//         (area) => (area.city_name || area.name) === cityName
//       );

//       setDealerAssignedAreas(cityAreas);
//       setShowAreaDropdown(cityAreas.length > 0);
//     } catch (err) {
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//     } finally {
//       setLoadingAreas(false);
//     }
//   };

//   // ========== VEHICLE DISPLAY FUNCTIONS ==========

//   const getVehicleImage = (variant, color = null) => {
//     if (!variant) return null;

//     // Filter galleries by variant_id AND color_id if color is provided
//     let gallery;
//     if (color && color.id) {
//       gallery = galleries.find(
//         (g) => g.variant_id === variant.id && g.color_id === color.id
//       );
//     }

//     // Fallback to any gallery for this variant if no color-specific gallery found
//     if (!gallery) {
//       gallery = galleries.find((g) => g.variant_id === variant.id);
//     }

//     let photos = [];
//     if (gallery) {
//       try {
//         const photoField = gallery.vehicle_photos || gallery.cover_photos;
//         photos =
//           typeof photoField === "string" ? JSON.parse(photoField) : photoField;
//         if (!Array.isArray(photos)) photos = [photoField].filter(Boolean);
//       } catch (e) {
//         photos = [];
//       }
//     }
//     return photos[0] || null;
//   };

//   const getVehiclePrice = (vehicleVariant, vehicleColor = null) => {
//     if (!vehicleVariant) return 0;

//     if (vehicleColor && vehicleColor.id === selectedColor?.id && colorPrice) {
//       return parseFloat(colorPrice);
//     }

//     if (vehicleColor && vehicleColor.price) {
//       return parseFloat(vehicleColor.price);
//     }

//     if (unitPrice) {
//       return parseFloat(unitPrice);
//     }

//     const price =
//       vehicleVariant.basic_price ||
//       vehicleVariant.price ||
//       vehicleVariant.ex_showroom_price ||
//       vehicleVariant.on_road_price ||
//       0;

//     return parseFloat(price) || 0;
//   };

//   const renderVehicleCard = (vehicle, index, isCurrent = false) => {
//     if (!vehicle || !vehicle.variant) return null;

//     const color = isCurrent ? selectedColor : vehicle.color;
//     const mainPhoto = getVehicleImage(vehicle.variant, color);
//     const vehicleVariant = vehicle.variant;

//     // Get price based on color
//     const basicPrice = getVehiclePrice(vehicleVariant, color);
//     const exShowroomPrice = vehicleVariant?.ex_showroom_price || 0;
//     const onRoadPrice = vehicleVariant?.on_road_price || 0;
//     const vehicleQuantity = vehicle.quantity || formData.quantity;
//     const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;
//     const totalExShowroomPrice = parseFloat(exShowroomPrice) * vehicleQuantity;
//     const totalOnRoadPrice = parseFloat(onRoadPrice) * vehicleQuantity;

//     const handleCardClick = () => {
//       setSelectedVehicleForPopup({ vehicle, index, isCurrent });
//       setShowVehiclePopup(true);
//     };

//     const updateVehicleQuantity = (newQuantity) => {
//       if (isCurrent) {
//         setFormData((prev) => ({ ...prev, quantity: newQuantity }));
//       } else {
//         const updatedVehicles = [...allVehiclesForCurrentLead];
//         updatedVehicles[index] = {
//           ...updatedVehicles[index],
//           quantity: newQuantity,
//         };
//         setAllVehiclesForCurrentLead(updatedVehicles);
//         localStorage.setItem(
//           "allVehiclesForCurrentLead",
//           JSON.stringify(updatedVehicles)
//         );
//       }
//     };

//     // Edit vehicle function
//     const handleEditVehicle = (e) => {
//       e.stopPropagation();
//       navigate("/leads/generate", {
//         state: {
//           editVehicle: {
//             ...vehicle,
//             index,
//             isCurrent,
//             existingColor: color,
//             existingQuantity: vehicleQuantity,
//           },
//           preserveFormData: true,
//           customerData: {
//             customer_name: formData.customerName,
//             phone_no: formData.phoneNumber,
//             location: formData.customerLocation,
//             area: formData.customerArea,
//             purchase_date: formData.purchaseDate,
//             payment_mode: formData.paymentMode,
//             quantity: formData.quantity,
//             notes: formData.notes,
//           },
//         },
//       });
//     };

//     // Remove vehicle function
//     const handleRemoveVehicle = async (e) => {
//       e.stopPropagation();
//       if (
//         window.confirm(
//           "Are you sure you want to remove this vehicle from the lead?"
//         )
//       ) {
//         await removeVehicleFromLead(vehicle, index, isCurrent);
//       }
//     };

//     return (
//       <div
//         key={index}
//         className={`bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-all cursor-pointer ${
//           isCurrent ? "border-blue-500 border-2" : "border-gray-200"
//         }`}
//         onClick={handleCardClick}
//       >
//         <div className="flex items-start justify-between">
//           <div className="flex-1 min-w-0">
//             <div className="flex justify-between items-start mb-2">
//               <h4 className="font-semibold text-gray-800 text-sm truncate">
//                 {isCurrent ? "Current Vehicle" : `Vehicle ${index + 1}`}
//               </h4>
//               <div className="flex items-center gap-1">
//                 {isCurrent && (
//                   <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2">
//                     Current
//                   </span>
//                 )}
//                 {/* Action Buttons */}
//                 <div className="flex items-center gap-1">
//                   {/* Edit Button */}
//                   <button
//                     onClick={handleEditVehicle}
//                     className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors"
//                     title="Edit vehicle"
//                   >
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                       />
//                     </svg>
//                   </button>

//                   {/* Remove Button - Only show if not the only vehicle */}
//                   {(allVehiclesForCurrentLead.length > 0 || !isCurrent) && (
//                     <button
//                       onClick={handleRemoveVehicle}
//                       className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors ml-2"
//                       title="Remove vehicle"
//                     >
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                         />
//                       </svg>
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Vehicle Details */}
//             <div className="space-y-1 text-xs">
//               <p className="text-gray-600 truncate">
//                 <span className="font-medium">Variant:</span>{" "}
//                 {vehicleVariant.name}
//               </p>

//               {/* Color Display */}
//               {color && (
//                 <p className="text-gray-600 truncate flex items-center gap-2">
//                   <span className="font-medium">Color:</span>
//                   <span
//                     className="w-5 h-5 rounded-full border border-gray-400 shadow"
//                     style={{ backgroundColor: color.color_code }}
//                     title={color.name}
//                   ></span>
//                   <span className="text-xs">{color.name}</span>
//                 </p>
//               )}

//               {/* Quantity with +/- controls */}
//               <div className="flex items-center justify-between">
//                 <span className="font-medium text-gray-600">Quantity:</span>
//                 <div
//                   className="flex items-center border rounded"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <button
//                     type="button"
//                     className="px-2 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       updateVehicleQuantity(Math.max(1, vehicleQuantity - 1));
//                     }}
//                     disabled={vehicleQuantity <= 1}
//                   >
//                     -
//                   </button>
//                   <span className="px-2 py-1 min-w-8 text-center font-medium">
//                     {vehicleQuantity}
//                   </span>
//                   <button
//                     type="button"
//                     className="px-2 py-1 text-gray-600 hover:bg-gray-100"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       updateVehicleQuantity(vehicleQuantity + 1);
//                     }}
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>

//               {/* Color-specific Price Display */}
//               <div className="space-y-1 mt-2">
//                 {basicPrice > 0 && (
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600 font-medium">{`Price:`}</span>
//                     <div className="text-right">
//                       <p className="text-green-600 font-semibold text-sm">
//                         ${parseFloat(basicPrice).toLocaleString()}
//                       </p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-green-500 text-xs">
//                           Total: ${totalBasicPrice.toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {exShowroomPrice > 0 && (
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600 font-medium">
//                       Ex-Showroom:
//                     </span>
//                     <div className="text-right">
//                       <p className="text-blue-600 font-semibold text-sm">
//                         ${parseFloat(exShowroomPrice).toLocaleString()}
//                       </p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-blue-500 text-xs">
//                           Total: ${totalExShowroomPrice.toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {onRoadPrice > 0 && (
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600 font-medium">On Road:</span>
//                     <div className="text-right">
//                       <p className="text-purple-600 font-semibold text-sm">
//                         ${parseFloat(onRoadPrice).toLocaleString()}
//                       </p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-purple-500 text-xs">
//                           Total: ${totalOnRoadPrice.toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {mainPhoto && (
//             <div className="ml-3 flex-shrink-0">
//               <img
//                 src={`${API_BASE.replace(
//                   "/api",
//                   ""
//                 )}/uploads/coverPhotos/${mainPhoto}`}
//                 alt={vehicleVariant.name}
//                 className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border"
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const removeVehicleFromLead = async (vehicle, index, isCurrent = false) => {
//     try {
//       setIsSubmitting(true);

//       // If it's a current vehicle (not yet saved to database)
//       if (isCurrent) {
//         if (
//           window.confirm("Are you sure you want to remove the current vehicle?")
//         ) {
//           // Simply navigate back to model selection
//           navigate("/leads/generate", {
//             state: {
//               preserveFormData: true,
//               customerData: {
//                 customer_name: formData.customerName,
//                 phone_no: formData.phoneNumber,
//                 location: formData.customerLocation,
//                 area: formData.customerArea,
//                 purchase_date: formData.purchaseDate,
//                 payment_mode: formData.paymentMode,
//                 quantity: formData.quantity,
//                 notes: formData.notes,
//               },
//             },
//           });
//         }
//         return;
//       }

//       // If it's a saved vehicle in lead_details table
//       if (vehicle.id && leadId) {
//         if (
//           window.confirm(
//             "Are you sure you want to remove this vehicle from the lead?"
//           )
//         ) {
//           // Make API call to mark as removed in database
//           const response = await axios.delete(
//             `${API_BASE}/leads/${leadId}/vehicles/${vehicle.id}`,
//             { headers: getAuthHeaders() }
//           );

//           if (response.data.success) {
//             // Remove from local state
//             const updatedVehicles = allVehiclesForCurrentLead.filter(
//               (_, i) => i !== index
//             );
//             setAllVehiclesForCurrentLead(updatedVehicles);

//             // Update localStorage
//             localStorage.setItem(
//               "allVehiclesForCurrentLead",
//               JSON.stringify(updatedVehicles)
//             );

//             // Update lead quantity in form data based on API response
//             if (
//               response.data.data &&
//               response.data.data.lead_vehicle_qty !== undefined
//             ) {
//               setFormData((prev) => ({
//                 ...prev,
//                 quantity: response.data.data.lead_vehicle_qty,
//               }));
//             } else {
//               // Fallback: calculate locally
//               const totalQuantity = updatedVehicles.reduce(
//                 (total, v) => total + (v.quantity || 1),
//                 0
//               );
//               setFormData((prev) => ({ ...prev, quantity: totalQuantity }));
//             }

//             toast.success("Vehicle removed successfully!");

//             // Refresh the data to get updated state from backend
//             setTimeout(() => {
//               window.location.reload();
//             }, 1500);
//           } else {
//             throw new Error(
//               response.data.message || "Failed to remove vehicle"
//             );
//           }
//         }
//       } else {
//         // Remove from local state only (not yet saved to database)
//         if (
//           window.confirm(
//             "Are you sure you want to remove this vehicle from selection?"
//           )
//         ) {
//           const updatedVehicles = allVehiclesForCurrentLead.filter(
//             (_, i) => i !== index
//           );
//           setAllVehiclesForCurrentLead(updatedVehicles);

//           localStorage.setItem(
//             "allVehiclesForCurrentLead",
//             JSON.stringify(updatedVehicles)
//           );

//           // Update local quantity
//           const totalQuantity = updatedVehicles.reduce(
//             (total, v) => total + (v.quantity || 1),
//             0
//           );
//           setFormData((prev) => ({ ...prev, quantity: totalQuantity }));

//           toast.success("Vehicle removed from selection!");
//         }
//       }
//     } catch (error) {
//       console.error("Remove vehicle failed:", error);
//       const errorMsg =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to remove vehicle";
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const renderCompactVehicleCard = (vehicle, index, isCurrent = false) => {
//     if (!vehicle || !vehicle.variant) return null;

//     const color = isCurrent ? selectedColor : vehicle.color;
//     const mainPhoto = getVehicleImage(vehicle.variant, color);
//     const vehicleVariant = vehicle.variant;

//     // Get color-specific price
//     const vehiclePrice = getVehiclePrice(vehicleVariant, color);
//     const onRoadPrice = vehicleVariant?.on_road_price || 0;
//     const vehicleQuantity = vehicle.quantity || formData.quantity;
//     const totalPrice = vehiclePrice * vehicleQuantity;
//     const totalOnRoadPrice = parseFloat(onRoadPrice) * vehicleQuantity;

//     const handleCardClick = () => {
//       setSelectedVehicleForPopup({ vehicle, index, isCurrent });
//       setShowVehiclePopup(true);
//     };

//     const updateVehicleQuantity = (newQuantity) => {
//       if (isCurrent) {
//         setFormData((prev) => ({ ...prev, quantity: newQuantity }));
//       } else {
//         const updatedVehicles = [...allVehiclesForCurrentLead];
//         updatedVehicles[index] = {
//           ...updatedVehicles[index],
//           quantity: newQuantity,
//         };
//         setAllVehiclesForCurrentLead(updatedVehicles);
//         localStorage.setItem(
//           "allVehiclesForCurrentLead",
//           JSON.stringify(updatedVehicles)
//         );
//       }
//     };

//     // Edit vehicle function
//     const handleEditVehicle = (e) => {
//       e.stopPropagation();
//       navigate("/leads/generate", {
//         state: {
//           editVehicle: {
//             ...vehicle,
//             index,
//             isCurrent,
//             existingColor: color,
//             existingQuantity: vehicleQuantity,
//           },
//           preserveFormData: true,
//           customerData: {
//             customer_name: formData.customerName,
//             phone_no: formData.phoneNumber,
//             location: formData.customerLocation,
//             area: formData.customerArea,
//             purchase_date: formData.purchaseDate,
//             payment_mode: formData.paymentMode,
//             quantity: formData.quantity,
//             notes: formData.notes,
//           },
//         },
//       });
//     };

//     // Remove vehicle function for compact card
//     const handleRemoveVehicle = async (e) => {
//       e.stopPropagation();
//       if (
//         window.confirm(
//           "Are you sure you want to remove this vehicle from the lead?"
//         )
//       ) {
//         await removeVehicleFromLead(vehicle, index, isCurrent);
//       }
//     };

//     return (
//       <div
//         key={index}
//         className={`bg-white rounded-lg border p-2 shadow-sm cursor-pointer ${
//           isCurrent ? "border-blue-500 border-2" : "border-gray-200"
//         }`}
//         onClick={handleCardClick}
//       >
//         <div className="flex items-center space-x-2">
//           {mainPhoto && (
//             <div className="flex-shrink-0">
//               <img
//                 src={`${API_BASE.replace(
//                   "/api",
//                   ""
//                 )}/uploads/coverPhotos/${mainPhoto}`}
//                 alt={vehicleVariant.name}
//                 className="w-full h-12 object-cover rounded border"
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/48x48/f3f4f6/6b7280?text=No+Image";
//                 }}
//               />
//             </div>
//           )}
//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between">
//               <div className="flex-1 min-w-0">
//                 {/* Header with vehicle name and action buttons */}
//                 <div className="flex justify-between items-start mb-1">
//                   <p className="font-medium text-gray-800 text-sm truncate">
//                     {vehicleVariant.name}
//                   </p>
//                   <div className="flex items-center gap-1">
//                     {isCurrent && (
//                       <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap ml-1">
//                         Current
//                       </span>
//                     )}
//                     {/* Action Buttons */}
//                     <div className="flex items-center gap-1">
//                       {/* Edit Button */}
//                       <button
//                         onClick={handleEditVehicle}
//                         className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors"
//                         title="Edit vehicle"
//                       >
//                         <svg
//                           className="w-3 h-3"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
//                           />
//                         </svg>
//                       </button>

//                       {/* Remove Button - Only show if not the only vehicle */}
//                       {(allVehiclesForCurrentLead.length > 0 || !isCurrent) && (
//                         <button
//                           onClick={handleRemoveVehicle}
//                           className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 rounded transition-colors"
//                           title="Remove vehicle"
//                         >
//                           <svg
//                             className="w-3 h-3"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth="2"
//                               d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
//                             />
//                           </svg>
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Color Display */}
//                 {color && (
//                   <p className="text-xs text-gray-600 truncate flex items-center gap-1">
//                     <span
//                       className="w-3 h-3 rounded-full border border-gray-300"
//                       style={{ backgroundColor: color.color_code }}
//                     ></span>
//                     {color.name}
//                   </p>
//                 )}

//                 <p className="text-xs text-gray-600 truncate">
//                   {brands.find((b) => b.id === vehicleVariant.brand_id)?.name ||
//                     "N/A"}{" "}
//                   •
//                   {ccs.find((c) => c.id === vehicleVariant.cc_id)?.name ||
//                     "N/A"}{" "}
//                   •
//                   {fuelTypes.find((f) => f.id === vehicleVariant.fuel_type_id)
//                     ?.name || "N/A"}
//                 </p>

//                 {/* Color-specific Price Display */}
//                 {vehiclePrice > 0 ? (
//                   <div>
//                     <p className="text-xs text-green-600 font-medium truncate">
//                       ${vehiclePrice.toLocaleString()}
//                       <small className="text-black ml-1">*On-Road Price</small>
//                     </p>
//                     {vehicleQuantity > 1 && (
//                       <p className="text-xs text-green-700 font-semibold truncate">
//                         Total: ${totalPrice.toLocaleString()}*
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="text-xs text-gray-500 truncate">
//                     Price on request
//                   </p>
//                 )}

//                 {/* Quantity with +/- controls */}
//                 <div className="flex items-center justify-between my-1">
//                   <div
//                     className="flex items-center border rounded text-xs"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <button
//                       type="button"
//                       className="px-1 py-0.5 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         updateVehicleQuantity(Math.max(1, vehicleQuantity - 1));
//                       }}
//                       disabled={vehicleQuantity <= 1}
//                     >
//                       -
//                     </button>
//                     <span className="px-1 py-0.5 min-w-6 text-center font-medium">
//                       {vehicleQuantity}
//                     </span>
//                     <button
//                       type="button"
//                       className="px-1 py-0.5 text-gray-600 hover:bg-gray-100"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         updateVehicleQuantity(vehicleQuantity + 1);
//                       }}
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 {/* On Road Price Display */}
//                 {onRoadPrice > 0 && (
//                   <>
//                     <p className="text-xs text-blue-600 font-medium truncate">
//                       On Road: ${parseFloat(onRoadPrice).toLocaleString()}
//                     </p>
//                     {vehicleQuantity > 1 && (
//                       <p className="text-xs text-blue-700 font-semibold truncate">
//                         Total OR: ${totalOnRoadPrice.toLocaleString()}
//                       </p>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderVehiclesOverlay = () => {
//     const allVehicles = [...allVehiclesForCurrentLead];
//     if (variant) {
//       allVehicles.push({
//         variant,
//         isCurrent: true,
//         quantity: formData.quantity,
//       });
//     }

//     if (allVehicles.length === 0) return null;

//     // Calculate detailed price breakdown
//     const totalQuantity = allVehicles.reduce((total, vehicle) => {
//       return total + (vehicle.quantity || formData.quantity);
//     }, 0);

//     const totalBasicPrice = allVehicles.reduce((total, vehicle) => {
//       const basicPrice = vehicle.variant?.basic_price || 0;
//       const vehicleQuantity = vehicle.quantity || formData.quantity;
//       return total + (parseFloat(basicPrice) || 0) * vehicleQuantity;
//     }, 0);

//     const totalExShowroomPrice = allVehicles.reduce((total, vehicle) => {
//       const exShowroomPrice = vehicle.variant?.ex_showroom_price || 0;
//       const vehicleQuantity = vehicle.quantity || formData.quantity;
//       return total + (parseFloat(exShowroomPrice) || 0) * vehicleQuantity;
//     }, 0);

//     const totalOnRoadPrice = allVehicles.reduce((total, vehicle) => {
//       const onRoadPrice = vehicle.variant?.on_road_price || 0;
//       const vehicleQuantity = vehicle.quantity || formData.quantity;
//       return total + (parseFloat(onRoadPrice) || 0) * vehicleQuantity;
//     }, 0);

//     // Calculate taxes and additional costs
//     const totalTaxes = totalOnRoadPrice - totalExShowroomPrice;
//     const rtoCost = totalOnRoadPrice * 0.05; // Example: 5% of on-road price
//     const insuranceCost = totalOnRoadPrice * 0.03; // Example: 3% of on-road price
//     const otherCharges = totalOnRoadPrice * 0.02; // Example: 2% of on-road price

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//           {/* Header */}
//           <div className="bg-[#0f66af] text-white px-4 sm:px-6 py-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg sm:text-xl font-semibold">
//                 Vehicle Details & Price Breakdown
//               </h3>
//               <button
//                 onClick={() => setShowVehiclesOverlay(false)}
//                 className="text-white hover:text-gray-200 transition-colors p-1"
//               >
//                 <svg
//                   className="w-5 h-5 sm:w-6 sm:h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//             {/* Vehicle Cards */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
//               {allVehicles.map((vehicle, index) =>
//                 renderVehicleCard(
//                   vehicle,
//                   index,
//                   index === allVehicles.length - 1 && variant
//                 )
//               )}
//             </div>

//             {/* Detailed Price Breakdown */}
//             <div className="bg-gray-50 rounded-lg border p-4 sm:p-6">
//               <h4 className="font-bold text-gray-800 mb-4 text-lg">
//                 Price Breakdown
//               </h4>

//               <div className="space-y-3">
//                 {/* Color-wise Price Breakdown */}
//                 {allVehicles.map((vehicle, index) => {
//                   const vehicleVariant = vehicle.variant;
//                   const color = vehicle.isCurrent
//                     ? selectedColor
//                     : vehicle.color;

//                   // Use the actual price from the vehicle data or from ModelDetails
//                   const vehiclePrice =
//                     vehicle.unit_price ||
//                     vehicle.color_price ||
//                     getVehiclePrice(vehicleVariant, color);
//                   const vehicleQuantity = vehicle.quantity || formData.quantity;
//                   const totalVehiclePrice = vehiclePrice * vehicleQuantity;

//                   if (vehiclePrice <= 0) return null;

//                   return (
//                     <div
//                       key={index}
//                       className="border-b border-gray-200 pb-3 last:border-b-0"
//                     >
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <span className="text-gray-700 font-medium">
//                             {vehicleVariant.name}
//                           </span>
//                           {color && (
//                             <div className="flex items-center gap-2 mt-1">
//                               <span
//                                 className="w-4 h-4 rounded-full border border-gray-300"
//                                 style={{ backgroundColor: color.color_code }}
//                               ></span>
//                               <span className="text-sm text-gray-600">
//                                 {color.name}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                         <div className="text-right">
//                           <span className="text-green-600 font-semibold">
//                             ${totalVehiclePrice.toLocaleString()}
//                           </span>
//                           {vehicleQuantity > 1 && (
//                             <p className="text-sm text-gray-600">
//                               (${parseFloat(vehiclePrice).toLocaleString()} ×{" "}
//                               {vehicleQuantity})
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {/* Totals Section */}
//                 <div className="border-t border-gray-300 pt-4">
//                   {/* Ex-Showroom Price */}
//                   {totalExShowroomPrice > 0 && (
//                     <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-700 font-medium">
//                           Ex-Showroom Price
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           (Before taxes)
//                         </span>
//                       </div>
//                       <span className="text-blue-600 font-semibold">
//                         ${totalExShowroomPrice.toLocaleString()}
//                       </span>
//                     </div>
//                   )}

//                   {/* Taxes & Charges Breakdown */}
//                   {totalTaxes > 0 && (
//                     <div className="pl-4 border-l-2 border-gray-300">
//                       <h5 className="font-medium text-gray-600 mb-2">
//                         Taxes & Charges:
//                       </h5>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">
//                             RTO Registration
//                           </span>
//                           <span className="text-gray-700">
//                             ${rtoCost.toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Insurance</span>
//                           <span className="text-gray-700">
//                             ${insuranceCost.toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Other Charges</span>
//                           <span className="text-gray-700">
//                             ${otherCharges.toLocaleString()}
//                           </span>
//                         </div>
//                         <div className="flex justify-between pt-2 border-t border-gray-200">
//                           <span className="text-gray-700 font-medium">
//                             Total Taxes
//                           </span>
//                           <span className="text-gray-700 font-medium">
//                             ${totalTaxes.toLocaleString()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* On Road Price */}
//                   {totalOnRoadPrice > 0 && (
//                     <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4 mt-4">
//                       <div className="flex items-center gap-2">
//                         <span className="text-blue-800 font-bold text-lg">
//                           On Road Price
//                         </span>
//                         <span className="text-xs text-blue-600">
//                           (Including all taxes)
//                         </span>
//                       </div>
//                       <span className="text-blue-800 font-bold text-xl">
//                         ${totalOnRoadPrice.toLocaleString()}
//                       </span>
//                     </div>
//                   )}

//                   {/* Quantity Summary */}
//                   <div className="flex justify-between items-center pt-3">
//                     <span className="text-gray-700 font-medium">
//                       Total Quantity
//                     </span>
//                     <span className="text-gray-800 font-semibold">
//                       {totalQuantity} units
//                     </span>
//                   </div>

//                   {/* Per Unit Calculation */}
//                   {totalQuantity > 1 && totalOnRoadPrice > 0 && (
//                     <div className="text-center pt-2">
//                       <span className="text-sm text-gray-500">
//                         (${(totalOnRoadPrice / totalQuantity).toLocaleString()}{" "}
//                         per unit)
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="border-t px-4 sm:px-6 py-3 bg-gray-50">
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowVehiclesOverlay(false)}
//                 className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   console.log("Proceed with purchase");
//                 }}
//                 className="bg-[#0f66af] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
//               >
//                 Proceed
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderSelectedVehiclesPreview = () => {
//     const allVehicles = [...allVehiclesForCurrentLead];
//     if (variant) {
//       allVehicles.push({
//         variant,
//         isCurrent: true,
//         quantity: formData.quantity,
//       });
//     }

//     if (allVehicles.length === 0) return null;

//     const currentVehiclesCount = allVehicles.length;
//     const currentVehicle = variant ? { variant, isCurrent: true } : null;

//     return (
//       <div className="mb-6">
//         {/* Rest of your existing preview cards */}
//         <div className="block sm:hidden space-y-2">
//           {currentVehicle &&
//             renderCompactVehicleCard(
//               currentVehicle,
//               currentVehiclesCount - 1,
//               true
//             )}
//           {allVehiclesForCurrentLead
//             .slice(0, 2)
//             .map((vehicle, index) => renderCompactVehicleCard(vehicle, index))}
//           {allVehiclesForCurrentLead.length > 2 && (
//             <div
//               className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
//               onClick={() => setShowVehiclesOverlay(true)}
//             >
//               <svg
//                 className="w-6 h-6 text-gray-400 mb-1"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//               <p className="text-gray-600 text-xs text-center">
//                 +{allVehiclesForCurrentLead.length - 2} more vehicles
//               </p>
//               <p className="text-gray-500 text-xs mt-0.5">Tap to view all</p>
//             </div>
//           )}
//         </div>

//         <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//           {currentVehicle &&
//             renderVehicleCard(currentVehicle, currentVehiclesCount - 1, true)}
//           {allVehiclesForCurrentLead
//             .slice(0, 2)
//             .map((vehicle, index) => renderVehicleCard(vehicle, index))}
//           {allVehiclesForCurrentLead.length > 2 && (
//             <div
//               className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
//               onClick={() => setShowVehiclesOverlay(true)}
//             >
//               <svg
//                 className="w-8 h-8 text-gray-400 mb-2"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//               <p className="text-gray-600 text-sm text-center">
//                 +{allVehiclesForCurrentLead.length - 2} more vehicles
//               </p>
//               <p className="text-gray-500 text-xs mt-1">Click to view all</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderVehiclePopup = (vehicle, index, isCurrent = false) => {
//     if (!vehicle || !vehicle.variant) return null;

//     const color = isCurrent ? selectedColor : vehicle.color;
//     const mainPhoto = getVehicleImage(vehicle.variant, color);
//     const vehicleVariant = vehicle.variant;

//     // Get color-specific price
//     const basicPrice = getVehiclePrice(vehicleVariant, color);
//     const exShowroomPrice = vehicleVariant?.ex_showroom_price || 0;
//     const onRoadPrice = vehicleVariant?.on_road_price || 0;

//     const vehicleQuantity = vehicle.quantity || formData.quantity;
//     const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;
//     const totalExShowroomPrice = parseFloat(exShowroomPrice) * vehicleQuantity;
//     const totalOnRoadPrice = parseFloat(onRoadPrice) * vehicleQuantity;

//     // Calculate taxes and additional costs
//     const totalTaxes = totalOnRoadPrice - totalExShowroomPrice;
//     const rtoCost = totalOnRoadPrice * 0.05;
//     const insuranceCost = totalOnRoadPrice * 0.03;
//     const otherCharges = totalOnRoadPrice * 0.02;

//     const updateVehicleQuantity = (newQuantity) => {
//       if (isCurrent) {
//         setFormData((prev) => ({ ...prev, quantity: newQuantity }));
//       } else {
//         const updatedVehicles = [...allVehiclesForCurrentLead];
//         updatedVehicles[index] = {
//           ...updatedVehicles[index],
//           quantity: newQuantity,
//         };
//         setAllVehiclesForCurrentLead(updatedVehicles);
//         localStorage.setItem(
//           "allVehiclesForCurrentLead",
//           JSON.stringify(updatedVehicles)
//         );
//       }
//     };

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
//           {/* Header */}
//           <div className="bg-[#0f66af] text-white px-4 sm:px-6 py-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg sm:text-xl font-semibold">
//                 {isCurrent ? "Current Vehicle" : `Vehicle ${index + 1}`} - Price
//                 Details
//               </h3>
//               <button
//                 onClick={() => setShowVehiclePopup(false)}
//                 className="text-white hover:text-gray-200 transition-colors p-1"
//               >
//                 <svg
//                   className="w-5 h-5 sm:w-6 sm:h-6"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//             {/* Vehicle Info */}
//             <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
//               {mainPhoto && (
//                 <div className="flex-shrink-0">
//                   <img
//                     src={`${API_BASE.replace(
//                       "/api",
//                       ""
//                     )}/uploads/coverPhotos/${mainPhoto}`}
//                     alt={vehicleVariant.name}
//                     className="w-20 h-20 object-cover rounded-md border"
//                     onError={(e) => {
//                       e.target.src =
//                         "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
//                     }}
//                   />
//                 </div>
//               )}
//               <div className="flex-1">
//                 <h4 className="font-semibold text-gray-800 text-lg mb-2">
//                   {vehicleVariant.name}
//                 </h4>
//                 <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
//                   <p>
//                     <span className="font-medium">Brand:</span>{" "}
//                     {brands.find((b) => b.id === vehicleVariant.brand_id)
//                       ?.name || "N/A"}
//                   </p>
//                   <p>
//                     <span className="font-medium">CC:</span>{" "}
//                     {ccs.find((c) => c.id === vehicleVariant.cc_id)?.name ||
//                       "N/A"}
//                   </p>
//                   <p>
//                     <span className="font-medium">Fuel:</span>{" "}
//                     {fuelTypes.find((f) => f.id === vehicleVariant.fuel_type_id)
//                       ?.name || "N/A"}
//                   </p>
//                   {color && (
//                     <p className="flex items-center gap-2">
//                       <span className="font-medium">Color:</span>
//                       <span
//                         className="w-4 h-4 rounded-full border border-gray-400 shadow"
//                         style={{ backgroundColor: color.color_code }}
//                         title={color.name}
//                       ></span>
//                       <span className="text-xs">{color.name}</span>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Quantity Controls */}
//             <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
//               <span className="font-medium text-gray-700">Quantity:</span>
//               <div className="flex items-center border border-blue-200 rounded">
//                 <button
//                   type="button"
//                   className="px-3 py-1 text-blue-600 hover:bg-blue-100 disabled:opacity-50 transition-colors"
//                   onClick={() =>
//                     updateVehicleQuantity(Math.max(1, vehicleQuantity - 1))
//                   }
//                   disabled={vehicleQuantity <= 1}
//                 >
//                   -
//                 </button>
//                 <span className="px-3 py-1 min-w-8 text-center font-semibold text-blue-600">
//                   {vehicleQuantity}
//                 </span>
//                 <button
//                   type="button"
//                   className="px-3 py-1 text-blue-600 hover:bg-blue-100 transition-colors"
//                   onClick={() => updateVehicleQuantity(vehicleQuantity + 1)}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Detailed Price Breakdown */}
//             <div className="bg-white rounded-lg border p-4">
//               <h4 className="font-bold text-gray-800 mb-4 text-lg">
//                 Price Breakdown
//               </h4>

//               <div className="space-y-3">
//                 {/* Color-specific Basic Price */}
//                 {basicPrice > 0 && (
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-700 font-medium">
//                         {color ? `${color.name} Price` : "Basic Price"}
//                       </span>
//                       <span className="text-xs text-gray-500">(Per unit)</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-green-600 font-semibold">
//                         ${parseFloat(basicPrice).toLocaleString()}
//                       </p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-green-500 text-sm">
//                           Total: ${totalBasicPrice.toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* Ex-Showroom Price */}
//                 {exShowroomPrice > 0 && (
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-700 font-medium">
//                         Ex-Showroom Price
//                       </span>
//                       <span className="text-xs text-gray-500">(Per unit)</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-blue-600 font-semibold">
//                         ${parseFloat(exShowroomPrice).toLocaleString()}
//                       </p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-blue-500 text-sm">
//                           Total: ${totalExShowroomPrice.toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* On Road Price */}
//                 {onRoadPrice > 0 && (
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-700 font-medium">
//                         On Road Price
//                       </span>
//                       <span className="text-xs text-gray-500">(Per unit)</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-purple-600 font-semibold">
//                         ${parseFloat(onRoadPrice).toLocaleString()}
//                       </p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-purple-500 text-sm">
//                           Total: ${totalOnRoadPrice.toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ========== FORM HANDLING ==========

//   const validateForm = () => {
//     const phoneStr = String(formData.phoneNumber || "").trim();
//     if (!formData.customerName?.trim()) return "Customer name is required.";
//     if (!/^\d{10}$/.test(phoneStr))
//       return "Valid 10-digit phone number required.";
//     if (!formData.customerLocation?.trim()) return "Location is required.";
//     if (!formData.quantity || formData.quantity < 1)
//       return "Quantity must be at least 1.";
//     if (!variant) return "Please select a vehicle variant.";

//     // NEW: Validate dealer assignment
//     if (!assignedDealerId)
//       return "No dealer assigned for the selected area. Please contact administrator.";

//     return null;
//   };

//   const unitPrice = colorPrice || getVehiclePrice(variant, selectedColor);

//   // const handleSubmit = async (action = "submit") => {
//   //   const validationError = validateForm();
//   //   if (validationError) {
//   //     setErrorMessage(validationError);
//   //     window.scrollTo({ top: 0, behavior: "smooth" });
//   //     return;
//   //   }

//   //   setIsSubmitting(true);
//   //   setErrorMessage(null);

//   //   try {
//   //     const selectedArea = dealerAssignedAreas.find(
//   //       (area) => area.name === formData.customerArea?.trim()
//   //     );

//   //     if (!selectedArea || !selectedCityId) {
//   //       throw new Error("Please select valid area and city.");
//   //     }

//   //     const finalLocation = formData.customerArea
//   //       ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
//   //       : formData.customerLocation.trim();

//   //     const totalQuantity =
//   //       allVehiclesForCurrentLead.reduce((total, vehicle) => {
//   //         return total + (vehicle.quantity || 1);
//   //       }, 0) + formData.quantity;

//   //     const currentUserId = getCurrentDealerId();

//   //     const payload = {
//   //       customer_name: formData.customerName.trim(),
//   //       phone_no: (formData.phoneNumber || "").toString().trim(),
//   //       location: finalLocation,
//   //       area: formData.customerArea?.trim() || null,
//   //       city_id: selectedCityId,
//   //       area_id: selectedArea.id,
//   //       executive_id: currentUserId,
//   //       tentative_purchase_date: formData.purchaseDate || null,
//   //       unit_price: unitPrice,
//   //       total_price: unitPrice * formData.quantity,
//   //       vehicle_qty: totalQuantity,
//   //       current_vehicle_qty: formData.quantity,
//   //       payment_mode: formData.paymentMode,
//   //       additional_note: formData.notes?.trim() || null,
//   //       brand_id: parseInt(variant.brand_id, 10),
//   //       variant_id: parseInt(variant.id, 10),
//   //       lead_id: leadId || null,
//   //       status: action === "save_draft" ? "Draft" : "Open",
//   //       color_id: selectedColor?.id || null,
//   //       color_name: selectedColor?.name || null,
//   //       color_code: selectedColor?.color_code || null,

//   //       // NEW: Dealer and distributor mapping
//   //       dealer_id: assignedDealerId,
//   //       distributor_id: assignedDistributorId,
//   //     };

//   //     console.log("Submitting lead with dealer mapping:", {
//   //       dealer_id: assignedDealerId,
//   //       distributor_id: assignedDistributorId,
//   //     });

//   //     const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//   //       headers: getAuthHeaders(),
//   //     });

//   //     if (data?.lead?.id) {
//   //       const newLeadId = data.lead.id;
//   //       setLeadId(newLeadId);

//   //       const newVehicleEntry = {
//   //         ...payload,
//   //         variant,
//   //         lead_id: newLeadId,
//   //         id: newLeadId,
//   //         color: selectedColor,
//   //         quantity: formData.quantity,
//   //         dealer_id: assignedDealerId,
//   //         distributor_id: assignedDistributorId,
//   //       };

//   //       const updatedVehicles = [...allVehiclesForCurrentLead, newVehicleEntry];
//   //       setAllVehiclesForCurrentLead(updatedVehicles);
//   //       localStorage.setItem(
//   //         "allVehiclesForCurrentLead",
//   //         JSON.stringify(updatedVehicles)
//   //       );

//   //       toast.success(`Lead #${newLeadId} created successfully!`, {
//   //         duration: 4000,
//   //         icon: "Success",
//   //         style: {
//   //           borderRadius: "10px",
//   //           background: "#10b981",
//   //           color: "#fff",
//   //         },
//   //       });

//   //       if (action === "submit") {
//   //         clearLocalStorageForSubmit();
//   //         navigate("/leads/open", {
//   //           state: {
//   //             recentLead: data.lead,
//   //             allLeads: updatedVehicles,
//   //             submittedVariant: variant,
//   //             submittedLeadId: newLeadId,
//   //             submittedColor: selectedColor,
//   //             assignedDealer: assignedDealerId,
//   //             assignedDistributor: assignedDistributorId,
//   //           },
//   //         });
//   //       }
//   //     }
//   //   } catch (err) {
//   //     const msg =
//   //       err.response?.data?.message || err.message || "Submission failed.";
//   //     setErrorMessage(msg);
//   //     window.scrollTo({ top: 0, behavior: "smooth" });
//   //     toast.error(msg);
//   //   } finally {
//   //     setIsSubmitting(false);
//   //   }
//   // };

// const handleSubmit = async (action = "submit") => {
//   const validationError = validateForm();
//   if (validationError) {
//     setErrorMessage(validationError);
//     window.scrollTo({ top: 0, behavior: "smooth" });
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

//     const totalQuantity = allVehiclesForCurrentLead.reduce((total, vehicle) => {
//       return total + (vehicle.quantity || 1);
//     }, 0) + formData.quantity;

//     const currentUserId = getCurrentDealerId();
//     const unitPrice = colorPrice || getVehiclePrice(variant, selectedColor);

//     // PREPARE PAYLOAD WITH DEALER/DISTRIBUTOR
//     const payload = {
//       customer_name: formData.customerName.trim(),
//       phone_no: (formData.phoneNumber || "").toString().trim(),
//       location: finalLocation,
//       area: formData.customerArea?.trim() || null,
//       city_id: selectedCityId,
//       area_id: selectedArea.id,
//       executive_id: currentUserId,
//       tentative_purchase_date: formData.purchaseDate || null,
//       unit_price: unitPrice,
//       total_price: unitPrice * formData.quantity,
//       vehicle_qty: totalQuantity,
//       current_vehicle_qty: formData.quantity,
//       payment_mode: formData.paymentMode,
//       additional_note: formData.notes?.trim() || null,
//       brand_id: parseInt(variant.brand_id, 10),
//       variant_id: parseInt(variant.id, 10),
//       lead_id: leadId || null,
//       status: action === "save_draft" ? "Draft" : "Open",
//       color_id: selectedColor?.id || null,
//       color_name: selectedColor?.name || null,
//       color_code: selectedColor?.color_code || null,

//       // CRITICAL: ADD DEALER AND DISTRIBUTOR IDS
//       dealer_id: assignedDealerId,
//       distributor_id: assignedDistributorId,
//     };

//     console.log("Submitting lead with complete data:", payload);

//     const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//       headers: getAuthHeaders(),
//     });

//     if (data?.success) {
//       const newLeadId = data.lead_id || data.lead?.id;
//       setLeadId(newLeadId);

//       const newVehicleEntry = {
//         ...payload,
//         variant,
//         lead_id: newLeadId,
//         id: newLeadId,
//         color: selectedColor,
//         quantity: formData.quantity,
//         dealer_id: assignedDealerId,
//         distributor_id: assignedDistributorId,
//       };

//       const updatedVehicles = [...allVehiclesForCurrentLead, newVehicleEntry];
//       setAllVehiclesForCurrentLead(updatedVehicles);
//       localStorage.setItem(
//         "allVehiclesForCurrentLead",
//         JSON.stringify(updatedVehicles)
//       );

//       // Show success message with dealer info
//       const successMessage = assignedDealerId
//         ? `Lead #${newLeadId} created successfully! Dealer: ${assignedDealerName}`
//         : `Lead #${newLeadId} created successfully!`;

//       toast.success(successMessage, {
//         duration: 4000,
//         icon: "✅",
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
//             assignedDealer: assignedDealerId,
//             assignedDistributor: assignedDistributorId,
//           },
//         });
//       }
//     }
//   } catch (err) {
//     const msg =
//       err.response?.data?.message || err.message || "Submission failed.";
//     setErrorMessage(msg);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     toast.error(msg);
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   const clearLocalStorageForSubmit = () => {
//     const keys = [
//       "leadId",
//       "draftLead",
//       "recentSubmittedLead",
//       "existingCustomerData",
//       "allVehiclesForCurrentLead",
//     ];
//     keys.forEach((key) => localStorage.removeItem(key));
//     setStoredLeads([]);
//     setAllVehiclesForCurrentLead([]);
//   };

//   const handleSaveDraft = async () => {
//     const validationError = validateForm();
//     if (validationError) {
//       setErrorMessage(validationError);
//       return;
//     }

//     const selectedArea = dealerAssignedAreas.find(
//       (area) => area.name === formData.customerArea
//     );
//     if (!selectedArea || !selectedCityId) {
//       setErrorMessage("Please select valid area and city.");
//       return;
//     }

//     const finalLocation = formData.customerArea
//       ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
//       : formData.customerLocation.trim();

//     // FIX: Use the actual quantity from form input
//     const totalVehicles = parseInt(formData.quantity, 10) || 1;
//     const currentUserId = getCurrentDealerId();

//     const payload = {
//       customer_name: formData.customerName.trim(),
//       phone_no: formData.phoneNumber.trim(),
//       location: finalLocation || null,
//       area: formData.customerArea?.trim() || null,
//       city_id: selectedCityId,
//       area_id: selectedArea.id,
//       executive_id: currentUserId,
//       tentative_purchase_date: formData.purchaseDate || null,
//       vehicle_qty: totalVehicles,
//       current_vehicle_qty: formData.quantity || 1,
//       payment_mode: formData.paymentMode,
//       additional_note: formData.notes?.trim() || null,
//       brand_id: parseInt(variant.brand_id, 10),
//       variant_id: parseInt(variant.id, 10),
//       lead_id: leadId || null,
//       status: "Draft",
//       // ADD COLOR INFORMATION FOR DRAFT
//       color_id: selectedColor?.id || null,
//       color_name: selectedColor?.name || null,
//       color_code: selectedColor?.color_code || null,
//     };

//     try {
//       const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//         headers: getAuthHeaders(),
//       });
//       if (data?.lead?.id) {
//         const newLeadId = data.lead.id;
//         setLeadId(newLeadId);
//         const updatedVehicles = [
//           ...allVehiclesForCurrentLead.map((v) => ({ ...v, status: "Draft" })),
//           {
//             ...payload,
//             variant,
//             lead_id: newLeadId,
//             status: "Draft",
//             color: selectedColor, // Include color in local state
//           },
//         ];
//         setAllVehiclesForCurrentLead(updatedVehicles);
//         localStorage.setItem(
//           "allVehiclesForCurrentLead",
//           JSON.stringify(updatedVehicles)
//         );
//         localStorage.removeItem("existingCustomerData");
//         localStorage.removeItem("leadId");
//         toast.success("Draft saved successfully!");
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Draft failed.";
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//     }
//   };

//   const addNewVehicle = async () => {
//     try {
//       let currentLeadId = leadId;

//       // Get the selected area for city_id
//       const selectedArea = dealerAssignedAreas.find(
//         (area) => area.name === formData.customerArea?.trim()
//       );
//       const totalQuantity =
//         allVehiclesForCurrentLead.reduce((total, vehicle) => {
//           return total + (vehicle.quantity || 1);
//         }, 0) + formData.quantity;

//       // Validate required fields before proceeding
//       if (
//         !formData.customerName?.trim() ||
//         !formData.phoneNumber?.trim() ||
//         !formData.customerLocation?.trim()
//       ) {
//         setErrorMessage(
//           "Please fill in all required customer details before adding another vehicle."
//         );
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         return;
//       }

//       if (!selectedArea) {
//         setErrorMessage(
//           "Please select a valid area before adding another vehicle."
//         );
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         return;
//       }

//       if (!selectedArea.city_id || !selectedArea.id) {
//         setErrorMessage("Selected area is missing city or ID information.");
//         window.scrollTo({ top: 0, behavior: "smooth" });
//         return;
//       }

//       if (!currentLeadId) {
//         // Create new lead with ACTUAL QUANTITY from form
//         const payload = {
//           customer_name: formData.customerName.trim(),
//           phone_no: formData.phoneNumber.trim(),
//           location: formData.customerLocation.trim(),
//           area: formData.customerArea || null,
//           city_id: selectedArea.city_id,
//           area_id: selectedArea.id,
//           executive_id: getCurrentDealerId(),
//           tentative_purchase_date: formData.purchaseDate || null, // PRESERVE DATE

//           vehicle_qty: totalQuantity,
//           current_vehicle_qty: formData.quantity,
//           payment_mode: formData.paymentMode,
//           additional_note: formData.notes?.trim() || null,
//           brand_id: parseInt(variant.brand_id, 10),
//           variant_id: parseInt(variant.id, 10),
//           status: "Draft",
//           color_id: selectedColor?.id || null,
//           color_name: selectedColor?.name || null,
//           color_code: selectedColor?.color_code || null,
//         };

//         const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//           headers: getAuthHeaders(),
//         });

//         if (data?.lead?.id) {
//           currentLeadId = data.lead.id;
//           setLeadId(currentLeadId);

//           // Store the initial vehicle with quantity
//           const initialVehicle = {
//             ...payload,
//             variant,
//             lead_id: currentLeadId,
//             id: currentLeadId,
//             color: selectedColor,
//             quantity: formData.quantity, // STORE QUANTITY WITH VEHICLE
//           };

//           setAllVehiclesForCurrentLead([initialVehicle]);
//           localStorage.setItem(
//             "allVehiclesForCurrentLead",
//             JSON.stringify([initialVehicle])
//           );
//         } else {
//           throw new Error("Failed to create lead");
//         }
//       }

//       // Add the new vehicle to existing lead
//       if (currentLeadId) {
//         const vehiclePayload = {
//           brand_id: parseInt(variant.brand_id, 10),
//           variant_id: parseInt(variant.id, 10),
//           status: "Draft",
//           area_id: selectedArea?.id || null,
//           city_id: selectedArea?.city_id || null,
//           color_id: selectedColor?.id || null,
//           color_name: selectedColor?.name || null,
//           color_code: selectedColor?.color_code || null,
//         };

//         await axios.post(
//           `${API_BASE}/leads/${currentLeadId}/vehicles`,
//           vehiclePayload,
//           { headers: getAuthHeaders() }
//         );

//         // Update local state with quantity
//         const newVehicle = {
//           variant,
//           status: "Draft",
//           brand_id: parseInt(variant.brand_id, 10),
//           variant_id: parseInt(variant.id, 10),
//           area_id: selectedArea?.id || null,
//           city_id: selectedArea?.city_id || null,
//           color: selectedColor,
//           quantity: formData.quantity, // INCLUDE QUANTITY
//         };

//         const updated = [...allVehiclesForCurrentLead, newVehicle];
//         setAllVehiclesForCurrentLead(updated);
//         localStorage.setItem(
//           "allVehiclesForCurrentLead",
//           JSON.stringify(updated)
//         );

//         // Store COMPLETE customer data for continuity - PRESERVE DATE
//         const customerDataToStore = {
//           customer_name: formData.customerName,
//           phone_no: formData.phoneNumber,
//           location: formData.customerLocation,
//           area: formData.customerArea,
//           purchase_date: formData.purchaseDate, // PRESERVE DATE
//           payment_mode: formData.paymentMode,
//           quantity: parseInt(formData.quantity, 10) || 1,
//           notes: formData.notes,
//           lead_id: currentLeadId,
//           timestamp: Date.now(),
//           area_id: selectedArea?.id,
//           city_id: selectedArea?.city_id,
//           selected_color: selectedColor,
//         };

//         localStorage.setItem(
//           "existingCustomerData",
//           JSON.stringify(customerDataToStore)
//         );

//         // Navigate to generate new vehicle
//         navigate("/leads/generate", {
//           state: {
//             isAddingAnotherVehicle: true,
//             leadId: currentLeadId,
//             customerData: customerDataToStore,
//             preserveFormData: true,
//           },
//           replace: true,
//         });
//       }
//     } catch (err) {
//       console.error("Add vehicle failed:", err.response?.data);
//       const errorMsg =
//         err.response?.data?.message ||
//         "Failed to add vehicle. Please check if all required fields are filled.";
//       setErrorMessage(errorMsg);
//       window.scrollTo({ top: 0, behavior: "smooth" });

//       setTimeout(() => setErrorMessage(null), 5000);
//     }
//   };

//   // ========== LOCATION HANDLING ==========

//   const fetchLocations = async (searchText) => {
//     if (!searchText || searchText.trim().length < 2) {
//       setLocations([]);
//       setShowLocationDropdown(false);
//       return;
//     }

//     try {
//       setLoadingLocations(true);
//       const response = await axios.get(`${API_BASE}/locations/search`, {
//         headers: getAuthHeaders(),
//         params: { search: searchText.trim() },
//       });

//       if (response.data.success) {
//         setLocations(response.data.data);
//         setShowLocationDropdown(response.data.data.length > 0);
//       } else {
//         setLocations([]);
//         setShowLocationDropdown(false);
//       }
//     } catch (err) {
//       console.error("Error fetching locations:", err);
//       setLocations([]);
//       setShowLocationDropdown(false);
//     } finally {
//       setLoadingLocations(false);
//     }
//   };

//   const fetchAreasForCity = async (cityId, cityName) => {
//     if (!cityId) {
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//       return;
//     }

//     try {
//       setLoadingDealerAreas(true);
//       const dealerId = getCurrentDealerId();

//       const response = await axios.get(
//         `${API_BASE}/areas/dealer-areas/${cityId}`,
//         {
//           headers: getAuthHeaders(),
//           params: { dealer_id: dealerId },
//         }
//       );

//       if (response.data.success) {
//         setDealerAssignedAreas(response.data.data);
//         setShowAreaDropdown(response.data.data.length > 0);

//         if (response.data.is_dealer_assigned) {
//           toast.success(
//             `Showing your assigned areas for ${response.data.city_name}`
//           );
//         }
//       } else {
//         setDealerAssignedAreas([]);
//         setShowAreaDropdown(false);
//       }
//     } catch (err) {
//       console.error("Error fetching areas:", err);
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//     } finally {
//       setLoadingDealerAreas(false);
//     }
//   };

//   const handleLocationSearchChange = (e) => {
//     const value = e.target.value;
//     setLocationSearchText(value);

//     if (value.trim().length >= 2) {
//       setShowLocationDropdown(true);
//       fetchLocations(value);
//     } else {
//       setShowLocationDropdown(false);
//       setLocations([]);
//     }
//   };

//   // Handle location selection
//   const handleLocationSelect = (location) => {
//     console.log("Location selected:", location);

//     setFormData((prev) => ({
//       ...prev,
//       customerLocation: location.city_name || location.name,
//       customerArea: "", // Clear area when location changes
//     }));

//     setLocationSearchText(location.city_name || location.name);
//     setSelectedCityId(location.id);
//     setShowLocationDropdown(false);
//     setLocations([]);

//     // Clear previous dealer/distributor mappings
//     setAssignedDealerId(null);
//     setAssignedDistributorId(null);
//     setAssignedDealerName("");
//     setAssignedDistributorName("");

//     // Fetch areas for the selected city
//     fetchAreasForCity(location.id, location.city_name || location.name);
//   };

//   // Handle area selection
//   const handleAreaSelect = (area) => {
//     setFormData((prev) => ({ ...prev, customerArea: area.name }));
//     setSelectedAreaId(area.id);
//     setShowAreaDropdown(false);

//     // Fetch dealer/distributor mapping when area is selected
//     if (area.id && selectedCityId) {
//       fetchDealerDistributorMapping(area.id, selectedCityId);
//     }
//   };

//   const handleChange = (e) => {
//     const { id, name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id || name]: value }));
//     setErrorMessage(null);
//   };

//   const handleCheckboxChange = (e) => {
//     setUseSameCustomerDetails(e.target.checked);
//   };

//   // ========== RENDER DEALER ASSIGNMENT COMPONENT ==========

//   const renderDealerAssignmentStatus = () => {
//     return (
//       <div className="mb-4">
//         {loadingDealerMapping && (
//           <div className="flex items-center gap-2 text-blue-600 text-sm bg-blue-50 border border-blue-200 rounded-lg p-3">
//             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//             Assigning dealer for selected area...
//           </div>
//         )}

//         {assignedDealerId && !loadingDealerMapping && (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//             <div className="flex items-center gap-2 text-green-700 mb-2">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path
//                   fillRule="evenodd"
//                   d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span className="font-medium">Dealer Assigned Successfully</span>
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
//               <div>
//                 <span className="font-medium text-gray-700">Dealer:</span>
//                 <span className="ml-2 text-green-600">
//                   {assignedDealerName} (ID: {assignedDealerId})
//                 </span>
//               </div>
//               {assignedDistributorId && (
//                 <div>
//                   <span className="font-medium text-gray-700">
//                     Distributor:
//                   </span>
//                   <span className="ml-2 text-green-600">
//                     {assignedDistributorName} (ID: {assignedDistributorId})
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {!assignedDealerId &&
//           formData.customerArea &&
//           !loadingDealerMapping && (
//             <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//               <div className="flex items-center gap-2 text-yellow-700">
//                 <svg
//                   className="w-4 h-4"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span>
//                   No dealer assigned for this area. Please contact
//                   administrator.
//                 </span>
//               </div>
//             </div>
//           )}
//       </div>
//     );
//   };

//   // ========== USE EFFECTS ==========

//   useEffect(() => {
//     localStorage.removeItem("leadId");
//     localStorage.removeItem("draftLead");
//     setLeadId(null);
//     setLeadDetails(null);
//     setSelectedCityId(null); // Reset

//     const stored = localStorage.getItem("recentSubmittedLead");
//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored);
//         if (Array.isArray(parsed)) setStoredLeads(parsed);
//       } catch (err) {}
//     }

//     const draft = localStorage.getItem("draftLead");
//     if (draft) {
//       try {
//         setFormData((prev) => ({ ...prev, ...JSON.parse(draft) }));
//       } catch (err) {}
//     }

//     const vehiclesStored = localStorage.getItem("allVehiclesForCurrentLead");
//     if (vehiclesStored && location.state?.isAddingAnotherVehicle) {
//       try {
//         setAllVehiclesForCurrentLead(JSON.parse(vehiclesStored));
//       } catch (err) {}
//     }
//   }, []);

//   useEffect(() => {
//     if (location.state?.isAddingAnotherVehicle && leadId) {
//       document.getElementById("customerName")?.setAttribute("disabled", true);
//       document.getElementById("locationSearch")?.setAttribute("disabled", true);
//       document.getElementById("customerArea")?.setAttribute("disabled", true);
//       document.getElementById("purchaseDate")?.setAttribute("enabled", true);
//       document
//         .querySelector('input[name="paymentMode"][value="cash"]')
//         ?.setAttribute("disabled", true);
//       document
//         .querySelector('input[name="paymentMode"][value="finance"]')
//         ?.setAttribute("disabled", true);
//       document.getElementById("quantity")?.setAttribute("enabled", true);
//       setErrorMessage(
//         "Customer details locked - Adding another vehicle to existing lead"
//       );

//       setTimeout(() => {
//         setErrorMessage("");
//       }, 4000);
//     }
//   }, [location.state?.isAddingAnotherVehicle, leadId]);

//   useEffect(() => {
//     const loadExistingCustomerData = () => {
//       const storedCustomerData = localStorage.getItem("existingCustomerData");
//       const isNewLead = !location.state?.isAddingAnotherVehicle;

//       if (isNewLead) {
//         localStorage.removeItem("existingCustomerData");
//         localStorage.removeItem("leadId");
//         localStorage.removeItem("allVehiclesForCurrentLead");
//         setAllVehiclesForCurrentLead([]);
//         setSelectedCityId(null);

//         // IMPORTANT: Use the quantity from location.state if available
//         const initialQuantity = quantity || 1;

//         setFormData({
//           customerName: "",
//           phoneNumber: "",
//           customerLocation: "",
//           customerArea: "",
//           purchaseDate: "",
//           quantity: initialQuantity, // Use the passed quantity
//           paymentMode: "cash",
//           notes: "",
//         });
//         setLeadId(null);
//         setLocationSearchText("");
//         return;
//       }

//       if (storedCustomerData && location.state?.isAddingAnotherVehicle) {
//         try {
//           const customerData = JSON.parse(storedCustomerData);
//           const isRecent =
//             new Date().getTime() - customerData.timestamp < 10 * 60 * 1000;

//           if (isRecent) {
//             // Format date properly
//             let formattedDate = "";
//             if (customerData.purchase_date) {
//               if (/^\d{4}-\d{2}-\d{2}$/.test(customerData.purchase_date)) {
//                 formattedDate = customerData.purchase_date;
//               } else {
//                 const date = new Date(customerData.purchase_date);
//                 if (!isNaN(date.getTime())) {
//                   formattedDate = date.toISOString().split("T")[0];
//                 }
//               }
//             }

//             // PRIORITIZE QUANTITY FROM MODELDETAILS OVER STORED DATA
//             const finalQuantity = quantity || customerData.quantity || 1;

//             setFormData((prev) => ({
//               ...prev,
//               customerName: customerData.customer_name || "",
//               phoneNumber: customerData.phone_no || "",
//               customerLocation: customerData.location || "",
//               customerArea: customerData.area || "",
//               purchaseDate: formattedDate,
//               paymentMode: customerData.payment_mode || "cash",
//               quantity: finalQuantity, // Use the passed quantity
//               notes: customerData.notes || "",
//             }));

//             setLocationSearchText(customerData.location || "");
//             setSelectedCityId(customerData.city_id || null);

//             const finalLeadId = customerData.lead_id || location.state?.leadId;
//             if (finalLeadId) {
//               setLeadId(finalLeadId);
//               localStorage.setItem("leadId", finalLeadId);
//             }

//             const vehiclesStored = localStorage.getItem(
//               "allVehiclesForCurrentLead"
//             );
//             if (vehiclesStored) {
//               try {
//                 setAllVehiclesForCurrentLead(JSON.parse(vehiclesStored));
//               } catch (err) {
//                 console.error("Error parsing stored vehicles:", err);
//               }
//             }
//           } else {
//             localStorage.removeItem("existingCustomerData");
//           }
//         } catch (err) {
//           console.error("Error loading customer data:", err);
//           localStorage.removeItem("existingCustomerData");
//         }
//       }
//     };

//     loadExistingCustomerData();
//   }, [location.state, quantity]); // Add quantity to dependency array

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const headers = getAuthHeaders();
//         const [brandsRes, ccsRes, fuelRes, galleriesRes] = await Promise.all([
//           axios.get(`${API_BASE}/brands`, { headers }),
//           axios.get(`${API_BASE}/ccs`, { headers }),
//           axios.get(`${API_BASE}/fuel-types`, { headers }),
//           axios.get(`${API_BASE}/galleries`, { headers }),
//         ]);
//         setBrands(brandsRes.data.data || brandsRes.data || []);
//         setCcs(ccsRes.data.data || ccsRes.data || []);
//         setFuelTypes(fuelRes.data.data || fuelRes.data || []);
//         setGalleries(galleriesRes.data.data || galleriesRes.data || []);
//       } catch (err) {}
//     };
//     fetchData();
//   }, [variant]);

//   useEffect(() => {
//     const loadLead = async () => {
//       if (!leadId) return;
//       try {
//         const res = await axios.get(`${API_BASE}/leads/${leadId}`, {
//           headers: getAuthHeaders(),
//         });
//         const data = res.data.data || res.data;
//         setLeadDetails(data);
//       } catch (err) {
//         localStorage.removeItem("leadId");
//         setLeadId(null);
//         setLeadDetails(null);
//       }
//     };
//     loadLead();
//   }, [leadId]);

//   useEffect(() => {
//     if (leadDetails && !localStorage.getItem("draftLead")) {
//       setFormData({
//         customerName: leadDetails.customer_name || "",
//         phoneNumber: leadDetails.phone_no || "",
//         customerLocation: leadDetails.location || "",
//         customerArea: leadDetails.area || "",
//         purchaseDate: leadDetails.tentative_purchase_date || "",
//         quantity: leadDetails.vehicle_qty || 1,
//         paymentMode: leadDetails.payment_mode || "cash",
//         notes: leadDetails.additional_note || "",
//       });
//     }
//   }, [leadDetails]);

//   useEffect(() => {
//     if (useSameCustomerDetails && storedLeads.length > 0) {
//       const latestLead = storedLeads[storedLeads.length - 1];
//       setFormData((prev) => ({
//         ...prev,
//         customerName: latestLead.customer_name || "",
//         phoneNumber: latestLead.phone_no || "",
//         customerLocation: latestLead.location || "",
//         customerArea: latestLead.area || "",
//         purchaseDate: latestLead.tentative_purchase_date || "",
//         quantity: latestLead.vehicle_qty || 1,
//         paymentMode: latestLead.payment_mode || "cash",
//         notes: latestLead.additional_note || "",
//       }));
//     }
//   }, [useSameCustomerDetails, storedLeads]);

//   useEffect(() => {
//     if (formData.customerLocation) {
//       fetchDealerAreas(formData.customerLocation);
//     } else {
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//     }
//   }, [formData.customerLocation]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (locationSearchText && locationSearchText.trim().length >= 2) {
//         fetchLocations(locationSearchText);
//       } else {
//         setLocations([]);
//         setShowLocationDropdown(false);
//       }
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [locationSearchText]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".location-search-container"))
//         setShowLocationDropdown(false);
//       if (!event.target.closest(".area-select-container"))
//         setShowAreaDropdown(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // ========== RENDER ==========

//   return (
//     <div className="m-4">
//       <Stepper step={3} />

//       {/* Vehicles Overlay */}
//       {showVehiclesOverlay && renderVehiclesOverlay()}

//       {showVehiclePopup &&
//         selectedVehicleForPopup &&
//         renderVehiclePopup(
//           selectedVehicleForPopup.vehicle,
//           selectedVehicleForPopup.index,
//           selectedVehicleForPopup.isCurrent
//         )}

//       {errorMessage && (
//         <p className="text-red-600 font-semibold mb-4 text-sm sm:text-base">
//           {errorMessage}
//         </p>
//       )}

//       <div className="page-header flex justify-between items-center">
//         <h3 className="text-base sm:text-lg font-semibold">
//           New Lead Information
//         </h3>
//       </div>

//       <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//         <div className="mb-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-200 transition-colors flex items-center"
//           >
//             ← Back
//           </button>
//         </div>

//         {/* Dealer Assignment Status */}
//         {renderDealerAssignmentStatus()}

//         {/* Selected Vehicles Preview */}
//         {renderSelectedVehiclesPreview()}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
//           <div className="space-y-3 sm:space-y-4">
//             <div>
//               <label
//                 htmlFor="customerName"
//                 className="block font-medium mb-1 text-sm sm:text-base"
//               >
//                 Customer Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="customerName"
//                 value={formData.customerName}
//                 onChange={handleChange}
//                 placeholder="Enter customer name"
//                 className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="phoneNumber"
//                 className="block font-medium mb-1 text-sm sm:text-base"
//               >
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 id="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 placeholder="10-digit phone number"
//                 className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//                 required
//                 pattern="\d{10}"
//               />
//             </div>

//             {/* Location Search - City */}
//             <div className="relative location-search-container">
//               <label
//                 htmlFor="locationSearch"
//                 className="block font-medium mb-1 text-sm sm:text-base"
//               >
//                 Location (City) <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   id="locationSearch"
//                   value={locationSearchText}
//                   onChange={handleLocationSearchChange}
//                   onFocus={() =>
//                     locationSearchText.length >= 2 &&
//                     setShowLocationDropdown(true)
//                   }
//                   placeholder="Type city name (e.g., Pune, Mumbai)"
//                   className="w-full border border-gray-300 p-2.5 rounded-lg pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                   autoComplete="off"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   {loadingLocations ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                   ) : (
//                     <svg
//                       className="h-4 w-4 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   )}
//                 </div>
//               </div>

//               {/* Location Dropdown */}
//               {showLocationDropdown && (
//                 <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                   {locations.length > 0 ? (
//                     locations.map((location) => (
//                       <div
//                         key={location.id}
//                         className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
//                         onClick={() => handleLocationSelect(location)}
//                       >
//                         <div className="font-medium text-gray-800 text-sm">
//                           {location.city_name || location.name}
//                         </div>
//                         {location.state_name && (
//                           <div className="text-xs text-gray-500 mt-1">
//                             {location.state_name}
//                           </div>
//                         )}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="px-4 py-3 text-gray-500 text-center text-sm">
//                       {locationSearchText.length >= 2
//                         ? "No locations found. Try different keywords."
//                         : "Type at least 2 characters to search"}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Area Selection */}
//             <div className="relative area-select-container">
//               <label
//                 htmlFor="customerArea"
//                 className="block font-medium mb-1 text-sm sm:text-base"
//               >
//                 Area <span className="text-red-500">*</span>
//                 <span className="text-gray-500 text-xs ml-2">
//                   {getCurrentDealerId() ? "(Dealer Assigned)" : "(All Areas)"}
//                 </span>
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   id="customerArea"
//                   value={formData.customerArea}
//                   onChange={handleChange}
//                   onClick={() =>
//                     formData.customerLocation &&
//                     setShowAreaDropdown(!showAreaDropdown)
//                   }
//                   placeholder={
//                     formData.customerLocation
//                       ? "Select area"
//                       : "Select a city first"
//                   }
//                   className={`w-full border border-gray-300 p-2.5 rounded-lg pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                     !formData.customerLocation
//                       ? "bg-gray-100 cursor-not-allowed"
//                       : "cursor-pointer"
//                   }`}
//                   readOnly
//                   disabled={!formData.customerLocation}
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   {loadingDealerAreas ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                   ) : (
//                     <svg
//                       className="h-4 w-4 text-gray-400"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   )}
//                 </div>
//               </div>

//               {/* Area Dropdown */}
//               {showAreaDropdown && (
//                 <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                   {dealerAssignedAreas.length > 0 ? (
//                     <>
//                       <div className="px-3 py-2 text-xs bg-blue-50 border-b">
//                         <div className="font-medium text-blue-700">
//                           {getCurrentDealerId()
//                             ? "Your Assigned Areas"
//                             : "All Areas"}{" "}
//                           for {formData.customerLocation}
//                         </div>
//                       </div>
//                       {dealerAssignedAreas.map((area) => (
//                         <div
//                           key={area.id}
//                           className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
//                           onClick={() => handleAreaSelect(area)}
//                         >
//                           <div className="font-medium text-gray-800 text-sm">
//                             {area.name}
//                           </div>
//                           {area.city_name && (
//                             <div className="text-xs text-gray-500 mt-1">
//                               {area.city_name}
//                               {area.state_name && `, ${area.state_name}`}
//                             </div>
//                           )}
//                         </div>
//                       ))}
//                     </>
//                   ) : (
//                     <div className="px-4 py-3 text-gray-500 text-center text-sm">
//                       {formData.customerLocation
//                         ? "No areas found for this location"
//                         : "Select a location first"}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="space-y-3 sm:space-y-4">
//             <div>
//               <label
//                 htmlFor="purchaseDate"
//                 className="block font-medium mb-1 text-sm sm:text-base"
//               >
//                 Tentative Purchase Date<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 id="purchaseDate"
//                 name="purchaseDate"
//                 value={formData.purchaseDate}
//                 onChange={handleChange}
//                 className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//                 min={new Date().toISOString().split("T")[0]}
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1 text-sm sm:text-base">
//                 Payment Mode <span className="text-red-500">*</span>
//               </label>
//               <div className="flex gap-3 sm:gap-4">
//                 <label className="flex items-center text-sm sm:text-base">
//                   <input
//                     type="radio"
//                     name="paymentMode"
//                     value="cash"
//                     checked={formData.paymentMode === "cash"}
//                     onChange={handleChange}
//                     className="mr-2"
//                     required
//                   />{" "}
//                   Cash
//                 </label>
//                 <label className="flex items-center text-sm sm:text-base">
//                   <input
//                     type="radio"
//                     name="paymentMode"
//                     value="finance"
//                     checked={formData.paymentMode === "finance"}
//                     onChange={handleChange}
//                     className="mr-2"
//                   />{" "}
//                   Finance
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label
//             htmlFor="notes"
//             className="block font-medium mb-1 text-sm sm:text-base"
//           >
//             Additional Notes
//           </label>
//           <textarea
//             id="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             placeholder="Enter any additional notes..."
//             rows="3"
//             className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//           />
//         </div>

//         {storedLeads.length > 0 && (
//           <div className="mb-6">
//             <label className="flex items-center text-sm sm:text-base">
//               <input
//                 type="checkbox"
//                 checked={useSameCustomerDetails}
//                 onChange={handleCheckboxChange}
//                 className="mr-2"
//               />{" "}
//               Auto-Fill
//             </label>
//           </div>
//         )}

//         <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
//           <button
//             onClick={handleSaveDraft}
//             className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors order-2 sm:order-1"
//           >
//             Save as Draft
//           </button>
//           <button
//             onClick={addNewVehicle}
//             className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors order-3 sm:order-2"
//           >
//             Add Another Vehicle
//           </button>
//           <button
//             onClick={() => handleSubmit("submit")}
//             disabled={isSubmitting}
//             className={`relative bg-primary-blue text-white rounded-lg px-6 py-3 font-medium flex items-center justify-center transition-all ${
//               isSubmitting
//                 ? "opacity-80 cursor-not-allowed"
//                 : "hover:bg-hover-blue"
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Submitting...
//               </>
//             ) : (
//               "Submit Lead"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadInformation;

// import React, { useState, useEffect, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Stepper from "../../components/Stepper";
// import axios from "axios";
// import toast from "react-hot-toast";

// const LeadInformation = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const {
//     variant,
//     colors = [],
//     colorSelections = {},
//     totalQuantity,
//     totalPrice,
//     galleries,
//     brands = [],
//     fuelTypes = [],
//     ccs = [],
//     quantity,
//   } = location.state || {};

//   const [formData, setFormData] = useState({
//     customerName: "",
//     phoneNumber: "",
//     customerLocation: "",
//     customerArea: "",
//     purchaseDate: "",
//     quantity: totalQuantity || quantity || 1,
//     paymentMode: "cash",
//     notes: "",
//   });
//   const [leadId, setLeadId] = useState(localStorage.getItem("leadId") || null);
//   const [leadDetails, setLeadDetails] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [areas, setAreas] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [storedLeads, setStoredLeads] = useState([]);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [useSameCustomerDetails, setUseSameCustomerDetails] = useState(false);
//   const [loadingAreas, setLoadingAreas] = useState(false);
//   const [loadingLocations, setLoadingLocations] = useState(false);
//   const [showAreaDropdown, setShowAreaDropdown] = useState(false);
//   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
//   const [locationSearchText, setLocationSearchText] = useState("");
//   const [selectedAreaId, setSelectedAreaId] = useState(null);
//   const [selectedVehicleForPopup, setSelectedVehicleForPopup] = useState(null);
//   const [showVehiclePopup, setShowVehiclePopup] = useState(false);
//   const [showVehiclesOverlay, setShowVehiclesOverlay] = useState(false);
//   // Dealer mapping states
//   const [dealerAssignedAreas, setDealerAssignedAreas] = useState([]);
//   const [loadingDealerAreas, setLoadingDealerAreas] = useState(false);
//   const [assignedDealerId, setAssignedDealerId] = useState(null);
//   const [assignedDistributorId, setAssignedDistributorId] = useState(null);
//   const [assignedDealerName, setAssignedDealerName] = useState("");
//   const [assignedDistributorName, setAssignedDistributorName] = useState("");
//   const [loadingDealerMapping, setLoadingDealerMapping] = useState(false);
//   // Vehicle management state
//   const [allVehiclesForCurrentLead, setAllVehiclesForCurrentLead] = useState([]);
//   const [selectedCityId, setSelectedCityId] = useState(null);
//   // Current vehicles from color selections
//   const currentVehicles = useMemo(() => {
//     return Object.entries(colorSelections).filter(([_, q]) => q > 0).map(([idStr, q]) => {
//       const colorId = parseInt(idStr);
//       const color = colors.find(c => c.id === colorId);
//       return {
//         variant,
//         color,
//         quantity: q,
//         price: color?.price || 0,
//       };
//     });
//   }, [colorSelections, colors, variant]);

//   const API_BASE = "http://localhost:8000/api";
//   const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   // Calculate total quantity
//   const calculateTotalQuantity = useMemo(() => {
//     const savedQuantity = allVehiclesForCurrentLead.reduce((total, v) => total + (v.quantity || 1), 0);
//     const currentTotal = currentVehicles.reduce((total, v) => total + v.quantity, 0);
//     return savedQuantity + currentTotal;
//   }, [allVehiclesForCurrentLead, currentVehicles]);

//   const getTotalDisplayQuantity = () => calculateTotalQuantity;

//   // Dealer mapping functions
//   const getCurrentDealerId = () => {
//     const possibleUserDataKeys = [
//       "userData",
//       "user",
//       "currentUser",
//       "authUser",
//       "userInfo",
//     ];
//     for (const key of possibleUserDataKeys) {
//       const storedData = localStorage.getItem(key);
//       if (storedData) {
//         try {
//           const user = JSON.parse(storedData);
//           if (user.id) return user.id;
//           if (user.user_id) return user.user_id;
//           if (user.dealer_id) return user.dealer_id;
//           if (user.userId) return user.userId;
//         } catch (err) {}
//       }
//     }
//     const authToken = localStorage.getItem("authToken");
//     if (authToken) {
//       try {
//         const payload = JSON.parse(atob(authToken.split(".")[1]));
//         if (payload.user_id) return payload.user_id;
//         if (payload.id) return payload.id;
//         if (payload.sub) return payload.sub;
//       } catch (err) {}
//     }
//     for (const key of possibleUserDataKeys) {
//       const storedData = sessionStorage.getItem(key);
//       if (storedData) {
//         try {
//           const user = JSON.parse(storedData);
//           if (user.id) return user.id;
//           if (user.user_id) return user.user_id;
//         } catch (err) {}
//       }
//     }
//     return null;
//   };

//   const fetchDealerDistributorMapping = async (areaId, cityId) => {
//     if (!areaId || !cityId) {
//       setAssignedDealerId(null);
//       setAssignedDistributorId(null);
//       setAssignedDealerName("");
//       setAssignedDistributorName("");
//       return;
//     }
//     try {
//       setLoadingDealerMapping(true);
//       const response = await axios.get(
//         `${API_BASE}/dealer/distributor-mapping`,
//         {
//           headers: getAuthHeaders(),
//           params: {
//             area_id: areaId,
//             city_id: cityId,
//           },
//         }
//       );
//       if (response.data.success) {
//         setAssignedDealerId(response.data.dealer_id);
//         setAssignedDistributorId(response.data.distributor_id);
//         setAssignedDealerName(response.data.dealer_name);
//         setAssignedDistributorName(response.data.distributor_name);
//         toast.success(`Dealer assigned: ${response.data.dealer_name}`);
//       } else {
//         setAssignedDealerId(null);
//         setAssignedDistributorId(null);
//         setAssignedDealerName("");
//         setAssignedDistributorName("");
//         console.warn("No dealer mapping found for this area");
//       }
//     } catch (error) {
//       console.error("Error fetching dealer mapping:", error);
//       setAssignedDealerId(null);
//       setAssignedDistributorId(null);
//       setAssignedDealerName("");
//       setAssignedDistributorName("");
//     } finally {
//       setLoadingDealerMapping(false);
//     }
//   };

//   // Vehicle display functions
//   const getVehicleImage = (vehicleVariant, color = null) => {
//     if (!vehicleVariant) return null;
//     let gallery;
//     if (color && color.id) {
//       gallery = galleries.find(
//         (g) => g.variant_id === vehicleVariant.id && g.color_id === color.id
//       );
//     }
//     if (!gallery) {
//       gallery = galleries.find((g) => g.variant_id === vehicleVariant.id);
//     }
//     let photos = [];
//     if (gallery) {
//       try {
//         const photoField = gallery.vehicle_photos || gallery.cover_photos;
//         photos =
//           typeof photoField === "string" ? JSON.parse(photoField) : photoField;
//         if (!Array.isArray(photos)) photos = [photoField].filter(Boolean);
//       } catch (e) {
//         photos = [];
//       }
//     }
//     return photos[0] || null;
//   };

//   const getVehiclePrice = (vehicleVariant, vehicleColor = null) => {
//     if (!vehicleVariant) return 0;
//     if (vehicleColor && vehicleColor.price) {
//       return parseFloat(vehicleColor.price);
//     }
//     const price =
//       vehicleVariant.basic_price ||
//       vehicleVariant.price ||
//       vehicleVariant.ex_showroom_price ||
//       vehicleVariant.on_road_price ||
//       0;
//     return parseFloat(price) || 0;
//   };

//   // Vehicle card rendering
//   const renderVehicleCard = (vehicle, index) => {
//     if (!vehicle || !vehicle.variant) return null;

//     const color = vehicle.color;
//     const mainPhoto = getVehicleImage(vehicle.variant, color);
//     const vehicleVariant = vehicle.variant;
//     const basicPrice = getVehiclePrice(vehicleVariant, color);
//     const exShowroomPrice = vehicleVariant?.ex_showroom_price || 0;
//     const onRoadPrice = vehicleVariant?.on_road_price || 0;
//     const vehicleQuantity = vehicle.quantity || 1;

//     const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;
//     const totalExShowroomPrice = parseFloat(exShowroomPrice) * vehicleQuantity;
//     const totalOnRoadPrice = parseFloat(onRoadPrice) * vehicleQuantity;

//     return (
//       <div
//         key={index}
//         className="bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border-gray-200"
//         onClick={() => {
//           setSelectedVehicleForPopup({ vehicle, index });
//           setShowVehiclePopup(true);
//         }}
//       >
//         <div className="flex items-start justify-between">
//           <div className="flex-1 min-w-0">
//             <div className="flex justify-between items-start mb-2">
//               <h4 className="font-semibold text-gray-800 text-sm truncate">
//                 Vehicle {index + 1}
//               </h4>
//             </div>

//             {/* Vehicle Details */}
//             <div className="space-y-1 text-xs">
//               <p className="text-gray-600 truncate">
//                 <span className="font-medium">Variant:</span> {vehicleVariant.name}
//               </p>

//               {/* Color Display */}
//               {color && (
//                 <p className="text-gray-600 truncate flex items-center gap-2">
//                   <span className="font-medium">Color:</span>
//                   <span
//                     className="w-5 h-5 rounded-full border border-gray-400 shadow"
//                     style={{ backgroundColor: color.color_code }}
//                     title={color.name}
//                   ></span>
//                   <span className="text-xs">{color.name}</span>
//                 </p>
//               )}

//               {/* Quantity Display */}
//               <div className="flex items-center justify-between">
//                 <span className="font-medium text-gray-600">Quantity:</span>
//                 <div className="flex items-center">
//                   <span className="px-2 py-1 min-w-8 text-center font-medium bg-gray-100 rounded">
//                     {vehicleQuantity}
//                   </span>
//                 </div>
//               </div>

//               {/* Price Display */}
//               <div className="space-y-1 mt-2">
//                 {basicPrice > 0 && (
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600 font-medium">Price:</span>
//                     <div className="text-right">
//                       <p className="text-green-600 font-semibold text-sm">
//                         ${parseFloat(basicPrice).toLocaleString()}
//                       </p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-green-500 text-xs">
//                           Total: ${totalBasicPrice.toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {mainPhoto && (
//             <div className="ml-3 flex-shrink-0">
//               <img
//                 src={`${API_BASE.replace("/api", "")}/uploads/coverPhotos/${mainPhoto}`}
//                 alt={vehicleVariant.name}
//                 className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border"
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderCompactVehicleCard = (vehicle, index) => {
//     if (!vehicle || !vehicle.variant) return null;

//     const color = vehicle.color;
//     const mainPhoto = getVehicleImage(vehicle.variant, color);
//     const vehicleVariant = vehicle.variant;
//     const vehiclePrice = getVehiclePrice(vehicleVariant, color);
//     const onRoadPrice = vehicleVariant?.on_road_price || 0;
//     const vehicleQuantity = vehicle.quantity || 1;

//     return (
//       <div
//         key={index}
//         className="bg-white rounded-lg border p-2 shadow-sm cursor-pointer border-gray-200"
//         onClick={() => {
//           setSelectedVehicleForPopup({ vehicle, index });
//           setShowVehiclePopup(true);
//         }}
//       >
//         <div className="flex items-center space-x-2">
//           {mainPhoto && (
//             <div className="flex-shrink-0">
//               <img
//                 src={`${API_BASE.replace("/api", "")}/uploads/coverPhotos/${mainPhoto}`}
//                 alt={vehicleVariant.name}
//                 className="w-full h-12 object-cover rounded border"
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/48x48/f3f4f6/6b7280?text=No+Image";
//                 }}
//               />
//             </div>
//           )}
//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between">
//               <div className="flex-1 min-w-0">
//                 <div className="flex justify-between items-start mb-1">
//                   <p className="font-medium text-gray-800 text-sm truncate">
//                     {vehicleVariant.name}
//                   </p>
//                 </div>

//                 {/* Color Display */}
//                 {color && (
//                   <p className="text-xs text-gray-600 truncate flex items-center gap-1">
//                     <span
//                       className="w-3 h-3 rounded-full border border-gray-300"
//                       style={{ backgroundColor: color.color_code }}
//                     ></span>
//                     {color.name}
//                   </p>
//                 )}

//                 <p className="text-xs text-gray-600 truncate">
//                   {brands.find((b) => b.id === vehicleVariant.brand_id)?.name || "N/A"} •
//                   {ccs.find((c) => c.id === vehicleVariant.cc_id)?.name || "N/A"} •
//                   {fuelTypes.find((f) => f.id === vehicleVariant.fuel_type_id)?.name || "N/A"}
//                 </p>

//                 {/* Quantity */}
//                 <div className="flex items-center justify-between my-1">
//                   <span className="text-xs text-gray-600 font-medium">Qty:</span>
//                   <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium">
//                     {vehicleQuantity}
//                   </span>
//                 </div>

//                 {/* Price Display */}
//                 {vehiclePrice > 0 ? (
//                   <div>
//                     <p className="text-xs text-green-600 font-medium truncate">
//                       ${vehiclePrice.toLocaleString()}
//                       <small className="text-black ml-1">*On-Road Price</small>
//                     </p>
//                     {vehicleQuantity > 1 && (
//                       <p className="text-xs text-green-700 font-semibold truncate">
//                         Total: ${(vehiclePrice * vehicleQuantity).toLocaleString()}*
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="text-xs text-gray-500 truncate">
//                     Price on request
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Vehicles overlay
//   const renderVehiclesOverlay = () => {
//     const allVehicles = [...allVehiclesForCurrentLead, ...currentVehicles];
//     if (allVehicles.length === 0) return null;

//     const totalQuantity = allVehicles.reduce((total, vehicle) => total + (vehicle.quantity || 1), 0);

//     const totalBasicPrice = allVehicles.reduce((total, vehicle) => {
//       const basicPrice = getVehiclePrice(vehicle.variant, vehicle.color);
//       const vehicleQuantity = vehicle.quantity || 1;
//       return total + (parseFloat(basicPrice) || 0) * vehicleQuantity;
//     }, 0);

//     const totalExShowroomPrice = allVehicles.reduce((total, vehicle) => {
//       const exShowroomPrice = vehicle.variant?.ex_showroom_price || 0;
//       const vehicleQuantity = vehicle.quantity || 1;
//       return total + (parseFloat(exShowroomPrice) || 0) * vehicleQuantity;
//     }, 0);

//     const totalOnRoadPrice = allVehicles.reduce((total, vehicle) => {
//       const onRoadPrice = vehicle.variant?.on_road_price || 0;
//       const vehicleQuantity = vehicle.quantity || 1;
//       return total + (parseFloat(onRoadPrice) || 0) * vehicleQuantity;
//     }, 0);

//     const totalTaxes = totalOnRoadPrice - totalExShowroomPrice;
//     const rtoCost = totalOnRoadPrice * 0.05;
//     const insuranceCost = totalOnRoadPrice * 0.03;
//     const otherCharges = totalOnRoadPrice * 0.02;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//           <div className="bg-[#0f66af] text-white px-4 sm:px-6 py-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg sm:text-xl font-semibold">
//                 Vehicle Details & Price Breakdown
//               </h3>
//               <button
//                 onClick={() => setShowVehiclesOverlay(false)}
//                 className="text-white hover:text-gray-200 transition-colors p-1"
//               >
//                 <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
//               {allVehicles.map((vehicle, index) => renderVehicleCard(vehicle, index))}
//             </div>

//             <div className="bg-gray-50 rounded-lg border p-4 sm:p-6">
//               <h4 className="font-bold text-gray-800 mb-4 text-lg">Price Breakdown</h4>
//               <div className="space-y-3">
//                 {allVehicles.map((vehicle, index) => {
//                   const vehicleVariant = vehicle.variant;
//                   const color = vehicle.color;
//                   const vehiclePrice = getVehiclePrice(vehicleVariant, color);
//                   const vehicleQuantity = vehicle.quantity || 1;
//                   const totalVehiclePrice = vehiclePrice * vehicleQuantity;

//                   if (vehiclePrice <= 0) return null;

//                   return (
//                     <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <span className="text-gray-700 font-medium">{vehicleVariant.name}</span>
//                           {color && (
//                             <div className="flex items-center gap-2 mt-1">
//                               <span
//                                 className="w-4 h-4 rounded-full border border-gray-300"
//                                 style={{ backgroundColor: color.color_code }}
//                               ></span>
//                               <span className="text-sm text-gray-600">{color.name}</span>
//                             </div>
//                           )}
//                         </div>
//                         <div className="text-right">
//                           <span className="text-green-600 font-semibold">${totalVehiclePrice.toLocaleString()}</span>
//                           {vehicleQuantity > 1 && (
//                             <p className="text-sm text-gray-600">(${parseFloat(vehiclePrice).toLocaleString()} × {vehicleQuantity})</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}

//                 <div className="border-t border-gray-300 pt-4">
//                   {totalExShowroomPrice > 0 && (
//                     <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-700 font-medium">Ex-Showroom Price</span>
//                         <span className="text-xs text-gray-500">(Before taxes)</span>
//                       </div>
//                       <span className="text-blue-600 font-semibold">${totalExShowroomPrice.toLocaleString()}</span>
//                     </div>
//                   )}

//                   {totalTaxes > 0 && (
//                     <div className="pl-4 border-l-2 border-gray-300">
//                       <h5 className="font-medium text-gray-600 mb-2">Taxes & Charges:</h5>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">RTO Registration</span>
//                           <span className="text-gray-700">${rtoCost.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Insurance</span>
//                           <span className="text-gray-700">${insuranceCost.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Other Charges</span>
//                           <span className="text-gray-700">${otherCharges.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between pt-2 border-t border-gray-200">
//                           <span className="text-gray-700 font-medium">Total Taxes</span>
//                           <span className="text-gray-700 font-medium">${totalTaxes.toLocaleString()}</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {totalOnRoadPrice > 0 && (
//                     <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4 mt-4">
//                       <div className="flex items-center gap-2">
//                         <span className="text-blue-800 font-bold text-lg">On Road Price</span>
//                         <span className="text-xs text-blue-600">(Including all taxes)</span>
//                       </div>
//                       <span className="text-blue-800 font-bold text-xl">${totalOnRoadPrice.toLocaleString()}</span>
//                     </div>
//                   )}

//                   <div className="flex justify-between items-center pt-3">
//                     <span className="text-gray-700 font-medium">Total Quantity</span>
//                     <span className="text-gray-800 font-semibold">{totalQuantity} units</span>
//                   </div>

//                   {totalQuantity > 1 && totalOnRoadPrice > 0 && (
//                     <div className="text-center pt-2">
//                       <span className="text-sm text-gray-500">
//                         (${(totalOnRoadPrice / totalQuantity).toLocaleString()} per unit)
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="border-t px-4 sm:px-6 py-3 bg-gray-50">
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowVehiclesOverlay(false)}
//                 className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   console.log("Proceed with purchase");
//                 }}
//                 className="bg-[#0f66af] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
//               >
//                 Proceed
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Selected vehicles preview
//   const renderSelectedVehiclesPreview = () => {
//     const allPreviewVehicles = [...allVehiclesForCurrentLead, ...currentVehicles];
//     if (allPreviewVehicles.length === 0) return null;

//     return (
//       <div className="mb-6">
//         <div className="block sm:hidden space-y-2">
//           {allPreviewVehicles.slice(0, 2).map((vehicle, index) => renderCompactVehicleCard(vehicle, index))}
//           {allPreviewVehicles.length > 2 && (
//             <div
//               className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
//               onClick={() => setShowVehiclesOverlay(true)}
//             >
//               <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//               </svg>
//               <p className="text-gray-600 text-xs text-center">+{allPreviewVehicles.length - 2} more vehicles</p>
//               <p className="text-gray-500 text-xs mt-0.5">Tap to view all</p>
//             </div>
//           )}
//         </div>

//         <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//           {allPreviewVehicles.slice(0, 2).map((vehicle, index) => renderVehicleCard(vehicle, index))}
//           {allPreviewVehicles.length > 2 && (
//             <div
//               className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
//               onClick={() => setShowVehiclesOverlay(true)}
//             >
//               <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//               </svg>
//               <p className="text-gray-600 text-sm text-center">+{allPreviewVehicles.length - 2} more vehicles</p>
//               <p className="text-gray-500 text-xs mt-1">Click to view all</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Vehicle popup
//   const renderVehiclePopup = (vehicle, index) => {
//     if (!vehicle || !vehicle.variant) return null;

//     const color = vehicle.color;
//     const mainPhoto = getVehicleImage(vehicle.variant, color);
//     const vehicleVariant = vehicle.variant;
//     const basicPrice = getVehiclePrice(vehicleVariant, color);
//     const exShowroomPrice = vehicleVariant?.ex_showroom_price || 0;
//     const onRoadPrice = vehicleVariant?.on_road_price || 0;
//     const vehicleQuantity = vehicle.quantity || 1;

//     const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;
//     const totalExShowroomPrice = parseFloat(exShowroomPrice) * vehicleQuantity;
//     const totalOnRoadPrice = parseFloat(onRoadPrice) * vehicleQuantity;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
//           <div className="bg-[#0f66af] text-white px-4 sm:px-6 py-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg sm:text-xl font-semibold">
//                 Vehicle {index + 1} - Price Details
//               </h3>
//               <button
//                 onClick={() => setShowVehiclePopup(false)}
//                 className="text-white hover:text-gray-200 transition-colors p-1"
//               >
//                 <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>

//           <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//             <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
//               {mainPhoto && (
//                 <div className="flex-shrink-0">
//                   <img
//                     src={`${API_BASE.replace("/api", "")}/uploads/coverPhotos/${mainPhoto}`}
//                     alt={vehicleVariant.name}
//                     className="w-20 h-20 object-cover rounded-md border"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
//                     }}
//                   />
//                 </div>
//               )}
//               <div className="flex-1">
//                 <h4 className="font-semibold text-gray-800 text-lg mb-2">{vehicleVariant.name}</h4>
//                 <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
//                   <p><span className="font-medium">Brand:</span> {brands.find((b) => b.id === vehicleVariant.brand_id)?.name || "N/A"}</p>
//                   <p><span className="font-medium">CC:</span> {ccs.find((c) => c.id === vehicleVariant.cc_id)?.name || "N/A"}</p>
//                   <p><span className="font-medium">Fuel:</span> {fuelTypes.find((f) => f.id === vehicleVariant.fuel_type_id)?.name || "N/A"}</p>
//                   {color && (
//                     <p className="flex items-center gap-2">
//                       <span className="font-medium">Color:</span>
//                       <span className="w-4 h-4 rounded-full border border-gray-400 shadow" style={{ backgroundColor: color.color_code }} title={color.name}></span>
//                       <span className="text-xs">{color.name}</span>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
//               <span className="font-medium text-gray-700">Quantity:</span>
//               <span className="px-3 py-1 min-w-8 text-center font-semibold text-blue-600 bg-white border border-blue-200 rounded">
//                 {vehicleQuantity}
//               </span>
//             </div>

//             <div className="bg-white rounded-lg border p-4">
//               <h4 className="font-bold text-gray-800 mb-4 text-lg">Price Breakdown</h4>
//               <div className="space-y-3">
//                 {basicPrice > 0 && (
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-700 font-medium">{color ? `${color.name} Price` : "Basic Price"}</span>
//                       <span className="text-xs text-gray-500">(Per unit)</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-green-600 font-semibold">${parseFloat(basicPrice).toLocaleString()}</p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-green-500 text-sm">Total: ${totalBasicPrice.toLocaleString()}</p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {exShowroomPrice > 0 && (
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-700 font-medium">Ex-Showroom Price</span>
//                       <span className="text-xs text-gray-500">(Per unit)</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-blue-600 font-semibold">${parseFloat(exShowroomPrice).toLocaleString()}</p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-blue-500 text-sm">Total: ${totalExShowroomPrice.toLocaleString()}</p>
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {onRoadPrice > 0 && (
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-700 font-medium">On Road Price</span>
//                       <span className="text-xs text-gray-500">(Per unit)</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-purple-600 font-semibold">${parseFloat(onRoadPrice).toLocaleString()}</p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-purple-500 text-sm">Total: ${totalOnRoadPrice.toLocaleString()}</p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Quantity summary
//   const renderQuantitySummary = () => {
//     const savedCount = allVehiclesForCurrentLead.length;
//     const currentTotal = currentVehicles.reduce((total, v) => total + v.quantity, 0);
//     const grandTotal = calculateTotalQuantity;

//     return (
//       <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h4 className="font-semibold text-gray-800 mb-1">Vehicle Quantity Summary</h4>
//             <div className="text-sm text-gray-600">
//               <p>• Saved Vehicles: <span className="font-medium">{savedCount}</span></p>
//               <p>• Current Selection: <span className="font-medium">{currentTotal}</span></p>
//             </div>
//           </div>

//           <div className="text-right">
//             <div className="text-2xl font-bold text-blue-700">
//               {grandTotal} <span className="text-sm font-normal">Total Units</span>
//             </div>
//             <div className="text-sm text-gray-500 mt-1">All vehicles active</div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Form handling
//   const validateForm = () => {
//     const phoneStr = String(formData.phoneNumber || "").trim();
//     if (!formData.customerName?.trim()) return "Customer name is required.";
//     if (!/^\d{10}$/.test(phoneStr)) return "Valid 10-digit phone number required.";
//     if (!formData.customerLocation?.trim()) return "Location is required.";

//     const totalQty = calculateTotalQuantity;
//     if (totalQty < 1) return "Total quantity must be at least 1.";

//     if (!variant) return "Please select a vehicle variant.";

//     if (!assignedDealerId) return "No dealer assigned for the selected area. Please contact administrator.";

//     return null;
//   };

//   const handleSubmit = async (action = "submit") => {
//     const validationError = validateForm();
//     if (validationError) {
//       setErrorMessage(validationError);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }

//     if (currentVehicles.length === 0) {
//       setErrorMessage("No vehicles selected.");
//       return;
//     }

//     setIsSubmitting(true);
//     setErrorMessage(null);

//     try {
//       const selectedArea = dealerAssignedAreas.find((area) => area.name === formData.customerArea?.trim());
//       if (!selectedArea || !selectedCityId) {
//         throw new Error("Please select valid area and city.");
//       }

//       const finalLocation = formData.customerArea
//         ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}` : formData.customerLocation.trim();

//       const currentUserId = getCurrentDealerId();
//       const unitPrice = totalPrice / (totalQuantity || 1);
//       const firstVehicle = currentVehicles[0];

//       const payload = {
//         customer_name: formData.customerName.trim(),
//         phone_no: (formData.phoneNumber || "").toString().trim(),
//         location: finalLocation,
//         area: formData.customerArea?.trim() || null,
//         city_id: selectedCityId,
//         area_id: selectedArea.id,
//         executive_id: currentUserId,
//         tentative_purchase_date: formData.purchaseDate || null,
//         unit_price: unitPrice,
//         total_price: totalPrice || (unitPrice * totalQuantity),
//         vehicle_qty: totalQuantity,
//         current_vehicle_qty: totalQuantity,
//         payment_mode: formData.paymentMode,
//         additional_note: formData.notes?.trim() || null,
//         brand_id: parseInt(variant.brand_id, 10),
//         variant_id: parseInt(variant.id, 10),
//         lead_id: leadId || null,
//         status: action === "save_draft" ? "Draft" : "Open",
//         color_id: firstVehicle.color?.id || null,
//         color_name: firstVehicle.color?.name || null,
//         color_code: firstVehicle.color?.color_code || null,
//         dealer_id: assignedDealerId,
//         distributor_id: assignedDistributorId,
//       };

//       const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//         headers: getAuthHeaders(),
//       });

//       if (data?.success) {
//         const newLeadId = data.lead_id || data.lead?.id;
//         setLeadId(newLeadId);

//         const updatedVehicles = [...allVehiclesForCurrentLead, ...currentVehicles.map(v => ({
//           ...v,
//           lead_id: newLeadId,
//           id: `${newLeadId}-${v.color?.id || 'default'}`,
//           dealer_id: assignedDealerId,
//           distributor_id: assignedDistributorId,
//         }))];
//         setAllVehiclesForCurrentLead(updatedVehicles);
//         localStorage.setItem("allVehiclesForCurrentLead", JSON.stringify(updatedVehicles));

//         // Add additional vehicles if multiple colors
//         for (let i = 1; i < currentVehicles.length; i++) {
//           const v = currentVehicles[i];
//           const vehiclePayload = {
//             brand_id: parseInt(variant.brand_id, 10),
//             variant_id: parseInt(variant.id, 10),
//             color_id: v.color?.id || null,
//             color_name: v.color?.name || null,
//             color_code: v.color?.color_code || null,
//             area_id: selectedArea.id,
//             city_id: selectedCityId,
//           };
//           await axios.post(`${API_BASE}/leads/${newLeadId}/vehicles`, vehiclePayload, { headers: getAuthHeaders() });
//         }

//         const successMessage = assignedDealerId
//           ? `Lead #${newLeadId} created successfully! Dealer: ${assignedDealerName}`
//           : `Lead #${newLeadId} created successfully!`;

//         toast.success(successMessage, {
//           duration: 4000,
//           icon: "✅",
//           style: {
//             borderRadius: "10px",
//             background: "#10b981",
//             color: "#fff",
//           },
//         });

//         if (action === "submit") {
//           clearLocalStorageForSubmit();
//           navigate("/leads/open", {
//             state: {
//               recentLead: data.lead,
//               allLeads: updatedVehicles,
//               submittedVariant: variant,
//               submittedLeadId: newLeadId,
//               submittedColor: firstVehicle.color,
//               assignedDealer: assignedDealerId,
//               assignedDistributor: assignedDistributorId,
//             },
//           });
//         }
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || err.message || "Submission failed.";
//       setErrorMessage(msg);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       toast.error(msg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const clearLocalStorageForSubmit = () => {
//     const keys = ["leadId", "draftLead", "recentSubmittedLead", "existingCustomerData", "allVehiclesForCurrentLead"];
//     keys.forEach((key) => localStorage.removeItem(key));
//     setStoredLeads([]);
//     setAllVehiclesForCurrentLead([]);
//   };

//   const handleSaveDraft = async () => {
//     const validationError = validateForm();
//     if (validationError) {
//       setErrorMessage(validationError);
//       return;
//     }

//     if (currentVehicles.length === 0) {
//       setErrorMessage("No vehicles selected.");
//       return;
//     }

//     const selectedArea = dealerAssignedAreas.find((area) => area.name === formData.customerArea);
//     if (!selectedArea || !selectedCityId) {
//       setErrorMessage("Please select valid area and city.");
//       return;
//     }

//     const finalLocation = formData.customerArea
//       ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}` : formData.customerLocation.trim();

//     const currentUserId = getCurrentDealerId();
//     const unitPrice = totalPrice / (totalQuantity || 1);
//     const firstVehicle = currentVehicles[0];

//     const payload = {
//       customer_name: formData.customerName.trim(),
//       phone_no: formData.phoneNumber.trim(),
//       location: finalLocation || null,
//       area: formData.customerArea?.trim() || null,
//       city_id: selectedCityId,
//       area_id: selectedArea.id,
//       executive_id: currentUserId,
//       tentative_purchase_date: formData.purchaseDate || null,
//       vehicle_qty: totalQuantity,
//       current_vehicle_qty: totalQuantity,
//       payment_mode: formData.paymentMode,
//       additional_note: formData.notes?.trim() || null,
//       brand_id: parseInt(variant.brand_id, 10),
//       variant_id: parseInt(variant.id, 10),
//       lead_id: leadId || null,
//       status: "Draft",
//       color_id: firstVehicle.color?.id || null,
//       color_name: firstVehicle.color?.name || null,
//       color_code: firstVehicle.color?.color_code || null,
//     };

//     try {
//       const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//         headers: getAuthHeaders(),
//       });
//       if (data?.lead?.id) {
//         const newLeadId = data.lead.id;
//         setLeadId(newLeadId);
//         const updatedVehicles = [
//           ...allVehiclesForCurrentLead.map((v) => ({ ...v, status: "Draft" })),
//           ...currentVehicles.map(v => ({
//             ...v,
//             lead_id: newLeadId,
//             status: "Draft",
//           })),
//         ];
//         setAllVehiclesForCurrentLead(updatedVehicles);
//         localStorage.setItem("allVehiclesForCurrentLead", JSON.stringify(updatedVehicles));
//         localStorage.removeItem("existingCustomerData");
//         localStorage.removeItem("leadId");
//         toast.success("Draft saved successfully!");
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Draft failed.";
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//     }
//   };

//   const addNewVehicle = async () => {
//     // Implementation for adding another variant remains similar, but omitted for brevity as per prompt focus
//     navigate("/leads/generate");
//   };

//   // Location handling
//   const fetchLocations = async (searchText) => {
//     if (!searchText || searchText.trim().length < 2) {
//       setLocations([]);
//       setShowLocationDropdown(false);
//       return;
//     }

//     try {
//       setLoadingLocations(true);
//       const response = await axios.get(`${API_BASE}/locations/search`, {
//         headers: getAuthHeaders(),
//         params: { search: searchText.trim() },
//       });

//       if (response.data.success) {
//         setLocations(response.data.data);
//         setShowLocationDropdown(response.data.data.length > 0);
//       } else {
//         setLocations([]);
//         setShowLocationDropdown(false);
//       }
//     } catch (err) {
//       console.error("Error fetching locations:", err);
//       setLocations([]);
//       setShowLocationDropdown(false);
//     } finally {
//       setLoadingLocations(false);
//     }
//   };

//   const fetchAreasForCity = async (cityId, cityName) => {
//     if (!cityId) {
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//       return;
//     }

//     try {
//       setLoadingDealerAreas(true);
//       const dealerId = getCurrentDealerId();
//       const response = await axios.get(
//         `${API_BASE}/areas/dealer-areas/${cityId}`,
//         {
//           headers: getAuthHeaders(),
//           params: { dealer_id: dealerId },
//         }
//       );

//       if (response.data.success) {
//         setDealerAssignedAreas(response.data.data);
//         setShowAreaDropdown(response.data.data.length > 0);
//         if (response.data.is_dealer_assigned) {
//           toast.success(`Showing your assigned areas for ${response.data.city_name}`);
//         }
//       } else {
//         setDealerAssignedAreas([]);
//         setShowAreaDropdown(false);
//       }
//     } catch (err) {
//       console.error("Error fetching areas:", err);
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//     } finally {
//       setLoadingDealerAreas(false);
//     }
//   };

//   const handleLocationSearchChange = (e) => {
//     const value = e.target.value;
//     setLocationSearchText(value);
//     if (value.trim().length >= 2) {
//       setShowLocationDropdown(true);
//       fetchLocations(value);
//     } else {
//       setShowLocationDropdown(false);
//       setLocations([]);
//     }
//   };

//   const handleLocationSelect = (location) => {
//     setFormData((prev) => ({
//       ...prev,
//       customerLocation: location.city_name || location.name,
//       customerArea: "",
//     }));
//     setLocationSearchText(location.city_name || location.name);
//     setSelectedCityId(location.id);
//     setShowLocationDropdown(false);
//     setLocations([]);
//     setAssignedDealerId(null);
//     setAssignedDistributorId(null);
//     setAssignedDealerName("");
//     setAssignedDistributorName("");
//     fetchAreasForCity(location.id, location.city_name || location.name);
//   };

//   const handleAreaSelect = (area) => {
//     setFormData((prev) => ({ ...prev, customerArea: area.name }));
//     setSelectedAreaId(area.id);
//     setShowAreaDropdown(false);
//     if (area.id && selectedCityId) {
//       fetchDealerDistributorMapping(area.id, selectedCityId);
//     }
//   };

//   const handleChange = (e) => {
//     const { id, name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id || name]: value }));
//     setErrorMessage(null);
//   };

//   const handleCheckboxChange = (e) => {
//     setUseSameCustomerDetails(e.target.checked);
//   };

//   // Use effects
//   useEffect(() => {
//     localStorage.removeItem("leadId");
//     localStorage.removeItem("draftLead");
//     setLeadId(null);
//     setLeadDetails(null);
//     setSelectedCityId(null);

//     const stored = localStorage.getItem("recentSubmittedLead");
//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored);
//         if (Array.isArray(parsed)) setStoredLeads(parsed);
//       } catch (err) {}
//     }

//     const draft = localStorage.getItem("draftLead");
//     if (draft) {
//       try {
//         setFormData((prev) => ({ ...prev, ...JSON.parse(draft) }));
//       } catch (err) {}
//     }

//     const vehiclesStored = localStorage.getItem("allVehiclesForCurrentLead");
//     if (vehiclesStored) {
//       try {
//         setAllVehiclesForCurrentLead(JSON.parse(vehiclesStored));
//       } catch (err) {}
//     }
//   }, []);

//   useEffect(() => {
//     setFormData((prev) => ({ ...prev, quantity: totalQuantity || quantity || 1 }));
//   }, [totalQuantity, quantity]);

//   useEffect(() => {
//     const loadLead = async () => {
//       if (!leadId) return;
//       try {
//         const res = await axios.get(`${API_BASE}/leads/${leadId}`, {
//           headers: getAuthHeaders(),
//         });
//         const data = res.data.data || res.data;
//         setLeadDetails(data);
//       } catch (err) {
//         localStorage.removeItem("leadId");
//         setLeadId(null);
//         setLeadDetails(null);
//       }
//     };

//     loadLead();
//   }, [leadId]);

//   useEffect(() => {
//     if (leadDetails && !localStorage.getItem("draftLead")) {
//       setFormData({
//         customerName: leadDetails.customer_name || "",
//         phoneNumber: leadDetails.phone_no || "",
//         customerLocation: leadDetails.location || "",
//         customerArea: leadDetails.area || "",
//         purchaseDate: leadDetails.tentative_purchase_date || "",
//         quantity: leadDetails.vehicle_qty || 1,
//         paymentMode: leadDetails.payment_mode || "cash",
//         notes: leadDetails.additional_note || "",
//       });
//     }
//   }, [leadDetails]);

//   useEffect(() => {
//     if (useSameCustomerDetails && storedLeads.length > 0) {
//       const latestLead = storedLeads[storedLeads.length - 1];
//       setFormData((prev) => ({
//         ...prev,
//         customerName: latestLead.customer_name || "",
//         phoneNumber: latestLead.phone_no || "",
//         customerLocation: latestLead.location || "",
//         customerArea: latestLead.area || "",
//         purchaseDate: latestLead.tentative_purchase_date || "",
//         quantity: latestLead.vehicle_qty || 1,
//         paymentMode: latestLead.payment_mode || "cash",
//         notes: latestLead.additional_note || "",
//       }));
//     }
//   }, [useSameCustomerDetails, storedLeads]);

//   useEffect(() => {
//     if (formData.customerLocation) {
//       // fetchDealerAreas implementation similar to original, omitted for brevity
//     } else {
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//     }
//   }, [formData.customerLocation]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (locationSearchText && locationSearchText.trim().length >= 2) {
//         fetchLocations(locationSearchText);
//       } else {
//         setLocations([]);
//         setShowLocationDropdown(false);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [locationSearchText]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".location-search-container")) setShowLocationDropdown(false);
//       if (!event.target.closest(".area-select-container")) setShowAreaDropdown(false);
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="m-4">
//       <Stepper step={3} />

//       {showVehiclesOverlay && renderVehiclesOverlay()}

//       {showVehiclePopup && selectedVehicleForPopup && renderVehiclePopup(selectedVehicleForPopup.vehicle, selectedVehicleForPopup.index)}

//       {errorMessage && (
//         <p className="text-red-600 font-semibold mb-4 text-sm sm:text-base">{errorMessage}</p>
//       )}

//       <div className="page-header flex justify-between items-center">
//         <h3 className="text-base sm:text-lg font-semibold">New Lead Information</h3>
//       </div>

//       {renderQuantitySummary()}

//       <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//         <div className="mb-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-200 transition-colors flex items-center"
//           >
//             ← Back
//           </button>
//         </div>

//         {renderSelectedVehiclesPreview()}

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
//           <div className="space-y-3 sm:space-y-4">
//             <div>
//               <label htmlFor="customerName" className="block font-medium mb-1 text-sm sm:text-base">
//                 Customer Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="customerName"
//                 value={formData.customerName}
//                 onChange={handleChange}
//                 placeholder="Enter customer name"
//                 className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="phoneNumber" className="block font-medium mb-1 text-sm sm:text-base">
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 id="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 placeholder="10-digit phone number"
//                 className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//                 required
//                 pattern="\d{10}"
//               />
//             </div>

//             <div className="relative location-search-container">
//               <label htmlFor="locationSearch" className="block font-medium mb-1 text-sm sm:text-base">
//                 Location (City) <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   id="locationSearch"
//                   value={locationSearchText}
//                   onChange={handleLocationSearchChange}
//                   onFocus={() => locationSearchText.length >= 2 && setShowLocationDropdown(true)}
//                   placeholder="Type city name (e.g., Pune, Mumbai)"
//                   className="w-full border border-gray-300 p-2.5 rounded-lg pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                   autoComplete="off"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   {loadingLocations ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                   ) : (
//                     <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   )}
//                 </div>
//               </div>

//               {showLocationDropdown && (
//                 <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                   {locations.length > 0 ? (
//                     locations.map((location) => (
//                       <div
//                         key={location.id}
//                         className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
//                         onClick={() => handleLocationSelect(location)}
//                       >
//                         <div className="font-medium text-gray-800 text-sm">{location.city_name || location.name}</div>
//                         {location.state_name && <div className="text-xs text-gray-500 mt-1">{location.state_name}</div>}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="px-4 py-3 text-gray-500 text-center text-sm">
//                       {locationSearchText.length >= 2 ? "No locations found. Try different keywords." : "Type at least 2 characters to search"}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="relative area-select-container">
//                 <label htmlFor="customerArea" className="block font-medium mb-1 text-sm sm:text-base">
//                   Area <span className="text-red-500">*</span>
//                   <span className="text-gray-500 text-xs ml-2">{getCurrentDealerId() ? "(Dealer Assigned)" : "(All Areas)"}</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="customerArea"
//                     value={formData.customerArea}
//                     onChange={handleChange}
//                     onClick={() => formData.customerLocation && setShowAreaDropdown(!showAreaDropdown)}
//                     placeholder={formData.customerLocation ? "Select area" : "Select a city first"}
//                     className={`w-full border border-gray-300 p-2.5 rounded-lg pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       !formData.customerLocation ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
//                     }`}
//                     readOnly
//                     disabled={!formData.customerLocation}
//                   />
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     {loadingDealerAreas ? (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                     ) : (
//                       <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                       </svg>
//                     )}
//                   </div>
//                 </div>

//                 {showAreaDropdown && (
//                   <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     {dealerAssignedAreas.length > 0 ? (
//                       <>
//                         <div className="px-3 py-2 text-xs bg-blue-50 border-b">
//                           <div className="font-medium text-blue-700">
//                             {getCurrentDealerId() ? "Your Assigned Areas" : "All Areas"} for {formData.customerLocation}
//                           </div>
//                         </div>
//                         {dealerAssignedAreas.map((area) => (
//                           <div
//                             key={area.id}
//                             className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
//                             onClick={() => handleAreaSelect(area)}
//                           >
//                             <div className="font-medium text-gray-800 text-sm">{area.name}</div>
//                             {area.city_name && (
//                               <div className="text-xs text-gray-500 mt-1">
//                                 {area.city_name}
//                                 {area.state_name && `, ${area.state_name}`}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </>
//                     ) : (
//                       <div className="px-4 py-3 text-gray-500 text-center text-sm">
//                         {formData.customerLocation ? "No areas found for this location" : "Select a location first"}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block font-medium mb-1 text-sm sm:text-base">Assigned Dealer</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={assignedDealerName || "No dealer assigned"}
//                     readOnly
//                     className={`w-full border p-2.5 rounded-lg text-sm sm:text-base ${
//                       assignedDealerId ? "bg-green-50 border-green-300 text-green-700" : "bg-gray-100 border-gray-300 text-gray-500"
//                     }`}
//                     placeholder="Dealer will be auto-assigned based on area"
//                   />
//                   {loadingDealerMapping && (
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                     </div>
//                   )}
//                   {assignedDealerId && !loadingDealerMapping && (
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                       <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//                 {assignedDistributorId && (
//                   <div className="mt-1 text-xs text-gray-600">Distributor: {assignedDistributorName}</div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="space-y-3 sm:space-y-4">
//             <div>
//               <label htmlFor="purchaseDate" className="block font-medium mb-1 text-sm sm:text-base">
//                 Tentative Purchase Date<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 id="purchaseDate"
//                 name="purchaseDate"
//                 value={formData.purchaseDate}
//                 onChange={handleChange}
//                 className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//                 min={new Date().toISOString().split("T")[0]}
//               />
//             </div>

//             <div>
//               <label className="block font-medium mb-1 text-sm sm:text-base">Payment Mode <span className="text-red-500">*</span></label>
//               <div className="flex gap-3 sm:gap-4">
//                 <label className="flex items-center text-sm sm:text-base">
//                   <input type="radio" name="paymentMode" value="cash" checked={formData.paymentMode === "cash"} onChange={handleChange} className="mr-2" required /> Cash
//                 </label>
//                 <label className="flex items-center text-sm sm:text-base">
//                   <input type="radio" name="paymentMode" value="finance" checked={formData.paymentMode === "finance"} onChange={handleChange} className="mr-2" /> Finance
//                 </label>
//               </div>
//             </div>

//             <div>
//               <label className="block font-medium mb-1 text-sm sm:text-base">Selected Quantity</label>
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
//                 <div>
//                   <span className="text-lg font-bold text-gray-800">{formData.quantity} units</span>
//                   <div className="text-sm text-gray-600 mt-1">All units are active</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-xs text-gray-500 mb-1">Total across all vehicles:</div>
//                   <div className="text-xl font-bold text-blue-600">{getTotalDisplayQuantity()} units</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mb-6">
//           <label htmlFor="notes" className="block font-medium mb-1 text-sm sm:text-base">Additional Notes</label>
//           <textarea
//             id="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             placeholder="Enter any additional notes..."
//             rows="3"
//             className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//           />
//         </div>

//         {storedLeads.length > 0 && (
//           <div className="mb-6">
//             <label className="flex items-center text-sm sm:text-base">
//               <input type="checkbox" checked={useSameCustomerDetails} onChange={handleCheckboxChange} className="mr-2" /> Auto-Fill
//             </label>
//           </div>
//         )}

//         <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
//           <button
//             onClick={handleSaveDraft}
//             className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors order-2 sm:order-1"
//           >
//             Save as Draft
//           </button>
//           <button
//             onClick={addNewVehicle}
//             className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors order-3 sm:order-2"
//           >
//             Add Another Vehicle
//           </button>
//           <button
//             onClick={() => handleSubmit("submit")}
//             disabled={isSubmitting}
//             className={`relative bg-primary-blue text-white rounded-lg px-6 py-3 font-medium flex items-center justify-center transition-all ${
//               isSubmitting ? "opacity-80 cursor-not-allowed" : "hover:bg-hover-blue"
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Submitting...
//               </>
//             ) : (
//               "Submit Lead"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadInformation;

// import React, { useState, useEffect, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Stepper from "../../components/Stepper";
// import axios from "axios";
// import toast from "react-hot-toast";

// const LeadInformation = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const {
//     variant,
//     colors = [],
//     colorSelections = {},
//     totalQuantity,
//     totalPrice,
//     galleries,
//     brands = [],
//     fuelTypes = [],
//     ccs = [],
//     quantity,
//   } = location.state || {};

//   const [formData, setFormData] = useState({
//     customerName: "",
//     phoneNumber: "",
//     customerLocation: "",
//     customerArea: "",
//     purchaseDate: "",
//     quantity: totalQuantity || quantity || 1,
//     paymentMode: "cash",
//     notes: "",
//   });
//   const [leadId, setLeadId] = useState(localStorage.getItem("leadId") || null);
//   const [leadDetails, setLeadDetails] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [areas, setAreas] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [storedLeads, setStoredLeads] = useState([]);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [useSameCustomerDetails, setUseSameCustomerDetails] = useState(false);
//   const [loadingAreas, setLoadingAreas] = useState(false);
//   const [loadingLocations, setLoadingLocations] = useState(false);
//   const [showAreaDropdown, setShowAreaDropdown] = useState(false);
//   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
//   const [locationSearchText, setLocationSearchText] = useState("");
//   const [selectedAreaId, setSelectedAreaId] = useState(null);
//   const [selectedVehicleForPopup, setSelectedVehicleForPopup] = useState(null);
//   const [showVehiclePopup, setShowVehiclePopup] = useState(false);
//   const [showVehiclesOverlay, setShowVehiclesOverlay] = useState(false);
//   // Dealer mapping states
//   const [dealerAssignedAreas, setDealerAssignedAreas] = useState([]);
//   const [loadingDealerAreas, setLoadingDealerAreas] = useState(false);
//   const [assignedDealerId, setAssignedDealerId] = useState(null);
//   const [assignedDistributorId, setAssignedDistributorId] = useState(null);
//   const [assignedDealerName, setAssignedDealerName] = useState("");
//   const [assignedDistributorName, setAssignedDistributorName] = useState("");
//   const [loadingDealerMapping, setLoadingDealerMapping] = useState(false);
//   // Vehicle management state
//   const [allVehiclesForCurrentLead, setAllVehiclesForCurrentLead] = useState([]);
//   const [selectedCityId, setSelectedCityId] = useState(null);
//   const [isContinuation, setIsContinuation] = useState(false);
//   // Current vehicles from color selections
//   const currentVehicles = useMemo(() => {
//     return Object.entries(colorSelections).filter(([_, q]) => q > 0).map(([idStr, q]) => {
//       const colorId = parseInt(idStr);
//       const color = colors.find(c => c.id === colorId);
//       return {
//         variant,
//         color,
//         quantity: q,
//         price: color?.price || 0,
//       };
//     });
//   }, [colorSelections, colors, variant]);

//   const API_BASE = "http://localhost:8000/api";
//   const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   // Calculate total quantity
//   const calculateTotalQuantity = useMemo(() => {
//     const savedQuantity = allVehiclesForCurrentLead.reduce((total, v) => total + (v.quantity || 1), 0);
//     const currentTotal = currentVehicles.reduce((total, v) => total + v.quantity, 0);
//     return savedQuantity + currentTotal;
//   }, [allVehiclesForCurrentLead, currentVehicles]);

//   const getTotalDisplayQuantity = () => calculateTotalQuantity;

//   // Dealer mapping functions
//   const getCurrentDealerId = () => {
//     const possibleUserDataKeys = [
//       "userData",
//       "user",
//       "currentUser",
//       "authUser",
//       "userInfo",
//     ];
//     for (const key of possibleUserDataKeys) {
//       const storedData = localStorage.getItem(key);
//       if (storedData) {
//         try {
//           const user = JSON.parse(storedData);
//           if (user.id) return user.id;
//           if (user.user_id) return user.user_id;
//           if (user.dealer_id) return user.dealer_id;
//           if (user.userId) return user.userId;
//         } catch (err) {}
//       }
//     }
//     const authToken = localStorage.getItem("authToken");
//     if (authToken) {
//       try {
//         const payload = JSON.parse(atob(authToken.split(".")[1]));
//         if (payload.user_id) return payload.user_id;
//         if (payload.id) return payload.id;
//         if (payload.sub) return payload.sub;
//       } catch (err) {}
//     }
//     for (const key of possibleUserDataKeys) {
//       const storedData = sessionStorage.getItem(key);
//       if (storedData) {
//         try {
//           const user = JSON.parse(storedData);
//           if (user.id) return user.id;
//           if (user.user_id) return user.user_id;
//         } catch (err) {}
//       }
//     }
//     return null;
//   };

//   const fetchDealerDistributorMapping = async (areaId, cityId) => {
//     if (!areaId || !cityId) {
//       setAssignedDealerId(null);
//       setAssignedDistributorId(null);
//       setAssignedDealerName("");
//       setAssignedDistributorName("");
//       return;
//     }
//     try {
//       setLoadingDealerMapping(true);
//       const response = await axios.get(
//         `${API_BASE}/dealer/distributor-mapping`,
//         {
//           headers: getAuthHeaders(),
//           params: {
//             area_id: areaId,
//             city_id: cityId,
//           },
//         }
//       );
//       if (response.data.success) {
//         setAssignedDealerId(response.data.dealer_id);
//         setAssignedDistributorId(response.data.distributor_id);
//         setAssignedDealerName(response.data.dealer_name);
//         setAssignedDistributorName(response.data.distributor_name);
//         toast.success(`Dealer assigned: ${response.data.dealer_name}`);
//       } else {
//         setAssignedDealerId(null);
//         setAssignedDistributorId(null);
//         setAssignedDealerName("");
//         setAssignedDistributorName("");
//         console.warn("No dealer mapping found for this area");
//       }
//     } catch (error) {
//       console.error("Error fetching dealer mapping:", error);
//       setAssignedDealerId(null);
//       setAssignedDistributorId(null);
//       setAssignedDealerName("");
//       setAssignedDistributorName("");
//     } finally {
//       setLoadingDealerMapping(false);
//     }
//   };

//   // Vehicle display functions
//   const getVehicleImage = (vehicleVariant, color = null) => {
//     if (!vehicleVariant) return null;
//     let gallery;
//     if (color && color.id) {
//       gallery = galleries.find(
//         (g) => g.variant_id === vehicleVariant.id && g.color_id === color.id
//       );
//     }
//     if (!gallery) {
//       gallery = galleries.find((g) => g.variant_id === vehicleVariant.id);
//     }
//     let photos = [];
//     if (gallery) {
//       try {
//         const photoField = gallery.vehicle_photos || gallery.cover_photos;
//         photos =
//           typeof photoField === "string" ? JSON.parse(photoField) : photoField;
//         if (!Array.isArray(photos)) photos = [photoField].filter(Boolean);
//       } catch (e) {
//         photos = [];
//       }
//     }
//     return photos[0] || null;
//   };

//   const getVehiclePrice = (vehicleVariant, vehicleColor = null) => {
//     if (!vehicleVariant) return 0;
//     if (vehicleColor && vehicleColor.price) {
//       return parseFloat(vehicleColor.price);
//     }
//     const price =
//       vehicleVariant.basic_price ||
//       vehicleVariant.price ||
//       vehicleVariant.ex_showroom_price ||
//       vehicleVariant.on_road_price ||
//       0;
//     return parseFloat(price) || 0;
//   };

//   // Vehicle card rendering
//   const renderVehicleCard = (vehicle, index) => {
//     if (!vehicle || !vehicle.variant) return null;
//     const color = vehicle.color;
//     const mainPhoto = getVehicleImage(vehicle.variant, color);
//     const vehicleVariant = vehicle.variant;
//     const basicPrice = getVehiclePrice(vehicleVariant, color);
//     const exShowroomPrice = vehicleVariant?.ex_showroom_price || 0;
//     const onRoadPrice = vehicleVariant?.on_road_price || 0;
//     const vehicleQuantity = vehicle.quantity || 1;
//     const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;
//     const totalExShowroomPrice = parseFloat(exShowroomPrice) * vehicleQuantity;
//     const totalOnRoadPrice = parseFloat(onRoadPrice) * vehicleQuantity;
//     return (
//       <div
//         key={index}
//         className="bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-all cursor-pointer border-gray-200"
//         onClick={() => {
//           setSelectedVehicleForPopup({ vehicle, index });
//           setShowVehiclePopup(true);
//         }}
//       >
//         <div className="flex items-start justify-between">
//           <div className="flex-1 min-w-0">
//             <div className="flex justify-between items-start mb-2">
//               <h4 className="font-semibold text-gray-800 text-sm truncate">
//                 Vehicle {index + 1}
//               </h4>
//             </div>
//             {/* Vehicle Details */}
//             <div className="space-y-1 text-xs">
//               <p className="text-gray-600 truncate">
//                 <span className="font-medium">Variant:</span> {vehicleVariant.name}
//               </p>
//               {/* Color Display */}
//               {color && (
//                 <p className="text-gray-600 truncate flex items-center gap-2">
//                   <span className="font-medium">Color:</span>
//                   <span
//                     className="w-5 h-5 rounded-full border border-gray-400 shadow"
//                     style={{ backgroundColor: color.color_code }}
//                     title={color.name}
//                   ></span>
//                   <span className="text-xs">{color.name}</span>
//                 </p>
//               )}
//               {/* Quantity Display */}
//               <div className="flex items-center justify-between">
//                 <span className="font-medium text-gray-600">Quantity:</span>
//                 <div className="flex items-center">
//                   <span className="px-2 py-1 min-w-8 text-center font-medium bg-gray-100 rounded">
//                     {vehicleQuantity}
//                   </span>
//                 </div>
//               </div>
//               {/* Price Display */}
//               <div className="space-y-1 mt-2">
//                 {basicPrice > 0 && (
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600 font-medium">Price:</span>
//                     <div className="text-right">
//                       <p className="text-green-600 font-semibold text-sm">
//                         ${parseFloat(basicPrice).toLocaleString()}
//                       </p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-green-500 text-xs">
//                           Total: ${totalBasicPrice.toLocaleString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//           {mainPhoto && (
//             <div className="ml-3 flex-shrink-0">
//               <img
//                 src={`${API_BASE.replace("/api", "")}/uploads/coverPhotos/${mainPhoto}`}
//                 alt={vehicleVariant.name}
//                 className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border"
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderCompactVehicleCard = (vehicle, index) => {
//     if (!vehicle || !vehicle.variant) return null;
//     const color = vehicle.color;
//     const mainPhoto = getVehicleImage(vehicle.variant, color);
//     const vehicleVariant = vehicle.variant;
//     const vehiclePrice = getVehiclePrice(vehicleVariant, color);
//     const onRoadPrice = vehicleVariant?.on_road_price || 0;
//     const vehicleQuantity = vehicle.quantity || 1;
//     return (
//       <div
//         key={index}
//         className="bg-white rounded-lg border p-2 shadow-sm cursor-pointer border-gray-200"
//         onClick={() => {
//           setSelectedVehicleForPopup({ vehicle, index });
//           setShowVehiclePopup(true);
//         }}
//       >
//         <div className="flex items-center space-x-2">
//           {mainPhoto && (
//             <div className="flex-shrink-0">
//               <img
//                 src={`${API_BASE.replace("/api", "")}/uploads/coverPhotos/${mainPhoto}`}
//                 alt={vehicleVariant.name}
//                 className="w-full h-12 object-cover rounded border"
//                 onError={(e) => {
//                   e.target.src =
//                     "https://via.placeholder.com/48x48/f3f4f6/6b7280?text=No+Image";
//                 }}
//               />
//             </div>
//           )}
//           <div className="flex-1 min-w-0">
//             <div className="flex items-start justify-between">
//               <div className="flex-1 min-w-0">
//                 <div className="flex justify-between items-start mb-1">
//                   <p className="font-medium text-gray-800 text-sm truncate">
//                     {vehicleVariant.name}
//                   </p>
//                 </div>
//                 {/* Color Display */}
//                 {color && (
//                   <p className="text-xs text-gray-600 truncate flex items-center gap-1">
//                     <span
//                       className="w-3 h-3 rounded-full border border-gray-300"
//                       style={{ backgroundColor: color.color_code }}
//                     ></span>
//                     {color.name}
//                   </p>
//                 )}
//                 <p className="text-xs text-gray-600 truncate">
//                   {brands.find((b) => b.id === vehicleVariant.brand_id)?.name || "N/A"} •
//                   {ccs.find((c) => c.id === vehicleVariant.cc_id)?.name || "N/A"} •
//                   {fuelTypes.find((f) => f.id === vehicleVariant.fuel_type_id)?.name || "N/A"}
//                 </p>
//                 {/* Quantity */}
//                 <div className="flex items-center justify-between my-1">
//                   <span className="text-xs text-gray-600 font-medium">Qty:</span>
//                   <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium">
//                     {vehicleQuantity}
//                   </span>
//                 </div>
//                 {/* Price Display */}
//                 {vehiclePrice > 0 ? (
//                   <div>
//                     <p className="text-xs text-green-600 font-medium truncate">
//                       ${vehiclePrice.toLocaleString()}
//                       <small className="text-black ml-1">*On-Road Price</small>
//                     </p>
//                     {vehicleQuantity > 1 && (
//                       <p className="text-xs text-green-700 font-semibold truncate">
//                         Total: ${(vehiclePrice * vehicleQuantity).toLocaleString()}*
//                       </p>
//                     )}
//                   </div>
//                 ) : (
//                   <p className="text-xs text-gray-500 truncate">
//                     Price on request
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Vehicles overlay
//   const renderVehiclesOverlay = () => {
//     const allVehicles = [...allVehiclesForCurrentLead, ...currentVehicles];
//     if (allVehicles.length === 0) return null;
//     const totalQuantity = allVehicles.reduce((total, vehicle) => total + (vehicle.quantity || 1), 0);
//     const totalBasicPrice = allVehicles.reduce((total, vehicle) => {
//       const basicPrice = getVehiclePrice(vehicle.variant, vehicle.color);
//       const vehicleQuantity = vehicle.quantity || 1;
//       return total + (parseFloat(basicPrice) || 0) * vehicleQuantity;
//     }, 0);
//     const totalExShowroomPrice = allVehicles.reduce((total, vehicle) => {
//       const exShowroomPrice = vehicle.variant?.ex_showroom_price || 0;
//       const vehicleQuantity = vehicle.quantity || 1;
//       return total + (parseFloat(exShowroomPrice) || 0) * vehicleQuantity;
//     }, 0);
//     const totalOnRoadPrice = allVehicles.reduce((total, vehicle) => {
//       const onRoadPrice = vehicle.variant?.on_road_price || 0;
//       const vehicleQuantity = vehicle.quantity || 1;
//       return total + (parseFloat(onRoadPrice) || 0) * vehicleQuantity;
//     }, 0);
//     const totalTaxes = totalOnRoadPrice - totalExShowroomPrice;
//     const rtoCost = totalOnRoadPrice * 0.05;
//     const insuranceCost = totalOnRoadPrice * 0.03;
//     const otherCharges = totalOnRoadPrice * 0.02;
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//           <div className="bg-[#0f66af] text-white px-4 sm:px-6 py-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg sm:text-xl font-semibold">
//                 Vehicle Details & Price Breakdown
//               </h3>
//               <button
//                 onClick={() => setShowVehiclesOverlay(false)}
//                 className="text-white hover:text-gray-200 transition-colors p-1"
//               >
//                 <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//           <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
//               {allVehicles.map((vehicle, index) => renderVehicleCard(vehicle, index))}
//             </div>
//             <div className="bg-gray-50 rounded-lg border p-4 sm:p-6">
//               <h4 className="font-bold text-gray-800 mb-4 text-lg">Price Breakdown</h4>
//               <div className="space-y-3">
//                 {allVehicles.map((vehicle, index) => {
//                   const vehicleVariant = vehicle.variant;
//                   const color = vehicle.color;
//                   const vehiclePrice = getVehiclePrice(vehicleVariant, color);
//                   const vehicleQuantity = vehicle.quantity || 1;
//                   const totalVehiclePrice = vehiclePrice * vehicleQuantity;
//                   if (vehiclePrice <= 0) return null;
//                   return (
//                     <div key={index} className="border-b border-gray-200 pb-3 last:border-b-0">
//                       <div className="flex justify-between items-start mb-2">
//                         <div>
//                           <span className="text-gray-700 font-medium">{vehicleVariant.name}</span>
//                           {color && (
//                             <div className="flex items-center gap-2 mt-1">
//                               <span
//                                 className="w-4 h-4 rounded-full border border-gray-300"
//                                 style={{ backgroundColor: color.color_code }}
//                               ></span>
//                               <span className="text-sm text-gray-600">{color.name}</span>
//                             </div>
//                           )}
//                         </div>
//                         <div className="text-right">
//                           <span className="text-green-600 font-semibold">${totalVehiclePrice.toLocaleString()}</span>
//                           {vehicleQuantity > 1 && (
//                             <p className="text-sm text-gray-600">(${parseFloat(vehiclePrice).toLocaleString()} × {vehicleQuantity})</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <div className="border-t border-gray-300 pt-4">
//                   {totalExShowroomPrice > 0 && (
//                     <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                       <div className="flex items-center gap-2">
//                         <span className="text-gray-700 font-medium">Ex-Showroom Price</span>
//                         <span className="text-xs text-gray-500">(Before taxes)</span>
//                       </div>
//                       <span className="text-blue-600 font-semibold">${totalExShowroomPrice.toLocaleString()}</span>
//                     </div>
//                   )}
//                   {totalTaxes > 0 && (
//                     <div className="pl-4 border-l-2 border-gray-300">
//                       <h5 className="font-medium text-gray-600 mb-2">Taxes & Charges:</h5>
//                       <div className="space-y-2 text-sm">
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">RTO Registration</span>
//                           <span className="text-gray-700">${rtoCost.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Insurance</span>
//                           <span className="text-gray-700">${insuranceCost.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between">
//                           <span className="text-gray-600">Other Charges</span>
//                           <span className="text-gray-700">${otherCharges.toLocaleString()}</span>
//                         </div>
//                         <div className="flex justify-between pt-2 border-t border-gray-200">
//                           <span className="text-gray-700 font-medium">Total Taxes</span>
//                           <span className="text-gray-700 font-medium">${totalTaxes.toLocaleString()}</span>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   {totalOnRoadPrice > 0 && (
//                     <div className="flex justify-between items-center py-3 bg-blue-50 rounded-lg px-4 mt-4">
//                       <div className="flex items-center gap-2">
//                         <span className="text-blue-800 font-bold text-lg">On Road Price</span>
//                         <span className="text-xs text-blue-600">(Including all taxes)</span>
//                       </div>
//                       <span className="text-blue-800 font-bold text-xl">${totalOnRoadPrice.toLocaleString()}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between items-center pt-3">
//                     <span className="text-gray-700 font-medium">Total Quantity</span>
//                     <span className="text-gray-800 font-semibold">{totalQuantity} units</span>
//                   </div>
//                   {totalQuantity > 1 && totalOnRoadPrice > 0 && (
//                     <div className="text-center pt-2">
//                       <span className="text-sm text-gray-500">
//                         (${(totalOnRoadPrice / totalQuantity).toLocaleString()} per unit)
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="border-t px-4 sm:px-6 py-3 bg-gray-50">
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowVehiclesOverlay(false)}
//                 className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={() => {
//                   console.log("Proceed with purchase");
//                 }}
//                 className="bg-[#0f66af] text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
//               >
//                 Proceed
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Selected vehicles preview
//   const renderSelectedVehiclesPreview = () => {
//     const allPreviewVehicles = [...allVehiclesForCurrentLead, ...currentVehicles];
//     if (allPreviewVehicles.length === 0) return null;
//     return (
//       <div className="mb-6">
//         <div className="block sm:hidden space-y-2">
//           {allPreviewVehicles.slice(0, 2).map((vehicle, index) => renderCompactVehicleCard(vehicle, index))}
//           {allPreviewVehicles.length > 2 && (
//             <div
//               className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-3 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
//               onClick={() => setShowVehiclesOverlay(true)}
//             >
//               <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//               </svg>
//               <p className="text-gray-600 text-xs text-center">+{allPreviewVehicles.length - 2} more vehicles</p>
//               <p className="text-gray-500 text-xs mt-0.5">Tap to view all</p>
//             </div>
//           )}
//         </div>
//         <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//           {allPreviewVehicles.slice(0, 2).map((vehicle, index) => renderVehicleCard(vehicle, index))}
//           {allPreviewVehicles.length > 2 && (
//             <div
//               className="bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
//               onClick={() => setShowVehiclesOverlay(true)}
//             >
//               <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//               </svg>
//               <p className="text-gray-600 text-sm text-center">+{allPreviewVehicles.length - 2} more vehicles</p>
//               <p className="text-gray-500 text-xs mt-1">Click to view all</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Vehicle popup
//   const renderVehiclePopup = (vehicle, index) => {
//     if (!vehicle || !vehicle.variant) return null;
//     const color = vehicle.color;
//     const mainPhoto = getVehicleImage(vehicle.variant, color);
//     const vehicleVariant = vehicle.variant;
//     const basicPrice = getVehiclePrice(vehicleVariant, color);
//     const exShowroomPrice = vehicleVariant?.ex_showroom_price || 0;
//     const onRoadPrice = vehicleVariant?.on_road_price || 0;
//     const vehicleQuantity = vehicle.quantity || 1;
//     const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;
//     const totalExShowroomPrice = parseFloat(exShowroomPrice) * vehicleQuantity;
//     const totalOnRoadPrice = parseFloat(onRoadPrice) * vehicleQuantity;
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
//         <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
//           <div className="bg-[#0f66af] text-white px-4 sm:px-6 py-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg sm:text-xl font-semibold">
//                 Vehicle {index + 1} - Price Details
//               </h3>
//               <button
//                 onClick={() => setShowVehiclePopup(false)}
//                 className="text-white hover:text-gray-200 transition-colors p-1"
//               >
//                 <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//           <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//             <div className="flex items-start gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
//               {mainPhoto && (
//                 <div className="flex-shrink-0">
//                   <img
//                     src={`${API_BASE.replace("/api", "")}/uploads/coverPhotos/${mainPhoto}`}
//                     alt={vehicleVariant.name}
//                     className="w-20 h-20 object-cover rounded-md border"
//                     onError={(e) => {
//                       e.target.src = "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
//                     }}
//                   />
//                 </div>
//               )}
//               <div className="flex-1">
//                 <h4 className="font-semibold text-gray-800 text-lg mb-2">{vehicleVariant.name}</h4>
//                 <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
//                   <p><span className="font-medium">Brand:</span> {brands.find((b) => b.id === vehicleVariant.brand_id)?.name || "N/A"}</p>
//                   <p><span className="font-medium">CC:</span> {ccs.find((c) => c.id === vehicleVariant.cc_id)?.name || "N/A"}</p>
//                   <p><span className="font-medium">Fuel:</span> {fuelTypes.find((f) => f.id === vehicleVariant.fuel_type_id)?.name || "N/A"}</p>
//                   {color && (
//                     <p className="flex items-center gap-2">
//                       <span className="font-medium">Color:</span>
//                       <span className="w-4 h-4 rounded-full border border-gray-400 shadow" style={{ backgroundColor: color.color_code }} title={color.name}></span>
//                       <span className="text-xs">{color.name}</span>
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded-lg">
//               <span className="font-medium text-gray-700">Quantity:</span>
//               <span className="px-3 py-1 min-w-8 text-center font-semibold text-blue-600 bg-white border border-blue-200 rounded">
//                 {vehicleQuantity}
//               </span>
//             </div>
//             <div className="bg-white rounded-lg border p-4">
//               <h4 className="font-bold text-gray-800 mb-4 text-lg">Price Breakdown</h4>
//               <div className="space-y-3">
//                 {basicPrice > 0 && (
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-700 font-medium">{color ? `${color.name} Price` : "Basic Price"}</span>
//                       <span className="text-xs text-gray-500">(Per unit)</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-green-600 font-semibold">${parseFloat(basicPrice).toLocaleString()}</p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-green-500 text-sm">Total: ${totalBasicPrice.toLocaleString()}</p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 {exShowroomPrice > 0 && (
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-700 font-medium">Ex-Showroom Price</span>
//                       <span className="text-xs text-gray-500">(Per unit)</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-blue-600 font-semibold">${parseFloat(exShowroomPrice).toLocaleString()}</p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-blue-500 text-sm">Total: ${totalExShowroomPrice.toLocaleString()}</p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//                 {onRoadPrice > 0 && (
//                   <div className="flex justify-between items-center py-2 border-b border-gray-200">
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-700 font-medium">On Road Price</span>
//                       <span className="text-xs text-gray-500">(Per unit)</span>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-purple-600 font-semibold">${parseFloat(onRoadPrice).toLocaleString()}</p>
//                       {vehicleQuantity > 1 && (
//                         <p className="text-purple-500 text-sm">Total: ${totalOnRoadPrice.toLocaleString()}</p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Quantity summary
//   const renderQuantitySummary = () => {
//     const savedQuantity = allVehiclesForCurrentLead.reduce((total, v) => total + (v.quantity || 1), 0);
//     const currentTotal = currentVehicles.reduce((total, v) => total + v.quantity, 0);
//     const grandTotal = calculateTotalQuantity;
//     return (
//       <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h4 className="font-semibold text-gray-800 mb-1">Vehicle Quantity Summary</h4>
//             <div className="text-sm text-gray-600">
//               <p>• Previously Saved: <span className="font-medium">{savedQuantity}</span></p>
//               <p>• Current Selection: <span className="font-medium">{currentTotal}</span></p>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold text-blue-700">
//               {grandTotal} <span className="text-sm font-normal">Total Units</span>
//             </div>
//             <div className="text-sm text-gray-500 mt-1">All vehicles active</div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Form handling
//   const validateForm = () => {
//     const phoneStr = String(formData.phoneNumber || "").trim();
//     if (!formData.customerName?.trim()) return "Customer name is required.";
//     if (!/^\d{10}$/.test(phoneStr)) return "Valid 10-digit phone number required.";
//     if (!formData.customerLocation?.trim()) return "Location is required.";
//     const totalQty = calculateTotalQuantity;
//     if (totalQty < 1) return "Total quantity must be at least 1.";
//     if (!variant) return "Please select a vehicle variant.";
//     if (!assignedDealerId) return "No dealer assigned for the selected area. Please contact administrator.";
//     return null;
//   };

//   const handleSubmit = async (action = "submit") => {
//     const validationError = validateForm();
//     if (validationError) {
//       setErrorMessage(validationError);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }
//     if (currentVehicles.length === 0) {
//       setErrorMessage("No vehicles selected.");
//       return;
//     }
//     setIsSubmitting(true);
//     setErrorMessage(null);
//     try {
//       const selectedArea = dealerAssignedAreas.find((area) => area.name === formData.customerArea?.trim());
//       if (!selectedArea || !selectedCityId) {
//         throw new Error("Please select valid area and city.");
//       }
//       const finalLocation = formData.customerArea
//         ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}` : formData.customerLocation.trim();
//       const currentUserId = getCurrentDealerId();
//       const unitPrice = totalPrice / (totalQuantity || 1);
//       const firstVehicle = currentVehicles[0];
//       const payload = {
//         customer_name: formData.customerName.trim(),
//         phone_no: (formData.phoneNumber || "").toString().trim(),
//         location: finalLocation,
//         area: formData.customerArea?.trim() || null,
//         city_id: selectedCityId,
//         area_id: selectedArea.id,
//         executive_id: currentUserId,
//         tentative_purchase_date: formData.purchaseDate || null,
//         unit_price: unitPrice,
//         total_price: totalPrice || (unitPrice * calculateTotalQuantity),
//         vehicle_qty: calculateTotalQuantity,
//         current_vehicle_qty: calculateTotalQuantity,
//         payment_mode: formData.paymentMode,
//         additional_note: formData.notes?.trim() || null,
//         brand_id: parseInt(variant.brand_id, 10),
//         variant_id: parseInt(variant.id, 10),
//         lead_id: leadId || null,
//         status: action === "save_draft" ? "Draft" : "Open",
//         color_id: firstVehicle.color?.id || null,
//         color_name: firstVehicle.color?.name || null,
//         color_code: firstVehicle.color?.color_code || null,
//         dealer_id: assignedDealerId,
//         distributor_id: assignedDistributorId,
//       };
//       const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//         headers: getAuthHeaders(),
//       });
//       if (data?.success) {
//         const newLeadId = data.lead_id || data.lead?.id;
//         setLeadId(newLeadId);
//         const updatedVehicles = [
//           ...allVehiclesForCurrentLead.map(v => ({
//             ...v,
//             lead_id: newLeadId,
//             id: v.id || `${newLeadId}-${v.color?.id || 'default'}`,
//             dealer_id: assignedDealerId,
//             distributor_id: assignedDistributorId,
//           })),
//           ...currentVehicles.map(v => ({
//             ...v,
//             lead_id: newLeadId,
//             id: `${newLeadId}-${v.color?.id || 'default'}`,
//             dealer_id: assignedDealerId,
//             distributor_id: assignedDistributorId,
//           }))
//         ];
//         setAllVehiclesForCurrentLead(updatedVehicles);
//         localStorage.setItem("allVehiclesForCurrentLead", JSON.stringify(updatedVehicles));
//         // Add additional vehicles if multiple colors
//         for (let i = 1; i < currentVehicles.length; i++) {
//           const v = currentVehicles[i];
//           const vehiclePayload = {
//             brand_id: parseInt(variant.brand_id, 10),
//             variant_id: parseInt(variant.id, 10),
//             color_id: v.color?.id || null,
//             color_name: v.color?.name || null,
//             color_code: v.color?.color_code || null,
//             area_id: selectedArea.id,
//             city_id: selectedCityId,
//           };
//           await axios.post(`${API_BASE}/leads/${newLeadId}/vehicles`, vehiclePayload, { headers: getAuthHeaders() });
//         }
//         const successMessage = assignedDealerId
//           ? `Lead #${newLeadId} created successfully! Dealer: ${assignedDealerName}`
//           : `Lead #${newLeadId} created successfully!`;
//         toast.success(successMessage, {
//           duration: 4000,
//           icon: "✅",
//           style: {
//             borderRadius: "10px",
//             background: "#10b981",
//             color: "#fff",
//           },
//         });
//         if (action === "submit") {
//           clearLocalStorageForSubmit();
//           navigate("/leads/open", {
//             state: {
//               recentLead: data.lead,
//               allLeads: updatedVehicles,
//               submittedVariant: variant,
//               submittedLeadId: newLeadId,
//               submittedColor: firstVehicle.color,
//               assignedDealer: assignedDealerId,
//               assignedDistributor: assignedDistributorId,
//             },
//           });
//         }
//       }
//     } catch (err) {
//       const msg = err.response?.data?.message || err.message || "Submission failed.";
//       setErrorMessage(msg);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       toast.error(msg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const clearLocalStorageForSubmit = () => {
//     const keys = ["leadId", "draftLead", "recentSubmittedLead", "existingCustomerData", "allVehiclesForCurrentLead", "tempLeadData"];
//     keys.forEach((key) => localStorage.removeItem(key));
//     setStoredLeads([]);
//     setAllVehiclesForCurrentLead([]);
//     setIsContinuation(false);
//   };

//   const handleSaveDraft = async () => {
//     const validationError = validateForm();
//     if (validationError) {
//       setErrorMessage(validationError);
//       return;
//     }
//     if (currentVehicles.length === 0) {
//       setErrorMessage("No vehicles selected.");
//       return;
//     }
//     const selectedArea = dealerAssignedAreas.find((area) => area.name === formData.customerArea);
//     if (!selectedArea || !selectedCityId) {
//       setErrorMessage("Please select valid area and city.");
//       return;
//     }
//     const finalLocation = formData.customerArea
//       ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}` : formData.customerLocation.trim();
//     const currentUserId = getCurrentDealerId();
//     const unitPrice = totalPrice / (totalQuantity || 1);
//     const firstVehicle = currentVehicles[0];
//     const payload = {
//       customer_name: formData.customerName.trim(),
//       phone_no: formData.phoneNumber.trim(),
//       location: finalLocation || null,
//       area: formData.customerArea?.trim() || null,
//       city_id: selectedCityId,
//       area_id: selectedArea.id,
//       executive_id: currentUserId,
//       tentative_purchase_date: formData.purchaseDate || null,
//       vehicle_qty: calculateTotalQuantity,
//       current_vehicle_qty: calculateTotalQuantity,
//       payment_mode: formData.paymentMode,
//       additional_note: formData.notes?.trim() || null,
//       brand_id: parseInt(variant.brand_id, 10),
//       variant_id: parseInt(variant.id, 10),
//       lead_id: leadId || null,
//       status: "Draft",
//       color_id: firstVehicle.color?.id || null,
//       color_name: firstVehicle.color?.name || null,
//       color_code: firstVehicle.color?.color_code || null,
//     };
//     try {
//       const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//         headers: getAuthHeaders(),
//       });
//       if (data?.lead?.id) {
//         const newLeadId = data.lead.id;
//         setLeadId(newLeadId);
//         const updatedVehicles = [
//           ...allVehiclesForCurrentLead.map((v) => ({ ...v, lead_id: newLeadId, status: "Draft" })),
//           ...currentVehicles.map(v => ({
//             ...v,
//             lead_id: newLeadId,
//             status: "Draft",
//           })),
//         ];
//         setAllVehiclesForCurrentLead(updatedVehicles);
//         localStorage.setItem("allVehiclesForCurrentLead", JSON.stringify(updatedVehicles));
//         localStorage.removeItem("existingCustomerData");
//         localStorage.removeItem("leadId");
//         localStorage.removeItem("tempLeadData");
//         setIsContinuation(false);
//         toast.success("Draft saved successfully!");
//         navigate("/dashboard");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Draft failed.";
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//     }
//   };

//   const addNewVehicle = async () => {
//     // Save current vehicles (previous + current) to localStorage before navigating to preserve them
//     const currentAllVehicles = [...allVehiclesForCurrentLead, ...currentVehicles];
//     if (currentAllVehicles.length > 0) {
//       localStorage.setItem("allVehiclesForCurrentLead", JSON.stringify(currentAllVehicles));
//     }
//     // Save snapshot of form and related states
//     const snapshot = {
//       formData,
//       selectedCityId,
//       selectedAreaId,
//       assignedDealerId,
//       assignedDistributorId,
//       assignedDealerName,
//       assignedDistributorName,
//     };
//     localStorage.setItem("tempLeadData", JSON.stringify(snapshot));
//     navigate("/leads/generate");
//   };

//   // Location handling
//   const fetchLocations = async (searchText) => {
//     if (!searchText || searchText.trim().length < 2) {
//       setLocations([]);
//       setShowLocationDropdown(false);
//       return;
//     }
//     try {
//       setLoadingLocations(true);
//       const response = await axios.get(`${API_BASE}/locations/search`, {
//         headers: getAuthHeaders(),
//         params: { search: searchText.trim() },
//       });
//       if (response.data.success) {
//         setLocations(response.data.data);
//         setShowLocationDropdown(response.data.data.length > 0);
//       } else {
//         setLocations([]);
//         setShowLocationDropdown(false);
//       }
//     } catch (err) {
//       console.error("Error fetching locations:", err);
//       setLocations([]);
//       setShowLocationDropdown(false);
//     } finally {
//       setLoadingLocations(false);
//     }
//   };

//   const fetchAreasForCity = async (cityId, cityName) => {
//     if (!cityId) {
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//       return;
//     }
//     try {
//       setLoadingDealerAreas(true);
//       const dealerId = getCurrentDealerId();
//       const response = await axios.get(
//         `${API_BASE}/areas/dealer-areas/${cityId}`,
//         {
//           headers: getAuthHeaders(),
//           params: { dealer_id: dealerId },
//         }
//       );
//       if (response.data.success) {
//         setDealerAssignedAreas(response.data.data);
//         setShowAreaDropdown(response.data.data.length > 0);
//         if (response.data.is_dealer_assigned) {
//           toast.success(`Showing your assigned areas for ${response.data.city_name}`);
//         }
//       } else {
//         setDealerAssignedAreas([]);
//         setShowAreaDropdown(false);
//       }
//     } catch (err) {
//       console.error("Error fetching areas:", err);
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//     } finally {
//       setLoadingDealerAreas(false);
//     }
//   };

//   const handleLocationSearchChange = (e) => {
//     const value = e.target.value;
//     setLocationSearchText(value);
//     if (value.trim().length >= 2) {
//       setShowLocationDropdown(true);
//       fetchLocations(value);
//     } else {
//       setShowLocationDropdown(false);
//       setLocations([]);
//     }
//   };

//   const handleLocationSelect = (location) => {
//     setFormData((prev) => ({
//       ...prev,
//       customerLocation: location.city_name || location.name,
//       customerArea: "",
//     }));
//     setLocationSearchText(location.city_name || location.name);
//     setSelectedCityId(location.id);
//     setShowLocationDropdown(false);
//     setLocations([]);
//     setAssignedDealerId(null);
//     setAssignedDistributorId(null);
//     setAssignedDealerName("");
//     setAssignedDistributorName("");
//     fetchAreasForCity(location.id, location.city_name || location.name);
//   };

//   const handleAreaSelect = (area) => {
//     setFormData((prev) => ({ ...prev, customerArea: area.name }));
//     setSelectedAreaId(area.id);
//     setShowAreaDropdown(false);
//     if (area.id && selectedCityId) {
//       fetchDealerDistributorMapping(area.id, selectedCityId);
//     }
//   };

//   const handleChange = (e) => {
//     const { id, name, value } = e.target;
//     const field = id || name;
//     if (isContinuation && (field === 'customerName' || field === 'paymentMode' || field === 'notes')) {
//       return; // Ignore changes for locked fields
//     }
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     setErrorMessage(null);
//   };

//   const handleCheckboxChange = (e) => {
//     if (isContinuation) return; // Ignore if continuation
//     setUseSameCustomerDetails(e.target.checked);
//   };

//   // Use effects
//   useEffect(() => {
//     localStorage.removeItem("leadId");
//     localStorage.removeItem("draftLead");
//     setLeadId(null);
//     setLeadDetails(null);
//     setSelectedCityId(null);
//     const stored = localStorage.getItem("recentSubmittedLead");
//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored);
//         if (Array.isArray(parsed)) setStoredLeads(parsed);
//       } catch (err) {}
//     }

//     // Load temp data first if exists (for continuation)
//     const tempData = localStorage.getItem("tempLeadData");
//     if (tempData) {
//       try {
//         const parsed = JSON.parse(tempData);
//         setFormData((prev) => ({ ...prev, ...parsed.formData }));
//         setSelectedCityId(parsed.selectedCityId);
//         setSelectedAreaId(parsed.selectedAreaId);
//         setAssignedDealerId(parsed.assignedDealerId);
//         setAssignedDistributorId(parsed.assignedDistributorId);
//         setAssignedDealerName(parsed.assignedDealerName);
//         setAssignedDistributorName(parsed.assignedDistributorName);
//         // Refetch areas and mapping if city and area selected
//         if (parsed.selectedCityId) {
//           fetchAreasForCity(parsed.selectedCityId, parsed.formData.customerLocation);
//         }
//         if (parsed.selectedAreaId && parsed.selectedCityId) {
//           // Wait a tick for areas to load, then fetch mapping
//           setTimeout(() => {
//             fetchDealerDistributorMapping(parsed.selectedAreaId, parsed.selectedCityId);
//           }, 100);
//         }
//       } catch (err) {
//         console.error("Error loading temp data:", err);
//       }
//     }

//     const draft = localStorage.getItem("draftLead");
//     if (draft && !tempData) { // Only if no temp
//       try {
//         setFormData((prev) => ({ ...prev, ...JSON.parse(draft) }));
//       } catch (err) {}
//     }

//     const vehiclesStored = localStorage.getItem("allVehiclesForCurrentLead");
//     if (vehiclesStored) {
//       try {
//         const parsedVehicles = JSON.parse(vehiclesStored);
//         setAllVehiclesForCurrentLead(parsedVehicles);
//         if (parsedVehicles.length > 0) {
//           setIsContinuation(true);
//         }
//       } catch (err) {}
//     }
//   }, []);

//   useEffect(() => {
//     setLocationSearchText(formData.customerLocation);
//   }, [formData.customerLocation]);

//   useEffect(() => {
//     const loadLead = async () => {
//       if (!leadId) return;
//       try {
//         const res = await axios.get(`${API_BASE}/leads/${leadId}`, {
//           headers: getAuthHeaders(),
//         });
//         const data = res.data.data || res.data;
//         setLeadDetails(data);
//       } catch (err) {
//         localStorage.removeItem("leadId");
//         setLeadId(null);
//         setLeadDetails(null);
//       }
//     };
//     loadLead();
//   }, [leadId]);

//   useEffect(() => {
//     if (leadDetails && !localStorage.getItem("draftLead") && !localStorage.getItem("tempLeadData")) {
//       setFormData({
//         customerName: leadDetails.customer_name || "",
//         phoneNumber: leadDetails.phone_no || "",
//         customerLocation: leadDetails.location || "",
//         customerArea: leadDetails.area || "",
//         purchaseDate: leadDetails.tentative_purchase_date || "",
//         quantity: leadDetails.vehicle_qty || 1,
//         paymentMode: leadDetails.payment_mode || "cash",
//         notes: leadDetails.additional_note || "",
//       });
//     }
//   }, [leadDetails]);

//   useEffect(() => {
//     if (useSameCustomerDetails && storedLeads.length > 0 && !isContinuation) {
//       const latestLead = storedLeads[storedLeads.length - 1];
//       setFormData((prev) => ({
//         ...prev,
//         customerName: latestLead.customer_name || "",
//         phoneNumber: latestLead.phone_no || "",
//         customerLocation: latestLead.location || "",
//         customerArea: latestLead.area || "",
//         purchaseDate: latestLead.tentative_purchase_date || "",
//         quantity: latestLead.vehicle_qty || 1,
//         paymentMode: latestLead.payment_mode || "cash",
//         notes: latestLead.additional_note || "",
//       }));
//     }
//   }, [useSameCustomerDetails, storedLeads, isContinuation]);

//   useEffect(() => {
//     if (formData.customerLocation) {
//       // fetchDealerAreas implementation similar to original, omitted for brevity
//     } else {
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//     }
//   }, [formData.customerLocation]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (locationSearchText && locationSearchText.trim().length >= 2) {
//         fetchLocations(locationSearchText);
//       } else {
//         setLocations([]);
//         setShowLocationDropdown(false);
//       }
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [locationSearchText]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (!event.target.closest(".location-search-container")) setShowLocationDropdown(false);
//       if (!event.target.closest(".area-select-container")) setShowAreaDropdown(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="m-4">
//       <Stepper step={3} />
//       {showVehiclesOverlay && renderVehiclesOverlay()}
//       {showVehiclePopup && selectedVehicleForPopup && renderVehiclePopup(selectedVehicleForPopup.vehicle, selectedVehicleForPopup.index)}
//       {errorMessage && (
//         <p className="text-red-600 font-semibold mb-4 text-sm sm:text-base">{errorMessage}</p>
//       )}
//       <div className="page-header flex justify-between items-center">
//         <h3 className="text-base sm:text-lg font-semibold">New Lead Information</h3>
//       </div>
//       {renderQuantitySummary()}
//       <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 sm:p-6">
//         <div className="mb-4">
//           <button
//             onClick={() => navigate(-1)}
//             className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-200 transition-colors flex items-center"
//           >
//             ← Back
//           </button>
//         </div>
//         {renderSelectedVehiclesPreview()}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
//           <div className="space-y-3 sm:space-y-4">
//             <div>
//               <label htmlFor="customerName" className="block font-medium mb-1 text-sm sm:text-base">
//                 Customer Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="customerName"
//                 value={formData.customerName}
//                 onChange={handleChange}
//                 placeholder="Enter customer name"
//                 className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//                 required
//                 disabled={isContinuation}
//               />
//             </div>
//             <div>
//               <label htmlFor="phoneNumber" className="block font-medium mb-1 text-sm sm:text-base">
//                 Phone Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="tel"
//                 id="phoneNumber"
//                 value={formData.phoneNumber}
//                 onChange={handleChange}
//                 placeholder="10-digit phone number"
//                 className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//                 required
//                 pattern="\d{10}"
//               />
//             </div>
//             <div className="relative location-search-container">
//               <label htmlFor="locationSearch" className="block font-medium mb-1 text-sm sm:text-base">
//                 Location (City) <span className="text-red-500">*</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type="text"
//                   id="locationSearch"
//                   value={locationSearchText}
//                   onChange={handleLocationSearchChange}
//                   onFocus={() => locationSearchText.length >= 2 && setShowLocationDropdown(true)}
//                   placeholder="Type city name (e.g., Pune, Mumbai)"
//                   className="w-full border border-gray-300 p-2.5 rounded-lg pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   required
//                   autoComplete="off"
//                 />
//                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                   {loadingLocations ? (
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                   ) : (
//                     <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                     </svg>
//                   )}
//                 </div>
//               </div>
//               {showLocationDropdown && (
//                 <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                   {locations.length > 0 ? (
//                     locations.map((location) => (
//                       <div
//                         key={location.id}
//                         className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
//                         onClick={() => handleLocationSelect(location)}
//                       >
//                         <div className="font-medium text-gray-800 text-sm">{location.city_name || location.name}</div>
//                         {location.state_name && <div className="text-xs text-gray-500 mt-1">{location.state_name}</div>}
//                       </div>
//                     ))
//                   ) : (
//                     <div className="px-4 py-3 text-gray-500 text-center text-sm">
//                       {locationSearchText.length >= 2 ? "No locations found. Try different keywords." : "Type at least 2 characters to search"}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="relative area-select-container">
//                 <label htmlFor="customerArea" className="block font-medium mb-1 text-sm sm:text-base">
//                   Area <span className="text-red-500">*</span>
//                   <span className="text-gray-500 text-xs ml-2">{getCurrentDealerId() ? "(Dealer Assigned)" : "(All Areas)"}</span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="customerArea"
//                     value={formData.customerArea}
//                     onChange={handleChange}
//                     onClick={() => formData.customerLocation && setShowAreaDropdown(!showAreaDropdown)}
//                     placeholder={formData.customerLocation ? "Select area" : "Select a city first"}
//                     className={`w-full border border-gray-300 p-2.5 rounded-lg pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       !formData.customerLocation ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"
//                     }`}
//                     readOnly
//                     disabled={!formData.customerLocation}
//                   />
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     {loadingDealerAreas ? (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                     ) : (
//                       <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                       </svg>
//                     )}
//                   </div>
//                 </div>
//                 {showAreaDropdown && (
//                   <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     {dealerAssignedAreas.length > 0 ? (
//                       <>
//                         <div className="px-3 py-2 text-xs bg-blue-50 border-b">
//                           <div className="font-medium text-blue-700">
//                             {getCurrentDealerId() ? "Your Assigned Areas" : "All Areas"} for {formData.customerLocation}
//                           </div>
//                         </div>
//                         {dealerAssignedAreas.map((area) => (
//                           <div
//                             key={area.id}
//                             className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
//                             onClick={() => handleAreaSelect(area)}
//                           >
//                             <div className="font-medium text-gray-800 text-sm">{area.name}</div>
//                             {area.city_name && (
//                               <div className="text-xs text-gray-500 mt-1">
//                                 {area.city_name}
//                                 {area.state_name && `, ${area.state_name}`}
//                               </div>
//                             )}
//                           </div>
//                         ))}
//                       </>
//                     ) : (
//                       <div className="px-4 py-3 text-gray-500 text-center text-sm">
//                         {formData.customerLocation ? "No areas found for this location" : "Select a location first"}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block font-medium mb-1 text-sm sm:text-base">Assigned Dealer</label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={assignedDealerName || "No dealer assigned"}
//                     readOnly
//                     className={`w-full border p-2.5 rounded-lg text-sm sm:text-base ${
//                       assignedDealerId ? "bg-green-50 border-green-300 text-green-700" : "bg-gray-100 border-gray-300 text-gray-500"
//                     }`}
//                     placeholder="Dealer will be auto-assigned based on area"
//                   />
//                   {loadingDealerMapping && (
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                     </div>
//                   )}
//                   {assignedDealerId && !loadingDealerMapping && (
//                     <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                       <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//                 {assignedDistributorId && (
//                   <div className="mt-1 text-xs text-gray-600">Distributor: {assignedDistributorName}</div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="space-y-3 sm:space-y-4">
//             <div>
//               <label htmlFor="purchaseDate" className="block font-medium mb-1 text-sm sm:text-base">
//                 Tentative Purchase Date<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 id="purchaseDate"
//                 name="purchaseDate"
//                 value={formData.purchaseDate}
//                 onChange={handleChange}
//                 className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//                 min={new Date().toISOString().split("T")[0]}
//               />
//             </div>
//             <div>
//               <label className="block font-medium mb-1 text-sm sm:text-base">Payment Mode <span className="text-red-500">*</span></label>
//               <div className="flex gap-3 sm:gap-4">
//                 <label className="flex items-center text-sm sm:text-base">
//                   <input type="radio" name="paymentMode" value="cash" checked={formData.paymentMode === "cash"} onChange={handleChange} className="mr-2" required disabled={isContinuation} /> Cash
//                 </label>
//                 <label className="flex items-center text-sm sm:text-base">
//                   <input type="radio" name="paymentMode" value="finance" checked={formData.paymentMode === "finance"} onChange={handleChange} className="mr-2" disabled={isContinuation} /> Finance
//                 </label>
//               </div>
//             </div>
//             <div>
//               <label className="block font-medium mb-1 text-sm sm:text-base">Selected Quantity</label>
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
//                 <div>
//                   <span className="text-lg font-bold text-gray-800">{calculateTotalQuantity} units</span>
//                   <div className="text-sm text-gray-600 mt-1">All units are active</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-xs text-gray-500 mb-1">Total across all vehicles</div>
//                   <div className="text-xl font-bold text-blue-600">{calculateTotalQuantity} units</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="mb-6">
//           <label htmlFor="notes" className="block font-medium mb-1 text-sm sm:text-base">Additional Notes</label>
//           <textarea
//             id="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             placeholder="Enter any additional notes..."
//             rows="3"
//             className="w-full border p-2.5 rounded-lg text-sm sm:text-base"
//             disabled={isContinuation}
//           />
//         </div>
//         {storedLeads.length > 0 && (
//           <div className="mb-6">
//             <label className="flex items-center text-sm sm:text-base">
//               <input type="checkbox" checked={useSameCustomerDetails} onChange={handleCheckboxChange} className="mr-2" disabled={isContinuation} /> Auto-Fill
//             </label>
//           </div>
//         )}
//         <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 mt-6 sm:mt-8">
//           <button
//             onClick={handleSaveDraft}
//             className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors order-2 sm:order-1"
//           >
//             Save as Draft
//           </button>
//           <button
//             onClick={addNewVehicle}
//             className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors order-3 sm:order-2"
//           >
//             Add Another Vehicle
//           </button>
//           <button
//             onClick={() => handleSubmit("submit")}
//             disabled={isSubmitting}
//             className={`relative bg-primary-blue text-white rounded-lg px-6 py-3 font-medium flex items-center justify-center transition-all ${
//               isSubmitting ? "opacity-80 cursor-not-allowed" : "hover:bg-hover-blue"
//             }`}
//           >
//             {isSubmitting ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Submitting...
//               </>
//             ) : (
//               "Submit Lead"
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadInformation;

import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper";
import axios from "axios";
import toast from "react-hot-toast";

const LeadInformation = () => {
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
    quantity: totalQuantity || quantity || 1,
    paymentMode: "cash",
    notes: "",
  });

  const [leadId, setLeadId] = useState(localStorage.getItem("leadId") || null);
  const [leadDetails, setLeadDetails] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [showVehiclesOverlay, setShowVehiclesOverlay] = useState(false);

  // Dealer mapping states
  const [dealerAssignedAreas, setDealerAssignedAreas] = useState([]);
  const [loadingDealerAreas, setLoadingDealerAreas] = useState(false);
  const [assignedDealerId, setAssignedDealerId] = useState(null);
  const [assignedDistributorId, setAssignedDistributorId] = useState(null);
  const [assignedDealerName, setAssignedDealerName] = useState("");
  const [assignedDistributorName, setAssignedDistributorName] = useState("");
  const [loadingDealerMapping, setLoadingDealerMapping] = useState(false);

  // Vehicle management state
  const [allVehiclesForCurrentLead, setAllVehiclesForCurrentLead] = useState(
    () => {
      // Initialize with existing vehicles from localStorage or location state
      const savedVehicles = localStorage.getItem("allVehiclesForCurrentLead");
      if (savedVehicles) {
        try {
          const parsed = JSON.parse(savedVehicles);
          return Array.isArray(parsed) ? parsed : [];
        } catch (err) {
          console.error("Error parsing saved vehicles:", err);
          return existingVehicles || [];
        }
      }
      return existingVehicles || [];
    }
  );
  const [selectedCityId, setSelectedCityId] = useState(null);

  // Current vehicles from color selections (current session)
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

  const API_BASE = "http://localhost:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

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

  const getTotalDisplayQuantity = () => calculateTotalQuantity;

  // Dealer mapping functions
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

  const fetchDealerDistributorMapping = async (areaId, cityId) => {
    if (!areaId || !cityId) {
      setAssignedDealerId(null);
      setAssignedDistributorId(null);
      setAssignedDealerName("");
      setAssignedDistributorName("");
      return;
    }
    try {
      setLoadingDealerMapping(true);
      const response = await axios.get(
        `${API_BASE}/dealer/distributor-mapping`,
        {
          headers: getAuthHeaders(),
          params: {
            area_id: areaId,
            city_id: cityId,
          },
        }
      );
      if (response.data.success) {
        setAssignedDealerId(response.data.dealer_id);
        setAssignedDistributorId(response.data.distributor_id);
        setAssignedDealerName(response.data.dealer_name);
        setAssignedDistributorName(response.data.distributor_name);
        toast.success(`Dealer assigned: ${response.data.dealer_name}`);
      } else {
        setAssignedDealerId(null);
        setAssignedDistributorId(null);
        setAssignedDealerName("");
        setAssignedDistributorName("");
        console.warn("No dealer mapping found for this area");
      }
    } catch (error) {
      console.error("Error fetching dealer mapping:", error);
      setAssignedDealerId(null);
      setAssignedDistributorId(null);
      setAssignedDealerName("");
      setAssignedDistributorName("");
    } finally {
      setLoadingDealerMapping(false);
    }
  };

  // Vehicle display functions
  const getVehicleImage = (vehicleVariant, color = null) => {
    if (!vehicleVariant) return null;
    let gallery;
    if (color && color.id) {
      gallery = galleries.find(
        (g) => g.variant_id === vehicleVariant.id && g.color_id === color.id
      );
    }
    if (!gallery) {
      gallery = galleries.find((g) => g.variant_id === vehicleVariant.id);
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

  // Vehicle card rendering
  const renderVehicleCard = (vehicle, index) => {
    if (!vehicle || !vehicle.variant) return null;

    const color = vehicle.color;
    const mainPhoto = getVehicleImage(vehicle.variant, color);
    const vehicleVariant = vehicle.variant;
    const basicPrice = getVehiclePrice(vehicleVariant, color);
    const vehicleQuantity = vehicle.quantity || 1;

    const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;

    return (
      <div
        key={`${vehicle.id || index}-${
          vehicle.isCurrent ? "current" : "saved"
        }`}
        className={`bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-all cursor-pointer ${
          vehicle.isCurrent ? "border-blue-500 border-2" : "border-gray-200"
        }`}
        onClick={() => {
          setSelectedVehicleForPopup({ vehicle, index });
          setShowVehiclePopup(true);
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
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
            </div>

            {/* Vehicle Details */}
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

              {/* Quantity Display */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Quantity:</span>
                <div className="flex items-center">
                  <span className="px-2 py-1 min-w-8 text-center font-medium bg-gray-100 rounded">
                    {vehicleQuantity}
                  </span>
                </div>
              </div>

              {/* Price Display */}
              <div className="space-y-1 mt-2">
                {basicPrice > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Price:</span>
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

  const renderCompactVehicleCard = (vehicle, index) => {
    if (!vehicle || !vehicle.variant) return null;

    const color = vehicle.color;
    const mainPhoto = getVehicleImage(vehicle.variant, color);
    const vehicleVariant = vehicle.variant;
    const vehiclePrice = getVehiclePrice(vehicleVariant, color);
    const vehicleQuantity = vehicle.quantity || 1;

    return (
      <div
        key={`${vehicle.id || index}-${
          vehicle.isCurrent ? "current" : "saved"
        }`}
        className={`bg-white rounded-lg border p-2 shadow-sm cursor-pointer ${
          vehicle.isCurrent ? "border-blue-500 border-2" : "border-gray-200"
        }`}
        onClick={() => {
          setSelectedVehicleForPopup({ vehicle, index });
          setShowVehiclePopup(true);
        }}
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
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-gray-800 text-sm truncate">
                    {vehicleVariant.name}
                  </p>
                  {vehicle.isCurrent && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>

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

                {/* Quantity */}
                <div className="flex items-center justify-between my-1">
                  <span className="text-xs text-gray-600 font-medium">
                    Qty:
                  </span>
                  <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium">
                    {vehicleQuantity}
                  </span>
                </div>

                {/* Price Display */}
                {vehiclePrice > 0 ? (
                  <div>
                    <p className="text-xs text-green-600 font-medium truncate">
                      ${vehiclePrice.toLocaleString()}
                      <small className="text-black ml-1">*On-Road Price</small>
                    </p>
                    {vehicleQuantity > 1 && (
                      <p className="text-xs text-green-700 font-semibold truncate">
                        Total: $
                        {(vehiclePrice * vehicleQuantity).toLocaleString()}*
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 truncate">
                    Price on request
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Selected vehicles preview
  const renderSelectedVehiclesPreview = () => {
    const allPreviewVehicles = [
      ...allVehiclesForCurrentLead,
      ...currentVehicles,
    ];
    if (allPreviewVehicles.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="block sm:hidden space-y-2">
          {allPreviewVehicles
            .slice(0, 3)
            .map((vehicle, index) => renderCompactVehicleCard(vehicle, index))}
          {allPreviewVehicles.length > 3 && (
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
                +{allPreviewVehicles.length - 3} more vehicles
              </p>
              <p className="text-gray-500 text-xs mt-0.5">Tap to view all</p>
            </div>
          )}
        </div>

        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {allPreviewVehicles
            .slice(0, 3)
            .map((vehicle, index) => renderVehicleCard(vehicle, index))}
          {allPreviewVehicles.length > 3 && (
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
                +{allPreviewVehicles.length - 3} more vehicles
              </p>
              <p className="text-gray-500 text-xs mt-1">Click to view all</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Form handling
  const validateForm = () => {
    const phoneStr = String(formData.phoneNumber || "").trim();
    if (!formData.customerName?.trim()) return "Customer name is required.";
    if (!/^\d{10}$/.test(phoneStr))
      return "Valid 10-digit phone number required.";
    if (!formData.customerLocation?.trim()) return "Location is required.";

    const totalQty = calculateTotalQuantity;
    if (totalQty < 1) return "Total quantity must be at least 1.";

    if (
      !variant &&
      allVehiclesForCurrentLead.length === 0 &&
      currentVehicles.length === 0
    ) {
      return "Please select at least one vehicle variant.";
    }

    if (!assignedDealerId)
      return "No dealer assigned for the selected area. Please contact administrator.";

    return null;
  };

  // FIXED SUBMIT FUNCTION - Handles multiple vehicles properly
  const handleSubmit = async (action = "submit") => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // If no current vehicles and no saved vehicles, show error
    if (
      currentVehicles.length === 0 &&
      allVehiclesForCurrentLead.length === 0
    ) {
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

      const finalLocation = formData.customerArea
        ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
        : formData.customerLocation.trim();

      const currentUserId = getCurrentDealerId();

      // Get the main vehicle for basic info (first from current or saved)
      const mainVehicle =
        currentVehicles.length > 0
          ? currentVehicles[0]
          : allVehiclesForCurrentLead[0];

      if (!mainVehicle || !mainVehicle.variant) {
        throw new Error("No valid vehicle selected.");
      }

      // Prepare payload for lead creation
      const payload = {
        customer_name: formData.customerName.trim(),
        phone_no: (formData.phoneNumber || "").toString().trim(),
        location: finalLocation,
        area: formData.customerArea?.trim() || null,
        city_id: selectedCityId,
        area_id: selectedArea.id,
        executive_id: currentUserId,
        tentative_purchase_date: formData.purchaseDate || null,
        unit_price: mainVehicle.price || 0,
        total_price:
          totalPrice || mainVehicle.price * (mainVehicle.quantity || 1),
        vehicle_qty: calculateTotalQuantity,
        current_vehicle_qty: mainVehicle.quantity || 1,
        payment_mode: formData.paymentMode,
        additional_note: formData.notes?.trim() || null,
        brand_id: parseInt(mainVehicle.variant.brand_id, 10),
        variant_id: parseInt(mainVehicle.variant.id, 10),
        lead_id: leadId || null,
        status: action === "save_draft" ? "Draft" : "Open",
        color_id: mainVehicle.color?.id || null,
        color_name: mainVehicle.color?.name || null,
        color_code: mainVehicle.color?.color_code || null,
        dealer_id: assignedDealerId,
        distributor_id: assignedDistributorId,
      };

      console.log("Submitting lead payload:", payload);

      const { data } = await axios.post(`${API_BASE}/leads`, payload, {
        headers: getAuthHeaders(),
      });

      if (data?.success) {
        const newLeadId = data.lead_id || data.lead?.id;
        setLeadId(newLeadId);

        // Combine all vehicles for display
        const updatedVehicles = [
          ...allVehiclesForCurrentLead.map((v) => ({
            ...v,
            lead_id: newLeadId,
            id: `${newLeadId}-${v.id || "saved"}`,
            dealer_id: assignedDealerId,
            distributor_id: assignedDistributorId,
            status: action === "submit" ? "Submitted" : "Draft",
          })),
          ...currentVehicles.map((v) => ({
            ...v,
            lead_id: newLeadId,
            id: `${newLeadId}-${Date.now()}-${v.color?.id || "new"}`,
            dealer_id: assignedDealerId,
            distributor_id: assignedDistributorId,
            status: action === "submit" ? "Submitted" : "Draft",
          })),
        ];

        // Save to localStorage
        localStorage.setItem(
          "allVehiclesForCurrentLead",
          JSON.stringify(updatedVehicles)
        );

        // Add additional vehicles for multiple selections
        const allVehiclesToSave = [
          ...allVehiclesForCurrentLead,
          ...currentVehicles,
        ];

        // If there are multiple vehicles, create additional entries
        if (allVehiclesToSave.length > 1) {
          for (let i = 1; i < allVehiclesToSave.length; i++) {
            const v = allVehiclesToSave[i];
            if (v.variant && v.quantity > 0) {
              const vehiclePayload = {
                brand_id: parseInt(v.variant.brand_id, 10),
                variant_id: parseInt(v.variant.id, 10),
                color_id: v.color?.id || null,
                color_name: v.color?.name || null,
                color_code: v.color?.color_code || null,
                area_id: selectedArea.id,
                city_id: selectedCityId,
                quantity: v.quantity || 1,
                price: v.price || 0,
                subtotal: (v.price || 0) * (v.quantity || 1),
                status: action === "save_draft" ? "Draft" : "Open",
                lead_id: newLeadId,
              };

              console.log("Adding additional vehicle:", vehiclePayload);

              try {
                await axios.post(
                  `${API_BASE}/leads/${newLeadId}/vehicles`,
                  vehiclePayload,
                  {
                    headers: getAuthHeaders(),
                  }
                );
              } catch (vehicleErr) {
                console.error(
                  `Error adding vehicle ${i}:`,
                  vehicleErr.response?.data || vehicleErr.message
                );
              }
            }
          }
        }

        const successMessage = assignedDealerId
          ? `Lead #${newLeadId} created successfully! Dealer: ${assignedDealerName}`
          : `Lead #${newLeadId} created successfully!`;

        toast.success(successMessage, {
          duration: 4000,
          icon: "✅",
          style: {
            borderRadius: "10px",
            background: "#10b981",
            color: "#fff",
          },
        });

        if (action === "submit") {
          // Clear ALL localStorage except authToken
          clearLocalStorageForSubmit();

          navigate("/leads/open", {
            state: {
              recentLead: data.lead,
              allLeads: updatedVehicles,
              submittedVariant: mainVehicle.variant,
              submittedLeadId: newLeadId,
              submittedColor: mainVehicle.color,
              assignedDealer: assignedDealerId,
              assignedDistributor: assignedDistributorId,
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

  // CLEAR ALL LOCALSTORAGE EXCEPT AUTH TOKEN
  const clearLocalStorageForSubmit = () => {
    const authToken = localStorage.getItem("authToken");

    // Safety: If no token found, DO NOT clear anything
    if (!authToken) {
      console.warn(
        "Auth token missing — localStorage not cleared to avoid logout."
      );
      return;
    }

    localStorage.clear();
    localStorage.setItem("authToken", authToken);

    setStoredLeads([]);
    setAllVehiclesForCurrentLead([]);
  };

  // FIXED SAVE DRAFT FUNCTION - Clears localStorage
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

    const currentUserId = getCurrentDealerId();
    const mainVehicle =
      currentVehicles.length > 0
        ? currentVehicles[0]
        : allVehiclesForCurrentLead[0];

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
      vehicle_qty: calculateTotalQuantity,
      current_vehicle_qty: mainVehicle.quantity || 1,
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
    };

    try {
      const { data } = await axios.post(`${API_BASE}/leads`, payload, {
        headers: getAuthHeaders(),
      });
      if (data?.lead?.id) {
        const newLeadId = data.lead.id;
        setLeadId(newLeadId);

        // Combine all vehicles for draft
        const updatedVehicles = [
          ...allVehiclesForCurrentLead.map((v) => ({
            ...v,
            status: "Draft",
            lead_id: newLeadId,
          })),
          ...currentVehicles.map((v) => ({
            ...v,
            lead_id: newLeadId,
            status: "Draft",
          })),
        ];

        // Clear localStorage except auth token
        clearLocalStorageForSubmit();

        toast.success("Draft saved successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Draft failed.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
    }
  };

  // FIXED ADD ANOTHER VEHICLE - Disables customer details
  const addNewVehicle = async () => {
    try {
      // Check if customer details are filled
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

      // Save current selections to localStorage
      const allVehiclesToSave = [
        ...allVehiclesForCurrentLead,
        ...currentVehicles,
      ];
      localStorage.setItem(
        "allVehiclesForCurrentLead",
        JSON.stringify(allVehiclesToSave)
      );

      // Save customer data for continuity
      const customerDataToStore = {
        customer_name: formData.customerName,
        phone_no: formData.phoneNumber,
        location: formData.customerLocation,
        area: formData.customerArea,
        purchase_date: formData.purchaseDate,
        payment_mode: formData.paymentMode,
        quantity: formData.quantity,
        notes: formData.notes,
        lead_id: leadId,
        timestamp: Date.now(),
        area_id: selectedAreaId,
        city_id: selectedCityId,
        existingVehicles: allVehiclesToSave,
        // Mark that we're adding another vehicle
        isAddingAnotherVehicle: true,
      };

      localStorage.setItem(
        "existingCustomerData",
        JSON.stringify(customerDataToStore)
      );

      // Navigate to generate new vehicle
      navigate("/leads/generate", {
        state: {
          isAddingAnotherVehicle: true,
          leadId: leadId,
          customerData: customerDataToStore,
          existingVehicles: allVehiclesToSave,
          // Pass current form data to lock fields
          lockCustomerDetails: true,
        },
        replace: true,
      });
    } catch (err) {
      console.error("Error adding new vehicle:", err);
      setErrorMessage("Failed to add new vehicle. Please try again.");
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  // Location handling functions
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
      } else {
        setLocations([]);
        setShowLocationDropdown(false);
      }
    } catch (err) {
      console.error("Error fetching locations:", err);
      setLocations([]);
      setShowLocationDropdown(false);
    } finally {
      setLoadingLocations(false);
    }
  };

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
        if (response.data.is_dealer_assigned) {
          toast.success(
            `Showing your assigned areas for ${response.data.city_name}`
          );
        }
      } else {
        setDealerAssignedAreas([]);
        setShowAreaDropdown(false);
      }
    } catch (err) {
      console.error("Error fetching areas:", err);
      setDealerAssignedAreas([]);
      setShowAreaDropdown(false);
    } finally {
      setLoadingDealerAreas(false);
    }
  };

  const handleLocationSearchChange = (e) => {
    const value = e.target.value;
    setLocationSearchText(value);
    if (value.trim().length >= 2) {
      setShowLocationDropdown(true);
      fetchLocations(value);
    } else {
      setShowLocationDropdown(false);
      setLocations([]);
    }
  };

  const handleLocationSelect = (location) => {
    setFormData((prev) => ({
      ...prev,
      customerLocation: location.city_name || location.name,
      customerArea: "",
    }));
    setLocationSearchText(location.city_name || location.name);
    setSelectedCityId(location.id);
    setShowLocationDropdown(false);
    setLocations([]);
    setAssignedDealerId(null);
    setAssignedDistributorId(null);
    setAssignedDealerName("");
    setAssignedDistributorName("");
    fetchAreasForCity(location.id, location.city_name || location.name);
  };

  const handleAreaSelect = (area) => {
    setFormData((prev) => ({ ...prev, customerArea: area.name }));
    setSelectedAreaId(area.id);
    setShowAreaDropdown(false);
    if (area.id && selectedCityId) {
      fetchDealerDistributorMapping(area.id, selectedCityId);
    }
  };

  const handleChange = (e) => {
    // If adding another vehicle, only allow date field to be changed
    if (isAddingAnotherVehicle) {
      const fieldName = e.target.id || e.target.name;
      const { id, name, value } = e.target;
      setFormData((prev) => ({ ...prev, [id || name]: value }));
      setErrorMessage(null);
      return;
    }

    const { id, name, value } = e.target;
    setFormData((prev) => ({ ...prev, [id || name]: value }));
    setErrorMessage(null);
  };

  const handleCheckboxChange = (e) => {
    setUseSameCustomerDetails(e.target.checked);
  };

  // Use effects
  useEffect(() => {
    // Load existing customer data if adding another vehicle
    const storedCustomerData = localStorage.getItem("existingCustomerData");

    if (isAddingAnotherVehicle && storedCustomerData) {
      try {
        const customerData = JSON.parse(storedCustomerData);
        const isRecent =
          new Date().getTime() - customerData.timestamp < 30 * 60 * 1000; // 30 minutes

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

          setFormData((prev) => ({
            ...prev,
            customerName: customerData.customer_name || "",
            phoneNumber: customerData.phone_no || "",
            customerLocation: customerData.location || "",
            customerArea: customerData.area || "",
            purchaseDate: formattedDate,
            paymentMode: customerData.payment_mode || "cash",
            quantity: customerData.quantity || 1,
            notes: customerData.notes || "",
          }));

          setLocationSearchText(customerData.location || "");
          setSelectedCityId(customerData.city_id || null);
          setSelectedAreaId(customerData.area_id || null);

          if (customerData.lead_id) {
            setLeadId(customerData.lead_id);
            localStorage.setItem("leadId", customerData.lead_id);
          }

          // Load existing vehicles
          if (customerData.existingVehicles) {
            setAllVehiclesForCurrentLead(customerData.existingVehicles);
            localStorage.setItem(
              "allVehiclesForCurrentLead",
              JSON.stringify(customerData.existingVehicles)
            );
          }
        }
      } catch (err) {
        console.error("Error loading customer data:", err);
      }
    }

    // Load existing vehicles from localStorage
    const savedVehicles = localStorage.getItem("allVehiclesForCurrentLead");
    if (savedVehicles) {
      try {
        const parsedVehicles = JSON.parse(savedVehicles);
        if (Array.isArray(parsedVehicles) && parsedVehicles.length > 0) {
          setAllVehiclesForCurrentLead(parsedVehicles);
        }
      } catch (err) {
        console.error("Error parsing saved vehicles:", err);
      }
    }

    // Clean up old data if not adding another vehicle
    if (!isAddingAnotherVehicle) {
      localStorage.removeItem("leadId");
      localStorage.removeItem("draftLead");
      setLeadId(null);
      setLeadDetails(null);
      setSelectedCityId(null);
    }

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
  }, [isAddingAnotherVehicle]);

  useEffect(() => {
    // Update quantity in form data
    setFormData((prev) => ({
      ...prev,
      quantity: totalQuantity || quantity || 1,
    }));
  }, [totalQuantity, quantity]);

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
      // Dealer areas fetch logic
      const fetchDealerAreas = async () => {
        try {
          setLoadingDealerAreas(true);
          const dealerId = getCurrentDealerId();
          const response = await axios.get(
            `${API_BASE}/areas/dealer-areas/${selectedCityId}`,
            {
              headers: getAuthHeaders(),
              params: { dealer_id: dealerId },
            }
          );

          if (response.data.success) {
            setDealerAssignedAreas(response.data.data);
            setShowAreaDropdown(response.data.data.length > 0);
          } else {
            setDealerAssignedAreas([]);
            setShowAreaDropdown(false);
          }
        } catch (err) {
          console.error("Error fetching areas:", err);
          setDealerAssignedAreas([]);
          setShowAreaDropdown(false);
        } finally {
          setLoadingDealerAreas(false);
        }
      };

      if (selectedCityId) {
        fetchDealerAreas();
      }
    } else {
      setDealerAssignedAreas([]);
      setShowAreaDropdown(false);
    }
  }, [formData.customerLocation, selectedCityId]);

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
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">
              Vehicle Quantity Summary
            </h4>
            <div className="text-sm text-gray-600">
              <p>
                • Saved Vehicles:{" "}
                <span className="font-medium">{savedCount} units</span>
              </p>
              <p>
                • Current Selection:{" "}
                <span className="font-medium">{currentTotal} units</span>
              </p>
              {isAddingAnotherVehicle && (
                <p className="text-blue-600 text-xs mt-1">
                  🔒 Customer details locked (adding another vehicle)
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-blue-700">
              {grandTotal}{" "}
              <span className="text-sm font-normal">Total Units</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">
              All vehicles active
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="m-4">
      <Stepper step={3} />

      {showVehiclePopup && selectedVehicleForPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="bg-[#0f66af] text-white px-6 py-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Vehicle Details</h3>
                <button
                  onClick={() => setShowVehiclePopup(false)}
                  className="text-white hover:text-gray-200 transition-colors p-1"
                >
                  <svg
                    className="w-6 h-6"
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
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <p className="text-center text-gray-600">
                Vehicle details would appear here
              </p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="text-red-600 font-semibold mb-4 text-sm sm:text-base">
          {errorMessage}
        </p>
      )}

      <div className="page-header flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-semibold">
          New Lead Information
        </h3>
      </div>

      {renderQuantitySummary()}

      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 text-gray-700 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-200 transition-colors flex items-center"
          >
            ← Back
          </button>
        </div>

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
                className={`w-full border p-2.5 rounded-lg text-sm sm:text-base `}
                required
                // disabled={isAddingAnotherVehicle}
                // readOnly={isAddingAnotherVehicle}
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
                className={`w-full border p-2.5 rounded-lg text-sm sm:text-base ${
                  isAddingAnotherVehicle ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                required
                pattern="\d{10}"
                disabled={isAddingAnotherVehicle}
                readOnly={isAddingAnotherVehicle}
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
                  onFocus={() =>
                    locationSearchText.length >= 2 &&
                    setShowLocationDropdown(true)
                  }
                  placeholder="Type city name (e.g., Pune, Mumbai)"
                  className="w-full border border-gray-300 p-2.5 rounded-lg pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {loadingLocations ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <svg
                      className="h-4 w-4 text-gray-400"
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
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {locations.length > 0 ? (
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative area-select-container">
                <label
                  htmlFor="customerArea"
                  className="block font-medium mb-1 text-sm sm:text-base"
                >
                  Area <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-xs ml-2">
                    {getCurrentDealerId() ? "(Dealer Assigned)" : "(All Areas)"}
                  </span>
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
                        ? "Select area"
                        : "Select a city first"
                    }
                    className={`w-full border border-gray-300 p-2.5 rounded-lg pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      !formData.customerLocation
                        ? "bg-gray-100 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    readOnly
                    disabled={!formData.customerLocation}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {loadingDealerAreas ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    ) : (
                      <svg
                        className="h-4 w-4 text-gray-400"
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

              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Assigned Dealer
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={assignedDealerName || "No dealer assigned"}
                    readOnly
                    className={`w-full border p-2.5 rounded-lg text-sm sm:text-base ${
                      assignedDealerId
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                    }`}
                    placeholder="Dealer will be auto-assigned based on area"
                  />
                  {loadingDealerMapping && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {assignedDealerId && !loadingDealerMapping && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
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
                min={new Date().toISOString().split("T")[0]}
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
                    disabled={isAddingAnotherVehicle}
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
                    disabled={isAddingAnotherVehicle}
                  />{" "}
                  Finance
                </label>
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1 text-sm sm:text-base">
                Selected Quantity
              </label>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div>
                  <span className="text-lg font-bold text-gray-800">
                    {formData.quantity} units
                  </span>
                  <div className="text-sm text-gray-600 mt-1">
                    All units are active
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">
                    Total across all vehicles:
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {getTotalDisplayQuantity()} units
                  </div>
                </div>
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

        {storedLeads.length > 0 && !isAddingAnotherVehicle && (
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
