
import { z } from 'zod'

export const personalDataSchema = z.object({
    name: z.string().min(1),
    lastname: z.string().min(1),
    type_document_id: z.string()
    .transform((val) => Number(val)),
    number_document: z.string()
         
        .min(6, { message: 'El número de documento debe tener al menos 6 caracteres' }),
    phone_number: z.string()
        .nonempty({ message: "El número de teléfono es obligatorio" })
        .min(7, { message: "El número de teléfono debe tener al menos 7 dígitos" })
        .max(15, { message: "El número de teléfono no debe superar los 15 dígitos" })
        .regex(/^\+?\d+$/, { message: "El número de teléfono solo puede contener números y opcionalmente un +" })
})
