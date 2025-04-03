import AuthClient from "@/api/client/axios";
import { LoginResponse, RegisterCoffelover } from "@/api/types/authTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { setAuthStorage } from "@/common/utils/authStorage";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const authClient = new AuthClient();

export const useRegisterCoffeloverMutation = () => {
    const queryClient = useQueryClient()
    const useErrors = useError("registeCoffelover")
  
    return useMutation<LoginResponse, Error, RegisterCoffelover>({
      mutationFn: async (formData: RegisterCoffelover): Promise<LoginResponse> => {
  
        try {
          const response = await authClient.post<LoginResponse>('/auth/register-client', formData);
          console.log('AQUI', response)
          
          return response;
    
        } catch (error: any) {
          throw handleApiError(error)
        }
      },
      onSuccess: (data) => {
        setAuthStorage(data.accessToken, data.user)
        queryClient.invalidateQueries({ queryKey: ['user'] });
      },
      onError: (error: any) => {
        useErrors(error);
      }
    })
  }