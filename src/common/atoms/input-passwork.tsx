import { Input } from "../ui/input"

export const InputPassword =  ({...props}:React.ComponentProps<"input">)=>{
    return (
      <Input type="password"  className="pl-5 rounded-full border-gray-500 focus-visible:ring-amber-900" {...props} />
    )
}
