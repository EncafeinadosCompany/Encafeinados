"use client"

import { Label } from "@/common/ui/label"
import { UseFormRegister } from "react-hook-form"
import { InputForm } from "@/common/atoms/auth/inputForm"
import { ButtonGoogle } from "@/common/atoms/buttonGoogle"


interface RegisterCoffeloverStep1Props {
  register: UseFormRegister<any>
  errors: any
  onGoogleSignIn: () => void
  isLoading: boolean
}


export default function RegisterCoffeloverStep1({ register, errors, onGoogleSignIn, isLoading }: RegisterCoffeloverStep1Props) {
  return (
    <div>
      <div className="space-y-4 m-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nombre</Label>
            <InputForm
              {...register("personData.name")}
              id="firstName" placeholder="Nombre completo"
            />
            {errors?.personData?.name && <p className="text-red-500">{errors.personData.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Apellidos</Label>
            <InputForm id="lastName"
              {...register('personData.lastname')}
              placeholder="Ingresa tus apellidos" />
            {errors?.personData?.lastname && <p className="text-red-500">{errors.personData.lastname.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <InputForm
            id="email"
            type="email"
            {...register('userData.email')}
            placeholder="coffeelover@example.com"
          />
          {errors?.userData?.email && <p className="text-red-500">{errors.userData.email.message}</p>}
        </div>

        {/* <div className="mt-8 space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-900"></div>
            </div>
            <div className="relative px-4 text-sm  bg-[#ffe4c4] text-gray-500 font-medium">
              Opciones de registro
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <ButtonGoogle
              variant="outline"
              onClick={onGoogleSignIn}
              disabled={isLoading}
            >
              <span className="flex items-center">
                Continuar con Google
              </span>
            </ButtonGoogle>
          </div>
          
          <div className="text-center text-xs text-gray-500 mt-10">
            Al registrarte, aceptas nuestros <a href="#" className="text-amber-700 hover:underline">Términos de servicio</a> y <a href="#" className="text-amber-700 hover:underline">Política de privacidad</a>
          </div>
        </div> */}
      </div>

    </div>
  )
}

