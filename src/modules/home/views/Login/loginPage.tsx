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
    <>
        <div className="flex min-h-screen items-center justify-center bg-gray-50 ">
            
        <Formlogin></Formlogin>
     </div>
    </>
    )
    
}