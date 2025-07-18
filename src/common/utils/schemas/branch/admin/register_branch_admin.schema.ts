import { z } from "zod";

export const BranchAdminSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo electrónico es obligatorio" })
    .nonempty({ message: "El correo electrónico es obligatorio" })
    .email({ message: "El formato del correo electrónico no es válido" }),
  password: z
    .string()
    .length(4, { message: "El PIN debe tener exactamente 4 dígitos" })
    .regex(/^\d{4}$/, { message: "El PIN solo debe contener números" }),
  
  full_name: z
    .string()
    .nonempty({ message: "El nombre completo es obligatorio" })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(50, { message: "El nombre es demasiado largo" })
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { 
      message: "El nombre no puede contener números ni caracteres especiales" 
    }),
  type_document: z
    .string()
    .nonempty({ message: "El tipo de documento es obligatorio" }),
  
  number_document: z
    .string()
    .nonempty({ message: "El número de documento es obligatorio" })
    .min(6, { message: "El número de documento debe tener al menos 6 caracteres" })
    .max(15, { message: "El número de documento es demasiado largo" })
    .regex(/^[\d-]+$/, { message: "Solo se permiten números y guiones" }),
  
  phone_number: z
    .string()
    .nonempty({ message: "El número de teléfono es obligatorio" })
    .min(10, { message: "El número de teléfono debe tener al menos 10 dígitos" })
    .max(15, { message: "El número de teléfono es demasiado largo" })
    .regex(/^\d+$/, { message: "El número de teléfono solo debe contener dígitos" }),
  
  branch_id: z
    .number()
    .int()
    .positive({ message: "ID de sucursal inválido" })
});

export type BranchAdminFormData = z.infer<typeof BranchAdminSchema>;

export const transformToBranchAdminPayload = (formData: BranchAdminFormData) => {
  return {
    branchData: {
      id: formData.branch_id
    },
    userData: {
      email: formData.email,
      password: formData.password
    },
    personData: {
      type_document: formData.type_document,
      number_document: formData.number_document,
      full_name: formData.full_name,
      phone_number: formData.phone_number
    }
  };
};