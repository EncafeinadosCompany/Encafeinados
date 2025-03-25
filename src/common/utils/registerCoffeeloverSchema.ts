import { DefaultValue } from 'recoil'
import { z } from 'zod'
import { loginSchema } from './schemas/loginShema'
import { personalDataSchema } from './schemas/personalDataSchema.'

const registerCoffeeloverSchema = z.object({
    userData: z.object({
        email: z.string()
            .min(1, { message: "El correo electrónico es obligatorio" })
            .nonempty({ message: "El correo electrónico es obligatorio" })
            .email({ message: "El formato del correo electrónico no es válido" }),
        password: z.string()
            .min(4, { message: "La contraseña debe tener al menos 4 caracteres" })
            .max(100),
        confirmPassword: z.string()
            .min(6, { message: "La confirmación debe tener al menos 6 caracteres" })
            .max(100, { message: "La confirmación es demasiado larga" }),
        role_id: z.number().default(3)
    }),
    personData: personalDataSchema,

})

export default registerCoffeeloverSchema