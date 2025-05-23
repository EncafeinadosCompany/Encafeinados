
import AuthClient from "@/api/client/axios";
import { RecommendationType } from "@/api/types/recommendation/recommendation.type";
import { useError } from "@/common/hooks/auth/useErrors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const authClient = new AuthClient();

export function useCreateRecommendationMutation() {

    const queryClient = useQueryClient();
     const useErrors = useError("createPage");

    return useMutation<any, Error,RecommendationType>({
      mutationFn: async (data) => {
        const response = await authClient.post<RecommendationType>('/recommendations', data);
        return response;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['recommendation'] });
        toast.success("Recomendación creada correctamente");
      },
      onError: (error) => {
        toast.remove();
        toast.error("Error al crear la recomendación");
        useErrors(error);
      } 
    });
  }; 