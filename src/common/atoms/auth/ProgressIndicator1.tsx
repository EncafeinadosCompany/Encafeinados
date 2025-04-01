import { Check } from "@/common/ui/icons";

interface ProgressIndicatorProps {
  step: number;
  totalSteps: number;
}

const ProgressIndicator1 = ({step, totalSteps}:ProgressIndicatorProps) => {
   console.log(step, totalSteps);
    return (
        <div className="flex mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= index + 1
                    ? "bg-gray-900 text-white"
                    : step === index + 1
                      ? "border-2 border-gray-900 text-gray-900"
                      : "border-2 border-gray-900 text-gray-900"
                }`}
              >
              
              {step >= index + 1 ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div className={`flex-1 h-0.5 ${step > index + 1 ? "bg-amber-600 text-white" : "bg-gray-500"}`} />
              )}
            </div>
          ))}
        </div>
    );
};

export default ProgressIndicator1;