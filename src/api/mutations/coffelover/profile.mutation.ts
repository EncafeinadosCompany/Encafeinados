import { useMutation, useQueryClient } from '@tanstack/react-query';
import AuthClient from '@/api/client/axios';
import { UpdateProfileRequest } from '@/api/types/coffelovers/coffelovers.type';
import { getAuthStorage } from '@/common/utils/auth_storage.utils';
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
      
      try {
        const response = await authClient.patch(`/clients/${userId}`, updateData);
        return response;
      } catch (error: any) {
        throw handleApiError(error);
      }
    },
    onSuccess: () => {
      toast.success('Perfil actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ['coffeeLoverProfile'] });
    },
    onError: (error: any) => {
      toast.remove();
      useErrors(error);
    },
  });
};