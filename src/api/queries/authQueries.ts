
import { RegisterCoffelover, LoginResponse, User_Data } from '../types/authTypes'
import AuthClient from '../client/axios'
import { handleApiError } from '@/common/utils/errors/handleApiError';

const authClient = new AuthClient()

const AuthUsers = {

  login: async (data: User_Data):Promise<LoginResponse> => {
    try{
      const response = await authClient.post<LoginResponse>('/auth/login', data);
      return response;
      
    }catch (error: any) {
      throw handleApiError(error)
    }
  },

  registerCoffelover: async( data: RegisterCoffelover):Promise<LoginResponse> => {
    try{
      const response = await authClient.post<LoginResponse>('/auth/register-client', data);
      console.log('AQUI',response)
      return response;
      
    }catch (error: any) {
      throw handleApiError(error)
    }
  },

  googleLogin:(): void =>{
    window.location.href = '/auth/google';
  },

  // handleGoogleCallback: async (token: string): Promise<User> => {
  //   localStorage.setItem('token', token);
  //   const response = await authClient.get('/auth/me');
  //   return (response as any).data;
  // },

  getCurrentUser: async (): Promise<LoginResponse> => {
    const response = await authClient.get('/auth/me');
    return (response as any).data;
  },

  verifyToken: async (): Promise<boolean> => {
    try {
      await authClient.get('/auth/verify');
      return true;
    } catch (error) {
      return false;
    }
  },


  // Actualizar información del usuario
  // updateProfile: async (data: Partial<User>): Promise<User> => {
  //   const response = await authClient.put('/auth/profile', data);
  //   return (response as any ).data;
  // },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await authClient.post('/auth/change-password', { oldPassword, newPassword });
  },

  // Solicitar restablecimiento de contraseña
  requestPasswordReset: async (email: string): Promise<void> => {
    await authClient.post('/auth/forgot-password', { email });
  },

  // Restablecer contraseña con token
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await authClient.post('/auth/reset-password', { token, newPassword });
  }

}
 
export default AuthUsers;