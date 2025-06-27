import { Input } from "@/common/ui/input";
import React from "react";

export const InputPin = ({ ...props }: React.ComponentProps<"input">) => {
  return (
    <Input
      type="password"
      id="pin"
      data-testid="custom-input-pin"
      placeholder="****"
      maxLength={4}
      className="pl-5 px-4 py-2 border bg-gray-100 
       rounded-full border-gray-400 focus-visible:ring-amber-900"
      {...props}
    />
  );
};
