import { ButtonSubmit } from "@/common/atoms/button-submit"
import { InputEmail } from "@/common/atoms/Input-email"
import { Input } from "@/common/ui/input"
import Formlogin from "@/common/widgets/forms/formLogin"
import { useState } from "react"

export const LoginPage = () => {

    const [data, setData] = useState("")
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setData(event.target.value);
    }

    return (
    
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-2 md:p-10 bg-[#FAF3E0]">
        <div className="w-full max-w-sm md:max-w-3xl">
          <Formlogin />
        </div>
      </div>

    )
    
}