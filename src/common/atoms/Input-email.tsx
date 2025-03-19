import { Input } from "../ui/input"

export const InputEmail  =  ({...props}:React.ComponentProps<"input">)=>{
    return (
      <Input type="email" id="email" placeholder="Correo electrónico" className="rounded-full border-gray-500 focus-visible:ring-amber-900" {...props} />
    )
}
