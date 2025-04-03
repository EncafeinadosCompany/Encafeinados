import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RegisterCoffelover, LoginResponse, User_Data } from '../../types/authTypes'
import { useError } from '@/common/hooks/auth/useErrors'
import { clearAuthStorage, setAuthStorage } from '@/common/utils/authStorage'
import { RegisterStoreSchemaType } from '../../types/storeTypes'
import AuthClient from '../../client/axios'
import { handleApiError } from '@/common/utils/errors/handleApiError'


const authClient = new AuthClient()

export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  const useErros = useError('login')
  

  return useMutation<LoginResponse, Error, User_Data>({
    mutationFn: async (formData: User_Data) => {
      console.log('form data', formData)
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

      setAuthStorage(data.accessToken, data.user);

      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      useErros(error)
    }
  });
}

// export const useLoginGoogleMutation = () => {
//   const queryClient = useQueryClient()
//   const useErros = useError('login')

//   return useMutation<LoginResponse, Error, any>({
//     mutationFn: async (formData: any) => {
//       console.log('form data', formData)
//       try {
//         const response = await authClient.get<LoginResponse>('/auth/google', formData);
//         window.location.href = 'http://localhost:3300/api/v2/auth/google';
//         console.log('AQUI', response)
//         return response as LoginResponse;
  
//       } catch (error: any) {
//         throw handleApiError(error)
//       }
//     },
//     onSuccess: (data) => {

//       setAuthStorage(data.accessToken, data.user)

//       console.log('datos', data)

//       queryClient.invalidateQueries({ queryKey: ['user'] });
//     },
//     onError: (error: any) => {
//       useErros(error)
//     }
//   });
// }


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







