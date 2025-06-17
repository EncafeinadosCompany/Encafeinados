import { z } from "zod";
import { CreateBranchAdminData } from "@/api/types/admin_stores/admin_stores.type";

export const BranchAdminSchema = z.object({
  // Información de cuenta
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
  
  // Datos de la sucursal (se incluirán en la solicitud)
  branch_id: z
    .number()
    .int()
    .positive({ message: "ID de sucursal inválido" })
});

export type BranchAdminFormData = z.infer<typeof BranchAdminSchema>;

// Función para transformar los datos del formulario al formato requerido por la API
export const transformToBranchAdminPayload = (formData: BranchAdminFormData): CreateBranchAdminData => {
  return {
    userData: {
      email: formData.email,
      password: formData.password,
      roles: ["ADMIN_BRANCH"]
    },
    personData: {
      type_document: formData.type_document,
      number_document: formData.number_document,
      full_name: formData.full_name,
      phone_number: formData.phone_number
    },
    dataEntity: {
      branchId: formData.branch_id
    }
  };
};
