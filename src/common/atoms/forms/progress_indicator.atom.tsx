import React from "react";
import { Check } from "@/common/ui/icons";

interface ProgressIndicatorProps {
  step: number;
  totalSteps: number;
  className?: string;
}

const ProgressIndicator = ({ step, totalSteps, className }: ProgressIndicatorProps) => {
  return (
    <div className={`relative flex items-center justify-between mb-8 ${className}`}>
      {/* Background line that spans the entire width */}
      <div className="absolute left-0 right-0 h-[2px] bg-gray-500"></div>
      
      {/* Progress line for completed steps */}
      <div className="absolute left-0 h-[2px] bg-amber-600" style={{ 
        width: `${(step - 1) * 100 / (totalSteps - 1)}%`
      }}></div>
      
      {/* Step indicators */}
      <div className="relative z-10 flex justify-between w-full">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step > index + 1
                  ? "bg-gray-900 text-white"
                  : step === index + 1
                  ? "bg-white border-2 border-gray-900 text-gray-900"
                  : "bg-white border-2 border-gray-900 text-gray-900"
              }`}>
              {step > index + 1 ? <Check className="w-4 h-4" role="svg" /> : index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;