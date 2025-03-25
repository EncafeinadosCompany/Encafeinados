import { Input } from "@/common/ui/input"
import { UseFormRegister } from "react-hook-form"
import { string } from "zod"

interface InputFormProst {
    id:string,
    placeholder:string
    type?:string
}


export const InputForm = ({id, placeholder, type, ...props}:InputFormProst)=>{
    return (
        <Input 
        className="text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500  border-gray-300 rounded-lg" 
        id={id}
        type={type}
        placeholder={placeholder}
        {...props}
        />
    )
}