import { DefaultValue } from 'recoil'
import { z } from 'zod'
import { loginSchema } from './loginShema'
import { personalDataSchema } from './personalDataSchema'

const registerCoffeeloverSchema = z.object({
    userData: z.object({
        email: z.string()
            .min(1, { message: "El correo electrónico es obligatorio" })
            .nonempty({ message: "El correo electrónico es obligatorio" })
            .email({ message: "El formato del correo electrónico no es válido" }),
        password: z.string()
            .min(4, { message: "La contraseña debe tener al menos 4 caracteres" })
            .max(10, {message:"La contraseña es muy larga"})
            .regex(/[0-9]/, { message: "Debe contener al menos un número" }),
        confirmPassword: z.string()
            .min(4, { message: "La confirmación debe tener al menos 4 caracteres" })
            .max(10, {message:"La contraseña es muy larga"})
            .regex(/[0-9]/, { message: "Debe contener al menos un número" }),
        role_id: z.number().default(3)
    }),
    personData: personalDataSchema,

})

export default registerCoffeeloverSchema