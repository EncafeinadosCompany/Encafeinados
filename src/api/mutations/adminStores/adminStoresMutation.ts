import AuthClient from "@/api/client/axios";
import { RegisterAdminStores } from "@/api/types/adminStoresTypes";
import { LoginResponse} from "@/api/types/authTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { setAuthStorage } from "@/common/utils/authStorage";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const authClient = new AuthClient();

export const useAdminStoreMutation = () => {
    const queryClient = useQueryClient()
    const useErrors = useError("registerAdminStores")
  
    return useMutation<LoginResponse, Error, RegisterAdminStores>({
      mutationFn: async (formData: RegisterAdminStores): Promise<LoginResponse> => {
  
        try {
          const response = await authClient.post<LoginResponse>('/admin/store-admin', formData);
          console.log('AQUI', response)
          
          return response;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: (data) => {
        setAuthStorage(data.accessToken, data.user)
        queryClient.invalidateQueries({ queryKey: ['adminStore'] });
      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
  }