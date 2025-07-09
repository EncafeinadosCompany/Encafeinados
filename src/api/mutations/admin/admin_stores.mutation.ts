import AuthClient from "@/api/client/axios";
import { useError } from "@/common/hooks/auth/use_errors.hook";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoginMutation } from "../auth/authMutations";
import { RegisterAdminData } from "@/api/types/admin_stores/admin_stores.type";


const authClient = new AuthClient();

export const useRegisterAdminMutation = () => {
    const queryClient = useQueryClient()
    const useLonginMutation = useLoginMutation()
    const useErrors = useError("registerAdminStores")
  
    return useMutation<any, Error, RegisterAdminData>({
      mutationFn: async (formData: RegisterAdminData): Promise<any> => {
  
        try {
          const response = await authClient.post<any>('/admin', formData); 
          return response.data;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: (_data, variable) => {
        queryClient.invalidateQueries({ queryKey: ['admin'] });

  
          useLonginMutation.mutate({
            email: variable.userData.email,
            password: variable.userData.password
          })
        

      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
  }

export const useCreateBranchAdminMutation = () => {
  const queryClient = useQueryClient()
  const useErrors = useError("createBranchAdmin")

  return useMutation<any, Error, RegisterAdminData>({
    mutationFn: async (formData: RegisterAdminData): Promise<any> => {
      try {
        const response = await authClient.post<any>('/admin', formData); 
        return response.data;
  
      } catch (error: any) {
        throw handleApiError(error)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['branches'] });
      queryClient.invalidateQueries({ queryKey: ['branchByStore'] });
    },
    onError: (error: any) => {
      useErrors(error);
    }
  })
}
