// src/api/mutations/authMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoginFormData } from '../types/authTypes'
import { mockUser } from '../mocks/authMocks'
import { useSetRecoilState } from 'recoil'
import { authState } from '@/common/atoms/authAtom'
import AuthUsers from '../queries/authQueries'


export const useLoginMutation = () => {
  const queryClient = useQueryClient()
  const setAuth = useSetRecoilState(authState);

  return useMutation({
   mutationFn: async (formData: LoginFormData) => {
     const response = await AuthUsers.login(formData);

     localStorage.setItem('token', (response as any).token);
     localStorage.setItem('user', JSON.stringify((response as any).user));
     return response;
   },
   onSuccess: (data) => {
     setAuth({
       token: (data as any).token,
       user: (data as any).user,
       isAuthenticated: true,
     });
     queryClient.invalidateQueries({queryKey: ['user']});
   },
  })
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

    // Update profile mutation
// export const useUpdateProfileMutation = () => {
//   const queryClient = useQueryClient();
//   const setAuth = useSetRecoilState(authState);

//   return useMutation({
//     mutationFn: async (userData: Partial<any>) => {
//       const updatedUser = await AuthUsers.updateProfile(userData);
//       return updatedUser;
//     },
//     onSuccess: (data) => {
//       // Actualizar usuario en el estado global
//       setAuth((prev) => ({
//         ...prev,
//         user: data
//       }));
      
//       // Actualizar en localStorage
//       localStorage.setItem('user', JSON.stringify(data));
      
//       // Invalidar queries relacionadas
//       queryClient.invalidateQueries({ queryKey: ['user'] });
//     }
//   });
// };

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
  

