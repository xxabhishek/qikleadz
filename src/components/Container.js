// src/components/Container.jsx
import React from "react";

export default function Container({ children }) {
  return (
    <div className="min-h-screen w-full p-2" style={{ padding: "0.4rem" }}>
      <div className="w-full max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
