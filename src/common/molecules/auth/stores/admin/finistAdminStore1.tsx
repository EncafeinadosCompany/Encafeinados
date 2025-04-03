import { TitleForm } from "@/common/atoms/auth/titleForm"
import { InputEmail } from "@/common/atoms/Input-email"
import { InputPassword } from "@/common/atoms/input-passwork"

import { Label } from "@radix-ui/react-label"
import { Mail } from "lucide-react"
import { UseFormRegister } from "react-hook-form"



interface registerAdminProps {
    register: UseFormRegister<any>
    errors: any
    direction: number
    control: any
}

export const FinistAdminStore = ({register, errors}:registerAdminProps) => {
    return(
            <div className="space-y-6 mx-2 ">
                <div className="flex flex-col relative  space-y-2">
                    <Label htmlFor="email">Correo Electrónico</Label>
                    <Mail className="absolute top-11 left-4 text-gray-400" size={18} />
                    <InputEmail
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="tiendaEspecialidad@example.com"
                        className="rounded-full pl-10 border shadow-sm  border-gray-200 bg-gray-50"
                    />
                    {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className=" flex flex-col space-y-2">
                        <Label htmlFor="firstName">Contraseña</Label>
                        <InputPassword

                            {...register('password') }
                            id="firstName" placeholder="Ingresa tu contraseña"
                            className="rounded-full border shadow-sm  border-gray-200 bg-gray-50"
                        />
                        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="lastName">Confirma Contraseña</Label>
                        <InputPassword
                            id="lastName"
                            {...register('confirmPassword')}
                            placeholder="Confirma tu contraseña"
                              className="rounded-full border shadow-sm  border-gray-200 bg-gray-50"
                            />
                            
                        {errors?.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                    </div>
                </div>
            </div>
    )
}