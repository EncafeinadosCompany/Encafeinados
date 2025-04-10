import { InputForm } from "@/common/atoms/auth/inputForm"
import { TextError } from "@/common/atoms/textError"
import { useRegisterFocus } from "@/common/hooks/auth/useRegisterFocus"
import { Label } from "@/common/ui/label"
import { RegisterStoreBrancheSchemaType } from "@/common/utils/schemas/auth/registerStoreBrancheSchema"

import { Phone, Store } from "lucide-react"
import { UseFormRegister } from "react-hook-form"

interface RegisterStoreBranchesProps  {
register: UseFormRegister<RegisterStoreBrancheSchemaType>
error: any 
control: any
}


export default function RegisterStoreBrancheStep1  ({register, control, error}:RegisterStoreBranchesProps)  {

    const {focusedField} = useRegisterFocus()

    return (
        <div className="space-y-4 sm:space-y-6 grid p-0 md:grid-cols-2 h-full md:min-h-[420px]">
            {/* hidden */}
            <div className="relative md:flex items-center  justify-center w-full h-full rounded-xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center p-10">
                    <img
                        src="/cafeino.png"
                        alt="Café"
                        className="max-w-full max-h-full object-contain rounded-lg"
                    />
                </div>
            </div>
            <div className="flex flex-col justify-center sm:p-5 gap-8 py-4">
                <div className="grid gap-2 relative">
                    <Label  className={`flex items-center text-xs transition-colors ${focusedField === "name" ? "text-[#3e90a4]" : "text-gray-600"
                        }`}>Nombre de la sucursal</Label>
                    <div className="relative">
                        <Store className="absolute top-3 left-4 text-gray-400" size={18} />
                        <InputForm
                            id="branchName"
                            {...register('name')}
                            className="pl-10"
                            placeholder="Ingrese el nombre de la sucursal"
                        />
                    </div>
                    {error?.name && (
                        <TextError>{error.name.message}</TextError> 
                    )}
                </div>
                <div className="grid gap-2">
                    <Label  className={`flex items-center text-xs transition-colors ${focusedField === "phone_number" ? "text-[#3e90a4]" : "text-gray-600"
                        }`}>Número de teléfono</Label>
                    <div className="relative">
                        <Phone className="absolute top-3 left-4 text-gray-400" size={18} />


                        <InputForm
                            id="phoneNumber"
                            {...register('phone_number')}
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
    )
}