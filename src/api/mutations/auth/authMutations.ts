import { useMutation, useQueryClient } from '@tanstack/react-query'
import {LoginResponse, User_Data } from '../../types/auth/auth.types'
import { useError } from '@/common/hooks/auth/useErrors'
import { clearAuthStorage, saveCoffeeLoverProfileToStorage, setAuthStorage } from '@/common/utils/auth_storage.utils'
import AuthClient from '../../client/axios'
import { handleApiError } from '@/common/utils/errors/handle_api_error.utils'
import { useAuth } from '@/common/hooks/auth/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ROLES } from '@/common/utils/lists/roles.utils'
import { CoffeeLoverProfileType } from '@/api/types/coffelovers/coffelovers.type'

 

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

      if(data.storeOrBranchId) {
        queryClient.setQueryData(['storeOrBranchId'], data.storeOrBranchId);
        localStorage.setItem('storeOrBranchId', data.storeOrBranchId);
      }


      if(data.user.id){
        localStorage.setItem('userId', data.user.id)
      }

      if (data.user.role === ROLES.COFFEE_LOVER) {

        authClient.get(`/clients/user/${data.user.id}`)
        .then(profileData => {
          // Save profile data using the utility function
          saveCoffeeLoverProfileToStorage(profileData as CoffeeLoverProfileType);
          
          // Continue with other operations
          setAuthStorage(data.accessToken, data.user);
        })
        .catch(error => {
          console.error("Error fetching coffee lover profile:", error);
          setAuthStorage(data.accessToken, data.user);
        });
      }

      setAuthStorage(data.accessToken, data.user);

       pagesPermissions(data.user.role, navigate)


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







