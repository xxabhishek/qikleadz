import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Add useLocation import
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "../../components/Container";
import "./LeadGen.css";
import Stepper from "../../components/Stepper";

export default function LeadGen() {
  const navigate = useNavigate();
  const location = useLocation(); // Add useLocation hook
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
          axios.get(" http://localhost:8000/api/vehicle-segments"),
          axios.get(" http://localhost:8000/api/brands"),
          axios.get(" http://localhost:8000/api/variants"),
          axios.get(" http://localhost:8000/api/fuel-types"),
          axios.get(" http://localhost:8000/api/ccs"),
          axios.get(" http://localhost:8000/api/galleries"),
        ]);

        setOptions({
          segments: segmentsRes.data.data || segmentsRes.data || [],
          brands: brandsRes.data.data || brandsRes.data || [],
          variants: variantsRes.data.data || variantsRes.data || [],
          fuelTypes: fuelTypesRes.data.data || fuelTypesRes.data || [],
          ccs: ccsRes.data.data || ccsRes.data || [],
        });

        setFilteredVariants(variantsRes.data.data || variantsRes.data || []);
        setGalleries(galleriesRes.data.data || galleriesRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOptions();
  }, []);

  // Add this useEffect to handle pre-filled data for "Add Another Vehicle"
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
            // You can set any pre-filled state here if needed
          } else {
            // Data is too old, remove it
            localStorage.removeItem("existingCustomerData");
          }
        } catch (err) {
          console.error("Error parsing stored customer data:", err);
          localStorage.removeItem("existingCustomerData");
        }
      }
    };

    loadExistingCustomerData();
  }, [location.state]); // Add location.state as dependency

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

  const handleNext = () => {
    if (!selectedVariant) {
      alert("Please select a variant first!");
      return;
    }

    navigate("/model-details", {
      state: {
        variant: selectedVariant,
        galleries,
        isAddingAnotherVehicle: location.state?.isAddingAnotherVehicle || false,
        existingCustomer: location.state?.existingCustomer || null,
      },
    });
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Group variants by brand
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

  // Get variant image
 const getVariantImage = (variant) => {
  const variantGallery = galleries.find((g) => g.variant_id === variant.id);

  if (!variantGallery?.cover_photos) {
    return "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image";
  }

  let images = [];
  try {
    const parsed = JSON.parse(variantGallery.cover_photos);
    images = Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    images = [variantGallery.cover_photos];
  }

  if (!Array.isArray(images) || images.length === 0) {
    return "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image";
  }

  const firstImage = images[0];
  let imagePath = "";

  if (typeof firstImage === "object" && firstImage !== null) {
    imagePath = firstImage.url || firstImage.path || firstImage.src || "";
  } else if (typeof firstImage === "string") {
    imagePath = firstImage;
  } else {
    return "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image";
  }

  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  const cleanPath = imagePath.replace(/^[\\/]+/, "");
  return `http://localhost:8000/uploads/coverPhotos/${cleanPath}`;
};

  // Handle image error
  const handleImageError = (variantId) => {
    setImageErrors((prev) => ({
      ...prev,
      [variantId]: true,
    }));
  };

  // Scroll functions for horizontal scrolling
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
      <div className="container-animate mx-auto px-0 md:px-8 xl:px-12">
        {/* Mobile Filter Button */}
        <div className="lg:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={toggleFilter}
            className="bg-primary-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center shadow-xl"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Progress Indicator */}
        <Stepper step={1} />

        {/* Form Container */}
        <section className="p-3 sm:p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-primary-blue text-white p-4">
              <div className="flex items-center justify-between">
                <h5 className="text-base font-semibold">
                  New Lead Information
                </h5>
                <button
                  onClick={toggleFilter}
                  className="lg:hidden bg-white/20 hover:bg-white/30 p-1.5 rounded transition-colors"
                >
                  <Filter size={16} />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              <h4 className="mb-4 text-primary-blue text-lg font-semibold">
                Select Vehicle
              </h4>

              {/* Desktop Filters */}
              <div className="hidden lg:block bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Vehicle Segment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vehicle Segment
                    </label>
                    <select
                      value={filters.segment}
                      onChange={(e) =>
                        setFilters({ ...filters, segment: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    >
                      <option value="All">All</option>
                      {options.segments.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <select
                      value={filters.brand}
                      onChange={(e) =>
                        setFilters({ ...filters, brand: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    >
                      <option value="All">All</option>
                      {options.brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variant */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Variant
                    </label>
                    <select
                      value={filters.variant}
                      onChange={(e) =>
                        setFilters({ ...filters, variant: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                    >
                      <option value="All">All</option>
                      {options.variants.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name || v.variant_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fuel Type
                    </label>
                    <select
                      value={filters.fuelType}
                      onChange={(e) =>
                        setFilters({ ...filters, fuelType: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
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

                {/* Buttons */}
                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={resetFilters}
                    className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-300 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={applyFilters}
                    className="bg-primary-blue text-white rounded-lg px-4 py-2 text-sm hover:bg-hover-blue transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              {/* Mobile Filter Overlay */}
              {isFilterOpen && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                  <div className="bg-white rounded-t-2xl sm:rounded-xl w-full max-w-md max-h-[85vh] sm:max-h-[90vh] overflow-y-auto animate-slide-up">
                    <div className="bg-primary-blue text-white p-4 rounded-t-2xl sm:rounded-t-xl sticky top-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-lg font-semibold">Filters</h5>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="text-white hover:text-gray-200 p-1"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Vehicle Segment */}
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

                      {/* Brand */}
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

                      {/* Variant */}
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

                      {/* Fuel Type */}
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

                    <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2 sticky bottom-0">
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

              {/* Brand-wise Model Grid */}
              <div id="brandModelGrid" className="space-y-6">
                {groupByBrand().map((brand) => (
                  <div key={brand.id} className="brand-section">
                    {/* Enhanced Brand Header with Scroll Controls */}
                    <div className="brand-header">
                      <div>
                        <span className="brand-title">{brand.name}</span>
                        <span className="brand-count">
                          ({brand.variants.length})
                        </span>
                      </div>

                      {/* Enhanced Scroll Controls - Show only when multiple variants */}
                      {brand.variants.length > 1 && (
                        <div className="scroll-controls">
                          <button
                            onClick={() => scrollBrandSection(brand.id, "left")}
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            aria-label="Scroll left"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            onClick={() =>
                              scrollBrandSection(brand.id, "right")
                            }
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            aria-label="Scroll right"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Enhanced Scrollable Container */}
                    <div
                      id={`brand-scroll-${brand.id}`}
                      className="variant-scroll-container"
                    >
                      {brand.variants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id;
                        const imageUrl = getVariantImage(variant);
                        const hasImageError = imageErrors[variant.id];

                        return (
                          <div
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`model-card border-primary-300 ${
                              isSelected ? "bg-blue-50 shadow-sm" : "bg-white"
                            }`}
                          >
                            {/* Image Container */}
                            <div className="image-container">
                              <img
                                src={
                                  hasImageError
                                    ? "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image"
                                    : imageUrl
                                }
                                alt={variant.name || variant.variant_name}
                                className="model-image"
                                loading="lazy"
                                onError={() => handleImageError(variant.id)}
                              />
                            </div>

                            {/* Content */}
                            <div className="model-card-content">
                              <h5 className="font-semibold text-gray-800 line-clamp-2">
                                {variant.name || variant.variant_name}
                              </h5>
                              <p className="text-primary-blue font-medium mt-1 text-sm">
                                {variant.basic_price
                                  ? `₹${parseFloat(
                                      variant.basic_price
                                    ).toLocaleString()}`
                                  : "Price on request"}
                              </p>
                              <p className="text-gray-500 text-xs mt-1">
                                {getFuelName(variant.fuel_type_id)} |{" "}
                                {getCCName(variant.cc_id)}
                              </p>
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
                  <div className="text-gray-400 text-4xl mb-3">🚗</div>
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

              {/* Next Button */}
              {filteredVariants.length > 0 && (
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleNext}
                    disabled={!selectedVariant}
                    className={`rounded-lg px-6 py-3 text-base font-medium transition-all flex items-center ${
                      selectedVariant
                        ? "bg-primary-blue text-white hover:bg-hover-blue shadow-lg hover:shadow-xl active:scale-95"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Container>
  );

  function Loader() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <span className="text-gray-600 font-medium">
          Loading LeadGeneration
        </span>
      </div>
    );
  }
}
