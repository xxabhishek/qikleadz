// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Stepper from "../../components/Stepper";
// import axios from "axios";
// import LightGallery from "lightgallery/react";
// import lgThumbnail from "lightgallery/plugins/thumbnail";
// import lgZoom from "lightgallery/plugins/zoom";
// import lgVideo from "lightgallery/plugins/video";
// import "lightgallery/css/lightgallery.css";
// import "lightgallery/css/lg-zoom.css";
// import "lightgallery/css/lg-thumbnail.css";
// import "lightgallery/css/lg-video.css";
// import "./LeadGen.css";

// export default function ModelDetails() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const {
//     variant,
//     galleries,
//     brands = [],
//     fuelTypes = [],
//     ccs = [],
//   } = location.state || {};

//   const [mainImage, setMainImage] = useState("");
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [galleryVideos, setGalleryVideos] = useState([]);
//   const [colors, setColors] = useState([]);
//   const [features, setFeatures] = useState([]);
//   const [techSpecs, setTechSpecs] = useState([]);
//   const [activeTab, setActiveTab] = useState("features");
//   const [selectedColorId, setSelectedColorId] = useState(null);
//   const [selectedColorPrice, setSelectedColorPrice] = useState(0);
//   const [formData, setFormData] = useState({
//     quantity: 1,
//     paymentMode: "cash",
//   });

//   // Helper function to get absolute URL for videos
//   const getAbsoluteVideoUrl = (videoPath) => {
//     if (!videoPath) return null;

//     if (videoPath.startsWith("http://") || videoPath.startsWith("https://")) {
//       return videoPath;
//     }

//     if (videoPath.startsWith("/")) {
//       return `http://localhost:8000${videoPath}`;
//     }

//     const cleanPath = videoPath.replace(/^[\\/]+/, "");
//     return `http://localhost:8000/uploads/coverPhotos/${cleanPath}`;
//   };

//   useEffect(() => {
//     if (!variant) {
//       navigate("/");
//       return;
//     }

//     const passedQuantity = location.state?.quantity;
//     const initialQuantity = location.state?.isAddingAnotherVehicle
//       ? 1
//       : passedQuantity || 1;

//     if (passedQuantity && passedQuantity !== formData.quantity) {
//       setFormData((prev) => ({
//         ...prev,
//         quantity: passedQuantity,
//       }));
//     }

//     // Fetch colors with prices for this variant
//     const fetchColorsWithPrices = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:8000/api/variants/${variant.id}/colors-with-prices`
//         );
//         const colorsWithPrices = response.data.data || [];

//         setColors(colorsWithPrices);

//         // Auto-select first color if available
//         if (colorsWithPrices.length > 0) {
//           const defaultColor = colorsWithPrices[0];
//           setSelectedColorId(defaultColor.id);
//           setSelectedColorPrice(defaultColor.price);

//           // Update gallery for selected color
//           updateGalleryForColor(defaultColor.id);
//         }
//       } catch (error) {
//         console.error("Error fetching colors with prices:", error);
//       }
//     };

//     fetchColorsWithPrices();

//     // Features
//     setFeatures(variant.features || ["Feature 1", "Feature 2"]);

//     // Fetch Tech Specs from API
//     const fetchTechSpecs = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/tech-specs");
//         const allSpecs = res.data;

//         const key = `${variant.brand_id}-${variant.id}`;
//         const specsForVariant = allSpecs[key] || [];

//         const techs = specsForVariant.map((spec) => ({
//           key: spec.title,
//           value: spec.description.replace(/<\/?[^>]+(>|$)/g, ""),
//         }));

//         techs.unshift(
//           {
//             key: "Brand",
//             value:
//               specsForVariant[0]?.brand?.name ||
//               brands.find((b) => b.id === variant.brand_id)?.name ||
//               variant.brand_id,
//           },
//           {
//             key: "CC",
//             value:
//               ccs.find((c) => c.id === variant.cc_id)?.name || variant.cc_id,
//           },
//           {
//             key: "Fuel",
//             value:
//               fuelTypes.find((f) => f.id === variant.fuel_type_id)?.name ||
//               variant.fuel_type_id,
//           },
//           {
//             key: "Base Price",
//             value: variant.basic_price
//               ? `₹${parseFloat(variant.basic_price).toLocaleString()}`
//               : "Price on request",
//           }
//         );

//         setTechSpecs(techs);
//       } catch (err) {
//         console.error("Error fetching tech specs:", err);
//       }
//     };

//     fetchTechSpecs();
//   }, [
//     variant,
//     location.state?.quantity,
//     location.state?.isAddingAnotherVehicle,
//   ]);

//   const updateGalleryForColor = (colorId) => {
//     const matchedGalleries = galleries.filter(
//       (g) => g.variant_id === variant.id && g.color_id === colorId
//     );
//     setGalleryImages(matchedGalleries);

//     // Update videos for selected color
//     const colorVideos = [];
//     matchedGalleries.forEach((gallery) => {
//       if (gallery.upload_videos) {
//         try {
//           const videoData = JSON.parse(gallery.upload_videos);
//           if (Array.isArray(videoData)) {
//             videoData.forEach((video) => {
//               if (video && typeof video === "string") {
//                 colorVideos.push({
//                   url: getAbsoluteVideoUrl(video),
//                   galleryId: gallery.id,
//                   colorId: gallery.color_id,
//                 });
//               }
//             });
//           } else if (typeof videoData === "string" && videoData.trim() !== "") {
//             colorVideos.push({
//               url: getAbsoluteVideoUrl(videoData),
//               galleryId: gallery.id,
//               colorId: gallery.color_id,
//             });
//           }
//         } catch (e) {
//           if (gallery.upload_videos.trim() !== "") {
//             colorVideos.push({
//               url: getAbsoluteVideoUrl(gallery.upload_videos),
//               galleryId: gallery.id,
//               colorId: gallery.color_id,
//             });
//           }
//         }
//       }
//     });
//     setGalleryVideos(colorVideos);

//     if (matchedGalleries.length > 0) {
//       let photos = [];
//       try {
//         photos = JSON.parse(matchedGalleries[0].cover_photos);
//         if (!Array.isArray(photos)) {
//           photos = [matchedGalleries[0].cover_photos];
//         }
//       } catch (e) {
//         photos = [matchedGalleries[0].cover_photos];
//       }

//       if (photos.length > 0) {
//         setMainImage(`http://localhost:8000/uploads/coverPhotos/${photos[0]}`);
//       }
//     }
//   };

//   const handleColorSelect = (colorId) => {
//     setSelectedColorId(colorId);
//     const selectedColor = colors.find((c) => c.id === colorId);
//     if (selectedColor) {
//       setSelectedColorPrice(selectedColor.price);
//     }
//     updateGalleryForColor(colorId);
//   };

//   const [showColorModal, setShowColorModal] = useState(false);

//   const handleNextClick = () => {
//     if (!selectedColorId) {
//       alert("Please select a color before proceeding!");
//       return;
//     }
//     setShowColorModal(true);
//   };

//   const handleConfirmColor = () => {
//     setShowColorModal(false);

//     const selectedColor = colors.find((c) => c.id === selectedColorId);

//     navigate("/leadinformation", {
//       state: {
//         ...location.state,
//         variant: variant,
//         selectedColor: {
//           ...selectedColor,
//           price: selectedColorPrice,
//         },
//         quantity: formData.quantity,
//         colorPrice: selectedColorPrice,
//         unitPrice: selectedColorPrice,
//         galleries: galleries,
//         brands: brands,
//         fuelTypes: fuelTypes,
//         ccs: ccs,
//       },
//     });
//   };

//   const handleCancelColor = () => {
//     setShowColorModal(false);
//   };

//   // Calculate total price based on selected color and quantity
//   const totalPrice = selectedColorPrice * formData.quantity;

//   return (
//     <div className="w-full px-2 md:px-6 mb-3">
//       <Stepper step={2} />

//       {/* Header */}
//       <div className="bg-[#0f66af] text-white py-4 rounded-t-lg p-4 sm:p-5 mt-3">
//         <h2 className="text-lg font-semibold">New Lead Information</h2>
//       </div>

//       {/* Card */}
//       <div className="bg-white shadow-md rounded-b-lg p-4 md:p-6">
//         {/* Back Button */}
//         <button
//           onClick={() => navigate(-1)}
//           className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 mb-4 text-sm hover:bg-gray-200 transition-colors flex items-center"
//         >
//           ← Back
//         </button>

//         {/* Model Details */}
//         <h3 className="text-xl font-semibold text-[#0f66af] mb-4">
//           {variant ? ` ${variant.name}` : ""}
//         </h3>

//         <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 md:gap-6">
//           {/* Main Image and Thumbnails */}
//           <div className="bg-blue-50 rounded-lg p-2 md:p-4 flex flex-col items-center">
//             <LightGallery
//               speed={500}
//               plugins={[lgThumbnail, lgZoom, lgVideo]}
//               elementClassNames="flex justify-center w-full"
//             >
//               {/* Main Image */}
//               <a
//                 href={mainImage || "https://via.placeholder.com/300"}
//                 key="main-image"
//               >
//                 <img
//                   src={mainImage || "https://via.placeholder.com/300"}
//                   alt="Main Model"
//                   className="max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px] w-full h-auto object-contain cursor-pointer"
//                 />
//               </a>

//               {/* Hidden images for lightbox */}
//               {galleryImages.map((g, idx) => {
//                 let photos = [];
//                 try {
//                   photos = JSON.parse(g.cover_photos);
//                   if (!Array.isArray(photos)) photos = [g.cover_photos];
//                 } catch (e) {
//                   photos = [g.cover_photos];
//                 }

//                 return photos.map((photo, photoIdx) => {
//                   const photoUrl = `http://localhost:8000/uploads/coverPhotos/${photo}`;
//                   if (photoUrl === mainImage) return null;
//                   return (
//                     <a href={photoUrl} key={`img-${idx}-${photoIdx}`}>
//                       <img src={photoUrl} alt="" className="hidden" />
//                     </a>
//                   );
//                 });
//               })}

//               {/* Videos for lightbox */}
//               {galleryVideos.map((video, idx) => (
//                 <a
//                   key={`video-${idx}`}
//                   data-lg-size="1920-1080"
//                   data-video={`{"source": [{"src":"${video.url}", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true}}`}
//                   data-poster={mainImage}
//                 >
//                   <img
//                     src={mainImage || "https://via.placeholder.com/300"}
//                     alt="Video Thumbnail"
//                     className="hidden"
//                   />
//                 </a>
//               ))}
//             </LightGallery>
//           </div>

//           {/* Vertical Thumbnail Bar */}
//           <div className="rounded-lg p-2 md:p-4">
//             <h5 className="text-lg font-medium mb-3">Gallery</h5>
//             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//               {/* Image Thumbnails */}
//               {galleryImages.flatMap((g, idx) => {
//                 let photos = [];
//                 try {
//                   photos = JSON.parse(g.cover_photos);
//                   if (!Array.isArray(photos)) photos = [g.cover_photos];
//                 } catch (e) {
//                   photos = [g.cover_photos];
//                 }

//                 return photos.map((photo, photoIdx) => {
//                   const photoUrl = `http://localhost:8000/uploads/coverPhotos/${photo}`;
//                   return (
//                     <img
//                       key={`img-thumb-${idx}-${photoIdx}`}
//                       src={photoUrl}
//                       alt={`Thumbnail ${idx}-${photoIdx}`}
//                       className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105 flex-shrink-0 ${
//                         mainImage === photoUrl
//                           ? "border-2 border-[#0f66af]"
//                           : "border border-gray-300"
//                       }`}
//                       onClick={() => setMainImage(photoUrl)}
//                     />
//                   );
//                 });
//               })}

//               {/* Video Thumbnails */}
//               {galleryVideos.map((video, idx) => (
//                 <div
//                   key={`video-thumb-${idx}`}
//                   className="relative w-20 h-20 flex-shrink-0 cursor-pointer group"
//                   onClick={() => {
//                     const videoElement = document.querySelector(
//                       `[data-video*="${video.url}"]`
//                     );
//                     if (videoElement) {
//                       videoElement.click();
//                     }
//                   }}
//                 >
//                   <div className="w-20 h-20 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform">
//                     <svg
//                       className="w-8 h-8 text-gray-600"
//                       fill="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path d="M8 5v14l11-7z" />
//                     </svg>
//                   </div>
//                   <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
//                     Video
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
//             <div>
//               <h5 className="text-lg font-medium mb-3">Available Colors</h5>
//               <div className="flex flex-wrap gap-2">
//                 {colors.length > 0 ? (
//                   colors.map((c) => {
//                     const isSelected = selectedColorId === c.id;

//                     return (
//                       <div
//                         key={c.id}
//                         className={`flex flex-col items-center p-1.5 rounded-md border cursor-pointer transition-all hover:scale-105 ${
//                           isSelected
//                             ? "border-[#0f66af] bg-blue-50"
//                             : "border-gray-300"
//                         }`}
//                         onClick={() => handleColorSelect(c.id)}
//                       >
//                         {/* Smaller Color Circle */}
//                         <div
//                           className="w-8 h-8 rounded-full border border-gray-300"
//                           style={{ backgroundColor: c.color_code }}
//                         ></div>

//                         {/* Smaller Text */}
//                         <span className="text-[10px] mt-1 font-medium">
//                           {c.name}
//                         </span>

//                         {/* Price in USD with * */}
//                         <span className="text-[10px] text-green-600 font-semibold">
//                           $
//                           {Number(c.price).toLocaleString(undefined, {
//                             minimumFractionDigits: 0,
//                             maximumFractionDigits: 0,
//                           })}
//                           *
//                         </span>

//                         {/* {c.has_custom_price && (
//     <span className="text-[10px] text-orange-500">
//       Premium
//     </span>
//   )} */}
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <span className="text-gray-400 text-xs">
//                     No colors available
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div>
//               <h5 className="text-lg font-medium mb-3">Quantity & Pricing</h5>
//               <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                   <label className="text-gray-700 font-medium">Quantity:</label>
//                   <div className="flex items-center border border-gray-300 rounded-lg">
//                     <button
//                       type="button"
//                       className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
//                       onClick={() =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           quantity: Math.max(1, prev.quantity - 1),
//                         }))
//                       }
//                       disabled={formData.quantity <= 1}
//                     >
//                       -
//                     </button>
//                     <span className="px-4 py-2 min-w-12 text-center font-medium">
//                       {formData.quantity}
//                     </span>
//                     <button
//                       type="button"
//                       className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
//                       onClick={() =>
//                         setFormData((prev) => ({
//                           ...prev,
//                           quantity: prev.quantity + 1,
//                         }))
//                       }
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 {/* Price Display */}
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="text-gray-600">Unit Price:</span>
//                     <span className="font-semibold">
//                       $
//                       {selectedColorPrice
//                         ? parseFloat(selectedColorPrice).toLocaleString()
//                         : "0"}
//                       *
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Total Price:</span>
//                     <span className="text-green-600 font-bold text-lg">
//                       ${totalPrice.toLocaleString()}*
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="mt-6 border-b border-gray-200 flex gap-6 overflow-x-auto">
//           <button
//             className={`pb-2 whitespace-nowrap ${
//               activeTab === "features"
//                 ? "text-[#0f66af] border-b-2 border-[#0f66af]"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("features")}
//           >
//             Features
//           </button>
//           <button
//             className={`pb-2 whitespace-nowrap ${
//               activeTab === "tech"
//                 ? "text-[#0f66af] border-b-2 border-[#0f66af]"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("tech")}
//           >
//             Tech Specs
//           </button>
//           <button
//             className={`pb-2 whitespace-nowrap ${
//               activeTab === "brochure"
//                 ? "text-[#0f66af] border-b-2 border-[#0f66af]"
//                 : "text-gray-600"
//             }`}
//             onClick={() => setActiveTab("brochure")}
//           >
//             Brochure
//           </button>
//         </div>

//         {/* Tab Content */}
//         <div className="mt-4">
//           {activeTab === "features" ? (
//             <ul className="list-disc pl-5 space-y-2">
//               {features.map((f, idx) => (
//                 <li key={idx}>{f}</li>
//               ))}
//             </ul>
//           ) : activeTab === "tech" ? (
//             <div className="overflow-x-auto">
//               <table className="table-auto w-full">
//                 <tbody className="divide-y divide-gray-200">
//                   {techSpecs.map((spec, idx) => (
//                     <tr key={idx}>
//                       <td className="px-4 py-2 font-medium whitespace-nowrap">
//                         {spec.key}
//                       </td>
//                       <td className="px-4 py-2 break-words">{spec.value}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div>
//               {variant.brochure ? (
//                 <a
//                   href={`http://localhost:8000/uploads/brochures/${variant.brochure}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-blue-600 underline"
//                 >
//                   Brochure PDF
//                 </a>
//               ) : (
//                 <span className="text-gray-400">Brochure not available</span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Next Button */}
//         <div className="flex justify-end mt-8">
//           <button
//             onClick={handleNextClick}
//             className="bg-[#0f66af] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
//           >
//             Next →
//           </button>
//         </div>
//       </div>

//       {showColorModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
//             <div className="bg-[#0f66af] text-white p-4">
//               <h3 className="text-lg font-semibold">Confirm Selection</h3>
//             </div>
//             <div className="p-5">
//               <p className="mb-2">Please confirm your selection:</p>
//               <div className="bg-gray-50 p-3 rounded-lg flex flex-wrap gap-6 items-center">
//                 <p>
//                   <strong>Variant:</strong> {variant?.name}
//                 </p>
//                 <p>
//                   <strong>Color:</strong>{" "}
//                   {colors.find((c) => c.id === selectedColorId)?.name}
//                 </p>
//                 <p>
//                   <strong>Price:</strong> $
//                   {selectedColorPrice?.toLocaleString()}*
//                 </p>
//                 <p>
//                   <strong>Quantity:</strong> {formData.quantity}
//                 </p>
//                 <p className="font-bold text-green-600">
//                   <strong>Total:</strong> ${totalPrice.toLocaleString()}*
//                 </p>
//               </div>
//             </div>
//             <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
//               <button
//                 type="button"
//                 className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
//                 onClick={handleCancelColor}
//               >
//                 Cancel
//               </button>
//               <button
//                 type="button"
//                 className="bg-[#0f66af] text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition-colors"
//                 onClick={handleConfirmColor}
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper";
import axios from "axios";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css";
import Container from "../../components/Container";
import Footer from "../../components/Layout/Footer";
import "./LeadGen.css";

export default function ModelDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    variant,
    galleries,
    brands = [],
    fuelTypes = [],
    ccs = [],
  } = location.state || {};
  const [mainImage, setMainImage] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [colors, setColors] = useState([]);
  const [features, setFeatures] = useState([]);
  const [techSpecs, setTechSpecs] = useState([]);
  const [activeTab, setActiveTab] = useState("features");
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedColorPrice, setSelectedColorPrice] = useState(0);
  // Initialize quantity from location state or default to 1
  const [quantity, setQuantity] = useState(() => {
    const passedQuantity = location.state?.quantity;
    const isAddingAnother = location.state?.isAddingAnotherVehicle;
    return isAddingAnother ? 1 : passedQuantity || 1;
  });
  const [formData, setFormData] = useState({
    paymentMode: "cash",
  });
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [showMultipleColorModal, setShowMultipleColorModal] = useState(false);
  const [tempSelectedColors, setTempSelectedColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  // Helper function to get absolute URL for videos
  const getAbsoluteVideoUrl = (videoPath) => {
    if (!videoPath) return null;
    if (videoPath.startsWith("http://") || videoPath.startsWith("https://")) {
      return videoPath;
    }
    if (videoPath.startsWith("/")) {
      return `http://localhost:8000${videoPath}`;
    }
    const cleanPath = videoPath.replace(/^[\\/]+/, "");
    return `http://localhost:8000/uploads/coverPhotos/${cleanPath}`;
  };

  // Handler functions for color modal
  const handleCancelColor = () => {
    setShowColorModal(false);
  };

  const handleConfirmColor = () => {
    setShowColorModal(false);
    const selectedColor = colors.find((c) => c.id === selectedColorId);
    navigate("/leadinformation", {
      state: {
        ...location.state,
        variant: variant,
        selectedColor: {
          ...selectedColor,
          price: selectedColorPrice,
        },
        quantity: quantity,
        colorPrice: selectedColorPrice,
        unitPrice: selectedColorPrice,
        galleries: galleries,
        brands: brands,
        fuelTypes: fuelTypes,
        ccs: ccs,
      },
    });
  };

  const handleChooseDifferentColors = () => {
    setShowColorModal(false);
    // Initialize temp selected colors with current color or first available
    const currentColorName =
      colors.find((c) => c.id === selectedColorId)?.name ||
      colors[0]?.name ||
      "";
    setTempSelectedColors(Array(quantity).fill(currentColorName));
    setShowMultipleColorModal(true);
  };

  const handleKeepSameColor = () => {
    if (selectedColors.length > 0) {
      setSelectedColors(Array(quantity).fill(selectedColors[0]));
    }
    setShowColorModal(false);
    handleConfirmColor();
  };

  // Handle multiple color selection confirmation
  const handleMultipleColorConfirm = () => {
    // Validate all colors are selected
    if (tempSelectedColors.some((color) => !color)) {
      alert("Please select a color for every vehicle.");
      return;
    }
    setSelectedColors(tempSelectedColors);
    setShowMultipleColorModal(false);
    // Proceed to confirmation
    handleConfirmColor();
  };

  const handleMultipleColorBack = () => {
    setShowMultipleColorModal(false);
    // Re-open the original color confirmation modal
    setShowColorModal(true);
  };

  // Update temp selected colors for multiple modal
  const updateTempColor = (index, colorName) => {
    const updated = [...tempSelectedColors];
    updated[index] = colorName;
    setTempSelectedColors(updated);
  };

  // Function for multiple color selection (now handled via state/modal)
  const showColorSelectionForMultiple = () => {
    // This is now handled by the modal state
    return new Promise((resolve) => {
      // Resolve true on confirm (handled in handleMultipleColorConfirm)
      resolve(true);
    });
  };

  // Update selected colors when quantity changes
  useEffect(() => {
    if (selectedColorId && colors.length > 0) {
      const selectedColor = colors.find((c) => c.id === selectedColorId);
      if (selectedColor) {
        setSelectedColors(Array(quantity).fill(selectedColor.name));
      }
    }
  }, [quantity, selectedColorId, colors]);

  useEffect(() => {
    if (!variant) {
      navigate("/");
      return;
    }
    // Fetch colors with prices for this variant
    const fetchColorsWithPrices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/variants/${variant.id}/colors-with-prices`
        );
        const colorsWithPrices = response.data.data || [];
        setColors(colorsWithPrices);
        // Auto-select first color if available
        if (colorsWithPrices.length > 0) {
          const defaultColor = colorsWithPrices[0];
          setSelectedColorId(defaultColor.id);
          setSelectedColorPrice(defaultColor.price);
          setSelectedColors(Array(quantity).fill(defaultColor.name));
          // Update gallery for selected color
          updateGalleryForColor(defaultColor.id);
        }
      } catch (error) {
        console.error("Error fetching colors with prices:", error);
      }
    };
    fetchColorsWithPrices();
    // Features
    setFeatures(variant.features || ["Feature 1", "Feature 2"]);
    // Fetch Tech Specs from API
    const fetchTechSpecs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/tech-specs");
        const allSpecs = res.data;
        const key = `${variant.brand_id}-${variant.id}`;
        const specsForVariant = allSpecs[key] || [];
        const techs = specsForVariant.map((spec) => ({
          key: spec.title,
          value: spec.description.replace(/<\/?[^>]+(>|$)/g, ""),
        }));
        techs.unshift(
          {
            key: "Brand",
            value:
              specsForVariant[0]?.brand?.name ||
              brands.find((b) => b.id === variant.brand_id)?.name ||
              variant.brand_id,
          },
          {
            key: "CC",
            value:
              ccs.find((c) => c.id === variant.cc_id)?.name || variant.cc_id,
          },
          {
            key: "Fuel",
            value:
              fuelTypes.find((f) => f.id === variant.fuel_type_id)?.name ||
              variant.fuel_type_id,
          },
          {
            key: "Base Price",
            value: variant.basic_price
              ? `$${parseFloat(variant.basic_price).toLocaleString()}`
              : "Price on request",
          }
        );
        setTechSpecs(techs);
      } catch (err) {
        console.error("Error fetching tech specs:", err);
      }
    };
    fetchTechSpecs();
  }, [variant, navigate, brands, fuelTypes, ccs]);

  const updateGalleryForColor = (colorId) => {
    const matchedGalleries = galleries.filter(
      (g) => g.variant_id === variant.id && g.color_id === colorId
    );
    setGalleryImages(matchedGalleries);
    // Update videos for selected color
    const colorVideos = [];
    matchedGalleries.forEach((gallery) => {
      if (gallery.upload_videos) {
        try {
          const videoData = JSON.parse(gallery.upload_videos);
          if (Array.isArray(videoData)) {
            videoData.forEach((video) => {
              if (video && typeof video === "string") {
                colorVideos.push({
                  url: getAbsoluteVideoUrl(video),
                  galleryId: gallery.id,
                  colorId: gallery.color_id,
                });
              }
            });
          } else if (typeof videoData === "string" && videoData.trim() !== "") {
            colorVideos.push({
              url: getAbsoluteVideoUrl(videoData),
              galleryId: gallery.id,
              colorId: gallery.color_id,
            });
          }
        } catch (e) {
          if (gallery.upload_videos.trim() !== "") {
            colorVideos.push({
              url: getAbsoluteVideoUrl(gallery.upload_videos),
              galleryId: gallery.id,
              colorId: gallery.color_id,
            });
          }
        }
      }
    });
    setGalleryVideos(colorVideos);
    if (matchedGalleries.length > 0) {
      let photos = [];
      try {
        photos = JSON.parse(matchedGalleries[0].cover_photos);
        if (!Array.isArray(photos)) {
          photos = [matchedGalleries[0].cover_photos];
        }
      } catch (e) {
        photos = [matchedGalleries[0].cover_photos];
      }
      if (photos.length > 0) {
        setMainImage(`http://localhost:8000/uploads/coverPhotos/${photos[0]}`);
      }
    }
  };

  const handleColorSelect = (colorId) => {
    setSelectedColorId(colorId);
    const selectedColor = colors.find((c) => c.id === colorId);
    if (selectedColor) {
      setSelectedColorPrice(selectedColor.price);
      setSelectedColors(Array(quantity).fill(selectedColor.name));
    }
    updateGalleryForColor(colorId);
  };

  const handleNextClick = () => {
    if (!selectedColorId) {
      alert("Please select a color before proceeding!");
      return;
    }
    setShowColorModal(true);
  };

  // Quantity handlers
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value));
  };

  // Calculate total price based on selected color and quantity
  const totalPrice = selectedColorPrice * quantity;

  // Mock price breakdown data (you can replace this with actual data from your API)
  const priceBreakdown = {
    base: selectedColorPrice * 0.7, // 70% of price
    taxes: selectedColorPrice * 0.2, // 20% of price
    others: selectedColorPrice * 0.1, // 10% of price
  };

  // Get selected color name
  const selectedColorName =
    colors.find((c) => c.id === selectedColorId)?.name || "";

  return (
    <Container>
      <div>
        <Stepper step={2} />
        <section className="p-4 md:p-6 xl:p-10">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-7xl mx-auto">
            {/* Header - Updated to match target design */}
            <div className="page-header flex justify-between items-center p-4">
              <h5 className="text-lg font-semibold text-primary-blue">
                New Lead Information
              </h5>
            </div>
            <div>
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 mb-4 text-sm hover:bg-gray-200 transition-colors flex items-center"
              >
                <i className="bi bi-arrow-left mr-2"></i> Back
              </button>
              {/* Model Details */}
              <h4 className="mb-4 text-primary-blue text-xl font-semibold">
                Model Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {/* Main Image */}
                <div className="bg-light-blue p-4 rounded-lg flex items-center justify-center">
                  <LightGallery
                    speed={500}
                    plugins={[lgThumbnail, lgZoom, lgVideo]}
                    elementClassNames="flex justify-center w-full"
                  >
                    {/* Main Image */}
                    <a
                      href={mainImage || "https://via.placeholder.com/300"}
                      key="main-image"
                    >
                      <img
                        src={mainImage || "https://via.placeholder.com/300"}
                        alt="Main Model"
                        className="w-full h-64 object-contain"
                        id="mainModelImage"
                      />
                    </a>
                    {/* Hidden images for lightbox */}
                    {galleryImages.map((g, idx) => {
                      let photos = [];
                      try {
                        photos = JSON.parse(g.cover_photos);
                        if (!Array.isArray(photos)) photos = [g.cover_photos];
                      } catch (e) {
                        photos = [g.cover_photos];
                      }
                      return photos.map((photo, photoIdx) => {
                        const photoUrl = `http://localhost:8000/uploads/coverPhotos/${photo}`;
                        if (photoUrl === mainImage) return null;
                        return (
                          <a href={photoUrl} key={`img-${idx}-${photoIdx}`}>
                            <img src={photoUrl} alt="" className="hidden" />
                          </a>
                        );
                      });
                    })}
                    {/* Videos for lightbox */}
                    {galleryVideos.map((video, idx) => (
                      <a
                        key={`video-${idx}`}
                        data-lg-size="1920-1080"
                        data-video={`{"source": [{"src":"${video.url}", "type":"video/mp4"}], "attributes": {"preload": false, "controls": true}}`}
                        data-poster={mainImage}
                      >
                        <img
                          src={mainImage || "https://via.placeholder.com/300"}
                          alt="Video Thumbnail"
                          className="hidden"
                        />
                      </a>
                    ))}
                  </LightGallery>
                </div>
                {/* Gallery Section */}
                <div>
                  <div className="gallery-header">
                    <h5 className="text-lg font-medium">Gallery</h5>
                  </div>
                  <div
                    className="lightbox-gallery custom-scrollbar"
                    id="modelGallery"
                  >
                    {/* Image Thumbnails */}
                    {galleryImages.flatMap((g, idx) => {
                      let photos = [];
                      try {
                        photos = JSON.parse(g.cover_photos);
                        if (!Array.isArray(photos)) photos = [g.cover_photos];
                      } catch (e) {
                        photos = [g.cover_photos];
                      }
                      return photos.map((photo, photoIdx) => {
                        const photoUrl = `http://localhost:8000/uploads/coverPhotos/${photo}`;
                        return (
                          <img
                            key={`img-thumb-${idx}-${photoIdx}`}
                            src={photoUrl}
                            alt={`Thumbnail ${idx}-${photoIdx}`}
                            className={`lightbox-img ${
                              mainImage === photoUrl ? "active" : ""
                            }`}
                            onClick={() => setMainImage(photoUrl)}
                          />
                        );
                      });
                    })}
                    {/* Video Thumbnails */}
                    {galleryVideos.map((video, idx) => (
                      <div
                        key={`video-thumb-${idx}`}
                        className="lightbox-img relative cursor-pointer group"
                        onClick={() => {
                          const videoElement = document.querySelector(
                            `[data-video*="${video.url}"]`
                          );
                          if (videoElement) {
                            videoElement.click();
                          }
                        }}
                      >
                        <div className="w-20 h-20 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <svg
                            className="w-8 h-8 text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                          Video
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Color and Quantity Selection Section */}
              <div className="color-selection-section mb-4">
                <h5 className="text-lg font-medium mb-3">
                  Select Color & Quantity
                </h5>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h6 className="text-sm font-medium mb-2">
                      Available Colors
                    </h6>
                    <div className="flex flex-wrap gap-3" id="colorOptions">
                      {colors.length > 0 ? (
                        colors.map((c) => {
                          const isSelected = selectedColorId === c.id;
                          return (
                            <div
                              key={c.id}
                              className={`color-option w-8 h-8 rounded-full border-2 cursor-pointer ${
                                isSelected ? "selected" : ""
                              }`}
                              style={{ backgroundColor: c.color_code }}
                              onClick={() => handleColorSelect(c.id)}
                              title={c.name}
                            ></div>
                          );
                        })
                      ) : (
                        <span className="text-gray-400 text-xs">
                          No colors available
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="md:w-1/4">
                    <h6 className="text-sm font-medium mb-2">Quantity</h6>
                    <div className="quantity-control">
                      <button
                        type="button"
                        id="decreaseQty"
                        onClick={handleDecreaseQuantity}
                        disabled={quantity <= 1}
                        className="bg-gray-200 hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded-l-md transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="quantity-input w-12 h-8 text-center border-y border-gray-300"
                        id="vehicleQuantity"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                      />
                      <button
                        type="button"
                        id="increaseQty"
                        onClick={handleIncreaseQuantity}
                        className="bg-gray-200 hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded-r-md transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg hidden"
                  id="colorValidationMessage"
                >
                  <p className="text-sm text-yellow-700 flex items-center">
                    <i className="bi bi-exclamation-triangle mr-2"></i>
                    Please select a color and quantity before proceeding
                  </p>
                </div>
              </div>
              {/* Price Section with Breakdown */}
              <div className="price-section">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">*on road price</p>
                    <p
                      className="text-lg font-semibold price-clickable"
                      id="onRoadPrice"
                      onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                    >
                      $
                      {selectedColorPrice
                        ? parseFloat(selectedColorPrice).toLocaleString()
                        : "0"}
                      *
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Price</p>
                    <p
                      className="text-xl font-bold text-primary-blue"
                      id="totalPrice"
                    >
                      ${totalPrice.toLocaleString()}*
                    </p>
                  </div>
                </div>
                {/* Price Breakdown */}
                <div
                  className={`price-breakdown mt-4 ${
                    showPriceBreakdown ? "show" : ""
                  }`}
                  id="priceBreakdown"
                >
                  <h6 className="text-sm font-medium mb-2">Price Breakdown</h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Ex-Showroom Price:</span>
                      <span id="basePrice">
                        ${priceBreakdown.base.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes:</span>
                      <span id="taxesPrice">
                        ${priceBreakdown.taxes.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Others:</span>
                      <span id="othersPrice">
                        ${priceBreakdown.others.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Icon Tabs for Features, Specs, and Brochure */}
                <div className="my-4">
                  <div className="icon-tabs-container">
                    <button
                      className={`icon-tab ${
                        activeTab === "features" ? "active" : ""
                      }`}
                      data-tab="features"
                      onClick={() => setActiveTab("features")}
                    >
                      <i className="bi bi-list-check"></i>
                      <span>Features</span>
                    </button>
                    <button
                      className={`icon-tab ${
                        activeTab === "tech" ? "active" : ""
                      }`}
                      data-tab="specs"
                      onClick={() => setActiveTab("tech")}
                    >
                      <i className="bi bi-gear"></i>
                      <span>Tech Specs</span>
                    </button>
                    <button
                      className={`icon-tab ${
                        activeTab === "brochure" ? "active" : ""
                      }`}
                      data-tab="brochure"
                      onClick={() => setActiveTab("brochure")}
                    >
                      <i className="bi bi-download"></i>
                      <span>Download</span>
                    </button>
                  </div>
                  <div
                    className={`tab-content ${
                      activeTab === "features" ? "active" : ""
                    }`}
                    id="features-content"
                  >
                    <div className="features-accordion" id="featuresAccordion">
                      {/* Features will be populated here */}
                      {features.map((feature, index) => (
                        <div key={index} className="feature-category">
                          <div className="feature-category-header">
                            <h6>Feature {index + 1}</h6>
                            <i className="bi bi-chevron-down transition-transform"></i>
                          </div>
                          <div className="feature-category-content">
                            <ul className="feature-list">
                              <li>{feature}</li>
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`tab-content ${
                      activeTab === "tech" ? "active" : ""
                    }`}
                    id="specs-content"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <tbody
                          id="specsTable"
                          className="divide-y divide-gray-200"
                        >
                          {techSpecs.map((spec, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 font-medium whitespace-nowrap">
                                {spec.key}
                              </td>
                              <td className="px-4 py-2 break-words">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div
                    className={`tab-content ${
                      activeTab === "brochure" ? "active" : ""
                    }`}
                    id="brochure-content"
                  >
                    <div className="text-center py-8">
                      <i className="bi bi-file-earmark-pdf text-5xl text-primary-blue mb-4"></i>
                      <h5 className="text-lg font-medium mb-2">
                        Download Brochure
                      </h5>
                      <p className="text-gray-600 mb-4">
                        Get detailed information about this model
                      </p>
                      <button
                        className="btn-primary-blue rounded-md px-4 py-2 text-sm flex items-center mx-auto"
                        id="downloadBrochure"
                        onClick={() => {
                          if (variant.brochure) {
                            alert(`Downloading brochure for ${variant.name}`);
                            // Simulate download
                            const link = document.createElement("a");
                            link.href = `http://localhost:8000/uploads/brochures/${variant.brochure}`;
                            link.download = `${variant.name
                              .replace(/\s+/g, "-")
                              .toLowerCase()}-brochure.pdf`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
                        }}
                      >
                        <i className="bi bi-download mr-2"></i> Download
                        Brochure
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Next Button - Moved outside the overflow-hidden container for better visibility on mobile */}
        <button
          className="floating-next-button"
          id="floatingNextStep2"
          onClick={handleNextClick}
        >
          Next <i className="bi bi-arrow-right"></i>
        </button>

        {/* Color Confirmation Modal */}
        {showColorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
              <div className="bg-[#0f66af] text-white p-4">
                <h3 className="text-lg font-semibold">
                  {quantity <= 1
                    ? "Confirm Vehicle Selection"
                    : "Same Color for All Vehicles?"}
                </h3>
              </div>
              <div className="p-5">
                {quantity <= 1 ? (
                  <>
                    <p className="mb-2">Please confirm your vehicle details:</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p>
                        <strong>Model:</strong> {variant?.name}
                      </p>
                      <p>
                        <strong>Color:</strong> {selectedColorName}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {quantity}
                      </p>
                      <p>
                        <strong>Price:</strong> $
                        {selectedColorPrice.toLocaleString()}*
                      </p>
                      <p className="font-bold text-green-600">
                        <strong>Total:</strong> ${totalPrice.toLocaleString()}*
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      You have selected <strong>{quantity}</strong> vehicles of{" "}
                      <strong>{variant?.name}</strong>.
                    </p>
                    <p className="mt-2">
                      All are currently set to color{" "}
                      <strong>{selectedColorName}</strong>.
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Would you like to keep all the same color or assign
                      different colors?
                    </p>
                    <div className="bg-gray-50 p-3 rounded-lg mt-3">
                      <p>
                        <strong>Price per vehicle:</strong> $
                        {selectedColorPrice.toLocaleString()}*
                      </p>
                      <p className="font-bold text-green-600">
                        <strong>Total Price:</strong> $
                        {totalPrice.toLocaleString()}*
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
                {quantity <= 1 ? (
                  <>
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-300 transition-colors"
                      onClick={handleCancelColor}
                    >
                      No, Go Back
                    </button>
                    <button
                      type="button"
                      className="bg-[#0f66af] text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition-colors"
                      onClick={handleConfirmColor}
                    >
                      Yes, Continue
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-300 transition-colors"
                      onClick={handleChooseDifferentColors}
                    >
                      Choose Different Colors
                    </button>
                    <button
                      type="button"
                      className="bg-[#0f66af] text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition-colors"
                      onClick={handleKeepSameColor}
                    >
                      Keep Same Color
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Multiple Color Selection Modal */}
        {showMultipleColorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden max-h-[80vh] overflow-y-auto">
              <div className="bg-[#0f66af] text-white p-4 sticky top-0">
                <h3 className="text-lg font-semibold">
                  Select Colors for Each Vehicle
                </h3>
              </div>
              <div className="p-5">
                <div className="space-y-3">
                  {Array.from({ length: quantity }, (_, i) => (
                    <div key={i} className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle {i + 1}
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                        value={tempSelectedColors[i] || ""}
                        onChange={(e) => updateTempColor(i, e.target.value)}
                      >
                        <option value="">Select Color</option>
                        {colors.map((c) => (
                          <option key={c.id} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-300 transition-colors"
                  onClick={handleMultipleColorBack}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="bg-[#0f66af] text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition-colors"
                  onClick={handleMultipleColorConfirm}
                >
                  Confirm Colors
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style jsx>{`
        /* Icon Tabs Container */
        .icon-tabs-container {
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1rem;
          gap: 0.5rem;
          overflow-x: auto;
          white-space: nowrap;
          scrollbar-width: none;
          -ms-overflow-style: none;
          flex-wrap: nowrap;
          width: 100%;
        }
        .icon-tabs-container::-webkit-scrollbar {
          display: none;
        }
        .icon-tab {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 0.5rem 0.5rem 0 0;
          color: #6b7280;
          flex-shrink: 0;
          min-width: fit-content;
          gap: 0.5rem;
        }
        .icon-tab.active {
          color: #0f66af;
          background-color: rgba(15, 102, 175, 0.05);
          border-bottom: 2px solid #0f66af;
        }
        .icon-tab:hover {
          color: #0f66af;
          background-color: rgba(15, 102, 175, 0.02);
        }
        .icon-tab i {
          font-size: 1.25rem;
          margin-bottom: 0;
          flex-shrink: 0;
        }
        .icon-tab span {
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
        }
        /* Tab Content Styles */
        .tab-content {
          display: none;
        }
        .tab-content.active {
          display: block;
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        /* Quantity Control Styles */
        .quantity-control {
          display: flex;
          align-items: center;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          overflow: hidden;
          width: fit-content;
        }
        .quantity-control button {
          background-color: #f3f4f6;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .quantity-control button:hover:not(:disabled) {
          background-color: #e5e7eb;
        }
        .quantity-control button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .quantity-input {
          border: none;
          text-align: center;
          outline: none;
          background: white;
          -moz-appearance: textfield;
        }
        .quantity-input::-webkit-outer-spin-button,
        .quantity-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Mobile-specific fixes */
        @media (max-width: 768px) {
          .icon-tabs-container {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            -webkit-overflow-scrolling: touch;
          }
          .icon-tab {
            padding: 0.5rem 0.75rem;
            min-width: 100px;
            flex-direction: row;
            justify-content: center;
          }
          .icon-tab i {
            font-size: 1.1rem;
            margin-bottom: 0;
            margin-right: 0.25rem;
          }
          .icon-tab span {
            font-size: 0.75rem;
          }
          /* Ensure floating button is visible and properly positioned on mobile */
          .floating-next-button {
            bottom: 20px !important;
            right: 20px !important;
            left: auto !important;
            width: auto !important;
            padding: 12px 20px !important;
            font-size: 14px !important;
          }
        }
        /* Container class fix - ensure it doesn't break the layout */
        .container {
          width: 100%;
          overflow: visible;
        }
        /* Collapsible Features */
        .features-accordion {
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .feature-category {
          border-bottom: 1px solid #e5e7eb;
        }
        .feature-category:last-child {
          border-bottom: none;
        }
        .feature-category-header {
          padding: 1rem;
          background-color: #f8fafc;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s;
        }
        .feature-category-header:hover {
          background-color: #f1f5f9;
        }
        .feature-category-header h6 {
          margin: 0;
          font-weight: 600;
          color: #374151;
        }
        .feature-category-content {
          padding: 0;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
          background-color: white;
        }
        .feature-category.active .feature-category-content {
          padding: 1rem;
          max-height: 500px;
        }
        .feature-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .feature-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
        }
        .feature-list li:last-child {
          border-bottom: none;
        }
        .feature-list li:before {
          content: "•";
          color: #0f66af;
          font-weight: bold;
          margin-right: 0.5rem;
        }
        /* Price Breakdown */
        .price-breakdown {
          display: none;
          background-color: white;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-top: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .price-breakdown.show {
          display: block;
        }
        /* Floating Next Button */
        .floating-next-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 999;
          background-color: #0f66af;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 12px 24px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(15, 102, 175, 0.4);
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .floating-next-button:hover {
          background-color: #084a8a;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 102, 175, 0.5);
        }
        /* Color Options */
        .color-option {
          transition: all 0.2s ease;
          border-color: #d1d5db;
        }
        .color-option.selected {
          border-color: #0f66af;
          border-width: 3px;
          transform: scale(1.1);
        }
        .color-option:hover {
          transform: scale(1.05);
        }
        /* Ensure no vertical stacking */
        @media (max-width: 480px) {
          .icon-tabs-container {
            flex-direction: row !important;
            flex-wrap: nowrap !important;
          }
          .icon-tab {
            flex-direction: row !important;
            flex-shrink: 0 !important;
          }
          .container {
            overflow: visible !important;
          }
          /* Additional mobile fix for floating button */
          .floating-next-button {
            bottom: 80px !important; /* Adjust if footer overlaps */
            right: 16px !important;
            left: auto !important;
            padding: 10px 16px !important;
          }
        }
      `}</style>
    </Container>
  );
}
