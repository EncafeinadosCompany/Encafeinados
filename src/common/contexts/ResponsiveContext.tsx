import React, { createContext, useContext, ReactNode } from 'react';
import { useResponsive } from '../hooks/useResponsive';

type ResponsiveContextType = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(undefined);

export function ResponsiveProvider({ children }: { children: ReactNode }) {
  const breakpoints = useResponsive();

  // Establecer las variables CSS globales para ser usadas en cualquier componente
  React.useEffect(() => {
    if (breakpoints.isMobile) {
      document.documentElement.style.setProperty('--mobile-nav-height', '4rem');
      document.documentElement.classList.add('is-mobile');
      document.documentElement.classList.remove('is-tablet', 'is-desktop');
    } else if (breakpoints.isTablet) {
      document.documentElement.style.removeProperty('--mobile-nav-height');
      document.documentElement.classList.add('is-tablet');
      document.documentElement.classList.remove('is-mobile', 'is-desktop');
    } else {
      document.documentElement.style.removeProperty('--mobile-nav-height');
      document.documentElement.classList.add('is-desktop');
      document.documentElement.classList.remove('is-mobile', 'is-tablet');
    }
  }, [breakpoints]);

  return (
    <ResponsiveContext.Provider value={breakpoints}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsiveContext() {
  const context = useContext(ResponsiveContext);
  if (context === undefined) {
    throw new Error('useResponsiveContext must be used within a ResponsiveProvider');
  }
  return context;
}