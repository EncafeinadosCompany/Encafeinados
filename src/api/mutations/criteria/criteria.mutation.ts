import AuthClient from "@/api/client/axios";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { criteria } from "@/api/types/criteriaTypes";
import { uploadImage } from "../image/image.mutations";

const authClient = new AuthClient();



export const useRegisterCriteriaMutation = () => {
  const useErrors = useError("criteria")
  const queryClient = useQueryClient()

  return useMutation<any, Error, criteria>({
    mutationFn: async (formData: criteria): Promise<any> => {

      const rawCriteria = formData.criteriaResponseData;
      const criteriaResponseData = Object.entries(rawCriteria).map(([key, value]) => ({

        criteriaId: parseInt(key),

        response_text: (value as { response_text: string }).response_text === 'other'
          ? (value as { other_text?: string }).other_text
          : (value as { response_text?: string }).response_text,

        image_url: (value as { image_url?: { file: File } }).image_url?.file,
      }));

      try {
        const updatedCriteriaResponseData = await Promise.all(
          criteriaResponseData.map(async (item) => {
            if (item.image_url instanceof File) {
              const imageUrl = await uploadImage(item.image_url);
              return { ...item, image_url: imageUrl };
            }
            return item;
          })
        );

        const finalPayload = {
          ...formData,
          criteriaResponseData: updatedCriteriaResponseData,
        };

        const response = await authClient.post<any>("/branch-approvals", finalPayload);
        return response;
      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['criteria'] });
    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  })
}


