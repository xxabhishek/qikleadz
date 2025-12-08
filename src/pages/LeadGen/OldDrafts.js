// //from deepseek model against variant
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// import { useNavigate } from "react-router-dom";

// const DraftLeads = () => {
//   const [draftLeads, setDraftLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [sortOrder, setSortOrder] = useState("newest");
//   const [galleries, setGalleries] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [variants, setVariants] = useState([]);
//   const [filteredVariants, setFilteredVariants] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [filteredColors, setFilteredColors] = useState([]);
//   const navigate = useNavigate();

//   const API_BASE = " http://192.168.1.38:8000/api";
//   const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   useEffect(() => {
//     fetchDraftLeads();
//     fetchGalleries();
//     fetchBrands();
//     fetchVariants();
//     fetchColors();
//   }, []);

//   // Update filtered variants when selected lead changes or variants are loaded
//   useEffect(() => {
//     if (selectedLead && variants.length > 0) {
//       const currentBrandId = selectedLead.leadDetails?.[0]?.brand_id;
//       if (currentBrandId) {
//         const filtered = variants.filter(
//           (variant) => variant.brand_id == currentBrandId
//         );
//         setFilteredVariants(filtered);
//       } else {
//         setFilteredVariants([]);
//       }
//     }
//   }, [selectedLead, variants]);

//   // Cleanup on component unmount or when starting new lead
//   useEffect(() => {
//     return () => {
//       // Only clear if not in the middle of a flow
//       const urlParams = new URLSearchParams(window.location.search);
//       const isNewLead = urlParams.get("new") === "true";

//       if (isNewLead) {
//         localStorage.removeItem("leadId");
//         localStorage.removeItem("draftLead");
//         localStorage.removeItem("existingCustomerData");
//       }
//     };
//   }, []);
//   // Update filtered colors when variant changes
//   useEffect(() => {
//     if (selectedLead && galleries.length > 0) {
//       const currentVariantId = selectedLead.leadDetails?.[0]?.variant_id;
//       if (currentVariantId) {
//         // Get unique colors for this variant from galleries
//         const variantGalleries = galleries.filter(
//           (gallery) => gallery.variant_id == currentVariantId
//         );
//         const uniqueColorIds = [
//           ...new Set(variantGalleries.map((g) => g.color_id)),
//         ];
//         const variantColors = colors.filter((color) =>
//           uniqueColorIds.includes(color.id)
//         );
//         setFilteredColors(variantColors);
//       } else {
//         setFilteredColors([]);
//       }
//     }
//   }, [selectedLead, galleries, colors]);

//   // In your DraftLeads component, update the fetchDraftLeads function:
//   const fetchDraftLeads = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE}/lead-details/draft`, {
//         // Make sure this endpoint exists
//         headers: getAuthHeaders(),
//       });

//       if (res.data.success) {
//         const leads = res.data.data || [];
//         setDraftLeads(leads);
//         if (leads.length === 0) {
//           setError("No draft leads found.");
//         }
//       } else {
//         setError(res.data.message || "Failed to fetch draft leads.");
//       }
//     } catch (err) {
//       console.error("Failed to fetch draft leads:", err);
//       setError("Failed to fetch draft leads. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchGalleries = async () => {
//     try {
//       const galleriesRes = await axios.get(`${API_BASE}/galleries`, {
//         headers: getAuthHeaders(),
//       });
//       setGalleries(galleriesRes.data.data || galleriesRes.data || []);
//     } catch (err) {
//       console.error("Error fetching galleries:", err);
//     }
//   };

//   const fetchBrands = async () => {
//     try {
//       const brandsRes = await axios.get(`${API_BASE}/brands`, {
//         headers: getAuthHeaders(),
//       });
//       setBrands(brandsRes.data.data || brandsRes.data || []);
//     } catch (err) {
//       console.error("Error fetching brands:", err);
//     }
//   };

//   const fetchVariants = async () => {
//     try {
//       const variantsRes = await axios.get(`${API_BASE}/variants`, {
//         headers: getAuthHeaders(),
//       });
//       setVariants(variantsRes.data.data || variantsRes.data || []);
//     } catch (err) {
//       console.error("Error fetching variants:", err);
//     }
//   };

//   const fetchColors = async () => {
//     try {
//       const colorsRes = await axios.get(`${API_BASE}/colors`, {
//         headers: getAuthHeaders(),
//       });
//       setColors(colorsRes.data.data || colorsRes.data || []);
//     } catch (err) {
//       console.error("Error fetching colors:", err);
//     }
//   };

//   const calculateLeadAge = (createdDate) => {
//     const currentDate = new Date();
//     const leadDate = new Date(createdDate);
//     const diffTime = currentDate - leadDate;
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const sortLeads = (leads, order) => {
//     return [...leads].sort((a, b) => {
//       const dateA = new Date(a.created_at);
//       const dateB = new Date(b.created_at);
//       return order === "newest" ? dateB - dateA : dateA - dateB;
//     });
//   };

//   const getVariantImageForModal = (variantDetail) => {
//     if (!variantDetail?.variant_id) {
//       return (
//         <div className="text-center">
//           <img
//             src="https://via.placeholder.com/192x128/f3f4f6/6b7280?text=No+Image"
//             alt="No Vehicle Image"
//             className="w-32 h-20 md:w-48 md:h-32 object-contain rounded"
//           />
//           <p className="text-xs text-gray-500 mt-2">No image available</p>
//         </div>
//       );
//     }

//     // Find gallery entry for this specific variant and color combination
//     let variantGallery = null;

//     if (variantDetail.color_id) {
//       // Try to find exact match: variant + color
//       variantGallery = galleries.find(
//         (g) =>
//           g.variant_id === variantDetail.variant_id &&
//           g.color_id == variantDetail.color_id
//       );
//     }

//     // If no gallery found with the specific color, try to find any gallery for this variant
//     if (!variantGallery) {
//       variantGallery = galleries.find(
//         (g) => g.variant_id === variantDetail.variant_id
//       );
//     }

//     if (variantGallery?.cover_photos) {
//       let images = [];
//       try {
//         images = JSON.parse(variantGallery.cover_photos);
//         if (!Array.isArray(images)) images = [variantGallery.cover_photos];
//       } catch (e) {
//         images = [variantGallery.cover_photos];
//       }

//       if (images[0]) {
//         const imageUrl = getAbsoluteImageUrl(images[0]);
//         return (
//           <div className="text-center">
//             <img
//               src={imageUrl}
//               alt={variantDetail?.variant_name || "Vehicle"}
//               className="w-32 h-20 md:w-48 md:h-32 object-contain rounded"
//               onError={(e) => {
//                 console.log("Gallery image failed to load:", imageUrl);
//                 e.target.src =
//                   "https://via.placeholder.com/192x128/f3f4f6/6b7280?text=No+Image";
//                 e.target.onerror = null;
//               }}
//             />
//             {variantDetail.color_name && (
//               <p className="text-xs text-gray-500 mt-2">
//                 Color: {variantDetail.color_name}
//               </p>
//             )}
//           </div>
//         );
//       }
//     }

//     // Fallback to placeholder
//     return (
//       <div className="text-center">
//         <img
//           src="https://via.placeholder.com/192x128/f3f4f6/6b7280?text=No+Image"
//           alt="No Vehicle Image"
//           className="w-32 h-20 md:w-48 md:h-32 object-contain rounded"
//         />
//         <p className="text-xs text-gray-500 mt-2">
//           {variantDetail.color_name
//             ? `Color: ${variantDetail.color_name}`
//             : "No image available"}
//         </p>
//       </div>
//     );
//   };

//   const getAbsoluteImageUrl = (url) => {
//     if (!url) return null;

//     // If it's already a full URL, return as is
//     if (url.startsWith("http://") || url.startsWith("https://")) {
//       return url;
//     }

//     // If it starts with /, assume it's relative to the base URL
//     if (url.startsWith("/")) {
//       return ` http://192.168.1.38:8000${url}`;
//     }

//     // For file paths
//     const cleanPath = url.replace(/^[\\/]+/, "");
//     return ` http://192.168.1.38:8000/uploads/coverPhotos/${cleanPath}`;
//   };

//   const handleViewLead = (lead) => {
//     setSelectedLead(lead);
//     setIsEditMode(false);
//     setIsModalOpen(true);

//     // Set filtered variants based on current lead's brand
//     const currentBrandId = lead.leadDetails?.[0]?.brand_id;
//     if (currentBrandId && variants.length > 0) {
//       const filtered = variants.filter(
//         (variant) => variant.brand_id == currentBrandId
//       );
//       setFilteredVariants(filtered);
//     } else {
//       setFilteredVariants([]);
//     }

//     // Set filtered colors based on current lead's variant
//     const currentVariantId = lead.leadDetails?.[0]?.variant_id;
//     if (currentVariantId && galleries.length > 0) {
//       const variantGalleries = galleries.filter(
//         (gallery) => gallery.variant_id == currentVariantId
//       );
//       const uniqueColorIds = [
//         ...new Set(variantGalleries.map((g) => g.color_id)),
//       ];
//       const variantColors = colors.filter((color) =>
//         uniqueColorIds.includes(color.id)
//       );
//       setFilteredColors(variantColors);
//     } else {
//       setFilteredColors([]);
//     }
//   };

//   const handleEditToggle = () => {
//     setIsEditMode(!isEditMode);
//   };

//   const handleBrandChange = (brandId) => {
//     // Update selected lead with new brand
//     const updatedLead = {
//       ...selectedLead,
//       leadDetails: [
//         {
//           ...selectedLead.leadDetails[0],
//           brand_id: brandId,
//           brand_name: brands.find((brand) => brand.id == brandId)?.name || "",
//           variant_id: "", // Reset variant when brand changes
//           variant_name: "",
//           color_id: "", // Reset color when brand changes
//           color_name: "",
//           color_code: "",
//         },
//       ],
//     };

//     setSelectedLead(updatedLead);

//     // Update filtered variants
//     if (brandId) {
//       const filtered = variants.filter(
//         (variant) => variant.brand_id == brandId
//       );
//       setFilteredVariants(filtered);
//     } else {
//       setFilteredVariants([]);
//     }

//     // Reset colors
//     setFilteredColors([]);
//   };

//   const handleVariantChange = (variantId) => {
//     const selectedVariant = variants.find((v) => v.id == variantId);
//     const updatedLead = {
//       ...selectedLead,
//       leadDetails: [
//         {
//           ...selectedLead.leadDetails[0],
//           variant_id: variantId,
//           variant_name: selectedVariant?.name || "",
//           color_id: "", // Reset color when variant changes
//           color_name: "",
//           color_code: "",
//         },
//       ],
//     };

//     setSelectedLead(updatedLead);

//     // Update filtered colors based on selected variant
//     if (variantId && galleries.length > 0) {
//       const variantGalleries = galleries.filter(
//         (gallery) => gallery.variant_id == variantId
//       );
//       const uniqueColorIds = [
//         ...new Set(variantGalleries.map((g) => g.color_id)),
//       ];
//       const variantColors = colors.filter((color) =>
//         uniqueColorIds.includes(color.id)
//       );
//       setFilteredColors(variantColors);
//     } else {
//       setFilteredColors([]);
//     }
//   };

//   const handleColorChange = (colorId) => {
//     const selectedColor = colors.find((c) => c.id == colorId);
//     const updatedLead = {
//       ...selectedLead,
//       leadDetails: [
//         {
//           ...selectedLead.leadDetails[0],
//           color_id: colorId,
//           color_name: selectedColor?.name || selectedColor?.color_name || "",
//           color_code: selectedColor?.color_code || "",
//         },
//       ],
//     };

//     setSelectedLead(updatedLead);
//   };

//   const handleSaveEdit = async () => {
//     if (!selectedLead) {
//       alert("No lead selected.");
//       return;
//     }

//     if (!selectedLead.leadDetails?.[0]) {
//       alert("No vehicle details available for this lead.");
//       return;
//     }

//     try {
//       const payload = {
//         customer_name: selectedLead.customer_name || "",
//         phone_no: selectedLead.phone_no || "",
//         location: selectedLead.location || "",
//         brand_id: selectedLead.leadDetails[0].brand_id || null,
//         variant_id: selectedLead.leadDetails[0].variant_id || null,
//         color_id: selectedLead.leadDetails[0].color_id || null,
//         payment_mode: selectedLead.payment_mode || "",
//         tentative_purchase_date: selectedLead.tentative_purchase_date || null,
//         vehicle_qty: selectedLead.vehicle_qty || 1,
//         oem_id: selectedLead.oem_id || null,
//       };

//       // Client-side validation
//       if (!payload.customer_name) throw new Error("Customer name is required.");
//       if (!payload.phone_no || !/^[0-9]{10}$/.test(payload.phone_no)) {
//         throw new Error("Phone number must be a valid 10-digit number.");
//       }
//       if (!payload.brand_id) throw new Error("Brand ID is required.");
//       if (!payload.variant_id) throw new Error("Variant ID is required.");
//       if (
//         !payload.payment_mode ||
//         !["cash", "finance"].includes(payload.payment_mode)
//       ) {
//         throw new Error("Payment mode must be 'cash' or 'finance'.");
//       }

//       console.log("Sending payload to update:", payload);
//       const response = await axios.put(
//         `${API_BASE}/lead-details/${selectedLead.id}`,
//         payload,
//         {
//           headers: getAuthHeaders(),
//         }
//       );
//       console.log("Update response:", response.data);
//       await fetchDraftLeads();
//       setIsEditMode(false);
//       alert("Draft information updated successfully.");
//     } catch (err) {
//       console.error(
//         "Failed to update draft:",
//         err.response?.data || err.message
//       );
//       if (err.response?.status === 422) {
//         console.log(
//           "Validation errors:",
//           JSON.stringify(err.response.data.errors, null, 2)
//         );
//       }
//       alert(
//         `Failed to update draft: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//   const handleDeleteDraft = async () => {
//     if (
//       !selectedLead ||
//       !window.confirm("Are you sure you want to delete this draft?")
//     ) {
//       return;
//     }

//     try {
//       await axios.delete(`${API_BASE}/lead-details/${selectedLead.id}`, {
//         headers: getAuthHeaders(),
//       });

//       setDraftLeads((prev) =>
//         prev.filter((lead) => lead.id !== selectedLead.id)
//       );
//       setIsModalOpen(false);
//       setSelectedLead(null);
//       alert("Draft deleted successfully!");
//     } catch (err) {
//       console.error("Failed to delete draft:", err);
//       alert("Failed to delete draft. Please try again.");
//     }
//   };

//   // const handleAddNewVehicle = () => {
//   //   if (!selectedLead) return;

//   //   try {
//   //     // Store customer details in localStorage for the next session
//   //     const customerData = {
//   //       customer_name: selectedLead.customer_name,
//   //       phone_no: selectedLead.phone_no,
//   //       location: selectedLead.location,
//   //       payment_mode: selectedLead.payment_mode,
//   //       oem_id: selectedLead.oem_id,
//   //       lead_id: selectedLead.lead_id,
//   //       timestamp: new Date().getTime(),
//   //     };

//   //     localStorage.setItem(
//   //       "existingCustomerData",
//   //       JSON.stringify(customerData)
//   //     );
//   //     localStorage.setItem("leadId", selectedLead.lead_id);

//   //     console.log("Stored customer data:", customerData);

//   //     // Navigate to lead generation
//   //     navigate("/leads/generate", {
//   //       state: {
//   //         existingCustomer: customerData,
//   //         isAddingAnotherVehicle: true,
//   //       },
//   //     });
//   //   } catch (err) {
//   //     console.error("Error in handleAddNewVehicle:", err);
//   //     alert("Failed to proceed to add vehicle.");
//   //   }
//   // };

//   const handleAddNewVehicle = () => {
//     if (!selectedLead) return;

//     try {
//       const customerData = {
//         customer_name: selectedLead.customer_name,
//         phone_no: selectedLead.phone_no,
//         location: selectedLead.location,
//         payment_mode: selectedLead.payment_mode,
//         oem_id: selectedLead.oem_id,
//         lead_id: selectedLead.lead_id,
//         timestamp: new Date().getTime(),
//         previous_lead_detail_id: selectedLead.id, // Store the previous lead detail ID
//       };

//       // Store data
//       localStorage.setItem(
//         "existingCustomerData",
//         JSON.stringify(customerData)
//       );
//       localStorage.setItem("leadId", selectedLead.lead_id);

//       console.log(
//         "Navigating to add new vehicle without updating status:",
//         customerData
//       );

//       // Navigate directly
//       navigate("/leads/generate", {
//         state: {
//           existingCustomer: customerData,
//           leadId: selectedLead.lead_id,
//           isAddingAnotherVehicle: true,
//           previousLeadDetailId: selectedLead.id, // Pass the previous ID
//         },
//       });

//       // Close modal
//       setIsModalOpen(false);
//       setSelectedLead(null);
//     } catch (err) {
//       console.error("Error in handleAddNewVehicle:", err);
//       alert("Failed to add another vehicle. Please try again.");
//     }
//   };

//   const handleSubmitDraft = async () => {
//     if (!selectedLead) return;

//     try {
//       console.log("Selected lead:", selectedLead);
//       console.log("Submitting draft with:", {
//         lead_id: selectedLead.lead_id,
//         lead_detail_id: selectedLead.id,
//         status: "Open",
//       });

//       const response = await axios.put(
//         `${API_BASE}/leads/${selectedLead.lead_id}/status`,
//         {
//           status: "Open",
//           lead_detail_id: selectedLead.id,
//         },
//         {
//           headers: getAuthHeaders(),
//         }
//       );

//       console.log("Submit response:", response.data);

//       if (response.data.success) {
//         setDraftLeads((prev) =>
//           prev.filter((lead) => lead.id !== selectedLead.id)
//         );
//         setIsModalOpen(false);
//         setSelectedLead(null);
//         alert("Lead submitted successfully!");
//         navigate("leads/draft");
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (err) {
//       console.error("Failed to submit draft:", err);
//       console.error("Error response:", err.response?.data);
//       console.error("Validation errors:", err.response?.data?.errors);

//       if (err.response?.data?.errors) {
//         const errorMessages = Object.values(err.response.data.errors)
//           .flat()
//           .join(", ");
//         alert(`Validation failed: ${errorMessages}`);
//       } else {
//         alert(
//           `Failed to submit draft: ${
//             err.response?.data?.message || err.message
//           }`
//         );
//       }
//     }
//   };

//   const handleSortChange = (order) => {
//     setSortOrder(order);
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh]">
//         <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
//         <span className="text-gray-600 font-medium mt-4">
//           Loading Draft Leads...
//         </span>
//       </div>
//     );
//   }

//   const sortedLeads = sortLeads(draftLeads, sortOrder);

//   return (
//     <div className="bg-gray-50 min-h-screen font-montserrat text-sm">
//       <section className="p-6">
//         <div className="container mx-auto px-0 max-w-7xl">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="sortLeads"
//                 className="text-xs font-medium text-gray-600"
//               >
//                 Sort Drafts by Age:
//               </label>
//               <select
//                 id="sortLeads"
//                 value={sortOrder}
//                 onChange={(e) => handleSortChange(e.target.value)}
//                 className="border border-secondary-grey rounded-md px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-primary-blue"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//               </select>
//             </div>
//           </div>

//           {error && draftLeads.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4">📝</div>
//               <h3 className="text-gray-500 text-xl font-medium mb-2">
//                 No Draft Leads
//               </h3>
//               <p className="text-gray-400 mb-6">{error}</p>
//               <button
//                 onClick={() => navigate("/leads/generate")}
//                 className="bg-[var(--primary-blue)] text-white rounded-lg px-6 py-3 hover:bg-blue-700 transition-colors"
//               >
//                 Create Your First Lead
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4">
//               {sortedLeads.map((lead) => {
//                 const leadDetail = lead.leadDetails?.[0];
//                 return (
//                   <div
//                     key={lead.id}
//                     className="lead-card bg-white p-5 rounded-lg shadow-md border-l-4 border-[var(--primary-blue)]"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h6 className="text-base font-semibold text-text-dark mb-1">
//                           {lead.customer_name}
//                         </h6>
//                         <p className="text-sm text-gray-600 mb-1">
//                           Interested in{" "}
//                           <span className="font-bold">
//                             {leadDetail?.variant_name ||
//                               `Variant ID: ${leadDetail?.variant_id}` ||
//                               "No variant selected"}
//                           </span>
//                         </p>
//                         <p className="text-sm text-gray-600 mb-0">
//                           {calculateLeadAge(lead.created_at)} day
//                           {calculateLeadAge(lead.created_at) !== 1
//                             ? "s"
//                             : ""}{" "}
//                           ago
//                         </p>
//                         <p className="text-sm text-gray-600 mb-0">
//                           Payment Mode:&nbsp;
//                           <span className="font-medium capitalize">
//                             {lead.payment_mode || "N/A"}
//                           </span>
//                         </p>
//                       </div>
//                       <div className="flex flex-col items-end">
//                         <button
//                           className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                           onClick={() => handleViewLead(lead)}
//                         >
//                           View
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </section>

//       {isModalOpen && selectedLead && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
//           <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
//             <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
//               <h5 className="text-base font-medium">
//                 Draft Details: {selectedLead.customer_name}
//               </h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>

//             <div className="p-4 md:p-6 flex-1 overflow-y-auto">
//               <form className="w-full">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
//                   <div className="space-y-3 md:space-y-4">
//                     <h6 className="text-base font-medium text-primary-blue mb-2 md:mb-3">
//                       Customer Details
//                     </h6>

//                     <div className="space-y-2 md:space-y-3">
//                       <div>
//                         <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
//                           Customer Name:
//                         </label>
//                         <input
//                           type="text"
//                           className={`w-full border border-secondary-grey rounded p-2 text-xs md:text-sm ${
//                             !isEditMode ? "bg-gray-50" : ""
//                           }`}
//                           value={selectedLead.customer_name || ""}
//                           readOnly={!isEditMode}
//                           onChange={(e) =>
//                             setSelectedLead({
//                               ...selectedLead,
//                               customer_name: e.target.value,
//                             })
//                           }
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
//                           Mobile Number:
//                         </label>
//                         <input
//                           type="tel"
//                           className={`w-full border border-secondary-grey rounded p-2 text-xs md:text-sm ${
//                             !isEditMode ? "bg-gray-50" : ""
//                           }`}
//                           value={selectedLead.phone_no || ""}
//                           readOnly={!isEditMode}
//                           onChange={(e) =>
//                             setSelectedLead({
//                               ...selectedLead,
//                               phone_no: e.target.value,
//                             })
//                           }
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
//                           Address:
//                         </label>
//                         <input
//                           type="text"
//                           className={`w-full border border-secondary-grey rounded p-2 text-xs md:text-sm ${
//                             !isEditMode ? "bg-gray-50" : ""
//                           }`}
//                           value={selectedLead.location || ""}
//                           readOnly={!isEditMode}
//                           onChange={(e) =>
//                             setSelectedLead({
//                               ...selectedLead,
//                               location: e.target.value,
//                             })
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   <div className="space-y-3 md:space-y-4">
//                     <h6 className="text-base font-medium text-primary-blue mb-2 md:mb-3">
//                       Vehicle Details
//                     </h6>

//                     <div className="space-y-2 md:space-y-3">
//                       <div>
//                         <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
//                           Model Image:
//                         </label>
//                         <div className="flex justify-center items-center bg-gray-100 rounded border border-secondary-grey p-2 md:p-3">
//                           {getVariantImageForModal(
//                             selectedLead.leadDetails?.[0]
//                           )}
//                         </div>
//                       </div>

//                       <div>
//                         <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
//                           Brand Name:
//                         </label>
//                         <select
//                           className={`w-full border border-secondary-grey rounded p-2 text-xs md:text-sm ${
//                             !isEditMode ? "bg-gray-50" : ""
//                           }`}
//                           value={selectedLead.leadDetails?.[0]?.brand_id || ""}
//                           disabled={!isEditMode}
//                           onChange={(e) => handleBrandChange(e.target.value)}
//                         >
//                           <option value="">Select brand</option>
//                           {brands.map((brand) => (
//                             <option key={brand.id} value={brand.id}>
//                               {brand.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
//                           Vehicle Model:
//                         </label>
//                         <select
//                           className={`w-full border border-secondary-grey rounded p-2 text-xs md:text-sm ${
//                             !isEditMode ? "bg-gray-50" : ""
//                           }`}
//                           value={
//                             selectedLead.leadDetails?.[0]?.variant_id || ""
//                           }
//                           disabled={!isEditMode}
//                           onChange={(e) => handleVariantChange(e.target.value)}
//                         >
//                           <option value="">Select model</option>
//                           {filteredVariants.map((variant) => (
//                             <option key={variant.id} value={variant.id}>
//                               {variant.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       <div>
//                         <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
//                           Color:
//                         </label>
//                         <select
//                           className={`w-full border border-secondary-grey rounded p-2 text-xs md:text-sm ${
//                             !isEditMode ? "bg-gray-50" : ""
//                           }`}
//                           value={selectedLead.leadDetails?.[0]?.color_id || ""}
//                           disabled={!isEditMode || filteredColors.length === 0}
//                           onChange={(e) => handleColorChange(e.target.value)}
//                         >
//                           <option value="">
//                             {filteredColors.length === 0
//                               ? "No colors available"
//                               : "Select color"}
//                           </option>
//                           {filteredColors.map((color) => (
//                             <option key={color.id} value={color.id}>
//                               {color.name || color.color_name}
//                             </option>
//                           ))}
//                         </select>
//                         {selectedLead.leadDetails?.[0]?.color_code && (
//                           <div className="flex items-center mt-1">
//                             <div
//                               className="w-4 h-4 rounded-full border border-gray-300 mr-2"
//                               style={{
//                                 backgroundColor:
//                                   selectedLead.leadDetails[0].color_code,
//                               }}
//                             ></div>
//                             <span className="text-xs text-gray-500">
//                               {selectedLead.leadDetails[0].color_code}
//                             </span>
//                           </div>
//                         )}
//                       </div>

//                       <div>
//                         <label className="block text-xs md:text-sm font-medium text-gray-600 mb-1">
//                           Payment Mode:
//                         </label>
//                         <select
//                           className={`w-full border border-secondary-grey rounded p-2 text-xs md:text-sm ${
//                             !isEditMode ? "bg-gray-50" : ""
//                           }`}
//                           value={selectedLead.payment_mode || ""}
//                           disabled={!isEditMode}
//                           onChange={(e) =>
//                             setSelectedLead({
//                               ...selectedLead,
//                               payment_mode: e.target.value,
//                             })
//                           }
//                         >
//                           <option value="">Select payment mode</option>
//                           <option value="finance">Finance</option>
//                           <option value="cash">Cash</option>
//                         </select>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>

//             <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-0 p-3 md:p-4 flex-shrink-0 border-t border-secondary-grey">
//               <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2">
//                 <button
//                   type="button"
//                   className="bg-red-500 text-white rounded-md px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm mr-0 sm:mr-2 hover:bg-red-600 transition-colors"
//                   onClick={handleDeleteDraft}
//                 >
//                   Delete
//                 </button>
//                 <button
//                   type="button"
//                   className="bg-[var(--primary-blue)] text-white rounded-md px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm mr-0 sm:mr-2 hover:bg-blue-700 transition-colors"
//                   onClick={isEditMode ? handleSaveEdit : handleEditToggle}
//                 >
//                   {isEditMode ? "Save" : "Edit"}
//                 </button>
//                 <button
//                   type="button"
//                   className="bg-[var(--primary-blue)] text-white rounded-md px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm mr-0 sm:mr-2 hover:bg-blue-700 transition-colors"
//                   onClick={handleAddNewVehicle}
//                 >
//                   Add Another Vehicle
//                 </button>
//                 <button
//                   type="button"
//                   className="bg-[var(--primary-blue)] text-white rounded-md px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-sm hover:bg-blue-700 transition-colors"
//                   onClick={handleSubmitDraft}
//                 >
//                   Submit as Open
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DraftLeads;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const DraftLeads = () => {
//   const [draftLeads, setDraftLeads] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [sortOrder, setSortOrder] = useState("newest");
//   const [galleries, setGalleries] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [variants, setVariants] = useState([]);
//   const [filteredVariants, setFilteredVariants] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [filteredColors, setFilteredColors] = useState([]);

//   const navigate = useNavigate();

//   const API_BASE = " http://192.168.1.38:8000/api";
//   const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   useEffect(() => {
//     fetchDraftLeads();
//     fetchGalleries();
//     fetchBrands();
//     fetchVariants();
//     fetchColors();
//   }, []);

//   const fetchDraftLeads = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_BASE}/lead-details/draft`, {
//         headers: getAuthHeaders(),
//       });

//       if (res.data.success) {
//         const leads = res.data.data || [];
//         setDraftLeads(leads);
//         if (leads.length === 0) {
//           setError("No draft leads found.");
//         }
//       } else {
//         setError(res.data.message || "Failed to fetch draft leads.");
//       }
//     } catch (err) {
//       console.error("Failed to fetch draft leads:", err);
//       setError("Failed to fetch draft leads. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchGalleries = async () => {
//     try {
//       const galleriesRes = await axios.get(`${API_BASE}/galleries`, {
//         headers: getAuthHeaders(),
//       });
//       setGalleries(galleriesRes.data.data || galleriesRes.data || []);
//     } catch (err) {
//       console.error("Error fetching galleries:", err);
//     }
//   };

//   const fetchBrands = async () => {
//     try {
//       const brandsRes = await axios.get(`${API_BASE}/brands`, {
//         headers: getAuthHeaders(),
//       });
//       setBrands(brandsRes.data.data || brandsRes.data || []);
//     } catch (err) {
//       console.error("Error fetching brands:", err);
//     }
//   };

//   const fetchVariants = async () => {
//     try {
//       const variantsRes = await axios.get(`${API_BASE}/variants`, {
//         headers: getAuthHeaders(),
//       });
//       setVariants(variantsRes.data.data || variantsRes.data || []);
//     } catch (err) {
//       console.error("Error fetching variants:", err);
//     }
//   };

//   const fetchColors = async () => {
//     try {
//       const colorsRes = await axios.get(`${API_BASE}/colors`, {
//         headers: getAuthHeaders(),
//       });
//       setColors(colorsRes.data.data || colorsRes.data || []);
//     } catch (err) {
//       console.error("Error fetching colors:", err);
//     }
//   };

//   const calculateLeadAge = (createdDate) => {
//     const currentDate = new Date();
//     const leadDate = new Date(createdDate);
//     const diffTime = currentDate - leadDate;
//     const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   const getDraftAgeClass = (days) => {
//     return days <= 3 ? "draft-new" : "draft-old";
//   };

//   // const getVariantImage = (variantDetail) => {
//   //   if (!variantDetail?.variant_id) {
//   //     return "https://via.placeholder.com/240x160/f3f4f6/6b7280?text=No+Image";
//   //   }

//   //   let variantGallery = null;

//   //   if (variantDetail.color_id) {
//   //     variantGallery = galleries.find(
//   //       (g) =>
//   //         g.variant_id === variantDetail.variant_id &&
//   //         g.color_id == variantDetail.color_id
//   //     );
//   //   }

//   //   if (!variantGallery) {
//   //     variantGallery = galleries.find(
//   //       (g) => g.variant_id === variantDetail.variant_id
//   //     );
//   //   }

//   //   if (variantGallery?.cover_photos) {
//   //     let images = [];
//   //     try {
//   //       images = JSON.parse(variantGallery.cover_photos);
//   //       if (!Array.isArray(images)) images = [variantGallery.cover_photos];
//   //     } catch (e) {
//   //       images = [variantGallery.cover_photos];
//   //     }

//   //     if (images[0]) {
//   //       return getAbsoluteImageUrl(images[0]);
//   //     }
//   //   }

//   //   return "https://via.placeholder.com/240x160/f3f4f6/6b7280?text=No+Image";
//   // };
//   const getVariantImage = (variantDetail) => {
//     if (!variantDetail?.variant_id) {
//       return "https://via.placeholder.com/240x160/f3f4f6/6b7280?text=No+Image";
//     }

//     let variantGallery = null;

//     // First try to find gallery with exact variant_id and color_id match
//     if (variantDetail.color_id) {
//       variantGallery = galleries.find(
//         (g) =>
//           g.variant_id === variantDetail.variant_id &&
//           g.color_id == variantDetail.color_id
//       );
//     }

//     // If no color-specific image found, try to find any image for this variant
//     if (!variantGallery) {
//       variantGallery = galleries.find(
//         (g) => g.variant_id === variantDetail.variant_id
//       );
//     }

//     if (variantGallery?.cover_photos) {
//       let images = [];
//       try {
//         images = JSON.parse(variantGallery.cover_photos);
//         if (!Array.isArray(images)) images = [variantGallery.cover_photos];
//       } catch (e) {
//         images = [variantGallery.cover_photos];
//       }

//       if (images[0]) {
//         return getAbsoluteImageUrl(images[0]);
//       }
//     }

//     return "https://via.placeholder.com/240x160/f3f4f6/6b7280?text=No+Image";
//   };

//   const getAbsoluteImageUrl = (url) => {
//     if (!url) return null;
//     if (url.startsWith("http://") || url.startsWith("https://")) {
//       return url;
//     }
//     if (url.startsWith("/")) {
//       return ` http://192.168.1.38:8000${url}`;
//     }
//     const cleanPath = url.replace(/^[\\/]+/, "");
//     return ` http://192.168.1.38:8000/uploads/coverPhotos/${cleanPath}`;
//   };

//   const handleViewLead = async (lead) => {
//     try {
//       // Fetch fresh lead data before opening view modal
//       const freshLeadRes = await axios.get(
//         `${API_BASE}/leads/${lead.lead_id}`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );

//       if (freshLeadRes.data.success) {
//         const freshLead = freshLeadRes.data.data;

//         // Transform the data to match the expected structure
//         const transformedLead = {
//           ...freshLead,
//           // Map details to leadDetails for consistent structure
//           leadDetails: freshLead.details
//             ? freshLead.details.map((detail) => ({
//                 id: detail.id,
//                 lead_id: detail.lead_id,
//                 brand_id: detail.brand_id,
//                 variant_id: detail.variant_id,
//                 color_id: detail.color_id,
//                 brand_name: detail.brand?.name || "",
//                 variant_name: detail.variant?.name || "",
//                 color_name:
//                   detail.color?.name || detail.color?.color_name || "",
//                 color_code: detail.color?.color_code || "",
//               }))
//             : [],
//         };

//         setSelectedLead(transformedLead);
//       } else {
//         setSelectedLead(lead);
//       }
//     } catch (err) {
//       console.warn(
//         "Could not fetch fresh lead data for view, using cached:",
//         err.message
//       );
//       setSelectedLead(lead);
//     }

//     setIsViewModalOpen(true);
//   };

//   const handleEditLead = async (lead) => {
//     try {
//       // Fetch fresh lead data before opening edit modal
//       const freshLeadRes = await axios.get(
//         `${API_BASE}/leads/${lead.lead_id}`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );

//       if (freshLeadRes.data.success) {
//         setSelectedLead(freshLeadRes.data.data);
//       } else {
//         setSelectedLead(lead);
//       }
//     } catch (err) {
//       console.warn(
//         "Could not fetch fresh lead data, using cached:",
//         err.message
//       );
//       setSelectedLead(lead);
//     }

//     // Filter variants and colors based on current lead data
//     const currentBrandId = lead.leadDetails?.[0]?.brand_id;
//     if (currentBrandId && variants.length > 0) {
//       const filtered = variants.filter(
//         (variant) => variant.brand_id == currentBrandId
//       );
//       setFilteredVariants(filtered);
//     } else {
//       setFilteredVariants([]);
//     }

//     const currentVariantId = lead.leadDetails?.[0]?.variant_id;
//     if (currentVariantId && galleries.length > 0) {
//       const variantGalleries = galleries.filter(
//         (gallery) => gallery.variant_id == currentVariantId
//       );
//       const uniqueColorIds = [
//         ...new Set(variantGalleries.map((g) => g.color_id)),
//       ];
//       const variantColors = colors.filter((color) =>
//         uniqueColorIds.includes(color.id)
//       );
//       setFilteredColors(variantColors);
//     } else {
//       setFilteredColors([]);
//     }

//     setIsEditModalOpen(true);
//   };

//   const handleDeleteLead = async (leadId) => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this lead? This action cannot be undone."
//       )
//     ) {
//       return;
//     }

//     try {
//       await axios.delete(`${API_BASE}/lead-details/${leadId}`, {
//         headers: getAuthHeaders(),
//       });

//       setDraftLeads((prev) => prev.filter((lead) => lead.id !== leadId));
//       if (selectedLead?.id === leadId) {
//         setIsViewModalOpen(false);
//         setIsEditModalOpen(false);
//         setSelectedLead(null);
//       }
//       alert("Lead deleted successfully!");
//     } catch (err) {
//       console.error("Failed to delete lead:", err);
//       alert("Failed to delete lead. Please try again.");
//     }
//   };

//   const handleDeleteVehicle = async (vehicleIndex) => {
//     if (!selectedLead) return;

//     const vehicle = selectedLead.leadDetails[vehicleIndex];

//     // If it's a vehicle that exists in the database (has a numeric ID), confirm deletion
//     if (vehicle.id && typeof vehicle.id === "number" && vehicle.id > 0) {
//       if (
//         !window.confirm(
//           "Are you sure you want to delete this vehicle? This action cannot be undone."
//         )
//       ) {
//         return;
//       }

//       try {
//         await axios.delete(`${API_BASE}/lead-details/${vehicle.id}`, {
//           headers: getAuthHeaders(),
//         });

//         // Remove the vehicle from local state
//         const updatedLeadDetails = selectedLead.leadDetails.filter(
//           (_, index) => index !== vehicleIndex
//         );

//         setSelectedLead({
//           ...selectedLead,
//           leadDetails: updatedLeadDetails,
//         });

//         alert("Vehicle deleted successfully!");
//       } catch (err) {
//         console.error("Failed to delete vehicle:", err);
//         alert("Failed to delete vehicle. Please try again.");
//       }
//     } else {
//       // If it's a temporary vehicle (not saved to database yet), just remove from local state
//       const updatedLeadDetails = selectedLead.leadDetails.filter(
//         (_, index) => index !== vehicleIndex
//       );

//       setSelectedLead({
//         ...selectedLead,
//         leadDetails: updatedLeadDetails,
//       });
//     }
//   };

//   const handleBrandChange = (brandId, vehicleIndex) => {
//     const updatedLeadDetails = [...selectedLead.leadDetails];
//     updatedLeadDetails[vehicleIndex] = {
//       ...updatedLeadDetails[vehicleIndex],
//       brand_id: brandId,
//       brand_name: brands.find((brand) => brand.id == brandId)?.name || "",
//       variant_id: "",
//       variant_name: "",
//       color_id: "",
//       color_name: "",
//       color_code: "",
//     };

//     setSelectedLead({
//       ...selectedLead,
//       leadDetails: updatedLeadDetails,
//     });
//   };

//   const handleVariantChange = (variantId, vehicleIndex) => {
//     const selectedVariant = variants.find((v) => v.id == variantId);
//     const updatedLeadDetails = [...selectedLead.leadDetails];
//     updatedLeadDetails[vehicleIndex] = {
//       ...updatedLeadDetails[vehicleIndex],
//       variant_id: variantId,
//       variant_name: selectedVariant?.name || "",
//       color_id: "",
//       color_name: "",
//       color_code: "",
//     };

//     setSelectedLead({
//       ...selectedLead,
//       leadDetails: updatedLeadDetails,
//     });
//   };

//   const handleColorChange = (colorId, vehicleIndex) => {
//     const selectedColor = colors.find((c) => c.id == colorId);
//     const updatedLeadDetails = [...selectedLead.leadDetails];
//     updatedLeadDetails[vehicleIndex] = {
//       ...updatedLeadDetails[vehicleIndex],
//       color_id: colorId,
//       color_name: selectedColor?.name || selectedColor?.color_name || "",
//       color_code: selectedColor?.color_code || "",
//     };

//     setSelectedLead({
//       ...selectedLead,
//       leadDetails: updatedLeadDetails,
//     });
//   };

//   const handleSaveEdit = async () => {
//     if (!selectedLead) {
//       alert("No lead selected.");
//       return;
//     }

//     try {
//       // Update the main lead information
//       const leadPayload = {
//         customer_name: selectedLead.customer_name || "",
//         phone_no: selectedLead.phone_no || "",
//         location: selectedLead.location || "",
//         payment_mode: selectedLead.payment_mode || "",
//         tentative_purchase_date: selectedLead.tentative_purchase_date || null,
//         vehicle_qty: selectedLead.vehicle_qty || 1,
//         oem_id: selectedLead.oem_id || null,
//         status: "Draft",
//       };

//       if (!leadPayload.customer_name)
//         throw new Error("Customer name is required.");
//       if (!leadPayload.phone_no || !/^[0-9]{10}$/.test(leadPayload.phone_no)) {
//         throw new Error("Phone number must be a valid 10-digit number.");
//       }

//       console.log("Updating lead ID:", selectedLead.lead_id);
//       console.log("Saving lead with data:", leadPayload);

//       // Update the main lead
//       await axios.put(
//         `${API_BASE}/leads/${selectedLead.lead_id}`,
//         leadPayload,
//         { headers: getAuthHeaders() }
//       );

//       // Update the local state immediately
//       const updatedSelectedLead = {
//         ...selectedLead,
//         customer_name: leadPayload.customer_name,
//         phone_no: leadPayload.phone_no,
//         location: leadPayload.location,
//         payment_mode: leadPayload.payment_mode,
//         tentative_purchase_date: leadPayload.tentative_purchase_date,
//         vehicle_qty: leadPayload.vehicle_qty,
//         oem_id: leadPayload.oem_id,
//       };

//       setSelectedLead(updatedSelectedLead);

//       // Update the draftLeads array
//       setDraftLeads((prevLeads) =>
//         prevLeads.map((lead) =>
//           lead.id === selectedLead.id
//             ? { ...lead, ...updatedSelectedLead }
//             : lead
//         )
//       );

//       // Close modal and show success
//       setIsEditModalOpen(false);
//       alert("Draft information updated successfully!");
//     } catch (err) {
//       console.error("Failed to update draft:", err);
//       alert(
//         `Failed to update draft: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//   const handleSubmitDraft = async () => {
//     if (!selectedLead) return;

//     try {
//       const response = await axios.put(
//         `${API_BASE}/leads/${selectedLead.lead_id}/status`,
//         {
//           status: "Open",
//           lead_detail_id: selectedLead.id,
//         },
//         {
//           headers: getAuthHeaders(),
//         }
//       );

//       if (response.data.success) {
//         setDraftLeads((prev) =>
//           prev.filter((lead) => lead.id !== selectedLead.id)
//         );
//         setIsViewModalOpen(false);
//         setIsEditModalOpen(false);
//         setSelectedLead(null);
//         alert("Lead submitted successfully!");
//       } else {
//         throw new Error(response.data.message);
//       }
//     } catch (err) {
//       console.error("Failed to submit draft:", err);
//       alert(
//         `Failed to submit draft: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//   const handleAddNewVehicle = () => {
//     const newVehicle = {
//       id: selectedLead.leadDetails.length + 1,
//       brand_id: "",
//       brand_name: "",
//       variant_id: "",
//       variant_name: "",
//       color_id: "",
//       color_name: "",
//       color_code: "",
//     };

//     setSelectedLead({
//       ...selectedLead,
//       leadDetails: [...selectedLead.leadDetails, newVehicle],
//     });
//   };

//   const sortLeadsByAge = (order) => {
//     if (order === "newest") {
//       setDraftLeads((prev) =>
//         [...prev].sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         )
//       );
//     } else {
//       setDraftLeads((prev) =>
//         [...prev].sort(
//           (a, b) => new Date(a.created_at) - new Date(b.created_at)
//         )
//       );
//     }
//   };

//   if (loading) {
//     return (
//       <div
//         className="flex flex-col items-center justify-center min-h-[60vh]"
//         style={{ fontFamily: "Montserrat, sans-serif" }}
//       >
//         <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
//         <span className="text-gray-600 font-medium mt-4">
//           Loading Draft Leads...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="bg-gray-50 min-h-screen"
//       style={{ fontFamily: "Montserrat, sans-serif" }}
//     >
//       {/* Draft Leads Section */}
//       <section className="p-4 md:p-6">
//         <div className="container mx-auto px-0 max-w-7xl">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="sortLeads"
//                 className="text-xs font-medium text-gray-600"
//               >
//                 Sort Drafts by Age:
//               </label>
//               <select
//                 id="sortLeads"
//                 value={sortOrder}
//                 onChange={(e) => {
//                   setSortOrder(e.target.value);
//                   sortLeadsByAge(e.target.value);
//                 }}
//                 className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-[#0f66af]"
//                 style={{ fontFamily: "Montserrat, sans-serif" }}
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//               </select>
//             </div>
//           </div>

//           {error && draftLeads.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4">📝</div>
//               <h3 className="text-gray-500 text-xl font-medium mb-2">
//                 No Draft Leads
//               </h3>
//               <p className="text-gray-400 mb-6">{error}</p>
//               <button
//                 onClick={() => navigate("/leads/generate")}
//                 className="bg-[#0f66af] text-white rounded-lg px-6 py-3 hover:bg-[#084a8a] transition-colors"
//                 style={{ fontFamily: "Montserrat, sans-serif" }}
//               >
//                 Create Your First Lead
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4" id="leadsContainer">
//               {draftLeads.map((lead) => {
//                 const leadDetail = lead.leadDetails?.[0];
//                 const draftAge = calculateLeadAge(lead.created_at);
//                 const draftAgeClass = getDraftAgeClass(draftAge);

//                 return (
//                   <div
//                     key={lead.id}
//                     className="lead-card bg-white p-5 rounded-lg shadow-md border-l-4 border-[#0f66af]"
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-start justify-between">
//                           <h6 className="text-base font-semibold text-gray-800 mb-1">
//                             {lead.customer_name}
//                           </h6>
//                           <div className="desktop-actions flex gap-2">
//                             <div
//                               className="action-btn btn-view"
//                               title="View"
//                               onClick={() => handleViewLead(lead)}
//                             >
//                               <i className="bi bi-eye"></i>
//                             </div>
//                             <div
//                               className="action-btn btn-edit"
//                               title="Edit"
//                               onClick={() => handleEditLead(lead)}
//                             >
//                               <i className="bi bi-pencil"></i>
//                             </div>
//                             <div
//                               className="action-btn btn-delete"
//                               title="Delete"
//                               onClick={() => handleDeleteLead(lead.id)}
//                             >
//                               <i className="bi bi-trash"></i>
//                             </div>
//                           </div>
//                         </div>

//                         <p className="text-sm text-gray-600 mb-1">
//                           {leadDetail?.variant_name ||
//                             `Variant ID: ${leadDetail?.variant_id}` ||
//                             "No variant selected"}
//                         </p>

//                         <div className="flex items-center gap-2 mt-2">
//                           <span className={`draft-age ${draftAgeClass}`}>
//                             {draftAge} day{draftAge !== 1 ? "s" : ""} old
//                           </span>
//                           <span
//                             className={`payment-badge ${
//                               lead.payment_mode === "cash"
//                                 ? "payment-cash"
//                                 : "payment-finance"
//                             }`}
//                           >
//                             {lead.payment_mode}
//                           </span>
//                         </div>

//                         <div className="mobile-actions flex gap-2 mt-3">
//                           <div
//                             className="action-btn btn-view"
//                             title="View"
//                             onClick={() => handleViewLead(lead)}
//                           >
//                             <i className="bi bi-eye"></i>
//                           </div>
//                           <div
//                             className="action-btn btn-edit"
//                             title="Edit"
//                             onClick={() => handleEditLead(lead)}
//                           >
//                             <i className="bi bi-pencil"></i>
//                           </div>
//                           <div
//                             className="action-btn btn-delete"
//                             title="Delete"
//                             onClick={() => handleDeleteLead(lead.id)}
//                           >
//                             <i className="bi bi-trash"></i>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* View Lead Modal */}
//       {isViewModalOpen && selectedLead && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
//           <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
//             <div className="bg-[#0f66af] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
//               <h5 className="text-base font-medium">Lead Details</h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsViewModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>

//             <div className="p-4 flex-1 overflow-y-auto">
//               {/* Debug info */}
//               {console.log("View Modal - selectedLead data:", selectedLead)}
//               {console.log(
//                 "View Modal - leadDetails:",
//                 selectedLead.leadDetails
//               )}

//               {/* Customer Information */}
//               <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
//                 <h6 className="text-base font-medium text-[#0f66af] mb-3 flex items-center">
//                   <i className="bi bi-person-fill mr-2"></i> Customer
//                   Information
//                 </h6>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">
//                       Name
//                     </label>
//                     <p className="text-sm font-medium text-gray-800">
//                       {selectedLead.customer_name}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">
//                       Mobile No.
//                     </label>
//                     <p className="text-sm font-medium text-gray-800">
//                       {selectedLead.phone_no}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">
//                       Location
//                     </label>
//                     <p className="text-sm font-medium text-gray-800">
//                       {selectedLead.location || "N/A"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">
//                       Address
//                     </label>
//                     <p className="text-sm font-medium text-gray-800">
//                       {selectedLead.location || "N/A"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Vehicle Information */}
//               {selectedLead.leadDetails &&
//               selectedLead.leadDetails.length > 0 ? (
//                 selectedLead.leadDetails.map((vehicle, index) => {
//                   const variant = variants.find(
//                     (v) => v.id === vehicle.variant_id
//                   );
//                   const brand = brands.find((b) => b.id === vehicle.brand_id);
//                   const color = colors.find((c) => c.id === vehicle.color_id);

//                   return (
//                     <div
//                       key={vehicle.id || index}
//                       className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200"
//                     >
//                       <div className="flex justify-between items-center mb-3">
//                         <h6 className="text-base font-medium text-[#0f66af] flex items-center">
//                           <i className="bi bi-bicycle mr-2"></i> Vehicle{" "}
//                           {index + 1}
//                         </h6>
//                       </div>

//                       <div className="flex flex-col md:flex-row gap-4">
//                         {/* Left Side - Vehicle Image */}
//                         <div className="md:w-1/3">
//                           <img
//                             src={getVariantImage(vehicle)}
//                             alt={vehicle.variant_name || "Vehicle"}
//                             className="w-full h-48 object-cover rounded-lg"
//                             onError={(e) => {
//                               e.target.src =
//                                 "https://via.placeholder.com/400x300/f3f4f6/6b7280?text=No+Image";
//                             }}
//                           />
//                           {/* Color preview */}
//                           {vehicle.color_code && (
//                             <div className="mt-2 flex items-center justify-center">
//                               <div
//                                 className="w-6 h-6 rounded-full border border-gray-300 mr-2"
//                                 style={{ backgroundColor: vehicle.color_code }}
//                               ></div>
//                               <span className="text-xs text-gray-600">
//                                 {vehicle.color_name || "Selected Color"}
//                               </span>
//                             </div>
//                           )}
//                         </div>

//                         {/* Right Side - Vehicle Details */}
//                         <div className="md:w-2/3">
//                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                               <label className="block text-sm font-medium text-gray-600">
//                                 Brand
//                               </label>
//                               <p className="text-sm font-medium text-gray-800">
//                                 {brand?.name || vehicle.brand_name || "N/A"}
//                               </p>
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-gray-600">
//                                 Variant
//                               </label>
//                               <p className="text-sm font-medium text-gray-800">
//                                 {vehicle.variant_name || variant?.name || "N/A"}
//                               </p>
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-gray-600">
//                                 Color
//                               </label>
//                               <p className="text-sm font-medium text-gray-800">
//                                 {color?.name ||
//                                   color?.color_name ||
//                                   vehicle.color_name ||
//                                   "N/A"}
//                               </p>
//                             </div>

//                             <div>
//                               <label className="block text-sm font-medium text-gray-600">
//                                 Price
//                               </label>
//                               <p className="text-sm font-medium text-gray-800">
//                                 {variant?.basic_price
//                                   ? `₹${parseFloat(
//                                       variant.basic_price
//                                     ).toLocaleString()}`
//                                   : "Price on request"}
//                               </p>
//                             </div>

//                             {index === 0 && (
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Payment Mode
//                                 </label>
//                                 <p className="text-sm font-medium text-gray-800">
//                                   <span
//                                     className={`payment-badge ${
//                                       selectedLead.payment_mode === "cash"
//                                         ? "payment-cash"
//                                         : "payment-finance"
//                                     }`}
//                                   >
//                                     {selectedLead.payment_mode}
//                                   </span>
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
//                   <div className="text-center py-6">
//                     <i className="bi bi-car-front text-4xl text-gray-400 mb-2"></i>
//                     <p className="text-gray-500">
//                       No vehicle details available
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Additional Lead Information */}
//               <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
//                 <h6 className="text-base font-medium text-[#0f66af] mb-3 flex items-center">
//                   <i className="bi bi-info-circle mr-2"></i> Additional
//                   Information
//                 </h6>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">
//                       Tentative Purchase Date
//                     </label>
//                     <p className="text-sm font-medium text-gray-800">
//                       {selectedLead.tentative_purchase_date
//                         ? new Date(
//                             selectedLead.tentative_purchase_date
//                           ).toLocaleDateString()
//                         : "Not specified"}
//                     </p>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600">
//                       Vehicle Quantity
//                     </label>
//                     <p className="text-sm font-medium text-gray-800">
//                       {selectedLead.vehicle_qty ||
//                         (selectedLead.leadDetails
//                           ? selectedLead.leadDetails.length
//                           : 1)}
//                     </p>
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-600">
//                       Additional Notes
//                     </label>
//                     <p className="text-sm font-medium text-gray-800">
//                       {selectedLead.additional_note || "No additional notes"}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end mt-4 gap-2">
//                 <button
//                   className="bg-[#0f66af] text-white rounded-md px-4 py-2 text-sm hover:bg-[#084a8a] transition-colors"
//                   style={{ fontFamily: "Montserrat, sans-serif" }}
//                   onClick={handleSubmitDraft}
//                 >
//                   Submit Lead
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Lead Modal */}
//       {isEditModalOpen && selectedLead && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
//           <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
//             <div className="bg-[#0f66af] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
//               <h5 className="text-base font-medium">Edit Lead</h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsEditModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>

//             <div className="p-4 flex-1 overflow-y-auto">
//               {/* Customer Information Form */}
//               <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
//                 <h6 className="text-base font-medium text-[#0f66af] mb-3 flex items-center">
//                   <i className="bi bi-person-fill mr-2"></i> Customer
//                   Information
//                 </h6>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Name *
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-gray-300 rounded p-2 text-sm"
//                       style={{ fontFamily: "Montserrat, sans-serif" }}
//                       value={selectedLead.customer_name || ""}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           customer_name: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Mobile No. *
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-gray-300 rounded p-2 text-sm"
//                       style={{ fontFamily: "Montserrat, sans-serif" }}
//                       value={selectedLead.phone_no || ""}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           phone_no: e.target.value,
//                         })
//                       }
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Location
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-gray-300 rounded p-2 text-sm"
//                       style={{ fontFamily: "Montserrat, sans-serif" }}
//                       value={selectedLead.location || ""}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           location: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Payment Mode
//                     </label>
//                     <select
//                       className="w-full border border-gray-300 rounded p-2 text-sm"
//                       style={{ fontFamily: "Montserrat, sans-serif" }}
//                       value={selectedLead.payment_mode || "cash"}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           payment_mode: e.target.value,
//                         })
//                       }
//                     >
//                       <option value="cash">Cash</option>
//                       <option value="finance">Finance</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Tentative Purchase Date
//                     </label>
//                     <input
//                       type="date"
//                       className="w-full border border-gray-300 rounded p-2 text-sm"
//                       style={{ fontFamily: "Montserrat, sans-serif" }}
//                       value={selectedLead.tentative_purchase_date || ""}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           tentative_purchase_date: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Vehicle Quantity
//                     </label>
//                     <input
//                       type="number"
//                       className="w-full border border-gray-300 rounded p-2 text-sm"
//                       style={{ fontFamily: "Montserrat, sans-serif" }}
//                       value={
//                         selectedLead.vehicle_qty ||
//                         selectedLead.leadDetails?.length ||
//                         1
//                       }
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           vehicle_qty: parseInt(e.target.value) || 1,
//                         })
//                       }
//                       min="1"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Vehicle Information */}
//               <div className="mb-4">
//                 <h6 className="text-base font-medium text-[#0f66af] mb-3 flex items-center">
//                   <i className="bi bi-bicycle mr-2"></i> Vehicle Information
//                   <span className="ml-2 text-sm text-gray-500">
//                     ({selectedLead.leadDetails?.length || 0} vehicles)
//                   </span>
//                 </h6>

//                 {selectedLead.leadDetails?.map((vehicle, index) => (
//                   <div
//                     key={vehicle.id || `temp-${index}`}
//                     className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200 relative"
//                   >
//                     {/* Delete Vehicle Button */}
//                     {selectedLead.leadDetails.length > 1 && (
//                       <button
//                         type="button"
//                         className="absolute top-3 right-3 text-red-500 hover:text-red-700"
//                         onClick={() => handleDeleteVehicle(index)}
//                         title="Delete Vehicle"
//                       >
//                         <i className="bi bi-trash"></i>
//                       </button>
//                     )}

//                     <div className="flex justify-between items-center mb-3">
//                       <h6 className="text-base font-medium text-gray-700 flex items-center">
//                         <i className="bi bi-car-front mr-2"></i> Vehicle{" "}
//                         {index + 1}
//                         {vehicle.id && (
//                           <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                             ID: {vehicle.id}
//                           </span>
//                         )}
//                       </h6>
//                     </div>

//                     <div className="flex flex-col md:flex-row gap-6">
//                       {/* Left Side - Vehicle Image */}
//                       <div className="md:w-2/5">
//                         <div className="relative">
//                           <img
//                             src={getVariantImage(vehicle)}
//                             alt={vehicle.variant_name || "Vehicle"}
//                             className="w-full h-64 object-contain rounded-lg border border-gray-200"
//                             onError={(e) => {
//                               e.target.src =
//                                 "https://via.placeholder.com/400x300/f3f4f6/6b7280?text=No+Image";
//                             }}
//                           />
//                           {/* Color Preview */}
//                           {vehicle.color_code && (
//                             <div className="mt-2 flex items-center justify-center">
//                               <div
//                                 className="w-6 h-6 rounded-full border border-gray-300 mr-2"
//                                 style={{ backgroundColor: vehicle.color_code }}
//                               ></div>
//                               <span className="text-xs text-gray-600">
//                                 {vehicle.color_name || "Selected Color"}
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* Right Side - Form Fields */}
//                       <div className="md:w-3/5">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Brand *
//                             </label>
//                             <select
//                               className="w-full border border-gray-300 rounded p-2 text-sm"
//                               style={{ fontFamily: "Montserrat, sans-serif" }}
//                               value={vehicle.brand_id || ""}
//                               onChange={(e) =>
//                                 handleBrandChange(e.target.value, index)
//                               }
//                               required
//                             >
//                               <option value="">Select brand</option>
//                               {brands.map((brand) => (
//                                 <option key={brand.id} value={brand.id}>
//                                   {brand.name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Variant *
//                             </label>
//                             <select
//                               className="w-full border border-gray-300 rounded p-2 text-sm"
//                               style={{ fontFamily: "Montserrat, sans-serif" }}
//                               value={vehicle.variant_id || ""}
//                               onChange={(e) =>
//                                 handleVariantChange(e.target.value, index)
//                               }
//                               required
//                               disabled={!vehicle.brand_id}
//                             >
//                               <option value="">Select variant</option>
//                               {vehicle.brand_id ? (
//                                 variants
//                                   .filter((v) => v.brand_id == vehicle.brand_id)
//                                   .map((variant) => (
//                                     <option key={variant.id} value={variant.id}>
//                                       {variant.name}
//                                     </option>
//                                   ))
//                               ) : (
//                                 <option value="" disabled>
//                                   Select brand first
//                                 </option>
//                               )}
//                             </select>
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Color *
//                             </label>
//                             <select
//                               className="w-full border border-gray-300 rounded p-2 text-sm"
//                               style={{ fontFamily: "Montserrat, sans-serif" }}
//                               value={vehicle.color_id || ""}
//                               onChange={(e) =>
//                                 handleColorChange(e.target.value, index)
//                               }
//                               required
//                               disabled={!vehicle.variant_id}
//                             >
//                               <option value="">Select color</option>
//                               {vehicle.variant_id ? (
//                                 (() => {
//                                   const variantGalleries = galleries.filter(
//                                     (g) => g.variant_id == vehicle.variant_id
//                                   );
//                                   const uniqueColorIds = [
//                                     ...new Set(
//                                       variantGalleries.map((g) => g.color_id)
//                                     ),
//                                   ];
//                                   const variantColors = colors.filter((color) =>
//                                     uniqueColorIds.includes(color.id)
//                                   );
//                                   return variantColors.map((color) => (
//                                     <option key={color.id} value={color.id}>
//                                       {color.name || color.color_name}
//                                       {color.color_code &&
//                                         ` (${color.color_code})`}
//                                     </option>
//                                   ));
//                                 })()
//                               ) : (
//                                 <option value="" disabled>
//                                   Select variant first
//                                 </option>
//                               )}
//                             </select>
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Price
//                             </label>
//                             <input
//                               type="text"
//                               className="w-full border border-gray-300 rounded p-2 text-sm bg-gray-50"
//                               style={{ fontFamily: "Montserrat, sans-serif" }}
//                               value={
//                                 variants.find(
//                                   (v) => v.id === vehicle.variant_id
//                                 )?.basic_price
//                                   ? `₹${parseFloat(
//                                       variants.find(
//                                         (v) => v.id === vehicle.variant_id
//                                       )?.basic_price
//                                     ).toLocaleString()}`
//                                   : "Price on request"
//                               }
//                               readOnly
//                             />
//                           </div>
//                         </div>

//                         {/* Vehicle Status */}
//                         <div className="mt-4">
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Vehicle Status
//                           </label>
//                           <div className="flex items-center">
//                             <span
//                               className={`status-badge ${
//                                 vehicle.status === "Draft"
//                                   ? "status-draft"
//                                   : "status-open"
//                               }`}
//                             >
//                               {vehicle.status || "Draft"}
//                             </span>
//                             {vehicle.id && (
//                               <span className="ml-2 text-xs text-gray-500">
//                                 (Saved in database)
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Add Another Vehicle Button */}
//               <button
//                 type="button"
//                 className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 mb-4 hover:border-[#0f66af] hover:text-[#0f66af] flex items-center justify-center transition-colors"
//                 onClick={handleAddNewVehicle}
//               >
//                 <i className="bi bi-plus-circle mr-2"></i> Add Another Vehicle
//               </button>

//               {/* Action Buttons */}
//               <div className="flex justify-between mt-4">
//                 <button
//                   type="button"
//                   className="bg-red-500 text-white rounded-md px-6 py-2 text-sm hover:bg-red-600 transition-colors"
//                   style={{ fontFamily: "Montserrat, sans-serif" }}
//                   onClick={() => {
//                     if (
//                       window.confirm(
//                         "Are you sure you want to delete this entire lead? This action cannot be undone."
//                       )
//                     ) {
//                       handleDeleteLead(selectedLead.id || selectedLead.lead_id);
//                     }
//                   }}
//                 >
//                   Delete Lead
//                 </button>

//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     className="bg-gray-500 text-white rounded-md px-6 py-2 text-sm hover:bg-gray-600 transition-colors"
//                     style={{ fontFamily: "Montserrat, sans-serif" }}
//                     onClick={() => setIsEditModalOpen(false)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     className="bg-[#0f66af] text-white rounded-md px-6 py-2 text-sm hover:bg-[#084a8a] transition-colors"
//                     style={{ fontFamily: "Montserrat, sans-serif" }}
//                     onClick={handleSaveEdit}
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         /* ... existing styles ... */

//         .status-badge {
//           font-size: 12px;
//           padding: 4px 10px;
//           border-radius: 20px;
//           font-weight: 500;
//         }
//         .status-draft {
//           background-color: rgba(248, 150, 30, 0.2);
//           color: #f8961e;
//         }
//         .status-open {
//           background-color: rgba(16, 185, 129, 0.2);
//           color: #10b981;
//         }

//         /* Delete button styles */
//         .delete-vehicle-btn {
//           background-color: rgba(239, 68, 68, 0.1);
//           color: #ef4444;
//           border: none;
//           border-radius: 4px;
//           padding: 6px 10px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }
//         .delete-vehicle-btn:hover {
//           background-color: rgba(239, 68, 68, 0.2);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DraftLeads;
