// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Container from "../components/Container";
// import Footer from "../components/Layout/Footer";
// import html2pdf from "html2pdf.js";

// const CreditNoteDetails = () => {
//   const [creditNotes, setCreditNotes] = useState([]);
//   const [groupedNotes, setGroupedNotes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedLead, setSelectedLead] = useState(null);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [generatingId, setGeneratingId] = useState(null);

//   const [generatedLeads, setGeneratedLeads] = useState(() => {
//     const saved = localStorage.getItem("generatedCreditNotes");
//     return saved ? new Set(JSON.parse(saved)) : new Set();
//   });
//   const API_BASE = "http://localhost:8000/api";

//   const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   useEffect(() => {
//     const fetchCreditNotes = async () => {
//       try {
//         const response = await axios.get(`${API_BASE}/credit-notes`, {
//           headers: getAuthHeaders(),
//         });

//         const data = response.data.data || response.data || [];
//         setCreditNotes(data);

//         // Group data by lead_id
//         const grouped = groupByLeadId(data);
//         setGroupedNotes(grouped);
//       } catch (err) {
//         console.error("Error fetching credit notes:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCreditNotes();
//   }, []);

//   const groupByLeadId = (notes) => {
//     const groups = {};

//     notes.forEach((note) => {
//       const leadId = note.lead_id;
//       if (!leadId) return;

//       if (!groups[leadId]) {
//         groups[leadId] = {
//           lead_id: leadId,
//           lead_no: note.lead_no || `LAA${String(leadId).padStart(4, "0")}`,
//           customer_name: note.customer_name || "N/A",
//           vehicles: [],
//           total_incentive: 0,
//           total_quantity: 0,
//           verification_date: note.verified_at,
//           invoice_no: note.invoice_no || "N/A",
//           uploaded_invoice: note.uploaded_invoice,
//         };
//       }

//       // Direct use backend se aaye hue total_incentive
//       groups[leadId].total_incentive += parseFloat(note.total_incentive) || 0;
//       groups[leadId].total_quantity += parseInt(note.vehicle_qty) || 0;

//       // Vehicle ko push karte waqt extra fields add kar do
//       groups[leadId].vehicles.push({
//         ...note,
//         commission_per_unit: parseFloat(note.commission_per_unit) || 0,
//         vehicle_incentive: parseFloat(note.total_incentive) || 0, // per vehicle
//       });

//       // Earliest verification date
//       const newDate = new Date(note.verified_at);
//       const currentDate = new Date(groups[leadId].verification_date);
//       if (newDate < currentDate) {
//         groups[leadId].verification_date = note.verified_at;
//       }
//     });

//     return Object.values(groups);
//   };

//   // const generateInvoice = async (leadId, leadNo) => {
//   //   setGeneratingId(leadId);

//   //   try {
//   //     const response = await axios.get(
//   //       `${API_BASE}/lead-details/lead/${leadId}/generateinvoice`,
//   //       {
//   //         headers: getAuthHeaders(),
//   //       }
//   //     );

//   //     if (!response.data.success) {
//   //       alert(response.data.message || "Failed to generate invoice");
//   //       return;
//   //     }

//   //     const htmlContent = response.data.html;

//   //     const opt = {
//   //       margin: 10,
//   //       filename: `Invoice_${leadNo || leadId}.pdf`,
//   //       image: { type: "jpeg", quality: 0.98 },
//   //       html2canvas: { scale: 2 },
//   //       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//   //     };

//   //     html2pdf().set(opt).from(htmlContent).save();

//   //     // Success ke baad mark kar de ki yeh lead generated hai
//   //     setGeneratedLeads((prev) => new Set(prev).add(leadId));
//   //   } catch (err) {
//   //     console.error("Invoice generation failed:", err);
//   //     alert("Failed to generate invoice. Please try again.");
//   //   } finally {
//   //     setGeneratingId(null);
//   //   }
//   // };

//   const generateInvoice = async (leadId, leadNo) => {
//     setGeneratingId(leadId);

//     try {
//       const response = await axios.get(
//         `${API_BASE}/lead-details/lead/${leadId}/generateinvoice`,
//         {
//           headers: getAuthHeaders(),
//         }
//       );

//       if (!response.data.success) {
//         alert(response.data.message || "Failed to generate invoice");
//         return;
//       }

//       const htmlContent = response.data.html;

//       const opt = {
//         margin: 10,
//         filename: `CreditNote_${leadNo || leadId}.pdf`,
//         image: { type: "jpeg", quality: 0.98 },
//         html2canvas: { scale: 2 },
//         jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
//       };

//       html2pdf().set(opt).from(htmlContent).save();

//       // ← SUCCESS KE BAAD LOCALSTORAGE MEIN SAVE KARO
//       const newSet = new Set(generatedLeads);
//       newSet.add(leadId);
//       setGeneratedLeads(newSet);
//       localStorage.setItem(
//         "generatedCreditNotes",
//         JSON.stringify(Array.from(newSet))
//       );
//     } catch (err) {
//       console.error("Invoice generation failed:", err);
//       alert("Failed to generate invoice. Please try again.");
//     } finally {
//       setGeneratingId(null);
//     }
//   };

//   const getButtonText = (leadId) => {
//     if (generatingId === leadId) return "Generating...";
//     if (generatedLeads.has(leadId)) return "Download Again";
//     return "Generate Invoice";
//   };
//   const openViewModal = (leadGroup) => {
//     setSelectedLead(leadGroup);
//     setShowViewModal(true);
//   };

//   const closeViewModal = () => {
//     setShowViewModal(false);
//     setSelectedLead(null);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const formatCurrency = (amount) => {
//     if (!amount) return "₹0";
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   return (
//     <>
//       <link
//         href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
//         rel="stylesheet"
//       />
//       <link
//         href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
//         rel="stylesheet"
//       />

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//         :root {
//           --primary-blue: #0f66af;
//           --hover-blue: #084a8a;
//         }
//         body { font-family: 'Montserrat', sans-serif; }
//         .container-animate { animation: fadeIn 0.5s ease-in; }
//         @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//         .credit-note-card {
//           border-left: 4px solid var(--primary-blue);
//         }
//         .btn-primary-blue {
//           background-color: var(--primary-blue);
//           color: white;
//           transition: all 0.3s ease;
//         }
//         .btn-primary-blue:hover {
//           background-color: var(--hover-blue);
//           transform: scale(1.05);
//         }
//         .action-btn {
//           padding: 0.5rem 1rem;
//           border-radius: 0.375rem;
//           color: white;
//           text-decoration: none;
//           display: inline-block;
//           font-size: 0.875rem;
//           font-weight: 500;
//           transition: background-color 0.2s;
//           cursor: pointer;
//         }
//         .action-btn.download {
//           background-color: var(--primary-blue);
//         }
//         .action-btn.download:hover {
//           background-color: var(--hover-blue);
//         }
//         .vehicle-detail-row {
//           border-bottom: 1px solid #e5e7eb;
//           padding: 1rem 0;
//         }
//         .vehicle-detail-row:last-child {
//           border-bottom: none;
//         }
//         .btn-generating {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }
//       `,
//         }}
//       />

//       <Container>
//         <div className="container-animate mx-auto px-0 md:px-8 xl:px-12">
//           <section className="p-4 md:p-6 xl:p-10">
//             <div className="max-w-7xl mx-auto">
//               <div className="mb-6 md:mb-8">
//                 <h5 className="text-lg md:text-xl font-semibold text-primary-blue">
//                   Total Claims
//                 </h5>
//                 <p className="text-gray-600 text-sm mt-1">
//                   Verified credit notes ready for processing
//                 </p>
//               </div>

//               {loading ? (
//                 <div className="text-center py-12">
//                   <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                   <p className="text-gray-500 mt-4">Loading credit notes...</p>
//                 </div>
//               ) : groupedNotes.length === 0 ? (
//                 <div className="text-center py-12 bg-gray-50 rounded-xl">
//                   <div className="text-gray-400 text-5xl mb-4">
//                     <i className="bi bi-file-earmark-text"></i>
//                   </div>
//                   <h4 className="text-gray-600 text-lg font-medium mb-2">
//                     No verified credit notes
//                   </h4>
//                   <p className="text-gray-500 max-w-md mx-auto">
//                     There are currently no verified credit notes available.
//                     Verified notes will appear here automatically.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                   {groupedNotes.map((leadGroup, index) => (
//                     <div
//                       key={leadGroup.lead_id}
//                       className="credit-note-card bg-white p-5 rounded-xl shadow-sm"
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <div>
//                           <h6 className="text-base font-semibold text-gray-800 mb-1">
//                             Credit Note: CR{String(index + 1).padStart(3, "0")}
//                           </h6>
//                           <p className="text-sm text-gray-500">
//                             Verified on{" "}
//                             {formatDate(leadGroup.verification_date)}
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-lg font-bold text-green-600 mb-2">
//                             {formatCurrency(leadGroup.total_incentive)}
//                           </div>
//                           <div className="text-xs text-gray-500">
//                             {leadGroup.vehicles.length} vehicle
//                             {leadGroup.vehicles.length > 1 ? "s" : ""}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-2 gap-3 mb-4">
//                         <div className="bg-gray-50 p-3 rounded-lg">
//                           <p className="text-xs text-gray-500 mb-1">Lead No</p>
//                           <p className="text-sm font-medium">
//                             {leadGroup.lead_no}
//                           </p>
//                         </div>
//                         <div className="bg-gray-50 p-3 rounded-lg">
//                           <p className="text-xs text-gray-500 mb-1">
//                             Total Vehicles
//                           </p>
//                           <p className="text-sm font-medium">
//                             {leadGroup.total_quantity} units
//                           </p>
//                         </div>
//                         <div className="bg-gray-50 p-3 rounded-lg">
//                           <p className="text-xs text-gray-500 mb-1">
//                             Invoice No
//                           </p>
//                           <p className="text-sm font-medium">
//                             {leadGroup.invoice_no || "N/A"}
//                           </p>
//                         </div>
//                         {/* <div className="bg-gray-50 p-3 rounded-lg">
//                           <p className="text-xs text-gray-500 mb-1">
//                             Vehicle Types
//                           </p>
//                           <p className="text-sm font-medium">
//                             {leadGroup.vehicles.length} variant
//                             {leadGroup.vehicles.length > 1 ? "s" : ""}
//                           </p>
//                         </div> */}
//                       </div>

//                       <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//                         <button
//                           onClick={() =>
//                             generateInvoice(
//                               leadGroup.lead_id,
//                               leadGroup.lead_no
//                             )
//                           }
//                           disabled={generatingId === leadGroup.lead_id}
//                           className={`action-btn download px-6 py-3 rounded-lg text-sm font-medium ${
//                             generatingId === leadGroup.lead_id
//                               ? "opacity-70 cursor-not-allowed"
//                               : ""
//                           }`}
//                         >
//                           {getButtonText(leadGroup.lead_id)}
//                         </button>
//                         <button
//                           onClick={() => openViewModal(leadGroup)}
//                           className="btn-primary-blue rounded-lg px-4 py-2 text-sm"
//                         >
//                           View Details
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </section>

//           {/* View Modal - same as before */}
//           {showViewModal && selectedLead && (
//             <div
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4"
//               onClick={closeViewModal}
//             >
//               <div
//                 className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Modal Header */}
//                 <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center">
//                   <h5 className="text-base font-medium">
//                     Credit Note Details - Lead {selectedLead.lead_no}
//                   </h5>
//                   <button
//                     onClick={closeViewModal}
//                     className="text-white hover:text-gray-200 text-lg"
//                   >
//                     <i className="bi bi-x-lg"></i>
//                   </button>
//                 </div>

//                 {/* Modal Body */}
//                 <div className="p-4 flex-1 overflow-y-auto">
//                   <div className="space-y-6">
//                     {/* Lead Summary */}
//                     <div>
//                       <h6 className="text-base font-medium text-primary-blue mb-3">
//                         Lead Summary
//                       </h6>
//                       <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                         <div className="bg-gray-50 p-4 rounded-lg">
//                           <p className="text-xs text-gray-500 mb-1">
//                             Lead Number
//                           </p>
//                           <p className="text-sm font-medium">
//                             {selectedLead.lead_no}
//                           </p>
//                         </div>
//                         <div className="bg-gray-50 p-4 rounded-lg">
//                           <p className="text-xs text-gray-500 mb-1">
//                             Verification Date
//                           </p>
//                           <p className="text-sm font-medium">
//                             {formatDate(selectedLead.verification_date)}
//                           </p>
//                         </div>
//                         <div className="bg-green-50 p-4 rounded-lg">
//                           <p className="text-xs text-gray-500 mb-1">
//                             Total Incentive
//                           </p>
//                           <p className="text-lg font-bold text-green-600">
//                             {formatCurrency(selectedLead.total_incentive)}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Vehicle Details */}
//                     <div className="border-t border-gray-200 pt-6">
//                       <h6 className="text-base font-medium text-primary-blue mb-3">
//                         Vehicle Details ({selectedLead.vehicles.length})
//                       </h6>

//                       {/* Vehicle Details in Modal */}
//                       {selectedLead.vehicles.map((vehicle, index) => (
//                         <div key={vehicle.id} className="vehicle-detail-row">
//                           <div className="mb-3">
//                             <h6 className="text-sm font-medium text-gray-700 mb-2">
//                               Vehicle {index + 1}
//                             </h6>
//                           </div>
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                             <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1">
//                                 Brand
//                               </label>
//                               <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">
//                                 {vehicle.brand_name || "N/A"}
//                               </div>
//                             </div>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1">
//                                 Variant
//                               </label>
//                               <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">
//                                 {vehicle.variant_name || "N/A"}
//                               </div>
//                             </div>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1">
//                                 Color
//                               </label>
//                               <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">
//                                 {vehicle.color_name || "N/A"}
//                               </div>
//                             </div>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1">
//                                 Quantity
//                               </label>
//                               <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">
//                                 {vehicle.vehicle_qty || 1} units
//                               </div>
//                             </div>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1">
//                                 Commission per Unit
//                               </label>
//                               <div className="text-sm font-medium bg-blue-50 p-3 rounded-lg text-blue-700">
//                                 {formatCurrency(vehicle.commission_per_unit)}
//                               </div>
//                             </div>
//                             <div>
//                               <label className="block text-xs font-medium text-gray-500 mb-1">
//                                 Total Incentive
//                               </label>
//                               <div className="text-lg font-bold text-green-600 bg-green-50 p-3 rounded-lg">
//                                 {formatCurrency(vehicle.total_incentive)}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Invoice Information */}
//                     <div className="border-t border-gray-200 pt-6">
//                       <h6 className="text-base font-medium text-primary-blue mb-3">
//                         Invoice Information
//                       </h6>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Invoice Number:
//                           </label>
//                           <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">
//                             {selectedLead.invoice_no || "N/A"}
//                           </div>
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Invoice Copy:
//                           </label>
//                           <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
//                             {selectedLead.uploaded_invoice ? (
//                               <a
//                                 href={`http://localhost:8000/storage/${selectedLead.uploaded_invoice}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="action-btn download"
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 View
//                               </a>
//                             ) : (
//                               <span className="text-gray-400 text-sm">
//                                 Not uploaded
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Status */}
//                     <div className="border-t border-gray-200 pt-6">
//                       <h6 className="text-base font-medium text-primary-blue mb-3">
//                         Status
//                       </h6>
//                       <div className="p-3 bg-green-50 rounded-lg">
//                         <div className="flex items-center gap-2">
//                           <i className="bi bi-check-circle-fill text-green-500"></i>
//                           <span className="text-sm font-medium text-green-700">
//                             Verified Successfully
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Modal Footer */}
//                 <div className="p-4 border-t border-gray-200 bg-gray-50"></div>
//               </div>
//             </div>
//           )}
//         </div>
//         <Footer />
//       </Container>
//     </>
//   );
// };

// export default CreditNoteDetails;

import React, { useEffect, useState } from "react";
import axios from "axios";
import Container from "../components/Container";
import Footer from "../components/Layout/Footer";
import html2pdf from "html2pdf.js";

const CreditNoteDetails = () => {
  const [creditNotes, setCreditNotes] = useState([]);
  const [groupedNotes, setGroupedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);

  const [generatedLeads, setGeneratedLeads] = useState(() => {
    const saved = localStorage.getItem("generatedCreditNotes");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // New states for selection
  const [selectedNotes, setSelectedNotes] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showCombinedModal, setShowCombinedModal] = useState(false);

  const API_BASE = "http://localhost:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  useEffect(() => {
    const fetchCreditNotes = async () => {
      try {
        const response = await axios.get(`${API_BASE}/credit-notes`, {
          headers: getAuthHeaders(),
        });

        const data = response.data.data || [];
        setCreditNotes(data);

        const grouped = groupByLeadId(data);
        setGroupedNotes(grouped);
      } catch (err) {
        console.error("Error fetching credit notes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditNotes();
  }, []);

  const groupByLeadId = (notes) => {
    const groups = {};

    notes.forEach((note) => {
      const leadId = note.lead_id;
      if (!leadId) return;

      if (!groups[leadId]) {
        groups[leadId] = {
          lead_id: leadId,
          lead_no: note.lead_no || `LAA${String(leadId).padStart(4, "0")}`,
          customer_name: note.customer_name || "N/A",
          vehicles: [],
          total_incentive: 0,
          total_quantity: 0,
          verification_date: note.verified_at,
          invoice_no: note.invoice_no || "N/A",
          uploaded_invoice: note.uploaded_invoice,
        };
      }

      groups[leadId].total_incentive += parseFloat(note.total_incentive) || 0;
      groups[leadId].total_quantity += parseInt(note.vehicle_qty) || 0;

      groups[leadId].vehicles.push({
        ...note,
        commission_per_unit: parseFloat(note.commission_per_unit) || 0,
        vehicle_incentive: parseFloat(note.total_incentive) || 0,
      });

      const newDate = new Date(note.verified_at);
      const currentDate = new Date(groups[leadId].verification_date);
      if (newDate < currentDate) {
        groups[leadId].verification_date = note.verified_at;
      }
    });

    return Object.values(groups);
  };

  const generateInvoice = async (leadId, leadNo) => {
    setGeneratingId(leadId);

    try {
      const response = await axios.get(
        `${API_BASE}/lead-details/lead/${leadId}/generateinvoice`,
        { headers: getAuthHeaders() }
      );

      if (!response.data.success) {
        alert(response.data.message || "Failed to generate Invoice");
        return;
      }

      const htmlContent = response.data.html;

      const opt = {
        margin: 10,
        filename: `CreditNote_${leadNo || leadId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(htmlContent).save();

      const newSet = new Set(generatedLeads);
      newSet.add(leadId);
      setGeneratedLeads(newSet);
      localStorage.setItem(
        "generatedCreditNotes",
        JSON.stringify(Array.from(newSet))
      );
    } catch (err) {
      console.error("Generation failed:", err);
      alert("Failed to generate Invoice. Try again.");
    } finally {
      setGeneratingId(null);
      setShowCombinedModal(false);

      // Mark all selected as generated
      const newSet = new Set(generatedLeads);
      selectedNotes.forEach((id) => newSet.add(id));
      setGeneratedLeads(newSet);
      localStorage.setItem(
        "generatedCreditNotes",
        JSON.stringify(Array.from(newSet))
      );

      // Reset selection
      setSelectedNotes(new Set());
      setSelectAll(false);
    }
  };

  const getButtonText = (leadId) => {
    if (generatingId === leadId) return "Generating...";
    if (generatedLeads.has(leadId)) return "Download Again";
    return "Generate Invoice";
  };

  const openViewModal = (leadGroup) => {
    setSelectedLead(leadGroup);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedLead(null);
  };

  // Selection handlers
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotes(new Set());
    } else {
      setSelectedNotes(new Set(groupedNotes.map((g) => g.lead_id)));
    }
    setSelectAll(!selectAll);
  };

  const handleCheckboxChange = (leadId) => {
    const newSelected = new Set(selectedNotes);
    if (newSelected.has(leadId)) {
      newSelected.delete(leadId);
    } else {
      newSelected.add(leadId);
    }
    setSelectedNotes(newSelected);
    setSelectAll(
      newSelected.size === groupedNotes.length && groupedNotes.length > 0
    );
  };

  const generateCombined = async () => {
    if (selectedNotes.size === 0) {
      alert("Please select at least one credit note");
      return;
    }

    setGeneratingId("combined");

    try {
      const htmlContents = [];
      const leadNos = [];

      // Sab selected leads ke liye individual HTML fetch karo
      for (const leadId of selectedNotes) {
        const response = await axios.get(
          `${API_BASE}/lead-details/lead/${leadId}/generateinvoice`,
          { headers: getAuthHeaders() }
        );

        if (!response.data.success || !response.data.html) {
          throw new Error(`Failed to fetch invoice for Lead ID ${leadId}`);
        }

        htmlContents.push(response.data.html);

        // Lead no ya credit note number collect karo
        const note = groupedNotes.find((g) => g.lead_id === leadId);
        leadNos.push(note?.lead_no || `Lead ${leadId}`);
      }

      // Sab HTML ko combine karo with page breaks
      const combinedHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Combined Credit Notes</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .page-break { page-break-before: always; margin-top: 40px; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 10px; border-bottom: 2px solid #0f66af; }
          .header h1 { color: #0f66af; margin: 0; }
          .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Combined Credit Notes</h1>
          <p>Generated on: ${new Date().toLocaleDateString("en-GB")}</p>
          <p>Credit Notes Included: ${leadNos.join(", ")}</p>
          <p>Total Selected: ${selectedNotes.size}</p>
        </div>

        ${htmlContents
          .map((html, index) =>
            index === 0 ? html : `<div class="page-break">${html}</div>`
          )
          .join("")}

        <div class="footer">
          <p>© QikLeadz. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

      const opt = {
        margin: [10, 10, 15, 10],
        filename: `Combined_CreditNotes_${selectedNotes.size}_items.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      html2pdf().set(opt).from(combinedHtml).save();

      alert(
        `Combined PDF generated successfully with ${selectedNotes.size} credit note(s)!`
      );

      // Reset
      setSelectedNotes(new Set());
      setSelectAll(false);
    } catch (err) {
      console.error("Combined generation failed:", err);
      alert("Failed to generate combined credit note: " + err.message);
    } finally {
      setGeneratingId(null);
      setShowCombinedModal(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
        rel="stylesheet"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        :root { 
          --primary-blue: #0f66af; 
          --hover-blue: #084a8a;
        }
        body { font-family: 'Montserrat', sans-serif; }
        .container-animate { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .credit-note-card { 
          border-left: 4px solid var(--primary-blue); 
        }
        .btn-primary-blue { 
          background-color: var(--primary-blue); 
          color: white; 
          transition: all 0.3s ease; 
        }
        .btn-primary-blue:hover { 
          background-color: var(--hover-blue); 
          transform: scale(1.05); 
        }
        .action-btn { 
          padding: 0.5rem 1rem; 
          border-radius: 0.375rem; 
          color: white; 
          font-size: 0.875rem;
          font-weight: 500;
          transition: background-color 0.2s;
          cursor: pointer;
        }
        .action-btn.download { 
          background-color: var(--primary-blue); 
        }
        .action-btn.download:hover { 
          background-color: var(--hover-blue); 
        }
        .vehicle-detail-row {
          border-bottom: 1px solid #e5e7eb;
          padding: 1rem 0;
        }
        .vehicle-detail-row:last-child {
          border-bottom: none;
        }
        .checkbox-custom {
          width: 18px;
          height: 18px;
          accent-color: var(--primary-blue);
        }
      `,
        }}
      />

      <Container>
        <div className="container-animate mx-auto px-0 md:px-8 xl:px-12">
          <section className="p-4 md:p-6 xl:p-10">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 md:mb-8">
                <h5 className="text-lg md:text-xl font-semibold text-primary-blue">
                  Total Claims
                </h5>
                <p className="text-gray-600 text-sm mt-1">
                  Verified credit notes ready for processing
                </p>
              </div>

              {/* Selection Controls */}
              <div className="flex justify-end mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="checkbox-custom"
                  />
                  <label htmlFor="selectAll" className="text-sm text-gray-700">
                    Select All
                  </label>
                </div>
                <button
                  onClick={() => setShowCombinedModal(true)}
                  className={`btn-primary-blue rounded-lg px-5 py-2 text-sm font-medium transition ${
                    selectedNotes.size === 0 ? "hidden" : ""
                  }`}
                >
                  Generate Invoice for Selected ({selectedNotes.size})
                </button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 mt-4">Loading credit notes...</p>
                </div>
              ) : groupedNotes.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-gray-400 text-5xl mb-4">
                    <i className="bi bi-file-earmark-text"></i>
                  </div>
                  <h4 className="text-gray-600 text-lg font-medium mb-2">
                    No verified credit notes
                  </h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    There are currently no verified credit notes available.
                    Verified notes will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {groupedNotes.map((leadGroup, index) => (
                    <div
                      key={leadGroup.lead_id}
                      className="credit-note-card bg-white p-5 rounded-xl shadow-sm relative"
                    >
                      {/* Checkbox */}
                      <div className="absolute top-4 left-4">
                        <input
                          type="checkbox"
                          checked={selectedNotes.has(leadGroup.lead_id)}
                          disabled={generatedLeads.has(leadGroup.lead_id)}
                          onChange={() =>
                            handleCheckboxChange(leadGroup.lead_id)
                          }
                          className="checkbox-custom"
                        />
                      </div>

                      <div className="flex justify-between items-start mb-4 pl-10">
                        <div>
                          <h6 className="text-base font-semibold text-gray-800 mb-1">
                            Credit Note: CR{String(index + 1).padStart(3, "0")}
                          </h6>
                          <p className="text-sm text-gray-500">
                            Verified on{" "}
                            {formatDate(leadGroup.verification_date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600 mb-2">
                            {formatCurrency(leadGroup.total_incentive)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {leadGroup.vehicles.length} vehicle
                            {leadGroup.vehicles.length > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">Lead No</p>
                          <p className="text-sm font-medium">
                            {leadGroup.lead_no}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Total Vehicles
                          </p>
                          <p className="text-sm font-medium">
                            {leadGroup.total_quantity} units
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-500 mb-1">Invoice No</p>
                          <p className="text-sm font-medium">
                            {leadGroup.invoice_no || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <button
                          onClick={() =>
                            generateInvoice(
                              leadGroup.lead_id,
                              leadGroup.lead_no
                            )
                          }
                          disabled={generatingId === leadGroup.lead_id}
                          className={`action-btn download px-6 py-3 rounded-lg text-sm font-medium ${
                            generatingId === leadGroup.lead_id
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {getButtonText(leadGroup.lead_id)}
                        </button>
                        <button
                          onClick={() => openViewModal(leadGroup)}
                          className="btn-primary-blue rounded-lg px-4 py-2 text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Combined Invoice Modal */}
          {showCombinedModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
              <div className="bg-white rounded-lg max-w-md w-full">
                <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center">
                  <h5 className="font-medium">Generate Combined Invoice</h5>
                  <button
                    onClick={() => setShowCombinedModal(false)}
                    className="text-white text-xl"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-600 mb-4">
                    {selectedNotes.size} credit note(s) selected for combined
                    invoice:
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
                    {groupedNotes
                      .filter((note) => selectedNotes.has(note.lead_id))
                      .map((note) => (
                        <div
                          key={note.lead_id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                        >
                          <i className="bi bi-check-square text-primary-blue"></i>
                          <span className="text-sm">
                            CR
                            {String(
                              groupedNotes.findIndex(
                                (g) => g.lead_id === note.lead_id
                              ) + 1
                            ).padStart(3, "0")}{" "}
                            - {note.lead_no} -{" "}
                            {formatCurrency(note.total_incentive)}
                          </span>
                        </div>
                      ))}
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowCombinedModal(false)}
                      className="px-5 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={generateCombined}
                      disabled={generatingId === "combined"}
                      className="btn-primary-blue rounded-lg px-6 py-2 text-sm font-medium"
                    >
                      {generatingId === "combined"
                        ? "Generating..."
                        : "Generate Combined Invoice"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Existing View Details Modal - unchanged */}
          {showViewModal && selectedLead && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4"
              onClick={closeViewModal}
            >
              <div
                className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-primary-blue text-white p-4 rounded-t-lg flex justify-between items-center">
                  <h5 className="text-base font-medium">
                    Credit Note Details - Lead {selectedLead.lead_no}
                  </h5>
                  <button
                    onClick={closeViewModal}
                    className="text-white hover:text-gray-200 text-lg"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="space-y-6">
                    <div>
                      <h6 className="text-base font-medium text-primary-blue mb-3">
                        Lead Summary
                      </h6>
                      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Lead Number
                          </p>
                          <p className="text-sm font-medium">
                            {selectedLead.lead_no}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Verification Date
                          </p>
                          <p className="text-sm font-medium">
                            {formatDate(selectedLead.verification_date)}
                          </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">
                            Total Incentive
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(selectedLead.total_incentive)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h6 className="text-base font-medium text-primary-blue mb-3">
                        Vehicle Details ({selectedLead.vehicles.length})
                      </h6>

                      {selectedLead.vehicles.map((vehicle, index) => (
                        <div key={vehicle.id} className="vehicle-detail-row">
                          <div className="mb-3">
                            <h6 className="text-sm font-medium text-gray-700 mb-2">
                              Vehicle {index + 1}
                            </h6>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Brand
                              </label>
                              <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">
                                {vehicle.brand_name || "N/A"}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Variant
                              </label>
                              <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">
                                {vehicle.variant_name || "N/A"}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Color
                              </label>
                              <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">
                                {vehicle.color_name || "N/A"}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Quantity
                              </label>
                              <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">
                                {vehicle.vehicle_qty || 1} units
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Commission per Unit
                              </label>
                              <div className="text-sm font-medium bg-blue-50 p-3 rounded-lg text-blue-700">
                                {formatCurrency(vehicle.commission_per_unit)}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-500 mb-1">
                                Total Incentive (This Vehicle)
                              </label>
                              <div className="text-lg font-bold text-green-600 bg-green-50 p-3 rounded-lg">
                                {formatCurrency(vehicle.vehicle_incentive)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h6 className="text-base font-medium text-primary-blue mb-3">
                        Invoice Information
                      </h6>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Number:
                          </label>
                          <div className="text-sm font-medium bg-gray-50 p-3 rounded-lg">
                            {selectedLead.invoice_no || "N/A"}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Invoice Copy:
                          </label>
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            {selectedLead.uploaded_invoice ? (
                              <a
                                href={`http://localhost:8000/storage/${selectedLead.uploaded_invoice}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn download"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                Not uploaded
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h6 className="text-base font-medium text-primary-blue mb-3">
                        Status
                      </h6>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <i className="bi bi-check-circle-fill text-green-500"></i>
                          <span className="text-sm font-medium text-green-700">
                            Verified Successfully
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50"></div>
              </div>
            </div>
          )}
        </div>
        <Footer />
      </Container>
    </>
  );
};

export default CreditNoteDetails;
