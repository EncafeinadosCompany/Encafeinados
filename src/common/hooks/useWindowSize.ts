import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0
  });
  
  useEffect(() => {
    // Handler para llamar en resize de window
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    // Llamar handler inmediatamente para establecer estado inicial
    handleResize();
    
    // Configurar listener
    window.addEventListener('resize', handleResize);
    
    // Limpiar listener al desmontar
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}