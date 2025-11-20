import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
// import "./LeadGen/LeadGen.css";

export default function Dashboard() {
  const [leadStats, setLeadStats] = useState({
    drafts: 0,
    open: 0,
    converted: 0,
    unrealized: 0,
  });
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const carouselItems = [
    {
      src: "assets/images/banner/4.webp",
      alt: "Pulsar 200",
    },
    {
      src: "assets/images/banner/1.webp",
      alt: "Dominar 250",
    },
    {
      src: "assets/images/banner/2.webp",
      alt: "Avenger 220 Cruise",
    },
    {
      src: "assets/images/banner/3.webp",
      alt: "Pulsar 125",
    },
  ];

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [
          draftLeadsRes,
          openLeadsRes,
          convertedLeadsRes,
          unrealizedLeadsRes,
          vehicleFilterRes,
        ] = await Promise.all([
          axios.get("http://localhost:8000/api/lead-details/draft"),
          axios.get("http://localhost:8000/api/lead-details/open"),
          axios.get("http://localhost:8000/api/leads?status=converted"),
          axios.get("http://localhost:8000/api/leads?status=Unrealized"),
          axios.get("http://localhost:8000/api/vehicle-filter"),
        ]);

        console.log("🚀 VEHICLE FILTER API RESPONSE:", vehicleFilterRes.data);
        console.log("📸 Galleries data:", vehicleFilterRes.data.galleries);

        setLeadStats({
          drafts: draftLeadsRes.data.data?.length || 0,
          open: openLeadsRes.data.data || 0,
          converted: convertedLeadsRes.data.length || 0,
          unrealized: unrealizedLeadsRes.data.length || 0,
        });
        setGalleries(vehicleFilterRes.data.galleries || []);
      } catch (err) {
        console.error("❌ Error fetching dashboard data:", err);
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

  // Drawer functionality
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // Auto slide for carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((current) =>
        current < carouselItems.length - 1 ? current + 1 : 0
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, carouselItems.length]);

  const prevSlide = () => {
    setCurrentIndex((current) =>
      current > 0 ? current - 1 : carouselItems.length - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((current) =>
      current < carouselItems.length - 1 ? current + 1 : 0
    );
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

    if (typeof firstImage === "object" && firstImage !== null) {
      imagePath = firstImage.url || firstImage.path || firstImage.src || "";
    } else if (typeof firstImage === "string") {
      imagePath = firstImage;
    }

    if (!imagePath || !imagePath.trim()) {
      return "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image";
    }

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    const cleanPath = imagePath.replace(/^[\\/]+/, "");
    return `http://localhost:8000/storage/galleries/${cleanPath}`;
  };

  const handleImageError = (galleryId) => {
    setImageErrors((prev) => ({
      ...prev,
      [galleryId]: true,
    }));
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-gray-100 font-sans text-sm min-h-screen">
      {/* Main Container */}
      <div className="container-fluid mx-auto px-0">
        {/* Drawer Menu */}
        <div
          className={`fixed top-0 -left-64 w-64 h-full bg-white shadow-lg transition-all duration-300 z-[1000] pt-20 ${
            drawerOpen ? "left-0" : "-left-64"
          }`}
          id="drawerMenu"
        >
          <img
            src="assets/images/logo/bajaj-logo.svg"
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

        {/* Total Earnings and Vehicles Sold Section */}
        <section className="p-4 md:p-6 xl:p-8">
          <div className="bg-[#cae4fe] p-4 md:p-6 rounded-lg shadow-sm">
            <h5 className="mb-4 text-[var(--primary-blue)] text-lg font-semibold">
              Overview
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {/* Earnings Card */}
              <div className="bg-white rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-2">
                  <i className="bi bi-currency-dollar text-green-500 text-xl"></i>
                </div>
                <h6 className="text-gray-500 text-xs mb-1 font-medium">
                  Earnings
                </h6>
                <div className="flex justify-center items-center">
                  <h3 className="text-[var(--primary-blue)] text-xl font-bold">
                    $0
                  </h3>
                </div>
                <p className="text-green-500 text-xs mt-1 font-medium">
                  0+ today
                </p>
              </div>

              {/* Vehicles Sold Card */}
              <div className="bg-white rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
                  <i className="bi bi-car-front-fill text-orange-500 text-xl"></i>
                </div>
                <h6 className="text-gray-500 text-xs mb-1 font-medium">
                  Vehicles Sold
                </h6>
                <div className="flex justify-center items-center">
                  <h3 className="text-[var(--primary-blue)] text-xl font-bold">
                    0
                  </h3>
                </div>
                <p className="text-green-500 text-xs mt-1 font-medium"></p>
              </div>

              {/* Credit Notes Card */}
              <Link to="/credit" className="no-underline">
                <div className="bg-white rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                    <i className="bi bi-file-earmark-text text-blue-500 text-xl"></i>
                  </div>
                  <h6 className="text-gray-500 text-xs mb-1 font-medium">
                    Credit Notes
                  </h6>
                  <div className="flex justify-center items-center">
                    <h3 className="text-[var(--primary-blue)] text-xl font-bold">
                      0
                    </h3>
                  </div>
                  <p className="text-gray-400 text-xs mt-1 font-medium">
                    Tap to view
                  </p>
                </div>
              </Link>

              {/* Invoices Card */}
              <Link to="/invoice" className="no-underline">
                <div className="bg-white rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-2 group-hover:bg-purple-100 transition-colors">
                    <i className="bi bi-receipt text-purple-500 text-xl"></i>
                  </div>
                  <h6 className="text-gray-500 text-xs mb-1 font-medium">
                    Invoices
                  </h6>
                  <div className="flex justify-center items-center">
                    <h3 className="text-[var(--primary-blue)] text-xl font-bold">
                      0
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

        {/* Carousel Section */}
        <section className="p-2 md:p-6 xl:p-10">
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
                  <button className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-[var(--primary-blue)] text-white px-2.5 py-1.5 text-xs rounded-lg hover:bg-[#084a8a] hover:scale-105 transition-all duration-200">
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

        {/* Lead Section */}
        <section className="p-2 md:p-6 xl:p-10">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h5 className="mb-3 text-[var(--primary-blue)] text-lg">Leads</h5>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              <Link to="/leads/draft" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-pencil-square text-gray-600 text-base"></i>{" "}
                    Drafts
                  </h6>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                      {leadStats.drafts}
                    </h3>
                  </div>
                </div>
              </Link>

              <Link to="/leads/open" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-hourglass-split text-orange-500 text-base"></i>{" "}
                    Open
                  </h6>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                      {leadStats.open}
                    </h3>
                    <span className="badge bg-[var(--primary-blue)] text-white rounded-full">
                      {/* +0 today */}
                    </span>
                  </div>
                </div>
              </Link>

              <Link to="/leads/converted" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-emoji-smile text-green-500 text-base"></i>{" "}
                    Converted
                  </h6>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                      {leadStats.converted}
                    </h3>
                    <span className="badge bg-green-500 text-white rounded-full">
                      {/* +2 today */}
                    </span>
                  </div>
                  {/* <p className="text-gray-500 text-[0.7rem] mb-0">23 | $500</p> */}
                </div>
              </Link>

              <Link to="/leads/unrealized" className="no-underline">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-emoji-frown text-red-500 text-base"></i>{" "}
                    Unrealized
                  </h6>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                      {leadStats.unrealized}
                    </h3>
                    <span className="badge bg-gray-500 text-white rounded-full">
                      {/* +1 today */}
                    </span>
                  </div>
                  {/* <p className="text-gray-500 text-[0.7rem] mb-0">16 | $324</p> */}
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Claim | Amount Section */}
        <section className="p-2 md:p-6 xl:p-10">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h5 className="text-[var(--primary-blue)] text-lg">
                Claim | Amount
              </h5>
            </div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
              {/* Total Claim */}
              <Link to="/total-claim" className="block">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-clipboard-data text-primary-blue text-base"></i>{" "}
                    Total
                  </h6>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                      0
                    </h3>
                  </div>
                  {/* <p className="text-gray-500 text-[0.7rem] mb-0">Avg | 8</p> */}
                </div>
              </Link>

              {/* Approved Claim */}
              <Link to="/successful-claim" className="block">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-check-circle text-green-500 text-base"></i>{" "}
                    Approved
                  </h6>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                      0
                    </h3>
                  </div>
                  {/* <p className="text-gray-500 text-[0.7rem] mb-0">Avg | 8</p> */}
                </div>
              </Link>

              {/* Disputed Claim */}
              <Link to="/disputed-claim" className="block">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-exclamation-triangle text-orange-500 text-base"></i>{" "}
                    Disputed
                  </h6>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                      0
                    </h3>
                  </div>
                  {/* <p className="text-gray-500 text-[0.7rem] mb-0">Avg | 8</p> */}
                </div>
              </Link>

              {/* Rejected Claim */}
              <Link to="/rejected-claim" className="block">
                <div className="bg-[#f2f9ff] rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                  <h6 className="text-gray-500 text-xs mb-2">
                    <i className="bi bi-x-circle text-red-500 text-base"></i>{" "}
                    Rejected
                  </h6>
                  <div className="flex justify-between items-center">
                    <h3 className="text-[var(--primary-blue)] text-xl mb-0">
                      0
                    </h3>
                  </div>
                  {/* <p className="text-gray-500 text-[0.7rem] mb-0">Avg | 8</p> */}
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Leads Section */}
        <section className="p-2 md:p-6 xl:p-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h5 className="mb-4 text-[var(--primary-blue)] text-lg font-semibold">
              Recent Activity
            </h5>
            <div className="space-y-4">
              {/* Credit Note Activity */}
              <Link to="/credit" className="no-underline block">
                <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md hover:-translate-y-0.5 duration-200 cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-green-200 transition-colors">
                    <i className="bi bi-currency-dollar text-green-500 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)] transition-colors">
                      New credit note generated
                    </p>
                    {/* <p className="text-xs text-gray-500">2 hours ago</p> */}
                  </div>
                  <span className="text-green-500 text-sm font-medium group-hover:scale-110 transition-transform">
                    {/* +$800 */}
                  </span>
                </div>
              </Link>

              {/* Vehicle Sold Activity */}
              <Link to="/vehicle" className="no-underline block">
                <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md hover:-translate-y-0.5 duration-200 cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                    <i className="bi bi-car-front-fill text-blue-500 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)] transition-colors">
                      Vehicle sold
                    </p>
                    {/* <p className="text-xs text-gray-500">5 hours ago</p> */}
                  </div>
                  <span className="text-blue-500 text-sm font-medium group-hover:scale-110 transition-transform">
                    {/* +1 */}
                  </span>
                </div>
              </Link>

              {/* Invoice Activity */}
              <Link to="/invoice" className="no-underline block">
                <div className="flex items-center p-3 bg-[#f2f9ff] rounded-lg hover:shadow-md hover:-translate-y-0.5 duration-200 cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors">
                    <i className="bi bi-receipt text-purple-500 text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-[var(--primary-blue)] transition-colors">
                      Invoice submitted
                    </p>
                    {/* <p className="text-xs text-gray-500">1 day ago</p> */}
                  </div>
                  <span className="text-purple-500 text-sm font-medium group-hover:scale-110 transition-transform">
                    {/* INV002 */}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Vehicle Models Section */}
        <section className="p-3 md:p-6 xl:p-10">
          <h5 className="mb-3 text-[var(--primary-blue)] text-lg">
            Vehicle Models {galleries.length > 0 && `(${galleries.length})`}
          </h5>

          {/* Debug info */}
          {galleries.length === 0 && !loading && (
            <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
              <i className="bi bi-exclamation-triangle text-yellow-500 text-2xl mb-2"></i>
              <p className="text-yellow-700 font-medium">
                No vehicle models found
              </p>
              <p className="text-yellow-600 text-sm mt-1">
                Check the browser console for API response details
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm"
              >
                Reload Page
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {galleries.map((gallery, idx) => {
              const imageUrl = getVariantImage(gallery);
              const hasImageError = imageErrors[gallery.id];

              return (
                <div
                  key={gallery.id || idx}
                  className="bg-white text-center rounded-lg p-4 hover:shadow-md hover:-translate-y-0.5 transition-all relative border border-gray-200"
                >
                  <span className="absolute top-2.5 right-2.5 text-gray-500 text-[0.65rem] bg-gray-100 rounded-full px-2 py-1">
                    {gallery.open_leads_count || 0} leads
                  </span>
                  <div className="mb-2 h-32 flex items-center justify-center bg-gray-100 rounded">
                    <img
                      src={
                        hasImageError
                          ? "https://via.placeholder.com/160x120/f3f4f6/6b7280?text=No+Image"
                          : imageUrl
                      }
                      alt={gallery.variant_name}
                      className="max-h-full max-w-full object-contain"
                      onError={() => handleImageError(gallery.id)}
                      onLoad={() =>
                        console.log(`✅ Image loaded: ${gallery.variant_name}`)
                      }
                    />
                  </div>
                  <h6 className="text-sm mb-1 font-semibold text-gray-800">
                    {gallery.variant_name || `Model ${idx + 1}`}
                  </h6>
                  <p className="text-xs text-gray-600">
                    {gallery.brand_name || "Unknown Brand"}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Add New Lead Button */}
        <Link
          to="/leads/generate"
          className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-[var(--primary-blue)] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all text-2xl z-50"
        >
          <i className="bi bi-plus-lg"></i>
        </Link>
      </div>

      <style jsx>{`
        :root {
          --primary-blue: #0f66af;
          --light-grey: #ced4da;
          --highlight-yellow: #ffd700;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .container-animate {
          animation: fadeIn 0.5s ease-in;
        }

        .lead-card {
          border-left: 4px solid var(--primary-blue);
        }

        .carousel-container {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .carousel-track {
          display: flex;
          transition: transform 0.6s ease-in-out;
        }

        .carousel-item {
          flex: 0 0 100%;
          position: relative;
        }

        .carousel-item img {
          width: 100%;
          object-fit: cover;
          border-radius: 0.5rem;
        }

        @media (min-width: 768px) {
          .carousel-item img {
            height: 250px;
          }
        }

        .carousel-control {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 5%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        .carousel-control:hover {
          opacity: 0.9;
        }

        .carousel-control-prev {
          left: 0;
        }

        .carousel-control-next {
          right: 0;
        }

        .carousel-control i {
          font-size: 1.5rem;
          color: white;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          padding: 10px;
        }

        .badge {
          padding: 0.25em 0.4em;
          font-size: 0.75em;
          font-weight: 700;
          line-height: 1;
          text-align: center;
          white-space: nowrap;
          vertical-align: baseline;
          border-radius: 0.25rem;
        }
      `}</style>
    </div>
  );
}

// --- Loader and ErrorMessage Components ---
function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <span className="text-gray-600 font-medium">Loading...</span>
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
