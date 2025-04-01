import { useMutation, useQueryClient } from '@tanstack/react-query'
import { RegisterCoffelover, LoginResponse, User_Data } from '../types/authTypes'
import { useSetRecoilState } from 'recoil'
import AuthUsers from '../queries/authQueries'
import { useError } from '@/common/molecules/hooks/useErrors'
import { clearAuthStorage, setAuthStorage } from '@/common/utils/authStorage'
import { RegisterStoreSchemaType } from '../types/storeTypes'
import { useAuth } from '@/common/hooks/authContext'
import { set } from 'cypress/types/lodash'


export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  const useErros = useError('login')


  return useMutation<LoginResponse, Error, User_Data>({
    mutationFn: async (formData: User_Data) => {
      console.log('form data', formData)
      const response = await AuthUsers.login(formData);
      return response as LoginResponse;
    },
    onSuccess: (data) => {

      setAuthStorage(data.accessToken, data.user)

      console.log('datos', data)

      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      useErros(error)
    }
  });
}

export const useRegisterCoffeloverMutation = () => {
  const queryClient = useQueryClient()
  const useErrors = useError("registeCoffelover")

  return useMutation<LoginResponse, Error, RegisterCoffelover>({
    mutationFn: async (formData: RegisterCoffelover): Promise<LoginResponse> => {
      const response = await AuthUsers.registerCoffelover(formData);
      return response;
    },
    onSuccess: (data) => {

      setAuthStorage(data.accessToken, data.user)

      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      useErrors(error);
    }
  })
}

export const useRegisterStoreMutation = () => {
  const queryClient = useQueryClient()
  const useErrors = useError("registeCoffelover")

  return useMutation<LoginResponse, Error, RegisterStoreSchemaType>({
    mutationFn: async (formData: RegisterStoreSchemaType): Promise<LoginResponse> => {
      const response = await AuthUsers.registerStores(formData);
      return response;
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


export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
      await AuthUsers.changePassword(oldPassword, newPassword);
    }
  });
};

export const useRequestPasswordResetMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      await AuthUsers.requestPasswordReset(email);
    }
  });
};
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      await AuthUsers.resetPassword(token, newPassword);
    }
  });
};


