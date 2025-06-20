
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
                    if (val.length > 50) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: "La descripción no puede exceder los 100 caracteres"
                        });
                    }
                }

                if (val) {
                    if (val.includes("-")) {
                        const [minStr, maxStr] = val.split("-").map(str => Number(str.replace(/\D/g, "")));

                        if (!isNaN(minStr) && !isNaN(maxStr) && minStr > maxStr) {
                            ctx.addIssue({
                                code: z.ZodIssueCode.custom,
                                message: "El precio mínimo no puede ser mayor que el precio máximo"
                            });
                        }
                    } else {
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
                }
            })


    }))
})

export type AttributeFormType = z.infer<typeof RegisterAttributeSchema>