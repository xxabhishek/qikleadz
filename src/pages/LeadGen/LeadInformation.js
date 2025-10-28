import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper";
import axios from "axios";

const LeadInformation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { variant } = location.state || {};

  const [formData, setFormData] = useState({
    customerName: "",
    phoneNumber: "",
    customerLocation: "",
    customerArea: "",
    purchaseDate: "",
    quantity: 1,
    paymentMode: "cash",
    notes: "",
  });

  const [leadId, setLeadId] = useState(localStorage.getItem("leadId") || null);
  const [leadDetails, setLeadDetails] = useState(null);
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

  // NEW: Only this state added
  const [allVehiclesForCurrentLead, setAllVehiclesForCurrentLead] = useState(
    []
  );

  const API_BASE = "http://localhost:8000/api";
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  // Initialize localStorage and load stored leads - SAME
  useEffect(() => {
    localStorage.removeItem("leadId");
    localStorage.removeItem("draftLead");
    setLeadId(null);
    setLeadDetails(null);
    const stored = localStorage.getItem("recentSubmittedLead");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setStoredLeads(parsed);
        }
      } catch (err) {
        console.error("Failed to parse stored leads:", err);
        setStoredLeads([]);
      }
    }
    const draft = localStorage.getItem("draftLead");
    if (draft) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(draft) }));
      } catch (err) {
        console.error("Failed to parse draft lead:", err);
      }
    }
    // NEW: Load vehicles for current lead
    const vehiclesStored = localStorage.getItem("allVehiclesForCurrentLead");
    if (vehiclesStored && location.state?.isAddingAnotherVehicle) {
      try {
        setAllVehiclesForCurrentLead(JSON.parse(vehiclesStored));
      } catch (err) {
        console.error("Failed to parse vehicles:", err);
      }
    }
  }, []);

  // NEW: Auto-fill and DISABLE fields when adding another vehicle
  useEffect(() => {
    if (location.state?.isAddingAnotherVehicle && leadId) {
      // DISABLE all customer fields
      document.getElementById("customerName")?.setAttribute("disabled", true);
      // document.getElementById("phoneNumber")?.setAttribute("disabled", true);
      document.getElementById("locationSearch")?.setAttribute("disabled", true);
      document.getElementById("customerArea")?.setAttribute("disabled", true);
      document.getElementById("purchaseDate")?.setAttribute("disabled", true);
      document
        .querySelector('input[name="paymentMode"][value="cash"]')
        ?.setAttribute("disabled", true);
      document
        .querySelector('input[name="paymentMode"][value="finance"]')
        ?.setAttribute("disabled", true);
      document.getElementById("quantity")?.setAttribute("disabled", true);

      // Show disabled message
      setErrorMessage(
        "👤 Customer details locked - Adding another vehicle to existing lead"
      );
    }
  }, [location.state?.isAddingAnotherVehicle, leadId]);

  useEffect(() => {
    const loadExistingCustomerData = () => {
      const storedCustomerData = localStorage.getItem("existingCustomerData");
      const urlParams = new URLSearchParams(window.location.search);
      const isNewLead =
        urlParams.get("new") === "true" ||
        !location.state?.isAddingAnotherVehicle;

      if (isNewLead) {
        localStorage.removeItem("existingCustomerData");
        localStorage.removeItem("leadId");
        localStorage.removeItem("allVehiclesForCurrentLead");
        setAllVehiclesForCurrentLead([]);
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
        setLeadId(null);
        return;
      }

      if (storedCustomerData && location.state?.isAddingAnotherVehicle) {
        try {
          const customerData = JSON.parse(storedCustomerData);
          const isRecent =
            new Date().getTime() - customerData.timestamp < 10 * 60 * 1000;
          if (isRecent) {
            // FIXED: Properly set ALL fields including purchaseDate & location/area
            setFormData((prev) => ({
              ...prev,
              customerName: customerData.customer_name || "",
              phoneNumber: customerData.phone_no || "",
              customerLocation: customerData.location || "",
              customerArea: customerData.area || "",
              purchaseDate: customerData.purchase_date || "", // FIXED: Add this
              paymentMode: customerData.payment_mode || "cash",
              quantity: customerData.quantity || 1, // FIXED: Add this
            }));

            // FIXED: Set locationSearchText for dropdown
            setLocationSearchText(customerData.location || "");

            const finalLeadId = customerData.lead_id || location.state?.leadId;
            if (finalLeadId) {
              setLeadId(finalLeadId);
              localStorage.setItem("leadId", finalLeadId);
            }

            // Load vehicles
            const vehiclesStored = localStorage.getItem(
              "allVehiclesForCurrentLead"
            );
            if (vehiclesStored) {
              try {
                setAllVehiclesForCurrentLead(JSON.parse(vehiclesStored));
              } catch (err) {
                setAllVehiclesForCurrentLead([]);
              }
            }
          } else {
            localStorage.removeItem("existingCustomerData");
            localStorage.removeItem("leadId");
            localStorage.removeItem("allVehiclesForCurrentLead");
          }
        } catch (err) {
          console.error("Error parsing stored customer data:", err);
          localStorage.removeItem("existingCustomerData");
          localStorage.removeItem("leadId");
          localStorage.removeItem("allVehiclesForCurrentLead");
        }
      }
    };
    loadExistingCustomerData();
  }, [location.state]);

  // ALL OTHER useEffects SAME - Fetch reference data, load lead, sync formData, checkbox, fetch locations/areas, debounce, click outside
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
      } catch (err) {
        console.error("Error fetching data:", err);
        setBrands([]);
        setCcs([]);
        setFuelTypes([]);
        setGalleries([]);
      }
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
        console.error("Failed fetching lead details:", err);
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

  const fetchLocations = async (searchText) => {
    if (!searchText || searchText.trim().length < 2) {
      console.log("Search text too short, clearing locations");
      setLocations([]);
      setShowLocationDropdown(false);
      return;
    }
    try {
      setLoadingLocations(true);
      console.log("Fetching locations for:", searchText);
      const response = await axios.get(`${API_BASE}/admin/areas`, {
        headers: getAuthHeaders(),
        params: { search: searchText.trim() },
      });
      console.log("Locations API Response:", response.data);
      let locationsData = [];
      if (response.data && response.data.data) {
        locationsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        locationsData = response.data;
      }
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
      console.log("Processed cities:", uniqueCities);
      setLocations(uniqueCities);
      setShowLocationDropdown(uniqueCities.length > 0);
    } catch (err) {
      console.error("Error fetching locations:", err);
      console.error("Error details:", err.response?.data);
      setLocations([]);
      setShowLocationDropdown(false);
      setErrorMessage("Failed to load locations. Please try again.");
    } finally {
      setLoadingLocations(false);
    }
  };

  const fetchAreas = async (cityName) => {
    if (!cityName || cityName.trim().length === 0) {
      setAreas([]);
      setShowAreaDropdown(false);
      return;
    }
    try {
      setLoadingAreas(true);
      console.log("Fetching areas for city:", cityName);
      const response = await axios.get(`${API_BASE}/admin/areas`, {
        headers: getAuthHeaders(),
        params: { search: cityName.trim() },
      });
      console.log("Areas API Response:", response.data);
      let areasData = [];
      if (response.data && response.data.data) {
        areasData = response.data.data;
      } else if (Array.isArray(response.data)) {
        areasData = response.data;
      }
      const cityAreas = areasData.filter(
        (area) => (area.city_name || area.name) === cityName
      );
      console.log("Filtered areas for city:", cityAreas);
      setAreas(cityAreas);
      setShowAreaDropdown(cityAreas.length > 0);
    } catch (err) {
      console.error("Error fetching areas:", err);
      setAreas([]);
      setShowAreaDropdown(false);
    } finally {
      setLoadingAreas(false);
    }
  };

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
    if (formData.customerLocation) {
      fetchAreas(formData.customerLocation);
    } else {
      setAreas([]);
      setShowAreaDropdown(false);
    }
  }, [formData.customerLocation]);

  const handleChange = (e) => {
    const { id, name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id || name]: value,
    }));
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

  const handleLocationSelect = (location) => {
    console.log("Location selected:", location);
    setFormData((prev) => ({
      ...prev,
      customerLocation: location.city_name || location.name,
      customerArea: "",
    }));
    setLocationSearchText(location.city_name || location.name);
    setShowLocationDropdown(false);
    setLocations([]);
  };

  const handleAreaSelect = (area) => {
    setFormData((prev) => ({
      ...prev,
      customerArea: area.name,
    }));
    setShowAreaDropdown(false);
  };

  const handleCheckboxChange = (e) => {
    setUseSameCustomerDetails(e.target.checked);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".location-search-container")) {
        setShowLocationDropdown(false);
      }
      if (!event.target.closest(".area-select-container")) {
        setShowAreaDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateForm = () => {
    const phone = formData.phoneNumber;
    const phoneStr =
      typeof phone === "string" ? phone.trim() : String(phone || "");
    if (!formData.customerName || !formData.customerName.trim())
      return "Customer name is required.";
    if (!phoneStr || !/^\d{10}$/.test(phoneStr))
      return "A valid 10-digit phone number is required.";
    if (!formData.customerLocation || !formData.customerLocation.trim())
      return "Location is required.";
    if (!formData.quantity || formData.quantity < 1)
      return "Quantity must be at least 1.";
    if (!variant) return "Please select a vehicle variant.";
    return null;
  };

  const clearLocalStorageForSubmit = () => {
    const leadRelatedKeys = [
      "leadId",
      "draftLead",
      "recentSubmittedLead",
      "existingCustomerData",
      "allVehiclesForCurrentLead",
    ];

    leadRelatedKeys.forEach((key) => localStorage.removeItem(key));

    setStoredLeads([]);
    setAllVehiclesForCurrentLead([]);
  };

  // Clear localStorage for draft - SAME
  const clearLocalStorageForDraft = () => {
    localStorage.removeItem("leadId");
    localStorage.removeItem("draftLead");
    localStorage.removeItem("existingCustomerData");
  };

  // UPDATED: Handle form submission - Add current vehicle to allVehiclesForCurrentLead
  // const handleSubmit = async (action = "submit") => {
  //   const validationError = validateForm();
  //   if (validationError) {
  //     setErrorMessage(validationError);
  //     return null;
  //   }
  //   try {
  //     const finalLocation = formData.customerArea
  //       ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
  //       : formData.customerLocation.trim();

  //     let payload;

  //     if (action === "create") {
  //       payload = {
  //         customer_name: formData.customerName.trim(),
  //         phone_no: formData.phoneNumber.trim(),
  //         location: finalLocation || undefined,
  //         area: formData.customerArea || undefined,
  //         tentative_purchase_date: formData.purchaseDate || undefined,
  //         vehicle_qty: 2, // ✅ FIXED: FORCE 2
  //         payment_mode: formData.paymentMode,
  //         additional_note: formData.notes?.trim() || undefined,
  //         brand_id: variant?.brand_id ? parseInt(variant.brand_id, 10) : 1,
  //         variant_id: variant?.id ? parseInt(variant.id, 10) : 1,
  //         status: "Open",
  //       };
  //     } else {
  //       payload = {
  //         customer_name: formData.customerName.trim(),
  //         phone_no: formData.phoneNumber.trim(),
  //         location: finalLocation || undefined,
  //         area: formData.customerArea || undefined,
  //         tentative_purchase_date: formData.purchaseDate || undefined,
  //         vehicle_qty: 2, // ✅ FIXED: FORCE 2
  //         payment_mode: formData.paymentMode,
  //         additional_note: formData.notes?.trim() || undefined,
  //         brand_id: variant?.brand_id
  //           ? parseInt(variant.brand_id, 10)
  //           : undefined,
  //         variant_id: variant?.id ? parseInt(variant.id, 10) : undefined,
  //         lead_id: leadId || undefined,
  //         status: action === "save_draft" ? "Draft" : "Open",
  //       };
  //     }

  //     const { data } = await axios.post(`${API_BASE}/leads`, payload, {
  //       headers: getAuthHeaders(),
  //     });

  //     if (data?.lead?.id) {
  //       const newLeadId = data.lead.id;
  //       setLeadId(newLeadId);

  //       if (action === "create") {
  //         return newLeadId; // ✅ ONLY RETURN ID
  //       }

  //       // Rest of submit logic...
  //       const newLead = {
  //         ...data.lead,
  //         variant: variant,
  //         customer_name: formData.customerName.trim(),
  //         phone_no: formData.phoneNumber,
  //         location: finalLocation,
  //         area: formData.customerArea,
  //         vehicle_qty: 2, // ✅ FORCE 2
  //         payment_mode: formData.paymentMode,
  //         additional_note: formData.notes?.trim(),
  //       };

  //       const updatedVehicles = [...allVehiclesForCurrentLead, newLead];
  //       setAllVehiclesForCurrentLead(updatedVehicles);
  //       localStorage.setItem(
  //         "allVehiclesForCurrentLead",
  //         JSON.stringify(updatedVehicles)
  //       );

  //       const existingLeads = JSON.parse(
  //         localStorage.getItem("recentSubmittedLead") || "[]"
  //       );
  //       const updatedLeads = [...existingLeads, newLead];
  //       localStorage.setItem(
  //         "recentSubmittedLead",
  //         JSON.stringify(updatedLeads)
  //       );
  //       setStoredLeads(updatedLeads);

  //       if (action === "submit") {
  //         // ✅ SINGLE TIME: Update lead status to Open
  //         await axios.put(
  //           `${API_BASE}/leads/${newLeadId}`,
  //           {
  //             status: "Open",
  //           },
  //           { headers: getAuthHeaders() }
  //         );

  //         // ✅ Convert ALL draft vehicles to Open (backend handles this)
  //         await axios.put(
  //           `${API_BASE}/leads/${newLeadId}/submit-draft`,
  //           {},
  //           {
  //             headers: getAuthHeaders(),
  //           }
  //         );

  //         clearLocalStorageForSubmit();
  //         navigate("/leads/open", {
  //           state: {
  //             recentLead: newLead,
  //             allLeads: updatedLeads,
  //             submittedVariant: variant,
  //             submittedLeadId: newLeadId,
  //           },
  //         });
  //       }
  //       return newLeadId;
  //     }
  //     return null;
  //   } catch (err) {
  //     console.error("Lead save failed:", err.response?.data || err.message);
  //     setErrorMessage(err.response?.data?.message || "Lead submission failed.");
  //     return null;
  //   }
  // };

  const handleSubmit = async (action = "submit") => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return null;
    }

    try {
      const finalLocation = formData.customerArea
        ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
        : formData.customerLocation.trim();

      const totalVehicles = allVehiclesForCurrentLead.length + 1;

      const payload = {
        customer_name: formData.customerName.trim(),
        phone_no: formData.phoneNumber.trim(),
        location: finalLocation || null,
        area: formData.customerArea?.trim() || null,
        tentative_purchase_date: formData.purchaseDate || null,
        vehicle_qty: totalVehicles,
        payment_mode: formData.paymentMode,
        additional_note: formData.notes?.trim() || null,
        brand_id: variant?.brand_id ? parseInt(variant.brand_id, 10) : null,
        variant_id: variant?.id ? parseInt(variant.id, 10) : null,
        lead_id: leadId || null,
        status: action === "save_draft" ? "Draft" : "Open",
      };

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
        };

        const updatedVehicles = [...allVehiclesForCurrentLead, newVehicleEntry];
        setAllVehiclesForCurrentLead(updatedVehicles);
        localStorage.setItem(
          "allVehiclesForCurrentLead",
          JSON.stringify(updatedVehicles)
        );

        if (action === "submit") {
          clearLocalStorageForSubmit();
          navigate("/leads/open", {
            state: {
              recentLead: data.lead,
              allLeads: updatedVehicles,
              submittedVariant: variant,
              submittedLeadId: newLeadId,
            },
          });
        }

        return newLeadId;
      }
    } catch (err) {
      console.error("Submit failed:", err.response?.data);
      setErrorMessage(err.response?.data?.message || "Submission failed.");
    }
    return null;
  };

  // const handleSaveDraft = async () => {
  //   try {
  //     const validationError = validateForm();
  //     if (validationError) {
  //       setErrorMessage(validationError);
  //       return;
  //     }
  //     const finalLocation = formData.customerArea
  //       ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
  //       : formData.customerLocation.trim();
  //     const payload = {
  //       customer_name: formData.customerName.trim(),
  //       phone_no: formData.phoneNumber.trim(),
  //       location: finalLocation || undefined,
  //       area: formData.customerArea || undefined,
  //       tentative_purchase_date: formData.purchaseDate || undefined,
  //       vehicle_qty: parseInt(formData.quantity, 10),
  //       payment_mode: formData.paymentMode,
  //       additional_note: formData.notes?.trim() || undefined,
  //       brand_id: variant?.brand_id
  //         ? parseInt(variant.brand_id, 10)
  //         : undefined,
  //       variant_id: variant?.id ? parseInt(variant.id, 10) : undefined,
  //       status: "Draft",
  //     };
  //     const { data } = await axios.post(`${API_BASE}/leads`, payload, {
  //       headers: getAuthHeaders(),
  //     });
  //     if (data?.lead?.id) {
  //       localStorage.clear(); // FIXED: Clear ALL localStorage
  //       setStoredLeads([]);
  //       setAllVehiclesForCurrentLead([]);
  //       alert("Lead saved as Draft successfully!");
  //       navigate("/dashboard");
  //     }
  //   } catch (err) {
  //     console.error("Failed to save draft:", err);
  //     setErrorMessage("Failed to save draft. Please try again.");
  //   }
  // };

  const handleSaveDraft = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const finalLocation = formData.customerArea
      ? `${formData.customerLocation.trim()}, ${formData.customerArea.trim()}`
      : formData.customerLocation.trim();

    const totalVehicles = allVehiclesForCurrentLead.length + 1;

    const payload = {
      customer_name: formData.customerName.trim(),
      phone_no: formData.phoneNumber.trim(),
      location: finalLocation || null,
      area: formData.customerArea?.trim() || null,
      tentative_purchase_date: formData.purchaseDate || null,
      vehicle_qty: totalVehicles,
      payment_mode: formData.paymentMode,
      additional_note: formData.notes?.trim() || null,
      brand_id: parseInt(variant.brand_id, 10),
      variant_id: parseInt(variant.id, 10),
      lead_id: leadId || null,
      status: "Draft", // Always Draft
    };

    try {
      const { data } = await axios.post(`${API_BASE}/leads`, payload, {
        headers: getAuthHeaders(),
      });

      if (data?.lead?.id) {
        const newLeadId = data.lead.id;
        setLeadId(newLeadId);

        // Rebuild full vehicle list from local state
        const updatedVehicles = [
          ...allVehiclesForCurrentLead.map((v) => ({ ...v, status: "Draft" })),
          { ...payload, variant, lead_id: newLeadId, status: "Draft" },
        ];

        setAllVehiclesForCurrentLead(updatedVehicles);
        localStorage.setItem(
          "allVehiclesForCurrentLead",
          JSON.stringify(updatedVehicles)
        );

        localStorage.removeItem("existingCustomerData");
        localStorage.removeItem("leadId");

        alert("Draft saved! All vehicles are in Draft.");
        navigate("/dashboard");
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Draft failed.");
    }
  };

  // const addNewVehicle = async () => {
  //   try {
  //     let currentLeadId = leadId;

  //     // ✅ STEP 1: CREATE LEAD IF NONE (Skip form validation)
  //     if (!currentLeadId) {
  //       // ✅ USE STORED CUSTOMER DATA - NOT EMPTY formData!
  //       const storedCustomer = JSON.parse(
  //         localStorage.getItem("existingCustomerData") || "{}"
  //       );

  //       const payload = {
  //         customer_name:
  //           storedCustomer.customer_name || formData.customerName.trim(),
  //         phone_no: storedCustomer.phone_no || formData.phoneNumber.trim(),
  //         location: storedCustomer.location || formData.customerLocation.trim(),
  //         area: storedCustomer.area || formData.customerArea || undefined,
  //         tentative_purchase_date:
  //           storedCustomer.purchase_date || formData.purchaseDate || undefined,
  //         vehicle_qty: 2,
  //         payment_mode:
  //           storedCustomer.payment_mode || formData.paymentMode || "cash",
  //         additional_note: formData.notes?.trim() || undefined,
  //         brand_id: variant?.brand_id ? parseInt(variant.brand_id, 10) : 1,
  //         variant_id: variant?.id ? parseInt(variant.id, 10) : 1,
  //         status: "Open",
  //       };

  //       console.log("🚗 CREATING LEAD:", payload);

  //       const { data } = await axios.post(`${API_BASE}/leads`, payload, {
  //         headers: getAuthHeaders(),
  //       });

  //       currentLeadId = data.lead.id;
  //       setLeadId(currentLeadId);
  //     }

  //     // ✅ STEP 2: ADD VEHICLE
  //     const vehiclePayload = {
  //       brand_id: parseInt(variant.brand_id, 10),
  //       variant_id: parseInt(variant.id, 10),
  //       color_id: null,
  //       status: "Open",
  //     };

  //     await axios.post(
  //       `${API_BASE}/leads/${currentLeadId}/vehicles`,
  //       vehiclePayload,
  //       { headers: getAuthHeaders() }
  //     );

  //     // ✅ STEP 3: UPDATE LOCAL STORAGE (same as before)
  //     const storedCustomer = JSON.parse(
  //       localStorage.getItem("existingCustomerData") || "{}"
  //     );
  //     const currentVehicle = {
  //       variant,
  //       customer_name:
  //         storedCustomer.customer_name || formData.customerName.trim(),
  //       phone_no: storedCustomer.phone_no || formData.phoneNumber,
  //       location: storedCustomer.location || formData.customerLocation,
  //       area: storedCustomer.area || formData.customerArea,
  //       tentative_purchase_date:
  //         storedCustomer.purchase_date || formData.purchaseDate,
  //       vehicle_qty: 2,
  //       payment_mode: storedCustomer.payment_mode || formData.paymentMode,
  //       additional_note: formData.notes?.trim(),
  //       lead_id: currentLeadId,
  //     };

  //     const updatedVehicles = [...allVehiclesForCurrentLead, currentVehicle];
  //     setAllVehiclesForCurrentLead(updatedVehicles);
  //     localStorage.setItem(
  //       "allVehiclesForCurrentLead",
  //       JSON.stringify(updatedVehicles)
  //     );

  //     // ✅ STEP 4: UPDATE CUSTOMER DATA
  //     const customerData = {
  //       customer_name: storedCustomer.customer_name || formData.customerName,
  //       phone_no: storedCustomer.phone_no || formData.phoneNumber,
  //       location: storedCustomer.location || formData.customerLocation,
  //       area: storedCustomer.area || formData.customerArea,
  //       purchase_date: storedCustomer.purchase_date || formData.purchaseDate,
  //       quantity: 2,
  //       payment_mode: storedCustomer.payment_mode || formData.paymentMode,
  //       lead_id: currentLeadId,
  //       timestamp: new Date().getTime(),
  //     };
  //     localStorage.setItem(
  //       "existingCustomerData",
  //       JSON.stringify(customerData)
  //     );

  //     // ✅ STEP 5: NAVIGATE
  //     navigate("/leads/generate", {
  //       state: {
  //         isAddingAnotherVehicle: true,
  //         existingCustomer: customerData,
  //         leadId: currentLeadId,
  //       },
  //     });
  //   } catch (err) {
  //     console.error("❌ ADD VEHICLE FAILED:", err.response?.data || err);
  //     setErrorMessage(err.response?.data?.message || "Failed to add vehicle.");
  //   }
  // };

  const addNewVehicle = async () => {
    try {
      let currentLeadId = leadId;

      if (!currentLeadId) {
        // First vehicle → create as Draft
        const payload = {
          customer_name: formData.customerName.trim(),
          phone_no: formData.phoneNumber.trim(),
          location: formData.customerLocation.trim(),
          area: formData.customerArea || null,
          tentative_purchase_date: formData.purchaseDate || null,
          vehicle_qty: 1,
          payment_mode: formData.paymentMode,
          additional_note: formData.notes?.trim() || null,
          brand_id: parseInt(variant.brand_id, 10),
          variant_id: parseInt(variant.id, 10),
          status: "Draft", // ← DRAFT, not Open
        };

        const { data } = await axios.post(`${API_BASE}/leads`, payload, {
          headers: getAuthHeaders(),
        });
        currentLeadId = data.lead.id;
        setLeadId(currentLeadId);
      }

      // Add vehicle via API (backend will handle Draft/Open)
      await axios.post(
        `${API_BASE}/leads/${currentLeadId}/vehicles`,
        {
          brand_id: parseInt(variant.brand_id, 10),
          variant_id: parseInt(variant.id, 10),
          status: "Draft", // ← Force Draft
        },
        { headers: getAuthHeaders() }
      );

      // Update local state
      const updated = [
        ...allVehiclesForCurrentLead,
        { variant, status: "Draft" },
      ];
      setAllVehiclesForCurrentLead(updated);
      localStorage.setItem(
        "allVehiclesForCurrentLead",
        JSON.stringify(updated)
      );

      // Save customer data
      localStorage.setItem(
        "existingCustomerData",
        JSON.stringify({
          customer_name: formData.customerName,
          phone_no: formData.phoneNumber,
          location: formData.customerLocation,
          area: formData.customerArea,
          purchase_date: formData.purchaseDate,
          payment_mode: formData.paymentMode,
          lead_id: currentLeadId,
          timestamp: Date.now(),
        })
      );

      navigate("/leads/generate", {
        state: { isAddingAnotherVehicle: true, leadId: currentLeadId },
      });
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Add vehicle failed.");
    }
  };

  // renderVariantDetails - SAME
  const renderVariantDetails = (variant, title = "Selected Vehicle") => {
    if (!variant)
      return <p className="text-gray-400">{title}: None selected.</p>;

    const gallery = galleries.find((g) => g.variant_id === variant.id);
    let photos = [];
    if (gallery) {
      try {
        // Handle both 'vehicle_photos' and 'cover_photos' fields
        const photoField = gallery.vehicle_photos || gallery.cover_photos;
        photos =
          typeof photoField === "string" ? JSON.parse(photoField) : photoField;
        if (!Array.isArray(photos)) photos = [photoField].filter(Boolean); // Fallback to single photo
      } catch (e) {
        console.error("Error parsing photo data for variant:", variant.id, e);
        photos = [];
      }
    }
    const mainPhoto = photos[0]; // Use first photo as main
    console.log(
      "Variant:",
      variant,
      "Gallery:",
      gallery,
      "Main Photo:",
      mainPhoto
    ); // Debug log

    return (
      <div className="mb-6">
        <h4 className="text-[#0f66af] text-lg font-semibold mb-2">{title}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm">
              <span className="font-medium">Variant:</span> {variant.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">Brand:</span>{" "}
              {brands.find((b) => b.id === variant.brand_id)?.name || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">CC:</span>{" "}
              {ccs.find((c) => c.id === variant.cc_id)?.name || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Fuel Type:</span>{" "}
              {fuelTypes.find((f) => f.id === variant.fuel_type_id)?.name ||
                "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Price:</span>{" "}
              {variant.basic_price
                ? `₹${parseFloat(variant.basic_price).toLocaleString()}`
                : "Price on request"}
            </p>
          </div>
          <div className="flex justify-center items-center">
            {mainPhoto ? (
              <img
                src={`http://localhost:8000/uploads/coverPhotos/${mainPhoto}`} // Ensure correct path
                alt={`${variant.name} image`}
                className="w-60 h-60 object-contain rounded-md border"
                onError={(e) => {
                  console.log("Image load failed, using fallback:", e);
                  e.target.src =
                    "https://via.placeholder.com/240x240/f3f4f6/6b7280?text=No+Image";
                }}
              />
            ) : (
              <p className="text-gray-400">No image available</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="">
      <Stepper step={3} />
      {leadId && (
        <p className="text-green-600 font-semibold mb-4">
          Current Lead ID: {leadId}
        </p>
      )}
      {errorMessage && (
        <p className="text-red-600 font-semibold mb-4">{errorMessage}</p>
      )}
      <div className="bg-[#0f66af] text-white rounded-t-xl px-6 py-3 mt-6 shadow-sm">
        <h3 className="text-lg font-semibold">New Lead Information</h3>
      </div>
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 transition-colors flex items-center"
          >
            ← Back
          </button>
        </div>
        {variant && (
          <h4 className="text-[#0f66af] text-xl font-semibold mb-6">
            {variant.name}
          </h4>
        )}
        {/* ALL FORM INPUTS SAME - EXACTLY COPYPASTED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block font-medium mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Enter customer name"
                className="w-full border p-2.5 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className="w-full border p-2.5 rounded-lg"
                required
                pattern="\d{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>
            <div className="relative location-search-container">
              <label
                htmlFor="locationSearch"
                className="block font-medium mb-1"
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
                  className="w-full border p-2.5 rounded-lg pr-10"
                  required
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {loadingLocations ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <div className="font-medium">
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
                    <div className="px-4 py-2 text-gray-500 text-center">
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
              <label htmlFor="customerArea" className="block font-medium mb-1">
                Area
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
                  className={`w-full border p-2.5 rounded-lg pr-10 ${
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
                  {loadingAreas ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  ) : (
                    <svg
                      className="h-5 w-5 text-gray-400"
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
                  {areas.length > 0 ? (
                    areas.map((area) => (
                      <div
                        key={area.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                        onClick={() => handleAreaSelect(area)}
                      >
                        {area.name}
                        {area.city_name && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({area.city_name})
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-center">
                      {formData.customerLocation
                        ? loadingAreas
                          ? "Loading areas..."
                          : "No areas found for this location"
                        : "Select a location first"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label htmlFor="purchaseDate" className="block font-medium mb-1">
                Tentative Purchase Date
              </label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="w-full border p-2.5 rounded-lg"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block font-medium mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-full border p-2.5 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Payment Mode <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="cash"
                    checked={formData.paymentMode === "cash"}
                    onChange={handleChange}
                    className="mr-2"
                    required
                  />
                  Cash
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMode"
                    value="finance"
                    checked={formData.paymentMode === "finance"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Finance
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="notes" className="block font-medium mb-1">
            Additional Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Enter any additional notes..."
            rows="3"
            className="w-full border p-2.5 rounded-lg"
          />
        </div>
        {storedLeads.length > 0 && (
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useSameCustomerDetails}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Auto-Fill
            </label>
          </div>
        )}
        {/* CURRENT VEHICLE SAME */}
        {renderVariantDetails(variant, "Current Vehicle")}

        {/* UPDATED: Show allVehiclesForCurrentLead INSTEAD OF storedLeads when adding another vehicle */}
        {(allVehiclesForCurrentLead.length > 0 || storedLeads.length > 0) && (
          <div className="mt-6">
            <h4 className="text-[#0f66af] text-lg font-semibold mb-4">
              Previously Added Vehicles
            </h4>
            {(allVehiclesForCurrentLead.length > 0
              ? allVehiclesForCurrentLead
              : storedLeads
            ).map(
              (lead, idx) =>
                lead.variant && (
                  <div
                    key={idx}
                    className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    {renderVariantDetails(lead.variant, `Vehicle ${idx + 1}`)}
                    <p className="text-sm">
                      <span className="font-medium">Customer:</span>{" "}
                      {lead.customer_name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span>{" "}
                      {lead.phone_no}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Location:</span>{" "}
                      {lead.location || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Area:</span>{" "}
                      {lead.area || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Purchase Date:</span>{" "}
                      {lead.tentative_purchase_date || "N/A"}
                    </p>
                  </div>
                )
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
          <button
            onClick={async () => {
              await handleSaveDraft();
              // navigate("/dashboard", { replace: true }); // FORCE to Dashboard
            }}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={addNewVehicle}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Add Another Vehicle
          </button>
          <button
            onClick={async () => {
              await handleSubmit("submit");
            }}
            className="bg-primary-blue text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-hover-blue transition-colors"
          >
            Submit Lead
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadInformation;
