import AuthClient from "@/api/client/axios";
import { LoginResponse } from "@/api/types/authTypes";
import { BranchPost } from "@/api/types/branchesTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const authClient = new AuthClient();

export const useRegisterBrandMutation = () => {
    const useErrors = useError("stores")
    const queryClient = useQueryClient()
  
    return useMutation<any, Error, BranchPost>({
      mutationFn: async (formData: BranchPost): Promise<LoginResponse> => {
        try {
          const response = await authClient.post<any>('/branches', formData);
          console.log('AQUI', response)
          return response;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: (data) => {
  
        queryClient.invalidateQueries({ queryKey: ['branches'] });
      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
}


