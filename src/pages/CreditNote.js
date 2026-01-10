// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import axios from "axios";
// import Container from "../components/Container";
// import Footer from "../components/Layout/Footer";

// const CreditNote = () => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const selectedLeadNo = searchParams.get("lead"); // e.g., LAA0001

//   const [vehicleDetail, setVehicleDetail] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_BASE = "http://localhost:8000/api";

//   const getAuthHeaders = () => ({
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   });

//   useEffect(() => {
//     const fetchVehicleDetail = async () => {
//       if (!selectedLeadNo) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         // Direct lead_details se lead_no se search karo
//         // const response = await axios.get(`${API_BASE}/lead-details`, {
//         //   headers: getAuthHeaders(),
//         //   params: { lead_no: selectedLeadNo },
//         // });
//         const response = await axios.get(
//           `${API_BASE}/lead-details/by-lead-no`,
//           {
//             headers: getAuthHeaders(),
//             params: { lead_no: selectedLeadNo },
//           }
//         );

//         const details = response.data.data || response.data || [];

//         if (details.length === 0) {
//           setError(`No vehicle found for Lead No: ${selectedLeadNo}`);
//         } else {
//           // Pehla match le lo (kyunki lead_no unique hai)
//           setVehicleDetail(details[0]);
//         }
//       } catch (err) {
//         console.error("Error fetching vehicle detail:", err);
//         setError("Failed to load vehicle details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVehicleDetail();
//   }, [selectedLeadNo]);

//   return (
//     <>
//       <link rel="manifest" href="/demo/ecosys/manifest.json" />
//       <meta name="theme-color" content="#0f66af" />
//       <meta charSet="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <title>
//         {selectedLeadNo ? `Credit Note - ${selectedLeadNo}` : "Credit Notes"}
//       </title>
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
//             :root { --primary-blue: #0f66af; }
//             body { font-family: 'Montserrat', sans-serif; overflow-x: hidden; }
//             .container-animate { animation: fadeIn 0.5s ease-in; }
//             @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
//             .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }
//             .status-success { background-color: #d4edda; color: #155724; }
//             .status-pending { background-color: #fff3cd; color: #856404; }
//             .status-failed { background-color: #f8d7da; color: #721c24; }
//             @media (max-width: 640px) { section { padding: 0; } }
//           `,
//         }}
//       />

//       <Container>
//         <div className="container-fluid mx-auto px-0">
//           <div className="container-animate mx-auto px-0">
//             <section>
//               <div className="container mx-auto px-4 py-6 max-w-7xl">
//                 <div className="mb-8">
//                   <h4 className="text-2xl font-bold text-[var(--primary-blue)]">
//                     Vehicle Details
//                     {selectedLeadNo && (
//                       <span className="text-lg font-normal text-gray-600 ml-3">
//                         - Lead No:{" "}
//                         <span className="font-bold">{selectedLeadNo}</span>
//                       </span>
//                     )}
//                   </h4>
//                 </div>

//                 {loading ? (
//                   <div className="text-center py-16">
//                     <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//                     <p className="mt-4 text-gray-600 text-lg">
//                       Loading vehicle details...
//                     </p>
//                   </div>
//                 ) : error ? (
//                   <div className="text-center py-16">
//                     <p className="text-red-600 text-xl">{error}</p>
//                   </div>
//                 ) : !vehicleDetail ? (
//                   <div className="text-center py-16">
//                     <p className="text-gray-500 text-lg">No vehicle selected</p>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 gap-6">
//                     <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
//                       <div className="flex justify-between items-start mb-6">
//                         <h6 className="text-2xl font-bold text-[var(--primary-blue)]">
//                           Lead No: {vehicleDetail.lead_no}
//                         </h6>
//                         <div className="flex items-center gap-4">
//                           <span
//                             className={`status-badge ${
//                               vehicleDetail.verification_status === "successful"
//                                 ? "status-success"
//                                 : vehicleDetail.verification_status ===
//                                   "pending"
//                                 ? "status-pending"
//                                 : "status-failed"
//                             }`}
//                           >
//                             {vehicleDetail.verification_status?.toUpperCase() ||
//                               "PENDING"}
//                           </span>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
//                         <div>
//                           <p className="text-gray-700 mb-4">
//                             <strong>Brand:</strong>{" "}
//                             <span className="font-semibold">
//                               {vehicleDetail.brand?.name || "N/A"}
//                             </span>
//                           </p>
//                           <p className="text-gray-700 mb-4">
//                             <strong>Variant:</strong>{" "}
//                             <span className="font-semibold">
//                               {vehicleDetail.variant?.name || "N/A"}
//                             </span>
//                           </p>
//                           <p className="text-gray-700 mb-4">
//                             <strong>Color:</strong>
//                             <span className="font-semibold ml-2">
//                               {vehicleDetail.color?.name || "N/A"}
//                             </span>
//                             {vehicleDetail.color?.color_code && (
//                               <span
//                                 className="inline-block w-6 h-6 ml-3 border border-gray-400 rounded"
//                                 style={{
//                                   backgroundColor:
//                                     vehicleDetail.color.color_code,
//                                 }}
//                               ></span>
//                             )}
//                           </p>
//                         </div>
//                         <div>
//                           <p className="text-gray-700 mb-4">
//                             <strong>Quantity:</strong>{" "}
//                             <span className="font-semibold">
//                               {vehicleDetail.vehicle_qty || 1}
//                             </span>
//                           </p>
//                           <p className="text-gray-700 mb-4">
//                             <strong>Unit Price:</strong>{" "}
//                             <span className="font-semibold">
//                               ₹
//                               {vehicleDetail.unit_price?.toLocaleString() ||
//                                 "N/A"}
//                             </span>
//                           </p>
//                           <p className="text-gray-700 mb-4">
//                             <strong>Total Price:</strong>{" "}
//                             <span className="font-semibold">
//                               ₹
//                               {vehicleDetail.total_price?.toLocaleString() ||
//                                 "N/A"}
//                             </span>
//                           </p>
//                         </div>
//                       </div>

//                       {vehicleDetail.invoice_no && (
//                         <div className="mt-8 pt-6 border-t-2 border-gray-200">
//                           <p className="text-gray-700 text-lg">
//                             <strong>Invoice No:</strong>
//                             <span className="font-bold text-[var(--primary-blue)] text-xl ml-3">
//                               {vehicleDetail.invoice_no}
//                             </span>
//                           </p>
//                           {vehicleDetail.uploaded_invoice && (
//                             <div className="mt-4">
//                               <a
//                                 href={`http://localhost:8000/storage/${vehicleDetail.uploaded_invoice}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="inline-block bg-[var(--primary-blue)] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
//                               >
//                                 View Invoice
//                               </a>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </section>
//           </div>
//         </div>
//         <Footer />
//       </Container>
//     </>
//   );
// };

// export default CreditNote;

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Container from "../components/Container";
import Footer from "../components/Layout/Footer";

const CreditNote = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedLeadNo = searchParams.get("lead");

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creditNoteIndex, setCreditNoteIndex] = useState(1);

  const API_BASE = "http://localhost:8000/api";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  });

  useEffect(() => {
    if (!selectedLeadNo) {
      setLoading(false);
      return;
    }

    const fetchVehicle = async () => {
      try {
        const response = await axios.get(`${API_BASE}/lead-details`, {
          headers: getAuthHeaders(),
          params: { lead_no: selectedLeadNo },
        });

        const data = response.data.data || [];
        if (data.length > 0) {
          setVehicle(data[0]);

          // If you want to get a dynamic index, you could fetch all credit notes
          // and find the index. For now, we'll use 1 as default.
          setCreditNoteIndex(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [selectedLeadNo]);

  // Format credit note number like "CR001"
  const creditNoteNumber = `CR${String(creditNoteIndex).padStart(3, "0")}`;

  if (!selectedLeadNo) {
    return (
      <div className="container-animate mx-auto px-0 md:px-8 xl:px-12">
        <section className="p-4 md:p-6 xl:p-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-10">
              <p>No Lead Selected</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <link rel="manifest" href="/demo/ecosys/manifest.json" />
      <meta name="theme-color" content="#0f66af" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Credit Note - {selectedLeadNo}</title>
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
          --light-grey: #ced4da;
        }
        body { font-family: 'Montserrat', sans-serif; }
        .container-animate { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .credit-note-card { border-left: 4px solid var(--primary-blue); }
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
          padding: 0.25rem 0.5rem; 
          border-radius: 0.25rem; 
          color: white; 
          text-decoration: none; 
          display: inline-block; 
        }
        .action-btn.download { background-color: #0f66af; }
        .action-btn.download:hover { background-color: #084a8a; }
      `,
        }}
      />

      <Container>
        <div className="container-animate mx-auto px-0 md:px-8 xl:px-12">
          {/* Credit Note Section */}
          <section className="p-4 md:p-6 xl:p-10">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="text-center py-10">
                  <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : !vehicle ? (
                <p className="text-center text-red-600 py-10">
                  Vehicle not found
                </p>
              ) : (
                <div className="credit-note-card bg-white p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      {/* Removed the function call here */}
                      <h6 className="text-base font-semibold text-gray-800 mb-1">
                        Credit Note: {creditNoteNumber}
                      </h6>
                      {/* <p className="text-sm text-gray-500 mb-1">
                        Lead No:{" "}
                        <span className="font-bold">
                          {vehicle.lead_no || "N/A"}
                        </span>
                      </p> */}
                      <p className="text-sm text-gray-500 mb-1">
                        Brand:{" "}
                        <span className="font-bold">
                          {vehicle.brand?.name || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Variant:{" "}
                        <span className="font-bold">
                          {vehicle.variant?.name || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Color:{" "}
                        <span className="font-bold">
                          {vehicle.color?.name || "N/A"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mb-0">
                        No. of Vehicles:{" "}
                        <span className="font-bold">
                          {vehicle.vehicle_qty || 1}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mb-0">
                        Total Incentive:{" "}
                        <span className="font-bold">
                          ${vehicle.total_price || 0}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 mb-0">
                        Status:{" "}
                        <span className="font-bold text-green-600">
                          generated
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Link
                        to="/creditnotedetails"
                        className="btn-primary-blue rounded-lg px-4 py-2 text-sm text-center"
                      >
                        View Details
                      </Link>
                      {/* </a> */}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
        <Footer />
      </Container>
    </>
  );
};

export default CreditNote;
