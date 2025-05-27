import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

/**
 * Hook para detectar el tipo de dispositivo y su orientación.
 * Proporciona información sobre si el dispositivo es móvil, tablet o desktop.
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false, 
    isTablet: false, 
    isDesktop: true,
    deviceType: 'desktop'
  });

  useEffect(() => {
    // Función para actualizar el estado de acuerdo al tipo de dispositivo
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      
      // Revisamos si es un dispositivo móvil por user agent
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(navigator.userAgent);
      
      // Determinamos el tipo de dispositivo por el ancho de la pantalla
      // y ajustamos según el user agent
      const isMobile = width < 768 || (isMobileDevice && width < 1024);
      const isTablet = (width >= 768 && width < 1024) || (isMobileDevice && width >= 1024);
      const isDesktop = width >= 1024 && !isMobileDevice;
      
      const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        deviceType
      });
    };
    
    // Inicializar al montar
    updateDeviceInfo();
    
    // Actualizar al cambiar el tamaño de la ventana o la orientación
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);
    
    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);
  
  return deviceInfo;
}
