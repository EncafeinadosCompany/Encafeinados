
"use client"
import React from "react";
import { Input } from "@/common/ui/input"

export const InputForm = ({id, placeholder, type, className, ...props}:React.ComponentProps<"input">)=>{
    return (
        <Input 
        data-testid={"custom-input-form"}
        className={`rounded-full placeholder:text-xs sm:placeholder:text-sm text-black border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all ${className}`} 
        id={id}
        type={type}
        placeholder={placeholder}
        {...props}
        />
    )
}