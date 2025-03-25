import { z } from "zod";


export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .email({ message: "El formato del correo electrónico no es válido" }),

  password: z.string()
  .min(4, { message: "La confirmación debe tener al menos 4 caracteres" })
  .max(10, {message:"La contraseña es muy larga"})
  .regex(/[0-9]/, { message: "La contraseña es muy larga" }),
  // .regex(/[A-Z]/, { message: "Debe contener al menos una letra mayúscula" })
  // .regex(/[\W_]/, { message: "Debe contener al menos un carácter especial" }),
});