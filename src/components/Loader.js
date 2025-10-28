import React, { useContext } from "react";
import { LoaderContext } from "../context/LoaderContext";

export default function Loader() {
  const { loading } = useContext(LoaderContext);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="px-6 py-4 bg-white rounded shadow-lg font-semibold">
        Loading ...
      </div>
    </div>
  );
}
