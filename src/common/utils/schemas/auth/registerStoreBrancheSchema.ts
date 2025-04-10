import { z } from "zod";

export const RegisterStoreBrancheSchema = [
  z.object({
    name: z.string()
      .nonempty({ message: 'Queremos conocerte, ¿cúal es el nombre de la sucursal?' })
      .min(3, { message: 'El nombre de la sucursal debe tener al menos 3 letras' }),
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
        image_url: z.string().url().optional(),
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
        url: z.string().url(),
        description: z.string().optional(),
      })
    )
    .optional(),
  })
];

export type RegisterStoreBrancheSchemaType = z.infer<(typeof RegisterStoreBrancheSchema)[number]>;
