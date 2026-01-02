import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper";
import axios from "axios";
import Container from "../../components/Container";
import Footer from "../../components/Layout/Footer";
import {
  Loader as LucideLoader,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [colors, setColors] = useState([]);
  const [features, setFeatures] = useState([]);
  const [techSpecs, setTechSpecs] = useState([]);
  const [activeTab, setActiveTab] = useState("features");
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showColorModal, setShowColorModal] = useState(false);
  const [colorSelections, setColorSelections] = useState({});
  const [imageLoading, setImageLoading] = useState(true);
  const [showImageSliderControls, setShowImageSliderControls] = useState(false);

  const galleryRef = useRef(null);

  const totalQuantity = Object.values(colorSelections).reduce(
    (sum, qty) => sum + qty,
    0
  );
  const totalPrice = Object.entries(colorSelections).reduce(
    (sum, [idStr, qty]) => {
      const id = parseInt(idStr);
      const price = colors.find((c) => c.id === id)?.price || 0;
      return sum + price * qty;
    },
    0
  );
  const selectedColorPrice =
    colors.find((c) => c.id === selectedColorId)?.price || 0;
  const unitPrice =
    totalQuantity > 0 ? totalPrice / totalQuantity : selectedColorPrice;
  const priceBreakdown = {
    base: unitPrice * 0.7,
    taxes: unitPrice * 0.2,
    others: unitPrice * 0.1,
  };

  useEffect(() => {
    if (!variant) {
      navigate("/");
      return;
    }
    const fetchColorsWithPrices = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/variants/${variant.id}/colors-with-prices`
        );
        const colorsWithPrices = response.data.data || [];
        setColors(colorsWithPrices);
        if (colorsWithPrices.length > 0) {
          const defaultColor = colorsWithPrices[0];
          setSelectedColorId(defaultColor.id);
          setColorSelections({ [defaultColor.id]: 0 });
          updateGalleryForColor(defaultColor.id);
        }
      } catch (error) {
        console.error("Error fetching colors with prices:", error);
      }
    };
    fetchColorsWithPrices();
    fetchFeatures();
    const fetchTechSpecs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/tech-specs");
        const allSpecs = res.data;
        const key = `${variant.brand_id}-${variant.id}`;
        const specsForVariant = allSpecs[key] || [];
        const techs = specsForVariant.map((spec) => ({
          key: spec.title,
          value:
            spec.description?.replace(/<\/?[^>]+(>|$)/g, "") || "Not specified",
        }));
        techs.unshift(
          {
            key: "Brand",
            value:
              brands.find((b) => b.id === variant.brand_id)?.name ||
              "Not specified",
          },
          {
            key: "CC",
            value:
              ccs.find((c) => c.id === variant.cc_id)?.name || "Not specified",
          },
          {
            key: "Fuel Type",
            value:
              fuelTypes.find((f) => f.id === variant.fuel_type_id)?.name ||
              "Not specified",
          }
        );
        setTechSpecs(techs);
      } catch (err) {
        console.error("Error fetching tech specs:", err);
        setTechSpecs([
          {
            key: "Brand",
            value:
              brands.find((b) => b.id === variant.brand_id)?.name ||
              "Not specified",
          },
          {
            key: "CC",
            value:
              ccs.find((c) => c.id === variant.cc_id)?.name || "Not specified",
          },
          {
            key: "Fuel Type",
            value:
              fuelTypes.find((f) => f.id === variant.fuel_type_id)?.name ||
              "Not specified",
          },
        ]);
      }
    };
    fetchTechSpecs();
  }, [variant, navigate, brands, fuelTypes, ccs]);

  useEffect(() => {
    setImageLoading(true);
  }, [mainImage]);

  // Add this useEffect to debug image URLs
  useEffect(() => {
    if (galleries.length > 0 && variant) {
      console.log("🔍 DEBUG: Checking all galleries for variant:", variant.id);
      galleries.forEach((gallery, index) => {
        if (gallery.variant_id === variant.id) {
          console.log(`Gallery ${index + 1} for variant ${variant.id}:`, {
            cover_photos: gallery.cover_photos,
            cover_photo_urls: gallery.cover_photo_urls,
            first_image: gallery.first_image,
            image_base_url: gallery.image_base_url,
            color_id: gallery.color_id,
          });
        }
      });

      // Test the first color's images
      if (colors.length > 0) {
        console.log("\n🧪 Testing image URLs for first color...");
        updateGalleryForColor(colors[0].id);
      }
    }
  }, [galleries, variant, colors]);

  const fetchFeatures = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/features");
      const allFeatures = response.data;
      const key = `${variant.brand_id}-${variant.id}`;
      const featuresForVariant = allFeatures[key] || [];
      const formattedFeatures = featuresForVariant.map((feature, index) => ({
        id: feature.id,
        title: feature.title,
        description: feature.description,
        isOpen: index === 0,
      }));
      setFeatures(formattedFeatures);
    } catch (error) {
      console.error("Error fetching features:", error);
      setFeatures([
        {
          id: 1,
          title: "No features available",
          description:
            "Features information is currently unavailable for this model.",
          isOpen: true,
        },
      ]);
    }
  };

  const updateGalleryForColor = React.useCallback(
    (colorId) => {
      console.log("🔄 Updating gallery for color ID:", colorId);

      // Find galleries for this variant and color
      const matchedGalleries =
        galleries?.filter(
          (g) => g.variant_id === variant.id && g.color_id === colorId
        ) || [];

      console.log("📸 Matched galleries count:", matchedGalleries.length);

      // If no color-specific galleries found, try to get ANY gallery for this variant
      if (matchedGalleries.length === 0) {
        console.log(
          "⚠️ No color-specific gallery found, looking for any variant gallery..."
        );
        const anyVariantGallery = galleries?.find(
          (g) => g.variant_id === variant.id
        );
        if (anyVariantGallery) {
          matchedGalleries.push(anyVariantGallery);
          console.log(
            "✅ Found variant gallery (color-agnostic):",
            anyVariantGallery
          );
        }
      }

      // Create a simple function to extract images from a gallery
      const extractImagesFromGallery = (gallery) => {
        const images = [];

        console.log("🔍 Extracting images from gallery:", gallery);

        // Priority 1: Use first_image if available
        if (gallery.first_image && gallery.first_image.trim() !== "") {
          console.log("✅ Adding first_image:", gallery.first_image);
          images.push(gallery.first_image.trim());
        }

        // Priority 2: Use cover_photo_urls if available
        if (
          gallery.cover_photo_urls &&
          Array.isArray(gallery.cover_photo_urls)
        ) {
          gallery.cover_photo_urls.forEach((url, index) => {
            if (url && url.trim() !== "") {
              console.log(`✅ Adding cover_photo_urls[${index}]:`, url);
              images.push(url.trim());
            }
          });
        }

        // Priority 3: Parse cover_photos (this is likely where your images are)
        if (gallery.cover_photos) {
          console.log("📸 Processing cover_photos:", gallery.cover_photos);

          let photoList = [];

          // Handle different formats of cover_photos
          try {
            // If it's a string that looks like JSON
            if (typeof gallery.cover_photos === "string") {
              const cleanString = gallery.cover_photos.trim();

              // Remove any escape characters
              const unescaped = cleanString.replace(/\\/g, "");

              if (unescaped.startsWith("[") || unescaped.startsWith('"[')) {
                let jsonString = unescaped;

                // Remove surrounding quotes if present
                if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
                  jsonString = jsonString.slice(1, -1);
                }

                try {
                  const parsed = JSON.parse(jsonString);
                  photoList = Array.isArray(parsed) ? parsed : [parsed];
                } catch (jsonError) {
                  console.log(
                    "JSON parse failed, treating as string:",
                    jsonError
                  );
                  // Try to extract filenames manually
                  const matches = unescaped.match(/"([^"]+)"/g);
                  if (matches) {
                    photoList = matches.map((m) => m.replace(/"/g, ""));
                  } else {
                    photoList = [unescaped];
                  }
                }
              } else {
                // It's a plain string (maybe a single filename)
                photoList = [unescaped];
              }
            }
            // If it's already an array
            else if (Array.isArray(gallery.cover_photos)) {
              photoList = gallery.cover_photos;
            }
          } catch (error) {
            console.error("Error processing cover_photos:", error);
            photoList = [gallery.cover_photos];
          }

          console.log("📋 Extracted photo list:", photoList);

          // Process each photo
          photoList.forEach((photo, index) => {
            if (!photo) return;

            const photoStr = String(photo).trim();
            if (!photoStr) return;

            // Clean the filename
            const cleanedPhoto = photoStr
              .replace(/[\[\]"\']/g, "") // Remove brackets and quotes
              .replace(/^\/+/, "") // Remove leading slashes
              .trim();

            if (!cleanedPhoto) return;

            // Check if it's already a full URL
            if (cleanedPhoto.startsWith("http")) {
              console.log(`✅ Adding full URL ${index + 1}:`, cleanedPhoto);
              images.push(cleanedPhoto);
              return;
            }

            // Try different storage paths
            const possiblePaths = [
              `http://localhost:8000/storage/galleries/${cleanedPhoto}`, // Correct path first!
              `http://localhost:8000/storage/coverphotos/${cleanedPhoto}`,
              `http://localhost:8000/storage/${cleanedPhoto}`,
              `http://localhost:8000/uploads/coverphotos/${cleanedPhoto}`,
              `http://localhost:8000/uploads/galleries/${cleanedPhoto}`,
              `http://localhost:8000/uploads/${cleanedPhoto}`,
            ];

            // Use the first path as default
            images.push(possiblePaths[0]);
            console.log(
              `✅ Added constructed URL ${index + 1}:`,
              possiblePaths[0]
            );
          });
        }

        return images;
      };

      // Extract images from all matched galleries
      const allImages = [];
      matchedGalleries.forEach((gallery, galleryIndex) => {
        console.log(
          `\n📁 Processing gallery ${galleryIndex + 1}/${
            matchedGalleries.length
          }`
        );
        const galleryImages = extractImagesFromGallery(gallery);
        allImages.push(...galleryImages);
      });

      console.log("🎨 Total images collected:", allImages);

      // Remove duplicates while preserving order
      const uniqueImages = [];
      const seen = new Set();
      allImages.forEach((img) => {
        if (!seen.has(img)) {
          seen.add(img);
          uniqueImages.push(img);
        }
      });

      console.log("🎨 Unique images for color:", colorId, uniqueImages);

      // Update state in a single batch to prevent rendering issues
      setAllImages(uniqueImages);

      if (uniqueImages.length > 0) {
        setMainImage(uniqueImages[0]);
        setCurrentImageIndex(0);
        console.log("✅ Main image set to:", uniqueImages[0]);
      } else {
        // Use placeholder
        const placeholderImage =
          "https://via.placeholder.com/400x300/f3f4f6/6b7280?text=No+Image+Available";
        setMainImage(placeholderImage);
        setAllImages([placeholderImage]);
        setCurrentImageIndex(0);
        console.log("⚠️ No images found, using placeholder");
      }

      setImageLoading(true);
    },
    [galleries, variant]
  );

  // const handleColorSelect = (colorId) => {
  //   setSelectedColorId(colorId);
  //   if (!(colorId in colorSelections)) {
  //     setColorSelections((prev) => ({ ...prev, [colorId]: 0 }));
  //   }
  //   updateGalleryForColor(colorId);
  //   setShowImageSliderControls(false);
  // };

  const handleColorSelect = (colorId) => {
    console.log("🎨 Color selected:", colorId);

    // Reset the current image index when color changes
    setCurrentImageIndex(0);

    // Update the selected color
    setSelectedColorId(colorId);

    // Ensure color exists in selections
    if (!(colorId in colorSelections)) {
      setColorSelections((prev) => ({ ...prev, [colorId]: 0 }));
    }

    // Force a gallery update with the new color
    updateGalleryForColor(colorId);

    // Reset slider controls
    setShowImageSliderControls(false);

    // Force a re-render of the gallery
    setImageLoading(true);
  };

  const handleNextClick = () => {
    if (totalQuantity === 0) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        text: "Please select at least one vehicle with quantity > 0!",
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        background: "#fff5f5",
        iconColor: "#f87171",
        color: "#991b1b",
        width: "350px",
        heightAuto: false,
        padding: "0.5rem 0.75rem",
        customClass: {
          popup: "compact-swal-toast",
          htmlContainer: "compact-swal-text",
        },
      });
      return;
    }
    setShowColorModal(true);
  };

  const currentQuantity = colorSelections[selectedColorId] || 0;
  const handleIncreaseQuantity = () => {
    setColorSelections((prev) => ({
      ...prev,
      [selectedColorId]: currentQuantity + 1,
    }));
  };

  const handleDecreaseQuantity = () => {
    if (currentQuantity > 0) {
      const newQty = currentQuantity - 1;
      setColorSelections((prev) => {
        const newSel = { ...prev, [selectedColorId]: newQty };
        if (newQty === 0) {
          delete newSel[selectedColorId];
        }
        return newSel;
      });
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setColorSelections((prev) => {
      const newSel = { ...prev, [selectedColorId]: Math.max(0, value) };
      if (newSel[selectedColorId] === 0) {
        delete newSel[selectedColorId];
      }
      return newSel;
    });
  };

  const handleCancelColor = () => {
    setShowColorModal(false);
  };

  const handleConfirmColor = () => {
    setShowColorModal(false);
    navigate("/leadinformation", {
      state: {
        ...location.state,
        variant,
        colors,
        colorSelections,
        totalQuantity,
        totalPrice,
        galleries,
        brands,
        fuelTypes,
        ccs,
        quantity: totalQuantity,
      },
    });
  };

  const selectionsList = Object.entries(colorSelections)
    .map(([idStr, qty]) => {
      if (qty === 0) return null;
      const id = parseInt(idStr);
      const c = colors.find((cc) => cc.id === id);
      if (!c) return null;
      return {
        color: c.name,
        price: c.price,
        qty,
        subtotal: c.price * qty,
      };
    })
    .filter(Boolean);

  // Image slider functions
  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (allImages.length > 0) {
      const newIndex =
        currentImageIndex === 0 ? allImages.length - 1 : currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setMainImage(allImages[newIndex]);
    }
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (allImages.length > 0) {
      const newIndex =
        currentImageIndex === allImages.length - 1 ? 0 : currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setMainImage(allImages[newIndex]);
    }
  };

  const handleMainImageClick = () => {
    setShowImageSliderControls(!showImageSliderControls);
  };

  const handleThumbnailClick = (imageUrl, index) => {
    setMainImage(imageUrl);
    setCurrentImageIndex(index);
    setShowImageSliderControls(true);
  };

  return (
    <Container>
      <div className="container-fluid mx-auto px-0">
        <Stepper step={2} />
        <section className="p-1 md:p-6 xl:p-10">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-7xl mx-auto">
            <div className="page-header flex justify-between items-center p-4">
              <h5 className="text-lg font-semibold text-primary-blue">
                New Lead Information
              </h5>
            </div>
            <div className="p-4 md:p-6">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 mb-4 text-sm hover:bg-gray-200 transition-colors flex items-center"
              >
                <i className="bi bi-arrow-left mr-2"></i> Back
              </button>
              <h4 className="mb-4 text-primary-blue text-xl font-semibold">
                {variant?.name}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="bg-light-blue p-4 rounded-lg relative">
                  <div
                    className="relative w-full h-64 cursor-pointer"
                    onClick={handleMainImageClick}
                  >
                    {/* Small loader overlay */}
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg z-10">
                        <div className="small-image-loader"></div>
                      </div>
                    )}

                    <img
                      src={mainImage}
                      className={`w-full h-full object-contain transition-opacity duration-300 ${
                        imageLoading ? "opacity-0" : "opacity-100"
                      }`}
                      id="mainModelImage"
                      alt={variant?.name || "Vehicle Image"}
                      onLoad={() => {
                        console.log(
                          "✅ Main image loaded successfully:",
                          mainImage
                        );
                        setImageLoading(false);
                      }}
                      onError={(e) => {
                        console.error(
                          "❌ Main image failed to load:",
                          mainImage
                        );
                        setImageLoading(false);
                        // Fallback to placeholder
                        e.target.src =
                          "https://via.placeholder.com/400x300/f44336/ffffff?text=IMAGE+NOT+FOUND";
                      }}
                    />
                  </div>
                </div>
                {/* Gallery Section - Updated */}
                <div>
                  <div className="gallery-header flex justify-between items-center mb-3">
                    <h5 className="text-lg font-medium">Gallery</h5>
                    {allImages.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{currentImageIndex + 1}</span>
                        <span>/</span>
                        <span>{allImages.length}</span>
                      </div>
                    )}
                  </div>

                  {allImages.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-2">
                        <i className="bi bi-images text-2xl text-gray-400"></i>
                      </div>
                      <p className="text-sm text-gray-500">
                        No gallery images available
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        ref={galleryRef}
                        className="lightbox-gallery"
                        id="modelGallery"
                        style={{
                          maxHeight: "120px",
                          overflowY: "hidden",
                          overflowX: "auto",
                          display: "flex",
                          gap: "12px",
                          padding: "8px 0 16px 0",
                        }}
                      >
                        {allImages.map((photoUrl, index) => (
                          <div
                            key={`img-thumb-${index}`}
                            className={`thumbnail-container flex-shrink-0 ${
                              currentImageIndex === index
                                ? "active border-2 border-primary-blue"
                                : "border border-gray-200"
                            }`}
                            style={{
                              width: "150px",
                              height: "100px",
                              position: "relative",
                              borderRadius: "6px",
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={photoUrl}
                              alt={`Thumbnail ${index + 1}`}
                              className="lightbox-img w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                              onClick={() =>
                                handleThumbnailClick(photoUrl, index)
                              }
                              onError={(e) => {
                                console.error(
                                  "❌ Thumbnail failed to load:",
                                  photoUrl
                                );
                                e.target.src =
                                  "https://via.placeholder.com/150x100/f44336/ffffff?text=ERROR";
                                e.target.onerror = null; // Prevent infinite loop
                              }}
                              onLoad={() =>
                                console.log(
                                  `✅ Thumbnail ${index + 1} loaded:`,
                                  photoUrl
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>

                      {/* Image preview info */}
                      {allImages.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          <p>Click thumbnails to view larger images.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="color-selection-section mb-4">
                <h5 className="text-lg font-medium mb-3">
                  Select Color & Quantity
                </h5>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3" id="colorOptions">
                      {colors.length > 0 ? (
                        colors.map((c) => {
                          const isSelected = selectedColorId === c.id;
                          return (
                            <div
                              key={c.id}
                              className="relative"
                              onClick={() => handleColorSelect(c.id)}
                            >
                              <div
                                className={`color-option w-10 h-10 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                                  isSelected
                                    ? "border-blue-600 shadow-md scale-110"
                                    : "border-gray-300 hover:border-blue-400 hover:scale-105"
                                }`}
                                style={{ backgroundColor: c.color_code }}
                                title={c.name}
                              ></div>
                              {/* Color Name Tooltip on Hover */}
                              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                  {c.name}
                                </div>
                              </div>
                              {/* Selected Color Name - Always Visible when selected */}
                              {isSelected && (
                                <div className="mt-2 text-center">
                                  <p className="text-sm font-medium text-blue-600">
                                    {c.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    ${c.price?.toLocaleString() || "0"}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-gray-400 text-xs">
                          No colors available
                        </span>
                      )}

                      {/* Selected Color Information Section */}
                      {selectedColorId && (
                        <div className="w-full mt-4 md:mt-0">
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h6 className="font-semibold text-blue-700">
                                  Selected Color:
                                </h6>
                                <div className="flex items-center gap-3 mt-1">
                                  <div
                                    className="w-8 h-8 rounded-full border-2 border-blue-600"
                                    style={{
                                      backgroundColor: colors.find(
                                        (c) => c.id === selectedColorId
                                      )?.color_code,
                                    }}
                                  ></div>
                                  <div>
                                    <p className="font-medium">
                                      {colors.find(
                                        (c) => c.id === selectedColorId
                                      )?.name || "No color selected"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      Price: $
                                      {colors
                                        .find((c) => c.id === selectedColorId)
                                        ?.price?.toLocaleString() || "0"}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <div className="text-center">
                                  <p className="text-sm font-medium text-gray-600 mb-1">
                                    Quantity
                                  </p>
                                  <div className="quantity-control flex items-center">
                                    <button
                                      type="button"
                                      onClick={handleDecreaseQuantity}
                                      disabled={currentQuantity <= 0}
                                      className="bg-gray-200 hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded-l-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      className="quantity-input w-12 h-8 text-center border-y border-gray-300"
                                      min="0"
                                      value={currentQuantity}
                                      onChange={handleQuantityChange}
                                    />
                                    <button
                                      type="button"
                                      onClick={handleIncreaseQuantity}
                                      className="bg-gray-200 hover:bg-gray-300 w-8 h-8 flex items-center justify-center rounded-r-md transition-colors"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Subtotals for selected color */}
                            {currentQuantity > 0 && (
                              <div className="mt-3 pt-3 border-t border-blue-100">
                                <div className="flex justify-between text-sm">
                                  <span>
                                    {
                                      colors.find(
                                        (c) => c.id === selectedColorId
                                      )?.name
                                    }{" "}
                                    × {currentQuantity}
                                  </span>
                                  <span className="font-semibold text-green-600">
                                    $
                                    {(
                                      colors.find(
                                        (c) => c.id === selectedColorId
                                      )?.price * currentQuantity
                                    )?.toLocaleString() || "0"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected Vehicles Summary */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h6 className="font-medium mb-3 flex items-center gap-2">
                    <i className="bi bi-check-circle text-green-600"></i>
                    Selected Vehicles Summary
                  </h6>
                  {totalQuantity === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No vehicles selected yet. Select a color and set quantity.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(colorSelections).map(([idStr, qty]) => {
                        if (qty === 0) return null;
                        const id = parseInt(idStr);
                        const c = colors.find((cc) => cc.id === id);
                        if (!c) return null;
                        const sub = c.price * qty;
                        return (
                          <div
                            key={id}
                            className="flex justify-between items-center text-sm p-2 bg-white rounded border"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-6 h-6 rounded-full border"
                                style={{ backgroundColor: c.color_code }}
                              ></div>
                              <span className="font-medium">{c.name}</span>
                              <span className="text-gray-500">× {qty}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600 text-xs">
                                ${c.price?.toLocaleString()} each
                              </p>
                              <p className="font-semibold text-green-600">
                                ${sub.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div className="border-t pt-3 mt-2 flex justify-between font-semibold">
                        <div>
                          <span>
                            Total: {totalQuantity} vehicle
                            {totalQuantity !== 1 ? "s" : ""}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {
                              Object.keys(colorSelections).filter(
                                (id) => colorSelections[id] > 0
                              ).length
                            }{" "}
                            color
                            {Object.keys(colorSelections).filter(
                              (id) => colorSelections[id] > 0
                            ).length !== 1
                              ? "s"
                              : ""}{" "}
                            selected
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl text-primary-blue">
                            ${totalPrice.toLocaleString()}*
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            *on road price
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="price-section">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      *on road price (per vehicle)
                    </p>
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
                <div
                  className={`price-breakdown mt-4 ${
                    showPriceBreakdown ? "show" : ""
                  }`}
                >
                  <h6 className="text-sm font-medium mb-2">
                    Price Breakdown (per vehicle)
                  </h6>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Ex-Showroom Price:</span>
                      <span>${priceBreakdown.base.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes:</span>
                      <span>${priceBreakdown.taxes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Others:</span>
                      <span>${priceBreakdown.others.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="my-4">
                  <div
                    className="icon-tabs-container"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      borderBottom: "1px solid #e5e7eb",
                      marginBottom: "1rem",
                      gap: "0.5rem",
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      flexWrap: "nowrap",
                      width: "100%",
                    }}
                  >
                    <button
                      className={`icon-tab ${
                        activeTab === "features" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("features")}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "0.75rem 1rem",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        borderRadius: "0.5rem 0.5rem 0 0",
                        color: activeTab === "features" ? "#0f66af" : "#6b7280",
                        backgroundColor:
                          activeTab === "features"
                            ? "rgba(15, 102, 175, 0.05)"
                            : "transparent",
                        borderBottom:
                          activeTab === "features"
                            ? "2px solid #0f66af"
                            : "2px solid transparent",
                        flexShrink: 0,
                        minWidth: "fit-content",
                        gap: "0.5rem",
                      }}
                    >
                      <i
                        className="bi bi-list-check"
                        style={{
                          fontSize: "1.25rem",
                          marginBottom: 0,
                          flexShrink: 0,
                        }}
                      ></i>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Features
                      </span>
                    </button>
                    <button
                      className={`icon-tab ${
                        activeTab === "tech" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("tech")}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "0.75rem 1rem",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        borderRadius: "0.5rem 0.5rem 0 0",
                        color: activeTab === "tech" ? "#0f66af" : "#6b7280",
                        backgroundColor:
                          activeTab === "tech"
                            ? "rgba(15, 102, 175, 0.05)"
                            : "transparent",
                        borderBottom:
                          activeTab === "tech"
                            ? "2px solid #0f66af"
                            : "2px solid transparent",
                        flexShrink: 0,
                        minWidth: "fit-content",
                        gap: "0.5rem",
                      }}
                    >
                      <i
                        className="bi bi-gear"
                        style={{
                          fontSize: "1.25rem",
                          marginBottom: 0,
                          flexShrink: 0,
                        }}
                      ></i>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Tech Specs
                      </span>
                    </button>
                    <button
                      className={`icon-tab ${
                        activeTab === "brochure" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("brochure")}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: "0.75rem 1rem",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        borderRadius: "0.5rem 0.5rem 0 0",
                        color: activeTab === "brochure" ? "#0f66af" : "#6b7280",
                        backgroundColor:
                          activeTab === "brochure"
                            ? "rgba(15, 102, 175, 0.05)"
                            : "transparent",
                        borderBottom:
                          activeTab === "brochure"
                            ? "2px solid #0f66af"
                            : "2px solid transparent",
                        flexShrink: 0,
                        minWidth: "fit-content",
                        gap: "0.5rem",
                      }}
                    >
                      <i
                        className="bi bi-download"
                        style={{
                          fontSize: "1.25rem",
                          marginBottom: 0,
                          flexShrink: 0,
                        }}
                      ></i>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Download
                      </span>
                    </button>
                  </div>
                  <div
                    style={{
                      display: activeTab === "features" ? "block" : "none",
                      animation:
                        activeTab === "features" ? "fadeIn 0.3s ease" : "none",
                    }}
                  >
                    <div className="features-accordion space-y-3">
                      {features.length > 0 ? (
                        features.map((feature, index) => (
                          <div
                            key={feature.id || index}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <div
                              className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                const updatedFeatures = features.map(
                                  (f, i) => ({
                                    ...f,
                                    isOpen: i === index ? !f.isOpen : false,
                                  })
                                );
                                setFeatures(updatedFeatures);
                              }}
                            >
                              <h6 className="font-semibold text-gray-800 m-0 text-sm">
                                {feature.title}
                              </h6>
                              <i
                                className={`bi transition-transform duration-300 ${
                                  feature.isOpen
                                    ? "bi-chevron-up rotate-180"
                                    : "bi-chevron-down"
                                }`}
                              ></i>
                            </div>
                            <div
                              className="grid transition-all duration-300 ease-in-out"
                              style={{
                                gridTemplateRows: feature.isOpen
                                  ? "1fr"
                                  : "0fr",
                                opacity: feature.isOpen ? 1 : 0,
                              }}
                            >
                              <div className="overflow-hidden">
                                <div className="p-4 bg-white border-t border-gray-200">
                                  {feature.description ? (
                                    <div
                                      className="text-gray-700 text-sm leading-relaxed"
                                      dangerouslySetInnerHTML={{
                                        __html: feature.description,
                                      }}
                                    />
                                  ) : (
                                    <p className="text-gray-500 italic text-sm">
                                      No description available
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <i className="bi bi-info-circle text-3xl mb-3 block"></i>
                          <p className="text-sm">
                            No features available for this model
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: activeTab === "tech" ? "block" : "none",
                      animation:
                        activeTab === "tech" ? "fadeIn 0.3s ease" : "none",
                    }}
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <tbody className="divide-y divide-gray-200">
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
                    style={{
                      display: activeTab === "brochure" ? "block" : "none",
                      animation:
                        activeTab === "brochure" ? "fadeIn 0.3s ease" : "none",
                    }}
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
                        onClick={() => {
                          alert(`Downloading brochure for ${variant?.name}`);
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
        <button
          className="floating-next-button"
          onClick={handleNextClick}
          style={{
            position: "fixed",
            bottom: "100px",
            right: "20px",
            zIndex: "100",
            backgroundColor: "#0f66af",
            color: "white",
            border: "none",
            borderRadius: "50px",
            padding: "12px 24px",
            fontWeight: "500",
            boxShadow: "0 4px 12px rgba(15, 102, 175, 0.4)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Next <i className="bi bi-arrow-right"></i>
        </button>
        {showColorModal && (
          <div
            className="custom-modal active"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="custom-modal-content"
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "1.5rem",
                maxWidth: "90%",
                maxHeight: "80%",
                overflowY: "auto",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                id="customModalContent"
                style={{
                  flex: 1,
                  overflowY: "auto",
                }}
              >
                <div className="text-center">
                  <i className="bi bi-check-circle text-4xl text-green-600 mb-4"></i>
                  <h3 className="text-lg font-semibold mb-2">
                    Confirm Selection
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Please review your vehicle selection:
                  </p>
                  <div className="bg-gray-50 p-3 rounded-lg text-left max-h-48 overflow-y-auto">
                    <p>
                      <strong>Model:</strong> {variant?.name}
                    </p>
                    {selectionsList.map((s) => (
                      <div key={s.color} className="my-2 p-2 bg-white rounded">
                        <p>
                          <strong>Color:</strong> {s.color}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {s.qty}
                        </p>
                        <p>
                          <strong>Price per vehicle:</strong> $
                          {s.price.toLocaleString()}*
                        </p>
                        <p className="font-semibold text-green-600">
                          <strong>Subtotal:</strong> $
                          {s.subtotal.toLocaleString()}*
                        </p>
                      </div>
                    ))}
                    <div className="mt-3 pt-2 border-t">
                      <p className="font-bold text-primary-blue">
                        <strong>Total Vehicles:</strong> {totalQuantity}
                      </p>
                      <p className="font-bold text-green-600 text-lg">
                        <strong>Total Price:</strong> $
                        {totalPrice.toLocaleString()}*
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky buttons at the bottom */}
              <div
                className="flex justify-end gap-2 mt-4 pt-4"
                style={{
                  position: "sticky",
                  bottom: 0,
                  background: "white",
                  paddingTop: "1rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <button
                  type="button"
                  className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-300 transition-colors flex-1"
                  onClick={handleCancelColor}
                >
                  Go Back
                </button>
                <button
                  type="button"
                  className="btn-primary-blue rounded-md px-4 py-2 text-sm flex-1"
                  onClick={handleConfirmColor}
                >
                  Confirm & Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Visible scrollbar for gallery */
        .lightbox-gallery {
          scrollbar-width: thin;
          scrollbar-color: #eff1f2ff #f0f0f0;
        }

        /* Custom scrollbar for WebKit browsers */
        .lightbox-gallery::-webkit-scrollbar {
          height: 6px;
        }

        .lightbox-gallery::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 3px;
          margin: 0 2px;
        }

        .lightbox-gallery::-webkit-scrollbar-thumb {
          background: #0f66af;
          border-radius: 3px;
          cursor: pointer;
        }

        .lightbox-gallery::-webkit-scrollbar-thumb:hover {
          background: #084a8a;
        }

        .icon-tabs-container::-webkit-scrollbar {
          display: none;
        }

        .icon-tab:hover {
          color: #0f66af;
          background-color: rgba(15, 102, 175, 0.02);
        }

        .floating-next-button:hover {
          background-color: #084a8a;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 102, 175, 0.5);
        }

        /* Gallery thumbnail styles */
        .lightbox-gallery {
          display: flex;
          gap: 12px;
          padding: 8px 0 16px 0;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }

        .thumbnail-container {
          position: relative;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .thumbnail-container:hover {
          transform: scale(1.03);
        }

        .lightbox-img {
          width: 150px;
          height: 100px;
          object-fit: cover;
          border-radius: 6px;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
        }

        .lightbox-img:hover {
          transform: scale(1.02);
        }

        @media (max-width: 768px) {
          .icon-tabs-container {
            flex-wrap: nowrap !important;
            overflow-x: auto !important;
            padding-bottom: 0.5rem;
            -webkit-overflow-scrolling: touch;
          }

          .icon-tab {
            padding: 0.5rem 0.75rem !important;
            min-width: 100px !important;
            flex-direction: row !important;
            justify-content: center !important;
          }

          .icon-tab i {
            font-size: 1.1rem !important;
            margin-bottom: 0 !important;
            margin-right: 0.25rem !important;
          }

          .icon-tab span {
            font-size: 0.75rem !important;
          }

          .floating-next-button {
            bottom: 100px !important;
            right: 20px !important;
            left: auto !important;
            width: auto !important;
            padding: 10px 16px !important;
            font-size: 14px !important;
          }

          .lightbox-img {
            width: 120px;
            height: 80px;
          }

          .thumbnail-container {
            width: 120px !important;
            height: 80px !important;
          }
        }

        @media (max-width: 480px) {
          .icon-tabs-container {
            flex-direction: row !important;
            flex-wrap: nowrap !important;
          }

          .icon-tab {
            flex-direction: row !important;
            flex-shrink: 0 !important;
          }

          .lightbox-img {
            width: 100px;
            height: 70px;
          }

          .thumbnail-container {
            width: 100px !important;
            height: 70px !important;
          }
        }

        .feature-description-content {
          color: #000 !important;
          background: #f9f9f9 !important;
          padding: 12px !important;
          border-radius: 4px !important;
          border: 1px solid #e5e7eb !important;
        }

        .feature-description-content p {
          margin-bottom: 8px !important;
          color: #000 !important;
        }

        .feature-description-content b {
          font-weight: bold !important;
          color: #000 !important;
        }

        .small-image-loader {
          width: 24px;
          height: 24px;
          border: 2px solid #e5e7eb;
          border-top: 2px solid #0f66af;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Container>
  );
}
