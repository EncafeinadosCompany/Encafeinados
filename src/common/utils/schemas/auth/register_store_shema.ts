import { z } from "zod"

export const RegisterStoreSchema = [
    z.object({
        name: z.string()
            .nonempty({ message: 'Queremos conocerte, ¿cómo te llamas?' })
            .min(3, { message: 'Tu nombre debe tener al menos 3 letras, como un buen café debe tener su esencia' })
            .max(30, { message: 'Wow, tu nombre es más largo que una charla con un barista sobre granos de especialidad' })
            .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: "Tu nombre no puede contener números ni caracteres especiales, solo letras y espacios" }),
      
        type_document:z
            .string({message:'Por favor ingresa tu tipo de documento'})
            .nonempty({ message: "El tipo de documento es esencial, como el café en la mañana" }),
        number_document: z.string()
            .nonempty({ message: 'Necesitamos tu número de documento' })
            .min(6, { message: 'Tu número de documento debe tener al menos 6 caracteres, como los ingredientes básicos de una buena receta' })
            .max(11, { message: 'Parece que tu número de documento es tan largo como la cola en una cafetería popular' }),
        phone_number: z.string()
            .nonempty({ message: "Tu número de teléfono es clave, como la temperatura del agua en un buen café" })
            .min(7, { message: "Tu número debe tener al menos 7 dígitos, como los pasos para hacer un buen pour-over" })
            .max(15, { message: "Este número es más largo que la lista de métodos de extracción en una competencia de baristas" })
            .regex(/^\+?[1-9]\d{6,14}$/, { message: "El número de teléfono debe ser válido, con o sin prefijo internacional" }),
        email: z.string()
            .min(1, { message: "El correo electrónico es obligatorio" })
            .email({ message: "El formato del correo electrónico no es válido" })
    }),
    z.object({
        logo: z
        .any()
        .optional()
        .refine((file) => {
          if (!file) return true; 
          return file instanceof File;
        }, {
          message: "Debes subir un archivo válido",
        }),
        conditions: z.literal(true, {
            errorMap: () => ({ message: "Debes aceptar los términos y condiciones" }),
          })
    })
]

export type CurrentSchema = z.infer<(typeof RegisterStoreSchema)[number]>;