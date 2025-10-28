// src/components/Layout/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-center p-2">
      <p>© {new Date().getFullYear()} Executive Panel</p>
    </footer>
  );
}
