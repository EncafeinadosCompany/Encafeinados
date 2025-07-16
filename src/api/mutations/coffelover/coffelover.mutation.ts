import AuthClient from "@/api/client/axios";
import { RegisterCoffelover, RegisterCoffeloverResponse } from "@/api/types/auth/auth.types";
import { useError } from "@/common/hooks/auth/use_errors.hook";
import { handleApiError } from "@/common/utils/errors/handle_api_error.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLoginMutation } from "../auth/authMutations";
import toast from "react-hot-toast";
import { UpdateProfileRequest } from "@/api/types/coffelovers/coffelovers.type";

const authClient = new AuthClient();

export const useRegisterCoffeloverMutation = () => {
  const queryClient = useQueryClient()
  const useLonginMutation = useLoginMutation()
  const useErrors = useError("registeCoffelover")

  return useMutation<RegisterCoffeloverResponse, Error, RegisterCoffelover>({
    mutationFn: async (formData: RegisterCoffelover): Promise<RegisterCoffeloverResponse> => {

      try {
        const response = await authClient.post<RegisterCoffeloverResponse>('/clients', formData);
        return response;

      } catch (error: any) {
        throw handleApiError(error)
      }
    },
  
    onSuccess: (data, variable: RegisterCoffelover) => {

      // Si es usuario de Google, no hacer login tradicional
      if (variable.userData.id_google) {
        toast.success("Perfil completado correctamente. ¡Bienvenido!");
        // Redirigir al flujo de Google OAuth para completar la autenticación
        window.open(`${import.meta.env.VITE_API_URL}/auth/google`, "_self");
        return;
      }

      // Solo para usuarios con password (registro tradicional)
      const user = {
        email: data.client.person.user_email,
        password: variable.userData.password
      }

      console.log('Traditional login for registered user:', user);

      useLonginMutation.mutate(user)

      toast.success("Perfil completado correctamente. ¡Bienvenido!");
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  })
}

export const useEditCoffeloverMutation = () => {
  const queryClient = useQueryClient()
  const useErrors = useError("editCoffelover")

  return useMutation<UpdateProfileRequest, Error, any>({
    mutationFn: async (variables: { formData: UpdateProfileRequest; id: number }): Promise<any> => {

      try {
        const response = await authClient.patch(`/clients/${variables.id}`, variables.formData);
        return response;

      } catch (error: any) {
        throw handleApiError(error)
      }
    },
  
    onSuccess: () => {

      toast.success("Tu perfil fue editado correctamente.");
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    }
  })
}


