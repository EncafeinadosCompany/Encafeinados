import { InputForm } from "@/common/atoms/auth/inputForm"
import SelectTypeDocument from "@/common/atoms/auth/selectTypeDocument"
import { Label } from "@radix-ui/react-label"
import { FileText, Hash, Phone, User } from "lucide-react"
import { Controller, UseFormRegister } from "react-hook-form"

interface registerAdminProps {
    register: UseFormRegister<any>
    errors: any
    control: any
}

export const RegisterBranchesStep1 = ({ register, control, errors }: registerAdminProps) => {
    return (
        <div className="space-y-8 mx-auto max-w-4xl p-6 ">
            <div className="grid grid-cols-1  gap-8">
                <div className="text-center mb.3">
                <p className="text-gray-400">¡Aqui prodras registrar una nueva sucursal a tu tienda!</p>
                </div>
                <div className="relative flex flex-col space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre de la sucursal</Label>
                    <div className="relative">
                        <User className="absolute top-3 left-4 text-gray-400" size={18} />
                        <InputForm
                            id="name"
                            type="text"
                            {...register('name')}
                            placeholder="Ingresa tu nombre"
                            className="pl-12 pr-4 py-3 rounded-lg text-gray-800 border shadow-sm border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    <div className="relative flex flex-col space-y-2">
                    <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                        Teléfono / Celular
                    </Label>
                    <div className="relative">
                        <Phone className="absolute top-3 left-4 text-gray-400" size={18} />
                        <InputForm
                            id="phone_number"
                            type="tel"
                            {...register("phone_number")}
                            placeholder="Número de teléfono"
                            className="pl-12 pr-4 py-3 rounded-lg text-gray-800 border shadow-sm border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                    </div>
                    {errors?.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}
                </div>


                </div>
            </div>
        </div>
    )
}