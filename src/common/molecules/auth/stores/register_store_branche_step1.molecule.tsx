import { InputForm } from "@/common/atoms/forms/input_form.atom"
import { TextError } from "@/common/atoms/forms/text_error.atom"
import { useRegisterFocus } from "@/common/hooks/auth/use_register_focus.hook"
import { Label } from "@/common/ui/label"
import { RegisterStoreBrancheSchemaType } from "@/common/utils/schemas/auth/register_store_branche.schema"

import { Phone, Store } from'@/common/ui/icons'
import { UseFormRegister } from "react-hook-form"

interface RegisterStoreBranchesProps {
    register: UseFormRegister<RegisterStoreBrancheSchemaType>
    error: any
    isImage?: boolean
}


export default function RegisterStoreBrancheStep1({ register, error, isImage = true}: RegisterStoreBranchesProps) {

    const { focusedField, registerWithFocus } = useRegisterFocus()

    return (
        <>
            <div className={`md:space-y-2 grid p-0 md:${isImage? "grid-cols-2 ":"grid-cols-1"}h-full`}>
                {/* hidden */}
                {isImage && (
                <div className="relative md:flex items-center justify-center w-full h-[30vh]  md:h-full rounded-xl overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center ">
                        <img
                            src="/cafeino.png"
                            alt="Café"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    </div>
                </div>
                )}
                <div className="flex flex-col justify-center sm:p-5 gap-4 py-2 ">
                    <div className="grid gap-2 relative">
                        <Label className={`flex items-center text-xs transition-colors ${focusedField === "name" ? "text-[#DB8935] " : "text-gray-600"
                            }`}>Nombre de la sucursal</Label>
                        <div className="relative">
                            <Store className="absolute top-3 left-4 text-gray-400" size={18} />
                            <InputForm
                                id="branchName"
                                {...register('name')}
                                {...registerWithFocus('name')}
                                className="pl-10"
                                placeholder="Ingrese el nombre de la sucursal"
                            />
                        </div>
                        {error?.name && (
                            <TextError>{error.name.message}</TextError>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label className={`flex items-center text-xs transition-colors ${focusedField === "phone_number" ? "text-[#DB8935] " : "text-gray-600"
                            }`}>Número de teléfono</Label>
                        <div className="relative">
                            <Phone className="absolute top-3 left-4 text-gray-400" size={18} />


                            <InputForm
                                id="phoneNumber"
                                {...register('phone_number')}
                                {...registerWithFocus('phone_number')}
                                placeholder="Ingrese el número de teléfono"
                                className="pl-10"
                            />
                        </div>
                        {error?.phone_number && (
                            <TextError>{error.phone_number.message}</TextError>
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}