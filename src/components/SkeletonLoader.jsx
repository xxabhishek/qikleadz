import React from "react";

export const Skeleton = ({ className = "" }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    style={{
      background:
        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
    }}
  />
);

export const SkeletonCard = () => (
  <div className="bg-white rounded-lg p-4 shadow-sm">
    <Skeleton className="h-5 w-24 mb-3" /> {/* Title */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-16" /> {/* Big number */}
      <Skeleton className="h-4 w-20" /> {/* Small text */}
    </div>
  </div>
);

export const SkeletonBrandCard = () => (
  <div className="bg-white rounded-lg p-4 shadow-sm flex flex-col items-center">
    <Skeleton className="w-full h-32 mb-3 rounded-lg" /> {/* Image */}
    <Skeleton className="h-5 w-3/4 mb-1" /> {/* Brand name */}
    <Skeleton className="h-4 w-1/2" /> {/* Optional variant/count */}
  </div>
);

export const SkeletonCarousel = () => (
  <div className="relative rounded-lg overflow-hidden shadow-sm">
    <Skeleton className="w-full h-48 md:h-64" />
    {/* Fake navigation buttons */}
    <div className="absolute inset-0 flex items-center justify-between px-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <Skeleton className="w-10 h-10 rounded-full" />
    </div>
  </div>
);
