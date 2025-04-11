import AuthClient from "@/api/client/axios";
import { RegisterAdminStores } from "@/api/types/adminStoresTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const authClient = new AuthClient();

export const useAdminStoreMutation = () => {
    const queryClient = useQueryClient()
    const useErrors = useError("registerAdminStores")
  
    return useMutation<any, Error, RegisterAdminStores>({
      mutationFn: async (formData: RegisterAdminStores): Promise<any> => {
  
        try {
          const response = await authClient.post<any>('/admin/store-admin', formData); 
          return response.data;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['adminStore'] });
      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
  }