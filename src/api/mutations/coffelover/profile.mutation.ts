import { useMutation, useQueryClient } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';
import { UpdateProfileRequest } from '@/api/types/coffelovers/coffelovers.type';
import { getAuthStorage } from '@/common/utils/security/auth_storage.utils';
import toast from 'react-hot-toast';
import { useError } from '@/common/hooks/auth/useErrors';
import { handleApiError } from '@/common/utils/errors/handle_api_error.utils';

const authClient = new AuthClient();

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { user } = getAuthStorage();
  const userId = user?.id;
  const useErrors = useError('updateProfile');

  return useMutation<any, Error, UpdateProfileRequest>({
    mutationFn: async (updateData: UpdateProfileRequest) => {
      if (!userId) throw new Error("Usuario no autenticado");
      
      console.log('Datos enviados a la API:', updateData);
      console.log('URL:', `/clients/${userId}`);
      
      try {
        const response = await authClient.patch(`/clients/${userId}`, updateData);
        console.log('Respuesta de la API:', response);
        return response;
      } catch (error: any) {
        console.error('Error en la API:', error.response?.data || error);
        throw handleApiError(error);
      }
    },
    onSuccess: () => {
      toast.success('Perfil actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['coffeeLoverProfile'] });
    },
    onError: (error: any) => {
      toast.remove();
      console.error('Error en mutación:', error);
      useErrors(error);
    },
  });
};