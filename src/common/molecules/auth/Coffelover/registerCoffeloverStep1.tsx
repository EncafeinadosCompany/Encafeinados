"use client"

import { Label } from "@/common/ui/label"
import { UseFormRegister } from "react-hook-form"
import { InputForm } from "@/common/atoms/auth/inputs-form"


interface RegisterCoffeloverStep1Props {
  register: UseFormRegister<any>
  errors: any
}


export default function RegisterCoffeloverStep1({ register, errors }: RegisterCoffeloverStep1Props) {
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
      </div>
    </div>
  )
}

