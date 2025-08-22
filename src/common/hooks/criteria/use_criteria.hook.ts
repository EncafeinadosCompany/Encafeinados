import { criteriaResponseData } from "@/api/types/criteria/criteria.types";

export const validateImageRequirements = (
  criteriaData: criteriaResponseData[],
  formCriteria: Record<string, any>
): string | null => {
   

  if (
    !criteriaData ||
    !Array.isArray(criteriaData) ||
    criteriaData.length === 0
  ) {
    console.log("❌ No hay criteriaData válida");
    return null;
  }

  if (
    !formCriteria ||
    typeof formCriteria !== "object" ||
    Object.keys(formCriteria).length === 0
  ) {
    console.log("❌ No hay formCriteria válido");
    return null;
  }

  for (const key in formCriteria) {
    const criterion = criteriaData.find((c) => c.id === Number(key));
    const response = formCriteria[key];


    if (
      criterion?.requires_image &&
      response?.response_text !== "no" &&
      !response?.image_url
    ) {
      const errorMessage = `El criterio "${criterion.name}" requiere una imagen, pero no se ha subido.`;
      console.log("❌ Error encontrado:", errorMessage);
      return errorMessage;
    }
  }

  console.log("✅ Validación de imágenes pasada");
  return null;
};
