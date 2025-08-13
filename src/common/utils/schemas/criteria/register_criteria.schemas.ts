import {z} from "zod";

export const RegisterCriteriaSchema = 
    z.object({
    criteria: z.record(
      z.object({
        response_text: z.string().min(1, "Requerido"),
        image_url: z.union([
          z.object({
            file: z.instanceof(File),
            preview: z.string().url(),
          }),
          z.string().url(), 
          z.null(),
        ]).optional(),
        other_text: z.string().optional(),
      })
    )
  })

export type RegisterCriteriaSchemaType = z.infer<typeof RegisterCriteriaSchema>;