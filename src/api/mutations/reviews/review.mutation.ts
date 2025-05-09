import { useMutation, useQueryClient } from "@tanstack/react-query";
import AuthClient from "@/api/client/axios";
import { ReviewSubmitInput, ReviewSubmitResponse } from "@/api/types/reviews/review.type";
import { useError } from "@/common/hooks/auth/useErrors";
import toast from "react-hot-toast";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";

const authClient = new AuthClient();

export const useSubmitReviewMutation = () => {
  const useErrors = useError("reviews");
  const queryClient = useQueryClient();

  return useMutation<ReviewSubmitResponse, Error, ReviewSubmitInput>({
    mutationFn: async (reviewData: ReviewSubmitInput) => {
      try {
        const response = await authClient.post<ReviewSubmitResponse>('/reviews', reviewData);
        return response;
      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: () => {
      toast.success("Tu reseña ha sido enviada con éxito");
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    onError: (error: any) => {
      toast.error("No se pudo enviar la reseña");
      useErrors(error);
    }
  });
};