import { useRecoilState, useRecoilValue } from 'recoil';

import { LoginFormData } from '@/api';
import { authState } from '@/common/atoms/authAtom';

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  const login = (user: LoginFormData, token: string) => {
    // Guardar en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Actualizar estado Recoil
    setAuth({
      isAuthenticated: true,
      user: user,
      token
    });
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Actualizar estado Recoil
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null
    });
  };

  const updateUser = (userData: Partial<LoginFormData>) => {
    if (!auth.user) return;
    
    const updatedUser = { ...auth.user, ...userData };
    
    // Actualizar localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Actualizar estado Recoil
    setAuth({
      ...auth,
      user: updatedUser
    });
  };

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    token: auth.token,
    login,
    logout,
    updateUser
  };
};