import { z } from "zod";

export const RegisterEventSchema = z
  .object({
    name: z.string().min(1, {
      message: "El nombre es obligatorio",
    }),
    description: z.string().min(10, {
      message: "La descripción debe tener al menos 10 caracteres",
    }),
    start_date: z.date({
      required_error: "La fecha de inicio es obligatoria",
    }),
    end_date: z.date({
      required_error: "La fecha de fin es obligatoria",
    }),
    location: z.string().min(1, {
      message: "La ubicación es obligatoria",
    }),
    is_free: z.boolean().default(false),
    branch_ids: z
      .array(z.string())
      .nonempty({ message: "Debe seleccionar al menos una sucursal" }),
    organizer: z
      .string()
      .min(3, {
        message: "El organizador es obligatorio",
      })
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, {
        message: "El organizador solo debe contener letras",
      }),
    start_time: z.string().optional(),

    end_time: z.string().optional(),
  })
  .refine((data) => data.end_date >= data.start_date, {
    message: "La fecha de fin debe ser posterior a la fecha de inicio",
    path: ["end_date"],
  });

export type RegisterEventSchemaType = z.infer<typeof RegisterEventSchema>; // exportar el tip
