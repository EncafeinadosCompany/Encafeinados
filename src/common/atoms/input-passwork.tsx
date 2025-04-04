import React from "react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Eye, EyeOff } from "@/common/ui/icons";

export const InputPassword = ({ ...props }: React.ComponentProps<"input">) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        data-testid="custom-input-password"
        className="pl-5 pr-10  px-4 py-2 border  bg-gray-100 rounded-full border-gray-400 focus-visible:ring-amber-900"
        {...props}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};
