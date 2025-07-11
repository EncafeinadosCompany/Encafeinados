import { z } from "zod";


export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .email({ message: "El formato del correo electrónico no es válido" }),

  password: z.string()
  .length(4, { message: "La contraseña debe tener exactamente 4 dígitos" })
  .regex(/^\d{4}$/, { message: "La contraseña solo debe contener números" })
});