import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Types
import { LoginResponse, User_Data } from '@/api/types/auth/auth.types';
import { CoffeeLoverProfileType } from '@/api/types/coffelovers/coffelovers.type';
import { PasswordResetData } from '@/common/utils/schemas/auth/password_reset.schema';
import { ChangePasswordData } from '@/common/utils/schemas/auth/change_password.schema';

// Utils & Services
import AuthClient from '@/api//client/axios';
import { ROLES } from '@/common/utils/lists/roles.utils';
import { handleApiError } from '@/common/utils/errors/handle_api_error.utils';
import { saveCoffeeLoverProfileToStorage} from '@/common/utils/security/auth_storage.utils';
import { saveEncryptedItem } from '@/common/utils/security/storage_encrypted.utils';

// Hooks
import { useError } from '@/common/hooks/auth/use_errors.hook';
import { useAuth } from '@/common/hooks/auth/use_auth.hook';

const authClient = new AuthClient();

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  const { pagesPermissions } = useAuth()
  const useErros = useError('login')
  const navigate = useNavigate()

  return useMutation<LoginResponse, Error, User_Data>({
    mutationFn: async (formData: User_Data) => {

      try {
        const response = await authClient.post<LoginResponse>('/auth/login', formData);
        return response as LoginResponse;

      } catch (error: any) {
        throw handleApiError(error)
      }
    },
    onSuccess: (data) => {

      updateQueryCache(queryClient, data)

      saveUserData(data);

      if (data.user.roles.includes(ROLES.COFFEE_LOVER) && data.user.id !== undefined) {
        GetCoffeeLoverData(String(data.user.id));
      }

      pagesPermissions(data.user.roles, navigate)

      toast.success("Inicio de sesión exitoso, ¡Bienvenido!");
    },
    onError: (error: any) => {
      useErros(error)
    }
  });
}

export const usePasswordResetMutation = () => {
  return useMutation<{ message: string }, Error, PasswordResetData>({
    mutationFn: async (formData: PasswordResetData) => {
      try {
        const response = await authClient.post<{ message: string }>('/auth/req-pass-reset', formData);
        return response as { message: string };
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success('Enlace de recuperación enviado exitosamente');
    },
    onError: (error: any) => {
      const status = error?.response?.status || error?.status || error?.statusCode;
      
      switch (status) {
        case 400:
          toast.error('El formato del correo electrónico no es válido');
          break;
        case 404:
          toast.error('No encontramos una cuenta con ese correo electrónico');
          break;
        case 500:
          toast.error('Error interno del servidor. Intenta más tarde');
          break;
        default:
          toast.error('Error al enviar el enlace. Intenta nuevamente');
      }
    },
  });
}

export const useChangePasswordMutation = () => {
  const navigate = useNavigate();
  
  return useMutation<{ message: string }, Error, { token: string; newPassword: string }>({
    mutationFn: async ({ token, newPassword }) => {
      try {
        const response = await authClient.put<{ message: string }>('/auth/reset-pass', {
          token,
          newPassword
        });
        return response as { message: string };
      } catch (error: any) {
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success('Contraseña cambiada exitosamente');
      navigate('/login');
    },
    onError: (error: any) => {
      const status = error?.response?.status || error?.status || error?.statusCode;
      
      switch (status) {
        case 400:
          toast.error('Token inválido o expirado');
          break;
        case 404:
          toast.error('Token no encontrado');
          break;
        case 500:
          toast.error('Error interno del servidor. Intenta más tarde');
          break;
        default:
          toast.error('Error al cambiar la contraseña. Intenta nuevamente');
      }
    },
  });
}

function saveUserData(data: LoginResponse) {
  
  data.user && saveEncryptedItem('user', data.user);

  data.branchId && saveEncryptedItem('branchId', data.branchId?.toString());

  data.storeId && saveEncryptedItem('storeId', data.storeId.toString());

  data.user.id && saveEncryptedItem('userId', data.user.id);

  data.accessToken && localStorage.setItem('token', data.accessToken);

}

async function GetCoffeeLoverData(userId: string) {
  try {
    const profileData = await authClient.get<CoffeeLoverProfileType>(`/clients/user/${userId}`);
    saveCoffeeLoverProfileToStorage(profileData as CoffeeLoverProfileType);
  } catch (error) {
   
  }
}

function updateQueryCache(queryClient: ReturnType<typeof useQueryClient>, data: LoginResponse) {
  queryClient.setQueryData(['user'], data.user);
  queryClient.setQueryData(['token'], data.accessToken);
  queryClient.invalidateQueries({ queryKey: ['user'] });
}







