// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// export default function OpenLeads() {
//   const [openLeads, setOpenLeads] = useState([]);
//   const [filteredLeads, setFilteredLeads] = useState([]);
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
//   const [searchTerm, setSearchTerm] = useState("");
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
//           setFilteredLeads(leads);
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

//   // Filter leads based on search term
//   useEffect(() => {
//     if (searchTerm.trim() === "") {
//       setFilteredLeads(openLeads);
//     } else {
//       const filtered = openLeads.filter((lead) => {
//         const searchLower = searchTerm.toLowerCase();
//         const customerName =
//           lead.customer_name?.toLowerCase().includes(searchLower) || false;
//         const location =
//           lead.location?.toLowerCase().includes(searchLower) || false;
//         const phone = lead.phone_no
//           ? lead.phone_no.toString().includes(searchTerm)
//           : false;
//         const vehicleMatch =
//           lead.lead_details?.some((vehicle) => {
//             const brand =
//               vehicle.brand_name?.toLowerCase().includes(searchLower) || false;
//             const variant =
//               vehicle.variant_name?.toLowerCase().includes(searchLower) ||
//               false;
//             const color =
//               vehicle.color_name?.toLowerCase().includes(searchLower) || false;
//             return brand || variant || color;
//           }) || false;
//         return customerName || location || phone || vehicleMatch;
//       });
//       setFilteredLeads(filtered);
//     }
//   }, [searchTerm, openLeads]);

//   // Add this debug useEffect
//   useEffect(() => {
//     console.log("=== OPEN LEADS DEBUG ===");
//     console.log("All openLeads:", openLeads);
//     console.log("All filteredLeads:", filteredLeads);

//     if (openLeads.length > 0) {
//       openLeads.forEach((lead) => {
//         console.log(`Lead ${lead.id} - ${lead.customer_name}:`, {
//           leadStatus: lead.status,
//           vehicles: lead.lead_details?.map((v) => ({
//             id: v.id,
//             status: v.status,
//             variant: v.variant_name,
//           })),
//         });
//       });
//     }
//   }, [openLeads, filteredLeads]);
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

//   // const handleRefresh = () => {
//   //   setLoading(true);
//   //   setError(null);
//   //   setSearchTerm("");
//   //   const fetchData = async () => {
//   //     try {
//   //       const leadsResponse = await axios.get(
//   //         `${API_BASE}/leads-by-status?status=Open`,
//   //         { headers: getAuthHeaders() }
//   //       );
//   //       if (leadsResponse.data.success) {
//   //         const leads = leadsResponse.data.data || [];
//   //         setOpenLeads(leads);
//   //         setFilteredLeads(leads);
//   //       }
//   //     } catch (err) {
//   //       setError("Failed to fetch open leads. Please try again later.");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
//   //   fetchData();
//   // };

//   const shouldShowLead = (lead) => {
//     // A lead should only show if it has at least one vehicle with status 'Open'
//     return (
//       lead.lead_details &&
//       lead.lead_details.some(
//         (vehicle) => vehicle.status === "Open" || vehicle.status === "open"
//       )
//     );
//   };
//   const handleRefresh = async () => {
//     setLoading(true);
//     setError(null);
//     setSearchTerm("");

//     try {
//       console.log("Refreshing leads from API...");
//       const leadsResponse = await axios.get(
//         `${API_BASE}/leads-by-status?status=Open`,
//         { headers: getAuthHeaders() }
//       );

//       console.log("API Response:", leadsResponse.data);

//       if (leadsResponse.data.success) {
//         const leads = leadsResponse.data.data || [];

//         // Enhanced filtering - only show leads with open vehicles
//         const openLeads = leads.filter((lead) => {
//           const hasOpenVehicles = lead.lead_details?.some(
//             (vehicle) => vehicle.status === "Open" || vehicle.status === "open"
//           );
//           console.log(`Lead ${lead.id} has open vehicles:`, hasOpenVehicles);
//           return hasOpenVehicles;
//         });

//         console.log("Filtered open leads:", openLeads);
//         setOpenLeads(openLeads);
//         setFilteredLeads(openLeads);
//       } else {
//         console.error("API returned error:", leadsResponse.data);
//         setError(leadsResponse.data.message || "Failed to fetch open leads.");
//       }
//     } catch (err) {
//       console.error("Refresh error:", err);
//       setError("Failed to fetch open leads. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
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
//     if (typeof url !== "string" || !url) {
//       return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//     }
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
//     console.log("handleCloseEntireLead called with lead:", lead?.id);
//     setSelectedLead(lead);
//     setCloseType("converted");
//     setUnrealizedReason("");
//     setOtherReason("");
//     setIsCloseEntireLeadModalOpen(true);
//     console.log("Modal should open now");
//   };

//   const handleCloseVehicle = (lead, vehicleId) => {
//     console.log("Closing vehicle:", vehicleId, "from lead:", lead.id);
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
//         await axios.put(
//           `${API_BASE}/leads/${selectedLead.id}/close-entire`,
//           {
//             close_type: "unrealized",
//             unrealized_reason: closeReason,
//           },
//           { headers: getAuthHeaders() }
//         );
//         setOpenLeads((prev) =>
//           prev.filter((lead) => lead.id !== selectedLead.id)
//         );
//         setFilteredLeads((prev) =>
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
//         await axios.put(
//           `${API_BASE}/lead-details/${vehicle.id}/close`,
//           { close_reason: closeReason },
//           { headers: getAuthHeaders() }
//         );
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
//             { status: "Closed" },
//             { headers: getAuthHeaders() }
//           );
//           setOpenLeads((prev) =>
//             prev.filter((lead) => lead.id !== selectedLead.id)
//           );
//           setFilteredLeads((prev) =>
//             prev.filter((lead) => lead.id !== selectedLead.id)
//           );
//         } else {
//           setOpenLeads((prev) =>
//             prev.map((lead) =>
//               lead.id === selectedLead.id ? updatedLead : lead
//             )
//           );
//           setFilteredLeads((prev) =>
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

//   // const handleSubmitConvertedLead = async () => {
//   //   if (!selectedLead) return;
//   //   try {
//   //     if (selectedVehicleId) {
//   //       if (!invoiceNumber) {
//   //         alert("Please enter invoice number.");
//   //         return;
//   //       }
//   //       const response = await axios.put(
//   //         `${API_BASE}/lead-details/${selectedVehicleId}/close`,
//   //         { invoice_no: invoiceNumber },
//   //         { headers: getAuthHeaders() }
//   //       );
//   //       const updatedLead = { ...selectedLead };
//   //       const vehicleIndex = updatedLead.lead_details.findIndex(
//   //         (v) => v.id === selectedVehicleId
//   //       );
//   //       updatedLead.lead_details[vehicleIndex].status = "converted";
//   //       updatedLead.lead_details[vehicleIndex].invoice_no = invoiceNumber;
//   //       const allClosed = updatedLead.lead_details.every(
//   //         (v) => v.status !== "open"
//   //       );
//   //       if (allClosed) {
//   //         await axios.put(
//   //           `${API_BASE}/leads/${selectedLead.id}/update-status`,
//   //           { status: "closed", lead_detail_id: selectedVehicleId },
//   //           { headers: getAuthHeaders() }
//   //         );
//   //         setOpenLeads((prev) =>
//   //           prev.filter((lead) => lead.id !== selectedLead.id)
//   //         );
//   //         setFilteredLeads((prev) =>
//   //           prev.filter((lead) => lead.id !== selectedLead.id)
//   //         );
//   //       } else {
//   //         setOpenLeads((prev) =>
//   //           prev.map((lead) =>
//   //             lead.id === selectedLead.id ? updatedLead : lead
//   //           )
//   //         );
//   //         setFilteredLeads((prev) =>
//   //           prev.map((lead) =>
//   //             lead.id === selectedLead.id ? updatedLead : lead
//   //           )
//   //         );
//   //       }
//   //       setIsConvertedLeadModalOpen(false);
//   //       setSelectedLead(null);
//   //       setSelectedVehicleId(null);
//   //       alert("Vehicle converted successfully!");
//   //     } else {
//   //       if (!invoiceNumber) {
//   //         alert("Please enter invoice number.");
//   //         return;
//   //       }
//   //       const convertPromises = selectedLead.lead_details.map((vehicle) => {
//   //         return axios.put(
//   //           `${API_BASE}/lead-details/${vehicle.id}/close`,
//   //           { invoice_no: invoiceNumber },
//   //           { headers: getAuthHeaders() }
//   //         );
//   //       });
//   //       const results = await Promise.allSettled(convertPromises);
//   //       const rejected = results.filter(
//   //         (result) => result.status === "rejected"
//   //       );
//   //       if (rejected.length > 0) {
//   //         throw new Error(`${rejected.length} vehicles failed to convert`);
//   //       }
//   //       await axios.put(
//   //         `${API_BASE}/leads/${selectedLead.id}/update-status`,
//   //         {
//   //           status: "closed",
//   //           lead_detail_id: selectedLead.lead_details[0]?.id,
//   //         },
//   //         { headers: getAuthHeaders() }
//   //       );
//   //       setOpenLeads((prev) =>
//   //         prev.filter((lead) => lead.id !== selectedLead.id)
//   //       );
//   //       setFilteredLeads((prev) =>
//   //         prev.filter((lead) => lead.id !== selectedLead.id)
//   //       );
//   //       setIsConvertedLeadModalOpen(false);
//   //       setSelectedLead(null);
//   //       alert("Entire lead converted successfully!");
//   //     }
//   //   } catch (err) {
//   //     console.error("Failed to convert lead:", err);
//   //     alert(
//   //       `Failed to convert lead: ${err.response?.data?.message || err.message}`
//   //     );
//   //   }
//   // };

//   const handleSubmitConvertedLead = async () => {
//     if (!selectedLead || !invoiceNumber) {
//       alert("Invoice number is required.");
//       return;
//     }

//     try {
//       const headers = getAuthHeaders();
//       const formData = new FormData();
//       formData.append("invoice_no", invoiceNumber);
//       formData.append("close_type", "converted");
//       if (invoiceCopy) formData.append("uploaded_invoice", invoiceCopy);

//       console.log("Submitting converted lead:", {
//         selectedLeadId: selectedLead.id,
//         selectedVehicleId: selectedVehicleId,
//         invoiceNumber: invoiceNumber,
//       });

//       let response;

//       if (selectedVehicleId) {
//         // SINGLE VEHICLE conversion
//         response = await axios.put(
//           `${API_BASE}/lead-details/${selectedVehicleId}/close`,
//           formData,
//           { headers }
//         );
//       } else {
//         // ENTIRE LEAD conversion
//         response = await axios.put(
//           `${API_BASE}/leads/${selectedLead.id}/close-entire`,
//           formData,
//           { headers }
//         );
//       }

//       console.log("Conversion response:", response.data);

//       if (response.data.success) {
//         // FORCE REFRESH - The most reliable approach
//         await handleRefresh(); // This will refetch all data from API

//         // Alternative: Manual state update if refresh doesn't work
//         // Remove the converted lead from state immediately
//         if (!selectedVehicleId) {
//           // Entire lead converted - remove completely
//           setOpenLeads((prev) =>
//             prev.filter((lead) => lead.id !== selectedLead.id)
//           );
//           setFilteredLeads((prev) =>
//             prev.filter((lead) => lead.id !== selectedLead.id)
//           );
//         } else {
//           // Single vehicle converted - check if lead still has open vehicles
//           setOpenLeads((prev) =>
//             prev
//               .map((lead) => {
//                 if (lead.id === selectedLead.id) {
//                   // Update the specific vehicle status
//                   const updatedVehicles = lead.lead_details.map((vehicle) =>
//                     vehicle.id === selectedVehicleId
//                       ? { ...vehicle, status: "converted" }
//                       : vehicle
//                   );

//                   // Check if any vehicles remain open
//                   const hasOpenVehicles = updatedVehicles.some(
//                     (v) => v.status === "Open" || v.status === "open"
//                   );

//                   // If no open vehicles, remove the lead entirely
//                   if (!hasOpenVehicles) {
//                     return null; // Will be filtered out
//                   }

//                   return {
//                     ...lead,
//                     lead_details: updatedVehicles,
//                   };
//                 }
//                 return lead;
//               })
//               .filter(Boolean)
//           ); // Remove null entries

//           // Do the same for filteredLeads
//           setFilteredLeads((prev) =>
//             prev
//               .map((lead) => {
//                 if (lead.id === selectedLead.id) {
//                   const updatedVehicles = lead.lead_details.map((vehicle) =>
//                     vehicle.id === selectedVehicleId
//                       ? { ...vehicle, status: "converted" }
//                       : vehicle
//                   );

//                   const hasOpenVehicles = updatedVehicles.some(
//                     (v) => v.status === "Open" || v.status === "open"
//                   );
//                   if (!hasOpenVehicles) return null;

//                   return {
//                     ...lead,
//                     lead_details: updatedVehicles,
//                   };
//                 }
//                 return lead;
//               })
//               .filter(Boolean)
//           );
//         }

//         setIsConvertedLeadModalOpen(false);
//         setSelectedLead(null);
//         setSelectedVehicleId(null);
//         setInvoiceNumber("");
//         setInvoiceCopy(null);
//         setConfirmDetails(true);

//         alert("Lead converted successfully!");
//       }
//     } catch (err) {
//       console.error("Conversion failed:", err);
//       console.error("Error details:", err.response?.data);
//       alert(`Error: ${err.response?.data?.message || err.message}`);
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
//             const updatedVehicle = vehicleResponse.data.data;
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
//       setFilteredLeads((prev) =>
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
//       setFilteredLeads((prev) =>
//         [...prev].sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         )
//       );
//     } else {
//       setFilteredLeads((prev) =>
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

//           {filteredLeads.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="text-gray-400 text-6xl mb-4">📝</div>
//               <h3 className="text-gray-500 text-xl font-medium mb-2">
//                 {searchTerm ? "No matching leads found" : "No Open Leads"}
//               </h3>
//               <p className="text-gray-400 mb-6">
//                 {searchTerm
//                   ? "Try adjusting your search terms or clear the search to see all leads."
//                   : error || "There are currently no open leads in the system."}
//               </p>
//               {searchTerm ? (
//                 <button
//                   onClick={() => setSearchTerm("")}
//                   className="btn-primary-blue rounded-md px-6 py-3 text-sm font-medium"
//                 >
//                   Clear Search
//                 </button>
//               ) : (
//                 <Link
//                   to="/leads/generate"
//                   className="btn-primary-blue rounded-md px-6 py-3 text-sm font-medium"
//                 >
//                   <i className="bi bi-plus-lg"></i> Create New Lead
//                 </Link>
//               )}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4" id="leadsContainer">
//               {filteredLeads.map((lead) => {
//                 const draftAge = calculateLeadAge(lead.created_at);
//                 const draftAgeClass = getDraftAgeClass(draftAge);

//                 const openVehicleCount =
//                   lead.lead_details?.filter(
//                     (v) => v.status === "Open" || v.status === "open"
//                   ).length || 0;

//                 const totalVehicleCount = lead.lead_details?.length || 0;

//                 return (
//                   <div
//                     key={lead.id}
//                     className="lead-card bg-white p-5 rounded-lg shadow-md border-l-4 border-[var(--primary-blue)]"
//                     data-lead-id={lead.id}
//                   >
//                     <div className="text-xs text-red-500 mb-2">
//                       Debug: {openVehicleCount} open / {totalVehicleCount} total
//                       vehicles
//                     </div>
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-start justify-between">
//                           <div>
//                             <h6 className="text-base font-semibold text-text-dark mb-1">
//                               {lead.customer_name}
//                             </h6>
//                             <div className="location-info">
//                               <i className="bi bi-geo-alt"></i>
//                               <span>{lead.location || "N/A"}</span>
//                             </div>
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
//                             <div key={vehicle.id} className="vehicle-info">
//                               <i className="bi bi-bicycle"></i>
//                               <span>
//                                 {vehicle.variant_name ||
//                                   vehicle.variant?.name ||
//                                   "No variant"}
//                               </span>
//                             </div>
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

//       {/* VIEW LEAD MODAL */}
//       {isViewModalOpen && selectedLead && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsViewModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
//               <h5 className="text-base font-medium">Lead Details</h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsViewModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-4 flex-1 overflow-y-auto">
//               {/* Check if mobile view */}
//               {window.innerWidth <= 640 ? (
//                 // Mobile Concise View
//                 <div className="mobile-concise-view">
//                   {/* Customer Information */}
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

//                   {/* Vehicle Information */}
//                   {selectedLead.lead_details.map((vehicle, index) => {
//                     const vehicleImage = getVehicleImage(vehicle);
//                     return (
//                       <div
//                         key={vehicle.id}
//                         className="bg-white p-3 rounded-lg shadow-sm mb-3 border border-secondary-grey"
//                       >
//                         <div className="vehicle-section">
//                           <div className="flex justify-between items-center mb-3">
//                             <h6 className="text-base font-medium text-primary-blue flex items-center">
//                               <i className="bi bi-bicycle mr-2"></i>{" "}
//                               {vehicle.variant_name ||
//                                 vehicle.variant?.name ||
//                                 "Vehicle"}
//                             </h6>
//                             {vehicle.status === "open" && (
//                               <button
//                                 className="action-btn btn-close"
//                                 title="Close Vehicle"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleCloseVehicle(selectedLead, vehicle.id);
//                                 }}
//                               >
//                                 <i className="bi bi-check-lg"></i>
//                               </button>
//                             )}
//                           </div>
//                           <div className="flex flex-col items-center">
//                             <div className="w-2/3 mb-3">
//                               <img
//                                 src={vehicleImage}
//                                 alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
//                                 className="w-full h-auto rounded-lg"
//                                 onError={(e) => {
//                                   e.target.src =
//                                     "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//                                 }}
//                               />
//                             </div>
//                             <div className="w-full">
//                               <div className="flex justify-between items-center">
//                                 <div className="text-center">
//                                   <p className="text-xs text-gray-500">Color</p>
//                                   <p className="text-sm font-medium">
//                                     {vehicle.color_name || "N/A"}
//                                   </p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className="text-xs text-gray-500">Qty</p>
//                                   <p className="text-sm font-medium">
//                                     {vehicle.qty || 1}
//                                   </p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className="text-xs text-gray-500">Price</p>
//                                   <p className="text-sm font-medium">
//                                     {vehicle.variant?.basic_price
//                                       ? `₹${parseFloat(
//                                           vehicle.variant.basic_price
//                                         ).toLocaleString("en-IN")}`
//                                       : "Price on request"}
//                                   </p>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 // Desktop Detailed View - IMAGE ON RIGHT SIDE
//                 <>
//                   {/* Customer Information */}
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
//                           {selectedLead.address || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Vehicle Information - IMAGE ON RIGHT SIDE */}
//                   {selectedLead.lead_details.map((vehicle, index) => {
//                     const vehicleImage = getVehicleImage(vehicle);
//                     const vehiclePrice = vehicle.variant?.basic_price
//                       ? `₹${parseFloat(
//                           vehicle.variant.basic_price
//                         ).toLocaleString("en-IN")}`
//                       : "Price on request";

//                     return (
//                       <div
//                         key={vehicle.id}
//                         className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey"
//                       >
//                         <div className="flex justify-between items-center mb-3">
//                           <h6 className="text-base font-medium text-primary-blue">
//                             {vehicle.variant_name ||
//                               vehicle.variant?.name ||
//                               "Vehicle"}
//                           </h6>
//                           <div className="flex gap-2">
//                             {vehicle.status === "open" && (
//                               <button
//                                 className="action-btn btn-close"
//                                 title="Close Vehicle"
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleCloseVehicle(selectedLead, vehicle.id);
//                                 }}
//                               >
//                                 <i className="bi bi-check-lg"></i>
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex flex-col md:flex-row gap-4">
//                           <div className="flex justify-end">
//                             <button
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleCloseVehicle(selectedLead, vehicle.id);
//                               }}
//                               className="action-btn btn-close p-2 rounded-full"
//                             >
//                               <i className="bi bi-check-lg"></i>
//                             </button>
//                           </div>

//                           {/* LEFT SIDE - Vehicle Details */}
//                           <div className="md:w-2/3">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Brand
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehicle.brand_name || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Variant
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehicle.variant_name || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Color
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehicle.color_name || "N/A"}
//                                 </p>
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium text-gray-600">
//                                   Quantity
//                                 </label>
//                                 <p className="text-sm font-medium text-text-dark">
//                                   {vehicle.qty || 1}
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
//                                       vehicle.payment_mode === "cash"
//                                         ? "payment-cash"
//                                         : "payment-finance"
//                                     }`}
//                                   >
//                                     {vehicle.payment_mode}
//                                   </span>
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
//                             </div>
//                           </div>

//                           {/* RIGHT SIDE - Vehicle Image */}
//                           <div className="md:w-1/3">
//                             <img
//                               src={vehicleImage}
//                               alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
//                               className="w-full h-48 object-cover rounded-lg"
//                               onError={(e) => {
//                                 e.target.src =
//                                   "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
//                               }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </>
//               )}

//               <div className="flex justify-between mt-4">
//                 <button
//                   className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleCloseEntireLead(selectedLead);
//                   }}
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

//       {/* CLOSE ENTIRE LEAD MODAL */}
//       {isCloseEntireLeadModalOpen && selectedLead && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]"
//           onClick={() => setIsCloseEntireLeadModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-md w-full mx-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center">
//               <h5 className="text-base font-medium">Close Entire Lead</h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsCloseEntireLeadModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>
//             <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
//               {/* Header */}
//               <div className="">
//                 <button
//                   onClick={() => setIsCloseEntireLeadModalOpen(false)}
//                   className="text-white hover:text-gray-200 text-xl"
//                 >
//                   &times;
//                 </button>
//               </div>

//               {isCloseEntireLeadModalOpen && selectedLead && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]">
//                   <div className="bg-white rounded-lg max-w-md w-full mx-4">
//                     <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center">
//                       <h5 className="text-base font-medium">
//                         Close Entire Lead
//                       </h5>
//                       <button
//                         type="button"
//                         className="text-white hover:text-gray-200 text-lg"
//                         onClick={() => setIsCloseEntireLeadModalOpen(false)}
//                       >
//                         <i className="bi bi-x-lg"></i>
//                       </button>
//                     </div>

//                     <div className="p-4">
//                       <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
//                         <h6 className="text-base font-medium text-primary-blue mb-3">
//                           Close Entire Lead
//                         </h6>

//                         <div className="">
//                           <p className="text-sm text-gray-600">
//                             You are closing the following lead:
//                           </p>

//                           {/* Vehicle Info Cards for all vehicles in the lead */}
//                           {selectedLead.lead_details?.map((vehicle, index) => {
//                             const vehiclePrice = vehicle.variant?.basic_price
//                               ? `₹${parseFloat(
//                                   vehicle.variant.basic_price
//                                 ).toLocaleString("en-IN")}`
//                               : "Price on request";

//                             return (
//                               <div
//                                 key={vehicle.id}
//                                 className="bg-light-blue p-3 rounded-md mb-2"
//                               >
//                                 <p className="font-medium">
//                                   {vehicle.brand_name} {vehicle.variant_name}
//                                 </p>
//                                 <p className="text-sm text-gray-600">
//                                   {vehicle.color_name} | {vehiclePrice}
//                                 </p>
//                               </div>
//                             );
//                           })}
//                         </div>

//                         <div className="mb-4">
//                           <label className="block text-sm font-medium text-gray-600 mb-2">
//                             Select Close Type:
//                           </label>
//                           <div className="flex gap-4">
//                             <label className="flex items-center">
//                               <input
//                                 type="radio"
//                                 name="closeType"
//                                 value="converted"
//                                 checked={closeType === "converted"}
//                                 onChange={(e) => setCloseType(e.target.value)}
//                                 className="mr-2"
//                               />
//                               <span className="text-sm">Converted</span>
//                             </label>
//                             <label className="flex items-center">
//                               <input
//                                 type="radio"
//                                 name="closeType"
//                                 value="unrealized"
//                                 checked={closeType === "unrealized"}
//                                 onChange={(e) => setCloseType(e.target.value)}
//                                 className="mr-2"
//                               />
//                               <span className="text-sm">Unrealized</span>
//                             </label>
//                           </div>
//                         </div>

//                         {/* Unrealized reason dropdown */}
//                         {closeType === "unrealized" && (
//                           <div className="mb-4">
//                             <label className="block text-sm font-medium text-gray-600 mb-2">
//                               Reason for Unrealized:
//                             </label>
//                             <select
//                               value={unrealizedReason}
//                               onChange={(e) =>
//                                 setUnrealizedReason(e.target.value)
//                               }
//                               className="w-full border border-secondary-grey rounded p-2 text-sm mb-2"
//                             >
//                               <option value="" disabled>
//                                 Select reason
//                               </option>
//                               <option value="price">Price too high</option>
//                               <option value="features">
//                                 Not satisfied with features
//                               </option>
//                               <option value="delivery">
//                                 Delivery timeline
//                               </option>
//                               <option value="competitor">
//                                 Found better option with competitor
//                               </option>
//                               <option value="financial">
//                                 Financial issues
//                               </option>
//                               <option value="other">Other</option>
//                             </select>

//                             {unrealizedReason === "other" && (
//                               <textarea
//                                 className="w-full border border-secondary-grey rounded p-2 text-sm"
//                                 value={otherReason}
//                                 onChange={(e) => setOtherReason(e.target.value)}
//                                 placeholder="Please specify the reason..."
//                               />
//                             )}
//                           </div>
//                         )}
//                       </div>

//                       <div className="flex justify-end gap-2">
//                         <button
//                           className="btn-secondary rounded-md px-4 py-2 text-sm"
//                           onClick={() => setIsCloseEntireLeadModalOpen(false)}
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                           onClick={handleProcessCloseEntireLead}
//                         >
//                           Continue
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CLOSE VEHICLE MODAL */}
//       {isCloseLeadModalOpen && selectedLead && selectedVehicleId && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1001]"
//           onClick={() => setIsCloseLeadModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-md w-full mx-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center">
//               <h5 className="text-base font-medium">Close Vehicle</h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsCloseLeadModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>
//             <div className="p-4">
//               <div className="mb-4">
//                 <p className="text-sm text-gray-600 mb-2">
//                   You are closing the following vehicle:
//                 </p>
//                 <div className="bg-light-blue p-3 rounded-md">
//                   {selectedLead.lead_details.find(
//                     (v) => v.id === selectedVehicleId
//                   ) && (
//                     <>
//                       <p className="font-medium">
//                         {
//                           selectedLead.lead_details.find(
//                             (v) => v.id === selectedVehicleId
//                           ).brand_name
//                         }{" "}
//                         {
//                           selectedLead.lead_details.find(
//                             (v) => v.id === selectedVehicleId
//                           ).variant_name
//                         }
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         {
//                           selectedLead.lead_details.find(
//                             (v) => v.id === selectedVehicleId
//                           ).color_name
//                         }{" "}
//                         |{" "}
//                         {selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         ).variant?.basic_price
//                           ? `₹${parseFloat(
//                               selectedLead.lead_details.find(
//                                 (v) => v.id === selectedVehicleId
//                               ).variant.basic_price
//                             ).toLocaleString("en-IN")}`
//                           : "Price on request"}
//                       </p>
//                     </>
//                   )}
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-600 mb-2">
//                   Select Close Type:
//                 </label>
//                 <div className="flex gap-4">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       value="converted"
//                       checked={closeType === "converted"}
//                       onChange={(e) => setCloseType(e.target.value)}
//                       className="mr-2"
//                     />
//                     <span className="text-sm">Converted</span>
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       value="unrealized"
//                       checked={closeType === "unrealized"}
//                       onChange={(e) => setCloseType(e.target.value)}
//                       className="mr-2"
//                     />
//                     <span className="text-sm">Unrealized</span>
//                   </label>
//                 </div>
//               </div>

//               {closeType === "unrealized" && (
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-600 mb-2">
//                     Reason for Unrealized:
//                   </label>
//                   <select
//                     value={unrealizedReason}
//                     onChange={(e) => setUnrealizedReason(e.target.value)}
//                     className="w-full border border-secondary-grey rounded p-2 text-sm mb-2"
//                   >
//                     <option value="" disabled selected>
//                       Select reason
//                     </option>
//                     <option value="price">Price too high</option>
//                     <option value="features">
//                       Not satisfied with features
//                     </option>
//                     <option value="delivery">Delivery timeline</option>
//                     <option value="competitor">
//                       Found better option with competitor
//                     </option>
//                     <option value="financial">Financial issues</option>
//                     <option value="other">Other</option>
//                   </select>
//                   {unrealizedReason === "other" && (
//                     <textarea
//                       className="w-full border border-secondary-grey rounded p-2 text-sm"
//                       value={otherReason}
//                       onChange={(e) => setOtherReason(e.target.value)}
//                       placeholder="Please specify the reason..."
//                     />
//                   )}
//                 </div>
//               )}

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

//       {/* EDIT LEAD MODAL */}
//       {isEditModalOpen && selectedLead && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
//           onClick={() => setIsEditModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Modal Header */}
//             <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
//               <h5 className="text-base font-medium">Edit Lead</h5>
//               <button
//                 type="button"
//                 className="text-white hover:text-gray-200 text-lg"
//                 onClick={() => setIsEditModalOpen(false)}
//               >
//                 <i className="bi bi-x-lg"></i>
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-4 flex-1 overflow-y-auto">
//               {/* Customer Information Form */}
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
//                         setSelectedLead((prev) => ({
//                           ...prev,
//                           customer_name: e.target.value,
//                         }))
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
//                         setSelectedLead((prev) => ({
//                           ...prev,
//                           phone_no: e.target.value,
//                         }))
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
//                         setSelectedLead((prev) => ({
//                           ...prev,
//                           location: e.target.value,
//                         }))
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
//                       value={selectedLead.address || ""}
//                       onChange={(e) =>
//                         setSelectedLead((prev) => ({
//                           ...prev,
//                           address: e.target.value,
//                         }))
//                       }
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Vehicle Information Forms */}
//               {selectedLead.lead_details.map((vehicle, index) => {
//                 const vehicleImage = getVehicleImage(vehicle);
//                 const availableBrands = brands || [];
//                 const availableVariants = variants || [];
//                 const availableColors = colors || [];

//                 return (
//                   <div
//                     key={vehicle.id}
//                     className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey"
//                   >
//                     <div className="flex justify-between items-center mb-3">
//                       <h6 className="text-base font-medium text-primary-blue">
//                         {vehicle.variant_name ||
//                           vehicle.variant?.name ||
//                           "Vehicle"}
//                       </h6>
//                       <div className="flex gap-2">
//                         <button
//                           className="action-btn btn-close"
//                           title="Close Vehicle"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleCloseVehicle(selectedLead, vehicle.id);
//                           }}
//                         >
//                           <i className="bi bi-check-lg"></i>
//                         </button>
//                       </div>
//                     </div>
//                     <div className="flex flex-col md:flex-row gap-4">
//                       <div className="md:w-1/3">
//                         <img
//                           src={vehicleImage}
//                           alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
//                           className="w-full h-auto rounded-lg"
//                           id={`vehicleImage-${vehicle.id}`}
//                         />
//                       </div>
//                       <div className="md:w-2/3">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Brand
//                             </label>
//                             <select
//                               className="w-full border border-secondary-grey rounded p-2 text-sm"
//                               value={vehicle.brand_id || ""}
//                               onChange={(e) =>
//                                 handleBrandChange(e.target.value, index)
//                               }
//                             >
//                               <option value="" disabled>
//                                 Select brand
//                               </option>
//                               {availableBrands.map((brand) => (
//                                 <option key={brand.id} value={brand.id}>
//                                   {brand.name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Variant
//                             </label>
//                             <select
//                               className="w-full border border-secondary-grey rounded p-2 text-sm"
//                               value={vehicle.variant_id || ""}
//                               onChange={(e) =>
//                                 handleVariantChange(e.target.value, index)
//                               }
//                             >
//                               <option value="" disabled>
//                                 Select variant
//                               </option>
//                               {availableVariants
//                                 .filter(
//                                   (variant) =>
//                                     variant.brand_id == vehicle.brand_id
//                                 )
//                                 .map((variant) => (
//                                   <option key={variant.id} value={variant.id}>
//                                     {variant.name}
//                                   </option>
//                                 ))}
//                             </select>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Color
//                             </label>
//                             <select
//                               className="w-full border border-secondary-grey rounded p-2 text-sm"
//                               value={vehicle.color_id || ""}
//                               onChange={(e) =>
//                                 handleColorChange(e.target.value, index)
//                               }
//                             >
//                               <option value="" disabled>
//                                 Select color
//                               </option>
//                               {availableColors.map((color) => (
//                                 <option key={color.id} value={color.id}>
//                                   {color.name || color.color_name}
//                                 </option>
//                               ))}
//                             </select>
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Quantity
//                             </label>
//                             <input
//                               type="number"
//                               className="w-full border border-secondary-grey rounded p-2 text-sm"
//                               value={vehicle.qty || 1}
//                               min="1"
//                               onChange={(e) => {
//                                 const updatedLead = { ...selectedLead };
//                                 updatedLead.lead_details[index].qty =
//                                   parseInt(e.target.value) || 1;
//                                 setSelectedLead(updatedLead);
//                               }}
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Price
//                             </label>
//                             <input
//                               type="text"
//                               className="w-full border border-secondary-grey rounded p-2 text-sm"
//                               value={
//                                 vehicle.variant?.basic_price
//                                   ? `₹${parseFloat(
//                                       vehicle.variant.basic_price
//                                     ).toLocaleString("en-IN")}`
//                                   : "Price on request"
//                               }
//                               readOnly
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-sm font-medium text-gray-600 mb-1">
//                               Payment Mode
//                             </label>
//                             <select
//                               className="w-full border border-secondary-grey rounded p-2 text-sm"
//                               value={vehicle.payment_mode || "cash"}
//                               onChange={(e) => {
//                                 const updatedLead = { ...selectedLead };
//                                 updatedLead.lead_details[index].payment_mode =
//                                   e.target.value;
//                                 setSelectedLead(updatedLead);
//                               }}
//                             >
//                               <option value="cash">Cash</option>
//                               <option value="finance">Finance</option>
//                             </select>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}

//               <div className="flex justify-end mt-4">
//                 <button
//                   className="btn-primary-blue rounded-md px-4 py-2 text-sm"
//                   onClick={handleSaveLead}
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* CONVERTED LEAD MODAL */}
//       {/* CONVERTED LEAD MODAL - WITH EDIT ON UNCHECK */}
//       {isConvertedLeadModalOpen && selectedLead && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] overflow-y-auto"
//           onClick={() => setIsConvertedLeadModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-lg max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Header */}
//             <div className="bg-[var(--primary-blue)] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
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
//                   Confirm Vehicle Details
//                 </h6>

//                 {/* Confirmation Checkbox */}
//                 <div className="flex items-start mb-4 gap-3">
//                   <input
//                     type="checkbox"
//                     id="confirmDetails"
//                     checked={confirmDetails}
//                     onChange={(e) => setConfirmDetails(e.target.checked)}
//                     className="mt-1"
//                   />
//                   <label
//                     htmlFor="confirmDetails"
//                     className="text-sm text-gray-700"
//                   >
//                     I confirm the customer purchased exactly this vehicle
//                   </label>
//                 </div>

//                 {/* Show Edit Button Only When Unchecked */}
//                 {!confirmDetails && (
//                   <div className="mb-4">
//                     <button
//                       onClick={() => {
//                         setIsEditModalOpen(true);
//                         setIsConvertedLeadModalOpen(false);
//                       }}
//                       className="bg-[#0f66af] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
//                     >
//                       <i className="bi bi-pencil mr-2"></i>
//                       Edit Vehicle Details
//                     </button>
//                   </div>
//                 )}

//                 {/* Vehicle Details Preview */}
//                 <div className="bg-light-blue p-4 rounded-md mb-4">
//                   {selectedVehicleId
//                     ? // Single Vehicle
//                       (() => {
//                         const v = selectedLead.lead_details.find(
//                           (v) => v.id === selectedVehicleId
//                         );
//                         return v ? (
//                           <div>
//                             <p className="font-semibold text-gray-800">
//                               {v.brand_name} {v.variant_name}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               {v.color_name} | Qty: {v.qty || 1} |{" "}
//                               {v.variant?.basic_price
//                                 ? `₹${parseFloat(
//                                     v.variant.basic_price
//                                   ).toLocaleString("en-IN")}`
//                                 : "Price on request"}
//                             </p>
//                           </div>
//                         ) : null;
//                       })()
//                     : // Entire Lead
//                       selectedLead.lead_details.map((v) => (
//                         <div key={v.id} className="mb-3 last:mb-0">
//                           <p className="font-semibold text-gray-800">
//                             {v.brand_name} {v.variant_name}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {v.color_name} | Qty: {v.qty || 1} |{" "}
//                             {v.variant?.basic_price
//                               ? `₹${parseFloat(
//                                   v.variant.basic_price
//                                 ).toLocaleString("en-IN")}`
//                               : "Price on request"}
//                           </p>
//                         </div>
//                       ))}
//                 </div>

//                 {/* Invoice Details */}
//                 <div className="mt-6">
//                   <h6 className="text-base font-medium text-primary-blue mb-3">
//                     Invoice Details
//                   </h6>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Invoice Number <span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         className="w-full border border-secondary-grey rounded p-2.5 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
//                         value={invoiceNumber}
//                         onChange={(e) => setInvoiceNumber(e.target.value)}
//                         placeholder="INV-2025-001"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">
//                         Invoice Copy (PDF/JPG)
//                       </label>
//                       <input
//                         type="file"
//                         className="w-full border border-secondary-grey rounded p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-blue file:text-white"
//                         onChange={(e) => setInvoiceCopy(e.target.files[0])}
//                         accept=".pdf,.jpg,.jpeg,.png"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   className="btn-secondary rounded-md px-5 py-2.5 text-sm font-medium"
//                   onClick={() => setIsConvertedLeadModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="btn-primary-blue rounded-md px-6 py-2.5 text-sm font-medium flex items-center disabled:opacity-50"
//                   onClick={handleSubmitConvertedLead}
//                   disabled={!invoiceNumber || !confirmDetails}
//                 >
//                   {confirmDetails ? "Submit Claim" : "Save Edits & Submit"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add CSS styles */}
//       <style jsx>{`
//         :root {
//           --primary-blue: #0f66af;
//           --light-blue: #f2f9ff;
//           --light-grey: #ced4da;
//           --hover-blue: #084a8a;
//           --highlight-yellow: #ffd700;
//           --secondary-grey: #e5e7eb;
//           --accent-green: #10b981;
//           --accent-red: #ef4444;
//           --accent-teal: #0d9488;
//           --text-dark: #1f2937;
//           --grey: #9ca3af;
//           --blue: #3b82f6;
//         }

//         .btn-primary-blue {
//           background-color: var(--primary-blue);
//           color: white;
//           transition: all 0.2s ease;
//         }

//         .btn-primary-blue:hover {
//           box-shadow: 0 4px 8px rgba(15, 102, 175, 0.3);
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
//           color: var(--accent-green);
//         }

//         .location-info {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           color: #6b7280;
//           font-size: 14px;
//           margin-top: 4px;
//         }

//         .vehicle-info {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           color: #6b7280;
//           font-size: 14px;
//           margin-top: 4px;
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

//         .btn-teal {
//           background-color: var(--accent-teal);
//           color: white;
//           transition: all 0.2s ease;
//         }

//         .btn-teal:hover {
//           box-shadow: 0 4px 8px rgba(13, 148, 136, 0.3);
//         }

//         /* Mobile-optimized modal styles */
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

//           .mobile-actions {
//             display: flex;
//             gap: 8px;
//             margin-top: 12px;
//           }

//           .desktop-actions {
//             display: none;
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

  const API_BASE = "http://localhost:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

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

  // const handleVariantChange = (variantId, vehicleIndex) => {
  //   setSelectedLead((prevLead) => {
  //     if (!prevLead) return prevLead;
  //     const updatedLeadDetails = [...prevLead.lead_details];
  //     const selectedVariant = variants.find(
  //       (variant) => variant.id == variantId
  //     );
  //     updatedLeadDetails[vehicleIndex] = {
  //       ...updatedLeadDetails[vehicleIndex],
  //       variant_id: variantId,
  //       variant_name: selectedVariant?.name || "",
  //       color_id: "",
  //       color_name: "",
  //       color_code: "",
  //       variant: selectedVariant,
  //       color: null,
  //     };
  //     return {
  //       ...prevLead,
  //       lead_details: updatedLeadDetails,
  //     };
  //   });
  // };

  // const handleColorChange = (colorId, vehicleIndex) => {
  //   const selectedColor = colors.find((c) => c.id == colorId);
  //   const updatedLeadDetails = [...selectedLead.leadDetails];
  //   updatedLeadDetails[vehicleIndex] = {
  //     ...updatedLeadDetails[vehicleIndex],
  //     color_id: colorId,
  //     color_name: selectedColor?.name || selectedColor?.color_name || "",
  //     color_code: selectedColor?.color_code || "",
  //   };

  //   setSelectedLead({
  //     ...selectedLead,
  //     leadDetails: updatedLeadDetails,
  //   });
  // };

  const handleVariantChange = (variantId, vehicleIndex) => {
    const selectedVariant = variants.find((v) => v.id == variantId);

    // Use lead_details instead of leadDetails
    const updatedLeadDetails = [...selectedLead.lead_details]; // ✅ FIXED
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
      lead_details: updatedLeadDetails, // ✅ FIXED
    });
  };

  const handleColorChange = (colorId, vehicleIndex) => {
    const selectedColor = colors.find((c) => c.id == colorId);

    // Use lead_details instead of leadDetails
    const updatedLeadDetails = [...selectedLead.lead_details]; // ✅ FIXED
    updatedLeadDetails[vehicleIndex] = {
      ...updatedLeadDetails[vehicleIndex],
      color_id: colorId,
      color_name: selectedColor?.name || selectedColor?.color_name || "",
      color_code: selectedColor?.color_code || "",
    };

    setSelectedLead({
      ...selectedLead,
      lead_details: updatedLeadDetails, // ✅ FIXED
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
            vehicle_qty: vehicle.vehicle_qty || 1, // ✅ Ensure this is included
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
            vehicle_qty: vehicle.vehicle_qty || 1, // ✅ Ensure this is included
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
          vehicle_qty: vehicle.vehicle_qty || 1, // ✅ Ensure this is included
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

  const handleCloseVehicle = (lead, vehicleId) => {
    console.log("Closing vehicle:", vehicleId, "from lead:", lead.id);
    setSelectedLead(lead);
    setSelectedVehicleId(vehicleId);
    setCloseType("converted");
    setUnrealizedReason("");
    setOtherReason("");
    setIsCloseLeadModalOpen(true);
  };

  // const handleProcessCloseEntireLead = async () => {
  //   if (!selectedLead) return;
  //   try {
  //     if (closeType === "converted") {
  //       setInvoiceNumber("");
  //       setInvoiceCopy(null);
  //       setConfirmDetails(true);
  //       setIsCloseEntireLeadModalOpen(false);
  //       setIsConvertedLeadModalOpen(true);
  //     } else {
  //       if (!unrealizedReason) {
  //         alert("Please select a reason for unrealized lead.");
  //         return;
  //       }
  //       const closeReason =
  //         unrealizedReason === "other" ? otherReason : unrealizedReason;
  //       console.log("Closing entire lead as unrealized:", {
  //         close_reason: closeReason,
  //       });
  //       await axios.put(
  //         `${API_BASE}/leads/${selectedLead.id}/close-entire`,
  //         {
  //           close_type: "unrealized",
  //           unrealized_reason: closeReason,
  //         },
  //         { headers: getAuthHeaders() }
  //       );
  //       // Force refresh to get updated data
  //       await handleRefresh();
  //       setIsCloseEntireLeadModalOpen(false);
  //       setSelectedLead(null);
  //       alert("Entire lead marked as unrealized successfully!");
  //     }
  //   } catch (err) {
  //     console.error("Failed to close entire lead:", err);
  //     console.error("Error response:", err.response);
  //     alert(
  //       `Failed to close entire lead: ${
  //         err.response?.data?.message || err.message
  //       }`
  //     );
  //   }
  // };
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
          close_type: "Unrealized", // ✅ ADD THIS
          unrealized_reason: closeReason,
        });

        await axios.put(
          `${API_BASE}/leads/${selectedLead.id}/close-entire`,
          {
            close_type: "Unrealized", // ✅ ADD THIS REQUIRED FIELD
            unrealized_reason: closeReason,
          },
          { headers: getAuthHeaders() }
        );

        // Force refresh to get updated data
        await handleRefresh();
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
          close_type: "Unrealized", // ✅ ADD THIS
          close_reason: closeReason,
        });

        await axios.put(
          `${API_BASE}/lead-details/${vehicle.id}/close`,
          {
            close_type: "Unrealized", // ✅ ADD THIS REQUIRED FIELD
            close_reason: closeReason,
          },
          { headers: getAuthHeaders() }
        );

        // Force refresh to get updated data
        await handleRefresh();
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

  // const handleSubmitConvertedLead = async () => {
  //   if (!selectedLead || !invoiceNumber) {
  //     alert("Invoice number is required.");
  //     return;
  //   }

  //   try {
  //     const headers = getAuthHeaders();
  //     const formData = new FormData();
  //     formData.append("invoice_no", invoiceNumber);
  //     formData.append("close_type", "converted");
  //     if (invoiceCopy) formData.append("uploaded_invoice", invoiceCopy);

  //     console.log("Submitting converted lead:", {
  //       selectedLeadId: selectedLead.id,
  //       selectedVehicleId: selectedVehicleId,
  //       invoiceNumber: invoiceNumber,
  //     });

  //     let response;

  //     if (selectedVehicleId) {
  //       // SINGLE VEHICLE conversion
  //       response = await axios.put(
  //         `${API_BASE}/lead-details/${selectedVehicleId}/close`,
  //         formData,
  //         { headers }
  //       );
  //     } else {
  //       // ENTIRE LEAD conversion
  //       response = await axios.put(
  //         `${API_BASE}/leads/${selectedLead.id}/close-entire`,
  //         formData,
  //         { headers }
  //       );
  //     }

  //     console.log("Conversion response:", response.data);

  //     if (response.data.success) {
  //       // Force complete refresh from API
  //       await handleRefresh();

  //       setIsConvertedLeadModalOpen(false);
  //       setSelectedLead(null);
  //       setSelectedVehicleId(null);
  //       setInvoiceNumber("");
  //       setInvoiceCopy(null);
  //       setConfirmDetails(true);

  //       alert("Lead converted successfully!");
  //     }
  //   } catch (err) {
  //     console.error("Conversion failed:", err);
  //     console.error("Error details:", err.response?.data);
  //     alert(`Error: ${err.response?.data?.message || err.message}`);
  //   }
  // };

  const handleSubmitConvertedLead = async () => {
    if (!selectedLead || !invoiceNumber) {
      alert("Invoice number is required.");
      return;
    }

    try {
      const headers = getAuthHeaders();
      const formData = new FormData();
      formData.append("invoice_no", invoiceNumber);
      formData.append("close_type", "converted");
      if (invoiceCopy) formData.append("uploaded_invoice", invoiceCopy);

      console.log("Submitting converted lead:", {
        selectedLeadId: selectedLead.id,
        selectedVehicleId: selectedVehicleId,
        invoiceNumber: invoiceNumber,
      });

      let response;

      if (selectedVehicleId) {
        // SINGLE VEHICLE conversion
        const vehicle = selectedLead.lead_details.find(
          (v) => v.id === selectedVehicleId
        );
        const convertedQty = vehicle.converted_qty || vehicle.vehicle_qty || 1;

        formData.append("converted_quantity", convertedQty);
        formData.append("vehicle_qty", convertedQty); // Update the quantity to converted amount

        response = await axios.put(
          `${API_BASE}/lead-details/${selectedVehicleId}/close`,
          formData,
          { headers }
        );
      } else {
        // ENTIRE LEAD conversion
        // Update quantities for all vehicles to their converted amounts
        const vehiclesToUpdate = selectedLead.lead_details
          .filter((v) => v.status === "Open" || v.status === "open")
          .map((vehicle) => ({
            vehicle_id: vehicle.id,
            converted_quantity:
              vehicle.converted_qty || vehicle.vehicle_qty || 1,
            vehicle_qty: vehicle.converted_qty || vehicle.vehicle_qty || 1,
          }));

        formData.append("vehicles_data", JSON.stringify(vehiclesToUpdate));

        response = await axios.put(
          `${API_BASE}/leads/${selectedLead.id}/close-entire`,
          formData,
          { headers }
        );
      }

      console.log("Conversion response:", response.data);

      if (response.data.success) {
        // Force complete refresh from API
        await handleRefresh();

        setIsConvertedLeadModalOpen(false);
        setSelectedLead(null);
        setSelectedVehicleId(null);
        setInvoiceNumber("");
        setInvoiceCopy(null);

        alert("Lead converted successfully!");
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      console.error("Error details:", err.response?.data);
      alert(`Error: ${err.response?.data?.message || err.message}`);
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
          vehicle_qty: vehicle.vehicle_qty || 1, // ✅ FIXED: Use vehicle_qty
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
              vehicle_qty: updatedVehicle.vehicle_qty || 1, // ✅ Ensure it's included in response

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
      // Refresh data after update
      await handleRefresh();
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
                    <div className="text-xs text-red-500 mb-2">
                      Open: {openVehicleCount}/{totalVehicleCount} vehicles
                    </div>

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
                              (v) => v.status === "Open" || v.status === "open"
                            )
                            .map((vehicle) => (
                              <div key={vehicle.id} className="vehicle-info">
                                <i className="bi bi-bicycle"></i>
                                <span>
                                  {vehicle.brand_name || "No brand"} -{" "}
                                  {vehicle.variant_name || "No variant"} -{" "}
                                  {vehicle.color_name || "No color"}
                                  {/* Add quantity display */}
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded ml-2">
                                    Qty: {vehicle.vehicle_qty || 1}
                                  </span>
                                </span>
                              </div>
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
                                    <p className="text-xs text-gray-500">Qty</p>
                                    <p className="text-sm font-medium">
                                      {vehicle.vehicle_qty || 1}
                                    </p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs text-gray-500">
                                      Price
                                    </p>
                                    <p className="text-sm font-medium">
                                      {vehicle.variant?.basic_price
                                        ? `₹${parseFloat(
                                            vehicle.variant.basic_price
                                          ).toLocaleString("en-IN")}`
                                        : "Price on request"}
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
                        ? `₹${parseFloat(
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
                                    {vehicle.vehicle_qty || 1}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600">
                                    Price
                                  </label>
                                  <p className="text-sm font-medium text-text-dark">
                                    {vehiclePrice}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-600">
                                    Payment Mode
                                  </label>
                                  <p className="text-sm font-medium text-text-dark">
                                    <span
                                      className={`payment-badge-light ${
                                        selectedLead.payment_mode === "cash"
                                          ? "payment-cash-light"
                                          : "payment-finance-light"
                                      }`}
                                    >
                                      {selectedLead.payment_mode}
                                    </span>
                                  </p>
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
                    ?.filter((v) => v.status === "Open" || v.status === "open")
                    .map((vehicle, index) => {
                      const vehiclePrice = vehicle.variant?.basic_price
                        ? `₹${parseFloat(
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
                            {vehicle.color_name} | {vehiclePrice}
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
                      <p className="font-medium">
                        {
                          selectedLead.lead_details.find(
                            (v) => v.id === selectedVehicleId
                          ).brand_name
                        }{" "}
                        {
                          selectedLead.lead_details.find(
                            (v) => v.id === selectedVehicleId
                          ).variant_name
                        }
                      </p>
                      <p className="text-sm text-gray-600">
                        {
                          selectedLead.lead_details.find(
                            (v) => v.id === selectedVehicleId
                          ).color_name
                        }{" "}
                        |{" "}
                        {selectedLead.lead_details.find(
                          (v) => v.id === selectedVehicleId
                        ).variant?.basic_price
                          ? `₹${parseFloat(
                              selectedLead.lead_details.find(
                                (v) => v.id === selectedVehicleId
                              ).variant.basic_price
                            ).toLocaleString("en-IN")}`
                          : "Price on request"}
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

      {/* EDIT LEAD MODAL */}
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
                      Name
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
                        setSelectedLead((prev) => ({
                          ...prev,
                          phone_no: e.target.value,
                        }))
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
                        setSelectedLead((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      className="w-full border border-secondary-grey rounded p-2 text-sm"
                      value={selectedLead.address || ""}
                      onChange={(e) =>
                        setSelectedLead((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Information Forms */}
              {selectedLead.lead_details
                .filter((v) => v.status === "Open" || v.status === "open")
                .map((vehicle, index) => {
                  const vehicleImage = getVehicleImage(vehicle);
                  const availableBrands = brands || [];
                  const availableVariants = variants || [];
                  const availableColors = colors || [];

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
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3">
                          <img
                            src={vehicleImage}
                            alt={`${vehicle.brand_name} ${vehicle.variant_name}`}
                            className="w-full h-auto rounded-lg"
                            id={`vehicleImage-${vehicle.id}`}
                          />
                        </div>
                        <div className="md:w-2/3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Brand
                              </label>
                              <select
                                className="w-full border border-secondary-grey rounded p-2 text-sm"
                                value={vehicle.brand_id || ""}
                                onChange={(e) =>
                                  handleBrandChange(e.target.value, index)
                                }
                              >
                                <option value="" disabled>
                                  Select brand
                                </option>
                                {availableBrands.map((brand) => (
                                  <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Variant
                              </label>
                              <select
                                className="w-full border border-secondary-grey rounded p-2 text-sm"
                                value={vehicle.variant_id || ""}
                                onChange={(e) =>
                                  handleVariantChange(e.target.value, index)
                                }
                              >
                                <option value="" disabled>
                                  Select variant
                                </option>
                                {availableVariants
                                  .filter(
                                    (variant) =>
                                      variant.brand_id == vehicle.brand_id
                                  )
                                  .map((variant) => (
                                    <option key={variant.id} value={variant.id}>
                                      {variant.name}
                                    </option>
                                  ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Color *
                              </label>
                              <select
                                className="w-full border border-gray-300 rounded p-2 text-sm"
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
                                    const variantColors = colors.filter(
                                      (color) =>
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
                                Quantity
                              </label>
                              <input
                                type="number"
                                className="w-full border border-secondary-grey rounded p-2 text-sm"
                                value={vehicle.qty || 1}
                                min="1"
                                onChange={(e) => {
                                  const updatedLead = { ...selectedLead };
                                  updatedLead.lead_details[index].qty =
                                    parseInt(e.target.value) || 1;
                                  setSelectedLead(updatedLead);
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Price
                              </label>
                              <input
                                type="text"
                                className="w-full border border-secondary-grey rounded p-2 text-sm"
                                value={
                                  vehicle.variant?.basic_price
                                    ? `₹${parseFloat(
                                        vehicle.variant.basic_price
                                      ).toLocaleString("en-IN")}`
                                    : "Price on request"
                                }
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">
                                Payment Mode
                              </label>
                              <select
                                className="w-full border border-secondary-grey rounded p-2 text-sm"
                                value={vehicle.payment_mode || "cash"}
                                onChange={(e) => {
                                  const updatedLead = { ...selectedLead };
                                  updatedLead.lead_details[index].payment_mode =
                                    e.target.value;
                                  setSelectedLead(updatedLead);
                                }}
                              >
                                <option value="cash">Cash</option>
                                <option value="finance">Finance</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              <div className="flex justify-end mt-4">
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
            className="bg-white rounded-lg max-w-4xl w-full mx-4 my-8 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
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
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-secondary-grey">
                <h6 className="text-base font-medium text-primary-blue mb-3">
                  Vehicle Conversion Details
                </h6>

                {/* Vehicle Details with Quantity Selection */}
                <div className="bg-light-blue p-4 rounded-md mb-4">
                  {selectedVehicleId
                    ? // Single Vehicle Conversion
                      (() => {
                        const v = selectedLead.lead_details.find(
                          (v) => v.id === selectedVehicleId
                        );
                        return v ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-gray-800 mb-1">
                                {v.brand_name} {v.variant_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {v.color_name} | Qty: {v.vehicle_qty || 1} |{" "}
                                {v.variant?.basic_price
                                  ? `₹${parseFloat(
                                      v.variant.basic_price
                                    ).toLocaleString("en-IN")}`
                                  : "Price on request"}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-600">
                                Quantity Converted:
                              </label>
                              <select
                                value={v.converted_qty || v.vehicle_qty || 1}
                                onChange={(e) => {
                                  const updatedLead = { ...selectedLead };
                                  const vehicleIndex =
                                    updatedLead.lead_details.findIndex(
                                      (vehicle) =>
                                        vehicle.id === selectedVehicleId
                                    );
                                  updatedLead.lead_details[
                                    vehicleIndex
                                  ].converted_qty = parseInt(e.target.value);
                                  setSelectedLead(updatedLead);
                                }}
                                className="border border-gray-300 rounded p-2 text-sm"
                              >
                                {Array.from(
                                  { length: v.vehicle_qty || 1 },
                                  (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                      {i + 1}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>
                        ) : null;
                      })()
                    : // Entire Lead Conversion
                      selectedLead.lead_details
                        .filter(
                          (v) => v.status === "Open" || v.status === "open"
                        )
                        .map((v) => (
                          <div
                            key={v.id}
                            className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 last:border-b-0 last:mb-0"
                          >
                            <div>
                              <p className="font-semibold text-gray-800 mb-1">
                                {v.brand_name} {v.variant_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {v.color_name} | Qty: {v.vehicle_qty || 1} |{" "}
                                {v.variant?.basic_price
                                  ? `₹${parseFloat(
                                      v.variant.basic_price
                                    ).toLocaleString("en-IN")}`
                                  : "Price on request"}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-gray-600">
                                Quantity Converted:
                              </label>
                              <select
                                value={v.converted_qty || v.vehicle_qty || 1}
                                onChange={(e) => {
                                  const updatedLead = { ...selectedLead };
                                  const vehicleIndex =
                                    updatedLead.lead_details.findIndex(
                                      (vehicle) => vehicle.id === v.id
                                    );
                                  updatedLead.lead_details[
                                    vehicleIndex
                                  ].converted_qty = parseInt(e.target.value);
                                  setSelectedLead(updatedLead);
                                }}
                                className="border border-gray-300 rounded p-2 text-sm"
                              >
                                {Array.from(
                                  { length: v.vehicle_qty || 1 },
                                  (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                      {i + 1}
                                    </option>
                                  )
                                )}
                              </select>
                            </div>
                          </div>
                        ))}
                </div>

                {/* Invoice Details */}
                <div className="mt-6">
                  <h6 className="text-base font-medium text-primary-blue mb-3">
                    Invoice Details
                  </h6>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Invoice Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full border border-secondary-grey rounded p-2.5 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        placeholder="INV-2025-001"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Invoice Copy (PDF/JPG)
                      </label>
                      <input
                        type="file"
                        className="w-full border border-secondary-grey rounded p-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary-blue file:text-white"
                        onChange={(e) => setInvoiceCopy(e.target.files[0])}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ ACTION BUTTONS - ADDED BACK */}
              <div className="flex justify-end gap-3 mt-6">
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
                  Submit
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
