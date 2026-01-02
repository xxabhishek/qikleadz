// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import Container from "../components/Container";
// import Footer from "../components/Layout/Footer";
// // Remove unused skeleton imports
// // import {
// //   Skeleton,
// //   SkeletonCard,
// //   SkeletonBrandCard,
// //   SkeletonCarousel,
// // } from "../components/SkeletonLoader";

// const API_BASE = "http://localhost:8000/api";

// const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.warn("No token found");
//       return {};
//     }
//     return {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     };
//   };

// const fetchClaimsCounts = async () => {
//   try {
//     setLoading(true);
//     const response = await axios.get(`${API_BASE}/claims/all-counts`, {
//       headers: getAuthHeaders(),
//     });

//     if (response.data.success) {
//       setClaims(response.data.data);
//     }
//   } catch (error) {
//     console.error("Error fetching claims counts:", error);
//     // Optional: toast.error("Failed to load claims data");
//   } finally {
//     setLoading(false);
//   }
// };

// const VehicleImage = ({ vehicle, brandName, variantName, brandId }) => {
//   const [imgSrc, setImgSrc] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   const getFirstPhoto = (coverPhotos) => {
//     if (!coverPhotos) return null;
//     try {
//       if (typeof coverPhotos === "string" && coverPhotos.startsWith("[")) {
//         const parsed = JSON.parse(coverPhotos);
//         if (Array.isArray(parsed) && parsed.length > 0) {
//           return parsed[0].replace(/[\[\]"\']/g, "").trim();
//         }
//       } else if (Array.isArray(coverPhotos) && coverPhotos.length > 0) {
//         return coverPhotos[0];
//       }
//     } catch (e) {
//       console.error("Error parsing cover_photos:", e);
//     }
//     return null;
//   };

//   const getImageUrl = () => {
//     if (vehicle?.first_image) return vehicle.first_image;
//     if (vehicle?.cover_photo_urls?.length) return vehicle.cover_photo_urls[0];
//     if (vehicle?.image_base_url && vehicle?.cover_photos) {
//       const firstPhoto = getFirstPhoto(vehicle.cover_photos);
//       if (firstPhoto) return `${vehicle.image_base_url}${firstPhoto}`;
//     }
//     if (vehicle?.cover_photos) {
//       const firstPhoto = getFirstPhoto(vehicle.cover_photos);
//       if (firstPhoto)
//         return `http://localhost:8000/storage/galleries/${firstPhoto}`;
//     }
//     return getDefaultBrandImage(brandName);
//   };

//   const getDefaultBrandImage = (brand) => {
//     const brandImages = {
//       Platina: "https://via.placeholder.com/160x120/4CAF50/FFFFFF?text=Platina",
//       Chetak: "https://via.placeholder.com/160x120/2196F3/FFFFFF?text=Chetak",
//       Avenger: "https://via.placeholder.com/160x120/FF9800/FFFFFF?text=Avenger",
//       Dominar: "https://via.placeholder.com/160x120/9C27B0/FFFFFF?text=Dominar",
//       Pulsar: "https://via.placeholder.com/160x120/F44336/FFFFFF?text=Pulsar",
//     };
//     return (
//       brandImages[brand] ||
//       "https://via.placeholder.com/160x120/CCCCCC/333333?text=Vehicle"
//     );
//   };

//   useEffect(() => {
//     if (vehicle) {
//       const url = getImageUrl();
//       setImgSrc(url);
//       setLoading(true);
//       setError(false);
//     }
//   }, [vehicle, brandName]);

//   const handleError = (e) => {
//     setError(true);
//     setLoading(false);
//     const fallbackImage = `/assets/images/brands/${brandName.toLowerCase()}.webp`;
//     if (e.target.src !== fallbackImage) {
//       e.target.src = fallbackImage;
//     } else {
//       e.target.src = getDefaultBrandImage(brandName);
//     }
//   };

//   const handleLoad = () => setLoading(false);

//   return (
//     <div className="relative w-full h-full">
//       {loading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//           <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}
//       {error && (
//         <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
//           !
//         </div>
//       )}
//       <img
//         src={imgSrc}
//         alt={brandName || variantName || "Vehicle"}
//         className={`w-full h-full object-contain p-1 transition-opacity duration-300 ${
//           loading ? "opacity-0" : "opacity-100"
//         }`}
//         onError={handleError}
//         onLoad={handleLoad}
//         loading="lazy"
//       />
//     </div>
//   );
// };

// // Loader Component
// function Loader() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
//       <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
//       <span className="text-gray-600 font-medium">Loading...</span>
//     </div>
//   );
// }

// // ErrorMessage Component
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

// export default function Dashboard() {
//   // State में claims counts add करें
//   const [leadStats, setLeadStats] = useState({
//     drafts: 0,
//     open: 0,
//     converted: 0,
//     unrealized: 0,
//     convertedToday: 0,
//     totalClaims: 0,
//     approvedClaims: 0,
//     disputedClaims: 0,
//     rejectedClaims: 0,
//   });
//   const [claims, setClaims] = useState({
//     total: 0,
//     successful: 0,
//     disputed: 0,
//     rejected: 0,
//   });

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         console.log("🔄 Fetching dashboard data...");

//         const [
//           draftRes,
//           openRes,
//           convertedRes,
//           unrealizedRes,
//           convertedTodayRes,
//           totalClaimsRes,
//           approvedClaimsRes,
//           disputedClaimsRes,
//           rejectedClaimsRes,
//           galleriesRes,
//           brandsRes,
//         ] = await Promise.all([
//           axios.get("http://localhost:8000/api/lead-details/draft"),
//           axios.get("http://localhost:8000/api/lead-details/open"),
//           axios.get("http://localhost:8000/api/lead-details/converted"),
//           axios.get("http://localhost:8000/api/lead-details/unrealized"),
//           axios.get("http://localhost:8000/api/lead-details/converted-today"),
//           // New claims APIs
//           axios.get("http://localhost:8000/api/claims/total"),
//           axios.get("http://localhost:8000/api/claims/successful"),
//           axios.get("http://localhost:8000/api/claims/disputed"),
//           axios.get("http://localhost:8000/api/claims/rejected"),
//           // Existing APIs
//           axios.get("http://localhost:8000/api/galleries"),
//           axios.get("http://localhost:8000/api/brands"),
//         ]);

//         console.log("✅ Claims API Responses:");
//         console.log("Total Claims:", totalClaimsRes.data);
//         console.log("Approved Claims:", approvedClaimsRes.data);
//         console.log("Disputed Claims:", disputedClaimsRes.data);
//         console.log("Rejected Claims:", rejectedClaimsRes.data);

//         // Set all stats
//         setLeadStats({
//           // Existing stats
//           drafts: draftRes.data.count || draftRes.data.data?.length || 0,
//           open: openRes.data.data || 0,
//           converted:
//             convertedRes.data.count || convertedRes.data.data?.length || 0,
//           unrealized:
//             unrealizedRes.data.count || unrealizedRes.data.data?.length || 0,
//           convertedToday: convertedTodayRes.data.count || 0,

//           // New claims stats
//           totalClaims:
//             totalClaimsRes.data.data || totalClaimsRes.data.count || 0,
//           approvedClaims:
//             approvedClaimsRes.data.data || approvedClaimsRes.data.count || 0,
//           disputedClaims:
//             disputedClaimsRes.data.data || disputedClaimsRes.data.count || 0,
//           rejectedClaims:
//             rejectedClaimsRes.data.data || rejectedClaimsRes.data.count || 0,
//         });
//       } catch (err) {
//         console.error("❌ Dashboard fetch error:", err);
//         setError("Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDashboard();
//   }, []);
//   const [galleries, setGalleries] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const carouselItems = [
//     { src: "assets/images/banner/4.webp", alt: "Pulsar 200" },
//     { src: "assets/images/banner/1.webp", alt: "Dominar 250" },
//     { src: "assets/images/banner/2.webp", alt: "Avenger 220 Cruise" },
//     { src: "assets/images/banner/3.webp", alt: "Pulsar 125" },
//   ];

//   const fetchDashboard = async () => {
//     try {
//       console.log("🔄 Fetching dashboard data...");

//       const [
//         draftRes,
//         openRes,
//         convertedRes,
//         unrealizedRes,
//         convertedTodayRes,
//         galleriesRes,
//         brandsRes,
//       ] = await Promise.all([
//         axios.get("http://localhost:8000/api/lead-details/draft"),
//         axios.get("http://localhost:8000/api/lead-details/open"),
//         axios.get("http://localhost:8000/api/lead-details/converted"),
//         axios.get("http://localhost:8000/api/lead-details/unrealized"),
//         axios.get("http://localhost:8000/api/lead-details/converted-today"),
//         axios.get("http://localhost:8000/api/galleries"),
//         axios.get("http://localhost:8000/api/brands"),
//       ]);

//       console.log("✅ API Responses Structure:");
//       console.log("Open response:", openRes.data);
//       console.log("Open data value:", openRes.data.data);
//       console.log("Open data type:", typeof openRes.data.data);

//       setLeadStats({
//         drafts: draftRes.data.count || draftRes.data.data?.length || 0,

//         open: openRes.data.data || 0,

//         converted:
//           convertedRes.data.count || convertedRes.data.data?.length || 0,

//         unrealized:
//           unrealizedRes.data.count || unrealizedRes.data.data?.length || 0,

//         convertedToday: convertedTodayRes.data.count || 0,
//       });

//       console.log("✅ Final leadStats:", {
//         drafts: draftRes.data.count || draftRes.data.data?.length || 0,
//         open: openRes.data.data || 0,
//         converted:
//           convertedRes.data.count || convertedRes.data.data?.length || 0,
//         unrealized:
//           unrealizedRes.data.count || unrealizedRes.data.data?.length || 0,
//       });

//       let galleriesData =
//         galleriesRes.data.data ||
//         galleriesRes.data.galleries ||
//         galleriesRes.data ||
//         [];
//       let brandsData = brandsRes.data.data || brandsRes.data || [];

//       setGalleries(galleriesData);
//       setBrands(brandsData);
//     } catch (err) {
//       console.error("❌ Dashboard fetch error:", err);
//       setError("Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboard();
//   }, []);

//   const getBrandWiseVehicles = () => {
//     const brandMap = new Map();
//     galleries.forEach((gallery) => {
//       const brandId = gallery.brand_id;
//       if (!brandId) return;
//       const brandName =
//         getBrandNameFromBrands(brandId) || getBrandName(gallery);
//       if (!brandMap.has(brandId)) {
//         brandMap.set(brandId, {
//           brandId,
//           brandName,
//           vehicle: gallery,
//           vehicleCount: 0,
//         });
//       }
//       brandMap.get(brandId).vehicleCount += 1;
//     });
//     return Array.from(brandMap.values());
//   };

//   const getBrandNameFromBrands = (brandId) =>
//     brands.find((b) => b.id === brandId)?.name;
//   const getBrandName = (gallery) =>
//     gallery.brand_name || gallery.brand?.name || "Unknown Brand";

//   const toggleDrawer = () => setDrawerOpen(!drawerOpen);
//   const closeDrawer = () => setDrawerOpen(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prev) =>
//         prev < carouselItems.length - 1 ? prev + 1 : 0
//       );
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const prevSlide = () =>
//     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : carouselItems.length - 1));
//   const nextSlide = () =>
//     setCurrentIndex((prev) => (prev < carouselItems.length - 1 ? prev + 1 : 0));

//   const getVariantName = (variant) =>
//     variant.name ||
//     variant.variant_name ||
//     variant.model_name ||
//     variant.title ||
//     `Variant ${variant.id || ""}`;

//   const brandWiseVehicles = getBrandWiseVehicles();

//   // Show Loader
//   if (loading) {
//     return <Loader />;
//   }

//   // Show Error Message
//   if (error) {
//     return (
//       <ErrorMessage
//         message={error}
//         onRetry={() => {
//           setLoading(true);
//           setError(null);
//           fetchDashboard();
//         }}
//       />
//     );
//   }

//   return (
//     <Container>
//       <div className="bg-gray-100 font-sans text-sm min-h-screen">
//         {/* Drawer Menu */}
//         <div
//           className={`fixed top-0 -left-64 w-64 h-full bg-white shadow-lg transition-all duration-300 z-[1000] pt-20 ${
//             drawerOpen ? "left-0" : "-left-64"
//           }`}
//           id="drawerMenu"
//         >
//           <img
//             src="assets/images/logo/bajaj-icon1.svg"
//             alt="Bajaj Logo"
//             className="absolute top-2.5 left-2.5 h-[50px]"
//           />
//           <button
//             className="absolute top-2.5 right-2.5 text-2xl bg-transparent border-none text-red-600 cursor-pointer z-[1002]"
//             onClick={closeDrawer}
//           >
//             <i className="bi bi-x"></i>
//           </button>
//           <ul className="list-none p-0 m-0">
//             <li className="p-2.5 px-5">
//               <Link
//                 to="#"
//                 className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
//               >
//                 <i className="bi bi-house-door-fill mr-2.5"></i> Home
//               </Link>
//             </li>
//             <li className="p-2.5 px-5">
//               <Link
//                 to="#"
//                 className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
//               >
//                 <i className="bi bi-people-fill mr-2.5"></i> Leads
//               </Link>
//             </li>
//             <li className="p-2.5 px-5">
//               <Link
//                 to="#"
//                 className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
//               >
//                 <i className="bi bi-bar-chart-fill mr-2.5"></i> Reports
//               </Link>
//             </li>
//             <li className="p-2.5 px-5">
//               <Link
//                 to="#"
//                 className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
//               >
//                 <i className="bi bi-gear-fill mr-2.5"></i> Settings
//               </Link>
//             </li>
//             <li className="p-2.5 px-5">
//               <Link
//                 to="#"
//                 className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
//               >
//                 <i className="bi bi-box-arrow-right mr-2.5"></i> Logout
//               </Link>
//             </li>
//           </ul>
//         </div>
//         {/* Carousel Section */}
//         <section className="p-2 md:p-6 xl:p-10">
//           <div className="carousel-container rounded-lg shadow-sm overflow-hidden relative">
//             <div
//               className="carousel-track flex transition-transform duration-600 ease-in-out"
//               style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//             >
//               {carouselItems.map((item, index) => (
//                 <div
//                   key={index}
//                   className="carousel-item flex-shrink-0 w-full relative"
//                 >
//                   <img
//                     src={item.src}
//                     alt={item.alt}
//                     className="w-full h-48 md:h-64 object-cover rounded-lg"
//                   />
//                   <button className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-[var(--primary-blue)] text-white px-2.5 py-1.5 text-xs rounded-lg hover:bg-[#084a8a]">
//                     Explore
//                   </button>
//                 </div>
//               ))}
//             </div>

//             {/* Previous button - positioned on left side of image */}
//             <button
//               className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
//               onClick={prevSlide}
//             >
//               <i className="bi bi-chevron-left text-lg"></i>
//             </button>

//             {/* Next button - positioned on right side of image */}
//             <button
//               className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10"
//               onClick={nextSlide}
//             >
//               <i className="bi bi-chevron-right text-lg"></i>
//             </button>
//           </div>
//         </section>
//         {/* Overview Section */}
//         <section className="p-4 md:p-6 xl:p-8 py-2">
//           <div className="bg-[#cae4fe] p-4 md:p-6 rounded-lg shadow-sm">
//             <h5 className="mb-4 text-[var(--primary-blue)] text-lg font-semibold">
//               Overview
//             </h5>
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//               <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center">
//                 <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
//                   <i className="bi bi-currency-dollar text-green-500 text-xl"></i>
//                 </div>
//                 <h6 className="text-gray-500 text-xs mb-1 font-medium">
//                   Earnings
//                 </h6>
//                 <h3 className="text-[var(--primary-blue)] text-xl font-bold">
//                   $0
//                 </h3>
//                 <p className="text-green-500 text-xs mt-1 font-medium">
//                   0+ today
//                 </p>
//               </div>
//               <div className="bg-white rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center text-center group">
//                 <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2 group-hover:bg-orange-100 transition-colors">
//                   <i className="bi bi-car-front-fill text-orange-500 text-xl"></i>
//                 </div>
//                 <h6 className="text-gray-500 text-xs mb-1 font-medium">
//                   Vehicles Sold
//                 </h6>
//                 <h3 className="text-[var(--primary-blue)] text-xl font-bold">
//                   {leadStats.converted}
//                 </h3>
//                 <p className="text-green-600 text-xs mt-2 font-medium">
//                   + {leadStats.convertedToday} today
//                 </p>
//               </div>
//               <Link to="#" className="no-underline">
//                 <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer">
//                   <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
//                     <i className="bi bi-file-earmark-text text-blue-500 text-xl"></i>
//                   </div>
//                   <h6 className="text-gray-500 text-xs mb-1 font-medium">
//                     Credit Notes
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl font-bold">
//                     0
//                   </h3>
//                 </div>
//               </Link>
//               <Link to="/#" className="no-underline">
//                 <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer">
//                   <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-2">
//                     <i className="bi bi-receipt text-purple-500 text-xl"></i>
//                   </div>
//                   <h6 className="text-gray-500 text-xs mb-1 font-medium">
//                     Invoices
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl font-bold">
//                     0
//                   </h3>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </section>
//         {/* Leads Section */}
//         <section className="p-2 md:p-6 xl:p-10">
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <h5 className="mb-3 text-[var(--primary-blue)] text-lg">Leads</h5>
//             <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
//               <Link to="/leads/draft" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-pencil-square text-gray-600 text-base"></i>{" "}
//                     Drafts
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                     {leadStats.drafts}
//                   </h3>
//                 </div>
//               </Link>
//               <Link to="/leads/open" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-hourglass-split text-orange-500 text-base"></i>{" "}
//                     Open
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                     {leadStats.open}
//                   </h3>
//                 </div>
//               </Link>
//               <Link to="/leads/converted" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-emoji-smile text-green-500 text-base"></i>{" "}
//                     Converted
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                     {leadStats.converted}
//                   </h3>
//                 </div>
//               </Link>
//               <Link to="/leads/unrealized" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-emoji-frown text-red-500 text-base"></i>{" "}
//                     Unrealized
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                     {leadStats.unrealized}
//                   </h3>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </section>
//         {/* Claim Section */}
//         <section className="p-2 md:p-6 xl:p-10">
//           <div className="bg-white p-4 rounded-lg shadow-sm">
//             <h5 className="mb-3 text-[var(--primary-blue)] text-lg">
//               Claim | Amount
//             </h5>
//             <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
//               {/* Total Claims */}
//               <Link to="/total-claim" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-clipboard-data text-primary-blue text-base"></i>{" "}
//                     Total
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                     {loading ? "..." : claims.total}
//                   </h3>
//                 </div>
//               </Link>

//               {/* Approved Claims */}
//               <Link to="/successful-claim" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-check-circle text-green-500 text-base"></i>{" "}
//                     Approved
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                     {loading ? "..." : claims.successful}
//                   </h3>
//                 </div>
//               </Link>

//               {/* Disputed Claims */}
//               <Link to="/disputed-claim" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-exclamation-triangle text-orange-500 text-base"></i>{" "}
//                     Disputed
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                     {loading ? "..." : claims.disputed}
//                   </h3>
//                 </div>
//               </Link>

//               {/* Rejected Claims */}
//               <Link to="/rejected-claim" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-x-circle text-red-500 text-base"></i>{" "}
//                     Rejected
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                     {loading ? "..." : claims.rejected}
//                   </h3>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </section>
//         {/* Recent Activity Section */}
//         <section className="p-2 md:p-6 xl:p-8">
//           <div className="bg-white rounded-lg p-6 shadow-sm">
//             <h5 className="mb-4 text-[var(--primary-blue)] text-lg font-semibold">
//               Recent Activity
//             </h5>
//             <div className="space-y-4">
//               <Link to="/credit" className="no-underline block">
//                 <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md transition-all cursor-pointer group">
//                   <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-200">
//                     <i className="bi bi-currency-dollar text-green-500 text-sm"></i>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)]">
//                       New credit note generated
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//               <Link to="/vehicle" className="no-underline block">
//                 <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md transition-all cursor-pointer group">
//                   <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200">
//                     <i className="bi bi-car-front-fill text-blue-500 text-sm"></i>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)]">
//                       Vehicle sold
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//               <Link to="/invoice" className="no-underline block">
//                 <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md transition-all cursor-pointer group">
//                   <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200">
//                     <i className="bi bi-receipt text-purple-500 text-sm"></i>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)]">
//                       Invoice submitted
//                     </p>
//                   </div>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </section>
//         {/* Brand-wise Vehicle Models */}
//         <section className="p-3 md:p-6 xl:p-10">
//           <h5 className="mb-3 text-[var(--primary-blue)] text-lg">
//             Brands{" "}
//             {brandWiseVehicles.length > 0 && `(${brandWiseVehicles.length})`}
//           </h5>

//           {brandWiseVehicles.length === 0 && (
//             <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
//               <i className="bi bi-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
//               <p className="text-yellow-700 font-medium">
//                 No vehicle brands found
//               </p>
//               <button
//                 onClick={() => {
//                   setLoading(true);
//                   setError(null);
//                   fetchDashboard();
//                 }}
//                 className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm"
//               >
//                 Reload Page
//               </button>
//             </div>
//           )}

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//             {brandWiseVehicles.map((brandData, idx) => {
//               const { brandId, brandName, vehicle, vehicleCount } = brandData;
//               const variantName = getVariantName(vehicle);

//               return (
//                 <div
//                   key={brandId || idx}
//                   className="bg-white text-center rounded-lg p-4 hover:shadow-md transition-all duration-300 relative border border-gray-200 group cursor-pointer"
//                   onClick={() => navigate("/leads/generate")}
//                 >
//                   {vehicleCount > 1 && (
//                     <span className="absolute top-2.5 right-2.5 text-gray-500 text-[0.65rem] bg-blue-50 rounded-full px-2 py-1 group-hover:bg-blue-100">
//                       +{vehicleCount - 1} more
//                     </span>
//                   )}

//                   <div className="mb-3 h-32 flex items-center justify-center bg-white rounded-lg overflow-hidden border border-gray-200">
//                     <VehicleImage
//                       vehicle={vehicle}
//                       brandName={brandName}
//                       variantName={variantName}
//                       brandId={brandId}
//                     />
//                   </div>

//                   <h6 className="text-sm mb-1 font-semibold text-gray-800 group-hover:text-[var(--primary-blue)] transition-colors line-clamp-2">
//                     {brandName}
//                   </h6>
//                 </div>
//               );
//             })}
//           </div>
//         </section>
//       </div>
//       <Footer />
//     </Container>
//   );
// }





import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Container";
import Footer from "../components/Layout/Footer";

const API_BASE = "http://localhost:8000/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found");
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

const VehicleImage = ({ vehicle, brandName, variantName, brandId }) => {
  const [imgSrc, setImgSrc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getFirstPhoto = (coverPhotos) => {
    if (!coverPhotos) return null;
    try {
      if (typeof coverPhotos === "string" && coverPhotos.startsWith("[")) {
        const parsed = JSON.parse(coverPhotos);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0].replace(/[\[\]"\']/g, "").trim();
        }
      } else if (Array.isArray(coverPhotos) && coverPhotos.length > 0) {
        return coverPhotos[0];
      }
    } catch (e) {
      console.error("Error parsing cover_photos:", e);
    }
    return null;
  };

  const getImageUrl = () => {
    if (vehicle?.first_image) return vehicle.first_image;
    if (vehicle?.cover_photo_urls?.length) return vehicle.cover_photo_urls[0];
    if (vehicle?.image_base_url && vehicle?.cover_photos) {
      const firstPhoto = getFirstPhoto(vehicle.cover_photos);
      if (firstPhoto) return `${vehicle.image_base_url}${firstPhoto}`;
    }
    if (vehicle?.cover_photos) {
      const firstPhoto = getFirstPhoto(vehicle.cover_photos);
      if (firstPhoto)
        return `http://localhost:8000/storage/galleries/${firstPhoto}`;
    }
    return getDefaultBrandImage(brandName);
  };

  const getDefaultBrandImage = (brand) => {
    const brandImages = {
      Platina: "https://via.placeholder.com/160x120/4CAF50/FFFFFF?text=Platina",
      Chetak: "https://via.placeholder.com/160x120/2196F3/FFFFFF?text=Chetak",
      Avenger: "https://via.placeholder.com/160x120/FF9800/FFFFFF?text=Avenger",
      Dominar: "https://via.placeholder.com/160x120/9C27B0/FFFFFF?text=Dominar",
      Pulsar: "https://via.placeholder.com/160x120/F44336/FFFFFF?text=Pulsar",
    };
    return (
      brandImages[brand] ||
      "https://via.placeholder.com/160x120/CCCCCC/333333?text=Vehicle"
    );
  };

  useEffect(() => {
    if (vehicle) {
      const url = getImageUrl();
      setImgSrc(url);
      setLoading(true);
      setError(false);
    }
  }, [vehicle, brandName]);

  const handleError = (e) => {
    setError(true);
    setLoading(false);
    const fallbackImage = `/assets/images/brands/${brandName.toLowerCase()}.webp`;
    if (e.target.src !== fallbackImage) {
      e.target.src = fallbackImage;
    } else {
      e.target.src = getDefaultBrandImage(brandName);
    }
  };

  const handleLoad = () => setLoading(false);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {error && (
        <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
          !
        </div>
      )}
      <img
        src={imgSrc}
        alt={brandName || variantName || "Vehicle"}
        className={`w-full h-full object-contain p-1 transition-opacity duration-300 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
};

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <span className="text-gray-600 font-medium">Loading...</span>
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

export default function Dashboard() {
  const [leadStats, setLeadStats] = useState({
    drafts: 0,
    open: 0,
    converted: 0,
    unrealized: 0,
    convertedToday: 0,
  });

  // Claims counts state
  const [claims, setClaims] = useState({
    total: 0,
    successful: 0,
    disputed: 0,
    rejected: 0,
  });
  const [claimsLoading, setClaimsLoading] = useState(true);

  const [galleries, setGalleries] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const carouselItems = [
    { src: "assets/images/banner/4.webp", alt: "Pulsar 200" },
    { src: "assets/images/banner/1.webp", alt: "Dominar 250" },
    { src: "assets/images/banner/2.webp", alt: "Avenger 220 Cruise" },
    { src: "assets/images/banner/3.webp", alt: "Pulsar 125" },
  ];

  // Fetch Claims Counts
  useEffect(() => {
    const fetchClaimsCounts = async () => {
      try {
        setClaimsLoading(true);
        const response = await axios.get(`${API_BASE}/claims/all-counts`, {
          headers: getAuthHeaders(),
        });

        if (response.data.success) {
          setClaims(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching claims counts:", error);
        setClaims({ total: 0, successful: 0, disputed: 0, rejected: 0 });
      } finally {
        setClaimsLoading(false);
      }
    };

    fetchClaimsCounts();
  }, []);

  // Existing Dashboard Data Fetch
  const fetchDashboard = async () => {
    try {
      console.log("Fetching dashboard data...");

      const [
        draftRes,
        openRes,
        convertedRes,
        unrealizedRes,
        convertedTodayRes,
        galleriesRes,
        brandsRes,
      ] = await Promise.all([
        axios.get("http://localhost:8000/api/lead-details/draft"),
        axios.get("http://localhost:8000/api/lead-details/open"),
        axios.get("http://localhost:8000/api/lead-details/converted"),
        axios.get("http://localhost:8000/api/lead-details/unrealized"),
        axios.get("http://localhost:8000/api/lead-details/converted-today"),
        axios.get("http://localhost:8000/api/galleries"),
        axios.get("http://localhost:8000/api/brands"),
      ]);

      setLeadStats({
        drafts: draftRes.data.count || draftRes.data.data?.length || 0,
        open: openRes.data.data || 0,
        converted: convertedRes.data.count || convertedRes.data.data?.length || 0,
        unrealized: unrealizedRes.data.count || unrealizedRes.data.data?.length || 0,
        convertedToday: convertedTodayRes.data.count || 0,
      });

      let galleriesData = galleriesRes.data.data || galleriesRes.data.galleries || galleriesRes.data || [];
      let brandsData = brandsRes.data.data || brandsRes.data || [];

      setGalleries(galleriesData);
      setBrands(brandsData);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getBrandWiseVehicles = () => {
    const brandMap = new Map();
    galleries.forEach((gallery) => {
      const brandId = gallery.brand_id;
      if (!brandId) return;
      const brandName = getBrandNameFromBrands(brandId) || getBrandName(gallery);
      if (!brandMap.has(brandId)) {
        brandMap.set(brandId, {
          brandId,
          brandName,
          vehicle: gallery,
          vehicleCount: 0,
        });
      }
      brandMap.get(brandId).vehicleCount += 1;
    });
    return Array.from(brandMap.values());
  };

  const getBrandNameFromBrands = (brandId) => brands.find((b) => b.id === brandId)?.name;
  const getBrandName = (gallery) => gallery.brand_name || gallery.brand?.name || "Unknown Brand";

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < carouselItems.length - 1 ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : carouselItems.length - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev < carouselItems.length - 1 ? prev + 1 : 0));

  const getVariantName = (variant) =>
    variant.name || variant.variant_name || variant.model_name || variant.title || `Variant ${variant.id || ""}`;

  const brandWiseVehicles = getBrandWiseVehicles();

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} onRetry={() => { setLoading(true); setError(null); fetchDashboard(); }} />;

  return (
    <Container>
      <div className="bg-gray-100 font-sans text-sm min-h-screen">
        {/* Drawer Menu - unchanged */}
        <div
          className={`fixed top-0 -left-64 w-64 h-full bg-white shadow-lg transition-all duration-300 z-[1000] pt-20 ${drawerOpen ? "left-0" : "-left-64"}`}
          id="drawerMenu"
        >
          <img src="assets/images/logo/bajaj-icon1.svg" alt="Bajaj Logo" className="absolute top-2.5 left-2.5 h-[50px]" />
          <button
            className="absolute top-2.5 right-2.5 text-2xl bg-transparent border-none text-red-600 cursor-pointer z-[1002]"
            onClick={closeDrawer}
          >
            <i className="bi bi-x"></i>
          </button>
          <ul className="list-none p-0 m-0">
            <li className="p-2.5 px-5"><Link to="#" className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"><i className="bi bi-house-door-fill mr-2.5"></i> Home</Link></li>
            <li className="p-2.5 px-5"><Link to="#" className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"><i className="bi bi-people-fill mr-2.5"></i> Leads</Link></li>
            <li className="p-2.5 px-5"><Link to="#" className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"><i className="bi bi-bar-chart-fill mr-2.5"></i> Reports</Link></li>
            <li className="p-2.5 px-5"><Link to="#" className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"><i className="bi bi-gear-fill mr-2.5"></i> Settings</Link></li>
            <li className="p-2.5 px-5"><Link to="#" className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"><i className="bi bi-box-arrow-right mr-2.5"></i> Logout</Link></li>
          </ul>
        </div>

        {/* Carousel Section - unchanged */}
        <section className="p-2 md:p-6 xl:p-10">
          <div className="carousel-container rounded-lg shadow-sm overflow-hidden relative">
            <div className="carousel-track flex transition-transform duration-600 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {carouselItems.map((item, index) => (
                <div key={index} className="carousel-item flex-shrink-0 w-full relative">
                  <img src={item.src} alt={item.alt} className="w-full h-48 md:h-64 object-cover rounded-lg" />
                  <button className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-[var(--primary-blue)] text-white px-2.5 py-1.5 text-xs rounded-lg hover:bg-[#084a8a]">
                    Explore
                  </button>
                </div>
              ))}
            </div>
            <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10" onClick={prevSlide}>
              <i className="bi bi-chevron-left text-lg"></i>
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-10" onClick={nextSlide}>
              <i className="bi bi-chevron-right text-lg"></i>
            </button>
          </div>
        </section>

        {/* Overview Section - unchanged */}
        <section className="p-4 md:p-6 xl:p-8 py-2">
          <div className="bg-[#cae4fe] p-4 md:p-6 rounded-lg shadow-sm">
            <h5 className="mb-4 text-[var(--primary-blue)] text-lg font-semibold">Overview</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
                  <i className="bi bi-currency-dollar text-green-500 text-xl"></i>
                </div>
                <h6 className="text-gray-500 text-xs mb-1 font-medium">Earnings</h6>
                <h3 className="text-[var(--primary-blue)] text-xl font-bold">$0</h3>
                <p className="text-green-500 text-xs mt-1 font-medium">0+ today</p>
              </div>
              <div className="bg-white rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2 group-hover:bg-orange-100 transition-colors">
                  <i className="bi bi-car-front-fill text-orange-500 text-xl"></i>
                </div>
                <h6 className="text-gray-500 text-xs mb-1 font-medium">Vehicles Sold</h6>
                <h3 className="text-[var(--primary-blue)] text-xl font-bold">{leadStats.converted}</h3>
                <p className="text-green-600 text-xs mt-2 font-medium">+ {leadStats.convertedToday} today</p>
              </div>
              <Link to="#" className="no-underline">
                <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                    <i className="bi bi-file-earmark-text text-blue-500 text-xl"></i>
                  </div>
                  <h6 className="text-gray-500 text-xs mb-1 font-medium">Credit Notes</h6>
                  <h3 className="text-[var(--primary-blue)] text-xl font-bold">0</h3>
                </div>
              </Link>
              <Link to="/#" className="no-underline">
                <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                    <i className="bi bi-receipt text-purple-500 text-xl"></i>
                  </div>
                  <h6 className="text-gray-500 text-xs mb-1 font-medium">Invoices</h6>
                  <h3 className="text-[var(--primary-blue)] text-xl font-bold">0</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Leads Section - unchanged */}
        <section className="p-2 md:p-6 xl:p-10">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h5 className="mb-3 text-[var(--primary-blue)] text-lg">Leads</h5>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <Link to="/leads/draft" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-pencil-square text-gray-600 text-base"></i> Drafts
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">{leadStats.drafts}</h3>
                </div>
              </Link>
              <Link to="/leads/open" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-hourglass-split text-orange-500 text-base"></i> Open
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">{leadStats.open}</h3>
                </div>
              </Link>
              <Link to="/leads/converted" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-emoji-smile text-green-500 text-base"></i> Converted
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">{leadStats.converted}</h3>
                </div>
              </Link>
              <Link to="/leads/unrealized" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-emoji-frown text-red-500 text-base"></i> Unrealized
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">{leadStats.unrealized}</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Claim Section - Updated with Live Counts */}
        <section className="p-2 md:p-6 xl:p-10">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h5 className="mb-3 text-[var(--primary-blue)] text-lg">Claim | Amount</h5>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <Link to="/total-claim" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-clipboard-data text-primary-blue text-base"></i> Total
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                    {claimsLoading ? "..." : claims.total}
                  </h3>
                </div>
              </Link>

              <Link to="/successful-claim" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-check-circle text-green-500 text-base"></i> Approved
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                    {claimsLoading ? "..." : claims.successful}
                  </h3>
                </div>
              </Link>

              <Link to="/disputed-claim" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-exclamation-triangle text-orange-500 text-base"></i> Disputed
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                    {claimsLoading ? "..." : claims.disputed}
                  </h3>
                </div>
              </Link>

              <Link to="/rejected-claim" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-x-circle text-red-500 text-base"></i> Rejected
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                    {claimsLoading ? "..." : claims.rejected}
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Activity Section - unchanged */}
        <section className="p-2 md:p-6 xl:p-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h5 className="mb-4 text-[var(--primary-blue)] text-lg font-semibold">
              Recent Activity
            </h5>
            <div className="space-y-4">
              <Link to="/credit" className="no-underline block">
                <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-200">
                    <i className="bi bi-currency-dollar text-green-500 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)]">
                      New credit note generated
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/vehicle" className="no-underline block">
                <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200">
                    <i className="bi bi-car-front-fill text-blue-500 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)]">
                      Vehicle sold
                    </p>
                  </div>
                </div>
              </Link>
              <Link to="/invoice" className="no-underline block">
                <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200">
                    <i className="bi bi-receipt text-purple-500 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)]">
                      Invoice submitted
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Brand-wise Vehicle Models - unchanged */}
        <section className="p-3 md:p-6 xl:p-10">
          <h5 className="mb-3 text-[var(--primary-blue)] text-lg">
            Brands {brandWiseVehicles.length > 0 && `(${brandWiseVehicles.length})`}
          </h5>

          {brandWiseVehicles.length === 0 && (
            <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
              <i className="bi bi-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
              <p className="text-yellow-700 font-medium">
                No vehicle brands found
              </p>
              <button
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchDashboard();
                }}
                className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm"
              >
                Reload Page
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {brandWiseVehicles.map((brandData, idx) => {
              const { brandId, brandName, vehicle, vehicleCount } = brandData;
              const variantName = getVariantName(vehicle);

              return (
                <div
                  key={brandId || idx}
                  className="bg-white text-center rounded-lg p-4 hover:shadow-md transition-all duration-300 relative border border-gray-200 group cursor-pointer"
                  onClick={() => navigate("/leads/generate")}
                >
                  {vehicleCount > 1 && (
                    <span className="absolute top-2.5 right-2.5 text-gray-500 text-[0.65rem] bg-blue-50 rounded-full px-2 py-1 group-hover:bg-blue-100">
                      +{vehicleCount - 1} more
                    </span>
                  )}

                  <div className="mb-3 h-32 flex items-center justify-center bg-white rounded-lg overflow-hidden border border-gray-200">
                    <VehicleImage
                      vehicle={vehicle}
                      brandName={brandName}
                      variantName={variantName}
                      brandId={brandId}
                    />
                  </div>

                  <h6 className="text-sm mb-1 font-semibold text-gray-800 group-hover:text-[var(--primary-blue)] transition-colors line-clamp-2">
                    {brandName}
                  </h6>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <Footer />
    </Container>
  );
}