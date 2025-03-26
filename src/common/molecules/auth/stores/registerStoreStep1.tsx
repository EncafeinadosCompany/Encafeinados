import { InputForm } from "@/common/atoms/auth/inputs-form"
import { pageVariants } from "@/common/atoms/auth/pageVariants"
import { RegisterStoreSchema } from "@/common/utils/schemas/auth/registerStoreSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@radix-ui/react-label"
import { useState } from "react"
import { Controller, FormProvider, useForm, UseFormRegister } from "react-hook-form"
import { motion } from "framer-motion"
import SelectTypeDocument from "@/common/atoms/auth/selectTypeDocument"
import { RegisterStoreSchemaType } from "@/common/utils/schemas/auth/types/registerShemaType"

interface registerStoreProps {
    register: UseFormRegister<any>
    errors: any
    direction: number
    control: any
}

const RegisterStoreStep1 = ({ register, errors, direction, control }: registerStoreProps) => {
    return (
        <motion.div
            key="step1"
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full"
            style={{ perspective: "1000px" }}
        >

            <div className="space-y-2 m-4">
                <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">Nombre de la cafetería</Label>
                        <InputForm
                            {...register("name")}
                            id="firstName" placeholder="Nombre completo"
                        />
                        {errors?.name && <p className="text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <InputForm
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="coffeelover@example.com"
                        />
                        {errors?.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">

                    <Controller
                        control={control}
                        name="type_document_id"
                        render={({ field }) => (
                            <div>
                                <Label htmlFor="documentType" className="text-sm font-medium">
                                    Tipo de Documento
                                </Label>
                                <SelectTypeDocument
                                    onValueChange={field.onChange}
                                    value={field.value}
                                />
                                {errors?.type_document_id && <p className="text-red-500">{errors.type_document_id.message}</p>}
                            </div>
                        )} />
                    
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="email">Número de documento</Label>
                        <InputForm
                            id="numero_documento"
                            type="number"
                            {...register('number_document')}
                            placeholder="Ingrese su número de documento"
                        />
                        {errors?.number_document && <p className="text-red-500">{errors.number_document.message}</p>}
                    </div>

                </div>


            </div>

        </motion.div>
    )
}

export default RegisterStoreStep1