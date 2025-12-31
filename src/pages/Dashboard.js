// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import Container from "../components/Container";
// import Footer from "../components/Layout/Footer";
// import {
//   Skeleton,
//   SkeletonCard,
//   SkeletonBrandCard,
//   SkeletonCarousel,
// } from "../components/SkeletonLoader";

// const VehicleImage = ({ vehicle, brandName, variantName, brandId }) => {
//   const [imgSrc, setImgSrc] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);

//   // Helper function to get first photo from cover_photos
//   const getFirstPhoto = (coverPhotos) => {
//     if (!coverPhotos) return null;

//     try {
//       // If it's a JSON string
//       if (typeof coverPhotos === "string" && coverPhotos.startsWith("[")) {
//         const parsed = JSON.parse(coverPhotos);
//         if (Array.isArray(parsed) && parsed.length > 0) {
//           return parsed[0].replace(/[\[\]"\']/g, "").trim();
//         }
//       }
//       // If it's already an array
//       else if (Array.isArray(coverPhotos) && coverPhotos.length > 0) {
//         return coverPhotos[0];
//       }
//     } catch (e) {
//       console.error("Error parsing cover_photos:", e);
//     }
//     return null;
//   };

//   // Get the best image URL for the vehicle
//   const getImageUrl = () => {
//     console.log("🔍 Getting image for:", brandName, vehicle);

//     if (vehicle?.first_image) {
//       console.log(" Using first_image:", vehicle.first_image);
//       return vehicle.first_image;
//     }

//     if (
//       vehicle?.cover_photo_urls &&
//       Array.isArray(vehicle.cover_photo_urls) &&
//       vehicle.cover_photo_urls.length > 0
//     ) {
//       console.log(" Using cover_photo_urls[0]:", vehicle.cover_photo_urls[0]);
//       return vehicle.cover_photo_urls[0];
//     }

//     if (vehicle?.image_base_url && vehicle?.cover_photos) {
//       const firstPhoto = getFirstPhoto(vehicle.cover_photos);
//       if (firstPhoto) {
//         const url = `${vehicle.image_base_url}${firstPhoto}`;
//         console.log(" Using image_base_url + photo:", url);
//         return url;
//       }
//     }

//     if (vehicle?.cover_photos) {
//       const firstPhoto = getFirstPhoto(vehicle.cover_photos);
//       if (firstPhoto) {
//         const url = `http://localhost:8000/storage/galleries/${firstPhoto}`;
//         console.log(" Using galleries path:", url);
//         return url;
//       }
//     }

//     // Priority 5: Use brand-specific default image
//     console.log("⚠️ No specific image found, using brand default");
//     return getDefaultBrandImage(brandName);
//   };

//   // Get default image based on brand name
//   const getDefaultBrandImage = (brand) => {
//     const brandImages = {
//       Platina: "https://via.placeholder.com/160x120/4CAF50/FFFFFF?text=Platina",
//       Chetak: "https://via.placeholder.com/160x120/2196F3/FFFFFF?text=Chetak",
//       Avenger: "https://via.placeholder.com/160x120/FF9800/FFFFFF?text=Avenger",
//       Dominar: "https://via.placeholder.com/160x120/9C27B0/FFFFFF?text=Dominar",
//       pulsar: "https://via.placeholder.com/160x120/F44336/FFFFFF?text=Pulsar",
//     };
//     return (
//       brandImages[brand] ||
//       "https://via.placeholder.com/160x120/CCCCCC/333333?text=Vehicle"
//     );
//   };

//   useEffect(() => {
//     if (vehicle) {
//       const url = getImageUrl();
//       console.log(`🖼️ Setting image for ${brandName}:`, url);
//       setImgSrc(url);
//       setLoading(true);
//       setError(false);
//     }
//   }, [vehicle, brandName]);

//   const handleError = (e) => {
//     console.error(`❌ Image failed to load for ${brandName}:`, imgSrc);
//     setError(true);
//     setLoading(false);

//     // Try the local asset as fallback
//     const fallbackImage = `/assets/images/brands/${brandName.toLowerCase()}.webp`;
//     console.log(`🔄 Trying local fallback:`, fallbackImage);

//     // Only try once to avoid infinite loop
//     if (e.target.src !== fallbackImage) {
//       e.target.src = fallbackImage;
//     } else {
//       // Use colored placeholder as final fallback
//       e.target.src = getDefaultBrandImage(brandName);
//     }
//   };

//   const handleLoad = () => {
//     console.log(`✅ Image loaded for ${brandName}:`, imgSrc);
//     setLoading(false);
//     setError(false);
//   };

//   return (
//     <div className="relative w-full h-full">
//       {/* Loading indicator */}
//       {loading && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
//           <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}

//       {/* Error indicator */}
//       {error && (
//         <div className="absolute top-2 right-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
//           !
//         </div>
//       )}

//       {/* Main Image */}
//       <img
//         src={imgSrc}
//         alt={brandName || variantName || "Vehicle Image"}
//         className={`w-full h-full object-contain p-1 transition-opacity duration-300 ${
//           loading ? "opacity-0" : "opacity-100"
//         }`}
//         onError={handleError}
//         onLoad={handleLoad}
//         loading="lazy"
//       />

//       {/* Debug info - only in development */}
//       {process.env.NODE_ENV === "development" && !loading && (
//         <div className="absolute bottom-1 left-1 text-[8px] bg-black bg-opacity-70 text-white px-1 rounded opacity-0 hover:opacity-100 transition-opacity">
//           {vehicle?.first_image
//             ? "API"
//             : vehicle?.cover_photo_urls
//             ? "URLs"
//             : "Constructed"}
//         </div>
//       )}
//     </div>
//   );
// };

// export default function Dashboard() {
//   const [leadStats, setLeadStats] = useState({
//     drafts: 0,
//     open: 0,
//     converted: 0,
//     unrealized: 0,
//   });
//   const [galleries, setGalleries] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);

//   const carouselItems = [
//     {
//       src: "assets/images/banner/4.webp",
//       alt: "Pulsar 200",
//     },
//     {
//       src: "assets/images/banner/1.webp",
//       alt: "Dominar 250",
//     },
//     {
//       src: "assets/images/banner/2.webp",
//       alt: "Avenger 220 Cruise",
//     },
//     {
//       src: "assets/images/banner/3.webp",
//       alt: "Pulsar 125",
//     },
//   ];

//   useEffect(() => {
//     async function fetchDashboard() {
//       try {
//         const [
//           draftLeadsRes,
//           openLeadsRes,
//           convertedLeadsRes,
//           unrealizedLeadsRes,
//           galleriesRes,
//           brandsRes,
//         ] = await Promise.all([
//           axios.get("http://localhost:8000/api/lead-details/draft"),
//           axios.get("http://localhost:8000/api/lead-details/open"),
//           axios.get("http://localhost:8000/api/leads?status=converted"),
//           axios.get("http://localhost:8000/api/leads?status=Unrealized"),
//           axios.get("http://localhost:8000/api/galleries"),
//           axios.get("http://localhost:8000/api/brands"),
//         ]);

//         console.log("🚀 GALLERIES API RESPONSE:", galleriesRes.data);
//         console.log("🚀 BRANDS API RESPONSE:", brandsRes.data);

//         // Handle different response structures for galleries
//         let galleriesData = [];
//         if (galleriesRes.data && Array.isArray(galleriesRes.data)) {
//           galleriesData = galleriesRes.data;
//         } else if (galleriesRes.data && galleriesRes.data.data) {
//           galleriesData = galleriesRes.data.data;
//         } else if (galleriesRes.data && galleriesRes.data.galleries) {
//           galleriesData = galleriesRes.data.galleries;
//         }

//         // Handle different response structures for brands
//         let brandsData = [];
//         if (brandsRes.data && Array.isArray(brandsRes.data)) {
//           brandsData = brandsRes.data;
//         } else if (brandsRes.data && brandsRes.data.data) {
//           brandsData = brandsRes.data.data;
//         }

//         console.log("📸 Processed galleries data:", galleriesData);
//         console.log("🏷️ Processed brands data:", brandsData);

//         setLeadStats({
//           drafts: draftLeadsRes.data.data?.length || 0,
//           open: openLeadsRes.data.data || 0,
//           converted: convertedLeadsRes.data.length || 0,
//           unrealized: unrealizedLeadsRes.data.length || 0,
//         });
//         setGalleries(galleriesData);
//         setBrands(brandsData);
//       } catch (err) {
//         console.error("❌ Error fetching dashboard data:", err);
//         if (err.response?.data?.message === "Failed to fetch galleries.") {
//           setError("Failed to load vehicle models. Please try again later.");
//         } else {
//           setError("The dashboard is currently offline. Please Retry");
//         }
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchDashboard();
//   }, []);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:8000/api/executive/notifications",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`, // Agar token use kar rahe ho
//             },
//           }
//         );
//         setNotifications(response.data);
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//       }
//     };

//     fetchNotifications();
//     // Optional: Poll every 30 seconds for real-time
//     const interval = setInterval(fetchNotifications, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const getBrandWiseVehicles = () => {
//     const brandMap = new Map();

//     // Group by brand and prefer vehicles with images
//     galleries.forEach((gallery) => {
//       const brandId = gallery.brand_id;
//       if (!brandId) return;

//       const brandName =
//         getBrandNameFromBrands(brandId) || getBrandName(gallery);

//       if (!brandMap.has(brandId)) {
//         brandMap.set(brandId, {
//           brandId,
//           brandName,
//           vehicle: gallery, // we'll use the first one for now
//           vehicleCount: 0,
//         });
//       }

//       // Increment count
//       brandMap.get(brandId).vehicleCount += 1;

//       // Optional: Prefer the gallery that has cover_photo_urls
//       const current = brandMap.get(brandId);
//       if (
//         (!current.vehicle.cover_photo_urls?.length &&
//           gallery.cover_photo_urls?.length) ||
//         (gallery.cover_photo_urls?.length &&
//           !current.vehicle.first_image &&
//           gallery.first_image)
//       ) {
//         current.vehicle = gallery; // update to one that has images
//       }
//     });

//     return Array.from(brandMap.values());
//   };

//   // Get brand name from brands data
//   const getBrandNameFromBrands = (brandId) => {
//     const brand = brands.find((b) => b.id === brandId);
//     return brand ? brand.name : null;
//   };

//   // Get brand name from gallery data
//   const getBrandName = (gallery) => {
//     // First try to get from brands data
//     if (gallery.brand_id) {
//       const brandName = getBrandNameFromBrands(gallery.brand_id);
//       if (brandName) return brandName;
//     }

//     // Fallback to gallery data
//     return gallery.brand_name || gallery.brand?.name || "Unknown Brand";
//   };

//   // Drawer functionality
//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   const closeDrawer = () => {
//     setDrawerOpen(false);
//   };

//   // Auto slide for carousel
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((current) =>
//         current < carouselItems.length - 1 ? current + 1 : 0
//       );
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [currentIndex, carouselItems.length]);

//   const prevSlide = () => {
//     setCurrentIndex((current) =>
//       current > 0 ? current - 1 : carouselItems.length - 1
//     );
//   };

//   const nextSlide = () => {
//     setCurrentIndex((current) =>
//       current < carouselItems.length - 1 ? current + 1 : 0
//     );
//   };

//   // Get variant name
//   const getVariantName = (variant) => {
//     // Check all possible name fields
//     if (variant.name) return variant.name;
//     if (variant.variant_name) return variant.variant_name;
//     if (variant.model_name) return variant.model_name;
//     if (variant.title) return variant.title;

//     // Check nested objects
//     if (variant.variant && variant.variant.name) return variant.variant.name;
//     if (variant.model && variant.model.name) return variant.model.name;

//     // If we have variant_id but no name
//     if (variant.variant_id)
//       return `Variant ${variant.variant_name || variant.variant_id}`;

//     // Final fallback
//     return `Model ${variant.id}`;
//   };

//   // Test image accessibility
//   useEffect(() => {
//     const brandWiseVehicles = getBrandWiseVehicles();
//     if (brandWiseVehicles.length > 0) {
//       console.log("🚀 Testing image accessibility...");
//       brandWiseVehicles.forEach((brandData) => {
//         const img = new Image();

//         img.onload = () => {
//           console.log(`✅ ${brandData.brandName}: Image accessible`);
//         };

//         img.onerror = () => {
//           console.error(`❌ ${brandData.brandName}: Image NOT accessible`);
//         };

//         // Use first_image if available
//         if (brandData.vehicle.first_image) {
//           img.src = brandData.vehicle.first_image;
//         }
//       });
//     }
//   }, [galleries]);

//   const brandWiseVehicles = getBrandWiseVehicles();

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
//         <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
//         <span className="text-gray-600 font-medium">Loading...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
//         <i className="bi bi-exclamation-triangle text-red-500 text-4xl"></i>
//         <p className="text-red-500 text-lg font-medium">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <Container>
//       <div className="bg-gray-100 font-sans text-sm min-h-screen">
//         {/* Main Container */}
//         <div className="container-fluid mx-auto px-0">
//           {/* Drawer Menu */}
//           <div
//             className={`fixed top-0 -left-64 w-64 h-full bg-white shadow-lg transition-all duration-300 z-[1000] pt-20 ${
//               drawerOpen ? "left-0" : "-left-64"
//             }`}
//             id="drawerMenu"
//           >
//             <img
//               src="assets/images/logo/bajaj-icon1.svg"
//               alt="Bajaj Logo"
//               className="absolute top-2.5 left-2.5 h-[50px]"
//             />
//             <button
//               className="absolute top-2.5 right-2.5 text-2xl bg-transparent border-none text-red-600 cursor-pointer z-[1002]"
//               onClick={closeDrawer}
//             >
//               <i className="bi bi-x"></i>
//             </button>
//             <ul className="list-none p-0 m-0">
//               <li className="p-2.5 px-5">
//                 <Link
//                   to="#"
//                   className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
//                 >
//                   <i className="bi bi-house-door-fill mr-2.5"></i> Home
//                 </Link>
//               </li>
//               <li className="p-2.5 px-5">
//                 <Link
//                   to="#"
//                   className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
//                 >
//                   <i className="bi bi-people-fill mr-2.5"></i> Leads
//                 </Link>
//               </li>
//               <li className="p-2.5 px-5">
//                 <Link
//                   to="#"
//                   className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
//                 >
//                   <i className="bi bi-bar-chart-fill mr-2.5"></i> Reports
//                 </Link>
//               </li>
//               <li className="p-2.5 px-5">
//                 <Link
//                   to="#"
//                   className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
//                 >
//                   <i className="bi bi-gear-fill mr-2.5"></i> Settings
//                 </Link>
//               </li>
//               <li className="p-2.5 px-5">
//                 <Link
//                   to="#"
//                   className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
//                 >
//                   <i className="bi bi-box-arrow-right mr-2.5"></i> Logout
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Carousel Section */}
//           <section className="p-2 md:p-6 xl:p-10">
//             <div className="carousel-container rounded-lg shadow-sm overflow-hidden">
//               <div
//                 className="carousel-track flex transition-transform duration-600 ease-in-out"
//                 style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//               >
//                 {carouselItems.map((item, index) => (
//                   <div
//                     key={index}
//                     className="carousel-item flex-shrink-0 w-full relative"
//                   >
//                     <img
//                       src={item.src}
//                       alt={item.alt}
//                       className="w-full h-48 md:h-64 object-cover rounded-lg"
//                     />
//                     <button className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-[var(--primary-blue)] text-white px-2.5 py-1.5 text-xs rounded-lg hover:bg-[#084a8a] hover:scale-105 transition-all duration-200">
//                       Explore
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 className="carousel-control carousel-control-prev"
//                 onClick={prevSlide}
//               >
//                 <i className="bi bi-chevron-left"></i>
//               </button>
//               <button
//                 className="carousel-control carousel-control-next"
//                 onClick={nextSlide}
//               >
//                 <i className="bi bi-chevron-right"></i>
//               </button>
//             </div>
//           </section>

//           {/* Total Earnings and Vehicles Sold Section */}
//           <section className="p-4 md:p-6 xl:p-8 py-2">
//             <div className="bg-[#cae4fe] p-4 md:p-6 rounded-lg shadow-sm">
//               <h5 className="mb-4 text-[var(--primary-blue)] text-lg font-semibold">
//                 Overview
//               </h5>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//                 {/* Earnings Card */}
//                 {/* {[...Array(1)].map((_, i) => (
//                   <SkeletonCard key={i} />
//                 ))} */}
//                 <div className="bg-white rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center">
//                   <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
//                     <i className="bi bi-currency-dollar text-green-500 text-xl"></i>
//                   </div>
//                   <h6 className="text-gray-500 text-xs mb-1 font-medium">
//                     Earnings
//                   </h6>
//                   <div className="flex justify-center items-center">
//                     <h3 className="text-[var(--primary-blue)] text-xl font-bold">
//                       $0
//                     </h3>
//                   </div>
//                   <p className="text-green-500 text-xs mt-1 font-medium">
//                     0+ today
//                   </p>
//                 </div>

//                 {/* Vehicles Sold Card */}
//                 <div className="bg-white rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center">
//                   <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
//                     <i className="bi bi-car-front-fill text-orange-500 text-xl"></i>
//                   </div>
//                   <h6 className="text-gray-500 text-xs mb-1 font-medium">
//                     Vehicles Sold
//                   </h6>
//                   <div className="flex justify-center items-center">
//                     <h3 className="text-[var(--primary-blue)] text-xl font-bold">
//                       0
//                     </h3>
//                   </div>
//                   <p className="text-green-500 text-xs mt-1 font-medium"></p>
//                 </div>

//                 {/* Credit Notes Card */}
//                 <Link to="/credit" className="no-underline">
//                   <div className="bg-white rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer">
//                     <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
//                       <i className="bi bi-file-earmark-text text-blue-500 text-xl"></i>
//                     </div>
//                     <h6 className="text-gray-500 text-xs mb-1 font-medium">
//                       Credit Notes
//                     </h6>
//                     <div className="flex justify-center items-center">
//                       <h3 className="text-[var(--primary-blue)] text-xl font-bold">
//                         0
//                       </h3>
//                     </div>
//                     <p className="text-gray-400 text-xs mt-1 font-medium">
//                       Tap to view
//                     </p>
//                   </div>
//                 </Link>

//                 {/* Invoices Card */}
//                 <Link to="/invoice" className="no-underline">
//                   <div className="bg-white rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer">
//                     <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors">
//                       <i className="bi bi-receipt text-purple-500 text-xl"></i>
//                     </div>
//                     <h6 className="text-gray-500 text-xs mb-1 font-medium">
//                       Invoices
//                     </h6>
//                     <div className="flex justify-center items-center">
//                       <h3 className="text-[var(--primary-blue)] text-xl font-bold">
//                         0
//                       </h3>
//                     </div>
//                     <p className="text-gray-400 text-xs mt-1 font-medium">
//                       Tap to view
//                     </p>
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           </section>

//           {/* Lead Section */}
//           <section className="p-2 md:p-6 xl:p-10">
//             <div className="bg-white p-4 rounded-lg shadow-sm">
//               <h5 className="mb-3 text-[var(--primary-blue)] text-lg">Leads</h5>
//               <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
//                 <Link to="/leads/draft" className="no-underline">
//                   <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
//                     <h6 className="text-gray-500 text-xs mb-2">
//                       <i className="bi bi-pencil-square text-gray-600 text-base"></i>{" "}
//                       Drafts
//                       <Skeleton />
//                     </h6>
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                         {leadStats.drafts}
//                       </h3>
//                     </div>
//                   </div>
//                 </Link>

//                 <Link to="/leads/open" className="no-underline">
//                   <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
//                     <h6 className="text-gray-500 text-xs mb-2">
//                       <i className="bi bi-hourglass-split text-orange-500 text-base"></i>{" "}
//                       Open
//                     </h6>
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                         {leadStats.open}
//                       </h3>
//                     </div>
//                   </div>
//                 </Link>

//                 <Link to="/leads/converted" className="no-underline">
//                   <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
//                     <h6 className="text-gray-500 text-xs mb-2">
//                       <i className="bi bi-emoji-smile text-green-500 text-base"></i>{" "}
//                       Converted
//                     </h6>
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                         {leadStats.converted}
//                       </h3>
//                     </div>
//                   </div>
//                 </Link>

//                 <Link to="/leads/unrealized" className="no-underline">
//                   <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
//                     <h6 className="text-gray-500 text-xs mb-2">
//                       <i className="bi bi-emoji-frown text-red-500 text-base"></i>{" "}
//                       Unrealized
//                     </h6>
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                         {leadStats.unrealized}
//                       </h3>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           </section>

//           {/* Claim | Amount Section */}
//           <section className="p-2 md:p-6 xl:p-10">
//             <div className="bg-white p-4 rounded-lg shadow-sm">
//               <div className="flex justify-between items-center mb-3">
//                 <h5 className="text-[var(--primary-blue)] text-lg">
//                   Claim | Amount
//                 </h5>
//               </div>
//               <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
//                 <Link to="/total-claim" className="block">
//                   <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
//                     <h6 className="text-gray-500 text-xs mb-2">
//                       <i className="bi bi-clipboard-data text-primary-blue text-base"></i>{" "}
//                       Total
//                     </h6>
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                         0
//                       </h3>
//                     </div>
//                   </div>
//                 </Link>

//                 <Link to="/successful-claim" className="block">
//                   <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
//                     <h6 className="text-gray-500 text-xs mb-2">
//                       <i className="bi bi-check-circle text-green-500 text-base"></i>{" "}
//                       Approved
//                     </h6>
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                         0
//                       </h3>
//                     </div>
//                   </div>
//                 </Link>

//                 <Link to="/disputed-claim" className="block">
//                   <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
//                     <h6 className="text-gray-500 text-xs mb-2">
//                       <i className="bi bi-exclamation-triangle text-orange-500 text-base"></i>{" "}
//                       Disputed
//                     </h6>
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                         0
//                       </h3>
//                     </div>
//                   </div>
//                 </Link>

//                 <Link to="/rejected-claim" className="block">
//                   <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
//                     <h6 className="text-gray-500 text-xs mb-2">
//                       <i className="bi bi-x-circle text-red-500 text-base"></i>{" "}
//                       Rejected
//                     </h6>
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-[var(--primary-blue)] text-xl mb-0">
//                         0
//                       </h3>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           </section>

//           {/* Recent Leads Section */}
//           <section className="p-2 md:p-6 xl:p-8">
//             <div className="bg-white rounded-lg p-6 shadow-sm">
//               <h5 className="mb-4 text-[var(--primary-blue)] text-lg font-semibold">
//                 Recent Activity
//               </h5>
//               <div className="space-y-4">
//                 <Link to="/credit" className="no-underline block">
//                   <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md hover:-translate-y-0.5 duration-200 cursor-pointer group">
//                     <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
//                       <i className="bi bi-currency-dollar text-green-500 text-sm"></i>
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)] transition-colors">
//                         New credit note generated
//                       </p>
//                     </div>
//                   </div>
//                 </Link>

//                 <Link to="/vehicle" className="no-underline block">
//                   <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md hover:-translate-y-0.5 duration-200 cursor-pointer group">
//                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
//                       <i className="bi bi-car-front-fill text-blue-500 text-sm"></i>
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)] transition-colors">
//                         Vehicle sold
//                       </p>
//                     </div>
//                   </div>
//                 </Link>

//                 <Link to="/invoice" className="no-underline block">
//                   <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md hover:-translate-y-0.5 duration-200 cursor-pointer group">
//                     <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
//                       <i className="bi bi-receipt text-purple-500 text-sm"></i>
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)] transition-colors">
//                         Invoice submitted
//                       </p>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             </div>
//           </section>

//           {/* Brand-wise Vehicle Models Section */}
//           <section className="p-3 md:p-6 xl:p-10">
//             <h5 className="mb-3 text-[var(--primary-blue)] text-lg">
//               Vehicle Brands{" "}
//               {brandWiseVehicles.length > 0 && `(${brandWiseVehicles.length})`}
//             </h5>

//             {brandWiseVehicles.length === 0 && !loading && (
//               <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
//                 <i className="bi bi-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
//                 <p className="text-yellow-700 font-medium">
//                   No vehicle brands found
//                 </p>
//                 <button
//                   onClick={() => window.location.reload()}
//                   className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm"
//                 >
//                   Reload Page
//                 </button>
//               </div>
//             )}

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//               {brandWiseVehicles.map((brandData, idx) => {
//                 const { brandId, brandName, vehicle, vehicleCount } = brandData;
//                 const variantName = getVariantName(vehicle);

//                 return (
//                   <div
//                     key={brandId || idx}
//                     className="bg-white text-center rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 relative border border-gray-200 group cursor-pointer"
//                     onClick={() => navigate("/leads/generate")}
//                   >
//                     {/* Vehicle Count Badge */}
//                     {vehicleCount > 1 && (
//                       <span className="absolute top-2.5 right-2.5 text-gray-500 text-[0.65rem] bg-blue-50 rounded-full px-2 py-1 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
//                         +{vehicleCount - 1} more
//                       </span>
//                     )}

//                     {/* Image Container */}
//                     <div className="mb-3 h-32 flex items-center justify-center bg-white rounded-lg overflow-hidden border border-gray-200">
//                       <VehicleImage
//                         vehicle={vehicle}
//                         brandName={brandName}
//                         variantName={variantName}
//                         brandId={brandId}
//                       />
//                     </div>

//                     {/* Content */}
//                     <h6 className="text-sm mb-1 font-semibold text-gray-800 group-hover:text-[var(--primary-blue)] transition-colors line-clamp-2">
//                       {brandName}
//                     </h6>

//                     {/* Hover Effect Indicator */}
//                     <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary-blue)] rounded-lg transition-all duration-300 pointer-events-none"></div>
//                   </div>
//                 );
//               })}
//             </div>
//           </section>
//         </div>

//         <style jsx>{`
//           :root {
//             --primary-blue: #0f66af;
//             --light-grey: #ced4da;
//             --highlight-yellow: #ffd700;
//           }

//           @keyframes fadeIn {
//             from {
//               opacity: 0;
//             }
//             to {
//               opacity: 1;
//             }
//           }

//           .container-animate {
//             animation: fadeIn 0.5s ease-in;
//           }

//           .lead-card {
//             border-left: 4px solid var(--primary-blue);
//           }

//           .carousel-container {
//             position: relative;
//             width: 100%;
//             overflow: hidden;
//           }

//           .carousel-track {
//             display: flex;
//             transition: transform 0.6s ease-in-out;
//           }

//           .carousel-item {
//             flex: 0 0 100%;
//             position: relative;
//           }

//           .carousel-item img {
//             width: 100%;
//             object-fit: cover;
//             border-radius: 0.5rem;
//           }

//           @media (min-width: 768px) {
//             .carousel-item img {
//               height: 250px;
//             }
//           }

//           .carousel-control {
//             position: absolute;
//             top: 0;
//             bottom: 0;
//             width: 5%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             background: none;
//             border: none;
//             opacity: 0.5;
//             transition: opacity 0.3s ease;
//           }

//           .carousel-control:hover {
//             opacity: 0.9;
//           }

//           .carousel-control-prev {
//             left: 0;
//           }

//           .carousel-control-next {
//             right: 0;
//           }

//           .carousel-control i {
//             font-size: 1.5rem;
//             color: white;
//             background-color: rgba(0, 0, 0, 0.5);
//             border-radius: 50%;
//             padding: 10px;
//           }

//           .badge {
//             padding: 0.25em 0.4em;
//             font-size: 0.75em;
//             font-weight: 700;
//             line-height: 1;
//             text-align: center;
//             white-space: nowrap;
//             vertical-align: baseline;
//             border-radius: 0.25rem;
//           }
//         `}</style>
//       </div>
//       <Footer />
//     </Container>
//   );
// }

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import Container from "../components/Container";
// import Footer from "../components/Layout/Footer";
// import {
//   Skeleton,
//   SkeletonCard,
//   SkeletonBrandCard,
//   SkeletonCarousel,
// } from "../components/SkeletonLoader";

// const API_BASE = "http://localhost:8000/api"; // or your actual API URL

// const getAuthHeaders = () => ({
//   Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//   "Content-Type": "application/json",
//   Accept: "application/json",
// });

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

// export default function Dashboard() {
//   const [leadStats, setLeadStats] = useState({
//     drafts: 0,
//     open: 0,
//     converted: 0,
//     unrealized: 0,
//   });
//   const [galleries, setGalleries] = useState([]);
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [notifications, setNotifications] = useState([]);
//   const [notificationsLoading, setNotificationsLoading] = useState(true);
//   const [notificationsError, setNotificationsError] = useState(null);

//   const navigate = useNavigate();
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const carouselItems = [
//     { src: "assets/images/banner/4.webp", alt: "Pulsar 200" },
//     { src: "assets/images/banner/1.webp", alt: "Dominar 250" },
//     { src: "assets/images/banner/2.webp", alt: "Avenger 220 Cruise" },
//     { src: "assets/images/banner/3.webp", alt: "Pulsar 125" },
//   ];

//   useEffect(() => {
//     const fetchDashboard = async () => {
//       try {
//         const [
//           draftRes,
//           openRes,
//           convertedRes,
//           unrealizedRes,
//           galleriesRes,
//           brandsRes,
//         ] = await Promise.all([
//           axios.get("http://localhost:8000/api/lead-details/draft"),
//           axios.get("http://localhost:8000/api/lead-details/open"),
//           axios.get("http://localhost:8000/api/leads?status=converted"),
//           axios.get("http://localhost:8000/api/leads?status=Unrealized"),
//           axios.get("http://localhost:8000/api/galleries"),
//           axios.get("http://localhost:8000/api/brands"),
//         ]);

//         let galleriesData =
//           galleriesRes.data.data ||
//           galleriesRes.data.galleries ||
//           galleriesRes.data ||
//           [];
//         let brandsData = brandsRes.data.data || brandsRes.data || [];

//         setLeadStats({
//           drafts: draftRes.data.data?.length || 0,
//           open: openRes.data.data || 0,
//           converted: convertedRes.data.length || 0,
//           unrealized: unrealizedRes.data.length || 0,
//         });
//         setGalleries(galleriesData);
//         setBrands(brandsData);
//       } catch (err) {
//         console.error("Dashboard fetch error:", err);
//         setError("Failed to load dashboard data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchNotifications = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         console.log("🔑 Token exists:", !!token);

//         if (!token) {
//           console.log("📋 Using test endpoint (no token)");
//           const response = await axios.get(
//             "http://localhost:8000/api/test-notifications",
//             {
//               headers: {
//                 Accept: "application/json",
//                 "Content-Type": "application/json",
//               },
//             }
//           );
//           setNotifications(response.data.data);
//           setNotificationsError("Not authenticated - showing test data");
//           setNotificationsLoading(false);
//           return;
//         }

//         console.log("🔐 Attempting authenticated request...");

//         const response = await axios.get(
//           "http://localhost:8000/api/executive/notifications",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               Accept: "application/json",
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         console.log("✅ Notifications API Response:", response.data);

//         if (response.data && response.data.success !== undefined) {
//           setNotifications(response.data.data || []);
//         } else if (Array.isArray(response.data)) {
//           setNotifications(response.data);
//         } else {
//           console.warn("Unexpected response format:", response.data);
//           setNotifications([]);
//         }

//         setNotificationsError(null);
//       } catch (err) {
//         console.error("❌ Notifications error details:", {
//           message: err.message,
//           response: err.response?.data,
//           status: err.response?.status,
//           config: err.config,
//         });

//         if (err.response?.status === 401) {
//           setNotificationsError("Session expired. Please login again.");
//           localStorage.removeItem("token");
//         } else if (err.response?.status === 403) {
//           setNotificationsError("Access denied. Not an executive user.");
//         } else if (err.response?.status === 404) {
//           setNotificationsError(
//             "Notifications endpoint not found. Check Laravel routes."
//           );
//         } else if (err.code === "ERR_NETWORK") {
//           console.log("🔄 Network error, using test data");
//           try {
//             const testResponse = await axios.get(
//               "http://localhost:8000/api/test-notifications"
//             );
//             setNotifications(testResponse.data.data);
//             setNotificationsError(
//               "Using test data (network issue with main endpoint)"
//             );
//           } catch (testErr) {
//             setNotificationsError("Cannot connect to server");
//             setNotifications([]);
//           }
//         } else {
//           setNotificationsError(
//             `Error: ${err.response?.data?.message || err.message}`
//           );
//           setNotifications([]);
//         }
//       } finally {
//         setNotificationsLoading(false);
//       }
//     };

//     fetchDashboard();
//     fetchNotifications();

//     // Poll notifications every 30 seconds
//     const interval = setInterval(fetchNotifications, 30000);
//     return () => clearInterval(interval);
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

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
//         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//         <span className="text-gray-600 font-medium">Loading Dashboard...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
//         <i className="bi bi-exclamation-triangle text-red-500 text-4xl"></i>
//         <p className="text-red-500 text-lg font-medium">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
//         >
//           Retry
//         </button>
//       </div>
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
//           <div className="carousel-container rounded-lg shadow-sm overflow-hidden">
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
//             <button
//               className="carousel-control carousel-control-prev"
//               onClick={prevSlide}
//             >
//               <i className="bi bi-chevron-left"></i>
//             </button>
//             <button
//               className="carousel-control carousel-control-next"
//               onClick={nextSlide}
//             >
//               <i className="bi bi-chevron-right"></i>
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
//               <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center">
//                 <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
//                   <i className="bi bi-car-front-fill text-orange-500 text-xl"></i>
//                 </div>
//                 <h6 className="text-gray-500 text-xs mb-1 font-medium">
//                   Vehicles Sold
//                 </h6>
//                 <h3 className="text-[var(--primary-blue)] text-xl font-bold">
//                   0
//                 </h3>
//                 <p className="text-green-500 text-xs mt-1 font-medium"></p>
//               </div>
//               <Link to="/credit" className="no-underline">
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
//                   <p className="text-gray-400 text-xs mt-1 font-medium">
//                     Tap to view
//                   </p>
//                 </div>
//               </Link>
//               <Link to="/invoice" className="no-underline">
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
//                   <p className="text-gray-400 text-xs mt-1 font-medium">
//                     Tap to view
//                   </p>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </section>
//         {/* Add this debug section at the top of your Dashboard */}
//         {/* <div className="bg-gray-100 p-4 mb-4 rounded-lg border">
//           <h6 className="text-sm font-semibold mb-2">🔍 API Debug Panel</h6>
//           <div className="grid grid-cols-2 gap-2 text-xs">
//             <div>
//               <span className="font-medium">Backend Status:</span>
//               <span className="ml-2 text-green-600">✓ Running</span>
//             </div>
//             <div>
//               <span className="font-medium">Token:</span>
//               <span className="ml-2">
//                 {localStorage.getItem("token") ? "✓ Present" : "✗ Missing"}
//               </span>
//             </div>
//             <div>
//               <span className="font-medium">Test Endpoint:</span>
//               <button
//                 onClick={async () => {
//                   try {
//                     const res = await axios.get(
//                       "http://localhost:8000/api/test-notifications"
//                     );
//                     console.log("Test endpoint response:", res.data);
//                     alert("Test endpoint works! Check console.");
//                   } catch (err) {
//                     alert("Test failed: " + err.message);
//                   }
//                 }}
//                 className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
//               >
//                 Test
//               </button>
//             </div>
//             <div>
//               <span className="font-medium">Real Endpoint:</span>
//               <button
//                 onClick={async () => {
//                   const token = localStorage.getItem("token");
//                   try {
//                     const res = await axios.get(
//                       "http://localhost:8000/api/executive/notifications",
//                       {
//                         headers: token
//                           ? { Authorization: `Bearer ${token}` }
//                           : {},
//                       }
//                     );
//                     console.log("Real endpoint response:", res.data);
//                     alert("Real endpoint works! Check console.");
//                   } catch (err) {
//                     console.error(
//                       "Real endpoint error:",
//                       err.response?.data || err.message
//                     );
//                     alert(
//                       "Error: " + (err.response?.data?.message || err.message)
//                     );
//                   }
//                 }}
//                 className="ml-2 bg-green-500 text-white px-2 py-1 rounded text-xs"
//               >
//                 Test
//               </button>
//             </div>
//           </div>
//         </div> */}
//         <button
//           onClick={async () => {
//             console.log("Testing auth...");

//             // Test 1: Check localStorage
//             console.log("LocalStorage contents:");
//             Object.keys(localStorage).forEach((key) => {
//               if (!key.includes(":")) {
//                 console.log(`${key}:`, localStorage.getItem(key));
//               }
//             });

//             // Test 2: Check API auth
//             try {
//               const response = await axios.get(`${API_BASE}/current-user`, {
//                 headers: getAuthHeaders(),
//               });
//               console.log("API Auth Response:", response.data);
//             } catch (err) {
//               console.error("API Auth Error:", err.response || err);
//             }
//           }}
//           className="bg-yellow-500 text-white p-2 rounded"
//         >
//           Debug Auth
//         </button>
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
//               <Link to="/total-claim" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-clipboard-data text-primary-blue text-base"></i>{" "}
//                     Total
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">0</h3>
//                 </div>
//               </Link>
//               <Link to="/successful-claim" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-check-circle text-green-500 text-base"></i>{" "}
//                     Approved
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">0</h3>
//                 </div>
//               </Link>
//               <Link to="/disputed-claim" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-exclamation-triangle text-orange-500 text-base"></i>{" "}
//                     Disputed
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">0</h3>
//                 </div>
//               </Link>
//               <Link to="/rejected-claim" className="no-underline">
//                 <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
//                   <h6 className="text-gray-500 text-xs mb-2">
//                     <i className="bi bi-x-circle text-red-500 text-base"></i>{" "}
//                     Rejected
//                   </h6>
//                   <h3 className="text-[var(--primary-blue)] text-xl mb-0">0</h3>
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </section>
//         {/* Notifications Section */}
//         <section className="p-4 md:p-6 xl:p-8">
//           <div className="bg-white rounded-lg p-6 shadow-sm">
//             <h5 className="mb-4 text-[var(--primary-blue)] text-lg font-semibold">
//               Notifications
//             </h5>

//             {notificationsLoading ? (
//               <div className="flex justify-center py-8">
//                 <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
//               </div>
//             ) : notificationsError ? (
//               <div className="text-center text-red-500 py-4">
//                 {notificationsError}
//               </div>
//             ) : notifications.length === 0 ? (
//               <div className="text-center text-gray-500 py-8">
//                 No new notifications
//               </div>
//             ) : (
//               <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {notifications.map((notif, index) => (
//                   <div
//                     key={index}
//                     className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                   >
//                     <div className="flex-shrink-0 mr-3">
//                       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
//                         <i className="bi bi-bell text-blue-600"></i>
//                       </div>
//                     </div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-800">
//                         {notif.message}
//                       </p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {new Date(notif.created_at).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
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
//             Vehicle Brands{" "}
//             {brandWiseVehicles.length > 0 && `(${brandWiseVehicles.length})`}
//           </h5>

//           {brandWiseVehicles.length === 0 && (
//             <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
//               <i className="bi bi-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
//               <p className="text-yellow-700 font-medium">
//                 No vehicle brands found
//               </p>
//               <button
//                 onClick={() => window.location.reload()}
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
import {
  Skeleton,
  SkeletonCard,
  SkeletonBrandCard,
  SkeletonCarousel,
} from "../components/SkeletonLoader";

const API_BASE = "http://localhost:8000/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  "Content-Type": "application/json",
  Accept: "application/json",
});

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

export default function Dashboard() {
  const [leadStats, setLeadStats] = useState({
    drafts: 0,
    open: 0,
    converted: 0,
    unrealized: 0,
  });
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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [
          draftRes,
          openRes,
          convertedRes,
          unrealizedRes,
          galleriesRes,
          brandsRes,
        ] = await Promise.all([
          axios.get("http://localhost:8000/api/lead-details/draft"),
          axios.get("http://localhost:8000/api/lead-details/open"),
          axios.get("http://localhost:8000/api/leads?status=converted"),
          axios.get("http://localhost:8000/api/leads?status=Unrealized"),
          axios.get("http://localhost:8000/api/galleries"),
          axios.get("http://localhost:8000/api/brands"),
        ]);

        let galleriesData =
          galleriesRes.data.data ||
          galleriesRes.data.galleries ||
          galleriesRes.data ||
          [];
        let brandsData = brandsRes.data.data || brandsRes.data || [];

        setLeadStats({
          drafts: draftRes.data.data?.length || 0,
          open: openRes.data.data || 0,
          converted: convertedRes.data.length || 0,
          unrealized: unrealizedRes.data.length || 0,
        });
        setGalleries(galleriesData);
        setBrands(brandsData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const getBrandWiseVehicles = () => {
    const brandMap = new Map();
    galleries.forEach((gallery) => {
      const brandId = gallery.brand_id;
      if (!brandId) return;
      const brandName =
        getBrandNameFromBrands(brandId) || getBrandName(gallery);
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

  const getBrandNameFromBrands = (brandId) =>
    brands.find((b) => b.id === brandId)?.name;
  const getBrandName = (gallery) =>
    gallery.brand_name || gallery.brand?.name || "Unknown Brand";

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev < carouselItems.length - 1 ? prev + 1 : 0
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : carouselItems.length - 1));
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev < carouselItems.length - 1 ? prev + 1 : 0));

  const getVariantName = (variant) =>
    variant.name ||
    variant.variant_name ||
    variant.model_name ||
    variant.title ||
    `Variant ${variant.id || ""}`;

  const brandWiseVehicles = getBrandWiseVehicles();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-600 font-medium">Loading Dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <i className="bi bi-exclamation-triangle text-red-500 text-4xl"></i>
        <p className="text-red-500 text-lg font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <Container>
      <div className="bg-gray-100 font-sans text-sm min-h-screen">
        {/* Drawer Menu */}
        <div
          className={`fixed top-0 -left-64 w-64 h-full bg-white shadow-lg transition-all duration-300 z-[1000] pt-20 ${
            drawerOpen ? "left-0" : "-left-64"
          }`}
          id="drawerMenu"
        >
          <img
            src="assets/images/logo/bajaj-icon1.svg"
            alt="Bajaj Logo"
            className="absolute top-2.5 left-2.5 h-[50px]"
          />
          <button
            className="absolute top-2.5 right-2.5 text-2xl bg-transparent border-none text-red-600 cursor-pointer z-[1002]"
            onClick={closeDrawer}
          >
            <i className="bi bi-x"></i>
          </button>
          <ul className="list-none p-0 m-0">
            <li className="p-2.5 px-5">
              <Link
                to="#"
                className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
              >
                <i className="bi bi-house-door-fill mr-2.5"></i> Home
              </Link>
            </li>
            <li className="p-2.5 px-5">
              <Link
                to="#"
                className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
              >
                <i className="bi bi-people-fill mr-2.5"></i> Leads
              </Link>
            </li>
            <li className="p-2.5 px-5">
              <Link
                to="#"
                className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
              >
                <i className="bi bi-bar-chart-fill mr-2.5"></i> Reports
              </Link>
            </li>
            <li className="p-2.5 px-5">
              <Link
                to="#"
                className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
              >
                <i className="bi bi-gear-fill mr-2.5"></i> Settings
              </Link>
            </li>
            <li className="p-2.5 px-5">
              <Link
                to="#"
                className="flex items-center text-gray-800 no-underline hover:text-[var(--primary-blue)]"
              >
                <i className="bi bi-box-arrow-right mr-2.5"></i> Logout
              </Link>
            </li>
          </ul>
        </div>
        {/* Carousel Section */}
        <section className="p-2 md:p-6 xl:p-10">
          {" "}
          <div className="carousel-container rounded-lg shadow-sm overflow-hidden">
            <div
              className="carousel-track flex transition-transform duration-600 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {carouselItems.map((item, index) => (
                <div
                  key={index}
                  className="carousel-item flex-shrink-0 w-full relative"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-48 md:h-64 object-cover rounded-lg"
                  />
                  <button className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-[var(--primary-blue)] text-white px-2.5 py-1.5 text-xs rounded-lg hover:bg-[#084a8a]">
                    Explore
                  </button>
                </div>
              ))}
            </div>
            <button
              className="carousel-control carousel-control-prev"
              onClick={prevSlide}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="carousel-control carousel-control-next"
              onClick={nextSlide}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </section>
        {/* Overview Section */}
        <section className="p-4 md:p-6 xl:p-8 py-2">
          <div className="bg-[#cae4fe] p-4 md:p-6 rounded-lg shadow-sm">
            <h5 className="mb-4 text-[var(--primary-blue)] text-lg font-semibold">
              Overview
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
                  <i className="bi bi-currency-dollar text-green-500 text-xl"></i>
                </div>
                <h6 className="text-gray-500 text-xs mb-1 font-medium">
                  Earnings
                </h6>
                <h3 className="text-[var(--primary-blue)] text-xl font-bold">
                  $0
                </h3>
                <p className="text-green-500 text-xs mt-1 font-medium">
                  0+ today
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                  <i className="bi bi-car-front-fill text-orange-500 text-xl"></i>
                </div>
                <h6 className="text-gray-500 text-xs mb-1 font-medium">
                  Vehicles Sold
                </h6>
                <h3 className="text-[var(--primary-blue)] text-xl font-bold">
                  0
                </h3>
                <p className="text-green-500 text-xs mt-1 font-medium"></p>
              </div>
              <Link to="/credit" className="no-underline">
                <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                    <i className="bi bi-file-earmark-text text-blue-500 text-xl"></i>
                  </div>
                  <h6 className="text-gray-500 text-xs mb-1 font-medium">
                    Credit Notes
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl font-bold">
                    0
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 font-medium">
                    Tap to view
                  </p>
                </div>
              </Link>
              <Link to="/invoice" className="no-underline">
                <div className="bg-white rounded-lg p-4 hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-2">
                    <i className="bi bi-receipt text-purple-500 text-xl"></i>
                  </div>
                  <h6 className="text-gray-500 text-xs mb-1 font-medium">
                    Invoices
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl font-bold">
                    0
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 font-medium">
                    Tap to view
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>
        {/* Leads Section */}
        <section className="p-2 md:p-6 xl:p-10">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h5 className="mb-3 text-[var(--primary-blue)] text-lg">Leads</h5>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <Link to="/leads/draft" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-pencil-square text-gray-600 text-base"></i>{" "}
                    Drafts
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                    {leadStats.drafts}
                  </h3>
                </div>
              </Link>
              <Link to="/leads/open" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-hourglass-split text-orange-500 text-base"></i>{" "}
                    Open
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                    {leadStats.open}
                  </h3>
                </div>
              </Link>
              <Link to="/leads/converted" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-emoji-smile text-green-500 text-base"></i>{" "}
                    Converted
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                    {leadStats.converted}
                  </h3>
                </div>
              </Link>
              <Link to="/leads/unrealized" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-emoji-frown text-red-500 text-base"></i>{" "}
                    Unrealized
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                    {leadStats.unrealized}
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </section>
        {/* Claim Section */}
        <section className="p-2 md:p-6 xl:p-10">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h5 className="mb-3 text-[var(--primary-blue)] text-lg">
              Claim | Amount
            </h5>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <Link to="/total-claim" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-clipboard-data text-primary-blue text-base"></i>{" "}
                    Total
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">0</h3>
                </div>
              </Link>
              <Link to="/successful-claim" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-check-circle text-green-500 text-base"></i>{" "}
                    Approved
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">0</h3>
                </div>
              </Link>
              <Link to="/disputed-claim" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-exclamation-triangle text-orange-500 text-base"></i>{" "}
                    Disputed
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">0</h3>
                </div>
              </Link>
              <Link to="/rejected-claim" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-x-circle text-red-500 text-base"></i>{" "}
                    Rejected
                  </h6>
                  <h3 className="text-[var(--primary-blue)] text-xl mb-0">0</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>
        {/* Recent Activity Section */}
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
        {/* Brand-wise Vehicle Models */}
        <section className="p-3 md:p-6 xl:p-10">
          <h5 className="mb-3 text-[var(--primary-blue)] text-lg">
            Vehicle Brands{" "}
            {brandWiseVehicles.length > 0 && `(${brandWiseVehicles.length})`}
          </h5>

          {brandWiseVehicles.length === 0 && (
            <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
              <i className="bi bi-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
              <p className="text-yellow-700 font-medium">
                No vehicle brands found
              </p>
              <button
                onClick={() => window.location.reload()}
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
