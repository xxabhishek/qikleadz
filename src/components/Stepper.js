import React, { useEffect, useState } from "react";

export default function Stepper({ step = 1 }) {
  const steps = ["Model Selection", "Model Details", "Lead Information"];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress = ((step - 0) / (steps.length - 0)) * 100;

    const timeout = setTimeout(() => setProgress(newProgress));
    return () => clearTimeout(timeout);
  }, [step, steps.length]);

  return (
    <div className="max-w-7xl mx-auto mt-6 px-4 md:px-8 xl:px-12">
      {/* Step Labels */}
      <div className="flex items-center justify-between mb-2">
        {steps.map((label, idx) => (
          <span
            key={idx}
            className={`text-xs font-medium ${
              idx + 1 <= step ? "text-[#0f66af]" : "text-gray-400"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1">
        <div
          className="bg-[#0f66af] h-1 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
