import AuthClient from "@/api/client/axios";
import { RegisterCoffelover, RegisterCoffeloverResponse } from "@/api/types/authTypes";
import { useError } from "@/common/hooks/auth/useErrors";
import { handleApiError } from "@/common/utils/errors/handleApiError";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoginMutation } from "../auth/authMutations";

const authClient = new AuthClient();

export const useRegisterCoffeloverMutation = () => {
  const queryClient = useQueryClient()
  const useLonginMutation = useLoginMutation()
  const useErrors = useError("registeCoffelover")

  return useMutation<RegisterCoffeloverResponse, Error, RegisterCoffelover>({
    mutationFn: async (formData: RegisterCoffelover): Promise<RegisterCoffeloverResponse> => {

      try {
        const response = await authClient.post<RegisterCoffeloverResponse>('/clients', formData);
        console.log('AQUI', response)

        return response;

      } catch (error: any) {
        throw handleApiError(error)
      }
    },
    onSuccess: (data, variable: RegisterCoffelover) => {
      useLonginMutation.mutate({
        email: data.client.person.user_email,
        password: variable.userData.password
      })
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      useErrors(error);
    }
  })
}