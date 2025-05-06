import { criteriaResponseData } from "@/api/types/criteriaTypes";


export const validateImageRequirements = ( criteriaData: criteriaResponseData[], formCriteria: Record<string, any>): string | null => 
  {
  for (const key in formCriteria) {
    const criterion = criteriaData.find(c => c.id === Number(key));
    const response = formCriteria[key];

    if (criterion?.requires_image && response.response_text !== "no" && !response.image_url) {
      return `El criterio "${criterion.name}" requiere una imagen, pero no se subió.`;
    }
  }
  return null;
};
