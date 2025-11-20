import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DraftLeads = () => {
  const [draftLeads, setDraftLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [galleries, setGalleries] = useState([]);
  const [brands, setBrands] = useState([]);
  const [variants, setVariants] = useState([]);
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [colors, setColors] = useState([]);
  const [filteredColors, setFilteredColors] = useState([]);
  const [saveAsDraft, setSaveAsDraft] = useState(true);
  const navigate = useNavigate();

  const API_BASE = " http://localhost:8000/api";
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  useEffect(() => {
    fetchDraftLeads();
    fetchGalleries();
    fetchBrands();
    fetchVariants();
    fetchColors();
  }, []);

  const fetchDraftLeads = async () => {
    try {
      setLoading(true);

      // Use the correct endpoint for draft leads from lead_details table
      const res = await axios.get(`${API_BASE}/lead-details/draft`, {
        headers: getAuthHeaders(),
      });

      console.log("=== DRAFT LEADS API RESPONSE ===");
      console.log("Success:", res.data.success);
      console.log("Data length:", res.data.data?.length);

      if (res.data.data && res.data.data.length > 0) {
        console.log("All draft leads:", res.data.data);
        res.data.data.forEach((lead, index) => {
          console.log(`Lead ${index + 1}:`, {
            lead_id: lead.lead_id,
            customer_name: lead.customer_name,
            status: lead.status,
            vehicle_qty: lead.vehicle_qty,
            leadDetails_count: lead.leadDetails?.length || 0,
          });
        });
      }
      console.log("=== END API RESPONSE ===");

      if (!res.data.success || !Array.isArray(res.data.data)) {
        setError("No draft leads found.");
        setDraftLeads([]);
        return;
      }

      const draftLeads = res.data.data;

      if (draftLeads.length === 0) {
        setError("No draft leads found.");
        setDraftLeads([]);
        return;
      }

      // Transform the data to match your frontend structure
      const transformedLeads = draftLeads.map((lead) => {
        const leadDetails = (lead.leadDetails || []).map((detail) => ({
          id: detail.id ? Number(detail.id) : null, // MUST preserve real DB id
          lead_id: detail.lead_id,
          brand_id: Number(detail.brand_id),
          variant_id: Number(detail.variant_id),
          color_id: detail.color_id ? Number(detail.color_id) : null,
          brand_name:
            detail.brand?.name || detail.brand_name || "Unknown Brand",
          variant_name:
            detail.variant?.name || detail.variant_name || "Unknown Variant",
          color_name: detail.color?.name || detail.color_name || "",
          color_code: detail.color?.color_code || detail.color_code || "",
          status: detail.status,
        }));

        return {
          id: lead.lead_id,
          lead_id: lead.lead_id,
          customer_name: lead.customer_name || "",
          phone_no: lead.phone_no || "",
          location: lead.location || "",
          area: lead.area || "",
          payment_mode: lead.payment_mode || "cash",
          tentative_purchase_date: lead.tentative_purchase_date || null,
          additional_note: lead.additional_note || "",
          vehicle_qty: lead.vehicle_qty || leadDetails.length,
          status: lead.status,
          created_at: lead.created_at,
          updated_at: lead.updated_at,
          leadDetails: leadDetails, // This now has CORRECT id
        };
      });

      console.log("Transformed Draft Leads:", transformedLeads);

      // Sort by newest first
      transformedLeads.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setDraftLeads(transformedLeads);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch draft leads:", err);
      console.error("Error details:", err.response?.data);
      setError(
        "Failed to fetch draft leads: " +
          (err.response?.data?.message || err.message)
      );
      setDraftLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const groupLeadsByLeadId = (leads) => {
    const grouped = {};

    leads.forEach((lead) => {
      const leadId = lead.lead_id;

      if (!grouped[leadId]) {
        grouped[leadId] = {
          id: lead.id,
          lead_id: leadId,
          customer_name: lead.customer_name,
          phone_no: lead.phone_no,
          location: lead.location,
          payment_mode: lead.payment_mode,
          tentative_purchase_date: lead.tentative_purchase_date,
          vehicle_qty: lead.vehicle_qty,
          oem_id: lead.oem_id,
          status: lead.status,
          created_at: lead.created_at,
          updated_at: lead.updated_at,
          leadDetails: [],
        };
      }

      grouped[leadId].leadDetails.push({
        id: lead.id,
        lead_id: lead.lead_id,
        brand_id: lead.leadDetails?.[0]?.brand_id,
        variant_id: lead.leadDetails?.[0]?.variant_id,
        color_id: lead.leadDetails?.[0]?.color_id,
        brand_name: lead.leadDetails?.[0]?.brand_name,
        variant_name: lead.leadDetails?.[0]?.variant_name,
        color_name: lead.leadDetails?.[0]?.color_name,
        color_code: lead.leadDetails?.[0]?.color_code,
        status: lead.status,
      });
    });

    return Object.values(grouped);
  };

  const fetchGalleries = async () => {
    try {
      const galleriesRes = await axios.get(`${API_BASE}/galleries`, {
        headers: getAuthHeaders(),
      });
      setGalleries(galleriesRes.data.data || galleriesRes.data || []);
    } catch (err) {
      console.error("Error fetching galleries:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const brandsRes = await axios.get(`${API_BASE}/brands`, {
        headers: getAuthHeaders(),
      });
      setBrands(brandsRes.data.data || brandsRes.data || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const fetchVariants = async () => {
    try {
      const variantsRes = await axios.get(`${API_BASE}/variants`, {
        headers: getAuthHeaders(),
      });
      setVariants(variantsRes.data.data || variantsRes.data || []);
    } catch (err) {
      console.error("Error fetching variants:", err);
    }
  };

  const fetchColors = async () => {
    try {
      const colorsRes = await axios.get(`${API_BASE}/colors`, {
        headers: getAuthHeaders(),
      });
      setColors(colorsRes.data.data || colorsRes.data || []);
    } catch (err) {
      console.error("Error fetching colors:", err);
    }
  };

  const calculateLeadAge = (createdDate) => {
    const currentDate = new Date();
    const leadDate = new Date(createdDate);
    const diffTime = currentDate - leadDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getVariantImage = (vehicle) => {
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
      return ` http://localhost:8000${url}`;
    }

    const cleanPath = url.replace(/^[\\/]+/, "");
    return ` http://localhost:8000/uploads/coverPhotos/${cleanPath}`;
  };

  const handleViewLead = async (lead) => {
    try {
      const freshLeadRes = await axios.get(
        `${API_BASE}/leads/${lead.lead_id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (freshLeadRes.data.success) {
        const freshLead = freshLeadRes.data.data;
        const transformedLead = {
          ...freshLead,
          leadDetails: freshLead.details
            ? freshLead.details.map((detail) => ({
                id: detail.id,
                lead_id: detail.lead_id,
                brand_id: detail.brand_id,
                variant_id: detail.variant_id,
                color_id: detail.color_id,
                brand_name: detail.brand?.name || "",
                variant_name: detail.variant?.name || "",
                color_name:
                  detail.color?.name || detail.color?.color_name || "",
                color_code: detail.color?.color_code || "",
              }))
            : [],
        };
        setSelectedLead(transformedLead);
      } else {
        setSelectedLead(lead);
      }
    } catch (err) {
      console.warn(
        "Could not fetch fresh lead data for view, using cached:",
        err.message
      );
      setSelectedLead(lead);
    }

    setIsViewModalOpen(true);
  };

  // const handleEditLead = async (lead) => {
  //   try {
  //     const freshLeadRes = await axios.get(
  //       `${API_BASE}/leads/${lead.lead_id}`,
  //       {
  //         headers: getAuthHeaders(),
  //       }
  //     );

  //     if (freshLeadRes.data.success) {
  //       setSelectedLead(freshLeadRes.data.data);
  //     } else {
  //       setSelectedLead(lead);
  //     }
  //   } catch (err) {
  //     console.warn(
  //       "Could not fetch fresh lead data, using cached:",
  //       err.message
  //     );
  //     setSelectedLead(lead);
  //   }

  //   const currentBrandId = lead.leadDetails?.[0]?.brand_id;
  //   if (currentBrandId && variants.length > 0) {
  //     const filtered = variants.filter(
  //       (variant) => variant.brand_id == currentBrandId
  //     );
  //     setFilteredVariants(filtered);
  //   } else {
  //     setFilteredVariants([]);
  //   }

  //   const currentVariantId = lead.leadDetails?.[0]?.variant_id;
  //   if (currentVariantId && galleries.length > 0) {
  //     const variantGalleries = galleries.filter(
  //       (gallery) => gallery.variant_id == currentVariantId
  //     );
  //     const uniqueColorIds = [
  //       ...new Set(variantGalleries.map((g) => g.color_id)),
  //     ];
  //     const variantColors = colors.filter((color) =>
  //       uniqueColorIds.includes(color.id)
  //     );
  //     setFilteredColors(variantColors);
  //   } else {
  //     setFilteredColors([]);
  //   }

  //   setIsEditModalOpen(true);
  // };

  const handleEditLead = async (lead) => {
    try {
      const freshRes = await axios.get(`${API_BASE}/leads/${lead.lead_id}`, {
        headers: getAuthHeaders(),
      });

      if (freshRes.data.success) {
        const l = freshRes.data.data;
        const transformed = {
          ...l,
          leadDetails: (l.details || []).map((d) => ({
            id: d.id,
            lead_id: d.lead_id,
            brand_id: d.brand_id,
            variant_id: d.variant_id,
            color_id: d.color_id,
            brand_name: d.brand?.name || "",
            variant_name: d.variant?.name || `Variant ID: ${d.variant_id}`,
            color_name: d.color?.name || d.color?.color_name || "",
            color_code: d.color?.color_code || "",
            status: d.status,
          })),
        };
        setSelectedLead(transformed);
      } else {
        setSelectedLead(lead);
      }
    } catch (err) {
      console.warn("Using cached lead:", err);
      setSelectedLead(lead);
    }

    setIsEditModalOpen(true);
  };

  const handleDeleteLead = async (leadDetailId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this lead? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE}/lead-details/${leadDetailId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data.success) {
        setDraftLeads((prev) =>
          prev.filter((lead) => lead.id !== leadDetailId)
        );
        if (selectedLead?.id === leadDetailId) {
          setIsViewModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedLead(null);
        }
        alert("Lead deleted successfully!");
      } else {
        throw new Error(response.data.message || "Failed to delete lead");
      }
    } catch (err) {
      console.error("Failed to delete lead:", err);
      if (err.response?.status === 401) {
        alert("Authentication failed. Please login again.");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else if (err.response?.status === 404) {
        alert("Lead not found. It may have been already deleted.");
        fetchDraftLeads();
      } else {
        alert(
          `Failed to delete lead: ${err.response?.data?.message || err.message}`
        );
      }
    }
  };

  const handleDeleteCompleteLead = async (leadId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this entire lead with all vehicles?"
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_BASE}/leads/${leadId}/complete`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.data.success) {
        setDraftLeads((prev) => prev.filter((lead) => lead.lead_id !== leadId));
        alert("Lead and all vehicles deleted successfully!");
      }
    } catch (err) {
      console.error("Failed to delete complete lead:", err);
      alert(
        `Failed to delete lead: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const handleDeleteVehicle = async (vehicleIndex) => {
    if (!selectedLead) return;

    const vehicle = selectedLead.leadDetails[vehicleIndex];

    if (vehicle.id && typeof vehicle.id === "number" && vehicle.id > 0) {
      if (
        !window.confirm(
          "Are you sure you want to delete this vehicle? This action cannot be undone."
        )
      ) {
        return;
      }

      try {
        const response = await axios.delete(
          `${API_BASE}/lead-details/${vehicle.id}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (response.data.success) {
          const updatedLeadDetails = selectedLead.leadDetails.filter(
            (_, index) => index !== vehicleIndex
          );

          setSelectedLead({
            ...selectedLead,
            leadDetails: updatedLeadDetails,
          });

          alert("Vehicle deleted successfully!");
        } else {
          throw new Error(response.data.message || "Failed to delete vehicle");
        }
      } catch (err) {
        console.error("Failed to delete vehicle:", err);
        if (err.response?.status === 401) {
          alert("Authentication failed. Please login again.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          alert("Failed to delete vehicle. Please try again.");
        }
      }
    } else {
      const updatedLeadDetails = selectedLead.leadDetails.filter(
        (_, index) => index !== vehicleIndex
      );

      setSelectedLead({
        ...selectedLead,
        leadDetails: updatedLeadDetails,
      });
    }
  };

  const handleBrandChange = (brandId, vehicleIndex) => {
    const updatedLeadDetails = [...selectedLead.leadDetails];
    updatedLeadDetails[vehicleIndex] = {
      ...updatedLeadDetails[vehicleIndex],
      brand_id: brandId,
      brand_name: brands.find((brand) => brand.id == brandId)?.name || "",
      variant_id: "",
      variant_name: "",
      color_id: "",
      color_name: "",
      color_code: "",
    };

    setSelectedLead({
      ...selectedLead,
      leadDetails: updatedLeadDetails,
    });
  };

  const handleVariantChange = (variantId, vehicleIndex) => {
    const selectedVariant = variants.find((v) => v.id == variantId);
    const updatedLeadDetails = [...selectedLead.leadDetails];
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
      leadDetails: updatedLeadDetails,
    });
  };

  const handleColorChange = (colorId, vehicleIndex) => {
    const selectedColor = colors.find((c) => c.id == colorId);
    const updatedLeadDetails = [...selectedLead.leadDetails];
    updatedLeadDetails[vehicleIndex] = {
      ...updatedLeadDetails[vehicleIndex],
      color_id: colorId,
      color_name: selectedColor?.name || selectedColor?.color_name || "",
      color_code: selectedColor?.color_code || "",
    };

    setSelectedLead({
      ...selectedLead,
      leadDetails: updatedLeadDetails,
    });
  };

  // const handleSaveEdit = async () => {

  //   if (!selectedLead) {
  //     alert("No lead selected.");
  //     return;
  //   }

  //   try {
  //     const leadPayload = {
  //       customer_name: selectedLead.customer_name || "",
  //       phone_no: selectedLead.phone_no || "",
  //       location: selectedLead.location || "",
  //       payment_mode: selectedLead.payment_mode || "",
  //       tentative_purchase_date: selectedLead.tentative_purchase_date || null,
  //       vehicle_qty: selectedLead.leadDetails?.length || 1,
  //       oem_id: selectedLead.oem_id || null,
  //       status: "Draft",
  //     };

  //     if (!leadPayload.customer_name)
  //       throw new Error("Customer name is required.");
  //     if (!leadPayload.phone_no || !/^[0-9]{10}$/.test(leadPayload.phone_no)) {
  //       throw new Error("Phone number must be a valid 10-digit number.");
  //     }

  //     const leadResponse = await axios.put(
  //       `${API_BASE}/leads/${selectedLead.lead_id}`,
  //       leadPayload,
  //       { headers: getAuthHeaders() }
  //     );

  //     if (!leadResponse.data.success) {
  //       throw new Error(leadResponse.data.message || "Failed to update lead");
  //     }

  //     const updatedLeadDetails = [];

  //     for (const vehicle of selectedLead.leadDetails) {
  //       if (!vehicle.brand_id || !vehicle.variant_id) {
  //         alert(
  //           `Please select a brand and variant for vehicle ${
  //             vehicle.id || "new"
  //           }`
  //         );
  //         return;
  //       }

  //       const vehiclePayload = {
  //         brand_id: vehicle.brand_id,
  //         variant_id: vehicle.variant_id,
  //         color_id: vehicle.color_id || null,
  //         status: "Draft",
  //       };

  //       if (vehicle.id && typeof vehicle.id === "number" && vehicle.id > 0) {
  //         const vehicleResponse = await axios.put(
  //           `${API_BASE}/lead-details/${vehicle.id}`,
  //           vehiclePayload,
  //           { headers: getAuthHeaders() }
  //         );

  //         if (vehicleResponse.data.success) {
  //           updatedLeadDetails.push({
  //             ...vehicle,
  //             ...vehicleResponse.data.data,
  //           });
  //         } else {
  //           throw new Error(
  //             vehicleResponse.data.message ||
  //               `Failed to update vehicle ${vehicle.id}`
  //           );
  //         }
  //       } else {
  //         const vehicleResponse = await axios.post(
  //           `${API_BASE}/leads/${selectedLead.lead_id}/vehicles`,
  //           vehiclePayload,
  //           { headers: getAuthHeaders() }
  //         );

  //         if (vehicleResponse.data.success) {
  //           updatedLeadDetails.push({
  //             ...vehicle,
  //             id: vehicleResponse.data.data.vehicle.id,
  //             brand_name: vehicleResponse.data.data.vehicle.brand_name,
  //             variant_name: vehicleResponse.data.data.vehicle.variant_name,
  //             color_name: vehicleResponse.data.data.vehicle.color_name,
  //             color_code: vehicleResponse.data.data.vehicle.color_code,
  //           });
  //         } else {
  //           throw new Error(
  //             vehicleResponse.data.message || "Failed to add new vehicle"
  //           );
  //         }
  //       }
  //     }

  //     const updatedSelectedLead = {
  //       ...selectedLead,
  //       ...leadResponse.data.data,
  //       leadDetails: updatedLeadDetails,
  //     };

  //     setSelectedLead(updatedSelectedLead);

  //     setDraftLeads((prevLeads) =>
  //       prevLeads.map((lead) =>
  //         lead.lead_id === selectedLead.lead_id
  //           ? { ...lead, ...updatedSelectedLead }
  //           : lead
  //       )
  //     );

  //     await fetchDraftLeads();

  //     setIsEditModalOpen(false);
  //     alert("Draft information updated successfully!");
  //   } catch (err) {
  //     console.error("Failed to update draft:", err);
  //     if (err.response?.status === 404) {
  //       alert("Lead not found. It may have been deleted.");
  //       fetchDraftLeads();
  //     } else if (err.response?.status === 410) {
  //       alert("This lead has been deleted and cannot be updated.");
  //       fetchDraftLeads();
  //     } else {
  //       alert(
  //         `Failed to update draft: ${
  //           err.response?.data?.message || err.message
  //         }`
  //       );
  //     }
  //   }
  // };

  const handleSaveEdit = async () => {
    if (!selectedLead) return;

    const status = saveAsDraft ? "Draft" : "Open";

    try {
      const payload = {
        customer_name: (selectedLead.customer_name || "").trim(),
        phone_no: selectedLead.phone_no?.trim(),
        location: selectedLead.location || "",
        area: selectedLead.area || "",
        tentative_purchase_date: selectedLead.tentative_purchase_date || null,
        payment_mode: selectedLead.payment_mode || "cash",
        additional_note: selectedLead.additional_note || "",
        status: status, // <-- YEH BHEJEGA
        vehicles: selectedLead.leadDetails.map((v) => ({
          id: v.id > 0 ? v.id : null,
          brand_id: Number(v.brand_id),
          variant_id: Number(v.variant_id),
          color_id: v.color_id ? Number(v.color_id) : null,
        })),
      };

      // Validation
      if (!payload.customer_name) return alert("Customer name required");
      if (!/^\d{10}$/.test(payload.phone_no))
        return alert("Valid 10-digit phone required");
      if (payload.vehicles.length === 0)
        return alert("Add at least one vehicle");
      if (payload.vehicles.some((v) => !v.brand_id || !v.variant_id))
        return alert("Select brand & variant for all vehicles");

      const res = await axios.put(
        `${API_BASE}/leads/${selectedLead.lead_id}/update`,
        payload,
        { headers: getAuthHeaders() }
      );

      if (res.data.success) {
        alert(
          status === "Draft" ? "Draft saved!" : "Lead submitted successfully!"
        );

        // Refresh draft list
        await fetchDraftLeads();

        // Agar submit kiya to modal band + list se hatao
        if (status === "Open") {
          setDraftLeads((prev) =>
            prev.filter((l) => l.lead_id !== selectedLead.lead_id)
          );
        }

        setIsEditModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save");
    }
  };

  const handleSubmitDraft = async () => {
    if (!selectedLead) return;

    try {
      console.log("Submitting lead:", selectedLead.lead_id);

      // Call the submit draft API
      const response = await axios.put(
        `${API_BASE}/leads/${selectedLead.lead_id}/submit-draft`,
        {},
        {
          headers: getAuthHeaders(),
        }
      );

      console.log("Submit response:", response.data);

      if (response.data.success) {
        // Remove from draft leads list
        setDraftLeads((prev) =>
          prev.filter((lead) => lead.lead_id !== selectedLead.lead_id)
        );

        // Close modals
        setIsViewModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedLead(null);

        alert("Lead submitted successfully!");
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error("Failed to submit draft:", err);
      console.error("Error details:", err.response?.data);
      alert(
        `Failed to submit draft: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const handleAddNewVehicle = () => {
    const tempId = -Date.now();

    const newVehicle = {
      id: tempId,
      brand_id: "",
      brand_name: "",
      variant_id: "",
      variant_name: "",
      color_id: "",
      color_name: "",
      color_code: "",
    };

    setSelectedLead({
      ...selectedLead,
      leadDetails: [...selectedLead.leadDetails, newVehicle],
    });
  };

  const sortLeadsByAge = (order) => {
    setDraftLeads((prev) => {
      const sorted = [...prev];
      if (order === "newest") {
        return sorted.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      } else {
        return sorted.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      }
    });
  };

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh]"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <span className="text-gray-600 font-medium mt-4">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      {/* Draft Leads Section */}
      <section className="p-4 md:p-6">
        <div className="container mx-auto px-0 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <label
                htmlFor="sortLeads"
                className="text-xs font-medium text-gray-600"
              >
                Sort Drafts by Age:
              </label>
              <select
                id="sortLeads"
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  sortLeadsByAge(e.target.value);
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white focus:ring-2 focus:ring-[#0f66af]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {error && draftLeads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-gray-500 text-xl font-medium mb-2">
                No Draft Leads
              </h3>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => navigate("/leads/generate")}
                className="bg-[#0f66af] text-white rounded-lg px-6 py-3 hover:bg-[#084a8a] transition-colors"
              >
                Create Your First Lead
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4" id="leadsContainer">
              {draftLeads.map((lead) => {
                const draftAge = calculateLeadAge(lead.created_at);
                const draftAgeClass = draftAge <= 3 ? "draft-new" : "draft-old";

                return (
                  <div
                    key={lead.lead_id}
                    className="lead-card bg-white p-5 rounded-lg shadow-md border-l-4 border-[#0f66af]"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h6 className="text-base font-semibold text-gray-800 mb-1">
                            {lead.customer_name}
                          </h6>
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
                              className="action-btn btn-delete"
                              title="Delete"
                              onClick={() => handleDeleteLead(lead.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-1">
                          {lead.leadDetails?.length || 0} vehicle(s) selected
                        </p>

                        {/* Display all vehicles in this lead */}
                        <div className="mt-2 space-y-2">
                          {lead.leadDetails?.map((vehicle, index) => (
                            <div
                              key={vehicle.id || index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-700">
                                {vehicle.variant_name ||
                                  `Variant ID: ${vehicle.variant_id}` ||
                                  "No variant selected"}
                              </span>
                              {vehicle.color_name && (
                                <span className="text-gray-500">
                                  - {vehicle.color_name}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <span className={`draft-age ${draftAgeClass}`}>
                            {draftAge} day{draftAge !== 1 ? "s" : ""} old
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
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {lead.leadDetails?.length || 0} vehicle(s)
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
                            className="action-btn btn-delete"
                            title="Delete"
                            onClick={() => handleDeleteLead(lead.id)}
                          >
                            <i className="bi bi-trash"></i>
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

      {/* View Lead Modal */}
      {isViewModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="bg-[#0f66af] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
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
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
                <h6 className="text-base font-medium text-[#0f66af] mb-3 flex items-center">
                  <i className="bi bi-person-fill mr-2"></i> Customer
                  Information
                </h6>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Name
                    </label>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedLead.customer_name}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Mobile No.
                    </label>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedLead.phone_no}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Location
                    </label>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedLead.location || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
                      Address
                    </label>
                    <p className="text-sm font-medium text-gray-800">
                      {selectedLead.location || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              {selectedLead.leadDetails &&
              selectedLead.leadDetails.length > 0 ? (
                selectedLead.leadDetails.map((vehicle, index) => {
                  const variant = variants.find(
                    (v) => v.id == vehicle.variant_id
                  );
                  const brand = brands.find((b) => b.id == vehicle.brand_id);
                  const color = colors.find((c) => c.id == vehicle.color_id);

                  return (
                    <div
                      key={vehicle.id || index}
                      className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h6 className="text-base font-medium text-[#0f66af] flex items-center">
                          <i className="bi bi-bicycle mr-2"></i> Vehicle{" "}
                          {index + 1}
                        </h6>
                      </div>

                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="md:w-1/3">
                          <img
                            src={getVariantImage(vehicle)}
                            alt={
                              vehicle.variant_name || variant?.name || "Vehicle"
                            }
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
                            }}
                          />
                          {(vehicle.color_code || color?.color_code) && (
                            <div className="mt-2 flex items-center justify-center">
                              <div
                                className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                                style={{
                                  backgroundColor:
                                    vehicle.color_code || color?.color_code,
                                }}
                              ></div>
                              <span className="text-xs text-gray-600">
                                {vehicle.color_name ||
                                  color?.name ||
                                  color?.color_name ||
                                  "Selected Color"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="md:w-2/3">
                          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600">
                                Brand
                              </label>
                              <p className="text-sm font-medium text-gray-800">
                                {brand?.name || vehicle.brand_name || "N/A"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600">
                                Variant
                              </label>
                              <p className="text-sm font-medium text-gray-800">
                                {variant?.name || vehicle.variant_name || "N/A"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600">
                                Color
                              </label>
                              <p className="text-sm font-medium text-gray-800">
                                {color?.name ||
                                  color?.color_name ||
                                  vehicle.color_name ||
                                  "N/A"}
                              </p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600">
                                Price
                              </label>
                              <p className="text-sm font-medium text-gray-800">
                                {variant?.basic_price
                                  ? `$${parseFloat(
                                      variant.basic_price
                                    ).toLocaleString("en-IN")}`
                                  : variant?.price
                                  ? `$${parseFloat(
                                      variant.price
                                    ).toLocaleString("en-IN")}`
                                  : "Price on request"}
                              </p>
                            </div>
                            {index === 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-600">
                                  Payment Mode
                                </label>
                                <p className="text-sm font-medium text-gray-800">
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
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
                  <div className="text-center py-6">
                    <i className="bi bi-car-front text-4xl text-gray-400 mb-2"></i>
                    <p className="text-gray-500">
                      No vehicle details available
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-4 gap-2">
                <button
                  className="bg-[#0f66af] text-white rounded-md px-4 py-2 text-sm hover:bg-[#084a8a] transition-colors"
                  onClick={handleSubmitDraft}
                >
                  Submit Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {isEditModalOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="bg-[#0f66af] text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
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
              {/* Customer Information Form */}
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200">
                <h6 className="text-base font-medium text-[#0f66af] mb-3 flex items-center">
                  <i className="bi bi-person-fill mr-2"></i> Customer
                  Information
                </h6>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={selectedLead.customer_name || ""}
                      onChange={(e) =>
                        setSelectedLead({
                          ...selectedLead,
                          customer_name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Mobile No. *
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={selectedLead.phone_no || ""}
                      onChange={(e) =>
                        setSelectedLead({
                          ...selectedLead,
                          phone_no: e.target.value,
                        })
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
                      className="w-full border border-gray-300 rounded p-2 text-sm"
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
                      className="w-full border border-gray-300 rounded p-2 text-sm"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Tentative Purchase Date
                    </label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={selectedLead.tentative_purchase_date || ""}
                      onChange={(e) =>
                        setSelectedLead({
                          ...selectedLead,
                          tentative_purchase_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Vehicle Quantity
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={
                        selectedLead.vehicle_qty ||
                        selectedLead.leadDetails?.length ||
                        1
                      }
                      onChange={(e) =>
                        setSelectedLead({
                          ...selectedLead,
                          vehicle_qty: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="mb-4">
                <h6 className="text-base font-medium text-[#0f66af] mb-3 flex items-center">
                  <i className="bi bi-bicycle mr-2"></i> Vehicle Information
                  <span className="ml-2 text-sm text-gray-500">
                    ({selectedLead.leadDetails?.length || 0} vehicles)
                  </span>
                </h6>

                {selectedLead.leadDetails?.map((vehicle, index) => (
                  <div
                    key={vehicle.id || `temp-${index}`}
                    className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-gray-200 relative"
                  >
                    {selectedLead.leadDetails.length > 1 && (
                      <button
                        type="button"
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteVehicle(index)}
                        title="Delete Vehicle"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}

                    <div className="flex justify-between items-center mb-3">
                      <h6 className="text-base font-medium text-gray-700 flex items-center">
                        <i className="bi bi-car-front mr-2"></i> Vehicle{" "}
                        {index + 1}
                        {vehicle.id && (
                          <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            ID: {vehicle.id}
                          </span>
                        )}
                      </h6>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-2/5">
                        <div className="relative">
                          <img
                            src={getVariantImage(vehicle)}
                            alt={vehicle.variant_name || "Vehicle"}
                            className="w-full h-64 object-contain rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop";
                            }}
                          />
                          {vehicle.color_code && (
                            <div className="mt-2 flex items-center justify-center">
                              <div
                                className="w-6 h-6 rounded-full border border-gray-300 mr-2"
                                style={{ backgroundColor: vehicle.color_code }}
                              ></div>
                              <span className="text-xs text-gray-600">
                                {vehicle.color_name || "Selected Color"}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="md:w-3/5">
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Brand *
                            </label>
                            <select
                              className="w-full border border-gray-300 rounded p-2 text-sm"
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
                              className="w-full border border-gray-300 rounded p-2 text-sm"
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
                              className="w-full border border-gray-300 rounded p-2 text-sm bg-gray-50"
                              value={
                                variants.find(
                                  (v) => v.id === vehicle.variant_id
                                )?.basic_price
                                  ? `$${parseFloat(
                                      variants.find(
                                        (v) => v.id === vehicle.variant_id
                                      )?.basic_price
                                    ).toLocaleString()}`
                                  : "Price on request"
                              }
                              readOnly
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-600 mb-1">
                            Vehicle Status
                          </label>
                          <div className="flex items-center">
                            <span
                              className={`status-badge ${
                                vehicle.status === "Draft"
                                  ? "status-draft"
                                  : "status-open"
                              }`}
                            >
                              {vehicle.status || "Draft"}
                            </span>
                            {vehicle.id && (
                              <span className="ml-2 text-xs text-gray-500">
                                (Saved in database)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 mb-4 hover:border-[#0f66af] hover:text-[#0f66af] flex items-center justify-center transition-colors"
                onClick={handleAddNewVehicle}
              >
                <i className="bi bi-plus-circle mr-2"></i> Add Another Vehicle
              </button>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="text-red-600 hover:text-red-800 font-medium"
                  onClick={() => {
                    if (window.confirm("Delete entire lead?")) {
                      handleDeleteCompleteLead(selectedLead.lead_id);
                      setIsEditModalOpen(false);
                    }
                  }}
                >
                  Delete Lead
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>

                  {/* SAVE AS DRAFT */}
                  <button
                    type="button"
                    className="px-6 py-2 bg-primary-blue text-white rounded-md hover:bg-orange-600"
                    onClick={() => {
                      setSaveAsDraft(true);
                      handleSaveEdit();
                    }}
                  >
                    Save Changes
                  </button>

                  {/* SUBMIT LEAD */}
                  {/* <button
                    type="button"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                    onClick={() => {
                      setSaveAsDraft(false);
                      handleSaveEdit();
                    }}
                  >
                    Submit Lead
                  </button> */}
                </div>
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
          color: #0f66af;
        }
        .btn-edit {
          background-color: rgba(248, 150, 30, 0.1);
          color: #ffd700;
        }
        .btn-delete {
          background-color: rgba(239, 68, 68, 0.1);
          color: #000000ff;
        }
        .draft-age {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
        }
        .draft-new {
          background-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        .draft-old {
          background-color: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        .payment-badge {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
          text-transform: capitalize;
        }

        .payment-cash {
          background-color: rgba(16, 185, 129, 0.2); /* Green for Cash */
          color: #10b981;
        }

        .payment-finance {
          background-color: rgba(239, 68, 68, 0.2); /* Red for Finance */
          color: #ef4444;
        }
        .status-badge {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 20px;
          font-weight: 500;
        }
        .status-draft {
          background-color: rgba(248, 150, 30, 0.2);
          color: #f8961e;
        }
        .status-open {
          background-color: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        @media (max-width: 640px) {
          .desktop-actions {
            display: none;
          }
          .mobile-actions {
            display: flex;
          }
        }
        @media (min-width: 641px) {
          .mobile-actions {
            display: none;
          }
          .desktop-actions {
            display: flex;
          }
        }
      `}</style>
    </div>
  );
};

export default DraftLeads;
