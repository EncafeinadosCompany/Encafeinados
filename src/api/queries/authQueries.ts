// src/api/queries/authQueries.ts
import { LoginFormData, User } from '../types/authTypes'
import AuthClient from '../client/axios'

const authClient = new AuthClient()

const AuthUsers = {

  login: async (data: LoginFormData):
  Promise<LoginFormData> => {
    const response = await authClient.post('/login', data);
    return (response as any).data as LoginFormData;
  },

  register: async( data: LoginFormData):
  Promise<LoginFormData> => {
    const response = await authClient.post<LoginFormData>('/register', data);
    return (response as any).data;
  },

  googleLogin:(): void =>{
    window.location.href = '/auth/google';
  },

  handleGoogleCallback: async (token: string): Promise<User> => {
    localStorage.setItem('token', token);
    const response = await authClient.get('/auth/me');
    return (response as any).data;
  },

  getCurrentUser: async (): Promise<User> => {
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

   logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Actualizar información del usuario
  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await authClient.put('/auth/profile', data);
    return (response as any ).data;
  },

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