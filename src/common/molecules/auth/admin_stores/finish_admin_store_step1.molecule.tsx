import { InputForm } from "@/common/atoms/forms/input_form.atom"
import SelectTypeDocument from "@/common/atoms/forms/select_type_document.atom"
import { TextError } from "@/common/atoms/forms/text_error.atom"
import { useRegisterFocus } from "@/common/hooks/auth/use_register_focus.hook"
import { Label } from "@radix-ui/react-label"
import { FileText, Hash, Phone, User } from'@/common/ui/icons'
import { Controller, UseFormRegister } from "react-hook-form"



interface registerAdminProps {
    register: UseFormRegister<any>
    errors: any
    control: any
}



export default function RegisterAdminStoreStep1({ register, control, errors }: registerAdminProps) {

    const { registerWithFocus, focusedField } = useRegisterFocus()

    return (
        <>
            <div>
                <div className="space-y-6 mx-3 ">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative flex flex-col space-y-2">
                            <Label className={`flex items-center text-xs transition-colors ${focusedField === "name" ? "text-[#DB8935]" : "text-gray-600"}`}>Nombre</Label>
                            <User className="absolute top-9 left-4 text-gray-400" size={18} />
                            <InputForm
                                id="name"
                                type="text"
                                {...register('name')}
                                {...registerWithFocus('name')}
                                placeholder="Ingresa tu nombre"
                                className=" bg-white/20 pl-10 text-gray-600  border-gray-300  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
                            />
                            {errors.name && <p className="text-red-700 text-xs">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col relative space-y-2">
                            <Label className={`flex items-center text-xs transition-colors ${focusedField === "last_name" ? "text-[#DB8935]" : "text-gray-600"}`}>Apellidos</Label>

                            <User className="absolute top-9 left-4 text-gray-400" size={18} />
                            <InputForm
                                id="apellidos"
                                type="text"
                                {...register('last_name')}
                                {...registerWithFocus('last_name')}
                                placeholder="Ingresa tus apellídos"
                                className=" bg-white/20 pl-10 text-gray-600  border-gray-300 focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"

                            />
                            {errors.last_name && <p className="text-red-700 text-xs">{errors.last_name.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className={`m-1 flex items-center text-xs transition-colors ${focusedField === "type_document" ? "text-[#DB8935]" : "text-gray-600"}`}>Tipo de documento</Label>
                            <Controller
                                control={control}
                                name="type_document"
                                render={({ field }) => (
                                    <div className="relative">
                                        <FileText className="absolute top-3 left-4 text-gray-400" size={16} />
                                        <SelectTypeDocument
                                            className="bg-white/20 pl-10 text-gray-600 focus:ring-[0.5px] focus:ring-[#DB8935]   border-gray-300 rounded-full "
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        />
                                        {errors?.type_document && <TextError>{errors.type_document.message}</TextError>}
                                    </div>
                                )} />

                        </div>

                        <div className="relative">
                            <Label className={`flex items-center m-2 text-xs transition-colors ${focusedField === "number_document" ? "text-[#DB8935]" : "text-gray-600"}`}>Número de documento</Label>

                            <Hash className="absolute top-11 left-4 text-gray-400" size={15} />
                            <InputForm
                                id="number_document"
                                type="number"
                                {...register("number_document")}
                                {...registerWithFocus("number_document")}
                                placeholder="Ingresa tu número de documento"
                                className="bg-white/20 pl-10 text-gray-600  border-gray-300 focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"
                            />
                            {errors?.number_document && <p className="text-red-700 text-xs m-2">{errors.number_document.message}</p>}
                        </div>
                        <div className="relative">
                            <Label className={`flex items-center m-2 text-xs transition-colors ${focusedField === "phone_number" ? "text-[#DB8935]" : "text-gray-600"}`}>Teléfono / Celular</Label>

                            <Phone className="absolute top-11 left-4 text-gray-400" size={15} />
                            <InputForm
                                id="phone_number"
                                type="tel"
                                {...register("phone_number")}
                                {...registerWithFocus("phone_number")}
                                placeholder="Número de teléfono"
                                className="bg-white/20 pl-10 text-gray-600  border-gray-300  focus:ring-2 focus:ring-[#DB8935] focus:border-transparent transition-all"

                            />
                            {errors?.phone_number && <p className="text-red-700 text-xs m-2">{errors.phone_number.message}</p>}
                        </div>
                        <div>
                        </div>
                    </div>

                </div>

            </div>
        </>
    )
}