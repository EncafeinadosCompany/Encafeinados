import { z } from 'zod'

export const registerBrancheSchema = [
    z.object({
        name: z.string()
            .nonempty({ message: 'Por favor ingresa el nombre del la sucursal' })
            .min(3, { message: 'Tu sucursal  debe tener al menos 3 letras' })
            .max(30, { message: 'Wow, el nombre de la sucursal es muy grande' })
            .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "Tu sucursal no puede contener números ni caracteres especiales, solo letras y espacios" }),
        phone_number: z.string()
            .nonempty({ message: "Tu número de teléfono es clave, como la temperatura del agua en un buen café" })
            .min(7, { message: "Tu número debe tener al menos 7 dígitos, como los pasos para hacer un buen pour-over" })
            .max(15, { message: "Este número es más largo que la lista de métodos de extracción en una competencia de baristas" })
            .regex(/^\+?[1-9]\d{6,14}$/, { message: "El número de teléfono debe ser válido, con o sin prefijo internacional" }),
    }),
    z.object({
        latitude: z
            .number()
            .min(-90, { message: 'La latitud debe estar entre -90 y 90, como un café debe estar en un lugar' })
            .max(90, { message: 'La latitud debe estar entre -90 y 90, como un café debe estar en un lugar' }),
        logitude: z
            .number()
            .min(-90, { message: 'La latitud debe estar entre -90 y 90, como un café debe estar en un lugar' })
            .max(90, { message: 'La latitud debe estar entre -90 y 90, como un café debe estar en un lugar' }),
        address: z
           .string()
           .nonempty({ message: 'La dirección es importante, como la ruta para llegar a un buen café' })
           .min(3, { message: 'La dirección debe tener al menos 3 caracteres, como el nombre de una calle' })

    }),

]

export type CurrentBrancheSchema = z.infer<typeof registerBrancheSchema[number]>
