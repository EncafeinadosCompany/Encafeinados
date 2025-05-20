
import { z } from "zod";
export const RegisterAttributeSchema = z.object({
    values: z.array(z.object({
        id: z.string(),
        attributeId: z.number(),
        value: z.string()
            .min(2, "La descripción debe tener al menos 3 caracteres")
            .max(100, "La descripción no puede exceder los 100 caracteres")
           .optional()
    }))
})

export type AttributeFormType = z.infer<typeof RegisterAttributeSchema>