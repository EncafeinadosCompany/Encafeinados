"use client"

import { useEffect, useState } from "react"
import { Link, Links } from "react-router-dom"
import { ArrowLeft, ArrowRight, Check, RedoIcon } from "lucide-react"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { Label } from "@/common/ui/label"
import ProgressIndicator from "@/common/atoms/auth/ProgressIndicator"
import { InputPassword } from "@/common/atoms/input-passwork"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { HelpCircle, X } from "lucide-react"
import { UseFormRegister } from "react-hook-form"
import registerCoffeeloverSchema from "@/common/utils/registerCoffeeloverSchema"
import { RegisterCoffelover } from "@/api"
// import { Textarea } from "@/common/ui/textarea"
// import { Checkbox } from "@/common/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface RegisterCoffeloverStep1Props {
  register: UseFormRegister<any>
  errors: any
}



export default function RegisterCoffeloverStep1({register,errors}: RegisterCoffeloverStep1Props) {
  // const [step, setStep] = useState(1)
  // const [password, setPassword] = useState("")
  // const [confirmPassword, setConfirmPassword] = useState("")
  // const [documentType, setDocumentType] = useState("")
  // const [showInfo, setShowInfo] = useState(false)

  return (
    <div>    
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input {...register("personData.name")} id="firstName"  placeholder="Nombre completo" className=" text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500  border-gray-300 rounded-lg" />
                  {errors?.personData?.name && <p className="text-red-500">{errors.personData.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input id="lastName" {...register('personData.lastname')} placeholder="Ingresa tus apellidos" className="text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500  border-gray-300 rounded-lg" />
                  {errors?.personData?.lastname && <p className="text-red-500">{errors.personData.lastname.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" {...register('userData.email')} placeholder="coffeelover@example.com" className="text-gray-500 bg-white/60 shadow-sm focus:shadow-md border focus:border-amber-500  border-gray-300 rounded-lg" />
                {errors?.userData?.email && <p className="text-red-500">{errors.userData.email.message}</p>}
              </div>
            </div>
        </div>
  )
}

