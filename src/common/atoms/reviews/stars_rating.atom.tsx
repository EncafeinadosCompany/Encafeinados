import React from "react";
import { Star } from'@/common/ui/icons';
import { useSafeNumericValue } from "@/common/hooks/reviews/use_safe_numeric_value.hook";

interface StarsRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  maxValue?: number;
  size?: "xs" | "sm" | "md" | "lg";
  readOnly?: boolean;
}

export const StarsRating = ({
  value,
  onChange,
  maxValue = 5,
  size = "md",
  readOnly = false,
}: StarsRatingProps) => {
  const { safeValue } = useSafeNumericValue(value);

  const starSizes = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleClick = (newRating: number) => {
    if (readOnly) return;
    onChange?.(newRating);
  };

  return (
    <div className="flex">
      {[...Array(maxValue)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            className={`${!readOnly && "cursor-pointer"} p-0.5`}
            onClick={() => handleClick(starValue)}
          >
            <Star
              className={`${starSizes[size]} transition-colors ${
                starValue <= (safeValue as number)
                  ? "text-amber-400 fill-amber-400"
                  : "text-gray-300"
              }`}
            />
          </span>
        );
      })}
    </div>
  );
};

export default StarsRating;