// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// export default function OpenLeads() {
//   const [openLeads, setOpenLeads] = useState([]);
//   const [galleries, setGalleries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isCloseLeadModalOpen, setIsCloseLeadModalOpen] = useState(false);
//   const [isConvertedLeadModalOpen, setIsConvertedLeadModalOpen] =
//     useState(false);
//   const [selectedVehicleId, setSelectedVehicleId] = useState(null);
//   const [closeType, setCloseType] = useState("converted");
//   const [unrealizedReason, setUnrealizedReason] = useState("");
//   const [otherReason, setOtherReason] = useState("");
//   const [invoiceNumber, setInvoiceNumber] = useState("");
//   const [invoiceCopy, setInvoiceCopy] = useState(null);
//   const [confirmDetails, setConfirmDetails] = useState(true);
//   const [sortOrder, setSortOrder] = useState("newest");
//   const navigate = useNavigate();
//   const [variant, setavariant] = useState([]);

//   const [brands, setBrands] = useState([]);
//   const [variants, setVariants] = useState([]);
//   const [colors, setColors] = useState([]);
//   const API_BASE = "http://localhost:8000/api";

//   const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       setLoading(true);
//   //       // Fetch open leads
//   //       const leadsResponse = await axios.get(
//   //         `${API_BASE}/leads-by-status?status=Open`,
//   //         { headers: getAuthHeaders() }
//   //       );
//   //       if (leadsResponse.data.success) {
//   //         const leads = leadsResponse.data.data || [];
//   //         setOpenLeads(leads);
//   //         if (leads.length === 0) {
//   //           setError("No open leads found.");
//   //         }
//   //       } else {
//   //         setError(leadsResponse.data.message || "Failed to fetch open leads.");
//   //       }

//   //       // Fetch galleries
//   //       const galleriesResponse = await axios.get(`${API_BASE}/galleries`, {
//   //         headers: getAuthHeaders(),
//   //       });
//   //       if (galleriesResponse.data.status) {
//   //         setGalleries(galleriesResponse.data.data || []);
//   //       } else {
//   //         console.warn(
//   //           "Failed to fetch galleries:",
//   //           galleriesResponse.data.message
//   //         );
//   //       }
//   //     } catch (err) {
//   //       console.error("Error fetching data:", err);
//   //       setError("Failed to fetch data. Please try again later.");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);

//   // Add this useEffect near your other useEffects
//   useEffect(() => {
//     if (isViewModalOpen && selectedLead) {
//       // Refresh the selected lead data
//       const refreshSelectedLead = async () => {
//         try {
//           const response = await axios.get(
//             `${API_BASE}/leads/${selectedLead.id}`,
//             { headers: getAuthHeaders() }
//           );
//           if (response.data.success) {
//             setSelectedLead(response.data.data);
//           }
//         } catch (err) {
//           console.error("Failed to refresh lead data:", err);
//         }
//       };

//       refreshSelectedLead();
//     }
//   }, [isViewModalOpen, selectedLead?.id]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // Fetch open leads
//         const leadsResponse = await axios.get(
//           `${API_BASE}/leads-by-status?status=Open`,
//           { headers: getAuthHeaders() }
//         );
//         if (leadsResponse.data.success) {
//           const leads = leadsResponse.data.data || [];
//           setOpenLeads(leads);
//           if (leads.length === 0) {
//             setError("No open leads found.");
//           }
//         } else {
//           setError(leadsResponse.data.message || "Failed to fetch open leads.");
//         }

//         // Fetch galleries
//         const galleriesResponse = await axios.get(`${API_BASE}/galleries`, {
//           headers: getAuthHeaders(),
//         });
//         if (galleriesResponse.data.status) {
//           setGalleries(galleriesResponse.data.data || []);
//         } else {
//           console.warn(
//             "Failed to fetch galleries:",
//             galleriesResponse.data.message
//           );
//         }

//         // ADD THIS: Fetch variants to get price data
//         const variantsResponse = await axios.get(`${API_BASE}/variants`, {
//           headers: getAuthHeaders(),
//         });
//         if (variantsResponse.data.data || variantsResponse.data) {
//           setVariants(
//             variantsResponse.data.data || variantsResponse.data || []
//           );
//         }

//         // ADD THIS: Fetch brands
//         const brandsResponse = await axios.get(`${API_BASE}/brands`, {
//           headers: getAuthHeaders(),
//         });
//         if (brandsResponse.data.data || brandsResponse.data) {
//           setBrands(brandsResponse.data.data || brandsResponse.data || []);
//         }

//         // ADD THIS: Fetch colors
//         const colorsResponse = await axios.get(`${API_BASE}/colors`, {
//           headers: getAuthHeaders(),
//         });
//         if (colorsResponse.data.data || colorsResponse.data) {
//           setColors(colorsResponse.data.data || colorsResponse.data || []);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to fetch data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handler functions for dropdown changes
//   const handleBrandChange = (brandId, vehicleIndex) => {
//     setSelectedLead((prevLead) => {
//       if (!prevLead) return prevLead;

//       const updatedLeadDetails = [...prevLead.lead_details];
//       const selectedBrand = brands.find((brand) => brand.id == brandId);

//       updatedLeadDetails[vehicleIndex] = {
//         ...updatedLeadDetails[vehicleIndex],
//         brand_id: brandId,
//         brand_name: selectedBrand?.name || "",
//         variant_id: "",
//         variant_name: "",
//         color_id: "",
//         color_name: "",
//         color_code: "",
//         variant: null, // Clear variant object
//         color: null, // Clear color object
//       };

//       return {
//         ...prevLead,
//         lead_details: updatedLeadDetails,
//       };
//     });
//   };

//   const handleVariantChange = (variantId, vehicleIndex) => {
//     setSelectedLead((prevLead) => {
//       if (!prevLead) return prevLead;

//       const updatedLeadDetails = [...prevLead.lead_details];
//       const selectedVariant = variants.find(
//         (variant) => variant.id == variantId
//       );

//       updatedLeadDetails[vehicleIndex] = {
//         ...updatedLeadDetails[vehicleIndex],
//         variant_id: variantId,
//         variant_name: selectedVariant?.name || "",
//         color_id: "",
//         color_name: "",
//         color_code: "",
//         variant: selectedVariant, // Update variant object
//         color: null, // Clear color object
//       };

//       return {
//         ...prevLead,
//         lead_details: updatedLeadDetails,
//       };
//     });
//   };

//   const handleColorChange = (colorId, vehicleIndex) => {
//     setSelectedLead((prevLead) => {
//       if (!prevLead) return prevLead;

//       const updatedLeadDetails = [...prevLead.lead_details];
//       const selectedColor = colors.find((color) => color.id == colorId);

//       updatedLeadDetails[vehicleIndex] = {
//         ...updatedLeadDetails[vehicleIndex],
//         color_id: colorId,
//         color_name: selectedColor?.name || selectedColor?.color_name || "",
//         color_code: selectedColor?.color_code || "",
//         color: selectedColor, // Update color object
//       };

//       return {
//         ...prevLead,
//         lead_details: updatedLeadDetails,
//       };
//     });
//   };

//   const handleRefresh = () => {
//     setLoading(true);
//     setError(null);
//     const fetchData = async () => {
//       try {
//         const leadsResponse = await axios.get(
//           `${API_BASE}/leads-by-status?status=Open`,
//           { headers: getAuthHeaders() }
//         );
//         if (leadsResponse.data.success) {
//           setOpenLeads(leadsResponse.data.data || []);
//         }
//       } catch (err) {
//         setError("Failed to fetch open leads. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
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

//   // Updated getVehicleImage function to match DraftLeads.js logic
//   const getVehicleImage = (vehicle) => {
//     if (!vehicle?.variant_id) {
//       return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//     }

//     let variantGallery = null;

//     // First try to find gallery with matching variant_id and color_id
//     if (vehicle.color_id) {
//       variantGallery = galleries.find(
//         (g) =>
//           g.variant_id == vehicle.variant_id && g.color_id == vehicle.color_id
//       );
//     }

//     // If not found, try to find any gallery with matching variant_id
//     if (!variantGallery) {
//       variantGallery = galleries.find(
//         (g) => g.variant_id == vehicle.variant_id
//       );
//     }

//     // If gallery found and has cover_photos
//     if (variantGallery?.cover_photos) {
//       let images = [];
//       try {
//         // Try to parse cover_photos as JSON (in case it's an array)
//         images = JSON.parse(variantGallery.cover_photos);
//         if (!Array.isArray(images)) images = [variantGallery.cover_photos];
//       } catch (e) {
//         // If parsing fails, use cover_photos as string
//         images = [variantGallery.cover_photos];
//       }

//       // Get the first image
//       if (images[0]) {
//         const imageUrl = getAbsoluteImageUrl(images[0]);
//         return imageUrl;
//       }
//     }

//     // Return placeholder if no image found
//     return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//   };

//   // Helper function to get absolute image URL
//   const getAbsoluteImageUrl = (url) => {
//     if (!url) return null;

//     // If URL is already absolute, return as is
//     if (url.startsWith("http://") || url.startsWith("https://")) {
//       return url;
//     }

//     // If URL starts with /, prepend the base URL
//     if (url.startsWith("/")) {
//       return `http://localhost:8000${url}`;
//     }

//     // Otherwise, assume it's a relative path from uploads/coverPhotos
//     const cleanPath = url.replace(/^[\\/]+/, "");
//     return `http://localhost:8000/uploads/coverPhotos/${cleanPath}`;
//   };

//   // const handleViewLead = (lead) => {
//   //   console.log("Selected Lead:", lead);
//   //   console.log(
//   //     "Vehicle variants:",
//   //     lead.lead_details?.map((v) => ({
//   //       id: v.id,
//   //       variant: v.variant,
//   //       color: v.color_name,
//   //       hasPrice: !!v.variant?.basic_price,
//   //       price: v.variant?.basic_price,
//   //     }))
//   //   );
//   //   setSelectedLead(lead);
//   //   setIsViewModalOpen(true);
//   // };

//   const handleViewLead = async (lead) => {
//     console.log("Opening view modal for lead:", lead.id);
//     console.log(
//       "Current vehicles:",
//       lead.lead_details?.map((v) => ({
//         id: v.id,
//         brand: v.brand_name,
//         variant: v.variant_name,
//         color: v.color_name,
//       }))
//     );

//     // Optional: Refresh the lead data before showing
//     try {
//       const response = await axios.get(`${API_BASE}/leads/${lead.id}`, {
//         headers: getAuthHeaders(),
//       });
//       if (response.data.success) {
//         setSelectedLead(response.data.data);
//         console.log("Refreshed lead data:", response.data.data);
//       } else {
//         setSelectedLead(lead);
//       }
//     } catch (err) {
//       console.error("Failed to refresh lead, using cached data:", err);
//       setSelectedLead(lead);
//     }

//     setIsViewModalOpen(true);
//   };

//   const handleEditLead = (lead) => {
//     setSelectedLead(lead);
//     setIsEditModalOpen(true);
//   };

//   const handleCloseLead = (lead) => {
//     setSelectedLead(lead);
//     if (lead.lead_details.length === 1) {
//       handleCloseVehicle(lead, lead.lead_details[0].id);
//     } else {
//       setIsViewModalOpen(true);
//     }
//   };

//   const handleCloseVehicle = (lead, vehicleId) => {
//     setSelectedLead(lead);
//     setSelectedVehicleId(vehicleId);
//     setCloseType("converted");
//     setUnrealizedReason("");
//     setOtherReason("");
//     setIsCloseLeadModalOpen(true);
//   };

//   const handleProcessCloseLead = async () => {
//     if (!selectedLead || !selectedVehicleId) return;

//     const vehicle = selectedLead.lead_details.find(
//       (v) => v.id === selectedVehicleId
//     );
//     if (!vehicle) return;

//     if (closeType === "converted") {
//       setInvoiceNumber("");
//       setInvoiceCopy(null);
//       setConfirmDetails(true);
//       setIsCloseLeadModalOpen(false);
//       setIsConvertedLeadModalOpen(true);
//     } else {
//       if (!unrealizedReason) {
//         alert("Please select a reason for unrealized lead.");
//         return;
//       }
//       try {
//         await axios.put(
//           `${API_BASE}/lead-details/${vehicle.id}`,
//           {
//             status: "unrealized",
//             close_reason:
//               unrealizedReason === "other" ? otherReason : unrealizedReason,
//           },
//           { headers: getAuthHeaders() }
//         );

//         const updatedLead = { ...selectedLead };
//         const vehicleIndex = updatedLead.lead_details.findIndex(
//           (v) => v.id === selectedVehicleId
//         );
//         updatedLead.lead_details[vehicleIndex].status = "unrealized";
//         const allClosed = updatedLead.lead_details.every(
//           (v) => v.status !== "open"
//         );
//         if (allClosed) {
//           await axios.put(
//             `${API_BASE}/leads/${selectedLead.id}/status`,
//             { status: "closed" },
//             { headers: getAuthHeaders() }
//           );
//           setOpenLeads((prev) =>
//             prev.filter((lead) => lead.id !== selectedLead.id)
//           );
//         } else {
//           setOpenLeads((prev) =>
//             prev.map((lead) =>
//               lead.id === selectedLead.id ? updatedLead : lead
//             )
//           );
//         }

//         setIsCloseLeadModalOpen(false);
//         setSelectedLead(null);
//         setSelectedVehicleId(null);
//         alert("Vehicle marked as unrealized successfully!");
//       } catch (err) {
//         console.error("Failed to close vehicle:", err);
//         alert(
//           `Failed to close vehicle: ${
//             err.response?.data?.message || err.message
//           }`
//         );
//       }
//     }
//   };

//   const handleSubmitConvertedLead = async () => {
//     if (!selectedLead || !selectedVehicleId) return;
//     if (!invoiceNumber) {
//       alert("Please enter invoice number.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("status", "converted");
//       formData.append("invoice_number", invoiceNumber);
//       if (invoiceCopy) {
//         formData.append("invoice_copy", invoiceCopy);
//       }

//       await axios.put(
//         `${API_BASE}/lead-details/${selectedVehicleId}`,
//         formData,
//         {
//           headers: {
//             ...getAuthHeaders(),
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       const updatedLead = { ...selectedLead };
//       const vehicleIndex = updatedLead.lead_details.findIndex(
//         (v) => v.id === selectedVehicleId
//       );
//       updatedLead.lead_details[vehicleIndex].status = "converted";
//       const allClosed = updatedLead.lead_details.every(
//         (v) => v.status !== "open"
//       );
//       if (allClosed) {
//         await axios.put(
//           `${API_BASE}/leads/${selectedLead.id}/status`,
//           { status: "closed" },
//           { headers: getAuthHeaders() }
//         );
//         setOpenLeads((prev) =>
//           prev.filter((lead) => lead.id !== selectedLead.id)
//         );
//       } else {
//         setOpenLeads((prev) =>
//           prev.map((lead) => (lead.id === selectedLead.id ? updatedLead : lead))
//         );
//       }

//       setIsConvertedLeadModalOpen(false);
//       setSelectedLead(null);
//       setSelectedVehicleId(null);
//       alert("Lead converted successfully!");
//     } catch (err) {
//       console.error("Failed to convert lead:", err);
//       alert(
//         `Failed to convert lead: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//   const handleSaveLead = async () => {
//     if (!selectedLead) return;

//     try {
//       const leadPayload = {
//         customer_name: selectedLead.customer_name || "",
//         phone_no: selectedLead.phone_no || "",
//         location: selectedLead.location || "",
//         payment_mode: selectedLead.payment_mode || "",
//         tentative_purchase_date: selectedLead.tentative_purchase_date || null,
//         vehicle_qty: selectedLead.lead_details?.length || 1,
//         status: "Open",
//       };
//       if (!leadPayload.customer_name) {
//         throw new Error("Customer name is required.");
//       }
//       if (!leadPayload.phone_no || !/^[0-9]{10}$/.test(leadPayload.phone_no)) {
//         throw new Error("Phone number must be a valid 10-digit number.");
//       }

//       const leadResponse = await axios.put(
//         `${API_BASE}/leads/${selectedLead.id}`,
//         leadPayload,
//         { headers: getAuthHeaders() }
//       );
//       if (!leadResponse.data.success) {
//         throw new Error(leadResponse.data.message || "Failed to update lead");
//       }

//       const updatedLeadDetails = [];
//       for (const vehicle of selectedLead.lead_details) {
//         const vehiclePayload = {
//           brand_id: vehicle.brand_id,
//           variant_id: vehicle.variant_id,
//           color_id: vehicle.color_id || null,
//           status: vehicle.status || "Open",
//         };
//         if (vehicle.id) {
//           const vehicleResponse = await axios.put(
//             `${API_BASE}/lead-details/${vehicle.id}`,
//             vehiclePayload,
//             { headers: getAuthHeaders() }
//           );
//           if (vehicleResponse.data.success) {
//             updatedLeadDetails.push({
//               ...vehicle,
//               ...vehicleResponse.data.data,
//             });
//           } else {
//             throw new Error(
//               vehicleResponse.data.message ||
//                 `Failed to update vehicle ${vehicle.id}`
//             );
//           }
//         }
//       }

//       setOpenLeads((prev) =>
//         prev.map((lead) =>
//           lead.id === selectedLead.id
//             ? {
//                 ...lead,
//                 ...leadResponse.data.data,
//                 lead_details: updatedLeadDetails,
//               }
//             : lead
//         )
//       );
//       setIsEditModalOpen(false);
//       alert("Lead updated successfully!");
//     } catch (err) {
//       console.error("Failed to update lead:", err);
//       alert(
//         `Failed to update lead: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//   const sortLeadsByAge = (order) => {
//     if (order === "newest") {
//       setOpenLeads((prev) =>
//         [...prev].sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         )
//       );
//     } else {
//       setOpenLeads((prev) =>
//         [...prev].sort(
//           (a, b) => new Date(a.created_at) - new Date(b.created_at)
//         )
//       );
//     }
//   };

//   if (loading) return <Loader />;
//   if (error && openLeads.length === 0)
//     return <ErrorMessage message={error} onRetry={handleRefresh} />;

//   return (
//     <div className="min-h-screen bg-gray-50 font-montserrat text-sm">
//       {/* Open Leads Section */}
//       <section className="p-4 md:p-6">
//         <div className="container mx-auto px-0 max-w-7xl">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="sortLeads"
//                 className="text-xs font-medium text-gray-600"
//               >
//                 Sort Leads by Age:
//               </label>
//               <select
//                 id="sortLeads"
//                 value={sortOrder}
//                 onChange={(e) => {
//                   setSortOrder(e.target.value);
//                   sortLeadsByAge(e.target.value);
//                 }}
//                 className="border border-secondary-grey rounded-md px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-primary-blue"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//               </select>
//             </div>
//           </div>
//           {openLeads.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4">📝</div>
//               <h3 className="text-gray-500 text-xl font-medium mb-2">
//                 No Open Leads
//               </h3>
//               <p className="text-gray-400 mb-6">
//                 {error || "There are currently no open leads in the system."}
//               </p>
//               <Link
//                 to="/leads/generate"
//                 className="btn-primary-blue rounded-md px-6 py-3 text-sm font-medium"
//               >
//                 Create Your First Lead
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4" id="leadsContainer">
//               {openLeads.map((lead) => {
//                 const draftAge = calculateLeadAge(lead.created_at);
//                 const draftAgeClass = getDraftAgeClass(draftAge);
//                 return (
//                   <div
//                     key={lead.id}
//                     className="lead-card bg-white p-5 rounded-lg shadow-md"
//                     data-lead-id={lead.id}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h6 className="text-base font-semibold text-text-dark mb-1">
//                               {lead.customer_name}
//                             </h6>
//                             <p className="text-sm text-gray-600 mb-1">
//                               {lead.location || "N/A"}
//                             </p>
//                           </div>
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
//                               className="action-btn btn-close"
//                               title="Close Lead"
//                               onClick={() => handleCloseLead(lead)}
//                             >
//                               <i className="bi bi-check-lg"></i>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="mt-2 space-y-1">
//                           {lead.lead_details?.map((vehicle) => (
//                             <p
//                               key={vehicle.id}
//                               className="text-sm text-gray-600 mb-1"
//                             >
//                               {vehicle.brand?.name || "No brand"} -{" "}
//                               {vehicle.variant?.name || "No variant"}
//                               {vehicle.color?.name &&
//                                 ` - ${vehicle.color.name}`}
//                             </p>
//                           ))}
//                         </div>
//                         <div className="flex items-center gap-2 mt-2">
//                           <span className={`draft-age ${draftAgeClass}`}>
//                             {draftAge} day{draftAge !== 1 ? "s" : ""}
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
//                             className="action-btn btn-close"
//                             title="Close Lead"
//                             onClick={() => handleCloseLead(lead)}
//                           >
//                             <i className="bi bi-check-lg"></i>
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
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsViewModalOpen(false)}
//           key={`view-modal-${selectedLead.id}-${selectedLead.updated_at}`} // Add this key
//         >
//           <div
//             className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
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
//               {window.innerWidth <= 640 ? (
//                 // Mobile-optimized concise view
//                 <React.Fragment>
//                   <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                     <h6 className="text-base font-medium text-primary-blue mb-3 flex items-center">
//                       <i className="bi bi-person-fill mr-2"></i> Customer
//                       Information
//                     </h6>
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <p className="text-xs text-gray-500">Name</p>
//                         <p className="text-sm font-medium">
//                           {selectedLead.customer_name}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Mobile</p>
//                         <p className="text-sm font-medium">
//                           {selectedLead.phone_no}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Location</p>
//                         <p className="text-sm font-medium">
//                           {selectedLead.location || "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Payment</p>
//                         <p className="text-sm font-medium">
//                           <span
//                             className={`payment-badge ${
//                               selectedLead.payment_mode === "cash"
//                                 ? "payment-cash"
//                                 : "payment-finance"
//                             }`}
//                           >
//                             {selectedLead.payment_mode}
//                           </span>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   {selectedLead.lead_details.map((vehicle, index) => {
//                     // Get price from multiple sources
//                     const getVehiclePrice = () => {
//                       // Priority 1: Price from vehicle.variant
//                       if (vehicle.variant?.basic_price) {
//                         return `₹${parseFloat(
//                           vehicle.variant.basic_price
//                         ).toLocaleString("en-IN")}`;
//                       }

//                       // Priority 2: Price from variants state
//                       const foundVariant = variants.find(
//                         (v) => v.id === vehicle.variant_id
//                       );
//                       if (foundVariant?.basic_price) {
//                         return `₹${parseFloat(
//                           foundVariant.basic_price
//                         ).toLocaleString("en-IN")}`;
//                       }

//                       // Priority 3: Check if basic_price is directly on vehicle
//                       if (vehicle.basic_price) {
//                         return `₹${parseFloat(
//                           vehicle.basic_price
//                         ).toLocaleString("en-IN")}`;
//                       }

//                       return "Price on request";
//                     };

//                     // Get color from multiple sources
//                     const getVehicleColor = () => {
//                       // Priority 1: Color from vehicle.color
//                       if (vehicle.color?.name) {
//                         return vehicle.color.name;
//                       }

//                       // Priority 2: Color from colors state
//                       const foundColor = colors.find(
//                         (c) => c.id === vehicle.color_id
//                       );
//                       if (foundColor?.name || foundColor?.color_name) {
//                         return foundColor.name || foundColor.color_name;
//                       }

//                       // Priority 3: Check if color_name is directly on vehicle
//                       if (vehicle.color_name) {
//                         return vehicle.color_name;
//                       }

//                       return "N/A";
//                     };

//                     const vehiclePrice = getVehiclePrice();
//                     const vehicleColor = getVehicleColor();

//                     return (
//                       <div
//                         key={vehicle.id}
//                         className="bg-white p-3 rounded-lg shadow-sm mb-3 border border-secondary-grey mobile-concise-view"
//                       >
//                         <div className="vehicle-section">
//                           <div className="vehicle-header">
//                             <i className="bi bi-bicycle text-primary-blue"></i>
//                             <h6 className="text-sm font-medium text-primary-blue">
//                               Vehicle {index + 1}
//                             </h6>
//                             <button
//                               className="action-btn btn-close ml-auto"
//                               title="Close Vehicle"
//                               onClick={() =>
//                                 handleCloseVehicle(selectedLead, vehicle.id)
//                               }
//                             >
//                               <i className="bi bi-check-lg"></i>
//                             </button>
//                           </div>
//                           <div className="flex gap-3">
//                             <div className="w-1/3">
//                               <img
//                                 src={getVehicleImage(vehicle)}
//                                 alt={`${vehicle.brand?.name} ${vehicle.variant?.name}`}
//                                 className="w-full h-auto rounded-lg"
//                                 onError={(e) => {
//                                   e.target.src =
//                                     "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//                                 }}
//                               />
//                             </div>
//                             <div className="w-2/3">
//                               <div className="vehicle-details">
//                                 <div className="detail-item">
//                                   <p className="detail-label">Brand</p>
//                                   <p className="detail-value">
//                                     {vehicle.brand?.name || "N/A"}
//                                   </p>
//                                 </div>
//                                 <div className="detail-item">
//                                   <p className="detail-label">Variant</p>
//                                   <p className="detail-value">
//                                     {vehicle.variant?.name || "N/A"}
//                                   </p>
//                                 </div>
//                                 <div className="detail-item">
//                                   <p className="detail-label">Color</p>
//                                   <p className="detail-value">{vehicleColor}</p>
//                                 </div>
//                                 <div className="detail-item">
//                                   <p className="detail-label">Price</p>
//                                   <p className="text-primary-blue font-medium mt-1 text-sm">
//                                     {vehiclePrice}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </React.Fragment>
//               ) : (
//                 // Desktop detailed view
//                 <React.Fragment>
//                   <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                     <h6 className="text-base font-medium text-primary-blue mb-3 flex items-center">
//                       <i className="bi bi-person-fill mr-2"></i> Customer
//                       Information
//                     </h6>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600">
//                           Name
//                         </label>
//                         <p className="text-sm font-medium text-text-dark">
//                           {selectedLead.customer_name}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600">
//                           Mobile
//                         </label>
//                         <p className="text-sm font-medium text-text-dark">
//                           {selectedLead.phone_no}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600">
//                           Location
//                         </label>
//                         <p className="text-sm font-medium text-text-dark">
//                           {selectedLead.location || "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600">
//                           Address
//                         </label>
//                         <p className="text-sm font-medium text-text-dark">
//                           {selectedLead.location || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   {selectedLead.lead_details.map((vehicle, index) => {
//                     // Get price from multiple sources
//                     const getVehiclePrice = () => {
//                       // Priority 1: Price from vehicle.variant
//                       if (vehicle.variant?.basic_price) {
//                         return `₹${parseFloat(
//                           vehicle.variant.basic_price
//                         ).toLocaleString("en-IN")}`;
//                       }

//                       // Priority 2: Price from variants state
//                       const foundVariant = variants.find(
//                         (v) => v.id === vehicle.variant_id
//                       );
//                       if (foundVariant?.basic_price) {
//                         return `₹${parseFloat(
//                           foundVariant.basic_price
//                         ).toLocaleString("en-IN")}`;
//                       }

//                       // Priority 3: Check if basic_price is directly on vehicle
//                       if (vehicle.basic_price) {
//                         return `₹${parseFloat(
//                           vehicle.basic_price
//                         ).toLocaleString("en-IN")}`;
//                       }

//                       return "Price on request";
//                     };

//                     // Get color from multiple sources
//                     const getVehicleColor = () => {
//                       // Priority 1: Color from vehicle.color
//                       if (vehicle.color?.name) {
//                         return vehicle.color.name;
//                       }

//                       // Priority 2: Color from colors state
//                       const foundColor = colors.find(
//                         (c) => c.id === vehicle.color_id
//                       );
//                       if (foundColor?.name || foundColor?.color_name) {
//                         return foundColor.name || foundColor.color_name;
//                       }

//                       // Priority 3: Check if color_name is directly on vehicle
//                       if (vehicle.color_name) {
//                         return vehicle.color_name;
//                       }

//                       return "N/A";
//                     };

//                     const vehiclePrice = getVehiclePrice();
//                     const vehicleColor = getVehicleColor();

//                     return (
//                       <div
//                         key={vehicle.id}
//                         className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey"
//                       >
//                         <div className="flex justify-between items-center mb-3">
//                           <h6 className="text-base font-medium text-primary-blue flex items-center">
//                             <i className="bi bi-bicycle mr-2"></i> Vehicle{" "}
//                             {index + 1}
//                           </h6>
//                           <div className="flex gap-2">
//                             <button
//                               className="action-btn btn-close"
//                               title="Close Vehicle"
//                               onClick={() =>
//                                 handleCloseVehicle(selectedLead, vehicle.id)
//                               }
//                             >
//                               <i className="bi bi-check-lg"></i>
//                             </button>
//                           </div>
//                         </div>
//                         <div className="flex flex-col md:flex-row gap-4">
//                           <div className="md:w-1/3">
//                             <img
//                               src={getVehicleImage(vehicle)}
//                               alt={`${vehicle.brand?.name} ${vehicle.variant?.name}`}
//                               className="w-full h-64 object-cover rounded-lg"
//                               onError={(e) => {
//                                 e.target.src =
//                                   "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//                               }}
//                             />
//                           </div>
//                           <div className="md:w-2/3">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Brand
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehicle.brand?.name || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Variant
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehicle.variant?.name || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Color
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehicleColor}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Price
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehiclePrice}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Payment Mode
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
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
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </React.Fragment>
//               )}
//               <div className="flex justify-between mt-4">
//                 <button
//                   className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                   onClick={() => handleCloseLead(selectedLead)}
//                 >
//                   Close Entire Lead
//                 </button>
//                 <button
//                   className="btn-secondary rounded-md px-4 py-2 text-sm"
//                   onClick={() => setIsViewModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {/* Edit Lead Modal */}
//       {isEditModalOpen && selectedLead && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsEditModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
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
//               <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                 <h6 className="text-base font-medium text-primary-blue mb-3 flex items-center">
//                   <i className="bi bi-person-fill mr-2"></i> Customer
//                   Information
//                 </h6>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-secondary-grey rounded p-2 text-sm"
//                       value={selectedLead.customer_name || ""}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           customer_name: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Mobile
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-secondary-grey rounded p-2 text-sm"
//                       value={selectedLead.phone_no || ""}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           phone_no: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Location
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-secondary-grey rounded p-2 text-sm"
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
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-secondary-grey rounded p-2 text-sm"
//                       value={selectedLead.location || ""}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           location: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//               {selectedLead.lead_details.map((vehicle, index) => (
//                 <div
//                   key={vehicle.id}
//                   className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey"
//                 >
//                   <div className="flex justify-between items-center mb-3">
//                     <h6 className="text-base font-medium text-primary-blue flex items-center">
//                       <i className="bi bi-bicycle mr-2"></i> Vehicle {index + 1}
//                     </h6>
//                     <div className="flex gap-2">
//                       <button
//                         className="action-btn btn-close"
//                         title="Close Vehicle"
//                         onClick={() =>
//                           handleCloseVehicle(selectedLead, vehicle.id)
//                         }
//                       >
//                         <i className="bi bi-check-lg"></i>
//                       </button>
//                     </div>
//                   </div>
//                   <div className="flex flex-col md:flex-row gap-4">
//                     <div className="md:w-1/3">
//                       <img
//                         src={getVehicleImage(vehicle)}
//                         alt={`${vehicle.brand?.name} ${vehicle.variant?.name}`}
//                         className="w-full h-64 object-cover rounded-lg"
//                         onError={(e) => {
//                           e.target.src =
//                             "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//                         }}
//                       />
//                     </div>
//                     <div className="md:w-2/3">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* Brand Dropdown */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Brand *
//                           </label>
//                           <select
//                             className="w-full border border-secondary-grey rounded p-2 text-sm"
//                             value={vehicle.brand_id || ""}
//                             onChange={(e) =>
//                               handleBrandChange(e.target.value, index)
//                             }
//                             required
//                           >
//                             <option value="">Select brand</option>
//                             {brands.map((brand) => (
//                               <option key={brand.id} value={brand.id}>
//                                 {brand.name}
//                               </option>
//                             ))}
//                           </select>
//                         </div>

//                         {/* Variant Dropdown */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Variant *
//                           </label>
//                           <select
//                             className="w-full border border-secondary-grey rounded p-2 text-sm"
//                             value={vehicle.variant_id || ""}
//                             onChange={(e) =>
//                               handleVariantChange(e.target.value, index)
//                             }
//                             required
//                             disabled={!vehicle.brand_id}
//                           >
//                             <option value="">Select variant</option>
//                             {vehicle.brand_id ? (
//                               variants
//                                 .filter((v) => v.brand_id == vehicle.brand_id)
//                                 .map((variant) => (
//                                   <option key={variant.id} value={variant.id}>
//                                     {variant.name}
//                                   </option>
//                                 ))
//                             ) : (
//                               <option value="" disabled>
//                                 Select brand first
//                               </option>
//                             )}
//                           </select>
//                         </div>

//                         {/* Color Dropdown */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Color *
//                           </label>
//                           <select
//                             className="w-full border border-secondary-grey rounded p-2 text-sm"
//                             value={vehicle.color_id || ""}
//                             onChange={(e) =>
//                               handleColorChange(e.target.value, index)
//                             }
//                             required
//                             disabled={!vehicle.variant_id}
//                           >
//                             <option value="">Select color</option>
//                             {vehicle.variant_id ? (
//                               (() => {
//                                 // Get available colors for this variant from galleries
//                                 const variantGalleries = galleries.filter(
//                                   (g) => g.variant_id == vehicle.variant_id
//                                 );
//                                 const uniqueColorIds = [
//                                   ...new Set(
//                                     variantGalleries.map((g) => g.color_id)
//                                   ),
//                                 ];
//                                 const variantColors = colors.filter((color) =>
//                                   uniqueColorIds.includes(color.id)
//                                 );
//                                 return variantColors.map((color) => (
//                                   <option key={color.id} value={color.id}>
//                                     {color.name || color.color_name}
//                                     {color.color_code &&
//                                       ` (${color.color_code})`}
//                                   </option>
//                                 ));
//                               })()
//                             ) : (
//                               <option value="" disabled>
//                                 Select variant first
//                               </option>
//                             )}
//                           </select>
//                         </div>

//                         {/* Price (Read-only) */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Price
//                           </label>
//                           <input
//                             type="text"
//                             className="w-full border border-secondary-grey rounded p-2 text-sm bg-gray-50"
//                             value={
//                               variants.find((v) => v.id == vehicle.variant_id)
//                                 ?.basic_price
//                                 ? `₹${parseFloat(
//                                     variants.find(
//                                       (v) => v.id == vehicle.variant_id
//                                     )?.basic_price
//                                   ).toLocaleString("en-IN")}`
//                                 : "Price on request"
//                             }
//                             readOnly
//                           />
//                         </div>

//                         {/* Payment Mode (for first vehicle only) */}
//                         {index === 0 && (
//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Payment Mode
//                             </label>
//                             <select
//                               className="w-full border border-secondary-grey rounded p-2 text-sm"
//                               value={selectedLead.payment_mode || "cash"}
//                               onChange={(e) =>
//                                 setSelectedLead({
//                                   ...selectedLead,
//                                   payment_mode: e.target.value,
//                                 })
//                               }
//                             >
//                               <option value="cash">Cash</option>
//                               <option value="finance">Finance</option>
//                             </select>
//                           </div>
//                         )}
//                       </div>

//                       {/* Color Preview */}
//                       {vehicle.color_code && (
//                         <div className="mt-3 flex items-center">
//                           <span className="text-sm text-gray-600 mr-2">
//                             Color Preview:
//                           </span>
//                           <div
//                             className="w-6 h-6 rounded-full border border-gray-300 mr-2"
//                             style={{ backgroundColor: vehicle.color_code }}
//                           ></div>
//                           <span className="text-sm text-gray-800">
//                             {vehicle.color_name || "Selected Color"}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div className="flex justify-between mt-4">
//                 <div>
//                   <button
//                     className="btn-primary-blue rounded-md px-4 py-2 text-sm mr-2"
//                     onClick={handleSaveLead}
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     className="btn-secondary rounded-md px-4 py-2 text-sm"
//                     onClick={() => setIsEditModalOpen(false)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//                 <button
//                   className="btn-success rounded-md px-4 py-2 text-sm"
//                   onClick={() => handleCloseLead(selectedLead)}
//                 >
//                   Close Lead
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {isCloseLeadModalOpen && selectedLead && selectedVehicleId && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsCloseLeadModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
//               <h5 className="text-base font-medium">Close Vehicle</h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsCloseLeadModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>
//             <div className="p-4 flex-1 overflow-y-auto">
//               <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                 <h6 className="text-base font-medium text-primary-blue mb-3">
//                   Close Vehicle
//                 </h6>
//                 <div className="mb-4">
//                   <p className="text-sm text-gray-600 mb-2">
//                     You are closing the following vehicle:
//                   </p>
//                   <div className="bg-light-blue p-3 rounded-md">
//                     <p className="font-medium">
//                       {
//                         selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         )?.brand?.name
//                       }{" "}
//                       {
//                         selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         )?.variant?.name
//                       }
//                     </p>
//                     {/* Enhanced Price and Color Display */}
//                     <p className="text-sm text-gray-600">
//                       {(() => {
//                         // Get color from multiple sources
//                         const vehicle = selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         );

//                         // Priority 1: Color from vehicle.color
//                         if (vehicle?.color?.name) {
//                           return vehicle.color.name;
//                         }

//                         // Priority 2: Color from colors state
//                         const foundColor = colors.find(
//                           (c) => c.id === vehicle?.color_id
//                         );
//                         if (foundColor?.name || foundColor?.color_name) {
//                           return foundColor.name || foundColor.color_name;
//                         }

//                         // Priority 3: Check if color_name is directly on vehicle
//                         if (vehicle?.color_name) {
//                           return vehicle.color_name;
//                         }

//                         return "";
//                       })()}{" "}
//                       {(() => {
//                         // Get price from multiple sources
//                         const vehicle = selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         );

//                         // Priority 1: Price from vehicle.variant
//                         if (vehicle?.variant?.basic_price) {
//                           return `₹${parseFloat(
//                             vehicle.variant.basic_price
//                           ).toLocaleString("en-IN")}`;
//                         }

//                         // Priority 2: Price from variants state
//                         const foundVariant = variants.find(
//                           (v) => v.id === vehicle?.variant_id
//                         );
//                         if (foundVariant?.basic_price) {
//                           return `₹${parseFloat(
//                             foundVariant.basic_price
//                           ).toLocaleString("en-IN")}`;
//                         }

//                         // Priority 3: Check if basic_price is directly on vehicle
//                         if (vehicle?.basic_price) {
//                           return `₹${parseFloat(
//                             vehicle.basic_price
//                           ).toLocaleString("en-IN")}`;
//                         }

//                         return "Price on request";
//                       })()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-600 mb-2">
//                     Select Close Type:
//                   </label>
//                   <div className="flex gap-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="closeType"
//                         value="converted"
//                         className="mr-2"
//                         checked={closeType === "converted"}
//                         onChange={() => setCloseType("converted")}
//                       />
//                       <span className="text-sm">Converted</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="button"
//                         name="closeType"
//                         value="unrealized"
//                         className="mr-2"
//                         checked={closeType === "unrealized"}
//                         onChange={() => setCloseType("unrealized")}
//                       />
//                       {/* <span className="text-sm">Unrealized</span> */}
//                     </label>
//                   </div>
//                 </div>
//                 {closeType === "unrealized" && (
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-600 mb-2">
//                       Reason for Unrealized:
//                     </label>
//                     <select
//                       className="w-full border border-secondary-grey rounded p-2 text-sm mb-2"
//                       value={unrealizedReason}
//                       onChange={(e) => setUnrealizedReason(e.target.value)}
//                     >
//                       <option value="" disabled>
//                         Select reason
//                       </option>
//                       <option value="price">Price too high</option>
//                       <option value="features">
//                         Not satisfied with features
//                       </option>
//                       <option value="delivery">Delivery timeline</option>
//                       <option value="competitor">
//                         Found better option with competitor
//                       </option>
//                       <option value="financial">Financial issues</option>
//                       <option value="other">Other</option>
//                     </select>
//                     {unrealizedReason === "other" && (
//                       <textarea
//                         className="w-full border border-secondary-grey rounded p-2 text-sm"
//                         placeholder="Please specify the reason..."
//                         value={otherReason}
//                         onChange={(e) => setOtherReason(e.target.value)}
//                       ></textarea>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   className="btn-secondary rounded-md px-4 py-2 text-sm"
//                   onClick={() => setIsCloseLeadModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                   onClick={handleProcessCloseLead}
//                 >
//                   Continue
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {isConvertedLeadModalOpen && selectedLead && selectedVehicleId && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsConvertedLeadModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
//               <h5 className="text-base font-medium">
//                 Converted Lead - Invoice Details
//               </h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsConvertedLeadModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>
//             <div className="p-4 flex-1 overflow-y-auto">
//               <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                 <h6 className="text-base font-medium text-primary-blue mb-3">
//                   Converted Lead - Invoice Details
//                 </h6>
//                 <div className="mb-4">
//                   <p className="text-sm text-gray-600 mb-2">
//                     Please confirm the vehicle details are correct:
//                   </p>
//                   <div className="bg-light-blue p-3 rounded-md mb-4">
//                     <p className="font-medium">
//                       {
//                         selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         )?.brand?.name
//                       }{" "}
//                       {
//                         selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         )?.variant?.name
//                       }
//                     </p>
//                     {/* Enhanced Price and Color Display */}
//                     <p className="text-sm text-gray-600">
//                       {(() => {
//                         // Get color from multiple sources
//                         const vehicle = selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         );

//                         // Priority 1: Color from vehicle.color
//                         if (vehicle?.color?.name) {
//                           return vehicle.color.name;
//                         }

//                         // Priority 2: Color from colors state
//                         const foundColor = colors.find(
//                           (c) => c.id === vehicle?.color_id
//                         );
//                         if (foundColor?.name || foundColor?.color_name) {
//                           return foundColor.name || foundColor.color_name;
//                         }

//                         // Priority 3: Check if color_name is directly on vehicle
//                         if (vehicle?.color_name) {
//                           return vehicle.color_name;
//                         }

//                         return "N/A";
//                       })()}{" "}
//                       |{" "}
//                       {(() => {
//                         // Get price from multiple sources
//                         const vehicle = selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         );

//                         // Priority 1: Price from vehicle.variant
//                         if (vehicle?.variant?.basic_price) {
//                           return `₹${parseFloat(
//                             vehicle.variant.basic_price
//                           ).toLocaleString("en-IN")}`;
//                         }

//                         // Priority 2: Price from variants state
//                         const foundVariant = variants.find(
//                           (v) => v.id === vehicle?.variant_id
//                         );
//                         if (foundVariant?.basic_price) {
//                           return `₹${parseFloat(
//                             foundVariant.basic_price
//                           ).toLocaleString("en-IN")}`;
//                         }

//                         // Priority 3: Check if basic_price is directly on vehicle
//                         if (vehicle?.basic_price) {
//                           return `₹${parseFloat(
//                             vehicle.basic_price
//                           ).toLocaleString("en-IN")}`;
//                         }

//                         return "Price on request";
//                       })()}
//                     </p>
//                   </div>
//                   <div className="flex items-center mb-4">
//                     <input
//                       type="checkbox"
//                       id="confirmDetails"
//                       className="mr-2"
//                       checked={confirmDetails}
//                       onChange={(e) => setConfirmDetails(e.target.checked)}
//                     />
//                     <label
//                       htmlFor="confirmDetails"
//                       className="text-sm text-gray-600"
//                     >
//                       I confirm the customer purchased exactly this vehicle
//                     </label>
//                   </div>
//                   {!confirmDetails && (
//                     <div className="flex justify-center mb-4">
//                       <button
//                         className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                         onClick={() => {
//                           setIsConvertedLeadModalOpen(false);
//                           handleEditLead(selectedLead);
//                         }}
//                       >
//                         Edit Vehicle Details
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 <div className="mb-4">
//                   <h6 className="text-base font-medium text-primary-blue mb-3">
//                     Invoice Details
//                   </h6>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Invoice Number
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full border border-secondary-grey rounded p-2 text-sm"
//                         value={invoiceNumber}
//                         onChange={(e) => setInvoiceNumber(e.target.value)}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Invoice Copy
//                       </label>
//                       <input
//                         type="file"
//                         className="w-full border border-secondary-grey rounded p-2 text-sm"
//                         accept=".pdf,.jpg,.png"
//                         onChange={(e) => setInvoiceCopy(e.target.files[0])}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   className="btn-secondary rounded-md px-4 py-2 text-sm"
//                   onClick={() => setIsConvertedLeadModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                   onClick={handleSubmitConvertedLead}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       <style jsx>{`
//         .action-btn {
//           width: 36px;
//           height: 36px;
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.2s ease;
//           cursor: pointer;
//         }
//         .action-btn:hover {
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
//         }
//         .btn-view {
//           background-color: rgba(67, 97, 238, 0.1);
//           color: var(--primary-blue);
//         }
//         .btn-edit {
//           background-color: rgba(248, 150, 30, 0.1);
//           color: var(--highlight-yellow);
//         }
//         .btn-close {
//           background-color: rgba(16, 185, 129, 0.1);
//           color: black;
//         }
//         .draft-age {
//           font-size: 12px;
//           padding: 4px 10px;
//           border-radius: 20px;
//           font-weight: 500;
//         }
//         .draft-new {
//           background-color: rgba(16, 185, 129, 0.2);
//           color: var(--accent-green);
//         }
//         .draft-old {
//           background-color: rgba(239, 68, 68, 0.2);
//           color: var(--accent-red);
//         }
//         .payment-badge {
//           font-size: 12px;
//           padding: 4px 10px;
//           border-radius: 20px;
//           font-weight: 500;
//           text-transform: capitalize;
//         }
//         .payment-cash {
//           background-color: rgba(16, 185, 129, 0.2);
//           color: var(--accent-green);
//         }
//         .payment-finance {
//           background-color: rgba(239, 68, 68, 0.2);
//           color: var(--accent-red);
//         }
//         .btn-secondary {
//           background-color: #6c757d;
//           color: white;
//           transition: all 0.2s ease;
//         }
//         .btn-secondary:hover {
//           box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
//         }
//         .btn-success {
//           background-color: var(--accent-green);
//           color: white;
//           transition: all 0.2s ease;
//         }
//         .btn-success:hover {
//           box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
//         }
//         .mobile-concise-view .vehicle-section {
//           margin-bottom: 1rem;
//           padding-bottom: 1rem;
//           border-bottom: 1px solid #e5e7eb;
//         }
//         .mobile-concise-view .vehicle-section:last-child {
//           border-bottom: none;
//         }
//         .mobile-concise-view .vehicle-header {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           margin-bottom: 0.75rem;
//         }
//         .mobile-concise-view .vehicle-details {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 0.5rem;
//         }
//         .mobile-concise-view .detail-item {
//           margin-bottom: 0.5rem;
//         }
//         .mobile-concise-view .detail-label {
//           font-size: 0.75rem;
//           color: #6b7280;
//           font-weight: 500;
//         }
//         .mobile-concise-view .detail-value {
//           font-size: 0.875rem;
//           font-weight: 500;
//           color: #1f2937;
//         }
//         @media (max-width: 640px) {
//           .lead-card {
//             padding: 1rem;
//           }
//           .desktop-actions {
//             display: none;
//           }
//           .mobile-actions {
//             display: flex;
//             gap: 8px;
//             margin-top: 12px;
//           }
//         }
//         @media (min-width: 641px) {
//           .mobile-actions {
//             display: none;
//           }
//           .desktop-actions {
//             display: flex;
//             gap: 8px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// // --- Loader Component ---
// function Loader() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] font-montserrat space-y-4">
//       <div className="w-16 h-16 border-4 border-primary-blue border-dashed rounded-full animate-spin"></div>
//       <span className="text-gray-600 font-medium">Loading Open Leads...</span>
//     </div>
//   );
// }

// // --- Error Component ---
// function ErrorMessage({ message, onRetry }) {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] font-montserrat space-y-4">
//       <i className="bi bi-exclamation-triangle text-red-500 text-4xl"></i>
//       <p className="text-red-500 text-lg font-medium text-center max-w-md">
//         {message}
//       </p>
//       <button
//         onClick={onRetry}
//         className="btn-primary-blue rounded-md px-6 py-2 text-sm font-medium flex items-center"
//       >
//         <i className="bi bi-arrow-clockwise mr-2"></i>
//         Try Again
//       </button>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// export default function OpenLeads() {
//   const [openLeads, setOpenLeads] = useState([]);
//   const [galleries, setGalleries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isCloseLeadModalOpen, setIsCloseLeadModalOpen] = useState(false);
//   const [isConvertedLeadModalOpen, setIsConvertedLeadModalOpen] =
//     useState(false);
//   const [isCloseEntireLeadModalOpen, setIsCloseEntireLeadModalOpen] =
//     useState(false);
//   const [selectedVehicleId, setSelectedVehicleId] = useState(null);
//   const [closeType, setCloseType] = useState("converted");
//   const [unrealizedReason, setUnrealizedReason] = useState("");
//   const [otherReason, setOtherReason] = useState("");
//   const [invoiceNumber, setInvoiceNumber] = useState("");
//   const [invoiceCopy, setInvoiceCopy] = useState(null);
//   const [confirmDetails, setConfirmDetails] = useState(true);
//   const [sortOrder, setSortOrder] = useState("newest");
//   const navigate = useNavigate();

//   const [brands, setBrands] = useState([]);
//   const [variants, setVariants] = useState([]);
//   const [colors, setColors] = useState([]);
//   const API_BASE = "http://localhost:8000/api";

//   const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   // Refresh lead data when view modal opens
//   useEffect(() => {
//     if (isViewModalOpen && selectedLead) {
//       const refreshSelectedLead = async () => {
//         try {
//           const response = await axios.get(
//             `${API_BASE}/leads/${selectedLead.id}`,
//             { headers: getAuthHeaders() }
//           );
//           if (response.data.success) {
//             setSelectedLead(response.data.data);
//           }
//         } catch (err) {
//           console.error("Failed to refresh lead data:", err);
//         }
//       };
//       refreshSelectedLead();
//     }
//   }, [isViewModalOpen, selectedLead?.id]);

//   // Fetch initial data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // Fetch open leads
//         const leadsResponse = await axios.get(
//           `${API_BASE}/leads-by-status?status=Open`,
//           { headers: getAuthHeaders() }
//         );
//         if (leadsResponse.data.success) {
//           const leads = leadsResponse.data.data || [];
//           setOpenLeads(leads);
//           if (leads.length === 0) {
//             setError("No open leads found.");
//           }
//         } else {
//           setError(leadsResponse.data.message || "Failed to fetch open leads.");
//         }

//         // Fetch galleries
//         const galleriesResponse = await axios.get(`${API_BASE}/galleries`, {
//           headers: getAuthHeaders(),
//         });
//         if (galleriesResponse.data.status) {
//           setGalleries(galleriesResponse.data.data || []);
//         }

//         // Fetch variants
//         const variantsResponse = await axios.get(`${API_BASE}/variants`, {
//           headers: getAuthHeaders(),
//         });
//         if (variantsResponse.data.data || variantsResponse.data) {
//           setVariants(
//             variantsResponse.data.data || variantsResponse.data || []
//           );
//         }

//         // Fetch brands
//         const brandsResponse = await axios.get(`${API_BASE}/brands`, {
//           headers: getAuthHeaders(),
//         });
//         if (brandsResponse.data.data || brandsResponse.data) {
//           setBrands(brandsResponse.data.data || brandsResponse.data || []);
//         }

//         // Fetch colors
//         const colorsResponse = await axios.get(`${API_BASE}/colors`, {
//           headers: getAuthHeaders(),
//         });
//         if (colorsResponse.data.data || colorsResponse.data) {
//           setColors(colorsResponse.data.data || colorsResponse.data || []);
//         }
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to fetch data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Handler functions for dropdown changes
//   const handleBrandChange = (brandId, vehicleIndex) => {
//     setSelectedLead((prevLead) => {
//       if (!prevLead) return prevLead;
//       const updatedLeadDetails = [...prevLead.lead_details];
//       const selectedBrand = brands.find((brand) => brand.id == brandId);

//       updatedLeadDetails[vehicleIndex] = {
//         ...updatedLeadDetails[vehicleIndex],
//         brand_id: brandId,
//         brand_name: selectedBrand?.name || "",
//         variant_id: "",
//         variant_name: "",
//         color_id: "",
//         color_name: "",
//         color_code: "",
//         variant: null,
//         color: null,
//       };

//       return {
//         ...prevLead,
//         lead_details: updatedLeadDetails,
//       };
//     });
//   };

//   const handleVariantChange = (variantId, vehicleIndex) => {
//     setSelectedLead((prevLead) => {
//       if (!prevLead) return prevLead;
//       const updatedLeadDetails = [...prevLead.lead_details];
//       const selectedVariant = variants.find(
//         (variant) => variant.id == variantId
//       );

//       updatedLeadDetails[vehicleIndex] = {
//         ...updatedLeadDetails[vehicleIndex],
//         variant_id: variantId,
//         variant_name: selectedVariant?.name || "",
//         color_id: "",
//         color_name: "",
//         color_code: "",
//         variant: selectedVariant,
//         color: null,
//       };

//       return {
//         ...prevLead,
//         lead_details: updatedLeadDetails,
//       };
//     });
//   };

//   const handleColorChange = (colorId, vehicleIndex) => {
//     setSelectedLead((prevLead) => {
//       if (!prevLead) return prevLead;
//       const updatedLeadDetails = [...prevLead.lead_details];
//       const selectedColor = colors.find((color) => color.id == colorId);

//       updatedLeadDetails[vehicleIndex] = {
//         ...updatedLeadDetails[vehicleIndex],
//         color_id: colorId,
//         color_name: selectedColor?.name || selectedColor?.color_name || "",
//         color_code: selectedColor?.color_code || "",
//         color: selectedColor,
//       };

//       return {
//         ...prevLead,
//         lead_details: updatedLeadDetails,
//       };
//     });
//   };

//   const handleRefresh = () => {
//     setLoading(true);
//     setError(null);
//     const fetchData = async () => {
//       try {
//         const leadsResponse = await axios.get(
//           `${API_BASE}/leads-by-status?status=Open`,
//           { headers: getAuthHeaders() }
//         );
//         if (leadsResponse.data.success) {
//           setOpenLeads(leadsResponse.data.data || []);
//         }
//       } catch (err) {
//         setError("Failed to fetch open leads. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
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

//   const getVehicleImage = (vehicle) => {
//     if (!vehicle?.variant_id) {
//       return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//     }

//     let variantGallery = null;
//     if (vehicle.color_id) {
//       variantGallery = galleries.find(
//         (g) =>
//           g.variant_id == vehicle.variant_id && g.color_id == vehicle.color_id
//       );
//     }
//     if (!variantGallery) {
//       variantGallery = galleries.find(
//         (g) => g.variant_id == vehicle.variant_id
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
//         return imageUrl;
//       }
//     }
//     return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//   };

//   const getAbsoluteImageUrl = (url) => {
//     if (!url) return null;
//     if (url.startsWith("http://") || url.startsWith("https://")) {
//       return url;
//     }
//     if (url.startsWith("/")) {
//       return `http://localhost:8000${url}`;
//     }
//     const cleanPath = url.replace(/^[\\/]+/, "");
//     return `http://localhost:8000/uploads/coverPhotos/${cleanPath}`;
//   };

//   const getInvoiceUrl = (invoicePath) => {
//     if (!invoicePath) return null;
//     if (
//       invoicePath.startsWith("http://") ||
//       invoicePath.startsWith("https://")
//     ) {
//       return invoicePath;
//     }
//     if (invoicePath.startsWith("/")) {
//       return `http://localhost:8000${invoicePath}`;
//     }
//     return `http://localhost:8000/storage/${invoicePath}`;
//   };

//   const handleViewLead = async (lead) => {
//     console.log("Opening view modal for lead:", lead.id);
//     try {
//       const response = await axios.get(`${API_BASE}/leads/${lead.id}`, {
//         headers: getAuthHeaders(),
//       });

//       if (response.data.success) {
//         const apiLead = response.data.data;

//         // ✅ ENRICH EACH VEHICLE WITH FULL DATA
//         const enrichedDetails = apiLead.lead_details.map((vehicle) => {
//           const fullBrand = brands.find((b) => b.id == vehicle.brand_id);
//           const fullVariant = variants.find((v) => v.id == vehicle.variant_id);
//           const fullColor = colors.find((c) => c.id == vehicle.color_id);

//           return {
//             ...vehicle,
//             brand: fullBrand,
//             variant: fullVariant,
//             color: fullColor,
//             brand_name: fullBrand?.name || vehicle.brand_name || "N/A",
//             variant_name: fullVariant?.name || vehicle.variant_name || "N/A",
//             color_name:
//               fullColor?.color_name ||
//               fullColor?.name ||
//               vehicle.color_name ||
//               "N/A",
//             color_code: fullColor?.color_code || vehicle.color_code || "",
//           };
//         });

//         setSelectedLead({
//           ...apiLead,
//           lead_details: enrichedDetails,
//         });
//       } else {
//         // Fallback: Enrich cached data too
//         const enrichedDetails = lead.lead_details.map((vehicle) => {
//           const fullBrand = brands.find((b) => b.id == vehicle.brand_id);
//           const fullVariant = variants.find((v) => v.id == vehicle.variant_id);
//           const fullColor = colors.find((c) => c.id == vehicle.color_id);

//           return {
//             ...vehicle,
//             brand: fullBrand,
//             variant: fullVariant,
//             color: fullColor,
//             brand_name: fullBrand?.name || vehicle.brand_name || "N/A",
//             variant_name: fullVariant?.name || vehicle.variant_name || "N/A",
//             color_name:
//               fullColor?.color_name ||
//               fullColor?.name ||
//               vehicle.color_name ||
//               "N/A",
//             color_code: fullColor?.color_code || vehicle.color_code || "",
//           };
//         });

//         setSelectedLead({
//           ...lead,
//           lead_details: enrichedDetails,
//         });
//       }
//     } catch (err) {
//       console.error("Failed to refresh lead:", err);
//       // Even on error, enrich cached data
//       const enrichedDetails = lead.lead_details.map((vehicle) => {
//         const fullBrand = brands.find((b) => b.id == vehicle.brand_id);
//         const fullVariant = variants.find((v) => v.id == vehicle.variant_id);
//         const fullColor = colors.find((c) => c.id == vehicle.color_id);

//         return {
//           ...vehicle,
//           brand: fullBrand,
//           variant: fullVariant,
//           color: fullColor,
//           brand_name: fullBrand?.name || vehicle.brand_name || "N/A",
//           variant_name: fullVariant?.name || vehicle.variant_name || "N/A",
//           color_name:
//             fullColor?.color_name ||
//             fullColor?.name ||
//             vehicle.color_name ||
//             "N/A",
//           color_code: fullColor?.color_code || vehicle.color_code || "",
//         };
//       });

//       setSelectedLead({
//         ...lead,
//         lead_details: enrichedDetails,
//       });
//     }
//     setIsViewModalOpen(true);
//   };

//   const handleEditLead = (lead) => {
//     setSelectedLead(lead);
//     setIsEditModalOpen(true);
//   };

//   const handleCloseEntireLead = (lead) => {
//     setSelectedLead(lead);
//     setCloseType("converted");
//     setUnrealizedReason("");
//     setOtherReason("");
//     setIsCloseEntireLeadModalOpen(true);
//   };

//   const handleCloseVehicle = (lead, vehicleId) => {
//     setSelectedLead(lead);
//     setSelectedVehicleId(vehicleId);
//     setCloseType("converted");
//     setUnrealizedReason("");
//     setOtherReason("");
//     setIsCloseLeadModalOpen(true);
//   };

//   const handleProcessCloseEntireLead = async () => {
//     if (!selectedLead) return;

//     try {
//       if (closeType === "converted") {
//         setInvoiceNumber("");
//         setInvoiceCopy(null);
//         setConfirmDetails(true);
//         setIsCloseEntireLeadModalOpen(false);
//         setIsConvertedLeadModalOpen(true);
//       } else {
//         if (!unrealizedReason) {
//           alert("Please select a reason for unrealized lead.");
//           return;
//         }

//         const closeReason =
//           unrealizedReason === "other" ? otherReason : unrealizedReason;

//         console.log("Closing entire lead as unrealized:", {
//           close_reason: closeReason,
//         });

//         // Use the close-entire route for better performance
//         await axios.put(
//           `${API_BASE}/leads/${selectedLead.id}/close-entire`,
//           {
//             close_type: "unrealized",
//             unrealized_reason: closeReason,
//           },
//           { headers: getAuthHeaders() }
//         );

//         // Remove from open leads
//         setOpenLeads((prev) =>
//           prev.filter((lead) => lead.id !== selectedLead.id)
//         );

//         setIsCloseEntireLeadModalOpen(false);
//         setSelectedLead(null);
//         alert("Entire lead marked as unrealized successfully!");
//       }
//     } catch (err) {
//       console.error("Failed to close entire lead:", err);
//       console.error("Error response:", err.response);
//       alert(
//         `Failed to close entire lead: ${
//           err.response?.data?.message || err.message
//         }`
//       );
//     }
//   };

//   const handleProcessCloseLead = async () => {
//     if (!selectedLead || !selectedVehicleId) return;

//     const vehicle = selectedLead.lead_details.find(
//       (v) => v.id === selectedVehicleId
//     );
//     if (!vehicle) return;

//     if (closeType === "converted") {
//       setInvoiceNumber("");
//       setInvoiceCopy(null);
//       setConfirmDetails(true);
//       setIsCloseLeadModalOpen(false);
//       setIsConvertedLeadModalOpen(true);
//     } else {
//       if (!unrealizedReason) {
//         alert("Please select a reason for unrealized lead.");
//         return;
//       }

//       try {
//         const closeReason =
//           unrealizedReason === "other" ? otherReason : unrealizedReason;

//         console.log("Sending unrealized lead data:", {
//           close_reason: closeReason,
//         });

//         // For unrealized - send close_reason as JSON
//         await axios.put(
//           `${API_BASE}/lead-details/${vehicle.id}/close`,
//           {
//             close_reason: closeReason,
//           },
//           { headers: getAuthHeaders() }
//         );

//         // Update local state
//         const updatedLead = { ...selectedLead };
//         const vehicleIndex = updatedLead.lead_details.findIndex(
//           (v) => v.id === selectedVehicleId
//         );
//         updatedLead.lead_details[vehicleIndex].status = "unrealized";
//         updatedLead.lead_details[vehicleIndex].close_reason = closeReason;

//         const allClosed = updatedLead.lead_details.every(
//           (v) => v.status !== "open"
//         );

//         if (allClosed) {
//           await axios.put(
//             `${API_BASE}/leads/${selectedLead.id}/status`,
//             { status: "closed" },
//             { headers: getAuthHeaders() }
//           );
//           setOpenLeads((prev) =>
//             prev.filter((lead) => lead.id !== selectedLead.id)
//           );
//         } else {
//           setOpenLeads((prev) =>
//             prev.map((lead) =>
//               lead.id === selectedLead.id ? updatedLead : lead
//             )
//           );
//         }

//         setIsCloseLeadModalOpen(false);
//         setSelectedLead(null);
//         setSelectedVehicleId(null);
//         alert("Vehicle marked as unrealized successfully!");
//       } catch (err) {
//         console.error("Failed to close vehicle:", err);
//         console.error("Error response:", err.response);
//         alert(
//           `Failed to close vehicle: ${
//             err.response?.data?.message || err.message
//           }`
//         );
//       }
//     }
//   };

//   const handleSubmitConvertedLead = async () => {
//     if (!selectedLead) return;
//     try {
//       if (selectedVehicleId) {
//         // Single vehicle conversion
//         if (!invoiceNumber) {
//           alert("Please enter invoice number.");
//           return;
//         }
//         const response = await axios.put(
//           `${API_BASE}/lead-details/${selectedVehicleId}/close`,
//           { invoice_no: invoiceNumber },
//           { headers: getAuthHeaders() }
//         );

//         // Update local state
//         const updatedLead = { ...selectedLead };
//         const vehicleIndex = updatedLead.lead_details.findIndex(
//           (v) => v.id === selectedVehicleId
//         );
//         updatedLead.lead_details[vehicleIndex].status = "converted";
//         updatedLead.lead_details[vehicleIndex].invoice_no = invoiceNumber;

//         const allClosed = updatedLead.lead_details.every(
//           (v) => v.status !== "open"
//         );
//         if (allClosed) {
//           // ✅ FIXED ROUTE + PAYLOAD
//           await axios.put(
//             `${API_BASE}/leads/${selectedLead.id}/update-status`,
//             {
//               status: "closed",
//               lead_detail_id: selectedVehicleId,
//             },
//             { headers: getAuthHeaders() }
//           );
//           setOpenLeads((prev) =>
//             prev.filter((lead) => lead.id !== selectedLead.id)
//           );
//         } else {
//           setOpenLeads((prev) =>
//             prev.map((lead) =>
//               lead.id === selectedLead.id ? updatedLead : lead
//             )
//           );
//         }
//         setIsConvertedLeadModalOpen(false);
//         setSelectedLead(null);
//         setSelectedVehicleId(null);
//         alert("Vehicle converted successfully!");
//       } else {
//         // Entire lead conversion
//         if (!invoiceNumber) {
//           alert("Please enter invoice number.");
//           return;
//         }

//         const convertPromises = selectedLead.lead_details.map((vehicle) => {
//           return axios.put(
//             `${API_BASE}/lead-details/${vehicle.id}/close`,
//             { invoice_no: invoiceNumber },
//             { headers: getAuthHeaders() }
//           );
//         });

//         const results = await Promise.allSettled(convertPromises);
//         const rejected = results.filter(
//           (result) => result.status === "rejected"
//         );
//         if (rejected.length > 0) {
//           throw new Error(`${rejected.length} vehicles failed to convert`);
//         }

//         // ✅ FIXED ROUTE + PAYLOAD
//         await axios.put(
//           `${API_BASE}/leads/${selectedLead.id}/update-status`,
//           {
//             status: "closed",
//             lead_detail_id: selectedLead.lead_details[0]?.id,
//           },
//           { headers: getAuthHeaders() }
//         );

//         setOpenLeads((prev) =>
//           prev.filter((lead) => lead.id !== selectedLead.id)
//         );
//         setIsConvertedLeadModalOpen(false);
//         setSelectedLead(null);
//         alert("Entire lead converted successfully!");
//       }
//     } catch (err) {
//       console.error("Failed to convert lead:", err);
//       alert(
//         `Failed to convert lead: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//   const handleSaveLead = async () => {
//     if (!selectedLead) return;

//     try {
//       const leadPayload = {
//         customer_name: selectedLead.customer_name || "",
//         phone_no: selectedLead.phone_no || "",
//         location: selectedLead.location || "",
//         payment_mode: selectedLead.payment_mode || "",
//         tentative_purchase_date: selectedLead.tentative_purchase_date || null,
//         vehicle_qty: selectedLead.lead_details?.length || 1,
//         status: "Open",
//       };

//       if (!leadPayload.customer_name) {
//         throw new Error("Customer name is required.");
//       }
//       if (!leadPayload.phone_no || !/^[0-9]{10}$/.test(leadPayload.phone_no)) {
//         throw new Error("Phone number must be a valid 10-digit number.");
//       }

//       const leadResponse = await axios.put(
//         `${API_BASE}/leads/${selectedLead.id}`,
//         leadPayload,
//         { headers: getAuthHeaders() }
//       );

//       if (!leadResponse.data.success) {
//         throw new Error(leadResponse.data.message || "Failed to update lead");
//       }

//       // Update lead details for each vehicle
//       const updatedLeadDetails = [];
//       for (const vehicle of selectedLead.lead_details) {
//         const vehiclePayload = {
//           brand_id: vehicle.brand_id,
//           variant_id: vehicle.variant_id,
//           color_id: vehicle.color_id || null,
//           status: vehicle.status || "Open",
//         };

//         if (vehicle.id) {
//           const vehicleResponse = await axios.put(
//             `${API_BASE}/lead-details/${vehicle.id}`,
//             vehiclePayload,
//             { headers: getAuthHeaders() }
//           );

//           if (vehicleResponse.data.success) {
//             // Get the updated vehicle data with proper brand/variant/color information
//             const updatedVehicle = vehicleResponse.data.data;

//             // Find the corresponding brand, variant, and color from our state
//             const brand = brands.find((b) => b.id == updatedVehicle.brand_id);
//             const variant = variants.find(
//               (v) => v.id == updatedVehicle.variant_id
//             );
//             const color = colors.find((c) => c.id == updatedVehicle.color_id);

//             updatedLeadDetails.push({
//               ...updatedVehicle,
//               brand: brand || null,
//               variant: variant || null,
//               color: color || null,
//               brand_name: brand?.name || "",
//               variant_name: variant?.name || "",
//               color_name: color?.name || color?.color_name || "",
//               color_code: color?.color_code || "",
//             });
//           } else {
//             throw new Error(
//               vehicleResponse.data.message ||
//                 `Failed to update vehicle ${vehicle.id}`
//             );
//           }
//         }
//       }

//       // Update the openLeads state with the refreshed data
//       setOpenLeads((prev) =>
//         prev.map((lead) =>
//           lead.id === selectedLead.id
//             ? {
//                 ...lead,
//                 ...leadResponse.data.data,
//                 lead_details: updatedLeadDetails,
//               }
//             : lead
//         )
//       );

//       // Also update the selectedLead to reflect changes in modals
//       setSelectedLead((prev) => ({
//         ...prev,
//         ...leadResponse.data.data,
//         lead_details: updatedLeadDetails,
//       }));

//       setIsEditModalOpen(false);
//       alert("Lead updated successfully!");
//     } catch (err) {
//       console.error("Failed to update lead:", err);
//       alert(
//         `Failed to update lead: ${err.response?.data?.message || err.message}`
//       );
//     }
//   };

//   const sortLeadsByAge = (order) => {
//     if (order === "newest") {
//       setOpenLeads((prev) =>
//         [...prev].sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         )
//       );
//     } else {
//       setOpenLeads((prev) =>
//         [...prev].sort(
//           (a, b) => new Date(a.created_at) - new Date(b.created_at)
//         )
//       );
//     }
//   };

//   if (loading) return <Loader />;
//   if (error && openLeads.length === 0)
//     return <ErrorMessage message={error} onRetry={handleRefresh} />;

//   return (
//     <div className="min-h-screen bg-gray-50 font-montserrat text-sm">
//       {/* Open Leads Section */}
//       <section className="p-4 md:p-6">
//         <div className="container mx-auto px-0 max-w-7xl">
//           <div className="flex justify-between items-center mb-6">
//             <div className="flex items-center gap-2">
//               <label
//                 htmlFor="sortLeads"
//                 className="text-xs font-medium text-gray-600"
//               >
//                 Sort Leads by Age:
//               </label>
//               <select
//                 id="sortLeads"
//                 value={sortOrder}
//                 onChange={(e) => {
//                   setSortOrder(e.target.value);
//                   sortLeadsByAge(e.target.value);
//                 }}
//                 className="border border-secondary-grey rounded-md px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-primary-blue"
//               >
//                 <option value="newest">Newest First</option>
//                 <option value="oldest">Oldest First</option>
//               </select>
//             </div>
//           </div>
//           {openLeads.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4">📝</div>
//               <h3 className="text-gray-500 text-xl font-medium mb-2">
//                 No Open Leads
//               </h3>
//               <p className="text-gray-400 mb-6">
//                 {error || "There are currently no open leads in the system."}
//               </p>
//               <Link
//                 to="/leads/generate"
//                 className="btn-primary-blue rounded-md px-6 py-3 text-sm font-medium"
//               >
//                 <i className="bi bi-plus-lg"></i>
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4" id="leadsContainer">
//               {openLeads.map((lead) => {
//                 const draftAge = calculateLeadAge(lead.created_at);
//                 const draftAgeClass = getDraftAgeClass(draftAge);
//                 return (
//                   <div
//                     key={lead.id}
//                     className="lead-card bg-white p-5 rounded-lg shadow-md"
//                     data-lead-id={lead.id}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h6 className="text-base font-semibold text-text-dark mb-1">
//                               {lead.customer_name}
//                             </h6>
//                             <p className="text-sm text-gray-600 mb-1">
//                               {lead.location || "N/A"}
//                             </p>
//                           </div>
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
//                               className="action-btn btn-close"
//                               title="Close Lead"
//                               onClick={() => handleCloseEntireLead(lead)}
//                             >
//                               <i className="bi bi-check-lg"></i>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="mt-2 space-y-1">
//                           {lead.lead_details?.map((vehicle) => (
//                             <p
//                               key={vehicle.id}
//                               className="text-sm text-gray-600 mb-1"
//                             >
//                               {vehicle.brand?.name || "No brand"} -{" "}
//                               {vehicle.variant?.name || "No variant"}
//                               {vehicle.color?.name &&
//                                 ` - ${vehicle.color.name}`}
//                               {vehicle.invoice_no &&
//                                 ` (Invoice: ${vehicle.invoice_no})`}
//                             </p>
//                           ))}
//                         </div>
//                         <div className="flex items-center gap-2 mt-2">
//                           <span className={`draft-age ${draftAgeClass}`}>
//                             {draftAge} day{draftAge !== 1 ? "s" : ""}
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
//                             className="action-btn btn-close"
//                             title="Close Lead"
//                             onClick={() => handleCloseEntireLead(lead)}
//                           >
//                             <i className="bi bi-check-lg"></i>
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
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsViewModalOpen(false)}
//           key={`view-modal-${selectedLead.id}-${selectedLead.updated_at}`}
//         >
//           <div
//             className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
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
//               {window.innerWidth <= 640 ? (
//                 // Mobile-optimized concise view
//                 <React.Fragment>
//                   <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                     <h6 className="text-base font-medium text-primary-blue mb-3 flex items-center">
//                       <i className="bi bi-person-fill mr-2"></i> Customer
//                       Information
//                     </h6>
//                     <div className="grid grid-cols-2 gap-3">
//                       <div>
//                         <p className="text-xs text-gray-500">Name</p>
//                         <p className="text-sm font-medium">
//                           {selectedLead.customer_name}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Mobile</p>
//                         <p className="text-sm font-medium">
//                           {selectedLead.phone_no}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Location</p>
//                         <p className="text-sm font-medium">
//                           {selectedLead.location || "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Payment</p>
//                         <p className="text-sm font-medium">
//                           <span
//                             className={`payment-badge ${
//                               selectedLead.payment_mode === "cash"
//                                 ? "payment-cash"
//                                 : "payment-finance"
//                             }`}
//                           >
//                             {selectedLead.payment_mode}
//                           </span>
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   {selectedLead.lead_details.map((vehicle, index) => {
//                     const vehiclePrice = vehicle.variant?.basic_price
//                       ? `₹${parseFloat(
//                           vehicle.variant.basic_price
//                         ).toLocaleString("en-IN")}`
//                       : "Price on request";

//                     const vehicleColor =
//                       vehicle.color?.name || vehicle.color_name || "N/A";

//                     return (
//                       <div
//                         key={vehicle.id}
//                         className="bg-white p-3 rounded-lg shadow-sm mb-3 border border-secondary-grey mobile-concise-view"
//                       >
//                         <div className="vehicle-section">
//                           <div className="vehicle-header">
//                             <i className="bi bi-bicycle text-primary-blue"></i>
//                             <h6 className="text-sm font-medium text-primary-blue">
//                               Vehicle {index + 1}
//                             </h6>
//                             {vehicle.status === "open" && (
//                               <button
//                                 className="action-btn btn-close ml-auto"
//                                 title="Close Vehicle"
//                                 onClick={() =>
//                                   handleCloseVehicle(selectedLead, vehicle.id)
//                                 }
//                               >
//                                 <i className="bi bi-check-lg"></i>
//                               </button>
//                             )}
//                           </div>
//                           <div className="flex gap-3">
//                             <div className="w-1/3">
//                               <img
//                                 src={getVehicleImage(vehicle)}
//                                 alt={`${vehicle.brand?.name} ${vehicle.variant?.name}`}
//                                 className="w-full h-auto rounded-lg"
//                                 onError={(e) => {
//                                   e.target.src =
//                                     "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//                                 }}
//                               />
//                             </div>
//                             <div className="w-2/3">
//                               <div className="vehicle-details">
//                                 <div className="detail-item">
//                                   <p className="detail-label">Brand</p>
//                                   <p className="detail-value">
//                                     {vehicle.brand?.name || "N/A"}
//                                   </p>
//                                 </div>
//                                 <div className="detail-item">
//                                   <p className="detail-label">Variant</p>
//                                   <p className="detail-value">
//                                     {vehicle.variant?.name || "N/A"}
//                                   </p>
//                                 </div>
//                                 <div className="detail-item">
//                                   <p className="detail-label">Color</p>
//                                   <p className="detail-value">{vehicleColor}</p>
//                                 </div>
//                                 <div className="detail-item">
//                                   <p className="detail-label">Price</p>
//                                   <p className="text-primary-blue font-medium mt-1 text-sm">
//                                     {vehiclePrice}
//                                   </p>
//                                 </div>
//                                 {vehicle.invoice_no && (
//                                   <div className="detail-item">
//                                     <p className="detail-label">Invoice No</p>
//                                     <p className="detail-value">
//                                       {vehicle.invoice_no}
//                                     </p>
//                                   </div>
//                                 )}
//                                 {vehicle.uploaded_invoice && (
//                                   <div className="detail-item">
//                                     <p className="detail-label">Invoice Copy</p>
//                                     <a
//                                       href={getInvoiceUrl(
//                                         vehicle.uploaded_invoice
//                                       )}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="text-primary-blue underline text-sm"
//                                     >
//                                       View Invoice
//                                     </a>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </React.Fragment>
//               ) : (
//                 // Desktop detailed view
//                 <React.Fragment>
//                   <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                     <h6 className="text-base font-medium text-primary-blue mb-3 flex items-center">
//                       <i className="bi bi-person-fill mr-2"></i> Customer
//                       Information
//                     </h6>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600">
//                           Name
//                         </label>
//                         <p className="text-sm font-medium text-text-dark">
//                           {selectedLead.customer_name}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600">
//                           Mobile
//                         </label>
//                         <p className="text-sm font-medium text-text-dark">
//                           {selectedLead.phone_no}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600">
//                           Location
//                         </label>
//                         <p className="text-sm font-medium text-text-dark">
//                           {selectedLead.location || "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600">
//                           Address
//                         </label>
//                         <p className="text-sm font-medium text-text-dark">
//                           {selectedLead.location || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   {selectedLead.lead_details.map((vehicle, index) => {
//                     const vehiclePrice = vehicle.variant?.basic_price
//                       ? `₹${parseFloat(
//                           vehicle.variant.basic_price
//                         ).toLocaleString("en-IN")}`
//                       : "Price on request";

//                     const vehicleColor =
//                       vehicle.color?.name || vehicle.color_name || "N/A";

//                     return (
//                       <div
//                         key={vehicle.id}
//                         className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey"
//                       >
//                         <div className="flex justify-between items-center mb-3">
//                           <h6 className="text-base font-medium text-primary-blue flex items-center">
//                             <i className="bi bi-bicycle mr-2"></i> Vehicle{" "}
//                             {index + 1}
//                           </h6>
//                           <div className="flex gap-2">
//                             {vehicle.status === "open" && (
//                               <button
//                                 className="action-btn btn-close"
//                                 title="Close Vehicle"
//                                 onClick={() =>
//                                   handleCloseVehicle(selectedLead, vehicle.id)
//                                 }
//                               >
//                                 <i className="bi bi-check-lg"></i>
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex flex-col md:flex-row gap-4">
//                           <div className="md:w-1/3">
//                             <img
//                               src={getVehicleImage(vehicle)}
//                               alt={`${vehicle.brand?.name} ${vehicle.variant?.name}`}
//                               className="w-full h-64 object-cover rounded-lg"
//                               onError={(e) => {
//                                 e.target.src =
//                                   "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//                               }}
//                             />
//                           </div>
//                           <div className="md:w-2/3">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Brand
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehicle.brand?.name || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Variant
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehicle.variant?.name || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Color
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehicleColor}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Price
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehiclePrice}
//                                 </p>
//                               </div>
//                               {vehicle.invoice_no && (
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-600">
//                                     Invoice No
//                                   </label>
//                                   <p className="text-sm font-medium text-text-dark">
//                                     {vehicle.invoice_no}
//                                   </p>
//                                 </div>
//                               )}
//                               {vehicle.uploaded_invoice && (
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-600">
//                                     Invoice Copy
//                                   </label>
//                                   <a
//                                     href={getInvoiceUrl(
//                                       vehicle.uploaded_invoice
//                                     )}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-primary-blue underline text-sm"
//                                   >
//                                     View Invoice
//                                   </a>
//                                 </div>
//                               )}
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Payment Mode
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
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
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </React.Fragment>
//               )}
//               <div className="flex justify-between mt-4">
//                 <button
//                   className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                   onClick={() => handleCloseEntireLead(selectedLead)}
//                 >
//                   Close Entire Lead
//                 </button>
//                 <button
//                   className="btn-secondary rounded-md px-4 py-2 text-sm"
//                   onClick={() => setIsViewModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Close Entire Lead Modal */}
//       {isCloseEntireLeadModalOpen && selectedLead && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsCloseEntireLeadModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
//               <h5 className="text-base font-medium">Close Entire Lead</h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsCloseEntireLeadModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>
//             <div className="p-4 flex-1 overflow-y-auto">
//               <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                 <h6 className="text-base font-medium text-primary-blue mb-3">
//                   Close Entire Lead
//                 </h6>
//                 <div className="mb-4">
//                   <p className="text-sm text-gray-600 mb-2">
//                     You are closing the entire lead for:
//                   </p>
//                   <div className="bg-light-blue p-3 rounded-md">
//                     <p className="font-medium">{selectedLead.customer_name}</p>
//                     <p className="text-sm text-gray-600">
//                       {selectedLead.phone_no}
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       {selectedLead.location || "N/A"}
//                     </p>
//                   </div>
//                   <div className="mt-3">
//                     <p className="text-sm font-medium mb-2">
//                       Vehicles in this lead:
//                     </p>
//                     <ul className="list-disc list-inside text-sm text-gray-600">
//                       {selectedLead.lead_details.map((vehicle, index) => (
//                         <li key={vehicle.id}>
//                           {vehicle.brand?.name || "No brand"} -{" "}
//                           {vehicle.variant?.name || "No variant"}
//                           {vehicle.color?.name && ` - ${vehicle.color.name}`}
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-600 mb-2">
//                     Select Close Type for All Vehicles:
//                   </label>
//                   <div className="flex gap-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="closeType"
//                         value="converted"
//                         className="mr-2"
//                         checked={closeType === "converted"}
//                         onChange={() => setCloseType("converted")}
//                       />
//                       <span className="text-sm">
//                         Converted (All vehicles sold)
//                       </span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="closeType"
//                         value="unrealized"
//                         className="mr-2"
//                         checked={closeType === "unrealized"}
//                         onChange={() => setCloseType("unrealized")}
//                       />
//                       <span className="text-sm">
//                         Unrealized (All vehicles not sold)
//                       </span>
//                     </label>
//                   </div>
//                 </div>
//                 {closeType === "unrealized" && (
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-600 mb-2">
//                       Reason for Unrealized Lead:
//                     </label>
//                     <select
//                       className="w-full border border-secondary-grey rounded p-2 text-sm mb-2"
//                       value={unrealizedReason}
//                       onChange={(e) => setUnrealizedReason(e.target.value)}
//                     >
//                       <option value="" disabled>
//                         Select reason
//                       </option>
//                       <option value="price">Price too high</option>
//                       <option value="features">
//                         Not satisfied with features
//                       </option>
//                       <option value="delivery">Delivery timeline</option>
//                       <option value="competitor">
//                         Found better option with competitor
//                       </option>
//                       <option value="financial">Financial issues</option>
//                       <option value="other">Other</option>
//                     </select>
//                     {unrealizedReason === "other" && (
//                       <textarea
//                         className="w-full border border-secondary-grey rounded p-2 text-sm"
//                         placeholder="Please specify the reason..."
//                         value={otherReason}
//                         onChange={(e) => setOtherReason(e.target.value)}
//                       ></textarea>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   className="btn-secondary rounded-md px-4 py-2 text-sm"
//                   onClick={() => setIsCloseEntireLeadModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                   onClick={handleProcessCloseEntireLead}
//                 >
//                   Continue
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Lead Modal */}
//       {isEditModalOpen && selectedLead && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsEditModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
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
//               <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                 <h6 className="text-base font-medium text-primary-blue mb-3 flex items-center">
//                   <i className="bi bi-person-fill mr-2"></i> Customer
//                   Information
//                 </h6>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-secondary-grey rounded p-2 text-sm"
//                       value={selectedLead.customer_name || ""}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           customer_name: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Mobile
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-secondary-grey rounded p-2 text-sm"
//                       value={selectedLead.phone_no || ""}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           phone_no: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">
//                       Location
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-secondary-grey rounded p-2 text-sm"
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
//                       Address
//                     </label>
//                     <input
//                       type="text"
//                       className="w-full border border-secondary-grey rounded p-2 text-sm"
//                       value={selectedLead.location || ""}
//                       onChange={(e) =>
//                         setSelectedLead({
//                           ...selectedLead,
//                           location: e.target.value,
//                         })
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>
//               {selectedLead.lead_details.map((vehicle, index) => (
//                 <div
//                   key={vehicle.id}
//                   className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey"
//                 >
//                   <div className="flex justify-between items-center mb-3">
//                     <h6 className="text-base font-medium text-primary-blue flex items-center">
//                       <i className="bi bi-bicycle mr-2"></i> Vehicle {index + 1}
//                     </h6>
//                     <div className="flex gap-2">
//                       {vehicle.status === "open" && (
//                         <button
//                           className="action-btn btn-close"
//                           title="Close Vehicle"
//                           onClick={() =>
//                             handleCloseVehicle(selectedLead, vehicle.id)
//                           }
//                         >
//                           <i className="bi bi-check-lg"></i>
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex flex-col md:flex-row gap-4">
//                     <div className="md:w-1/3">
//                       <img
//                         src={getVehicleImage(vehicle)}
//                         alt={`${vehicle.brand?.name} ${vehicle.variant?.name}`}
//                         className="w-full h-64 object-cover rounded-lg"
//                         onError={(e) => {
//                           e.target.src =
//                             "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//                         }}
//                       />
//                     </div>
//                     <div className="md:w-2/3">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* Brand Dropdown */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Brand *
//                           </label>
//                           <select
//                             className="w-full border border-secondary-grey rounded p-2 text-sm"
//                             value={vehicle.brand_id || ""}
//                             onChange={(e) =>
//                               handleBrandChange(e.target.value, index)
//                             }
//                             required
//                           >
//                             <option value="">Select brand</option>
//                             {brands.map((brand) => (
//                               <option key={brand.id} value={brand.id}>
//                                 {brand.name}
//                               </option>
//                             ))}
//                           </select>
//                         </div>

//                         {/* Variant Dropdown */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Variant *
//                           </label>
//                           <select
//                             className="w-full border border-secondary-grey rounded p-2 text-sm"
//                             value={vehicle.variant_id || ""}
//                             onChange={(e) =>
//                               handleVariantChange(e.target.value, index)
//                             }
//                             required
//                             disabled={!vehicle.brand_id}
//                           >
//                             <option value="">Select variant</option>
//                             {vehicle.brand_id ? (
//                               variants
//                                 .filter((v) => v.brand_id == vehicle.brand_id)
//                                 .map((variant) => (
//                                   <option key={variant.id} value={variant.id}>
//                                     {variant.name}
//                                   </option>
//                                 ))
//                             ) : (
//                               <option value="" disabled>
//                                 Select brand first
//                               </option>
//                             )}
//                           </select>
//                         </div>

//                         {/* Color Dropdown */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Color *
//                           </label>
//                           <select
//                             className="w-full border border-secondary-grey rounded p-2 text-sm"
//                             value={vehicle.color_id || ""}
//                             onChange={(e) =>
//                               handleColorChange(e.target.value, index)
//                             }
//                             required
//                             disabled={!vehicle.variant_id}
//                           >
//                             <option value="">Select color</option>
//                             {vehicle.variant_id ? (
//                               (() => {
//                                 const variantGalleries = galleries.filter(
//                                   (g) => g.variant_id == vehicle.variant_id
//                                 );
//                                 const uniqueColorIds = [
//                                   ...new Set(
//                                     variantGalleries.map((g) => g.color_id)
//                                   ),
//                                 ];
//                                 const variantColors = colors.filter((color) =>
//                                   uniqueColorIds.includes(color.id)
//                                 );
//                                 return variantColors.map((color) => (
//                                   <option key={color.id} value={color.id}>
//                                     {color.name || color.color_name}
//                                     {color.color_code &&
//                                       ` (${color.color_code})`}
//                                   </option>
//                                 ));
//                               })()
//                             ) : (
//                               <option value="" disabled>
//                                 Select variant first
//                               </option>
//                             )}
//                           </select>
//                         </div>

//                         {/* Price (Read-only) */}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-600 mb-1">
//                             Price
//                           </label>
//                           <input
//                             type="text"
//                             className="w-full border border-secondary-grey rounded p-2 text-sm bg-gray-50"
//                             value={
//                               variants.find((v) => v.id == vehicle.variant_id)
//                                 ?.basic_price
//                                 ? `₹${parseFloat(
//                                     variants.find(
//                                       (v) => v.id == vehicle.variant_id
//                                     )?.basic_price
//                                   ).toLocaleString("en-IN")}`
//                                 : "Price on request"
//                             }
//                             readOnly
//                           />
//                         </div>

//                         {/* Payment Mode (for first vehicle only) */}
//                         {index === 0 && (
//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Payment Mode
//                             </label>
//                             <select
//                               className="w-full border border-secondary-grey rounded p-2 text-sm"
//                               value={selectedLead.payment_mode || "cash"}
//                               onChange={(e) =>
//                                 setSelectedLead({
//                                   ...selectedLead,
//                                   payment_mode: e.target.value,
//                                 })
//                               }
//                             >
//                               <option value="cash">Cash</option>
//                               <option value="finance">Finance</option>
//                             </select>
//                           </div>
//                         )}
//                       </div>

//                       {/* Color Preview */}
//                       {vehicle.color_code && (
//                         <div className="mt-3 flex items-center">
//                           <span className="text-sm text-gray-600 mr-2">
//                             Color Preview:
//                           </span>
//                           <div
//                             className="w-6 h-6 rounded-full border border-gray-300 mr-2"
//                             style={{ backgroundColor: vehicle.color_code }}
//                           ></div>
//                           <span className="text-sm text-gray-800">
//                             {vehicle.color_name || "Selected Color"}
//                           </span>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               <div className="flex justify-between mt-4">
//                 <div>
//                   <button
//                     className="btn-primary-blue rounded-md px-4 py-2 text-sm mr-2"
//                     onClick={handleSaveLead}
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     className="btn-secondary rounded-md px-4 py-2 text-sm"
//                     onClick={() => setIsEditModalOpen(false)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//                 <button
//                   className="btn-success rounded-md px-4 py-2 text-sm"
//                   onClick={() => handleCloseEntireLead(selectedLead)}
//                 >
//                   Close Lead
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Close Vehicle Modal */}
//       {isCloseLeadModalOpen && selectedLead && selectedVehicleId && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsCloseLeadModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
//               <h5 className="text-base font-medium">Close Vehicle</h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsCloseLeadModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>
//             <div className="p-4 flex-1 overflow-y-auto">
//               <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                 <h6 className="text-base font-medium text-primary-blue mb-3">
//                   Close Vehicle
//                 </h6>
//                 <div className="mb-4">
//                   <p className="text-sm text-gray-600 mb-2">
//                     You are closing the following vehicle:
//                   </p>
//                   <div className="bg-light-blue p-3 rounded-md">
//                     <p className="font-medium">
//                       {
//                         selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         )?.brand?.name
//                       }{" "}
//                       {
//                         selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         )?.variant?.name
//                       }
//                     </p>
//                     <p className="text-sm text-gray-600">
//                       {(() => {
//                         const vehicle = selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         );
//                         if (vehicle?.color?.name) return vehicle.color.name;
//                         const foundColor = colors.find(
//                           (c) => c.id === vehicle?.color_id
//                         );
//                         if (foundColor?.name || foundColor?.color_name)
//                           return foundColor.name || foundColor.color_name;
//                         if (vehicle?.color_name) return vehicle.color_name;
//                         return "";
//                       })()}{" "}
//                       {(() => {
//                         const vehicle = selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         );
//                         if (vehicle?.variant?.basic_price)
//                           return `₹${parseFloat(
//                             vehicle.variant.basic_price
//                           ).toLocaleString("en-IN")}`;
//                         const foundVariant = variants.find(
//                           (v) => v.id === vehicle?.variant_id
//                         );
//                         if (foundVariant?.basic_price)
//                           return `₹${parseFloat(
//                             foundVariant.basic_price
//                           ).toLocaleString("en-IN")}`;
//                         if (vehicle?.basic_price)
//                           return `₹${parseFloat(
//                             vehicle.basic_price
//                           ).toLocaleString("en-IN")}`;
//                         return "Price on request";
//                       })()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-600 mb-2">
//                     Select Close Type:
//                   </label>
//                   <div className="flex gap-4">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="closeType"
//                         value="converted"
//                         className="mr-2"
//                         checked={closeType === "converted"}
//                         onChange={() => setCloseType("converted")}
//                       />
//                       <span className="text-sm">Converted</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="closeType"
//                         value="unrealized"
//                         className="mr-2"
//                         checked={closeType === "unrealized"}
//                         onChange={() => setCloseType("unrealized")}
//                       />
//                       <span className="text-sm">Unrealized</span>
//                     </label>
//                   </div>
//                 </div>
//                 {closeType === "unrealized" && (
//                   <div className="mb-4">
//                     <label className="block text-sm font-medium text-gray-600 mb-2">
//                       Reason for Unrealized:
//                     </label>
//                     <select
//                       className="w-full border border-secondary-grey rounded p-2 text-sm mb-2"
//                       value={unrealizedReason}
//                       onChange={(e) => setUnrealizedReason(e.target.value)}
//                     >
//                       <option value="" disabled>
//                         Select reason
//                       </option>
//                       <option value="price">Price too high</option>
//                       <option value="features">
//                         Not satisfied with features
//                       </option>
//                       <option value="delivery">Delivery timeline</option>
//                       <option value="competitor">
//                         Found better option with competitor
//                       </option>
//                       <option value="financial">Financial issues</option>
//                       <option value="other">Other</option>
//                     </select>
//                     {unrealizedReason === "other" && (
//                       <textarea
//                         className="w-full border border-secondary-grey rounded p-2 text-sm"
//                         placeholder="Please specify the reason..."
//                         value={otherReason}
//                         onChange={(e) => setOtherReason(e.target.value)}
//                       ></textarea>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   className="btn-secondary rounded-md px-4 py-2 text-sm"
//                   onClick={() => setIsCloseLeadModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                   onClick={handleProcessCloseLead}
//                 >
//                   Continue
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Converted Lead Modal */}
//       {isConvertedLeadModalOpen && selectedLead && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsConvertedLeadModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
//               <h5 className="text-base font-medium">
//                 Converted Lead - Invoice Details
//               </h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsConvertedLeadModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>
//             <div className="p-4 flex-1 overflow-y-auto">
//               <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                 <h6 className="text-base font-medium text-primary-blue mb-3">
//                   Converted Lead - Invoice Details
//                 </h6>
//                 <div className="mb-4">
//                   <p className="text-sm text-gray-600 mb-2">
//                     Please confirm the vehicle details are correct:
//                   </p>
//                   <div className="bg-light-blue p-3 rounded-md mb-4">
//                     {selectedVehicleId ? (
//                       // Single vehicle
//                       <>
//                         <p className="font-medium">
//                           {
//                             selectedLead.lead_details.find(
//                               (v) => v.id === selectedVehicleId
//                             )?.brand?.name
//                           }{" "}
//                           {
//                             selectedLead.lead_details.find(
//                               (v) => v.id === selectedVehicleId
//                             )?.variant?.name
//                           }
//                         </p>
//                         <p className="text-sm text-gray-600">
//                           {(() => {
//                             const vehicle = selectedLead.lead_details.find(
//                               (v) => v.id === selectedVehicleId
//                             );
//                             if (vehicle?.color?.name) return vehicle.color.name;
//                             const foundColor = colors.find(
//                               (c) => c.id === vehicle?.color_id
//                             );
//                             if (foundColor?.name || foundColor?.color_name)
//                               return foundColor.name || foundColor.color_name;
//                             if (vehicle?.color_name) return vehicle.color_name;
//                             return "N/A";
//                           })()}{" "}
//                           |{" "}
//                           {(() => {
//                             const vehicle = selectedLead.lead_details.find(
//                               (v) => v.id === selectedVehicleId
//                             );
//                             if (vehicle?.variant?.basic_price)
//                               return `₹${parseFloat(
//                                 vehicle.variant.basic_price
//                               ).toLocaleString("en-IN")}`;
//                             const foundVariant = variants.find(
//                               (v) => v.id === vehicle?.variant_id
//                             );
//                             if (foundVariant?.basic_price)
//                               return `₹${parseFloat(
//                                 foundVariant.basic_price
//                               ).toLocaleString("en-IN")}`;
//                             if (vehicle?.basic_price)
//                               return `₹${parseFloat(
//                                 vehicle.basic_price
//                               ).toLocaleString("en-IN")}`;
//                             return "Price on request";
//                           })()}
//                         </p>
//                       </>
//                     ) : (
//                       // Entire lead
//                       <>
//                         <p className="font-medium">All Vehicles in Lead</p>
//                         <ul className="text-sm text-gray-600 list-disc list-inside">
//                           {selectedLead.lead_details.map((vehicle) => (
//                             <li key={vehicle.id}>
//                               {vehicle.brand?.name} {vehicle.variant?.name} -{" "}
//                               {vehicle.color?.name || "N/A"}
//                             </li>
//                           ))}
//                         </ul>
//                       </>
//                     )}
//                   </div>
//                   <div className="flex items-center mb-4">
//                     <input
//                       type="checkbox"
//                       id="confirmDetails"
//                       className="mr-2"
//                       checked={confirmDetails}
//                       onChange={(e) => setConfirmDetails(e.target.checked)}
//                     />
//                     <label
//                       htmlFor="confirmDetails"
//                       className="text-sm text-gray-600"
//                     >
//                       I confirm the customer purchased exactly this vehicle
//                       {selectedVehicleId ? "" : "s"}
//                     </label>
//                   </div>
//                   {!confirmDetails && (
//                     <div className="flex justify-center mb-4">
//                       <button
//                         className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                         onClick={() => {
//                           setIsConvertedLeadModalOpen(false);
//                           handleEditLead(selectedLead);
//                         }}
//                       >
//                         Edit Vehicle Details
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 <div className="mb-4">
//                   <h6 className="text-base font-medium text-primary-blue mb-3">
//                     Invoice Details
//                   </h6>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Invoice Number *
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full border border-secondary-grey rounded p-2 text-sm"
//                         value={invoiceNumber}
//                         onChange={(e) => setInvoiceNumber(e.target.value)}
//                         required
//                         placeholder="Enter invoice number"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Upload Invoice Copy (Optional)
//                       </label>
//                       <input
//                         type="file"
//                         className="w-full border border-secondary-grey rounded p-2 text-sm"
//                         accept=".pdf,.jpg,.jpeg,.png"
//                         onChange={(e) => setInvoiceCopy(e.target.files[0])}
//                       />
//                       <p className="text-xs text-gray-500 mt-1">
//                         Supported formats: PDF, JPG, JPEG, PNG (Max: 10MB)
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-end gap-2">
//                 <button
//                   className="btn-secondary rounded-md px-4 py-2 text-sm"
//                   onClick={() => setIsConvertedLeadModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                   onClick={handleSubmitConvertedLead}
//                   disabled={!invoiceNumber}
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         .action-btn {
//           width: 36px;
//           height: 36px;
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.2s ease;
//           cursor: pointer;
//         }
//         .action-btn:hover {
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
//         }
//         .btn-view {
//           background-color: rgba(67, 97, 238, 0.1);
//           color: var(--primary-blue);
//         }
//         .btn-edit {
//           background-color: rgba(248, 150, 30, 0.1);
//           color: var(--highlight-yellow);
//         }
//         .btn-close {
//           background-color: rgba(16, 185, 129, 0.1);
//           color: black;
//         }
//         .draft-age {
//           font-size: 12px;
//           padding: 4px 10px;
//           border-radius: 20px;
//           font-weight: 500;
//         }
//         .draft-new {
//           background-color: rgba(16, 185, 129, 0.2);
//           color: var(--accent-green);
//         }
//         .draft-old {
//           background-color: rgba(239, 68, 68, 0.2);
//           color: var(--accent-red);
//         }
//         .payment-badge {
//           font-size: 12px;
//           padding: 4px 10px;
//           border-radius: 20px;
//           font-weight: 500;
//           text-transform: capitalize;
//         }
//         .payment-cash {
//           background-color: rgba(16, 185, 129, 0.2);
//           color: var(--accent-green);
//         }
//         .payment-finance {
//           background-color: rgba(239, 68, 68, 0.2);
//           color: var(--accent-red);
//         }
//         .btn-secondary {
//           background-color: #6c757d;
//           color: white;
//           transition: all 0.2s ease;
//         }
//         .btn-secondary:hover {
//           box-shadow: 0 4px 8px rgba(108, 117, 125, 0.3);
//         }
//         .btn-success {
//           background-color: var(--accent-green);
//           color: white;
//           transition: all 0.2s ease;
//         }
//         .btn-success:hover {
//           box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
//         }
//         .mobile-concise-view .vehicle-section {
//           margin-bottom: 1rem;
//           padding-bottom: 1rem;
//           border-bottom: 1px solid #e5e7eb;
//         }
//         .mobile-concise-view .vehicle-section:last-child {
//           border-bottom: none;
//         }
//         .mobile-concise-view .vehicle-header {
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           margin-bottom: 0.75rem;
//         }
//         .mobile-concise-view .vehicle-details {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 0.5rem;
//         }
//         .mobile-concise-view .detail-item {
//           margin-bottom: 0.5rem;
//         }
//         .mobile-concise-view .detail-label {
//           font-size: 0.75rem;
//           color: #6b7280;
//           font-weight: 500;
//         }
//         .mobile-concise-view .detail-value {
//           font-size: 0.875rem;
//           font-weight: 500;
//           color: #1f2937;
//         }
//         @media (max-width: 640px) {
//           .lead-card {
//             padding: 1rem;
//           }
//           .desktop-actions {
//             display: none;
//           }
//           .mobile-actions {
//             display: flex;
//             gap: 8px;
//             margin-top: 12px;
//           }
//         }
//         @media (min-width: 641px) {
//           .mobile-actions {
//             display: none;
//           }
//           .desktop-actions {
//             display: flex;
//             gap: 8px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// // --- Loader Component ---
// function Loader() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] font-montserrat space-y-4">
//       <div className="w-16 h-16 border-4 border-primary-blue border-dashed rounded-full animate-spin"></div>
//       <span className="text-gray-600 font-medium">Loading Open Leads...</span>
//     </div>
//   );
// }

// // --- Error Component ---
// function ErrorMessage({ message, onRetry }) {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] font-montserrat space-y-4">
//       <i className="bi bi-exclamation-triangle text-red-500 text-4xl"></i>
//       <p className="text-red-500 text-lg font-medium text-center max-w-md">
//         {message}
//       </p>
//       <button
//         onClick={onRetry}
//         className="btn-primary-blue rounded-md px-6 py-2 text-sm font-medium flex items-center"
//       >
//         <i className="bi bi-arrow-clockwise mr-2"></i>
//         Try Again
//       </button>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function OpenLeads() {
  const [openLeads, setOpenLeads] = useState([]);
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
    const fetchData = async () => {
      try {
        const leadsResponse = await axios.get(
          `${API_BASE}/leads-by-status?status=Open`,
          { headers: getAuthHeaders() }
        );
        if (leadsResponse.data.success) {
          setOpenLeads(leadsResponse.data.data || []);
        }
      } catch (err) {
        setError("Failed to fetch open leads. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    if (!url) return null;
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
        } else {
          setOpenLeads((prev) =>
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
        } else {
          setOpenLeads((prev) =>
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
      setOpenLeads((prev) =>
        [...prev].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        )
      );
    } else {
      setOpenLeads((prev) =>
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
          {openLeads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-gray-500 text-xl font-medium mb-2">
                No Open Leads
              </h3>
              <p className="text-gray-400 mb-6">
                {error || "There are currently no open leads in the system."}
              </p>
              <Link
                to="/leads/generate"
                className="btn-primary-blue rounded-md px-6 py-3 text-sm font-medium"
              >
                <i className="bi bi-plus-lg"></i>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4" id="leadsContainer">
              {openLeads.map((lead) => {
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

      {/* ✅ VIEW LEAD MODAL - WITH CLOSE BUTTON PERFORMING "CLOSE ENTIRE LEAD" FUNCTIONALITY */}
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

      {/* Close Entire Lead Modal */}
      {isCloseEntireLeadModalOpen && selectedLead && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
          onClick={() => setIsCloseEntireLeadModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
              <h5 className="text-base font-medium">Close Entire Lead</h5>
              <button
                type="button"
                className="text-white hover:text-gray-200 text-lg"
                onClick={() => setIsCloseEntireLeadModalOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                <h6 className="text-base font-medium text-primary-blue mb-3">
                  Close Entire Lead
                </h6>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    You are closing the entire lead for:
                  </p>
                  <div className="bg-light-blue p-3 rounded-md">
                    <p className="font-medium">{selectedLead.customer_name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedLead.phone_no}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedLead.location || "N/A"}
                    </p>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">
                      Vehicles in this lead:
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {selectedLead.lead_details.map((vehicle, index) => (
                        <li key={vehicle.id}>
                          {vehicle.brand?.name || "No brand"} -{" "}
                          {vehicle.variant?.name || "No variant"}
                          {vehicle.color?.name && ` - ${vehicle.color.name}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Select Close Type for All Vehicles:
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="closeType"
                        value="converted"
                        className="mr-2"
                        checked={closeType === "converted"}
                        onChange={() => setCloseType("converted")}
                      />
                      <span className="text-sm">
                        Converted (All vehicles sold)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="closeType"
                        value="unrealized"
                        className="mr-2"
                        checked={closeType === "unrealized"}
                        onChange={() => setCloseType("unrealized")}
                      />
                      <span className="text-sm">
                        Unrealized (All vehicles not sold)
                      </span>
                    </label>
                  </div>
                </div>
                {closeType === "unrealized" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Reason for Unrealized Lead:
                    </label>
                    <select
                      className="w-full border border-secondary-grey rounded p-2 text-sm mb-2"
                      value={unrealizedReason}
                      onChange={(e) => setUnrealizedReason(e.target.value)}
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
                        placeholder="Please specify the reason..."
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                      ></textarea>
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

      {/* Edit Lead Modal - NO CLOSE BUTTON */}
      {isEditModalOpen && selectedLead && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
              <h5 className="text-base font-medium">Edit Lead</h5>
              <button
                type="button"
                className="text-white hover:text-gray-200 text-lg"
                onClick={() => setIsEditModalOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
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
                    <input
                      type="text"
                      className="w-full border border-secondary-grey rounded p-2 text-sm"
                      value={selectedLead.customer_name || ""}
                      onChange={(e) =>
                        setSelectedLead({
                          ...selectedLead,
                          customer_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Mobile
                    </label>
                    <input
                      type="text"
                      className="w-full border border-secondary-grey rounded p-2 text-sm"
                      value={selectedLead.phone_no || ""}
                      onChange={(e) =>
                        setSelectedLead({
                          ...selectedLead,
                          phone_no: e.target.value,
                        })
                      }
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
                        setSelectedLead({
                          ...selectedLead,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Payment Mode
                    </label>
                    <select
                      className="w-full border border-secondary-grey rounded p-2 text-sm"
                      value={selectedLead.payment_mode || "cash"}
                      onChange={(e) =>
                        setSelectedLead({
                          ...selectedLead,
                          payment_mode: e.target.value,
                        })
                      }
                    >
                      <option value="cash">Cash</option>
                      <option value="finance">Finance</option>
                    </select>
                  </div>
                </div>
              </div>
              {selectedLead.lead_details.map((vehicle, index) => (
                <div
                  key={vehicle.id}
                  className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h6 className="text-base font-medium text-primary-blue flex items-center">
                      <i className="bi bi-bicycle mr-2"></i> Vehicle {index + 1}
                    </h6>
                    {/* NO CLOSE BUTTON HERE */}
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
                            Brand *
                          </label>
                          <select
                            className="w-full border border-secondary-grey rounded p-2 text-sm"
                            value={vehicle.brand_id || ""}
                            onChange={(e) =>
                              handleBrandChange(e.target.value, index)
                            }
                            required
                          >
                            <option value="">Select brand</option>
                            {brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Variant *
                          </label>
                          <select
                            className="w-full border border-secondary-grey rounded p-2 text-sm"
                            value={vehicle.variant_id || ""}
                            onChange={(e) =>
                              handleVariantChange(e.target.value, index)
                            }
                            required
                            disabled={!vehicle.brand_id}
                          >
                            <option value="">Select variant</option>
                            {vehicle.brand_id ? (
                              variants
                                .filter((v) => v.brand_id == vehicle.brand_id)
                                .map((variant) => (
                                  <option key={variant.id} value={variant.id}>
                                    {variant.name}
                                  </option>
                                ))
                            ) : (
                              <option value="" disabled>
                                Select brand first
                              </option>
                            )}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Color *
                          </label>
                          <select
                            className="w-full border border-secondary-grey rounded p-2 text-sm"
                            value={vehicle.color_id || ""}
                            onChange={(e) =>
                              handleColorChange(e.target.value, index)
                            }
                            required
                            disabled={!vehicle.variant_id}
                          >
                            <option value="">Select color</option>
                            {vehicle.variant_id ? (
                              (() => {
                                const variantGalleries = galleries.filter(
                                  (g) => g.variant_id == vehicle.variant_id
                                );
                                const uniqueColorIds = [
                                  ...new Set(
                                    variantGalleries.map((g) => g.color_id)
                                  ),
                                ];
                                const variantColors = colors.filter((color) =>
                                  uniqueColorIds.includes(color.id)
                                );
                                return variantColors.map((color) => (
                                  <option key={color.id} value={color.id}>
                                    {color.name || color.color_name}
                                    {color.color_code &&
                                      ` (${color.color_code})`}
                                  </option>
                                ));
                              })()
                            ) : (
                              <option value="" disabled>
                                Select variant first
                              </option>
                            )}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Price
                          </label>
                          <input
                            type="text"
                            className="w-full border border-secondary-grey rounded p-2 text-sm bg-gray-50"
                            value={
                              variants.find((v) => v.id == vehicle.variant_id)
                                ?.basic_price
                                ? `₹${parseFloat(
                                    variants.find(
                                      (v) => v.id == vehicle.variant_id
                                    )?.basic_price
                                  ).toLocaleString("en-IN")}`
                                : "Price on request"
                            }
                            readOnly
                          />
                        </div>
                      </div>
                      {vehicle.color_code && (
                        <div className="mt-3 flex items-center">
                          <span className="text-sm text-gray-600 mr-2">
                            Color Preview:
                          </span>
                          <div
                            className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                            style={{ backgroundColor: vehicle.color_code }}
                          ></div>
                          <span className="text-sm text-gray-800">
                            {vehicle.color_name || "Selected Color"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    className="btn-primary-blue rounded-md px-4 py-2 text-sm w-full sm:w-auto"
                    onClick={handleSaveLead}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn-secondary rounded-md px-4 py-2 text-sm w-full sm:w-auto"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
                <button
                  className="btn-success rounded-md px-4 py-2 text-sm w-full sm:w-auto"
                  onClick={() => handleCloseEntireLead(selectedLead)}
                >
                  Close Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Vehicle Modal */}
      {isCloseLeadModalOpen && selectedLead && selectedVehicleId && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
          onClick={() => setIsCloseLeadModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
              <h5 className="text-base font-medium">Close Vehicle</h5>
              <button
                type="button"
                className="text-white hover:text-gray-200 text-lg"
                onClick={() => setIsCloseLeadModalOpen(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                <h6 className="text-base font-medium text-primary-blue mb-3">
                  Close Vehicle
                </h6>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    You are closing the following vehicle:
                  </p>
                  <div className="bg-light-blue p-3 rounded-md">
                    <p className="font-medium">
                      {
                        selectedLead.lead_details.find(
                          (v) => v.id === selectedVehicleId
                        )?.brand?.name
                      }{" "}
                      {
                        selectedLead.lead_details.find(
                          (v) => v.id === selectedVehicleId
                        )?.variant?.name
                      }
                    </p>
                    <p className="text-sm text-gray-600">
                      {(() => {
                        const vehicle = selectedLead.lead_details.find(
                          (v) => v.id === selectedVehicleId
                        );
                        if (vehicle?.color?.name) return vehicle.color.name;
                        const foundColor = colors.find(
                          (c) => c.id === vehicle?.color_id
                        );
                        if (foundColor?.name || foundColor?.color_name)
                          return foundColor.name || foundColor.color_name;
                        if (vehicle?.color_name) return vehicle.color_name;
                        return "";
                      })()}{" "}
                      {(() => {
                        const vehicle = selectedLead.lead_details.find(
                          (v) => v.id === selectedVehicleId
                        );
                        if (vehicle?.variant?.basic_price)
                          return `₹${parseFloat(
                            vehicle.variant.basic_price
                          ).toLocaleString("en-IN")}`;
                        const foundVariant = variants.find(
                          (v) => v.id === vehicle?.variant_id
                        );
                        if (foundVariant?.basic_price)
                          return `₹${parseFloat(
                            foundVariant.basic_price
                          ).toLocaleString("en-IN")}`;
                        if (vehicle?.basic_price)
                          return `₹${parseFloat(
                            vehicle.basic_price
                          ).toLocaleString("en-IN")}`;
                        return "Price on request";
                      })()}
                    </p>
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
                        name="closeType"
                        value="converted"
                        className="mr-2"
                        checked={closeType === "converted"}
                        onChange={() => setCloseType("converted")}
                      />
                      <span className="text-sm">Converted</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="closeType"
                        value="unrealized"
                        className="mr-2"
                        checked={closeType === "unrealized"}
                        onChange={() => setCloseType("unrealized")}
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
                      className="w-full border border-secondary-grey rounded p-2 text-sm mb-2"
                      value={unrealizedReason}
                      onChange={(e) => setUnrealizedReason(e.target.value)}
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
                        placeholder="Please specify the reason..."
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                      ></textarea>
                    )}
                  </div>
                )}
              </div>
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

      {/* Converted Lead Modal */}
      {isConvertedLeadModalOpen && selectedLead && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
          onClick={() => setIsConvertedLeadModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
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
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                <h6 className="text-base font-medium text-primary-blue mb-3">
                  Converted Lead - Invoice Details
                </h6>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    Please confirm the vehicle details are correct:
                  </p>
                  <div className="bg-light-blue p-3 rounded-md mb-4">
                    {selectedVehicleId ? (
                      <>
                        <p className="font-medium">
                          {
                            selectedLead.lead_details.find(
                              (v) => v.id === selectedVehicleId
                            )?.brand?.name
                          }{" "}
                          {
                            selectedLead.lead_details.find(
                              (v) => v.id === selectedVehicleId
                            )?.variant?.name
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          {(() => {
                            const vehicle = selectedLead.lead_details.find(
                              (v) => v.id === selectedVehicleId
                            );
                            if (vehicle?.color?.name) return vehicle.color.name;
                            const foundColor = colors.find(
                              (c) => c.id === vehicle?.color_id
                            );
                            if (foundColor?.name || foundColor?.color_name)
                              return foundColor.name || foundColor.color_name;
                            if (vehicle?.color_name) return vehicle.color_name;
                            return "N/A";
                          })()}{" "}
                          |{" "}
                          {(() => {
                            const vehicle = selectedLead.lead_details.find(
                              (v) => v.id === selectedVehicleId
                            );
                            if (vehicle?.variant?.basic_price)
                              return `₹${parseFloat(
                                vehicle.variant.basic_price
                              ).toLocaleString("en-IN")}`;
                            const foundVariant = variants.find(
                              (v) => v.id === vehicle?.variant_id
                            );
                            if (foundVariant?.basic_price)
                              return `₹${parseFloat(
                                foundVariant.basic_price
                              ).toLocaleString("en-IN")}`;
                            if (vehicle?.basic_price)
                              return `₹${parseFloat(
                                vehicle.basic_price
                              ).toLocaleString("en-IN")}`;
                            return "Price on request";
                          })()}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">All Vehicles in Lead</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {selectedLead.lead_details.map((vehicle) => (
                            <li key={vehicle.id}>
                              {vehicle.brand?.name} {vehicle.variant?.name} -{" "}
                              {vehicle.color?.name || "N/A"}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="confirmDetails"
                      className="mr-2"
                      checked={confirmDetails}
                      onChange={(e) => setConfirmDetails(e.target.checked)}
                    />
                    <label
                      htmlFor="confirmDetails"
                      className="text-sm text-gray-600"
                    >
                      I confirm the customer purchased exactly this vehicle
                      {selectedVehicleId ? "" : "s"}
                    </label>
                  </div>
                  {!confirmDetails && (
                    <div className="flex justify-center mb-4">
                      <button
                        className="btn-primary-blue rounded-md px-4 py-2 text-sm"
                        onClick={() => {
                          setIsConvertedLeadModalOpen(false);
                          handleEditLead(selectedLead);
                        }}
                      >
                        Edit Vehicle Details
                      </button>
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <h6 className="text-base font-medium text-primary-blue mb-3">
                    Invoice Details
                  </h6>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Invoice Number *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-secondary-grey rounded p-2 text-sm"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        required
                        placeholder="Enter invoice number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Upload Invoice Copy (Optional)
                      </label>
                      <input
                        type="file"
                        className="w-full border border-secondary-grey rounded p-2 text-sm"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setInvoiceCopy(e.target.files[0])}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported formats: PDF, JPG, JPEG, PNG (Max: 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="btn-secondary rounded-md px-4 py-2 text-sm"
                  onClick={() => setIsConvertedLeadModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary-blue rounded-md px-4 py-2 text-sm"
                  onClick={handleSubmitConvertedLead}
                  disabled={!invoiceNumber}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
