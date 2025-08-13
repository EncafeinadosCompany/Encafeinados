import { InputForm } from "@/common/atoms/forms/input_form.atom"
import { TextError } from "@/common/atoms/forms/text_error.atom"
import { useRegisterFocus } from "@/common/hooks/auth/use_register_focus.hook"
import { Label } from "@radix-ui/react-label"
import { Phone, Store} from'@/common/ui/icons'
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
                            {...register('name')}
                            {...registerWithFocus('name')}
                            placeholder="Ingresa tu nombre"
                            className="rounded-full pl-10 text-gray-600 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
                        />
                    </div>
                    {errors.name && <TextError>{errors.name.message}</TextError>}
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
                                {...register("phone_number")}
                                {...registerWithFocus("phone_number")}
                                placeholder="Número de teléfono"
                                className="rounded-full pl-10 text-gray-600 border border-gray-400  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
                            />
                        </div>
                        {errors?.phone_number && <TextError >{errors.phone_number.message}</TextError>}
                    </div>


                </div>
            </div>
        </div>
    )
}