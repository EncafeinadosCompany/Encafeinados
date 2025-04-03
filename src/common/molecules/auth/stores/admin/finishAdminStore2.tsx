import { InputForm } from "@/common/atoms/auth/inputForm"
import SelectTypeDocument from "@/common/atoms/auth/selectTypeDocument"
import { Label } from "@radix-ui/react-label"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="name">Nombre</Label>
                            <InputForm
                                id="name"
                                type="text"
                                {...register('name')}
                                placeholder="Ingresa tu nombre"
                            />
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="name">Apellidos</Label>
                            <InputForm
                                id="apellidos"
                                type="text"
                                {...register('last_name')}
                                placeholder="Ingresa tus apellídos"
                            />
                            {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>

                            <Controller
                                control={control}
                                name="type_document"
                                render={({ field }) => (
                                    <div>
                                        <Label htmlFor="documentType" className="text-sm font-medium">
                                            Tipo de Documento
                                        </Label>
                                        <SelectTypeDocument
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        />
                                    </div>
                                )} />
                            {errors?.type_document && <p className="text-red-500">{errors.type_document.message}</p>}
                        </div>

                        <div>
                            <Label htmlFor="document_number" className="text-sm items-end font-medium">
                                Número de Documento
                            </Label>
                            <InputForm
                                id="number_document"
                                type="number"
                                {...register("number_document")}
                                placeholder="Ingresa tu número de documento"
                            />
                            {errors?.number_document && <p className="text-red-500">{errors.number_document.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="phone_number" className="text-sm font-medium">
                                Teléfono / Celular
                            </Label>

                            <InputForm
                                id="phone_number"
                                type="tel"
                                {...register("phone_number")}
                                placeholder="Número de teléfono"
                            />
                            {errors?.phone_number && <p className="text-red-500">{errors.phone_number.message}</p>}
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}