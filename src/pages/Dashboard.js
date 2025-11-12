import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./LeadGen/LeadGen.css";

export default function Dashboard() {
  const [leadStats, setLeadStats] = useState({
    drafts: 0,
    open: 0,
    converted: 0,
    unrealized: 0,
    submitted: 0,
  });
  const [galleries, setGalleries] = useState([]); // State for galleries
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({}); // Track image loading errors
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const carouselItems = [
    {
      src: "assets/images/banner/4.webp",
      alt: "Pulsar 200",
      title: "Pulsar 200",
      description: "Experience the thrill of performance",
    },
    {
      src: "assets/images/banner/1.webp",
      alt: "Dominar 250",
      title: "Dominar 250",
      description: "Power meets elegance",
    },
    {
      src: "assets/images/banner/2.webp",
      alt: "Avenger 220 Cruise",
      title: "Avenger 220 Cruise",
      description: "Cruise in style and comfort",
    },
    {
      src: "assets/images/banner/3.webp",
      alt: "Pulsar 125",
      title: "Pulsar 125",
      description: "Efficiency redefined",
    },
  ];

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [
          brandsRes,
          galleriesRes,
          vehicleUsagesRes,
          variantsRes,
          draftLeadsRes,
          openLeadsRes,
          convertedLeadsRes,
          unrealizedLeadsRes,
          submittedLeadsRes,
          vehicleFilterRes,
        ] = await Promise.all([
          axios.get(" http://localhost:8000/api/brands"),
          axios.get(" http://localhost:8000/api/galleries"),
          axios.get(" http://localhost:8000/api/vehicle-usages"),
          axios.get(" http://localhost:8000/api/variants"),
          axios.get(" http://localhost:8000/api/lead-details/draft"),
          axios.get(" http://localhost:8000/api/lead-details/open"),
          axios.get(" http://localhost:8000/api/leads?status=converted"),
          axios.get(" http://localhost:8000/api/leads?status=Unrealized"),
          axios.get(" http://localhost:8000/api/leads?status=Submitted"),
          axios.get(" http://localhost:8000/api/vehicle-filter"),
        ]);

        console.log("Galleries response:", vehicleFilterRes.data.galleries);
        setLeadStats({
          drafts: draftLeadsRes.data.data?.length || 0,
          open: openLeadsRes.data.data ?? 0,
          converted: convertedLeadsRes.data.length || 0,
          unrealized: unrealizedLeadsRes.data.length || 0,
          submitted: submittedLeadsRes.data.length || 0,
        });
        setGalleries(vehicleFilterRes.data.galleries || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (err.response?.data?.message === "Failed to fetch galleries.") {
          setError("Failed to load vehicle models. Please try again later.");
        } else {
          setError("The dashboard is currently offline. Please Retry");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  // Auto slide for carousel
  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const prevSlide = () => {
    setCurrentIndex((current) =>
      current === 0 ? carouselItems.length - 1 : current - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((current) =>
      current === carouselItems.length - 1 ? 0 : current + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getVariantImage = (gallery) => {
    if (
      !gallery?.cover_photos ||
      !Array.isArray(gallery.cover_photos) ||
      gallery.cover_photos.length === 0
    ) {
      return "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image";
    }

    const firstImage = gallery.cover_photos[0];
    let imagePath = "";

    // Handle object format: { url: "...", path: "...", src: "..." }
    if (typeof firstImage === "object" && firstImage !== null) {
      imagePath = firstImage.url || firstImage.path || firstImage.src || "";
    }
    // Handle string path
    else if (typeof firstImage === "string") {
      imagePath = firstImage;
    }

    if (!imagePath || !imagePath.trim()) {
      return "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image";
    }

    // If already full URL, use it
    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    // Clean path: remove leading slashes
    const cleanPath = imagePath.replace(/^[\\/]+/, "");

    // CORRECT PATH: storage/galleries/
    return `http://localhost:8000/storage/galleries/${cleanPath}`;
  };
  // Handle image error
  const handleImageError = (galleryId) => {
    setImageErrors((prev) => ({
      ...prev,
      [galleryId]: true,
    }));
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Overview Section */}
        <OverviewSection />

        {/* Carousel */}
        <CarouselSection
          items={carouselItems}
          currentIndex={currentIndex}
          onPrev={prevSlide}
          onNext={nextSlide}
          onDotClick={goToSlide}
          onExploreClick={(vehicle) =>
            navigate("/variants", { state: { vehicleName: vehicle } })
          }
        />
        {/* Lead Cards */}
        <LeadCardsSection leadStats={leadStats} onNavigate={navigate} />
        {/* Vehicle Models Section */}
        <VehicleModelsSection
          galleries={galleries}
          onNavigate={navigate}
          getVariantImage={getVariantImage}
          handleImageError={handleImageError}
          imageErrors={imageErrors}
        />
      </div>
      {/* Floating Add Lead Button */}
      <Link
        to="/leads/generate"
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-[var(--primary-blue)] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all text-2xl"
      >
        <i className="bi bi-plus-lg"></i>
      </Link>
    </div>
  );
}

// --- Overview Section Component ---
function OverviewSection() {
  return (
    <section className="">
      <div className="bg-[#cae4fe] p-3 md:p-6 rounded-lg shadow-sm">
        <h5 className="mb-3 md:mb-4 text-[var(--primary-blue)] text-base md:text-lg font-semibold">
          Overview
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {/* Earnings Card */}
          <div className="bg-white rounded-lg p-2 md:p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-green-50 flex items-center justify-center mb-1 md:mb-2">
              <i className="bi bi-currency-dollar text-green-500 text-sm md:text-lg lg:text-xl"></i>
            </div>
            <h6 className="text-gray-500 text-xs mb-1 font-medium">Earnings</h6>
            <div className="flex justify-center items-center">
              <h3 className="text-[var(--primary-blue)] text-sm md:text-lg lg:text-xl font-bold">
                $2,000
              </h3>
            </div>
            <p className="text-green-500 text-xs mt-1 font-medium">
              +12% from last month
            </p>
          </div>

          {/* Vehicles Sold Card */}
          <div className="bg-white rounded-lg p-2 md:p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-orange-50 flex items-center justify-center mb-1 md:mb-2">
              <i className="bi bi-car-front-fill text-orange-500 text-sm md:text-lg lg:text-xl"></i>
            </div>
            <h6 className="text-gray-500 text-xs mb-1 font-medium">
              Vehicles Sold
            </h6>
            <div className="flex justify-center items-center">
              <h3 className="text-[var(--primary-blue)] text-sm md:text-lg lg:text-xl font-bold">
                10
              </h3>
            </div>
            <p className="text-green-500 text-xs mt-1 font-medium">
              +2 from last week
            </p>
          </div>

          {/* Credit Notes Card */}
          <Link to="/credit" className="no-underline">
            <div className="bg-white rounded-lg p-2 md:p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-blue-50 flex items-center justify-center mb-1 md:mb-2 group-hover:bg-blue-100 transition-colors">
                <i className="bi bi-file-earmark-text text-blue-500 text-sm md:text-lg lg:text-xl"></i>
              </div>
              <h6 className="text-gray-500 text-xs mb-1 font-medium">
                Credit Notes
              </h6>
              <div className="flex justify-center items-center">
                <h3 className="text-[var(--primary-blue)] text-sm md:text-lg lg:text-xl font-bold">
                  10
                </h3>
              </div>
              <p className="text-gray-400 text-xs mt-1 font-medium">
                Tap to view
              </p>
            </div>
          </Link>

          {/* Invoices Card */}
          <Link to="/invoice" className="no-underline">
            <div className="bg-white rounded-lg p-2 md:p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full bg-purple-50 flex items-center justify-center mb-1 md:mb-2 group-hover:bg-purple-100 transition-colors">
                <i className="bi bi-receipt text-purple-500 text-sm md:text-lg lg:text-xl"></i>
              </div>
              <h6 className="text-gray-500 text-xs mb-1 font-medium">
                Invoices
              </h6>
              <div className="flex justify-center items-center">
                <h3 className="text-[var(--primary-blue)] text-sm md:text-lg lg:text-xl font-bold">
                  3
                </h3>
              </div>
              <p className="text-gray-400 text-xs mt-1 font-medium">
                Tap to view
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- Carousel Component ---
function CarouselSection({
  items,
  currentIndex,
  onPrev,
  onNext,
  onDotClick,
  onExploreClick,
}) {
  return (
    <section>
      <div className="relative w-full rounded-xl overflow-hidden shadow-lg h-64 md:h-80 lg:h-96 xl:h-[500px]">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, idx) => (
            <div
              key={idx}
              className="min-w-full h-full relative flex items-center justify-center"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/25 md:bg-black/20"></div>
              <div className="absolute z-10 text-center text-white px-4 md:px-6 max-w-md md:max-w-2xl">
                <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4 drop-shadow-lg">
                  {item.title}
                </h2>
                <p className="text-sm md:text-lg mb-4 md:mb-8 opacity-90 drop-shadow-md">
                  {item.description}
                </p>
                <button
                  onClick={() => onExploreClick(item.title)}
                  className="bg-[var(--primary-blue)] hover:bg-blue-700 text-white font-semibold px-6 md:px-8 py-2 md:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                >
                  Explore Now
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Arrows */}
        <button
          onClick={onPrev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-20"
        >
          <i className="bi bi-chevron-left text-lg md:text-xl font-bold"></i>
        </button>
        <button
          onClick={onNext}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center z-20"
        >
          <i className="bi bi-chevron-right text-lg md:text-xl font-bold"></i>
        </button>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onDotClick(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Lead Cards Component ---
function LeadCardsSection({ leadStats, onNavigate }) {
  const leadCards = [
    {
      title: "Drafts",
      count: leadStats.drafts,
      icon: "bi-pencil-square",
      iconColor: "text-gray-600",
      onClick: () => onNavigate("/leads/draft"),
    },
    {
      title: "Open",
      count: leadStats.open, // <-- now the real DB count
      icon: "bi-hourglass-split",
      iconColor: "text-orange-500",
      badge: { text: "+3 today", color: "bg-[var(--primary-blue)]" },
      onClick: () => onNavigate("/leads/open"),
    },
    {
      title: "Converted",
      count: leadStats.converted,
      icon: "bi-emoji-smile",
      iconColor: "text-green-500",
      badge: { text: "+2 today", color: "bg-green-500" },
      additionalText: "23 | $500",
      onClick: () => onNavigate("/leads/converted"),
    },
    {
      title: "Unrealized",
      count: leadStats.unrealized,
      icon: "bi-emoji-frown",
      iconColor: "text-red-500",
      badge: { text: "+1 today", color: "bg-gray-500" },
      additionalText: "16 | $324",
      onClick: () => onNavigate("/leads/unrealized"),
    },
  ];

  return (
    <section>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h5 className="mb-6 text-[var(--primary-blue)] text-xl font-semibold">
          Leads Overview
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {leadCards.map((card, idx) => (
            <LeadCard key={idx} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Vehicle Models Component ---
function VehicleModelsSection({
  galleries,
  onNavigate,
  getVariantImage,
  handleImageError,
  imageErrors,
}) {
  return (
    <section className="p-3 md:p-6 xl:p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
      <h5 className="mb-3 text-[var(--primary-blue)] text-lg font-semibold">
        Vehicle Models
      </h5>
      {galleries.length === 0 ? (
        <p className="text-gray-500">No vehicle models available.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {galleries.map((gallery, idx) => {
            const imageUrl = getVariantImage(gallery);
            const hasImageError = imageErrors[gallery.id];

            return (
              <div
                key={gallery.id || idx}
                className="bg-white text-center rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all relative cursor-pointer border border-gray-100"
                onClick={() =>
                  onNavigate("/variants", {
                    state: { vehicleName: gallery.variant_name },
                  })
                }
              >
                <span className="absolute top-2.5 right-2.5 text-gray-500 text-[0.75rem] bg-gray-100 rounded-full px-2 py-1">
                  {gallery.open_leads_count} open leads
                </span>
                <div className="flex justify-center mb-3">
                  <img
                    src={
                      hasImageError
                        ? "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image"
                        : imageUrl
                    }
                    alt={gallery.variant_name}
                    className="w-20 h-16 object-cover rounded mx-auto"
                    loading="lazy"
                    onError={() => handleImageError(gallery.id)}
                    onLoad={() => console.log("Image loaded:", imageUrl)} // Optional: debug
                  />
                </div>
                <h6 className="text-sm mb-1 font-medium text-gray-800">
                  {gallery.variant_name || "Unknown Model"}
                </h6>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

// --- Lead Card Component ---
function LeadCard({
  title,
  count,
  icon,
  iconColor,
  badge,
  additionalText,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="relative bg-gradient-to-br from-[#f2f9ff] to-blue-50 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-blue-100 group"
    >
      <div className="flex items-center justify-between mb-3">
        <h6 className="text-gray-600 text-sm font-medium group-hover:text-gray-800 transition-colors">
          <i className={`${icon} ${iconColor} text-base mr-2`}></i>
          {title}
        </h6>
        {badge && (
          <span
            className={`${badge.color} text-white rounded-full text-xs px-2 py-1 font-medium`}
          >
            {badge.text}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-[var(--primary-blue)] text-2xl font-bold group-hover:text-blue-700 transition-colors">
          {count}
        </h3>
        {additionalText && (
          <p className="text-gray-500 text-xs mb-1">{additionalText}</p>
        )}
      </div>
    </div>
  );
}

// --- Loader and ErrorMessage Components ---
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <span className="text-gray-600 font-medium">Loading Dashboard...</span>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <i className="bi bi-exclamation-triangle text-red-500 text-4xl"></i>
      <p className="text-red-500 text-lg font-medium">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
