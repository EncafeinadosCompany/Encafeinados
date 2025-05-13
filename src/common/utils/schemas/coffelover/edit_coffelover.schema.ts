import { z } from 'zod'

export const EditCoffeeloverSchema =
    z.object({
        name: z.string()
            .nonempty({ message: 'Queremos conocerte, ¿cómo te llamas?' })
            .min(3, { message: 'Tu nombre debe tener al menos 3 letras, como un buen café debe tener su esencia' })
            .max(30, { message: 'Wow, tu nombre es más largo que una charla con un barista sobre granos de especialidad' })
            .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "Tu nombre no puede contener números ni caracteres especiales, solo letras y espacios" }),
        lastname: z.string()
            .nonempty({ message: '¿Y tu apellido?' }),
        email: z.string()
            .min(1, { message: "El correo electrónico es obligatorio" })
            .nonempty({ message: "El correo electrónico es obligatorio" })
            .email({ message: "El formato del correo electrónico no es válido" }),
        type_document: z
            .string({ message: 'Por favor ingresa tu tipo de documento' })
            .nonempty({ message: "El tipo de documento es esencial, como el café en la mañana" }),
        phone_number: z.string()
            .nonempty({ message: "Tu número de teléfono es clave, como la temperatura del agua en un buen café" })
            .min(7, { message: "Tu número debe tener al menos 7 dígitos, como los pasos para hacer un buen pour-over" })
            .max(15, { message: "Este número es más largo que la lista de métodos de extracción en una competencia de baristas" })
            .regex(/^\+?[1-9]\d{6,14}$/, { message: "El número de teléfono debe ser válido, con o sin prefijo internacional" }),
        password: z.string()
            .length(4, { message: "La contraseña debe tener exactamente 4 dígitos" })
            .regex(/^\d{4}$/, { message: "La contraseña solo debe contener números" }),
        confirmPassword: z.string()
            .length(4, { message: "La confirmación de la contraseña debe tener exactamente 4 dígitos" })
            .regex(/^\d{4}$/, { message: "La confirmación de la contraseña solo debe contener números" }),

    }).refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"], // Muestra el error en este campo
    })


export type EditCurrentCoffeeLoverSchema = z.infer<typeof EditCoffeeloverSchema>
