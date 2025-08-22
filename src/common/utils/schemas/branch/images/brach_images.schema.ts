
import {z} from "zod"
export const BranchImagesSchema = z.object({
    image_type: z.enum(['LOGO', 'PORTADA', 'GALERÍA', 'PERFIL', 'MENÚ', 'PROMOCIONES'], {
        required_error: "Por favor selecciona un tipo de imagen",
    }),
    image_file: z.any()
        .refine((file) => file instanceof File, "La imagen es requerida")
        .refine((file) => file?.size <= 5 * 1024 * 1024, "La imagen no debe superar 5MB")
});