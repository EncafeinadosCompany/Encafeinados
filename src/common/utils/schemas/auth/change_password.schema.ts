import { z } from "zod";

export const changePasswordSchema = z.object({
  newPassword: z.string()
    .length(4, { message: "La contraseña debe tener exactamente 4 dígitos" })
    .regex(/^\d{4}$/, { message: "La contraseña solo debe contener números" }),
  confirmPassword: z.string()
    .length(4, { message: "La contraseña debe tener exactamente 4 dígitos" })
    .regex(/^\d{4}$/, { message: "La contraseña solo debe contener números" })
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"]
});

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
