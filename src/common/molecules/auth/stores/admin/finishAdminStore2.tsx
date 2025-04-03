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

export const FinistAdminStore2 = ({ register, control, errors }: registerAdminProps) => {
    return (
        <>
            <div>
                <div className="space-y-6 mx-3 ">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative flex flex-col space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <User className="absolute top-11 left-4 text-gray-400" size={18} />
                            <InputForm
                                id="name"
                                type="text"
                                {...register('name')}
                                placeholder="Ingresa tu nombre"
                                className="rounded-full text-center border shadow-sm border-gray-200 bg-gray-50"
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col relative space-y-2">
                            <Label htmlFor="name">Apellidos</Label>
                            <User className="absolute top-11 left-4 text-gray-400" size={18} />
                            <InputForm
                                id="apellidos"
                                type="text"
                                {...register('last_name')}
                                placeholder="Ingresa tus apellídos"
                                className="rounded-full border shadow-sm text-center border-gray-200 bg-gray-50"
                            />
                            {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
                        <div>

                            <Controller
                                control={control}
                                name="type_document"
                                render={({ field }) => (
                                    <div className="relative">
                                        <Label htmlFor="documentType" className="text-sm font-medium">
                                            Tipo de Documento
                                        </Label>
                                         <FileText className="absolute top-8 left-3 text-gray-400" size={20} />

                                        <SelectTypeDocument
                                            className="w-full rounded-full border shadow-sm border-gray-200 bg-gray-50"
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            
                                        />
                                    </div>
                                )} />
                            {errors?.type_document && <p className="text-red-500">{errors.type_document.message}</p>}
                        </div>

                        <div className="relative">
                            <Label htmlFor="document_number" className="text-sm items-end font-medium">
                                Número de Documento
                            </Label>
                            <Hash className="absolute top-9 left-4 text-gray-400" size={15} />
                            <InputForm
                                id="number_document"
                                type="number"
                                {...register("number_document")}
                                placeholder="Ingresa tu número de documento"
                                className="w-full rounded-full text-center border shadow-sm border-gray-200 bg-gray-50"
                            />
                            {errors?.number_document && <p className="text-red-500">{errors.number_document.message}</p>}
                        </div>
                        <div className="relative">
                            <Label htmlFor="phone_number" className="text-sm font-medium">
                                Teléfono / Celular
                            </Label>
                            <Phone className="absolute top-9 left-4 text-gray-400" size={15} />
                            <InputForm
                                id="phone_number"
                                type="tel"
                                {...register("phone_number")}
                                placeholder="Número de teléfono"
                                className="w-full text-center rounded-full border shadow-sm border-gray-200 bg-gray-50"

                            />
                            {errors?.phone_number && <p className="text-red-500">{errors.phone_number.message}</p>}
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}