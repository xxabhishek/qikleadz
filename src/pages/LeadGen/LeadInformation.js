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
//     isAddingAnotherVehicle = false,
//     existingVehicles = [],
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
//   const [allVehiclesForCurrentLead, setAllVehiclesForCurrentLead] = useState(
//     () => {
//       // Initialize with existing vehicles from localStorage or location state
//       const savedVehicles = localStorage.getItem("allVehiclesForCurrentLead");
//       if (savedVehicles) {
//         try {
//           const parsed = JSON.parse(savedVehicles);
//           return Array.isArray(parsed) ? parsed : [];
//         } catch (err) {
//           console.error("Error parsing saved vehicles:", err);
//           return existingVehicles || [];
//         }
//       }
//       return existingVehicles || [];
//     }
//   );

//   const [selectedCityId, setSelectedCityId] = useState(null);

//   // Current vehicles from color selections (current session)
//   const currentVehicles = useMemo(() => {
//     return Object.entries(colorSelections)
//       .filter(([_, q]) => q > 0)
//       .map(([idStr, q]) => {
//         const colorId = parseInt(idStr);
//         const color = colors.find((c) => c.id === colorId);
//         return {
//           variant,
//           color,
//           quantity: q,
//           price: color?.price || 0,
//           id: `current-${Date.now()}-${colorId}`,
//           isCurrent: true,
//           subtotal: (color?.price || 0) * q,
//         };
//       });
//   }, [colorSelections, colors, variant]);

//   // Calculate total price across all vehicles
//   const calculateTotalPrice = useMemo(() => {
//     return [...allVehiclesForCurrentLead, ...currentVehicles].reduce(
//       (total, v) => {
//         const vehiclePrice = v.subtotal || v.price * (v.quantity || 1);
//         return total + parseFloat(vehiclePrice || 0);
//       },
//       0
//     );
//   }, [allVehiclesForCurrentLead, currentVehicles]);

//   const API_BASE = "http://192.168.1.38:8000/api";

//   const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   // Calculate total quantity
//   const calculateTotalQuantity = useMemo(() => {
//     const savedQuantity = allVehiclesForCurrentLead.reduce(
//       (total, v) => total + (v.quantity || 1),
//       0
//     );
//     const currentTotal = currentVehicles.reduce(
//       (total, v) => total + v.quantity,
//       0
//     );
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

//   // Quantity handlers for vehicle cards
// const handleVehicleQuantityChange = (vehicleId, newQuantity) => {
//   const quantity = Math.max(0, newQuantity);

//   if (quantity === 0) {
//     // Remove vehicle if quantity is 0
//     const updatedVehicles = allVehiclesForCurrentLead.filter(v => v.id !== vehicleId);
//     setAllVehiclesForCurrentLead(updatedVehicles);
//     localStorage.setItem("allVehiclesForCurrentLead", JSON.stringify(updatedVehicles));
//   } else {
//     // Update quantity
//     const updatedVehicles = allVehiclesForCurrentLead.map(v =>
//       v.id === vehicleId ? { ...v, quantity, subtotal: (v.price || 0) * quantity } : v
//     );
//     setAllVehiclesForCurrentLead(updatedVehicles);
//     localStorage.setItem("allVehiclesForCurrentLead", JSON.stringify(updatedVehicles));
//   }
// };

// const handleIncreaseQuantity = (vehicleId, currentQuantity) => {
//   handleVehicleQuantityChange(vehicleId, currentQuantity + 1);
// };

// const handleDecreaseQuantity = (vehicleId, currentQuantity) => {
//   handleVehicleQuantityChange(vehicleId, currentQuantity - 1);
// };

// // For current vehicles (from color selections), you'll need to update them differently
// const handleCurrentVehicleQuantityChange = (colorId, newQuantity) => {
//   // This would need to be handled by updating the parent state
//   // For now, we'll show a toast that current selection can't be modified
//   toast("To modify current vehicle selection, please go back to vehicle selection page");
// };
//   // Vehicle card rendering
//   const renderVehicleCard = (vehicle, index) => {
//   if (!vehicle || !vehicle.variant) return null;
//   const color = vehicle.color;
//   const mainPhoto = getVehicleImage(vehicle.variant, color);
//   const vehicleVariant = vehicle.variant;
//   const basicPrice = getVehiclePrice(vehicleVariant, color);
//   const vehicleQuantity = vehicle.quantity || 1;
//   const totalBasicPrice = parseFloat(basicPrice) * vehicleQuantity;

//   return (
//     <div
//       key={`${vehicle.id || index}-${vehicle.isCurrent ? "current" : "saved"}`}
//       className={`bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-all ${
//         vehicle.isCurrent ? "border-blue-500 border-2" : "border-gray-200"
//       }`}
//     >
//       <div className="flex items-start justify-between">
//         <div className="flex-1 min-w-0">
//           <div className="flex justify-between items-start mb-2">
//             <h4 className="font-semibold text-gray-800 text-sm truncate">
//               {vehicle.isCurrent ? "Current Selection" : `Vehicle ${index + 1}`}
//             </h4>
//             {vehicle.isCurrent && (
//               <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
//                 New
//               </span>
//             )}
//           </div>

//           {/* Vehicle Details */}
//           <div className="space-y-2 text-xs">
//             <p className="text-gray-600 truncate">
//               <span className="font-medium">Variant:</span> {vehicleVariant.name}
//             </p>

//             {/* Color Display */}
//             {color && (
//               <p className="text-gray-600 truncate flex items-center gap-2">
//                 <span className="font-medium">Color:</span>
//                 <span
//                   className="w-5 h-5 rounded-full border border-gray-400 shadow"
//                   style={{ backgroundColor: color.color_code }}
//                   title={color.name}
//                 ></span>
//                 <span className="text-xs">{color.name}</span>
//               </p>
//             )}

//             {/* Quantity Display with +/- controls */}
//             <div className="flex items-center justify-between">
//               <span className="font-medium text-gray-600">Quantity:</span>
//               <div className="flex items-center">
//                 {vehicle.isCurrent ? (
//                   // Current vehicles from color selections - read only
//                   <span className="px-2 py-1 min-w-8 text-center font-medium bg-gray-100 rounded">
//                     {vehicleQuantity}
//                   </span>
//                 ) : (
//                   // Saved vehicles - editable quantity
//                   <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
//                     <button
//                       type="button"
//                       onClick={() => handleDecreaseQuantity(vehicle.id, vehicleQuantity)}
//                       disabled={vehicleQuantity <= 1}
//                       className="bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
//                       </svg>
//                     </button>

//                     <input
//                       type="number"
//                       className="w-12 h-8 text-center border-x border-gray-300 text-sm font-medium"
//                       min="1"
//                       value={vehicleQuantity}
//                       onChange={(e) => handleVehicleQuantityChange(vehicle.id, parseInt(e.target.value) || 1)}
//                     />

//                     <button
//                       type="button"
//                       onClick={() => handleIncreaseQuantity(vehicle.id, vehicleQuantity)}
//                       className="bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center transition-colors"
//                     >
//                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//                       </svg>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Price Display */}
//             <div className="space-y-1 mt-2">
//               {basicPrice > 0 && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600 font-medium">Price:</span>
//                   <div className="text-right">
//                     <p className="text-green-600 font-semibold text-sm">
//                       ${parseFloat(basicPrice).toLocaleString()}
//                     </p>
//                     {vehicleQuantity > 1 && (
//                       <p className="text-green-500 text-xs">
//                         Total: ${totalBasicPrice.toLocaleString()}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {mainPhoto && (
//           <div className="ml-3 flex-shrink-0">
//             <img
//               src={`${API_BASE.replace("/api", "")}/uploads/coverPhotos/${mainPhoto}`}
//               alt={vehicleVariant.name}
//               className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border"
//               onError={(e) => {
//                 e.target.src = "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
//               }}
//             />
//           </div>
//         )}
//       </div>

//       {/* Remove button for saved vehicles */}
//       {!vehicle.isCurrent && (
//         <div className="mt-3 flex justify-end">
//           <button
//             type="button"
//             onClick={() => handleVehicleQuantityChange(vehicle.id, 0)}
//             className="text-red-600 hover:text-red-800 text-xs font-medium flex items-center gap-1"
//           >
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//             Remove Vehicle
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// const renderCompactVehicleCard = (vehicle, index) => {
//   if (!vehicle || !vehicle.variant) return null;
//   const color = vehicle.color;
//   const mainPhoto = getVehicleImage(vehicle.variant, color);
//   const vehicleVariant = vehicle.variant;
//   const vehiclePrice = getVehiclePrice(vehicleVariant, color);
//   const vehicleQuantity = vehicle.quantity || 1;

//   return (
//     <div
//       key={`${vehicle.id || index}-${vehicle.isCurrent ? "current" : "saved"}`}
//       className={`bg-white rounded-lg border p-2 shadow-sm ${
//         vehicle.isCurrent ? "border-blue-500 border-2" : "border-gray-200"
//       }`}
//     >
//       <div className="flex items-center space-x-2">
//         {mainPhoto && (
//           <div className="flex-shrink-0">
//             <img
//               src={`${API_BASE.replace("/api", "")}/uploads/coverPhotos/${mainPhoto}`}
//               alt={vehicleVariant.name}
//               className="w-12 h-12 object-cover rounded border"
//               onError={(e) => {
//                 e.target.src = "https://via.placeholder.com/48x48/f3f4f6/6b7280?text=No+Image";
//               }}
//             />
//           </div>
//         )}

//         <div className="flex-1 min-w-0">
//           <div className="flex items-start justify-between">
//             <div className="flex-1 min-w-0">
//               <div className="flex justify-between items-start mb-1">
//                 <p className="font-medium text-gray-800 text-sm truncate">
//                   {vehicleVariant.name}
//                 </p>

//               </div>

//               {/* Color Display */}
//               {color && (
//                 <p className="text-xs text-gray-600 truncate flex items-center gap-1">
//                   <span
//                     className="w-3 h-3 rounded-full border border-gray-300"
//                     style={{ backgroundColor: color.color_code }}
//                   ></span>
//                   {color.name}
//                 </p>
//               )}

//               <p className="text-xs text-gray-600 truncate">
//                 {brands.find(b => b.id === vehicleVariant.brand_id)?.name || "N/A"} •
//                 {ccs.find(c => c.id === vehicleVariant.cc_id)?.name || "N/A"} •
//                 {fuelTypes.find(f => f.id === vehicleVariant.fuel_type_id)?.name || "N/A"}
//               </p>

//               {/* Quantity with +/- controls */}
//               <div className="flex items-center justify-between my-1">
//                 <span className="text-xs text-gray-600 font-medium">Qty:</span>
//                 {vehicle.isCurrent ? (
//                   <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium">
//                     {vehicleQuantity}
//                   </span>
//                 ) : (
//                   <div className="flex items-center border border-gray-300 rounded overflow-hidden">
//                     <button
//                       type="button"
//                       onClick={() => handleDecreaseQuantity(vehicle.id, vehicleQuantity)}
//                       disabled={vehicleQuantity <= 1}
//                       className="bg-gray-100 hover:bg-gray-200 w-6 h-6 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
//                       </svg>
//                     </button>

//                     <span className="w-6 h-6 text-center text-xs font-medium flex items-center justify-center">
//                       {vehicleQuantity}
//                     </span>

//                     <button
//                       type="button"
//                       onClick={() => handleIncreaseQuantity(vehicle.id, vehicleQuantity)}
//                       className="bg-gray-100 hover:bg-gray-200 w-6 h-6 flex items-center justify-center transition-colors"
//                     >
//                       <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//                       </svg>
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Price Display */}
//               {vehiclePrice > 0 ? (
//                 <div>
//                   <p className="text-xs text-green-600 font-medium truncate">
//                     ${vehiclePrice.toLocaleString()}
//                     <small className="text-black ml-1">*On-Road Price</small>
//                   </p>
//                   {vehicleQuantity > 1 && (
//                     <p className="text-xs text-green-700 font-semibold truncate">
//                       Total: ${(vehiclePrice * vehicleQuantity).toLocaleString()}*
//                     </p>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-xs text-gray-500 truncate">Price on request</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Remove button for saved vehicles in compact view */}
//       {!vehicle.isCurrent && (
//         <div className="mt-2 flex justify-end">
//           <button
//             type="button"
//             onClick={() => handleVehicleQuantityChange(vehicle.id, 0)}
//             className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
//           >
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//             Remove
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

//   // Selected vehicles preview
//   const renderSelectedVehiclesPreview = () => {
//     const allPreviewVehicles = [
//       ...allVehiclesForCurrentLead,
//       ...currentVehicles,
//     ];
//     if (allPreviewVehicles.length === 0) return null;
//     return (
//       <div className="mb-6">
//         <div className="block sm:hidden space-y-2">
//           {allPreviewVehicles
//             .slice(0, 3)
//             .map((vehicle, index) => renderCompactVehicleCard(vehicle, index))}
//           {allPreviewVehicles.length > 3 && (
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
//                 +{allPreviewVehicles.length - 3} more vehicles
//               </p>
//               <p className="text-gray-500 text-xs mt-0.5">Tap to view all</p>
//             </div>
//           )}
//         </div>
//         <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
//           {allPreviewVehicles
//             .slice(0, 3)
//             .map((vehicle, index) => renderVehicleCard(vehicle, index))}
//           {allPreviewVehicles.length > 3 && (
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
//                 +{allPreviewVehicles.length - 3} more vehicles
//               </p>
//               <p className="text-gray-500 text-xs mt-1">Click to view all</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Form handling
//   const validateForm = () => {
//     const phoneStr = String(formData.phoneNumber || "").trim();
//     if (!formData.customerName?.trim()) return "Customer name is required.";
//     if (!/^\d{10}$/.test(phoneStr))
//       return "Valid 10-digit phone number required.";
//     if (!formData.customerLocation?.trim()) return "Location is required.";
//     const totalQty = calculateTotalQuantity;
//     if (totalQty < 1) return "Total quantity must be at least 1.";
//     if (
//       !variant &&
//       allVehiclesForCurrentLead.length === 0 &&
//       currentVehicles.length === 0
//     ) {
//       return "Please select at least one vehicle variant.";
//     }
//     if (!assignedDealerId)
//       return "No dealer assigned for the selected area. Please contact administrator.";
//     return null;
//   };

//   const handleSubmit = async (action = "submit") => {
//     const allVehiclesToSave = [
//       ...allVehiclesForCurrentLead,
//       ...currentVehicles,
//     ];

//     const validationError = validateForm();
//     if (validationError) {
//       setErrorMessage(validationError);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }

//     if (allVehiclesToSave.length === 0) {
//       setErrorMessage("No vehicles selected.");
//       return;
//     }

//     setIsSubmitting(true);
//     setErrorMessage(null);

//     try {
//       const selectedArea = dealerAssignedAreas.find(
//         (area) => area.name === formData.customerArea?.trim()
//       );

//       if (!selectedArea || !selectedCityId) {
//         throw new Error("Please select valid area and city.");
//       }

//       const finalLocation = formData.customerArea
//         ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
//         : formData.customerLocation.trim();

//       const currentUserId = getCurrentDealerId();
//       const mainVehicle = allVehiclesToSave[0];

//       if (!mainVehicle || !mainVehicle.variant) {
//         throw new Error("No valid vehicle selected.");
//       }

//       // Prepare payload for lead creation
//       const payload = {
//         customer_name: formData.customerName.trim(),
//         phone_no: (formData.phoneNumber || "").toString().trim(),
//         location: finalLocation,
//         area: formData.customerArea?.trim() || null,
//         city_id: selectedCityId,
//         area_id: selectedArea.id,
//         executive_id: currentUserId,
//         tentative_purchase_date: formData.purchaseDate || null,
//         unit_price: mainVehicle.price || 0,
//         total_price:
//           totalPrice || mainVehicle.price * (mainVehicle.quantity || 1),
//         vehicle_qty: calculateTotalQuantity,
//         current_vehicle_qty: mainVehicle.quantity || 1,
//         payment_mode: formData.paymentMode,
//         additional_note: formData.notes?.trim() || null,
//         brand_id: parseInt(mainVehicle.variant.brand_id, 10),
//         variant_id: parseInt(mainVehicle.variant.id, 10),
//         lead_id: leadId || null,
//         status: action === "save_draft" ? "Draft" : "Open",
//         color_id: mainVehicle.color?.id || null,
//         color_name: mainVehicle.color?.name || null,
//         color_code: mainVehicle.color?.color_code || null,
//         dealer_id: assignedDealerId,
//         distributor_id: assignedDistributorId,
//         vehicles: allVehiclesToSave.map((v) => ({
//           brand_id: parseInt(v.variant.brand_id, 10),
//           variant_id: parseInt(v.variant.id, 10),
//           color_id: v.color?.id || null,
//           quantity: v.quantity || 1,
//         })),
//       };

//       console.log("Submitting lead payload:", payload);

//       const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//         headers: getAuthHeaders(),
//       });

//       if (data?.success) {
//         const newLeadId = data.lead_id || data.lead?.id;

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

//         // CRITICAL: Clear ALL localStorage items for this lead
//         clearAllLocalStorageForLead();

//         // Reset all form states
//         resetFormState();

//         if (action === "submit") {
//           navigate("/leads/open", {
//             state: {
//               recentLead: data.lead,
//               submittedVariant: mainVehicle.variant,
//               submittedLeadId: newLeadId,
//               submittedColor: mainVehicle.color,
//               assignedDealer: assignedDealerId,
//               assignedDistributor: assignedDistributorId,
//             },
//           });
//         } else {
//           // For draft, navigate to dashboard
//           toast.success("Draft saved successfully!");
//           navigate("/dashboard");
//         }
//       }
//     } catch (err) {
//       const msg =
//         err.response?.data?.message || err.message || "Submission failed.";
//       setErrorMessage(msg);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       toast.error(msg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const clearAllLocalStorageForLead = () => {
//     console.log("Clearing ALL localStorage for lead...");

//     // Save essential items that should NOT be cleared
//     const authToken = localStorage.getItem("authToken");
//     const userData = localStorage.getItem("userData");
//     const userInfo = localStorage.getItem("userInfo");
//     const currentUser = localStorage.getItem("currentUser");
//     const authUser = localStorage.getItem("authUser");

//     // List of ALL lead-related items to clear
//     const leadItemsToClear = [
//       "leadId",
//       "draftLead",
//       "allVehiclesForCurrentLead",
//       "existingCustomerData",
//       "recentSubmittedLead",
//       "draftLeadData",
//       "customerFormData",
//       "selectedVehicles",
//       "vehicleSelections",
//       "colorSelections",
//       "variantSelections",
//       "currentVehicles",
//       "vehicleData",
//       "leadVehicles",
//       "customerData",
//       "formData",
//       "storedLeads",
//       "selectedAreaId",
//       "selectedCityId",
//       "locationSearchText",
//       "isAddingAnotherVehicle",
//       "lockCustomerDetails",
//       "existingVehicles",
//       "variant",
//       "colors",
//       "colorSelections",
//       "totalQuantity",
//       "totalPrice",
//       "galleries",
//       "brands",
//       "fuelTypes",
//       "ccs",
//       "quantity",
//     ];

//     // Clear each item
//     leadItemsToClear.forEach((item) => {
//       if (localStorage.getItem(item)) {
//         localStorage.removeItem(item);
//         console.log(`✓ Removed: ${item}`);
//       }
//     });

//     // Also clear any items with "lead" or "vehicle" in the name
//     const allKeys = Object.keys(localStorage);
//     allKeys.forEach((key) => {
//       if (
//         key.toLowerCase().includes("lead") ||
//         key.toLowerCase().includes("vehicle") ||
//         key.toLowerCase().includes("vehicles") ||
//         key.toLowerCase().includes("color") ||
//         key.toLowerCase().includes("variant") ||
//         key.toLowerCase().includes("selection") ||
//         key.toLowerCase().includes("customer") ||
//         key.toLowerCase().includes("form")
//       ) {
//         // Skip essential auth/user items
//         if (
//           ![
//             "authToken",
//             "userData",
//             "userInfo",
//             "currentUser",
//             "authUser",
//           ].includes(key)
//         ) {
//           localStorage.removeItem(key);
//           console.log(`✓ Removed (pattern): ${key}`);
//         }
//       }
//     });

//     // Restore essential auth/user items
//     if (authToken) localStorage.setItem("authToken", authToken);
//     if (userData) localStorage.setItem("userData", userData);
//     if (userInfo) localStorage.setItem("userInfo", userInfo);
//     if (currentUser) localStorage.setItem("currentUser", currentUser);
//     if (authUser) localStorage.setItem("authUser", authUser);

//     console.log("✅ ALL lead-related localStorage cleared successfully!");
//   };

//   // CLEAR ALL LOCALSTORAGE EXCEPT AUTH TOKEN
//   const clearAllLocalStorage = () => {
//     const authToken = localStorage.getItem("authToken");
//     const userData = localStorage.getItem("userData");
//     // Safety: If no token found, DO NOT clear anything
//     if (!authToken) {
//       console.warn(
//         "Auth token missing — localStorage not cleared to avoid logout."
//       );
//       return;
//     }
//     // Save auth token and user data first
//     const itemsToSave = {
//       authToken: authToken,
//       userData: userData,
//     };
//     // Clear ALL lead-related items
//     const allLeadItems = [
//       "leadId",
//       "draftLead",
//       "allVehiclesForCurrentLead",
//       "existingCustomerData",
//       "recentSubmittedLead",
//       "draftLeadData",
//       "customerFormData",
//       "selectedVehicles",
//     ];
//     // Clear all lead items
//     allLeadItems.forEach((item) => localStorage.removeItem(item));
//     // Restore auth token and user data
//     if (itemsToSave.authToken) {
//       localStorage.setItem("authToken", itemsToSave.authToken);
//     }
//     if (itemsToSave.userData) {
//       localStorage.setItem("userData", itemsToSave.userData);
//     }
//     console.log("All lead-related localStorage cleared for Submit/Save Draft");
//   };

//   // FIXED SAVE DRAFT FUNCTION - Clears localStorage
//   // const handleSaveDraft = async () => {
//   //   const validationError = validateForm();
//   //   if (validationError) {
//   //     setErrorMessage(validationError);
//   //     return;
//   //   }
//   //   const selectedArea = dealerAssignedAreas.find(
//   //     (area) => area.name === formData.customerArea
//   //   );
//   //   if (!selectedArea || !selectedCityId) {
//   //     setErrorMessage("Please select valid area and city.");
//   //     return;
//   //   }
//   //   const finalLocation = formData.customerArea
//   //     ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
//   //     : formData.customerLocation.trim();
//   //   const currentUserId = getCurrentDealerId();
//   //   const allVehiclesToSave = [
//   //     ...allVehiclesForCurrentLead,
//   //     ...currentVehicles,
//   //   ];
//   //   if (allVehiclesToSave.length === 0) {
//   //     setErrorMessage("No vehicles to save.");
//   //     return;
//   //   }
//   //   const mainVehicle = allVehiclesToSave[0];
//   //   if (!mainVehicle) {
//   //     setErrorMessage("No vehicles to save.");
//   //     return;
//   //   }
//   //   const payload = {
//   //     customer_name: formData.customerName.trim(),
//   //     phone_no: formData.phoneNumber.trim(),
//   //     location: finalLocation || null,
//   //     area: formData.customerArea?.trim() || null,
//   //     city_id: selectedCityId,
//   //     area_id: selectedArea.id,
//   //     executive_id: currentUserId,
//   //     tentative_purchase_date: formData.purchaseDate || null,
//   //     unit_price: mainVehicle.price || 0,
//   //     total_price: calculateTotalPrice,
//   //     vehicle_qty: calculateTotalQuantity,
//   //     current_vehicle_qty: mainVehicle.quantity || 1,
//   //     payment_mode: formData.paymentMode,
//   //     additional_note: formData.notes?.trim() || null,
//   //     brand_id: mainVehicle.variant
//   //       ? parseInt(mainVehicle.variant.brand_id, 10)
//   //       : null,
//   //     variant_id: mainVehicle.variant
//   //       ? parseInt(mainVehicle.variant.id, 10)
//   //       : null,
//   //     lead_id: leadId || null,
//   //     status: "Draft",
//   //     color_id: mainVehicle.color?.id || null,
//   //     color_name: mainVehicle.color?.name || null,
//   //     color_code: mainVehicle.color?.color_code || null,
//   //     dealer_id: assignedDealerId,
//   //     distributor_id: assignedDistributorId,
//   //     vehicles: allVehiclesToSave.map((v) => ({
//   //       brand_id: parseInt(v.variant.brand_id, 10),
//   //       variant_id: parseInt(v.variant.id, 10),
//   //       color_id: v.color?.id || null,
//   //       quantity: v.quantity || 1,
//   //     })),
//   //   };
//   //   try {
//   //     const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//   //       headers: getAuthHeaders(),
//   //     });
//   //     if (data?.lead?.id) {
//   //       // Clear ALL localStorage for draft save
//   //       clearAllLocalStorage();
//   //       // Reset form state
//   //       resetFormState();
//   //       toast.success("Draft saved successfully!");
//   //       navigate("/dashboard");
//   //     }
//   //   } catch (err) {
//   //     const errorMsg = err.response?.data?.message || "Draft failed.";
//   //     setErrorMessage(errorMsg);
//   //     toast.error(errorMsg);
//   //   }
//   // };

//   const handleSaveDraft = async () => {
//     // First validate the form
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

//     const currentUserId = getCurrentDealerId();
//     const allVehiclesToSave = [
//       ...allVehiclesForCurrentLead,
//       ...currentVehicles,
//     ];

//     if (allVehiclesToSave.length === 0) {
//       setErrorMessage("No vehicles to save.");
//       return;
//     }

//     const mainVehicle = allVehiclesToSave[0];
//     if (!mainVehicle) {
//       setErrorMessage("No vehicles to save.");
//       return;
//     }

//     // Prepare payload WITHOUT price fields for draft
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
//       payment_mode: formData.paymentMode,
//       additional_note: formData.notes?.trim() || null,
//       brand_id: mainVehicle.variant
//         ? parseInt(mainVehicle.variant.brand_id, 10)
//         : null,
//       variant_id: mainVehicle.variant
//         ? parseInt(mainVehicle.variant.id, 10)
//         : null,
//       lead_id: leadId || null,
//       status: "Draft",
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

//     console.log("Saving draft with payload:", payload);

//     try {
//       setIsSubmitting(true);
//       setErrorMessage(null);

//       const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//         headers: getAuthHeaders(),
//       });

//       if (data?.success || data?.lead?.id) {
//         const newLeadId = data.lead_id || data.lead?.id;

//         // CRITICAL: Clear ALL localStorage items for this lead (same as handleSubmit)
//         clearAllLocalStorageForLead();

//         // Reset form state
//         resetFormState();

//         toast.success(`Draft saved successfully! Lead #${newLeadId}`);

//         // Navigate to dashboard
//         navigate("/dashboard", {
//           state: {
//             draftSaved: true,
//             leadId: newLeadId,
//           },
//         });
//       } else {
//         throw new Error("No lead ID returned from server");
//       }
//     } catch (err) {
//       const errorMsg = err.response?.data?.message || "Draft save failed.";
//       setErrorMessage(errorMsg);
//       toast.error(errorMsg);
//       console.error("Draft save error:", err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const addNewVehicle = async () => {
//     try {
//       // Check if customer details are filled
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

//       // Find selected area
//       const selectedArea = dealerAssignedAreas.find(
//         (area) => area.name === formData.customerArea
//       );

//       if (!selectedArea || !selectedCityId) {
//         setErrorMessage("Please select valid area and city first.");
//         return;
//       }

//       const finalLocation = formData.customerArea
//         ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
//         : formData.customerLocation.trim();

//       const currentUserId = getCurrentDealerId();

//       // IMPORTANT: Only save CURRENT vehicles (not previously saved ones)
//       const vehiclesToSave = currentVehicles;

//       if (vehiclesToSave.length === 0) {
//         setErrorMessage("Please select at least one vehicle first.");
//         return;
//       }

//       const mainVehicle = vehiclesToSave[0];

//       // Prepare payload for creating a new lead with current vehicles
//       const payload = {
//         customer_name: formData.customerName.trim(),
//         phone_no: formData.phoneNumber.trim(),
//         location: finalLocation || null,
//         area: formData.customerArea?.trim() || null,
//         city_id: selectedCityId,
//         area_id: selectedArea.id,
//         executive_id: currentUserId,
//         tentative_purchase_date: formData.purchaseDate || null,
//         vehicle_qty: calculateTotalQuantity,
//         payment_mode: formData.paymentMode,
//         additional_note: formData.notes?.trim() || null,
//         brand_id: mainVehicle.variant
//           ? parseInt(mainVehicle.variant.brand_id, 10)
//           : null,
//         variant_id: mainVehicle.variant
//           ? parseInt(mainVehicle.variant.id, 10)
//           : null,
//         status: "Draft",
//         color_id: mainVehicle.color?.id || null,
//         dealer_id: assignedDealerId,
//         distributor_id: assignedDistributorId,
//         // Send only current vehicles, not previously saved ones
//         vehicles: vehiclesToSave.map((v) => ({
//           brand_id: parseInt(v.variant.brand_id, 10),
//           variant_id: parseInt(v.variant.id, 10),
//           color_id: v.color?.id || null,
//           quantity: v.quantity || 1,
//         })),
//       };

//       console.log("Saving new lead with vehicles:", payload);

//       const { data } = await axios.post(`${API_BASE}/leads`, payload, {
//         headers: getAuthHeaders(),
//       });

//       if (data?.lead?.id) {
//         const newLeadId = data.lead.id;
//         setLeadId(newLeadId);

//         // Update vehicles with lead_id and save to localStorage
//         const updatedVehicles = vehiclesToSave.map((v, index) => ({
//           ...v,
//           lead_id: newLeadId,
//           id: `${newLeadId}-${index}-${Date.now()}`,
//           dealer_id: assignedDealerId,
//           distributor_id: assignedDistributorId,
//           status: "Draft",
//         }));

//         // Save ONLY current vehicles to localStorage
//         localStorage.setItem(
//           "allVehiclesForCurrentLead",
//           JSON.stringify(updatedVehicles)
//         );

//         // Save customer data for continuity
//         const customerDataToStore = {
//           customer_name: formData.customerName,
//           phone_no: formData.phoneNumber,
//           location: formData.customerLocation,
//           area: formData.customerArea,
//           purchase_date: formData.purchaseDate,
//           payment_mode: formData.paymentMode,
//           quantity: formData.quantity,
//           notes: formData.notes,
//           lead_id: newLeadId,
//           timestamp: Date.now(),
//           area_id: selectedArea.id,
//           city_id: selectedCityId,
//           existingVehicles: updatedVehicles,
//           isAddingAnotherVehicle: true,
//           dealer_id: assignedDealerId,
//           distributor_id: assignedDistributorId,
//           dealer_name: assignedDealerName,
//           distributor_name: assignedDistributorName,
//         };

//         localStorage.setItem(
//           "existingCustomerData",
//           JSON.stringify(customerDataToStore)
//         );

//         // Save lead ID
//         localStorage.setItem("leadId", newLeadId);

//         toast.success("Adding another vehicle.");

//         // Navigate to generate new vehicle
//         navigate("/leads/generate", {
//           state: {
//             isAddingAnotherVehicle: true,
//             leadId: newLeadId,
//             customerData: customerDataToStore,
//             existingVehicles: updatedVehicles,
//             lockCustomerDetails: true,
//             assignedDealerId: assignedDealerId,
//             assignedDistributorId: assignedDistributorId,
//           },
//           replace: true,
//         });
//       } else {
//         throw new Error("Failed to save lead.");
//       }
//     } catch (err) {
//       console.error("Error adding new vehicle:", err);
//       const errorMsg =
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to add new vehicle.";
//       setErrorMessage(errorMsg);
//       setTimeout(() => setErrorMessage(null), 5000);
//     }
//   };

//   const clearOnlyVehiclesFromLocalStorage = () => {
//     // Clear ONLY vehicle-related items
//     const vehicleItems = [
//       "allVehiclesForCurrentLead",
//       "selectedVehicles",
//       "vehicleSelections",
//       "colorSelections",
//       "variantSelections",
//     ];
//     vehicleItems.forEach((item) => localStorage.removeItem(item));
//     console.log(
//       "Only vehicles cleared from localStorage for Add Another Vehicle"
//     );
//   };

//   // Reset form state
//   const resetFormState = () => {
//     console.log("Resetting form state...");

//     // Clear React state
//     setStoredLeads([]);
//     setAllVehiclesForCurrentLead([]);
//     setLeadId(null);
//     setSelectedCityId(null);
//     setSelectedAreaId(null);

//     // Reset form data
//     setFormData({
//       customerName: "",
//       phoneNumber: "",
//       customerLocation: "",
//       customerArea: "",
//       purchaseDate: "",
//       quantity: 1,
//       paymentMode: "cash",
//       notes: "",
//     });

//     // Reset other related states
//     setAssignedDealerId(null);
//     setAssignedDistributorId(null);
//     setAssignedDealerName("");
//     setAssignedDistributorName("");
//     setLocationSearchText("");
//     setUseSameCustomerDetails(false);
//     setErrorMessage(null);

//     // Clear current vehicles
//     // Note: currentVehicles is derived from colorSelections, so clear those from state
//     if (location.state) {
//       // Clear location state
//       navigate(location.pathname, { replace: true, state: {} });
//     }

//     console.log("✅ Form state reset successfully!");
//   };
//   // Location handling functions
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
//     // If adding another vehicle, only allow date field to be changed
//     if (isAddingAnotherVehicle) {
//       const fieldName = e.target.id || e.target.name;
//       const { id, name, value } = e.target;
//       setFormData((prev) => ({ ...prev, [id || name]: value }));
//       setErrorMessage(null);
//       return;
//     }
//     const { id, name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id || name]: value }));
//     setErrorMessage(null);
//   };

//   const handleCheckboxChange = (e) => {
//     setUseSameCustomerDetails(e.target.checked);
//   };

//   // Use effects
//   useEffect(() => {
//     // Load existing customer data if adding another vehicle
//     const storedCustomerData = localStorage.getItem("existingCustomerData");
//     if (isAddingAnotherVehicle && storedCustomerData) {
//       try {
//         const customerData = JSON.parse(storedCustomerData);
//         const isRecent =
//           new Date().getTime() - customerData.timestamp < 30 * 60 * 1000; // 30 minutes
//         if (isRecent) {
//           // Format date properly
//           let formattedDate = "";
//           if (customerData.purchase_date) {
//             if (/^\d{4}-\d{2}-\d{2}$/.test(customerData.purchase_date)) {
//               formattedDate = customerData.purchase_date;
//             } else {
//               const date = new Date(customerData.purchase_date);
//               if (!isNaN(date.getTime())) {
//                 formattedDate = date.toISOString().split("T")[0];
//               }
//             }
//           }
//           setFormData((prev) => ({
//             ...prev,
//             customerName: customerData.customer_name || "",
//             phoneNumber: customerData.phone_no || "",
//             customerLocation: customerData.location || "",
//             customerArea: customerData.area || "",
//             purchaseDate: formattedDate,
//             paymentMode: customerData.payment_mode || "cash",
//             quantity: customerData.quantity || 1,
//             notes: customerData.notes || "",
//           }));
//           setLocationSearchText(customerData.location || "");
//           setSelectedCityId(customerData.city_id || null);
//           setSelectedAreaId(customerData.area_id || null);
//           // Set dealer/distributor info if available
//           if (customerData.dealer_id) {
//             setAssignedDealerId(customerData.dealer_id);
//             setAssignedDistributorId(customerData.distributor_id);
//             setAssignedDealerName(customerData.dealer_name || "");
//             setAssignedDistributorName(customerData.distributor_name || "");
//           }
//           if (customerData.lead_id) {
//             setLeadId(customerData.lead_id);
//             localStorage.setItem("leadId", customerData.lead_id);
//           }
//           // Load existing vehicles - IMPORTANT: This loads vehicles from customerData
//           if (
//             customerData.existingVehicles &&
//             Array.isArray(customerData.existingVehicles)
//           ) {
//             setAllVehiclesForCurrentLead(customerData.existingVehicles);
//             localStorage.setItem(
//               "allVehiclesForCurrentLead",
//               JSON.stringify(customerData.existingVehicles)
//             );
//           }
//         }
//       } catch (err) {
//         console.error("Error loading customer data:", err);
//       }
//     }
//     // Load existing vehicles from localStorage (for regular flow)
//     const savedVehicles = localStorage.getItem("allVehiclesForCurrentLead");
//     if (savedVehicles && !isAddingAnotherVehicle) {
//       try {
//         const parsedVehicles = JSON.parse(savedVehicles);
//         if (Array.isArray(parsedVehicles) && parsedVehicles.length > 0) {
//           setAllVehiclesForCurrentLead(parsedVehicles);
//         }
//       } catch (err) {
//         console.error("Error parsing saved vehicles:", err);
//       }
//     }
//     // Clean up old data if not adding another vehicle
//     if (!isAddingAnotherVehicle) {
//       localStorage.removeItem("leadId");
//       localStorage.removeItem("draftLead");
//       setLeadId(null);
//       setLeadDetails(null);
//       setSelectedCityId(null);
//     }
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
//   }, [isAddingAnotherVehicle]);

//   useEffect(() => {
//     // Update quantity in form data
//     setFormData((prev) => ({
//       ...prev,
//       quantity: totalQuantity || quantity || 1,
//     }));
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
//       // Dealer areas fetch logic
//       const fetchDealerAreas = async () => {
//         try {
//           setLoadingDealerAreas(true);
//           const dealerId = getCurrentDealerId();
//           const response = await axios.get(
//             `${API_BASE}/areas/dealer-areas/${selectedCityId}`,
//             {
//               headers: getAuthHeaders(),
//               params: { dealer_id: dealerId },
//             }
//           );
//           if (response.data.success) {
//             setDealerAssignedAreas(response.data.data);
//             setShowAreaDropdown(response.data.data.length > 0);
//           } else {
//             setDealerAssignedAreas([]);
//             setShowAreaDropdown(false);
//           }
//         } catch (err) {
//           console.error("Error fetching areas:", err);
//           setDealerAssignedAreas([]);
//           setShowAreaDropdown(false);
//         } finally {
//           setLoadingDealerAreas(false);
//         }
//       };
//       if (selectedCityId) {
//         fetchDealerAreas();
//       }
//     } else {
//       setDealerAssignedAreas([]);
//       setShowAreaDropdown(false);
//     }
//   }, [formData.customerLocation, selectedCityId]);

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

//   // Quantity summary
//   const renderQuantitySummary = () => {
//     const savedCount = allVehiclesForCurrentLead.reduce(
//       (total, v) => total + (v.quantity || 1),
//       0
//     );
//     const currentTotal = currentVehicles.reduce(
//       (total, v) => total + v.quantity,
//       0
//     );
//     const grandTotal = calculateTotalQuantity;
//     return (
//       <div className="mb-4 p-4 border border-blue-200 rounded-lg">
//         <div className="flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <h4 className="font-semibold text-gray-800 mb-1">
//               Vehicle Quantity Summary
//             </h4>
//             <div className="text-sm text-gray-600">
//               <p>
//                 • Saved Vehicles:{" "}
//                 <span className="font-medium">{savedCount} units</span>
//               </p>
//               <p>
//                 • Current Selection:{" "}
//                 <span className="font-medium">{currentTotal} units</span>
//               </p>
//               {isAddingAnotherVehicle && (
//                 <p className="text-blue-600 text-xs mt-1">
//                    Customer details locked (adding another vehicle)
//                 </p>
//               )}
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="text-2xl font-bold text-blue-700">
//               {grandTotal}{" "}
//               <span className="text-sm font-normal">Total Units</span>
//             </div>
//             <div className="text-sm text-gray-500 mt-1">
//               All vehicles active
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="m-4">
//       <Stepper step={3} />
//      {showVehiclePopup && selectedVehicleForPopup && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//     <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
//       <div className="bg-[#0f66af] text-white px-6 py-4">
//         <div className="flex justify-between items-center">
//           <h3 className="text-xl font-semibold">Vehicle Details</h3>
//           <button
//             onClick={() => setShowVehiclePopup(false)}
//             className="text-white hover:text-gray-200 transition-colors p-1"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//       </div>
//       <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
//         {selectedVehicleForPopup.vehicle && (
//           <div className="space-y-4">
//             <div className="flex items-start gap-4">
//               {getVehicleImage(selectedVehicleForPopup.vehicle.variant, selectedVehicleForPopup.vehicle.color) && (
//                 <img
//                   src={`${API_BASE.replace("/api", "")}/uploads/coverPhotos/${
//                     getVehicleImage(selectedVehicleForPopup.vehicle.variant, selectedVehicleForPopup.vehicle.color)
//                   }`}
//                   alt={selectedVehicleForPopup.vehicle.variant.name}
//                   className="w-32 h-32 object-cover rounded-lg border"
//                 />
//               )}
//               <div className="flex-1">
//                 <h4 className="text-lg font-bold text-gray-800">
//                   {selectedVehicleForPopup.vehicle.variant.name}
//                 </h4>
//                 {selectedVehicleForPopup.vehicle.color && (
//                   <div className="flex items-center gap-2 mt-2">
//                     <div
//                       className="w-6 h-6 rounded-full border border-gray-400"
//                       style={{ backgroundColor: selectedVehicleForPopup.vehicle.color.color_code }}
//                     ></div>
//                     <span className="text-gray-600">{selectedVehicleForPopup.vehicle.color.name}</span>
//                   </div>
//                 )}

//                 {/* Quantity controls in popup */}
//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Adjust Quantity
//                   </label>
//                   {selectedVehicleForPopup.vehicle.isCurrent ? (
//                     <div className="flex items-center">
//                       <span className="px-4 py-2 bg-gray-100 rounded-md font-medium">
//                         {selectedVehicleForPopup.vehicle.quantity || 1} units
//                       </span>
//                       <span className="ml-3 text-sm text-gray-500">
//                         (Current selection - edit on previous page)
//                       </span>
//                     </div>
//                   ) : (
//                     <div className="flex items-center">
//                       <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
//                         <button
//                           type="button"
//                           onClick={() => handleDecreaseQuantity(
//                             selectedVehicleForPopup.vehicle.id,
//                             selectedVehicleForPopup.vehicle.quantity || 1
//                           )}
//                           disabled={(selectedVehicleForPopup.vehicle.quantity || 1) <= 1}
//                           className="bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
//                           </svg>
//                         </button>

//                         <input
//                           type="number"
//                           className="w-16 h-10 text-center border-x border-gray-300 text-lg font-medium"
//                           min="1"
//                           value={selectedVehicleForPopup.vehicle.quantity || 1}
//                           onChange={(e) => handleVehicleQuantityChange(
//                             selectedVehicleForPopup.vehicle.id,
//                             parseInt(e.target.value) || 1
//                           )}
//                         />

//                         <button
//                           type="button"
//                           onClick={() => handleIncreaseQuantity(
//                             selectedVehicleForPopup.vehicle.id,
//                             selectedVehicleForPopup.vehicle.quantity || 1
//                           )}
//                           className="bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-colors"
//                         >
//                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
//                           </svg>
//                         </button>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={() => {
//                           handleVehicleQuantityChange(selectedVehicleForPopup.vehicle.id, 0);
//                           setShowVehiclePopup(false);
//                         }}
//                         className="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
//                       >
//                         Remove Vehicle
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Price Summary */}
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h5 className="font-medium text-gray-700 mb-2">Price Summary</h5>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-600">Unit Price</p>
//                   <p className="text-lg font-semibold text-green-600">
//                     ${getVehiclePrice(
//                       selectedVehicleForPopup.vehicle.variant,
//                       selectedVehicleForPopup.vehicle.color
//                     ).toLocaleString()}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total</p>
//                   <p className="text-lg font-semibold text-green-700">
//                     ${(
//                       getVehiclePrice(
//                         selectedVehicleForPopup.vehicle.variant,
//                         selectedVehicleForPopup.vehicle.color
//                       ) * (selectedVehicleForPopup.vehicle.quantity || 1)
//                     ).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// )}
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
//                 className={`w-full border p-2.5 rounded-lg text-sm sm:text-base `}
//                 required
//                 // disabled={isAddingAnotherVehicle}
//                 // readOnly={isAddingAnotherVehicle}
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
//                 className={`w-full border p-2.5 rounded-lg text-sm sm:text-base ${
//                   isAddingAnotherVehicle ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//                 required
//                 pattern="\d{10}"
//               />
//             </div>
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
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="relative area-select-container">
//                 <label
//                   htmlFor="customerArea"
//                   className="block font-medium mb-1 text-sm sm:text-base"
//                 >
//                   Area <span className="text-red-500">*</span>
//                   <span className="text-gray-500 text-xs ml-2">
//                     {getCurrentDealerId() ? "(Dealer Assigned)" : "(All Areas)"}
//                   </span>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="customerArea"
//                     value={formData.customerArea}
//                     onChange={handleChange}
//                     onClick={() =>
//                       formData.customerLocation &&
//                       setShowAreaDropdown(!showAreaDropdown)
//                     }
//                     placeholder={
//                       formData.customerLocation
//                         ? "Select area"
//                         : "Select a city first"
//                     }
//                     className={`w-full border border-gray-300 p-2.5 rounded-lg pr-10 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       !formData.customerLocation
//                         ? "bg-gray-100 cursor-not-allowed"
//                         : "cursor-pointer"
//                     }`}
//                     readOnly
//                     disabled={!formData.customerLocation}
//                   />
//                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                     {loadingDealerAreas ? (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                     ) : (
//                       <svg
//                         className="h-4 w-4 text-gray-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M19 9l-7 7-7-7"
//                         />
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
//                             {getCurrentDealerId()
//                               ? "Your Assigned Areas"
//                               : "All Areas"}{" "}
//                             for {formData.customerLocation}
//                           </div>
//                         </div>
//                         {dealerAssignedAreas.map((area) => (
//                           <div
//                             key={area.id}
//                             className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
//                             onClick={() => handleAreaSelect(area)}
//                           >
//                             <div className="font-medium text-gray-800 text-sm">
//                               {area.name}
//                             </div>
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
//                         {formData.customerLocation
//                           ? "No areas found for this location"
//                           : "Select a location first"}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block font-medium mb-1 text-sm sm:text-base">
//                   Assigned Dealer
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     value={assignedDealerName || "No dealer assigned"}
//                     readOnly
//                     className={`w-full border p-2.5 rounded-lg text-sm sm:text-base ${
//                       assignedDealerId
//                         ? "bg-green-50 border-green-300 text-green-700"
//                         : "bg-gray-100 border-gray-300 text-gray-500"
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
//                       <svg
//                         className="h-5 w-5 text-green-500"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                   )}
//                 </div>
//                 {assignedDistributorId && (
//                   <div className="mt-1 text-xs text-gray-600">
//                     Distributor: {assignedDistributorName}
//                   </div>
//                 )}
//               </div>
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
//                     disabled={isAddingAnotherVehicle}
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
//                     disabled={isAddingAnotherVehicle}
//                   />{" "}
//                   Finance
//                 </label>
//               </div>
//             </div>
//             <div>
//               <label className="block font-medium mb-1 text-sm sm:text-base">
//                 Selected Quantity
//               </label>
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
//                 <div>
//                   <span className="text-lg font-bold text-gray-800">
//                     {formData.quantity} units
//                   </span>
//                   <div className="text-sm text-gray-600 mt-1">
//                     All units are active
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-xs text-gray-500 mb-1">
//                     Total across all vehicles:
//                   </div>
//                   <div className="text-xl font-bold text-blue-600">
//                     {getTotalDisplayQuantity()} units
//                   </div>
//                 </div>
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
//         {storedLeads.length > 0 && !isAddingAnotherVehicle && (
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
  const [errors, setErrors] = useState({
    customerName: "",
    phoneNumber: "",
    customerLocation: "",
    customerArea: "",
    purchaseDate: "",
    paymentMode: "",
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
    () => {
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
  // Calculate total price across all vehicles
  const calculateTotalPrice = useMemo(() => {
    return [...allVehiclesForCurrentLead, ...currentVehicles].reduce(
      (total, v) => {
        const vehiclePrice = v.subtotal || v.price * (v.quantity || 1);
        return total + parseFloat(vehiclePrice || 0);
      },
      0
    );
  }, [allVehiclesForCurrentLead, currentVehicles]);
  const API_BASE = "http://192.168.1.38:8000/api";
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

  // Fetch payment modes
  const fetchPaymentModes = async () => {
    try {
      setLoadingPaymentModes(true);
      const response = await axios.get(`${API_BASE}/payment-modes`, {
        headers: getAuthHeaders(),
      });
      if (response.data.status) {
        setPaymentModes(response.data.data);
        // Set default payment mode if not set
        if (!formData.paymentMode && response.data.data.length > 0) {
          const defaultMode =
            response.data.data.find((mode) => mode.name === "cash") ||
            response.data.data[0];
          setFormData((prev) => ({ ...prev, paymentMode: defaultMode.name }));
          validateField("paymentMode", defaultMode.name);
        }
      } else {
        setPaymentModes([]);
        toast.error("Failed to load payment modes");
      }
    } catch (err) {
      console.error("Error fetching payment modes:", err);
      setPaymentModes([]);
      toast.error("Failed to load payment modes");
    } finally {
      setLoadingPaymentModes(false);
    }
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

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";
    }

    // If it's already a full URL, return as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Try different base paths
    const baseUrl = API_BASE.replace("/api", "");

    // Array of possible paths to try
    const possiblePaths = [
      `${baseUrl}/storage/galleries/${imagePath}`,
      `${baseUrl}/storage/coverphotos/${imagePath}`,
      `${baseUrl}/uploads/coverPhotos/${imagePath}`,
      `${baseUrl}/uploads/galleries/${imagePath}`,
      `${baseUrl}/storage/${imagePath}`,
      `${baseUrl}/uploads/${imagePath}`,
    ];

    // Try paths with different extensions if no extension
    if (!imagePath.includes(".")) {
      const extensions = [".webp", ".jpg", ".jpeg", ".png", ".gif"];
      for (const ext of extensions) {
        possiblePaths.push(`${baseUrl}/storage/galleries/${imagePath}${ext}`);
        possiblePaths.push(`${baseUrl}/uploads/coverPhotos/${imagePath}${ext}`);
      }
    }

    // Return the first path (it will try in order)
    return possiblePaths[0];
  };

  // Helper function to extract first image from gallery
  const extractFirstImage = (gallery) => {
    if (!gallery) return null;

    try {
      // Use cover_photo_urls if available
      if (
        gallery.cover_photo_urls &&
        Array.isArray(gallery.cover_photo_urls) &&
        gallery.cover_photo_urls.length > 0
      ) {
        const firstUrl = gallery.cover_photo_urls[0];
        console.log("📸 Using cover_photo_urls[0]:", firstUrl);
        return firstUrl;
      }

      // Try cover_photos array
      if (gallery.cover_photos) {
        let photos = [];

        // Handle different formats of cover_photos
        if (typeof gallery.cover_photos === "string") {
          try {
            photos = JSON.parse(gallery.cover_photos);
            if (!Array.isArray(photos)) {
              photos = [gallery.cover_photos];
            }
          } catch (e) {
            photos = [gallery.cover_photos];
          }
        } else if (Array.isArray(gallery.cover_photos)) {
          photos = gallery.cover_photos;
        }

        if (photos.length > 0) {
          const firstPhoto = photos[0];
          console.log("📸 Using cover_photos[0]:", firstPhoto);

          // Return the filename only (not full URL yet)
          return String(firstPhoto).trim();
        }
      }

      // Use first_image if available
      if (gallery.first_image) {
        console.log("📸 Using first_image:", gallery.first_image);
        return gallery.first_image;
      }
    } catch (error) {
      console.error("Error extracting image from gallery:", error);
    }

    return null;
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
  // Quantity handlers for vehicle cards
  const handleVehicleQuantityChange = (vehicleId, newQuantity) => {
    const quantity = Math.max(0, newQuantity);

    if (quantity === 0) {
      // Remove vehicle if quantity is 0
      const updatedVehicles = allVehiclesForCurrentLead.filter(
        (v) => v.id !== vehicleId
      );
      setAllVehiclesForCurrentLead(updatedVehicles);
      localStorage.setItem(
        "allVehiclesForCurrentLead",
        JSON.stringify(updatedVehicles)
      );
    } else {
      // Update quantity
      const updatedVehicles = allVehiclesForCurrentLead.map((v) =>
        v.id === vehicleId
          ? { ...v, quantity, subtotal: (v.price || 0) * quantity }
          : v
      );
      setAllVehiclesForCurrentLead(updatedVehicles);
      localStorage.setItem(
        "allVehiclesForCurrentLead",
        JSON.stringify(updatedVehicles)
      );
    }
  };
  const handleIncreaseQuantity = (vehicleId, currentQuantity) => {
    handleVehicleQuantityChange(vehicleId, currentQuantity + 1);
  };
  const handleDecreaseQuantity = (vehicleId, currentQuantity) => {
    handleVehicleQuantityChange(vehicleId, currentQuantity - 1);
  };
  // For current vehicles (from color selections), you'll need to update them differently
  const handleCurrentVehicleQuantityChange = (colorId, newQuantity) => {
    // This would need to be handled by updating the parent state
    // For now, we'll show a toast that current selection can't be modified
    toast(
      "To modify current vehicle selection, please go back to vehicle selection page"
    );
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

    // Handle quantity changes
    const handleCardQuantityChange = (newQuantity) => {
      const qty = Math.max(1, newQuantity); // Minimum 1

      const updatedVehicles = allVehiclesForCurrentLead.map((v) =>
        v.id === vehicle.id
          ? {
              ...v,
              quantity: qty,
              subtotal: (v.price || basicPrice) * qty,
            }
          : v
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
    };

    const handleIncreaseQuantity = () => {
      handleCardQuantityChange(vehicleQuantity + 1);
    };

    const handleDecreaseQuantity = () => {
      if (vehicleQuantity > 1) {
        handleCardQuantityChange(vehicleQuantity - 1);
      }
    };

    return (
      <div
        key={`${vehicle.id || index}-${
          vehicle.isCurrent ? "current" : "saved"
        }`}
        className={`bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-all ${
          vehicle.isCurrent ? "border-blue-500 border-2" : "border-gray-200"
        }`}
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
            <div className="space-y-2 text-xs">
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

              {/* Quantity Display with +/- controls - UPDATED */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-600">Quantity:</span>
                <div className="flex items-center">
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={handleDecreaseQuantity}
                      disabled={vehicleQuantity <= 1}
                      className="bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                          d="M20 12H4"
                        />
                      </svg>
                    </button>

                    <input
                      type="number"
                      className="w-12 h-8 text-center border-x border-gray-300 text-sm font-medium"
                      min="1"
                      value={vehicleQuantity}
                      onChange={(e) =>
                        handleCardQuantityChange(parseInt(e.target.value) || 1)
                      }
                    />

                    <button
                      type="button"
                      onClick={handleIncreaseQuantity}
                      className="bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center transition-colors"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Display - UPDATED to show dynamic price */}
              <div className="space-y-1 mt-2">
                {basicPrice > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">
                        Unit Price:
                      </span>
                      <p className="text-green-600 font-semibold text-sm">
                        ${parseFloat(basicPrice).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex justify-between items-center border-t pt-2">
                      <span className="text-gray-700 font-medium">
                        Total Price:
                      </span>
                      <div className="text-right">
                        <p className="text-green-700 font-bold text-sm">
                          ${totalBasicPrice.toLocaleString()}
                        </p>
                        {vehicleQuantity > 1 && (
                          <p className="text-green-600 text-xs">
                            (${parseFloat(basicPrice).toLocaleString()} ×{" "}
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

          {mainPhoto && (
            <div className="ml-3 flex-shrink-0 relative">
              <img
                src={getFullImageUrl(mainPhoto)}
                alt={vehicleVariant.name}
                className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border"
                onError={(e) => {
                  console.error("Image failed to load:", e.target.src);

                  // Try fallback images
                  const fallbackImages = [
                    "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image",
                    "https://via.placeholder.com/100x100/3b82f6/ffffff?text=" +
                      encodeURIComponent(vehicleVariant.name.substring(0, 10)),
                  ];

                  let currentIndex = 0;
                  const tryNextImage = () => {
                    if (currentIndex < fallbackImages.length) {
                      e.target.src = fallbackImages[currentIndex];
                      currentIndex++;
                    }
                  };

                  tryNextImage();
                }}
              />
              {/* Quantity badge on image */}
              <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {vehicleQuantity}
              </div>
            </div>
          )}
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

    const imageUrl = getVehicleImage(vehicleVariant, color);
    <div className="ml-3 flex-shrink-0 relative">
      <img
        src={imageUrl}
        alt={vehicleVariant.name}
        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md border"
        onError={(e) => {
          console.error("❌ Image failed to load:", imageUrl);
          e.target.src =
            "https://via.placeholder.com/80x80/f3f4f6/6b7280?text=No+Image";

          // Try alternative URLs for the same image
          const baseUrl = "http://192.168.1.38:8000";
          const filename = imageUrl.split("/").pop();

          if (filename) {
            const alternativeUrls = [
              `${baseUrl}/storage/galleries/${filename}`,
              `${baseUrl}/storage/coverphotos/${filename}`,
              `${baseUrl}/uploads/coverPhotos/${filename}`,
            ];

            // Try each alternative
            let currentTry = 0;
            const tryAlternative = () => {
              if (currentTry < alternativeUrls.length) {
                console.log(
                  `🔄 Trying alternative ${currentTry + 1}:`,
                  alternativeUrls[currentTry]
                );
                e.target.src = alternativeUrls[currentTry];
                currentTry++;
              }
            };

            // Try first alternative immediately
            tryAlternative();
          }
        }}
        onLoad={() => console.log("✅ Image loaded successfully:", imageUrl)}
      />
      <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
        {vehicleQuantity}
      </div>
    </div>;
  };
  const renderCompactVehicleCard = (vehicle, index) => {
    if (!vehicle || !vehicle.variant) return null;
    const color = vehicle.color;
    const mainPhoto = getVehicleImage(vehicle.variant, color);
    const vehicleVariant = vehicle.variant;
    const vehiclePrice = getVehiclePrice(vehicleVariant, color);
    const vehicleQuantity = vehicle.quantity || 1;
    const totalPrice = vehiclePrice * vehicleQuantity; // Dynamic total

    return (
      <div
        key={`${vehicle.id || index}-${
          vehicle.isCurrent ? "current" : "saved"
        }`}
        className={`bg-white rounded-lg border p-2 shadow-sm ${
          vehicle.isCurrent ? "border-blue-500 border-2" : "border-gray-200"
        }`}
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
                className="w-12 h-12 object-cover rounded border w-full"
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

                {/* Quantity with +/- controls */}
                <div className="flex items-center justify-between my-1">
                  <span className="text-xs text-gray-600 font-medium">
                    Qty:
                  </span>
                  {vehicle.isCurrent ? (
                    <span className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-medium">
                      {vehicleQuantity}
                    </span>
                  ) : (
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          handleDecreaseQuantity(vehicle.id, vehicleQuantity)
                        }
                        disabled={vehicleQuantity <= 1}
                        className="bg-gray-100 hover:bg-gray-200 w-6 h-6 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg
                          className="w-2 h-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M20 12H4"
                          />
                        </svg>
                      </button>

                      <span className="w-6 h-6 text-center text-xs font-medium flex items-center justify-center">
                        {vehicleQuantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleIncreaseQuantity(vehicle.id, vehicleQuantity)
                        }
                        className="bg-gray-100 hover:bg-gray-200 w-6 h-6 flex items-center justify-center transition-colors"
                      >
                        <svg
                          className="w-2 h-2"
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
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Display - Updated to show unit and total dynamically */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Unit:</span>
                    <span className="text-green-600 font-medium">
                      ${vehiclePrice.toLocaleString()}
                    </span>
                  </div>
                  {vehicleQuantity > 1 && (
                    <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-200">
                      <span className="text-gray-600 font-medium">Total:</span>
                      <span className="text-green-700 font-semibold">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Remove button for saved vehicles in compact view */}
        {!vehicle.isCurrent && (
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={() => handleVehicleQuantityChange(vehicle.id, 0)}
              className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Remove
            </button>
          </div>
        )}
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
    if (trimmed.length < 9) return "Phone number must be at least 9 digits.";
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
  const validateForm = () => {
    const newErrors = {};
    let hasErrors = false;
    Object.keys(errors).forEach((key) => {
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
    if (
      !variant &&
      allVehiclesForCurrentLead.length === 0 &&
      currentVehicles.length === 0
    ) {
      setErrorMessage("Please select at least one vehicle variant.");
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
  const handleSubmit = async (action = "submit") => {
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
      const finalLocation = formData.customerArea
        ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
        : formData.customerLocation.trim();
      const currentUserId = getCurrentDealerId();
      const mainVehicle = allVehiclesToSave[0];
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
        vehicles: allVehiclesToSave.map((v) => ({
          brand_id: parseInt(v.variant.brand_id, 10),
          variant_id: parseInt(v.variant.id, 10),
          color_id: v.color?.id || null,
          quantity: v.quantity || 1,
        })),
      };
      console.log("Submitting lead payload:", payload);
      const { data } = await axios.post(`${API_BASE}/leads`, payload, {
        headers: getAuthHeaders(),
      });
      if (data?.success) {
        const newLeadId = data.lead_id || data.lead?.id;
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
        // CRITICAL: Clear ALL localStorage items for this lead
        clearAllLocalStorageForLead();
        // Reset all form states
        resetFormState();
        if (action === "submit") {
          navigate("/leads/open", {
            state: {
              recentLead: data.lead,
              submittedVariant: mainVehicle.variant,
              submittedLeadId: newLeadId,
              submittedColor: mainVehicle.color,
              assignedDealer: assignedDealerId,
              assignedDistributor: assignedDistributorId,
            },
          });
        } else {
          // For draft, navigate to dashboard
          toast.success("Draft saved successfully!");
          navigate("/dashboard");
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
  const clearAllLocalStorageForLead = () => {
    console.log("Clearing ALL localStorage for lead...");
    // Save essential items that should NOT be cleared
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    const userInfo = localStorage.getItem("userInfo");
    const currentUser = localStorage.getItem("currentUser");
    const authUser = localStorage.getItem("authUser");
    // List of ALL lead-related items to clear
    const leadItemsToClear = [
      "leadId",
      "draftLead",
      "allVehiclesForCurrentLead",
      "existingCustomerData",
      "recentSubmittedLead",
      "draftLeadData",
      "customerFormData",
      "selectedVehicles",
      "vehicleSelections",
      "colorSelections",
      "variantSelections",
      "currentVehicles",
      "vehicleData",
      "leadVehicles",
      "customerData",
      "formData",
      "storedLeads",
      "selectedAreaId",
      "selectedCityId",
      "locationSearchText",
      "isAddingAnotherVehicle",
      "lockCustomerDetails",
      "existingVehicles",
      "variant",
      "colors",
      "colorSelections",
      "totalQuantity",
      "totalPrice",
      "galleries",
      "brands",
      "fuelTypes",
      "ccs",
      "quantity",
    ];
    // Clear each item
    leadItemsToClear.forEach((item) => {
      if (localStorage.getItem(item)) {
        localStorage.removeItem(item);
        console.log(`✓ Removed: ${item}`);
      }
    });
    // Also clear any items with "lead" or "vehicle" in the name
    const allKeys = Object.keys(localStorage);
    allKeys.forEach((key) => {
      if (
        key.toLowerCase().includes("lead") ||
        key.toLowerCase().includes("vehicle") ||
        key.toLowerCase().includes("vehicles") ||
        key.toLowerCase().includes("color") ||
        key.toLowerCase().includes("variant") ||
        key.toLowerCase().includes("selection") ||
        key.toLowerCase().includes("customer") ||
        key.toLowerCase().includes("form")
      ) {
        // Skip essential auth/user items
        if (
          ![
            "authToken",
            "userData",
            "userInfo",
            "currentUser",
            "authUser",
          ].includes(key)
        ) {
          localStorage.removeItem(key);
          console.log(`✓ Removed (pattern): ${key}`);
        }
      }
    });
    // Restore essential auth/user items
    if (authToken) localStorage.setItem("authToken", authToken);
    if (userData) localStorage.setItem("userData", userData);
    if (userInfo) localStorage.setItem("userInfo", userInfo);
    if (currentUser) localStorage.setItem("currentUser", currentUser);
    if (authUser) localStorage.setItem("authUser", authUser);
    console.log("✅ ALL lead-related localStorage cleared successfully!");
  };
  // CLEAR ALL LOCALSTORAGE EXCEPT AUTH TOKEN
  const clearAllLocalStorage = () => {
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    // Safety: If no token found, DO NOT clear anything
    if (!authToken) {
      console.warn(
        "Auth token missing — localStorage not cleared to avoid logout."
      );
      return;
    }
    // Save auth token and user data first
    const itemsToSave = {
      authToken: authToken,
      userData: userData,
    };
    // Clear ALL lead-related items
    const allLeadItems = [
      "leadId",
      "draftLead",
      "allVehiclesForCurrentLead",
      "existingCustomerData",
      "recentSubmittedLead",
      "draftLeadData",
      "customerFormData",
      "selectedVehicles",
    ];
    // Clear all lead items
    allLeadItems.forEach((item) => localStorage.removeItem(item));
    // Restore auth token and user data
    if (itemsToSave.authToken) {
      localStorage.setItem("authToken", itemsToSave.authToken);
    }
    if (itemsToSave.userData) {
      localStorage.setItem("userData", itemsToSave.userData);
    }
    console.log("All lead-related localStorage cleared for Submit/Save Draft");
  };
  // FIXED SAVE DRAFT FUNCTION - Clears localStorage
  // const handleSaveDraft = async () => {
  // const validationError = validateForm();
  // if (validationError) {
  // setErrorMessage(validationError);
  // return;
  // }
  // const selectedArea = dealerAssignedAreas.find(
  // (area) => area.name === formData.customerArea
  // );
  // if (!selectedArea || !selectedCityId) {
  // setErrorMessage("Please select valid area and city.");
  // return;
  // }
  // const finalLocation = formData.customerArea
  // ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
  // : formData.customerLocation.trim();
  // const currentUserId = getCurrentDealerId();
  // const allVehiclesToSave = [
  // ...allVehiclesForCurrentLead,
  // ...currentVehicles,
  // ];
  // if (allVehiclesToSave.length === 0) {
  // setErrorMessage("No vehicles to save.");
  // return;
  // }
  // const mainVehicle = allVehiclesToSave[0];
  // if (!mainVehicle) {
  // setErrorMessage("No vehicles to save.");
  // return;
  // }
  // const payload = {
  // customer_name: formData.customerName.trim(),
  // phone_no: formData.phoneNumber.trim(),
  // location: finalLocation || null,
  // area: formData.customerArea?.trim() || null,
  // city_id: selectedCityId,
  // area_id: selectedArea.id,
  // executive_id: currentUserId,
  // tentative_purchase_date: formData.purchaseDate || null,
  // unit_price: mainVehicle.price || 0,
  // total_price: calculateTotalPrice,
  // vehicle_qty: calculateTotalQuantity,
  // current_vehicle_qty: mainVehicle.quantity || 1,
  // payment_mode: formData.paymentMode,
  // additional_note: formData.notes?.trim() || null,
  // brand_id: mainVehicle.variant
  // ? parseInt(mainVehicle.variant.brand_id, 10)
  // : null,
  // variant_id: mainVehicle.variant
  // ? parseInt(mainVehicle.variant.id, 10)
  // : null,
  // lead_id: leadId || null,
  // status: "Draft",
  // color_id: mainVehicle.color?.id || null,
  // color_name: mainVehicle.color?.name || null,
  // color_code: mainVehicle.color?.color_code || null,
  // dealer_id: assignedDealerId,
  // distributor_id: assignedDistributorId,
  // vehicles: allVehiclesToSave.map((v) => ({
  // brand_id: parseInt(v.variant.brand_id, 10),
  // variant_id: parseInt(v.variant.id, 10),
  // color_id: v.color?.id || null,
  // quantity: v.quantity || 1,
  // })),
  // };
  // try {
  // const { data } = await axios.post(`${API_BASE}/leads`, payload, {
  // headers: getAuthHeaders(),
  // });
  // if (data?.lead?.id) {
  // // Clear ALL localStorage for draft save
  // clearAllLocalStorage();
  // // Reset form state
  // resetFormState();
  // toast.success("Draft saved successfully!");
  // navigate("/dashboard");
  // }
  // } catch (err) {
  // const errorMsg = err.response?.data?.message || "Draft failed.";
  // setErrorMessage(errorMsg);
  // toast.error(errorMsg);
  // }
  // };
  const handleSaveDraft = async () => {
    // First validate the form
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
    // Prepare payload WITHOUT price fields for draft
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
    console.log("Saving draft with payload:", payload);
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const { data } = await axios.post(`${API_BASE}/leads`, payload, {
        headers: getAuthHeaders(),
      });
      if (data?.success || data?.lead?.id) {
        const newLeadId = data.lead_id || data.lead?.id;
        // CRITICAL: Clear ALL localStorage items for this lead (same as handleSubmit)
        clearAllLocalStorageForLead();
        // Reset form state
        resetFormState();
        toast.success(`Draft saved successfully! Lead #${newLeadId}`);
        // Navigate to dashboard
        navigate("/dashboard", {
          state: {
            draftSaved: true,
            leadId: newLeadId,
          },
        });
      } else {
        throw new Error("No lead ID returned from server");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Draft save failed.";
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      console.error("Draft save error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  const addNewVehicle = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
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
      // Find selected area
      const selectedArea = dealerAssignedAreas.find(
        (area) => area.name === formData.customerArea
      );
      if (!selectedArea || !selectedCityId) {
        setErrorMessage("Please select valid area and city first.");
        return;
      }
      const finalLocation = formData.customerArea
        ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
        : formData.customerLocation.trim();
      const currentUserId = getCurrentDealerId();
      // IMPORTANT: Only save CURRENT vehicles (not previously saved ones)
      const vehiclesToSave = currentVehicles;
      if (vehiclesToSave.length === 0) {
        setErrorMessage("Please select at least one vehicle first.");
        return;
      }
      const mainVehicle = vehiclesToSave[0];
      // Prepare payload for creating a new lead with current vehicles
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
        payment_mode: formData.paymentMode,
        additional_note: formData.notes?.trim() || null,
        brand_id: mainVehicle.variant
          ? parseInt(mainVehicle.variant.brand_id, 10)
          : null,
        variant_id: mainVehicle.variant
          ? parseInt(mainVehicle.variant.id, 10)
          : null,
        status: "Draft",
        color_id: mainVehicle.color?.id || null,
        dealer_id: assignedDealerId,
        distributor_id: assignedDistributorId,
        // Send only current vehicles, not previously saved ones
        vehicles: vehiclesToSave.map((v) => ({
          brand_id: parseInt(v.variant.brand_id, 10),
          variant_id: parseInt(v.variant.id, 10),
          color_id: v.color?.id || null,
          quantity: v.quantity || 1,
        })),
      };
      console.log("Saving new lead with vehicles:", payload);
      const { data } = await axios.post(`${API_BASE}/leads`, payload, {
        headers: getAuthHeaders(),
      });
      if (data?.lead?.id) {
        const newLeadId = data.lead.id;
        setLeadId(newLeadId);
        // Update vehicles with lead_id and save to localStorage
        const updatedVehicles = vehiclesToSave.map((v, index) => ({
          ...v,
          lead_id: newLeadId,
          id: `${newLeadId}-${index}-${Date.now()}`,
          dealer_id: assignedDealerId,
          distributor_id: assignedDistributorId,
          status: "Draft",
        }));
        // Save ONLY current vehicles to localStorage
        localStorage.setItem(
          "allVehiclesForCurrentLead",
          JSON.stringify(updatedVehicles)
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
          lead_id: newLeadId,
          timestamp: Date.now(),
          area_id: selectedArea.id,
          city_id: selectedCityId,
          existingVehicles: updatedVehicles,
          isAddingAnotherVehicle: true,
          dealer_id: assignedDealerId,
          distributor_id: assignedDistributorId,
          dealer_name: assignedDealerName,
          distributor_name: assignedDistributorName,
        };
        localStorage.setItem(
          "existingCustomerData",
          JSON.stringify(customerDataToStore)
        );
        // Save lead ID
        localStorage.setItem("leadId", newLeadId);
        toast.success("Adding another vehicle.");
        // Navigate to generate new vehicle
        navigate("/leads/generate", {
          state: {
            isAddingAnotherVehicle: true,
            leadId: newLeadId,
            customerData: customerDataToStore,
            existingVehicles: updatedVehicles,
            lockCustomerDetails: true,
            assignedDealerId: assignedDealerId,
            assignedDistributorId: assignedDistributorId,
          },
          replace: true,
        });
      } else {
        throw new Error("Failed to save lead.");
      }
    } catch (err) {
      console.error("Error adding new vehicle:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to add new vehicle.";
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };
  const clearOnlyVehiclesFromLocalStorage = () => {
    // Clear ONLY vehicle-related items
    const vehicleItems = [
      "allVehiclesForCurrentLead",
      "selectedVehicles",
      "vehicleSelections",
      "colorSelections",
      "variantSelections",
    ];
    vehicleItems.forEach((item) => localStorage.removeItem(item));
    console.log(
      "Only vehicles cleared from localStorage for Add Another Vehicle"
    );
  };
  // Reset form state
  const resetFormState = () => {
    console.log("Resetting form state...");
    // Clear React state
    setStoredLeads([]);
    setAllVehiclesForCurrentLead([]);
    setLeadId(null);
    setSelectedCityId(null);
    setSelectedAreaId(null);
    setErrors({});
    // Reset form data
    setFormData({
      customerName: "",
      phoneNumber: "",
      customerLocation: "",
      customerArea: "",
      purchaseDate: "",
      quantity: 1,
      paymentMode: "cash",
      notes: "",
    });
    // Reset other related states
    setAssignedDealerId(null);
    setAssignedDistributorId(null);
    setAssignedDealerName("");
    setAssignedDistributorName("");
    setLocationSearchText("");
    setUseSameCustomerDetails(false);
    setErrorMessage(null);
    // Clear current vehicles
    // Note: currentVehicles is derived from colorSelections, so clear those from state
    if (location.state) {
      // Clear location state
      navigate(location.pathname, { replace: true, state: {} });
    }
    console.log("✅ Form state reset successfully!");
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
  const handleChange = (e) => {
    // If adding another vehicle, only allow date field to be changed
    if (isAddingAnotherVehicle && e.target.id !== "purchaseDate") {
      return;
    }
    const { id, name, value } = e.target;
    const field = id || name;
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };
  const handlePaymentModeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, paymentMode: value }));
    validateField("paymentMode", value);
  };
  const handleCheckboxChange = (e) => {
    setUseSameCustomerDetails(e.target.checked);
  };
  // Use effects
  useEffect(() => {
    fetchPaymentModes();
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
          const newFormData = {
            ...formData,
            customerName: customerData.customer_name || "",
            phoneNumber: customerData.phone_no || "",
            customerLocation: customerData.location || "",
            customerArea: customerData.area || "",
            purchaseDate: formattedDate,
            paymentMode: customerData.payment_mode || "cash",
            quantity: customerData.quantity || 1,
            notes: customerData.notes || "",
          };
          setFormData(newFormData);
          // Validate loaded data
          Object.keys(newFormData).forEach((key) => {
            if (
              [
                "customerName",
                "phoneNumber",
                "customerLocation",
                "customerArea",
                "purchaseDate",
                "paymentMode",
              ].includes(key)
            ) {
              validateField(key, newFormData[key]);
            }
          });
          setLocationSearchText(customerData.location || "");
          setSelectedCityId(customerData.city_id || null);
          setSelectedAreaId(customerData.area_id || null);
          // Set dealer/distributor info if available
          if (customerData.dealer_id) {
            setAssignedDealerId(customerData.dealer_id);
            setAssignedDistributorId(customerData.distributor_id);
            setAssignedDealerName(customerData.dealer_name || "");
            setAssignedDistributorName(customerData.distributor_name || "");
          }
          if (customerData.lead_id) {
            setLeadId(customerData.lead_id);
            localStorage.setItem("leadId", customerData.lead_id);
          }
          // Load existing vehicles - IMPORTANT: This loads vehicles from customerData
          if (
            customerData.existingVehicles &&
            Array.isArray(customerData.existingVehicles)
          ) {
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
    // Load existing vehicles from localStorage (for regular flow)
    const savedVehicles = localStorage.getItem("allVehiclesForCurrentLead");
    if (savedVehicles && !isAddingAnotherVehicle) {
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
        const draftData = JSON.parse(draft);
        const newFormData = { ...formData, ...draftData };
        setFormData(newFormData);
        // Validate loaded draft data
        Object.keys(draftData).forEach((key) => {
          if (
            [
              "customerName",
              "phoneNumber",
              "customerLocation",
              "customerArea",
              "purchaseDate",
              "paymentMode",
            ].includes(key)
          ) {
            validateField(key, draftData[key]);
          }
        });
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
      const newFormData = {
        customerName: leadDetails.customer_name || "",
        phoneNumber: leadDetails.phone_no || "",
        customerLocation: leadDetails.location || "",
        customerArea: leadDetails.area || "",
        purchaseDate: leadDetails.tentative_purchase_date || "",
        quantity: leadDetails.vehicle_qty || 1,
        paymentMode: leadDetails.payment_mode || "cash",
        notes: leadDetails.additional_note || "",
      };
      setFormData(newFormData);
      // Validate loaded lead details
      Object.keys(newFormData).forEach((key) => {
        if (
          [
            "customerName",
            "phoneNumber",
            "customerLocation",
            "customerArea",
            "purchaseDate",
            "paymentMode",
          ].includes(key)
        ) {
          validateField(key, newFormData[key]);
        }
      });
    }
  }, [leadDetails]);
  useEffect(() => {
    if (useSameCustomerDetails && storedLeads.length > 0) {
      const latestLead = storedLeads[storedLeads.length - 1];
      const newFormData = {
        ...formData,
        customerName: latestLead.customer_name || "",
        phoneNumber: latestLead.phone_no || "",
        customerLocation: latestLead.location || "",
        customerArea: latestLead.area || "",
        purchaseDate: latestLead.tentative_purchase_date || "",
        quantity: latestLead.vehicle_qty || 1,
        paymentMode: latestLead.payment_mode || "cash",
        notes: latestLead.additional_note || "",
      };
      setFormData(newFormData);
      // Validate auto-filled data
      Object.keys(newFormData).forEach((key) => {
        if (
          [
            "customerName",
            "phoneNumber",
            "customerLocation",
            "customerArea",
            "purchaseDate",
            "paymentMode",
          ].includes(key)
        ) {
          validateField(key, newFormData[key]);
        }
      });
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
      <div className="mb-4 p-4 border border-blue-200 rounded-lg">
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
  const getInputClass = (field) => {
    const hasError = errors[field];
    return `w-full border p-2.5 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-blue-500 ${
      hasError
        ? "border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50"
        : "border-gray-300 focus:border-blue-500"
    } ${
      isAddingAnotherVehicle && field !== "purchaseDate"
        ? "bg-gray-100 cursor-not-allowed"
        : ""
    }`;
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
              {selectedVehicleForPopup.vehicle && (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    {getVehicleImage(
                      selectedVehicleForPopup.vehicle.variant,
                      selectedVehicleForPopup.vehicle.color
                    ) && (
                      <img
                        src={`${API_BASE.replace(
                          "/api",
                          ""
                        )}/uploads/coverPhotos/${getVehicleImage(
                          selectedVehicleForPopup.vehicle.variant,
                          selectedVehicleForPopup.vehicle.color
                        )}`}
                        alt={selectedVehicleForPopup.vehicle.variant.name}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-800">
                        {selectedVehicleForPopup.vehicle.variant.name}
                      </h4>
                      {selectedVehicleForPopup.vehicle.color && (
                        <div className="flex items-center gap-2 mt-2">
                          <div
                            className="w-6 h-6 rounded-full border border-gray-400"
                            style={{
                              backgroundColor:
                                selectedVehicleForPopup.vehicle.color
                                  .color_code,
                            }}
                          ></div>
                          <span className="text-gray-600">
                            {selectedVehicleForPopup.vehicle.color.name}
                          </span>
                        </div>
                      )}

                      {/* Quantity controls in popup */}
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adjust Quantity
                        </label>
                        {selectedVehicleForPopup.vehicle.isCurrent ? (
                          <div className="flex items-center">
                            <span className="px-4 py-2 bg-gray-100 rounded-md font-medium">
                              {selectedVehicleForPopup.vehicle.quantity || 1}{" "}
                              units
                            </span>
                            <span className="ml-3 text-sm text-gray-500">
                              (Current selection - edit on previous page)
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDecreaseQuantity(
                                    selectedVehicleForPopup.vehicle.id,
                                    selectedVehicleForPopup.vehicle.quantity ||
                                      1
                                  )
                                }
                                disabled={
                                  (selectedVehicleForPopup.vehicle.quantity ||
                                    1) <= 1
                                }
                                className="bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>

                              <input
                                type="number"
                                className="w-16 h-10 text-center border-x border-gray-300 text-lg font-medium"
                                min="1"
                                value={
                                  selectedVehicleForPopup.vehicle.quantity || 1
                                }
                                onChange={(e) =>
                                  handleVehicleQuantityChange(
                                    selectedVehicleForPopup.vehicle.id,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  handleIncreaseQuantity(
                                    selectedVehicleForPopup.vehicle.id,
                                    selectedVehicleForPopup.vehicle.quantity ||
                                      1
                                  )
                                }
                                className="bg-gray-100 hover:bg-gray-200 w-10 h-10 flex items-center justify-center transition-colors"
                              >
                                <svg
                                  className="w-5 h-5"
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
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                handleVehicleQuantityChange(
                                  selectedVehicleForPopup.vehicle.id,
                                  0
                                );
                                setShowVehiclePopup(false);
                              }}
                              className="ml-4 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                            >
                              Remove Vehicle
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-700 mb-2">
                      Price Summary
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Unit Price</p>
                        <p className="text-lg font-semibold text-green-600">
                          $
                          {getVehiclePrice(
                            selectedVehicleForPopup.vehicle.variant,
                            selectedVehicleForPopup.vehicle.color
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-lg font-semibold text-green-700">
                          $
                          {(
                            getVehiclePrice(
                              selectedVehicleForPopup.vehicle.variant,
                              selectedVehicleForPopup.vehicle.color
                            ) * (selectedVehicleForPopup.vehicle.quantity || 1)
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                className={getInputClass("customerName")}
                required
              />
              {errors.customerName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerName}
                </p>
              )}
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
                className={getInputClass("phoneNumber")}
                required
                maxLength={10}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
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
                  className={`${getInputClass("customerLocation")} pr-10`}
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
              {errors.customerLocation && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customerLocation}
                </p>
              )}
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
                    className={`${getInputClass(
                      "customerArea"
                    )} pr-10 cursor-pointer`}
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
              <div>
                <label className="block font-medium mb-1 text-sm sm:text-base">
                  Dealer(s)
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
                className={getInputClass("purchaseDate")}
                min={new Date().toISOString().split("T")[0]}
              />
              {errors.purchaseDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.purchaseDate}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block font-medium text-sm text-gray-700">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              {loadingPaymentModes ? (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {paymentModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                        formData.paymentMode === mode.name
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      } ${
                        isAddingAnotherVehicle
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() =>
                        !isAddingAnotherVehicle &&
                        handlePaymentModeChange({
                          target: { value: mode.name },
                        })
                      }
                      disabled={isAddingAnotherVehicle}
                    >
                      {mode.name.charAt(0).toUpperCase() + mode.name.slice(1)}
                    </button>
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
