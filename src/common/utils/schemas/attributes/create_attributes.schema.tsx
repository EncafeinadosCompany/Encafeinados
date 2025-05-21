
import { z } from "zod";
export const RegisterAttributeSchema = z.object({
    values: z.array(z.object({
        id: z.string(),
        attributeId: z.number(),
        value: z.string()
        .transform((val) => val === "" ? undefined : val)
        .optional()
        .superRefine((val, ctx) => {
            if ((ctx.path[ctx.path.length - 1] as any).requires_response && !val) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Este campo es requerido"
                });
            }
            if (val) {
                if (val.length < 2) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "La descripción debe tener al menos 3 caracteres"
                    });
                }
                if (val.length > 100) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "La descripción no puede exceder los 100 caracteres"
                    });
                }
            }
        })
        
           
    }))
})

export type AttributeFormType = z.infer<typeof RegisterAttributeSchema>