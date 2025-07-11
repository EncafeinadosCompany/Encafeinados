import { z } from "zod";

export const RegisterStoreBrancheSchema = [
  z.object({
    name: z.string()
      .nonempty({ message: 'Queremos conocerte, ¿cúal es el nombre de la sucursal?' })
      .min(3, { message: 'El nombre de la sucursal debe tener al menos 3 letras' })
      .max(30, { message: 'El nombre de la sucursal no puede ser más largo que 30 caracteres' })
      .regex(/^(?=.*[a-zA-ZáéíóúÁÉÍÓÚñÑ])[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/, { message: "El nombre debe contener letras y solo puede tener letras, números y espacios" }),

    phone_number: z.string()
      .nonempty({ message: "El número de teléfono es clave" })
      .min(7, { message: "Tu número debe tener al menos 7 dígitos, como los pasos para hacer un buen pour-over" })
      .max(15, { message: "Este número es demasiado largo" })
      .regex(/^\+?[1-9]\d{6,14}$/, { message: "El número de teléfono debe ser válido, con o sin prefijo internacional" })
  }),
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
          z.literal(undefined),
          z.null(),
        ]).optional(),
        other_text: z.string().optional(),
      })
    )
  }),
  z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string().min(1, "Requerido")
  }),
  z.object({
    addressDetails: z
      .string()
      .nonempty({ message: 'La dirección es importante, como la ruta para llegar a un buen café' })
      .min(3, { message: 'La dirección debe tener al menos 3 caracteres, como el nombre de una calle' }),
    nearbyReference: z.string().nullable(),
    additionalNotes: z.string().nullable(),
  }),
  z.object({
    social_networks: z
    .array(
      z.object({
        social_network_id: z.number(),
        value: z.string().nonempty({ message: 'El enlace es importante, como la ruta para llegar a un buen café' }),
        description: z.string().nonempty({ message: 'La descripción es importante, como la ruta para llegar a un buen café' })
        .min(3, { message: 'La descripción debe tener al menos 3 caracteres'}),
      })
    )
    .optional(),
  })
];

export type RegisterStoreBrancheSchemaType = z.infer<(typeof RegisterStoreBrancheSchema)[number]>;
