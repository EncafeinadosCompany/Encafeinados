import { InputForm } from "@/common/atoms/auth/inputForm"
import { useRegisterFocus } from "@/common/hooks/auth/useRegisterFocus"
import { Label } from "@radix-ui/react-label"
import { Phone, Store} from "lucide-react"
import { useState } from "react"
import {  UseFormRegister } from "react-hook-form"

interface registerAdminProps {
    register: UseFormRegister<any>
    errors: any
}

export const RegisterBranchesStep1 = ({ register,errors }: registerAdminProps) => {
    
    const { focusedField, registerWithFocus } = useRegisterFocus();

    return (
        <div className="space-y-8 mx-auto max-w-4xl p-6">
            <div className="grid grid-cols-1 mt-3 gap-8">
                <div className="relative flex flex-col space-y-2">
                    <Label htmlFor="name" className={`flex items-center text-xs transition-colors ${focusedField === "name" ? "text-[#DB8935]" : "text-gray-600"
                        }`}>Nombre de la sucursal</Label>
                    <div className="relative">
                        <Store className="absolute top-3 left-4 text-gray-400" size={18} />
                        <InputForm
                            id="name"
                            type="text"
                            {...registerWithFocus('name', register)}
                            placeholder="Ingresa tu nombre"
                            className="rounded-full pl-10 text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
                        />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    <div className="flex flex-col space-y-2">
                        <Label htmlFor="phone_number" className={`flex items-center text-xs transition-colors ${focusedField === "phone_number" ? "text-[#DB8935]" : "text-gray-600"
                            }`}>
                            Teléfono / Celular
                        </Label>
                        <div className="relative">
                            <Phone className="absolute top-3 left-4 text-gray-400" size={18} />
                            <InputForm
                                id="phone_number"
                                type="tel"
                                {...registerWithFocus("phone_number", register)}
                                placeholder="Número de teléfono"
                                className="rounded-full pl-10 text-gray-400 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
                            />
                        </div>
                        {errors?.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
                    </div>


                </div>
            </div>
        </div>
    )
}