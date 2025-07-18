
import { InputEmail } from "@/common/atoms/forms/Input_email.atom"
import { InputPassword } from "@/common/atoms/forms/input_passwork"
import { useRegisterFocus } from "@/common/hooks/auth/use_register_focus.hook"

import { Label } from "@radix-ui/react-label"
import { Lock, Mail } from'@/common/ui/icons'
import { UseFormRegister } from "react-hook-form"


interface registerAdminProps {
    register: UseFormRegister<any>
    errors: any
    direction: number
    control: any
}

export default function RegisterAdminStoreStep2 ({ register, errors }: registerAdminProps){

    const { registerWithFocus, focusedField } = useRegisterFocus()
    return (
        <div className="space-y-6 mx-2 ">
            <div className="flex flex-col relative  space-y-2">
                <Label className={`flex items-center text-xs transition-colors ${focusedField === "email" ? "text-[#DB8935]" : "text-gray-600"}`}>Correo electrónico</Label>
                <Mail className="absolute top-9 left-4 text-gray-400" size={18} />
                <InputEmail
                    id="email"
                    type="email"
                    {...register('email')}
                    {...registerWithFocus('email')}
                    placeholder="TiendaEspecialidad@example.com"
                    className="rounded-full pl-10 text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"

                />
                {errors.email && <p className="text-xs m-2 text-red-700">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className=" relative flex flex-col space-y-2">
                    <Label className={`flex items-center text-xs transition-colors ${focusedField === "password" ? "text-[#DB8935]" : "text-gray-600"}`}>Crea tu PIN</Label>
                    <Lock className="absolute top-9 left-4 text-gray-400" size={18} />
                    <InputPassword
                        {...register('password')}
                        {...registerWithFocus('password')}
                        id="firstName" placeholder="Ingresa tu PIN"
                        className="rounded-full pl-10 text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"

                    />
                    {errors.password && <p className="text-xs m-2 text-red-700">{errors.password.message}</p>}
                </div>

                <div className="relative flex flex-col space-y-2">
                    <Label className={`flex items-center text-xs transition-colors ${focusedField === "confirmPassword" ? "text-[#DB8935]" : "text-gray-600"}`}>Confirmar tu PIN</Label>
                    <Lock className="absolute top-9 left-4 text-gray-400" size={18} />
                    <InputPassword
                        id="lastName"
                        {...register('confirmPassword')}
                        {...registerWithFocus('confirmPassword')}
                        placeholder="Confirma tu PIN"
                        className="rounded-full pl-10 text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"

                    />
                    {errors?.confirmPassword && <p className="text-red-700 m-2 text-xs">{errors.confirmPassword.message}</p>}
                </div>
            </div>
        </div>
    )
}