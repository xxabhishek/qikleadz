// import React, { useState } from "react";
// import LeadInformation from "../pages/LeadGen/LeadInformation";

// const LeadInformation = () => {
//   // Mock data (replace with API calls in a real application)
//   const lead = {
//     id: null, // Set to an ID if editing an existing lead
//     customer_name: "",
//     phone_no: "",
//     location: "",
//     tentative_purchase_date: "",
//     vehicle_qty: 1,
//     payment_mode: "cash",
//     oem_id: "",
//     additional_note: "",
//   };
//   const oems = [
//     { id: 1, name: "OEM 1" },
//     { id: 2, name: "OEM 2" },
//   ];
//   const existingVehicles = [
//     // { brand: { name: 'Brand 1' }, variant: { name: 'Variant 1' }, color: { name: 'Red' } }
//   ];
//   const data = {
//     vehicle_segment_id: "",
//     brand_id: "",
//     variant_id: "",
//     fuel_type_id: "",
//     color: "",
//     color_id: "",
//   };
//   const errors = []; // Replace with actual error handling from API

//   // State for form data
//   const [formData, setFormData] = useState({
//     customer_name: lead.customer_name,
//     phone_no: lead.phone_no,
//     location: lead.location,
//     tentative_purchase_date: lead.tentative_purchase_date,
//     vehicle_qty: lead.vehicle_qty,
//     payment_mode: lead.payment_mode,
//     oem: lead.oem_id,
//     additional_note: lead.additional_note,
//     vehicle_segment_id: data.vehicle_segment_id,
//     brand_id: data.brand_id,
//     variant_id: data.variant_id,
//     fuel_type_id: data.fuel_type_id,
//     color: data.color,
//     color_id: data.color_id,
//     lead_id: lead.id,
//     action: "",
//   });

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle form submission
//   const handleSubmit = async (action) => {
//     setFormData({ ...formData, action });
//     const form = new FormData();
//     for (const key in formData) {
//       form.append(key, formData[key]);
//     }
//     form.append("_token", "CSRF_TOKEN_HERE"); // Replace with actual CSRF token
//     form.append("action", action);

//     try {
//       // Replace with actual API call to Laravel backend
//       // const response = await fetch('/lead/store', { method: 'POST', body: form });
//       console.log("Submitting form with action:", action, formData);
//       // Handle response as needed
//     } catch (error) {
//       console.error("Submission error:", error);
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <header className="bg-white shadow-sm mb-4">
//         <div className="container mx-auto">
//           <div className="flex justify-between items-center py-2 px-3">
//             <div className="flex items-center">
//               <img
//                 src="/Frontend/assets/images/logo-icon.png"
//                 alt="logo"
//                 className="mr-2 h-10"
//               />
//               <h2 className="text-xl font-semibold">QikLeadz 2025</h2>
//             </div>
//             <div className="relative">
//               <div
//                 className="flex items-center cursor-pointer"
//                 onClick={() =>
//                   document.getElementById("dropdown").classList.toggle("hidden")
//                 }
//               >
//                 <img
//                   src="/Frontend/assets/images/avatars/avatar-2.png"
//                   alt="user avatar"
//                   className="rounded-full mr-2 w-9 h-9"
//                 />
//                 <span>{"Username".substring(0, 12)}</span>
//               </div>
//               <div
//                 id="dropdown"
//                 className="hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
//               >
//                 <a
//                   href="/logout"
//                   className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 >
//                   <i className="bi bi-box-arrow-right mr-2"></i> Logout
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Container */}
//       <div className="container mx-auto">
//         <div className="bg-white shadow-sm mb-4 border-0 rounded-lg">
//           <div className="bg-blue-600 text-white p-4 rounded-t-lg">
//             <h5 className="mb-0">
//               <i className="bi bi-list"></i> Lead Generation
//             </h5>
//           </div>
//           <div className="p-4">
//             {/* Progress Indicator */}
//             <div className="flex justify-between mb-2 progress-step">
//               <span>Model Selection</span>
//               <span>Model Details</span>
//               <span>Lead Information</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
//               <div
//                 className="bg-blue-600 h-1.5 rounded-full"
//                 style={{ width: "100%" }}
//               ></div>
//             </div>

//             {/* Lead Form */}
//             <div className="bg-white shadow-sm rounded-lg">
//               <div className="bg-blue-600 text-white p-4 rounded-t-lg">
//                 <h5 className="mb-0">New Lead Information</h5>
//               </div>
//               <div className="p-4">
//                 {errors.length > 0 && (
//                   <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                     <ul>
//                       {errors.map((error, index) => (
//                         <li key={index}>{error}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 )}

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                   {/* Customer Name */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Customer Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="customer_name"
//                       className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       placeholder="Enter customer name"
//                       value={formData.customer_name}
//                       onChange={handleChange}
//                       required
//                       disabled={lead.id}
//                     />
//                     {lead.id && (
//                       <input
//                         type="hidden"
//                         name="customer_name"
//                         value={formData.customer_name}
//                       />
//                     )}
//                   </div>

//                   {/* Phone */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Phone Number <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="tel"
//                       name="phone_no"
//                       className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       placeholder="Enter phone number"
//                       value={formData.phone_no}
//                       onChange={handleChange}
//                       required
//                       disabled={lead.id}
//                     />
//                     {lead.id && (
//                       <input
//                         type="hidden"
//                         name="phone_no"
//                         value={formData.phone_no}
//                       />
//                     )}
//                   </div>

//                   {/* Location */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Location <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       name="location"
//                       className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       placeholder="Enter location"
//                       value={formData.location}
//                       onChange={handleChange}
//                       required
//                       disabled={lead.id}
//                     />
//                     {lead.id && (
//                       <input
//                         type="hidden"
//                         name="location"
//                         value={formData.location}
//                       />
//                     )}
//                   </div>

//                   {/* Tentative Purchase Date */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Tentative Purchase Date
//                     </label>
//                     <input
//                       type="date"
//                       name="tentative_purchase_date"
//                       className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       value={formData.tentative_purchase_date}
//                       onChange={handleChange}
//                       required
//                       disabled={lead.id}
//                     />
//                     {lead.id && (
//                       <input
//                         type="hidden"
//                         name="tentative_purchase_date"
//                         value={formData.tentative_purchase_date}
//                       />
//                     )}
//                   </div>

//                   {/* Quantity */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Quantity
//                     </label>
//                     <input
//                       type="number"
//                       name="vehicle_qty"
//                       className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       min="1"
//                       value={formData.vehicle_qty}
//                       onChange={handleChange}
//                       required
//                       disabled={lead.id}
//                     />
//                     {lead.id && (
//                       <input
//                         type="hidden"
//                         name="vehicle_qty"
//                         value={formData.vehicle_qty}
//                       />
//                     )}
//                   </div>

//                   {/* Payment Mode */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       Payment Mode
//                     </label>
//                     <div className="mt-1 flex space-x-4">
//                       <label className="inline-flex items-center">
//                         <input
//                           type="radio"
//                           name="payment_mode"
//                           value="cash"
//                           checked={formData.payment_mode === "cash"}
//                           onChange={handleChange}
//                           className="form-radio h-4 w-4 text-blue-600"
//                           disabled={lead.id}
//                         />
//                         <span className="ml-2 text-sm">Cash</span>
//                       </label>
//                       <label className="inline-flex items-center">
//                         <input
//                           type="radio"
//                           name="payment_mode"
//                           value="finance"
//                           checked={formData.payment_mode === "finance"}
//                           onChange={handleChange}
//                           className="form-radio h-4 w-4 text-blue-600"
//                           disabled={lead.id}
//                         />
//                         <span className="ml-2 text-sm">Finance</span>
//                       </label>
//                     </div>
//                     {lead.id && (
//                       <input
//                         type="hidden"
//                         name="payment_mode"
//                         value={formData.payment_mode}
//                       />
//                     )}
//                   </div>

//                   {/* OEM */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">
//                       OEM
//                     </label>
//                     <select
//                       name="oem"
//                       className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       value={formData.oem}
//                       onChange={handleChange}
//                       disabled={lead.id}
//                     >
//                       <option value="">Select OEM</option>
//                       {oems.map((oem) => (
//                         <option key={oem.id} value={oem.id}>
//                           {oem.name}
//                         </option>
//                       ))}
//                     </select>
//                     {lead.id && (
//                       <input type="hidden" name="oem" value={formData.oem} />
//                     )}
//                   </div>

//                   {/* Additional Notes */}
//                   <div className="col-span-1 md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Additional Notes
//                     </label>
//                     <textarea
//                       name="additional_note"
//                       className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                       rows="3"
//                       placeholder="Enter any additional notes"
//                       value={formData.additional_note}
//                       onChange={handleChange}
//                       disabled={lead.id}
//                     ></textarea>
//                     {lead.id && (
//                       <input
//                         type="hidden"
//                         name="additional_note"
//                         value={formData.additional_note}
//                       />
//                     )}
//                   </div>

//                   {/* Existing Vehicles */}
//                   {existingVehicles.length > 0 && (
//                     <div className="col-span-1 md:col-span-2">
//                       <div className="border border-blue-300 rounded-lg mb-4">
//                         <div className="bg-blue-100 text-blue-800 p-3 rounded-t-lg">
//                           <h6 className="mb-0">
//                             Existing Vehicles for this Lead
//                           </h6>
//                         </div>
//                         <div className="p-3">
//                           <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//                             {existingVehicles.map((vehicle, index) => (
//                               <div key={index} className="border p-2 rounded">
//                                 <strong>Brand:</strong>{" "}
//                                 {vehicle.brand?.name ?? "-"}
//                                 <br />
//                                 <strong>Variant:</strong>{" "}
//                                 {vehicle.variant?.name ?? "-"}
//                                 <br />
//                                 <strong>Color:</strong>{" "}
//                                 {vehicle.color?.name ?? "-"}
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   )}

//                   {/* Hidden Fields */}
//                   <input
//                     type="hidden"
//                     name="vehicle_segment_id"
//                     value={formData.vehicle_segment_id}
//                   />
//                   <input
//                     type="hidden"
//                     name="brand_id"
//                     value={formData.brand_id}
//                   />
//                   <input
//                     type="hidden"
//                     name="variant_id"
//                     value={formData.variant_id}
//                   />
//                   <input
//                     type="hidden"
//                     name="fuel_type_id"
//                     value={formData.fuel_type_id}
//                   />
//                   <input type="hidden" name="color" value={formData.color} />
//                   <input
//                     type="hidden"
//                     name="color_id"
//                     value={formData.color_id}
//                   />
//                   {lead.id && (
//                     <input
//                       type="hidden"
//                       name="lead_id"
//                       value={formData.lead_id}
//                     />
//                   )}

//                   {/* Buttons */}
//                   <div className="col-span-1 md:col-span-2 flex flex-wrap gap-2 mt-3">
//                     <button
//                       type="button"
//                       className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
//                       onClick={() => handleSubmit("save_draft")}
//                     >
//                       Save Draft
//                     </button>
//                     <button
//                       type="button"
//                       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                       onClick={() => handleSubmit("add_vehicle")}
//                     >
//                       Add Another Vehicle
//                     </button>
//                     <button
//                       type="button"
//                       className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                       onClick={() => handleSubmit("submit_lead")}
//                     >
//                       Submit Lead
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeadInformation;
