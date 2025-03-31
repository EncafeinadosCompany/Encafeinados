import React from "react";
import { Input } from "@/common/ui/input"

export const InputForm = ({id, placeholder, type, ...props}:React.ComponentProps<"input">)=>{
    return (
        <Input 
        data-testid={"custom-input-form"}
        className="text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500  border-gray-300 rounded-lg" 
        id={id}
        type={type}
        placeholder={placeholder}
        {...props}
        />
    )
}