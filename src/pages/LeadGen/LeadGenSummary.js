import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Stepper from "../../components/Stepper";

const LeadGenSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allVehicles = [] } = location.state || [];

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmitAll = () => {
    alert("All leads submitted successfully!");
    navigate("/thank-you");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Stepper */}
      <Stepper step={4} />

      {/* Blue Header */}
      <div className="bg-[#0f66af] text-white rounded-t-xl px-6 py-3 mt-6 shadow-sm">
        <h3 className="text-lg font-semibold">Lead Summary</h3>
      </div>

      {/* White Card */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 p-6">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2 mb-4 text-sm hover:bg-gray-200 transition-colors flex items-center"
        >
          ← Back
        </button>

        {/* Summary Section */}
        {allVehicles.length > 0 ? (
          allVehicles.map((vehicle, index) => (
            <div
              key={index}
              className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <h4 className="text-[#0f66af] text-lg font-semibold mb-4">
                Vehicle {index + 1}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Details */}
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Customer Name:</span>{" "}
                    {vehicle.customerName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Phone Number:</span>{" "}
                    {vehicle.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Location:</span>{" "}
                    {vehicle.customerLocation}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Purchase Date:</span>{" "}
                    {vehicle.purchaseDate}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Quantity:</span>{" "}
                    {vehicle.quantity}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Payment Mode:</span>{" "}
                    {vehicle.paymentMode}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">OEM:</span>{" "}
                    {vehicle.oem_id
                      ? oems.find((oem) => oem.id === vehicle.oem_id)?.name ||
                        "N/A"
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Notes:</span> {vehicle.notes}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Variant:</span>{" "}
                    {vehicle.variant?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Brand:</span>{" "}
                    {vehicle.variant?.brand_id
                      ? vehicle.brands.find(
                          (b) => b.id === vehicle.variant.brand_id
                        )?.name || "N/A"
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">CC:</span>{" "}
                    {vehicle.variant?.cc_id
                      ? vehicle.ccs.find((c) => c.id === vehicle.variant.cc_id)
                          ?.name || "N/A"
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Fuel Type:</span>{" "}
                    {vehicle.variant?.fuel_type_id
                      ? vehicle.fuelTypes.find(
                          (f) => f.id === vehicle.variant.fuel_type_id
                        )?.name || "N/A"
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Price:</span>{" "}
                    {vehicle.variant?.basic_price
                      ? `₹${parseFloat(
                          vehicle.variant.basic_price
                        ).toLocaleString()}`
                      : "Price on request"}
                  </p>
                </div>

                {/* Gallery */}
                {vehicle.galleries && vehicle.galleries.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {vehicle.galleries
                      .filter((g) => g.variant_id === vehicle.variant?.id)
                      .map((g, idx) => {
                        let photos = [];
                        try {
                          photos = JSON.parse(g.cover_photos);
                          if (!Array.isArray(photos)) photos = [g.cover_photos];
                        } catch (e) {
                          photos = [g.cover_photos];
                        }

                        return photos.map((photo, pIdx) => (
                          <img
                            key={`${idx}-${pIdx}`}
                            src={`http://localhost:8000/uploads/coverPhotos/${photo}`}
                            alt={`Gallery ${idx}-${pIdx}`}
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                        ));
                      })}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No vehicles added yet.</p>
        )}

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
          <button
            onClick={handleBack}
            className="bg-gray-100 text-gray-700 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSubmitAll}
            className="bg-[#0f66af] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Submit All Leads
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadGenSummary;
