import { InputForm } from "@/common/atoms/auth/input_form.atom"
import { pageVariants } from "@/common/atoms/auth/page_variants.atom"
import { Label } from "@radix-ui/react-label"
import { Controller, UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"
import SelectTypeDocument from "@/common/atoms/auth/select_type_document.atom"
import { CurrentSchema } from "@/common/utils/schemas/auth/register_store_shema"
import { useRegisterFocus } from "@/common/hooks/auth/useRegisterFocus"
import { TextError } from "@/common/atoms/textError"
import { FileText, Hash, Mail, Phone, Store } from "lucide-react"


interface registerStoreProps {
    register: UseFormRegister<CurrentSchema>
    errors: any
    direction: number
    control: any
}

const RegisterStoreStep1 = ({ register, errors, direction, control }: registerStoreProps) => {
    const { registerWithFocus, focusedField } = useRegisterFocus()

    return (
        <motion.div
            key="step1"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full "
            style={{ perspective: "1000px" }}>
      
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 relative">
                        <Label className={`flex items-center text-xs transition-colors ${focusedField === "name" ? "text-[#DB8935]" : "text-gray-600"}`}>Nombre de la cafetería</Label>
                        <Store className="absolute top-9 left-4 text-gray-400" size={16}></Store>
                        <InputForm
                            {...register("name")}
                            {...registerWithFocus("name")}
                            id="firstName" placeholder="Ingresa el nombre de tu cafetería"
                            className="pl-10"
                        />
                        {errors?.name && <TextError >{errors.name.message}</TextError>}
                    </div>

                    <div className="space-y-2 relative">
                        <Label className={`flex items-center text-xs transition-colors ${focusedField === "email" ? "text-[#DB8935]" : "text-gray-600"}`}>Correo Electrónico</Label>
                        <Mail className="absolute top-9 left-4 text-gray-400" size={16}/>
                        <InputForm
                            id="email"
                            type="email"
                            className="pl-10"
                            {...register('email')}
                            {...registerWithFocus('email')}
                            placeholder="coffeelover@example.com"
                        />
                        {errors?.email && <TextError>{errors.email.message}</TextError>}
                    </div>
                    <div className="space-y-2">
                        <Label className={`m-1 flex items-center text-xs transition-colors ${focusedField === "type_document" ? "text-[#DB8935]" : "text-gray-600"}`}>Tipo de documento</Label>
                        <Controller
                            control={control}
                            name="type_document"
                            render={({ field }) => (
                                <div className="relative">
                                    <FileText className="absolute top-3 left-4 text-gray-400" size={16}/>
                                    <SelectTypeDocument
                                        className="rounded-full pl-10"
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    />
                                    {errors?.type_document && <TextError>{errors.type_document.message}</TextError>}
                                </div>
                            )} />

                    </div>
                    <div className="space-y-2 relative">
                        <Label className={`flex items-center text-xs transition-colors ${focusedField === "number_document" ? "text-[#DB8935]" : "text-gray-600"}`}>Número de documento</Label>
                        <div>
                        <Hash className="absolute top-9 left-4 text-gray-400" size={14}/>
                        <InputForm
                            id="numero_documento"
                            type="number"
                            className="pl-10"
                            {...register('number_document')}
                            {...registerWithFocus('number_document')}
                            placeholder="Ingrese su número de documento"
                        />
                        </div>
                        {errors?.number_document && <TextError>{errors.number_document.message}</TextError>}
                    </div>
                    <div className="space-y-2 relative">
                        <Label className={`flex items-center text-xs transition-colors ${focusedField === "phone_number" ? "text-[#DB8935]" : "text-gray-600"}`}>Número de teléfono</Label>
                        <Phone className="absolute top-9 left-4 text-gray-400" size={15}></Phone>
                        <InputForm
                            id="phone_number"
                            type="number"
                            className="pl-10"
                            {...register('phone_number')}
                            {...registerWithFocus('phone_number')}
                            placeholder="Ingrese su número de teléfono"
                        />
                        {errors?.phone_number && <TextError>{errors.phone_number.message}</TextError>}
                    </div>

                </div>
           
        </motion.div>
    )
}

export default RegisterStoreStep1