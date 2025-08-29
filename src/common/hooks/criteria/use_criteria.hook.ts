import { criteriaResponseData } from "@/api/types/criteria/criteria.types";

export const validateImageRequirements = (
  criteriaData: criteriaResponseData[],
  formCriteria: Record<string, any>
): string | null => {
  // Debug: Para ver los datos que llegan
  console.log("🔍 validateImageRequirements llamada con:", {
    criteriaData: criteriaData?.length,
    formCriteria: Object.keys(formCriteria).length,
    criteriaDataFull: criteriaData,
    formCriteriaFull: formCriteria,
  });

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

    console.log(`🔍 Validando criterio ${key}:`, {
      criterion: criterion?.name,
      requires_image: criterion?.requires_image,
      response_text: response?.response_text,
      image_url: response?.image_url,
      hasImage: !!response?.image_url,
    });

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
