import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface AppDataContextType {
  isDataReady: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  setIsDataReady: (value: boolean) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

interface AppDataProviderProps {
  children: ReactNode;
  initialDataReady?: boolean;
}

/**
 * Proveedor de contexto para datos globales de la aplicación.
 * Incluye información sobre el dispositivo y estados globales de carga de datos.
 */
export const AppDataProvider: React.FC<AppDataProviderProps> = ({ 
  children,
  initialDataReady = false
}) => {
  const [isDataReady, setIsDataReady] = useState(initialDataReady);
  const deviceInfo = useDeviceDetection();

  // Si no es móvil, podemos considerar que los datos están listos inmediatamente
  useEffect(() => {
    if (!deviceInfo.isMobile && !isDataReady) {
      setIsDataReady(true);
    }
  }, [deviceInfo.isMobile, isDataReady]);

  const value = {
    isDataReady,
    setIsDataReady,
    ...deviceInfo
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

/**
 * Hook para acceder al contexto de datos de la aplicación.
 */
export const useAppData = (): AppDataContextType => {
  const context = useContext(AppDataContext);
  
  if (context === undefined) {
    throw new Error('useAppData debe ser usado dentro de un AppDataProvider');
  }
  
  return context;
};