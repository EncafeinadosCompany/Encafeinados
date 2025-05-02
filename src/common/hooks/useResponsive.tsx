import { useState, useEffect, useCallback } from 'react';

type Breakpoints = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

export function useResponsive(): Breakpoints {
  const [breakpoints, setBreakpoints] = useState<Breakpoints>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  });

  const updateBreakpoints = useCallback(() => {
    const width = window.innerWidth;
    const newBreakpoints = {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    };
    
    console.log('Screen width:', width, 'New breakpoints:', newBreakpoints); // ← AÑADE ESTE LOG
    setBreakpoints(newBreakpoints);
  }, []);

  useEffect(() => {
    // Inicialización inmediata
    updateBreakpoints();
    
    // Usar ResizeObserver para mejor rendimiento (y menos eventos)
    const resizeObserver = new ResizeObserver(updateBreakpoints);
    resizeObserver.observe(document.documentElement);
    
    // Añadir también el evento resize como respaldo
    window.addEventListener('resize', updateBreakpoints);
    
    // Añadir evento de cambio de orientación para dispositivos móviles
    window.addEventListener('orientationchange', updateBreakpoints);
    
    // Añadir evento para cuando la ventana vuelve a estar activa
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        updateBreakpoints();
      }
    });

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateBreakpoints);
      window.removeEventListener('orientationchange', updateBreakpoints);
    };
  }, [updateBreakpoints]);

  return breakpoints;
}