import { z } from "zod";
export const EditBranchesSchemas = 
    z.object({
        name: z.string()
            .nonempty({ message: 'Queremos conocerte, ¿cúal es el nombre de la sucursal?' })
            .min(3, { message: 'El nombre de la sucursal debe tener al menos 3 letras' })
            .regex(/^[a-záéíóúüñ\s,\-]*$/i, { message: 'El nombre solo puede contener letras, espacios, comas, guiones y tildes' }),
        phone_number: z.string()
            .nonempty({ message: "El número de teléfono es clave" })
            .min(7, { message: "Tu número debe tener al menos 7 dígitos, como los pasos para hacer un buen pour-over" })
            .max(15, { message: "Este número es demasiado largo" })
            .regex(/^\+?[1-9]\d{6,14}$/, { message: "El número de teléfono debe ser válido, con o sin prefijo internacional" }),
           
        latitude: z.number(),
        longitude: z.number(),
        address: z.string().min(1, "Requerido"),
        // addressDetails: z
        //     .string()
        //     .nullable(),
        // nearbyReference: z.string().nullable(),
        // additionalNotes: z.string().nullable(),
        // social_networks: z
        //     .array(
        //         z.object({
        //             social_network_id: z.number(),
        //             value: z.string().nonempty({ message: 'El enlace es importante, como la ruta para llegar a un buen café' }),
        //             description: z.string().nonempty({ message: 'La descripción es importante, como la ruta para llegar a un buen café' })
        //                 .min(3, { message: 'La descripción debe tener al menos 3 caracteres' }),
        //         })
        //     )
        //     .optional()
    })



    export type EditBrancheType = z.infer<typeof EditBranchesSchemas>;
