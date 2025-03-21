// src/api/mutations/authMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoginFormData, LoginResponse, User_Data } from '../types/authTypes'
import { mockUser } from '../mocks/authMocks'
import { useSetRecoilState } from 'recoil'
import { authState } from '@/common/atoms/authAtom'
import AuthUsers from '../queries/authQueries'


export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  const setAuth = useSetRecoilState(authState);

  return useMutation<LoginResponse, Error, User_Data>({
    mutationFn: async (formData: User_Data) => {
      console.log('form data',formData)
      const response = await AuthUsers.login(formData);
      
      
      return response as LoginResponse; // Asegúrate de que la respuesta sea del tipo correcto
    },
    onSuccess: (data) => {
      // Guarda el token y los datos del usuario en localStorage

      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('datos', data)
    

      // Actualiza el estado de autenticación en Recoil
      setAuth({
        token: data.accessToken,
        user: data,
        isAuthenticated: true,
      });

      // Invalida las consultas relacionadas con el usuario
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

  // Register mutation
  export const useRegisterMutation = () => {
    const queryClient = useQueryClient()
    const setAuth = useSetRecoilState(authState);

    return useMutation ({
      mutationFn: async (formData: LoginFormData) => {
        const response = await AuthUsers.register(formData);

        localStorage.setItem('token', (response as any).token);
        localStorage.setItem('user', JSON.stringify((response as any).user));
        return response;
      },
      onSuccess: (data) =>{
        setAuth({
          token: (data as any).token,
          user: (data as any).user,
          isAuthenticated: true,
        });

       // Invalidar queries relacionadas
       queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    })
  }

    // Logout mutation
    export const useLogoutMutation = () =>{
      const queryClient = useQueryClient()
      const setAuth = useSetRecoilState(authState);

      return useMutation({
        mutationFn: async () => {
          await AuthUsers.logout();
        },
        onSuccess: () => {
          setAuth({
            token: '',
            user: null,
            isAuthenticated: false,
          });
          // Invalidar y resetear queries
          queryClient.clear();
        },
      })
    }


// Change password mutation
export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: async ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) => {
      await AuthUsers.changePassword(oldPassword, newPassword);
    }
  });
};

// Request password reset mutation
export const useRequestPasswordResetMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      await AuthUsers.requestPasswordReset(email);
    }
  });
};

// Reset password mutation
export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      await AuthUsers.resetPassword(token, newPassword);
    }
  });
};
  

