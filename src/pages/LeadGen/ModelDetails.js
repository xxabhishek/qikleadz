import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper";
import axios from "axios";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video"; // Import video plugin
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-video.css"; // Import video CSS
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
  const [galleryVideos, setGalleryVideos] = useState([]); // New state for videos
  const [colors, setColors] = useState([]);
  const [features, setFeatures] = useState([]);
  const [techSpecs, setTechSpecs] = useState([]);
  const [activeTab, setActiveTab] = useState("features");
  const [selectedColorId, setSelectedColorId] = useState(null);

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

  useEffect(() => {
    if (!variant) {
      navigate("/"); // Redirect if no variant selected
      return;
    }

    // Gallery images and videos
    const variantGalleries = galleries.filter(
      (g) => g.variant_id === variant.id
    );
    setGalleryImages(variantGalleries);

    // Set main image
    setMainImage(
      variantGalleries[0]?.cover_photo
        ? `http://localhost:8000/uploads/coverPhotos/${variantGalleries[0].cover_photo}`
        : ""
    );

    // Extract videos from galleries
    const videos = [];
    variantGalleries.forEach((gallery) => {
      if (gallery.upload_videos) {
        try {
          const videoData = JSON.parse(gallery.upload_videos);
          if (Array.isArray(videoData)) {
            videoData.forEach((video) => {
              if (video && typeof video === "string") {
                videos.push({
                  url: getAbsoluteVideoUrl(video),
                  galleryId: gallery.id,
                  colorId: gallery.color_id,
                });
              }
            });
          } else if (typeof videoData === "string" && videoData.trim() !== "") {
            videos.push({
              url: getAbsoluteVideoUrl(videoData),
              galleryId: gallery.id,
              colorId: gallery.color_id,
            });
          }
        } catch (e) {
          // If it's not JSON, treat it as a single video path
          if (gallery.upload_videos.trim() !== "") {
            videos.push({
              url: getAbsoluteVideoUrl(gallery.upload_videos),
              galleryId: gallery.id,
              colorId: gallery.color_id,
            });
          }
        }
      }
    });
    setGalleryVideos(videos);

    // Features
    setFeatures(variant.features || ["Feature 1", "Feature 2"]);

    // Fetch Tech Specs from API
    const fetchTechSpecs = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/tech-specs");
        const allSpecs = res.data;

        // Key format: "brandId-variantId"
        const key = `${variant.brand_id}-${variant.id}`;
        const specsForVariant = allSpecs[key] || [];

        // Map to displayable format
        const techs = specsForVariant.map((spec) => ({
          key: spec.title,
          value: spec.description.replace(/<\/?[^>]+(>|$)/g, ""), // remove HTML tags
        }));

        // Add main info at top
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
            key: "Price",
            value: variant.basic_price
              ? `₹${parseFloat(variant.basic_price).toLocaleString()}`
              : "Price on request",
          }
        );

        setTechSpecs(techs);
      } catch (err) {
        console.error("Error fetching tech specs:", err);
      }
    };

    fetchTechSpecs();

    // Fetch colors
    const fetchColors = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/colors");
        const allColors = res.data.data || res.data || [];

        if (variant.color_id) {
          // Step 1: Get all color IDs configured for this variant
          const variantColorIds = variant.color_id
            .split(",")
            .map((id) => parseInt(id, 10));

          // Step 2: Only keep colors that also have galleries for this variant
          const variantColors = allColors.filter((c) => {
            const hasGallery = galleries.some(
              (g) => g.variant_id === variant.id && g.color_id === c.id
            );
            return variantColorIds.includes(c.id) && hasGallery;
          });

          setColors(variantColors);

          // Step 3: Auto-select first color (if any)
          if (variantColors.length > 0) {
            const defaultColor = variantColors[0];
            setSelectedColorId(defaultColor.id);

            const matchedGalleries = galleries.filter(
              (g) =>
                g.variant_id === variant.id && g.color_id === defaultColor.id
            );
            setGalleryImages(matchedGalleries);

            // Update videos for selected color
            const colorVideos = videos.filter(
              (video) => video.colorId === defaultColor.id
            );
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
                setMainImage(
                  `http://localhost:8000/uploads/coverPhotos/${photos[0]}`
                );
              }
            }
          }
        }
      } catch (err) {
        console.error("Error fetching colors:", err);
      }
    };

    fetchColors();
  }, [variant]);

  // Update gallery when color changes
  useEffect(() => {
    if (selectedColorId) {
      const matchedGalleries = galleries.filter(
        (g) => g.variant_id === variant.id && g.color_id === selectedColorId
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
            } else if (
              typeof videoData === "string" &&
              videoData.trim() !== ""
            ) {
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
    }
  }, [selectedColorId, galleries, variant]);

  const leadInformation = () => {
    navigate("/leadinformation", {
      state: {
        variant,
        galleries,
        isAddingAnotherVehicle: location.state?.isAddingAnotherVehicle || false,
        existingCustomer: location.state?.existingCustomer || null,
      },
    });
  };

  const [showColorModal, setShowColorModal] = useState(false);

  const handleNextClick = () => {
    if (!selectedColorId) {
      alert("Please select a color before proceeding!");
      return;
    }
    setShowColorModal(true);
  };

  const handleConfirmColor = () => {
    setShowColorModal(false);

    const selectedColor = colors.find((c) => c.id === selectedColorId);

    // PASS COLOR + VARIANT TO LEAD PAGE
    navigate("/leadinformation", {
      state: {
        variant,
        selectedColor,
        galleries,
        isAddingAnotherVehicle: location.state?.isAddingAnotherVehicle || false,
        existingCustomer: location.state?.existingCustomer || null,
      },
    });
  };

  const handleCancelColor = () => {
    setShowColorModal(false);
  };

  return (
    <div className="w-full px-2 md:px-6 mb-3">
      <Stepper step={2} />

      {/* Header */}
      <div className="bg-[#0f66af] text-white py-4 rounded-t-lg p-4 sm:p-5 mt-3">
        <h2 className="text-lg font-semibold">New Lead Information</h2>
      </div>

      {/* Card */}
      <div className="bg-white shadow-md rounded-b-lg p-4 md:p-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 mb-4 text-sm hover:bg-gray-200 transition-colors flex items-center"
        >
          ← Back
        </button>

        {/* Model Details */}
        <h3 className="text-xl font-semibold text-[#0f66af] mb-4">
          {variant ? ` ${variant.name}` : ""}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 md:gap-6">
          {/* Main Image and Thumbnails */}
          <div className="bg-blue-50 rounded-lg p-2 md:p-4 flex flex-col items-center">
            <LightGallery
              speed={500}
              plugins={[lgThumbnail, lgZoom, lgVideo]} // Add video plugin
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
                  className="max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px] w-full h-auto object-contain cursor-pointer"
                />
              </a>

              {/* Hidden images for lightbox */}
              {galleryImages
                .filter(
                  (g) => !selectedColorId || g.color_id === selectedColorId
                )
                .map((g, idx) => {
                  let photos = [];
                  try {
                    photos = JSON.parse(g.cover_photos);
                    if (!Array.isArray(photos)) photos = [g.cover_photos];
                  } catch (e) {
                    photos = [g.cover_photos];
                  }

                  return photos.map((photo, photoIdx) => {
                    const photoUrl = `http://localhost:8000/uploads/coverPhotos/${photo}`;
                    if (photoUrl === mainImage) return null; // Skip main image
                    return (
                      <a href={photoUrl} key={`img-${idx}-${photoIdx}`}>
                        <img src={photoUrl} alt="" className="hidden" />
                      </a>
                    );
                  });
                })}

              {/* Videos for lightbox */}
              {galleryVideos
                .filter(
                  (video) =>
                    !selectedColorId || video.colorId === selectedColorId
                )
                .map((video, idx) => (
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

          {/* Vertical Thumbnail Bar */}
          <div className="rounded-lg p-2 md:p-4">
            <h5 className="text-lg font-medium mb-3">Gallery</h5>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Image Thumbnails */}
              {galleryImages
                .filter(
                  (g) => !selectedColorId || g.color_id === selectedColorId
                )
                .flatMap((g, idx) => {
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
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105 flex-shrink-0 ${
                          mainImage === photoUrl
                            ? "border-2 border-[#0f66af]"
                            : "border border-gray-300"
                        }`}
                        onClick={() => setMainImage(photoUrl)}
                      />
                    );
                  });
                })}

              {/* Video Thumbnails */}
              {galleryVideos
                .filter(
                  (video) =>
                    !selectedColorId || video.colorId === selectedColorId
                )
                .map((video, idx) => (
                  <div
                    key={`video-thumb-${idx}`}
                    className="relative w-20 h-20 flex-shrink-0 cursor-pointer group"
                    onClick={() => {
                      // For videos, we can't set as main image, but we can trigger the lightbox
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

        {/* Available Colors */}
        <div className="mt-6">
          <h5 className="text-lg font-medium mb-3">Available Colors</h5>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {colors.length > 0 ? (
              colors.map((c) => (
                <div
                  key={c.id}
                  className={`w-10 h-10 rounded-full border-2 flex-shrink-0 cursor-pointer transition-transform hover:scale-110 ${
                    selectedColorId === c.id
                      ? "border-[#0f66af]"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c.color_code }}
                  onClick={() => {
                    setSelectedColorId(c.id);

                    // Filter all galleries for this color
                    const matchedGalleries = galleries.filter(
                      (g) => g.variant_id === variant.id && g.color_id === c.id
                    );

                    // Update galleryImages to only show selected color images
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
                          } else if (
                            typeof videoData === "string" &&
                            videoData.trim() !== ""
                          ) {
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

                    // Set mainImage to first photo of selected color
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
                        setMainImage(
                          `http://localhost:8000/uploads/coverPhotos/${photos[0]}`
                        );
                      }
                    }
                  }}
                ></div>
              ))
            ) : (
              <span className="text-gray-400">No colors available</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200 flex gap-6 overflow-x-auto">
          <button
            className={`pb-2 whitespace-nowrap ${
              activeTab === "features"
                ? "text-[#0f66af] border-b-2 border-[#0f66af]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("features")}
          >
            Features
          </button>
          <button
            className={`pb-2 whitespace-nowrap ${
              activeTab === "tech"
                ? "text-[#0f66af] border-b-2 border-[#0f66af]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("tech")}
          >
            Tech Specs
          </button>
          <button
            className={`pb-2 whitespace-nowrap ${
              activeTab === "brochure"
                ? "text-[#0f66af] border-b-2 border-[#0f66af]"
                : "text-gray-600"
            }`}
            onClick={() => setActiveTab("brochure")}
          >
            Brochure
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "features" ? (
            <ul className="list-disc pl-5 space-y-2">
              {features.map((f, idx) => (
                <li key={idx}>{f}</li>
              ))}
            </ul>
          ) : activeTab === "tech" ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <tbody className="divide-y divide-gray-200">
                  {techSpecs.map((spec, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 font-medium whitespace-nowrap">
                        {spec.key}
                      </td>
                      <td className="px-4 py-2 break-words">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              {variant.brochure ? (
                <a
                  href={`http://localhost:8000/uploads/brochures/${variant.brochure}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Brochure PDF
                </a>
              ) : (
                <span className="text-gray-400">Brochure not available</span>
              )}
            </div>
          )}
        </div>

        {/* Next Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleNextClick}
            className="bg-[#0f66af] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            Next →
          </button>
        </div>
      </div>

      {showColorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="bg-[#0f66af] text-white p-4">
              <h3 className="text-lg font-semibold">Confirm Color</h3>
            </div>
            <div className="p-5">
              <p>
                Please confirm the colour of your model:{" "}
                <span className="font-semibold text-[#0f66af]">
                  {colors.find((c) => c.id === selectedColorId)?.name || ""}
                </span>
              </p>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                type="button"
                className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
                onClick={handleCancelColor}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-[#0f66af] text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition-colors"
                onClick={handleConfirmColor}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
