import { z } from "zod";

export const recommendationSchema = z.object({

    message: z.string()
        .min(5, "La recomendación debe tener al menos 5 caracteres")
        .max(150, "La recomendación no puede exceder los 150 caracteres")
});

export type RecommendationSchemaType = z.infer<typeof recommendationSchema>;