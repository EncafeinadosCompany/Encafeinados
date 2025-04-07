"use client"

import { Label } from "@/common/ui/label"
import { UseFormRegister } from "react-hook-form"
import { InputForm } from "@/common/atoms/auth/inputForm"
import { ButtonGoogle } from "@/common/atoms/buttonGoogle"
import { motion } from "framer-motion"
import { pageVariants } from "@/common/atoms/auth/pageVariants"

interface RegisterCoffeloverStep1Props {
  register: UseFormRegister<any>
  errors: any
  onGoogleSignIn: () => void
  direction: number
  isLoading: boolean
}


export default function RegisterCoffeloverStep1({ register, errors, onGoogleSignIn, isLoading , direction}: RegisterCoffeloverStep1Props) {
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
      <div className="space-y-4 m-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <InputForm
              {...register("name")}
              id="firstName" placeholder="Nombre completo"
            />
            {errors?.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <InputForm id="lastName"
              {...register('lastname')}
              placeholder="Ingresa tus apellidos" />
            {errors?.lastname && <p className="text-red-500">{errors.lastname.message}</p>}
          </div>
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

      
      </div>

    </motion.div>
  )
}

