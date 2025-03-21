import { authState } from '@/common/atoms/authAtom';
import { set } from 'cypress/types/lodash';
import React, { JSX, use } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useAuth } from './useAuth';


export const ProtectedRoute= ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};
