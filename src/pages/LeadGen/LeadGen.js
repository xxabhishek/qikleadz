// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Filter, X, ChevronLeft, ChevronRight, Star } from "lucide-react";
// import Container from "../../components/Container";
// import "./LeadGen.css";
// import Stepper from "../../components/Stepper";

// export default function LeadGen() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const [options, setOptions] = useState({
//     segments: [],
//     brands: [],
//     variants: [],
//     fuelTypes: [],
//     ccs: [],
//   });
//   const [galleries, setGalleries] = useState([]);
//   const [filters, setFilters] = useState({
//     segment: "All",
//     brand: "All",
//     variant: "All",
//     fuelType: "All",
//   });
//   const [filteredVariants, setFilteredVariants] = useState([]);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [imageErrors, setImageErrors] = useState({});
//   const [variantColorPrices, setVariantColorPrices] = useState({});
//   const formatUSD = (value) => {
//     return Number(value).toLocaleString("en-US", {
//       style: "currency",
//       currency: "USD",
//     });
//   };

//   useEffect(() => {
//     async function fetchOptions() {
//       try {
//         const [
//           segmentsRes,
//           brandsRes,
//           variantsRes,
//           fuelTypesRes,
//           ccsRes,
//           galleriesRes,
//         ] = await Promise.all([
//           axios.get("http://192.168.1.38:8000/api/vehicle-segments"),
//           axios.get("http://192.168.1.38:8000/api/brands"),
//           axios.get("http://192.168.1.38:8000/api/variants"),
//           axios.get("http://192.168.1.38:8000/api/fuel-types"),
//           axios.get("http://192.168.1.38:8000/api/ccs"),
//           axios.get("http://192.168.1.38:8000/api/galleries"),
//         ]);

//         const variants = variantsRes.data.data || variantsRes.data || [];

//         setOptions({
//           segments: segmentsRes.data.data || segmentsRes.data || [],
//           brands: brandsRes.data.data || brandsRes.data || [],
//           variants: variants,
//           fuelTypes: fuelTypesRes.data.data || fuelTypesRes.data || [],
//           ccs: ccsRes.data.data || ccsRes.data || [],
//         });

//         setFilteredVariants(variants);
//         setGalleries(galleriesRes.data.data || galleriesRes.data || []);

//         // Fetch color prices for all variants
//         await fetchColorPricesForVariants(variants);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     // Function to fetch color prices for variants
//     const fetchColorPricesForVariants = async (variants) => {
//       try {
//         const colorPricePromises = variants.map(async (variant) => {
//           try {
//             const response = await axios.get(
//               `http://192.168.1.38:8000/api/variants/${variant.id}/colors-with-prices`
//             );
//             return {
//               variantId: variant.id,
//               colorsWithPrices: response.data.data || [],
//             };
//           } catch (error) {
//             console.error(
//               `Error fetching color prices for variant ${variant.id}:`,
//               error
//             );
//             return {
//               variantId: variant.id,
//               colorsWithPrices: [],
//             };
//           }
//         });

//         const colorPricesResults = await Promise.all(colorPricePromises);

//         // Convert array to object for easy lookup
//         const colorPricesMap = {};
//         colorPricesResults.forEach((result) => {
//           colorPricesMap[result.variantId] = result.colorsWithPrices;
//         });

//         setVariantColorPrices(colorPricesMap);
//       } catch (error) {
//         console.error("Error fetching color prices:", error);
//       }
//     };

//     fetchOptions();
//   }, []);

//   // Add this useEffect to handle pre-filled data for "Add Another Vehicle"
//   useEffect(() => {
//     const loadExistingCustomerData = () => {
//       const storedCustomerData = localStorage.getItem("existingCustomerData");

//       if (storedCustomerData && location.state?.isAddingAnotherVehicle) {
//         try {
//           const customerData = JSON.parse(storedCustomerData);
//           const isRecent =
//             new Date().getTime() - customerData.timestamp < 10 * 60 * 1000;

//           if (isRecent) {
//             console.log(
//               "Loading existing customer data for adding another vehicle:",
//               customerData
//             );
//           } else {
//             localStorage.removeItem("existingCustomerData");
//           }
//         } catch (err) {
//           console.error("Error parsing stored customer data:", err);
//           localStorage.removeItem("existingCustomerData");
//         }
//       }
//     };

//     loadExistingCustomerData();
//   }, [location.state]);

//   const applyFilters = () => {
//     let result = options.variants;
//     if (filters.segment !== "All")
//       result = result.filter(
//         (v) => v.vehicle_segment_id === Number(filters.segment)
//       );
//     if (filters.brand !== "All")
//       result = result.filter((v) => v.brand_id === Number(filters.brand));
//     if (filters.variant !== "All")
//       result = result.filter((v) => v.id === Number(filters.variant));
//     if (filters.fuelType !== "All")
//       result = result.filter(
//         (v) => v.fuel_type_id === Number(filters.fuelType)
//       );

//     setFilteredVariants(result);
//     setIsFilterOpen(false);
//   };

//   const resetFilters = () => {
//     setFilters({
//       segment: "All",
//       brand: "All",
//       variant: "All",
//       fuelType: "All",
//     });
//     setFilteredVariants(options.variants);
//     setSelectedVariant(null);
//     setIsFilterOpen(false);
//   };

//   const getCCName = (id) => options.ccs.find((c) => c.id === id)?.name || "N/A";
//   const getFuelName = (id) =>
//     options.fuelTypes.find((f) => f.id === id)?.name || "N/A";
//   const getBrandName = (id) =>
//     options.brands.find((b) => b.id === id)?.name || "N/A";

//   // Get price range for variant based on color prices
//   const getVariantPriceRange = (variantId) => {
//     const colors = variantColorPrices[variantId] || [];

//     if (colors.length === 0) {
//       return null;
//     }

//     const prices = colors.map((color) => color.price);
//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);

//     // If all colors have same price, return single price
//     if (minPrice === maxPrice) {
//       return `₹${parseFloat(minPrice).toLocaleString()}`;
//     }

//     // If different prices, return range
//     return `₹${parseFloat(minPrice).toLocaleString()} - ₹${parseFloat(
//       maxPrice
//     ).toLocaleString()}`;
//   };

//   // Check if variant has premium colors

//   // Get available colors count
//   const getAvailableColorsCount = (variantId) => {
//     const colors = variantColorPrices[variantId] || [];
//     return colors.length;
//   };

//   const handleNext = () => {
//     if (!selectedVariant) {
//       alert("Please select a variant first!");
//       return;
//     }

//     navigate("/model-details", {
//       state: {
//         variant: selectedVariant,
//         galleries,
//         isAddingAnotherVehicle: location.state?.isAddingAnotherVehicle || false,
//         existingCustomer: location.state?.existingCustomer || null,
//         quantity: location.state?.customerData?.quantity || 1,
//         previousVehicles: location.state?.previousVehicles || [],
//       },
//     });
//   };

//   const toggleFilter = () => {
//     setIsFilterOpen(!isFilterOpen);
//   };

//   // Group variants by brand
//   const groupByBrand = () => {
//     const brands = {};
//     filteredVariants.forEach((variant) => {
//       const brandId = variant.brand_id;
//       const brandName = getBrandName(brandId);
//       if (!brands[brandId]) {
//         brands[brandId] = {
//           id: brandId,
//           name: brandName,
//           variants: [],
//         };
//       }
//       brands[brandId].variants.push(variant);
//     });
//     return Object.values(brands);
//   };

//   // Get variant image
//   const getVariantImage = (variant) => {
//     const variantGallery = galleries.find((g) => g.variant_id === variant.id);

//     if (!variantGallery?.cover_photos) {
//       return "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image";
//     }

//     let images = [];
//     try {
//       const parsed = JSON.parse(variantGallery.cover_photos);
//       images = Array.isArray(parsed) ? parsed : [parsed];
//     } catch (e) {
//       images = [variantGallery.cover_photos];
//     }

//     if (!Array.isArray(images) || images.length === 0) {
//       return "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image";
//     }

//     const firstImage = images[0];
//     let imagePath = "";

//     if (typeof firstImage === "object" && firstImage !== null) {
//       imagePath = firstImage.url || firstImage.path || firstImage.src || "";
//     } else if (typeof firstImage === "string") {
//       imagePath = firstImage;
//     } else {
//       return "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image";
//     }

//     if (imagePath.startsWith("http")) {
//       return imagePath;
//     }

//     const cleanPath = imagePath.replace(/^[\\/]+/, "");
//     return `http://192.168.1.38:8000/uploads/coverPhotos/${cleanPath}`;
//   };

//   // Handle image error
//   const handleImageError = (variantId) => {
//     setImageErrors((prev) => ({
//       ...prev,
//       [variantId]: true,
//     }));
//   };

//   // Scroll functions for horizontal scrolling
//   const scrollBrandSection = (brandId, direction) => {
//     const container = document.getElementById(`brand-scroll-${brandId}`);
//     if (container) {
//       const scrollAmount = window.innerWidth < 768 ? 140 : 200;
//       const newScrollLeft =
//         container.scrollLeft +
//         (direction === "left" ? -scrollAmount : scrollAmount);

//       container.scrollTo({
//         left: newScrollLeft,
//         behavior: "smooth",
//       });
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <Container>
//       <div className="container-animate mx-auto ">
//         {/* Mobile Filter Button */}
//         <div className="lg:hidden fixed bottom-4 right-4 z-50">
//           <button
//             onClick={toggleFilter}
//             className="bg-primary-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center shadow-xl"
//           >
//             <Filter size={20} />
//           </button>
//         </div>

//         {/* Progress Indicator */}
//         <Stepper step={1} />

//         {/* Form Container */}
//         <section className="p-3 sm:p-4 md:p-6">
//           <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//             {/* Header */}
//             <div className="bg-primary-blue text-white p-4">
//               <div className="flex items-center justify-between">
//                 <h5 className="text-base font-semibold">
//                   New Lead Information
//                 </h5>
//                 <button
//                   onClick={toggleFilter}
//                   className="lg:hidden bg-white/20 hover:bg-white/30 p-1.5 rounded transition-colors"
//                 >
//                   <Filter size={16} />
//                 </button>
//               </div>
//             </div>

//             <div className="p-4 sm:p-5">
//               <h4 className="mb-4 text-primary-blue text-lg font-semibold">
//                 Select Vehicle
//               </h4>

//               {/* Desktop Filters */}
//               <div className="hidden lg:block bg-gray-50 p-4 rounded-lg mb-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//                   {/* Vehicle Segment */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Vehicle Segment
//                     </label>
//                     <select
//                       value={filters.segment}
//                       onChange={(e) =>
//                         setFilters({ ...filters, segment: e.target.value })
//                       }
//                       className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
//                     >
//                       <option value="All">All</option>
//                       {options.segments.map((s) => (
//                         <option key={s.id} value={s.id}>
//                           {s.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Brand */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Brand
//                     </label>
//                     <select
//                       value={filters.brand}
//                       onChange={(e) =>
//                         setFilters({ ...filters, brand: e.target.value })
//                       }
//                       className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
//                     >
//                       <option value="All">All</option>
//                       {options.brands.map((b) => (
//                         <option key={b.id} value={b.id}>
//                           {b.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Variant */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Variant
//                     </label>
//                     <select
//                       value={filters.variant}
//                       onChange={(e) =>
//                         setFilters({ ...filters, variant: e.target.value })
//                       }
//                       className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
//                     >
//                       <option value="All">All</option>
//                       {options.variants.map((v) => (
//                         <option key={v.id} value={v.id}>
//                           {v.name || v.variant_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Fuel Type */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Fuel Type
//                     </label>
//                     <select
//                       value={filters.fuelType}
//                       onChange={(e) =>
//                         setFilters({ ...filters, fuelType: e.target.value })
//                       }
//                       className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
//                     >
//                       <option value="All">All</option>
//                       {options.fuelTypes.map((f) => (
//                         <option key={f.id} value={f.id}>
//                           {f.name || f.fuel_type}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-end mt-4 gap-2">
//                   <button
//                     onClick={resetFilters}
//                     className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-300 transition-colors"
//                   >
//                     Reset
//                   </button>
//                   <button
//                     onClick={applyFilters}
//                     className="bg-primary-blue text-white rounded-lg px-4 py-2 text-sm hover:bg-hover-blue transition-colors"
//                   >
//                     Apply Filters
//                   </button>
//                 </div>
//               </div>

//               {/* Mobile Filter Overlay */}
//               {isFilterOpen && (
//                 <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
//                   <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto animate-slide-up">
//                     <div className="bg-primary-blue text-white p-4 rounded-t-2xl sm:rounded-t-xl sticky top-0">
//                       <div className="flex items-center justify-between">
//                         <h5 className="text-lg font-semibold">Filters</h5>
//                         <button
//                           onClick={() => setIsFilterOpen(false)}
//                           className="text-white hover:text-gray-200 p-1"
//                         >
//                           <X size={20} />
//                         </button>
//                       </div>
//                     </div>

//                     <div className="p-4 space-y-4">
//                       {/* Vehicle Segment */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Vehicle Segment
//                         </label>
//                         <select
//                           value={filters.segment}
//                           onChange={(e) =>
//                             setFilters({ ...filters, segment: e.target.value })
//                           }
//                           className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary-blue focus:border-transparent"
//                         >
//                           <option value="All">All</option>
//                           {options.segments.map((s) => (
//                             <option key={s.id} value={s.id}>
//                               {s.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Brand */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Brand
//                         </label>
//                         <select
//                           value={filters.brand}
//                           onChange={(e) =>
//                             setFilters({ ...filters, brand: e.target.value })
//                           }
//                           className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary-blue focus:border-transparent"
//                         >
//                           <option value="All">All</option>
//                           {options.brands.map((b) => (
//                             <option key={b.id} value={b.id}>
//                               {b.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Variant */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Variant
//                         </label>
//                         <select
//                           value={filters.variant}
//                           onChange={(e) =>
//                             setFilters({ ...filters, variant: e.target.value })
//                           }
//                           className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary-blue focus:border-transparent"
//                         >
//                           <option value="All">All</option>
//                           {options.variants.map((v) => (
//                             <option key={v.id} value={v.id}>
//                               {v.name || v.variant_name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>

//                       {/* Fuel Type */}
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Fuel Type
//                         </label>
//                         <select
//                           value={filters.fuelType}
//                           onChange={(e) =>
//                             setFilters({ ...filters, fuelType: e.target.value })
//                           }
//                           className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary-blue focus:border-transparent"
//                         >
//                           <option value="All">All</option>
//                           {options.fuelTypes.map((f) => (
//                             <option key={f.id} value={f.id}>
//                               {f.name || f.fuel_type}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2 sticky bottom-0">
//                       <button
//                         onClick={resetFilters}
//                         className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
//                       >
//                         Reset
//                       </button>
//                       <button
//                         onClick={applyFilters}
//                         className="flex-1 bg-primary-blue text-white rounded-lg px-4 py-3 text-base font-medium hover:bg-hover-blue transition-colors"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Brand-wise Model Grid */}
//               <div id="brandModelGrid" className="space-y-6">
//                 {groupByBrand().map((brand) => (
//                   <div key={brand.id} className="brand-section">
//                     {/* Enhanced Brand Header with Scroll Controls */}
//                     <div className="brand-header">
//                       <div>
//                         <span className="brand-title">{brand.name}</span>
//                         <span className="brand-count">
//                           ({brand.variants.length})
//                         </span>
//                       </div>

//                       {/* Enhanced Scroll Controls - Show only when multiple variants */}
//                       {brand.variants.length > 1 && (
//                         <div className="scroll-controls">
//                           <button
//                             onClick={() => scrollBrandSection(brand.id, "left")}
//                             className="text-gray-600 hover:text-gray-800 transition-colors"
//                             aria-label="Scroll left"
//                           >
//                             <ChevronLeft size={16} />
//                           </button>
//                           <button
//                             onClick={() =>
//                               scrollBrandSection(brand.id, "right")
//                             }
//                             className="text-gray-600 hover:text-gray-800 transition-colors"
//                             aria-label="Scroll right"
//                           >
//                             <ChevronRight size={16} />
//                           </button>
//                         </div>
//                       )}
//                     </div>

//                     {/* Enhanced Scrollable Container */}
//                     <div
//                       id={`brand-scroll-${brand.id}`}
//                       className="variant-scroll-container"
//                     >
//                       {brand.variants.map((variant) => {
//                         const isSelected = selectedVariant?.id === variant.id;
//                         const imageUrl = getVariantImage(variant);
//                         const hasImageError = imageErrors[variant.id];
//                         const priceRange = getVariantPriceRange(variant.id);
//                         const colorsCount = getAvailableColorsCount(variant.id);

//                         return (
//                           <div
//                             key={variant.id}
//                             onClick={() => setSelectedVariant(variant)}
//                             className={`model-card border-primary-300 ${
//                               isSelected ? "bg-blue-50 shadow-sm" : "bg-white"
//                             }`}
//                           >
//                             {/* Image Container */}
//                             <div className="image-container">
//                               <img
//                                 src={
//                                   hasImageError
//                                     ? "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image"
//                                     : imageUrl
//                                 }
//                                 alt={variant.name || variant.variant_name}
//                                 className="model-image"
//                                 loading="lazy"
//                                 onError={() => handleImageError(variant.id)}
//                               />
//                             </div>

//                             {/* Content */}
//                             <div className="model-card-content">
//                               <h5 className="font-semibold text-gray-800 line-clamp-2 mb-0.5">
//                                 {variant.name || variant.variant_name}
//                               </h5>

//                               {/* Price Display */}
//                               <div className="mb-1">
//   {priceRange ? (
//     <p className="text-primary-blue font-medium text-sm">
//       Starting at{" "}
//       {(() => {
//         const firstPrice = priceRange.split(" - ")[0]; // get only the first price
//         const price = parseFloat(firstPrice.replace(/[^0-9.]/g, ""));
//         return `$${price.toLocaleString(undefined, {
//           minimumFractionDigits: 0,
//           maximumFractionDigits: 0,
//         })}*`;
//       })()}
//     </p>
//   ) : (
//     <p className="text-primary-blue font-medium text-sm">
//       {variant.basic_price
//         ? `$${parseFloat(variant.basic_price).toLocaleString(undefined, {
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//           })}*`
//         : "Price on request"}
//     </p>
//   )}
// </div>

//                               {/* Color and Spec Info */}
//                               <div className="space-y-0.5">
//                                 <p className="text-gray-500 text-xs">
//                                   {getFuelName(variant.fuel_type_id)} |{" "}
//                                   {getCCName(variant.cc_id)}
//                                 </p>
//                                 {/* {colorsCount > 0 && (
//                                   <p className="text-green-600 text-xs font-medium">
//                                     {colorsCount} color
//                                     {colorsCount !== 1 ? "s" : ""} available
//                                   </p>
//                                 )} */}
//                               </div>
//                             </div>
//                           </div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* No Results */}
//               {filteredVariants.length === 0 && (
//                 <div className="text-center py-8">
//                   <div className="text-gray-400 text-4xl mb-3">🚗</div>
//                   <h3 className="text-gray-500 text-base font-medium mb-1">
//                     No vehicles found
//                   </h3>
//                   <p className="text-gray-400 text-sm mb-4">
//                     Try adjusting your filters to see more results.
//                   </p>
//                   <button
//                     onClick={resetFilters}
//                     className="bg-primary-blue text-white rounded-lg px-5 py-2 text-sm hover:bg-hover-blue transition-colors"
//                   >
//                     Reset Filters
//                   </button>
//                 </div>
//               )}

//               {/* Next Button */}
//               {filteredVariants.length > 0 && (
//                 <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
//                   <button
//                     onClick={handleNext}
//                     disabled={!selectedVariant}
//                     className={`rounded-lg px-6 py-3 text-base font-medium transition-all flex items-center ${
//                       selectedVariant
//                         ? "bg-primary-blue text-white hover:bg-hover-blue shadow-lg hover:shadow-xl active:scale-95"
//                         : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     Next
//                     <svg
//                       className="ml-2 w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>
//       </div>
//     </Container>
//   );

//   function Loader() {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
//         <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
//         <span className="text-gray-600 font-medium">Loading...</span>
//       </div>
//     );
//   }
// }

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "../../components/Container";
import "./LeadGen.css";
import Stepper from "../../components/Stepper";
import Footer from "../../components/Layout/Footer";

export default function LeadGen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [options, setOptions] = useState({
    segments: [],
    brands: [],
    variants: [],
    fuelTypes: [],
    ccs: [],
  });
  const [galleries, setGalleries] = useState([]);
  const [filters, setFilters] = useState({
    segment: "All",
    brand: "All",
    variant: "All",
    fuelType: "All",
  });
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [variantColorPrices, setVariantColorPrices] = useState({});

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [
          segmentsRes,
          brandsRes,
          variantsRes,
          fuelTypesRes,
          ccsRes,
          galleriesRes,
        ] = await Promise.all([
          axios.get("http://192.168.1.38:8000/api/vehicle-segments"),
          axios.get("http://192.168.1.38:8000/api/brands"),
          axios.get("http://192.168.1.38:8000/api/variants"),
          axios.get("http://192.168.1.38:8000/api/fuel-types"),
          axios.get("http://192.168.1.38:8000/api/ccs"),
          axios.get("http://192.168.1.38:8000/api/galleries"),
        ]);
        const variants = variantsRes.data.data || variantsRes.data || [];
        const brands = brandsRes.data.data || brandsRes.data || [];
        const fuelTypes = fuelTypesRes.data.data || fuelTypesRes.data || [];
        const ccs = ccsRes.data.data || ccsRes.data || [];
        setOptions({
          segments: segmentsRes.data.data || segmentsRes.data || [],
          brands: brands,
          variants: variants,
          fuelTypes: fuelTypes,
          ccs: ccs,
        });
        setFilteredVariants(variants);
        setGalleries(galleriesRes.data.data || galleriesRes.data || []);
        // Fetch color prices for all variants
        await fetchColorPricesForVariants(variants);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    const fetchColorPricesForVariants = async (variants) => {
      try {
        const colorPricePromises = variants.map(async (variant) => {
          try {
            const response = await axios.get(
              `http://192.168.1.38:8000/api/variants/${variant.id}/colors-with-prices`
            );
            return {
              variantId: variant.id,
              colorsWithPrices: response.data.data || [],
            };
          } catch (error) {
            console.error(
              `Error fetching color prices for variant ${variant.id}:`,
              error
            );
            return {
              variantId: variant.id,
              colorsWithPrices: [],
            };
          }
        });
        const colorPricesResults = await Promise.all(colorPricePromises);
        const colorPricesMap = {};
        colorPricesResults.forEach((result) => {
          colorPricesMap[result.variantId] = result.colorsWithPrices;
        });
        setVariantColorPrices(colorPricesMap);
      } catch (error) {
        console.error("Error fetching color prices:", error);
      }
    };
    fetchOptions();
  }, []);

  useEffect(() => {
    const loadExistingCustomerData = () => {
      const storedCustomerData = localStorage.getItem("existingCustomerData");
      if (storedCustomerData && location.state?.isAddingAnotherVehicle) {
        try {
          const customerData = JSON.parse(storedCustomerData);
          const isRecent =
            new Date().getTime() - customerData.timestamp < 10 * 60 * 1000;
          if (isRecent) {
            console.log(
              "Loading existing customer data for adding another vehicle:",
              customerData
            );
          } else {
            localStorage.removeItem("existingCustomerData");
          }
        } catch (err) {
          console.error("Error parsing stored customer data:", err);
          localStorage.removeItem("existingCustomerData");
        }
      }
    };
    loadExistingCustomerData();
  }, [location.state]);

  const applyFilters = () => {
    let result = options.variants;
    if (filters.segment !== "All")
      result = result.filter(
        (v) => v.vehicle_segment_id === Number(filters.segment)
      );
    if (filters.brand !== "All")
      result = result.filter((v) => v.brand_id === Number(filters.brand));
    if (filters.variant !== "All")
      result = result.filter((v) => v.id === Number(filters.variant));
    if (filters.fuelType !== "All")
      result = result.filter(
        (v) => v.fuel_type_id === Number(filters.fuelType)
      );
    setFilteredVariants(result);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      segment: "All",
      brand: "All",
      variant: "All",
      fuelType: "All",
    });
    setFilteredVariants(options.variants);
    setSelectedVariant(null);
    setIsFilterOpen(false);
  };

  const getCCName = (id) => options.ccs.find((c) => c.id === id)?.name || "N/A";
  const getFuelName = (id) =>
    options.fuelTypes.find((f) => f.id === id)?.name || "N/A";
  const getBrandName = (id) =>
    options.brands.find((b) => b.id === id)?.name || "N/A";

  const getVariantPriceRange = (variantId) => {
    const colors = variantColorPrices[variantId] || [];
    if (colors.length === 0) {
      return null;
    }
    const prices = colors.map((color) => color.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    if (minPrice === maxPrice) {
      return `₹${parseFloat(minPrice).toLocaleString()}`;
    }
    return `₹${parseFloat(minPrice).toLocaleString()} - ₹${parseFloat(
      maxPrice
    ).toLocaleString()}`;
  };

  const getAvailableColorsCount = (variantId) => {
    const colors = variantColorPrices[variantId] || [];
    return colors.length;
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    // Automatically navigate to model-details when variant is selected
    navigate("/model-details", {
      state: {
        variant: variant,
        galleries: galleries,
        brands: options.brands,
        fuelTypes: options.fuelTypes,
        ccs: options.ccs,
        isAddingAnotherVehicle: location.state?.isAddingAnotherVehicle || false,
        existingCustomer: location.state?.existingCustomer || null,
        quantity: location.state?.customerData?.quantity || 1,
        previousVehicles: location.state?.previousVehicles || [],
      },
    });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const groupByBrand = () => {
    const brands = {};
    filteredVariants.forEach((variant) => {
      const brandId = variant.brand_id;
      const brandName = getBrandName(brandId);
      if (!brands[brandId]) {
        brands[brandId] = {
          id: brandId,
          name: brandName,
          variants: [],
        };
      }
      brands[brandId].variants.push(variant);
    });
    return Object.values(brands);
  };

  const getVariantImage = (variant) => {
    console.log("🔍 Getting image for variant:", variant.id, variant.name);

    // Find the gallery entry for this variant
    const variantGallery = galleries.find((g) => g.variant_id === variant.id);

    console.log("📸 Found gallery:", variantGallery);

    if (!variantGallery) {
      console.log("❌ No gallery found for variant");
      return "https://via.placeholder.com/300x200/f3f4f6/6b7280?text=No+Image";
    }

    // Priority 1: Use first_image if available
    if (variantGallery.first_image) {
      console.log("✅ Using first_image:", variantGallery.first_image);
      return variantGallery.first_image;
    }

    // Priority 2: Use cover_photo_urls[0] if available
    if (
      variantGallery.cover_photo_urls &&
      Array.isArray(variantGallery.cover_photo_urls) &&
      variantGallery.cover_photo_urls.length > 0
    ) {
      console.log(
        "✅ Using cover_photo_urls[0]:",
        variantGallery.cover_photo_urls[0]
      );
      return variantGallery.cover_photo_urls[0];
    }

    // Priority 3: Construct from cover_photos with galleries path
    if (variantGallery.cover_photos) {
      console.log("📸 Processing cover_photos:", variantGallery.cover_photos);

      let firstPhoto = null;

      // Handle JSON string format
      if (
        typeof variantGallery.cover_photos === "string" &&
        variantGallery.cover_photos.startsWith("[")
      ) {
        try {
          const parsed = JSON.parse(variantGallery.cover_photos);
          if (Array.isArray(parsed) && parsed.length > 0) {
            firstPhoto = parsed[0];
          }
        } catch (e) {
          console.error("JSON parse error:", e);
        }
      }
      // Handle array format
      else if (
        Array.isArray(variantGallery.cover_photos) &&
        variantGallery.cover_photos.length > 0
      ) {
        firstPhoto = variantGallery.cover_photos[0];
      }

      if (firstPhoto) {
        // Clean the filename
        let filename = String(firstPhoto)
          .replace(/[\[\]"\']/g, "")
          .trim();

        // Check if it's already a full URL
        if (filename.startsWith("http")) {
          return filename;
        }

        // Use the correct path - based on your earlier debug logs
        const imageUrl = `http://192.168.1.38:8000/storage/galleries/${filename}`;
        console.log("🔗 Constructed URL:", imageUrl);
        return imageUrl;
      }
    }

    // Priority 4: Use image_base_url if available
    if (variantGallery.image_base_url && variantGallery.cover_photos) {
      let firstPhoto = null;

      // Get first photo (handling JSON string or array)
      if (
        typeof variantGallery.cover_photos === "string" &&
        variantGallery.cover_photos.startsWith("[")
      ) {
        try {
          const parsed = JSON.parse(variantGallery.cover_photos);
          firstPhoto = parsed[0];
        } catch (e) {
          console.error("Error parsing:", e);
        }
      } else if (Array.isArray(variantGallery.cover_photos)) {
        firstPhoto = variantGallery.cover_photos[0];
      }

      if (firstPhoto) {
        const filename = String(firstPhoto)
          .replace(/[\[\]"\']/g, "")
          .trim();
        const imageUrl = `${variantGallery.image_base_url}${filename}`;
        console.log("🔗 Using image_base_url:", imageUrl);
        return imageUrl;
      }
    }

    console.log("⚠️ No image found, using placeholder");
    return "https://via.placeholder.com/300x200/f3f4f6/6b7280?text=No+Image";
  };

  const handleImageError = (variantId) => {
    setImageErrors((prev) => ({
      ...prev,
      [variantId]: true,
    }));
  };

  const scrollBrandSection = (brandId, direction) => {
    const container = document.getElementById(`brand-scroll-${brandId}`);
    if (container) {
      const scrollAmount = window.innerWidth < 768 ? 140 : 200;
      const newScrollLeft =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  if (loading) return <Loader />;

  return (
    <Container>
      <div className="container-animate mx-auto">
        {/* Progress Indicator */}
        <Stepper step={1} />
        {/* Form Container */}
        <section className="p-3 sm:p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-7xl mx-auto">
            {/* Header - Updated to match target design */}
            <div className="page-header flex justify-between items-center p-4">
              <h5 className="text-lg font-semibold text-primary-blue">
                New Lead Information
              </h5>
              <button
                onClick={toggleFilter}
                className="rounded-md px-4 py-2 text-sm flex items-center border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
            <div className="p-4 md:p-6">
              {/* Mobile Filter Overlay */}
              {isFilterOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                    <div className="bg-white p-4 rounded-t-xl border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h5 className="text-lg font-semibold text-primary-blue">
                          Filter Vehicles
                        </h5>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Vehicle Segment
                        </label>
                        <select
                          value={filters.segment}
                          onChange={(e) =>
                            setFilters({ ...filters, segment: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        >
                          <option value="All">All</option>
                          {options.segments.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Brand
                        </label>
                        <select
                          value={filters.brand}
                          onChange={(e) =>
                            setFilters({ ...filters, brand: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        >
                          <option value="All">All</option>
                          {options.brands.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Variant
                        </label>
                        <select
                          value={filters.variant}
                          onChange={(e) =>
                            setFilters({ ...filters, variant: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        >
                          <option value="All">All</option>
                          {options.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name || v.variant_name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fuel Type
                        </label>
                        <select
                          value={filters.fuelType}
                          onChange={(e) =>
                            setFilters({ ...filters, fuelType: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        >
                          <option value="All">All</option>
                          {options.fuelTypes.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name || f.fuel_type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
                      <button
                        onClick={resetFilters}
                        className="flex-1 bg-white text-gray-700 border border-gray-300 rounded-lg px-4 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex-1 bg-primary-blue text-white rounded-lg px-4 py-3 text-base font-medium hover:bg-hover-blue transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Brand-wise Model Grid - Updated with exact target styling */}
              <div id="brandModelGrid" className="space-y-6">
                {groupByBrand().map((brand) => (
                  <div key={brand.id} className="brand-section">
                    {/* Brand Header */}
                    <div className="brand-header">
                      <h3 className="text-primary-blue text-lg font-semibold mb-3">
                        {brand.name}
                      </h3>
                    </div>
                    {/* Scrollable Container */}
                    <div
                      id={`brand-scroll-${brand.id}`}
                      className="variant-scroll-container custom-scrollbar"
                    >
                      {brand.variants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id;
                        const imageUrl = getVariantImage(variant);
                        const hasImageError = imageErrors[variant.id];
                        const priceRange = getVariantPriceRange(variant.id);
                        return (
                          <div
                            key={variant.id}
                            onClick={() => handleVariantSelect(variant)}
                            className={`variant-card model-card bg-white p-4 rounded-lg border border-gray-200 ${
                              isSelected ? "selected" : ""
                            }`}
                            data-model-id={variant.id}
                          >
                            <img
                              key={imageUrl}
                              src={imageUrl}
                              alt={variant.name || variant.variant_name}
                              className="w-full h-40 object-contain mb-3 bg-white rounded-lg p-4"
                              loading="lazy"
                              onError={(e) => {
                                console.error(
                                  "Image failed to load:",
                                  imageUrl
                                );
                                e.target.src =
                                  "https://via.placeholder.com/300x200/f44336/ffffff?text=NO+IMAGE";
                              }}
                              onLoad={() =>
                                console.log("Image loaded:", imageUrl)
                              }
                            />
                            {/* Content aligned to left */}
                            <div className="text-left w-full">
                              <h5 className="text-base font-semibold mb-1">
                                {variant.name || variant.variant_name}
                              </h5>
                              <p className="model-price text-sm text-gray-600">
                                Starting On-Road Price *:{" "}
                                <span className="on-road-price text-primary-blue font-semibold">
                                  {priceRange
                                    ? (() => {
                                        const firstPrice =
                                          priceRange.split(" - ")[0];
                                        const price = parseFloat(
                                          firstPrice.replace(/[^0-9.]/g, "")
                                        );
                                        return `$${price.toLocaleString(
                                          undefined,
                                          {
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                          }
                                        )}`;
                                      })()
                                    : variant.basic_price
                                    ? `$${parseFloat(
                                        variant.basic_price
                                      ).toLocaleString(undefined, {
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      })}`
                                    : "Price on request"}
                                </span>
                              </p>
                              <p className="model-price text-sm text-gray-600">
                                {getCCName(variant.cc_id)} {"cc"}
                              </p>
                              <p></p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {/* No Results */}
              {filteredVariants.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-3">🏍️</div>
                  <h3 className="text-gray-500 text-base font-medium mb-1">
                    No vehicles found
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Try adjusting your filters to see more results.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="bg-primary-blue text-white rounded-lg px-5 py-2 text-sm hover:bg-hover-blue transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </Container>
  );
}

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <span className="text-gray-600 font-medium">Loading...</span>
    </div>
  );
}
