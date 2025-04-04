import AuthClient from "@/api/client/axios";
import { LoginResponse } from "@/api/types/authTypes";
import { RegisterStoreSchemaType } from "@/api/types/storeTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { setAuthStorage } from "@/common/utils/authStorage";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const authClient = new AuthClient();

export const useRegisterStoreMutation = () => {
    const useErrors = useError("registeCoffelover")
    const queryClient = useQueryClient()
  
    return useMutation<LoginResponse, Error, RegisterStoreSchemaType>({
      mutationFn: async (formData: RegisterStoreSchemaType): Promise<LoginResponse> => {
        try {
          const response = await authClient.post<LoginResponse>('/stores', formData);
          console.log('AQUI', response)
          return response;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: (data) => {
  
        setAuthStorage(data.accessToken, data.user)
  
        queryClient.invalidateQueries({ queryKey: ['stores'] });
      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
}


