import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {LoginResponse, User_Data } from '../../types/authTypes'
import { useError } from '@/common/hooks/auth/useErrors'
import { clearAuthStorage, setAuthStorage } from '@/common/utils/authStorage'
import AuthClient from '../../client/axios'
import { handleApiError } from '@/common/utils/errors/handleApiError'
import { useAuth } from '@/common/hooks/auth/useAuth'
import { useNavigate } from 'react-router-dom'


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

      setAuthStorage(data.accessToken, data.user);

       pagesPermissions(data.user.role, navigate)

      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      useErros(error)
    }
  });
}

export const useLoginGoogleMutation = () => {
  return useQuery<any>({
    queryKey: ['google'],
    queryFn: async () => {
      const response = window.location.href = 'http://localhost:3300/api/v2/auth/google';
      return response
    },
    
  })
}

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







