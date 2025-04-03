import { z } from 'zod'
import { personalDataSchema } from './personalDataSchema'

const registerCoffeeloverSchema = z.object({
    userData: z.object({
        email: z.string()
            .min(1, { message: "El correo electrónico es obligatorio" })
            .nonempty({ message: "El correo electrónico es obligatorio" })
            .email({ message: "El formato del correo electrónico no es válido" }),
        password: z.string()
            .length(4, { message: "La contraseña debe tener exactamente 4 dígitos" })
            .regex(/^\d{4}$/, { message: "La contraseña solo debe contener números" }),
        confirmPassword: z.string()
            .length(4, { message: "La confirmación de la contraseña debe tener exactamente 4 dígitos" })
            .regex(/^\d{4}$/, { message: "La confirmación de la contraseña solo debe contener números" }),
        role_id: z.number().default(3)
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"], // Muestra el error en este campo
    }),
    personData: personalDataSchema,

})

export default registerCoffeeloverSchema