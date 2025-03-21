import { authState } from '@/common/atoms/authAtom';
import { set } from 'cypress/types/lodash';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAuth } from './useAuth';


interface ProtectedRouteProps {
  redirectPath?: string;
}

export const ProtectedRoute= () => {
  const { isAuthenticated } = useRecoilValue(authState);

  if (!isAuthenticated) {
    console.log('No está logueado', isAuthenticated);
    return <Navigate to="/login" replace />; // Redirige al login si no está autenticado
  }

  return <Outlet />; // Renderiza las rutas hijas si está autenticado
};
