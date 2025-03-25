import { useRecoilState, useRecoilValue } from 'recoil';

import { LoginFormData, LoginResponse } from '@/api';
import { authState } from '@/common/atoms/authAtom';
import { Navigate, useNavigate } from 'react-router-dom';

export const useAuth = () => {
  // const [auth, setAuth] = useRecoilState(authState);

  // const login = (user: LoginResponse, token: string) => {
  //   // Guardar en localStorage
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('user', JSON.stringify(user));

  //   // Actualizar estado Recoil
  //   setAuth({
  //     isAuthenticated: true,
  //     user: user,
  //     token
  //   });
  // };

  // const logout = () => {
  //   // Limpiar localStorage
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');

  //   // Actualizar estado Recoil
  //   setAuth({
  //     isAuthenticated: false,
  //     user: null,
  //     token: null
  //   });
  // };

  // const updateUser = (userData: Partial<LoginFormData>) => {
  //   if (!auth.user) return;

  //   const updatedUser = { ...auth.user, ...userData };

  //   // Actualizar localStorage
  //   localStorage.setItem('user', JSON.stringify(updatedUser));

  //   // Actualizar estado Recoil
  //   setAuth({
  //     ...auth,
  //     user: updatedUser
  //   });
  // };


  const pagesPermissions = (rol: number,  navigate: (path: string) => void) => {

    if (rol === Number(import.meta.env.VITE_ROLE_COFFEELOVER)) {
      return navigate("/coffeelover");
    } else if (rol === Number(import.meta.env.VITE_ROLE_STORE)) {
      return navigate("/store");
    } else {
      navigate("/"); 
    }
  }

  return {
    // user: auth.user,
    // isAuthenticated: auth.isAuthenticated,
    // token: auth.token,
    // login,
    // logout,
    // updateUser,
    pagesPermissions
  };
};