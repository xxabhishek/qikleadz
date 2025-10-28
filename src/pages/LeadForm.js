// src/pages/LeadForm.js
import React, { useState } from "react";
import StepOne from "./StepOne";

export default function LeadForm() {
  // Global form state
  const [formData, setFormData] = useState({});
  
  // Step control (if you have multiple steps)
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prev) => prev + 1);
    console.log("Form data so far:", formData);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  return (
    <div className="p-4 md:p-8">
      {step === 1 && (
        <StepOne
          formData={formData}
          setFormData={setFormData}
          nextStep={nextStep}
        />
      )}

      {/* Example for Step 2 */}
      {step === 2 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Step 2: Confirm Data</h2>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <div className="flex justify-between mt-4">
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={() => alert("Form submitted!")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
