"use client"

import { Label } from "@/common/ui/label"
import { UseFormRegister } from "react-hook-form"
import { InputForm } from "@/common/atoms/forms/input_form.atom"
import { motion } from "framer-motion"
import { pageVariants } from "@/common/atoms/forms/page_variants.atom"

import { TextError } from "@/common/atoms/forms/text_error.atom"
import { useRegisterFocus } from "@/common/hooks/auth/use_register_focus.hook"

interface RegisterCoffeloverStep1Props {
  register: UseFormRegister<any>
  errors: any
  direction: number
}


export default function RegisterCoffeloverStep1({ register, errors, direction }: RegisterCoffeloverStep1Props) {
  const { focusedField, registerWithFocus } = useRegisterFocus()

  return (
    <motion.div
      key="step1"
      custom={direction}
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="w-full"
      style={{ perspective: "1000px" }}
    >
      <div className="space-y-4 m-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className={`flex items-center text-xs transition-colors ${focusedField === "name" ? "text-[#DB8935] " : "text-gray-600" }`}>Nombre</Label>
            <InputForm
              {...register("name")}
              {...registerWithFocus("name")}
              id="name" 
              placeholder="Nombre completo"
            />
            {errors?.name && <TextError>{errors.name.message}</TextError>}
          </div>

          <div className="space-y-2">
          <Label htmlFor="lastName" className={`flex items-center text-xs transition-colors ${focusedField === "lastname" ? "text-[#DB8935] " : "text-gray-600" }`}>Apellidos</Label>
            <InputForm id="lastName"
              {...register('lastname')}
              {...registerWithFocus('lastname')}
              placeholder="Ingresa tus apellidos" />
            {errors?.lastname && <TextError>{errors.lastname.message}</TextError>}
          </div>
        </div>

        <div className="space-y-2">
        <Label htmlFor="email" className={`flex items-center text-xs transition-colors ${focusedField === "email" ? "text-[#DB8935] " : "text-gray-600" }`}>Correo Electrónico</Label>
          <InputForm
            id="email"
            type="email"
            {...register('email')}
            {...registerWithFocus('email')}
            placeholder="coffeelover@example.com"
          />
          {errors?.email && <TextError>{errors.email.message}</TextError>}
        </div>
      </div>
    </motion.div>
  )
}

