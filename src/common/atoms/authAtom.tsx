// src/store/atoms/authAtom.ts
import { atom } from 'recoil';
import { LoginFormData, User } from '../../api/types/authTypes';

interface AuthState {
  isAuthenticated: boolean;
  user: LoginFormData | null;
  token: string | null;
}

// Función para obtener el estado inicial desde localStorage
const getInitialAuthState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        isAuthenticated: true,
        user,
        token
      };
    } catch (error) {
      // Si hay un error al parsear, limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  
  return {
    isAuthenticated: false,
    user: null,
    token: null
  };
};

// Átomo para el estado de autenticación
export const authState = atom<AuthState>({
  key: 'authState',
  default: getInitialAuthState()
});