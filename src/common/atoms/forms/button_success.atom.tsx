import { Button } from "@/common/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface ButtonSuccessProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isValid?: boolean;
  variant?: "default" | "emerald" | "teal";
}

export function ButtonSuccess({
  children,
  isValid = true,
  variant = "emerald",
  className,
  disabled,
  ...props
}: ButtonSuccessProps) {
  const baseStyles = "text-xs sm:text-sm rounded-lg sm:rounded-xl px-4 sm:px-6 py-1.5 sm:py-2 transition-all duration-200";
  
  const variantStyles = {
    default: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white",
    emerald: "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white",
    teal: "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
  };

  const disabledStyles = "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300";
  
  const isDisabled = disabled || !isValid;

  return (
    <Button
      disabled={isDisabled}
      className={cn(
        baseStyles,
        isDisabled ? disabledStyles : variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}