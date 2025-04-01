import React from "react";
import { Input } from "../ui/input"

export const InputEmail  =  ({...props}:React.ComponentProps<"input">)=>{
    return (
      <Input type="email" id="email" data-testid="custom-input-email"  placeholder="Correo electrónico" className="pl-5 px-4 py-2  border bg-gray-100  rounded-full border-gray-400 focus-visible:ring-amber-900" {...props} />
    )
}
