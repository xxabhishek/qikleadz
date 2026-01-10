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
  const preSelectedBrandId = location.state?.preSelectedBrandId;
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
    brand: preSelectedBrandId ? String(preSelectedBrandId) : "All",
    variant: "All",
    fuelType: "All",
  });
  const [filteredVariants, setFilteredVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const [variantColorPrices, setVariantColorPrices] = useState({});
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  // New state for filtered options
  const [filteredOptions, setFilteredOptions] = useState({
    variants: [],
    fuelTypes: [],
  });

  useEffect(() => {
    async function fetchOptions() {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        const headers = {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        };

        const [
          segmentsRes,
          userBrandsRes,
          userVariantsRes,
          fuelTypesRes,
          ccsRes,
          userGalleriesRes,
        ] = await Promise.all([
          axios.get("http://localhost:8000/api/vehicle-segments"),
          axios.get("http://localhost:8000/api/user/country-brands", {
            headers,
          }),
          axios.get("http://localhost:8000/api/user/country-variants", {
            headers,
          }),
          axios.get("http://localhost:8000/api/fuel-types"),
          axios.get("http://localhost:8000/api/ccs"),
          axios.get("http://localhost:8000/api/user/country-galleries", {
            headers,
          }),
        ]);

        if (!userBrandsRes.data.success || !userVariantsRes.data.success) {
          console.error("Error fetching user-specific data");
          setLoading(false);
          return;
        }

        const brands = userBrandsRes.data.data || [];
        const variants = userVariantsRes.data.data || [];
        const galleries = userGalleriesRes.data.data || [];

        setOptions((prev) => ({
          ...prev,
          segments: segmentsRes.data.data || segmentsRes.data || [],
          brands: brands,
          variants: variants,
          fuelTypes: fuelTypesRes.data.data || fuelTypesRes.data || [],
          ccs: ccsRes.data.data || ccsRes.data || [],
        }));

        setGalleries(galleries);
        setFilteredVariants(variants);

        // Initialize filtered options
        setFilteredOptions({
          variants: variants,
          fuelTypes: fuelTypesRes.data.data || [],
        });

        // Initialize image loading states
        const initialLoadingStates = {};
        variants.forEach((variant) => {
          initialLoadingStates[variant.id] = true;
        });
        setImageLoadingStates(initialLoadingStates);

        // Fetch color prices
        await fetchColorPricesForVariants(variants);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          // Token expired ya invalid
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    const fetchColorPricesForVariants = async (variants) => {
      try {
        const colorPricePromises = variants.map(async (variant) => {
          try {
            const response = await axios.get(
              `http://localhost:8000/api/variants/${variant.id}/colors-with-prices`
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

  // Effect to update filtered options when filters change
  useEffect(() => {
    updateFilteredOptions();
  }, [filters, options]);

  const updateFilteredOptions = () => {
    let filteredVariantsList = options.variants;
    let filteredFuelTypesList = options.fuelTypes;

    // Apply segment filter
    if (filters.segment !== "All") {
      filteredVariantsList = filteredVariantsList.filter(
        (v) => v.vehicle_segment_id === Number(filters.segment)
      );
    }

    // Apply brand filter
    if (filters.brand !== "All") {
      filteredVariantsList = filteredVariantsList.filter(
        (v) => v.brand_id === Number(filters.brand)
      );
    }

    // Apply fuel type filter
    if (filters.fuelType !== "All") {
      filteredVariantsList = filteredVariantsList.filter(
        (v) => v.fuel_type_id === Number(filters.fuelType)
      );
    }

    // Get unique fuel types from filtered variants
    const fuelTypeIds = [
      ...new Set(filteredVariantsList.map((v) => v.fuel_type_id)),
    ];
    filteredFuelTypesList = options.fuelTypes.filter((f) =>
      fuelTypeIds.includes(f.id)
    );

    // Get variants for the variant dropdown (filter by segment, brand, fuel type)
    const filteredVariantOptions = filteredVariantsList;

    setFilteredOptions({
      variants: filteredVariantOptions,
      fuelTypes: filteredFuelTypesList,
    });
  };

  const applyFilters = () => {
    let result = options.variants;

    if (filters.segment !== "All") {
      result = result.filter(
        (v) => v.vehicle_segment_id === Number(filters.segment)
      );
    }

    if (filters.brand !== "All") {
      result = result.filter((v) => v.brand_id === Number(filters.brand));
    }

    if (filters.variant !== "All") {
      result = result.filter((v) => v.id === Number(filters.variant));
    }

    if (filters.fuelType !== "All") {
      result = result.filter(
        (v) => v.fuel_type_id === Number(filters.fuelType)
      );
    }

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

    // Reset filtered options to all
    setFilteredOptions({
      variants: options.variants,
      fuelTypes: options.fuelTypes,
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...filters,
      [filterName]: value,
    };

    // Reset dependent filters
    if (filterName === "brand") {
      newFilters.variant = "All";
      newFilters.fuelType = "All";
    } else if (filterName === "segment") {
      newFilters.brand = "All";
      newFilters.variant = "All";
      newFilters.fuelType = "All";
    } else if (filterName === "fuelType") {
      newFilters.variant = "All";
    }

    setFilters(newFilters);
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
    const brandsMap = {};

    filteredVariants.forEach((variant) => {
      const brandId = variant.brand_id;
      const brandName = getBrandName(brandId);
      if (!brandsMap[brandId]) {
        brandsMap[brandId] = {
          id: brandId,
          name: brandName,
          variants: [],
        };
      }
      brandsMap[brandId].variants.push(variant);
    });

    const brandList = Object.values(brandsMap);

    if (preSelectedBrandId) {
      const preSelectedIndex = brandList.findIndex(
        (b) => b.id === Number(preSelectedBrandId)
      );
      if (preSelectedIndex !== -1) {
        const [preSelectedBrand] = brandList.splice(preSelectedIndex, 1);
        brandList.unshift(preSelectedBrand);
      }
    }

    brandList.sort((a, b) => {
      if (a.id === Number(preSelectedBrandId)) return -1;
      if (b.id === Number(preSelectedBrandId)) return 1;
      return a.name.localeCompare(b.name);
    });

    return brandList;
  };

  const getVariantImage = (variant) => {
    const variantGallery = galleries.find((g) => g.variant_id === variant.id);

    if (!variantGallery) {
      return "https://via.placeholder.com/300x200/f3f4f6/6b7280?text=No+Image";
    }

    if (variantGallery.first_image) {
      return variantGallery.first_image;
    }

    if (
      variantGallery.cover_photo_urls &&
      Array.isArray(variantGallery.cover_photo_urls) &&
      variantGallery.cover_photo_urls.length > 0
    ) {
      return variantGallery.cover_photo_urls[0];
    }

    if (variantGallery.cover_photos) {
      let firstPhoto = null;

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
      } else if (
        Array.isArray(variantGallery.cover_photos) &&
        variantGallery.cover_photos.length > 0
      ) {
        firstPhoto = variantGallery.cover_photos[0];
      }

      if (firstPhoto) {
        let filename = String(firstPhoto)
          .replace(/[\[\]"\']/g, "")
          .trim();

        if (filename.startsWith("http")) {
          return filename;
        }

        return `http://localhost:8000/storage/galleries/${filename}`;
      }
    }

    if (variantGallery.image_base_url && variantGallery.cover_photos) {
      let firstPhoto = null;

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
        return `${variantGallery.image_base_url}${filename}`;
      }
    }

    return "https://via.placeholder.com/300x200/f3f4f6/6b7280?text=No+Image";
  };

  const handleImageError = (variantId) => {
    setImageErrors((prev) => ({
      ...prev,
      [variantId]: true,
    }));
    setImageLoadingStates((prev) => ({
      ...prev,
      [variantId]: false,
    }));
  };

  const handleImageLoad = (variantId) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [variantId]: false,
    }));
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
            {/* Header */}
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
                            handleFilterChange("segment", e.target.value)
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
                            handleFilterChange("brand", e.target.value)
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
                          Fuel Type
                        </label>
                        <select
                          value={filters.fuelType}
                          onChange={(e) =>
                            handleFilterChange("fuelType", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                          disabled={filteredOptions.fuelTypes.length === 0}
                        >
                          <option value="All">All</option>
                          {filteredOptions.fuelTypes.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name || f.fuel_type}
                            </option>
                          ))}
                        </select>
                        {filteredOptions.fuelTypes.length === 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Select a brand first to see available fuel types
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Variant
                        </label>
                        <select
                          value={filters.variant}
                          onChange={(e) =>
                            handleFilterChange("variant", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                          disabled={filteredOptions.variants.length === 0}
                        >
                          <option value="All">All</option>
                          {filteredOptions.variants.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.name || v.variant_name}
                            </option>
                          ))}
                        </select>
                        {filteredOptions.variants.length === 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Select filters above to see available variants
                          </p>
                        )}
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
              {/* Brand-wise Model Grid */}
              <div id="brandModelGrid" className="space-y-6">
                {groupByBrand().map((brand) => (
                  <div key={brand.id} className="brand-section">
                    {/* Brand Header */}
                    <div className="brand-header">
                      <h3 className="text-primary-blue text-lg font-semibold mb-3">
                        {brand.name}{" "}
                        <span className="text-sm font-normal text-gray-600">
                          ({brand.variants.length})
                        </span>
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
                        const isLoading = imageLoadingStates[variant.id];

                        return (
                          <div
                            key={variant.id}
                            onClick={() => handleVariantSelect(variant)}
                            className={`variant-card model-card bg-white p-4 rounded-lg border border-gray-200 ${
                              isSelected ? "selected" : ""
                            }`}
                            data-model-id={variant.id}
                          >
                            {/* Image container with loader */}
                            <div className="relative w-full h-40 bg-white rounded-lg p-4 mb-3 flex items-center justify-center">
                              {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
                                  <div className="small-loader"></div>
                                </div>
                              )}
                              <img
                                key={imageUrl}
                                src={imageUrl}
                                alt={variant.name || variant.variant_name}
                                className={`w-full h-full object-contain ${
                                  isLoading ? "opacity-0" : "opacity-100"
                                } transition-opacity duration-300`}
                                loading="lazy"
                                onError={() => handleImageError(variant.id)}
                                onLoad={() => handleImageLoad(variant.id)}
                              />
                            </div>
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
