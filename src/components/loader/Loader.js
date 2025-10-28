// src/components/common/Loader.js
import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white/70 backdrop-blur-sm z-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-700 font-medium">Loading...</span>
    </div>
  );
}
