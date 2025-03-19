import type { ComponentPropsWithoutRef } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const ButtonSubmit: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseStyles = "w-full  rounded-full flex justify-center py-2 px-4 border  shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles = variant === 'primary'
    ? "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 r"
    : "bg-gray-300 hover:bg-gray-400 text-gray-700 focus:ring-gray-500";

  return (
    <Button
      {...props}
      className={`${baseStyles} ${variantStyles}`}
    >
      {children}
    </Button>
  );
};