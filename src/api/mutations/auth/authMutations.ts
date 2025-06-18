import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoginResponse, User_Data } from '../../types/auth/auth.types'
import { useError } from '@/common/hooks/auth/useErrors'
import { clearAuthStorage, saveCoffeeLoverProfileToStorage, setAuthStorage } from '@/common/utils/security/auth_storage.utils'
import AuthClient from '../../client/axios'
import { handleApiError } from '@/common/utils/errors/handle_api_error.utils'
import { useAuth } from '@/common/hooks/auth/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ROLES } from '@/common/utils/lists/roles.utils'
import { CoffeeLoverProfileType } from '@/api/types/coffelovers/coffelovers.type'
import { getEncryptedItem, removeEncryptedItem, saveEncryptedItem } from '@/common/utils/security/storage_encrypted.utils'



const authClient = new AuthClient()

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
      queryClient.setQueryData(['user'], data.user);

      queryClient.setQueryData(['authToken'], data.accessToken);

      saveEncryptedItem('user', data.user);


      console.log("roles enviados:", data.storeId, data.branchId);

      data.branchId && saveEncryptedItem('branchId', data.branchId.toString());

      data.storeId && saveEncryptedItem('storeId', data.storeId.toString());

      data.user.id && saveEncryptedItem('userId', data.user.id);


      setAuthStorage(data.accessToken);

      if (data.user.roles.includes(ROLES.COFFEE_LOVER)) {

        authClient.get(`/clients/user/${data.user.id}`)
          .then(profileData => {
            saveCoffeeLoverProfileToStorage(profileData as CoffeeLoverProfileType);
          })
          .catch(error => {
            console.error("Error fetching coffee lover profile:", error);
          });
      }

      console.log("User data saved to encrypted storage:", data.user);


      const redirectPath = getEncryptedItem("redirectAfterLogin");

      if (redirectPath) {
        // Eliminar la ruta guardada
        removeEncryptedItem("redirectAfterLogin");
        // Redirigir a la ruta anterior

        console.log("Redirigiendo a la ruta guardada:", redirectPath);
        navigate(redirectPath);
      } else {
        // Si no hay ruta guardada, usar el comportamiento predeterminado
        pagesPermissions(data.user.roles, navigate);
      }


      toast.success("Inicio de sesión exitoso, ¡Bienvenido!");


      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      useErros(error)
    }
  });
}



export const useLoginGoogleMutation = () => {
  return useMutation({
    mutationFn: async () => {
      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    }
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      clearAuthStorage()
    },
    onSuccess: () => {
      queryClient.clear();
    },
  })
}







