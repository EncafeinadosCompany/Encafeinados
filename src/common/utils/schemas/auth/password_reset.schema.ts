import { z } from "zod";

export const passwordResetSchema = z.object({
  email: z.string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .email({ message: "El formato del correo electrónico no es válido" }),
});

export type PasswordResetData = z.infer<typeof passwordResetSchema>;
