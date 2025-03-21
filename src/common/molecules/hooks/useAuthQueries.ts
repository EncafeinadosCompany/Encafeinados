// src/api/queries/authQueries.ts
import { useQuery } from '@tanstack/react-query';
import { useRecoilValue } from 'recoil';

import { authState } from '@/common/atoms/authAtom';
import AuthUsers from '@/api/queries/authQueries';


// Hook para obtener el usuario actual
export const useCurrentUser = (options = {}) => {
  const auth = useRecoilValue(authState);
  
  return useQuery({
    queryKey: ['user'],
    queryFn: AuthUsers.getCurrentUser,
    enabled: !!auth.isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options
  });
};

// Hook para verificar si el token es válido
export const useVerifyToken = () => {
  const auth = useRecoilValue(authState);
  
  return useQuery({
    queryKey: ['verifyToken'],
    queryFn: AuthUsers.verifyToken,
    enabled: !!auth.token,
    staleTime: 60 * 1000, // 1 minuto
    retry: false
  });
};