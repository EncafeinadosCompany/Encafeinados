
import { z } from "zod";
export const RegisterAttributeSchema = z.object({
    values: z.array(z.object({
        id: z.string(),
        attributeId: z.number(),
        type: z.string(),
        value: z.string()
            .min(3, "La descripción debe tener al menos 3 caracteres")
            .max(300, "La descripción no puede exceder los 300 caracteres")
            .nonempty("Este campo es obligatorio")
    }))
})

export type AttributeFormType = z.infer<typeof RegisterAttributeSchema>