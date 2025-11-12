import React, { useEffect, useState } from "react";

export default function Stepper({ step = 1 }) {
  const steps = ["Model Selection", "Model Details", "Lead Information"];
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const newProgress =
      step === 1
        ? 100 / (steps.length - 1) / 2
        : ((step - 1) / (steps.length - 1)) * 100;

    const timeout = setTimeout(() => setProgress(newProgress), 50);
    return () => clearTimeout(timeout);
  }, [step, steps.length]);

  return (
    <div className="w-full">
      {/* Step Labels */}
      <div className="flex justify-between mb-[0.3rem] text-[0.65rem] sm:text-xs md:text-sm font-medium flex-wrap gap-x-1">
        {steps.map((label, idx) => (
          <span
            key={idx}
            className={`transition-colors duration-500 text-center flex-1 ${
              step === idx + 1
                ? "text-[#0f66af] font-semibold"
                : idx + 1 < step
                ? "text-[#0f66af]/80"
                : "text-gray-400"
            }`}
          >
            {label}
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-[0.35rem] sm:h-[0.4rem] bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%`, backgroundColor: "#0f66af" }}
        ></div>
      </div>
    </div>
  );
}
