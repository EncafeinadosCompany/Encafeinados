import { useState, useEffect } from 'react';

/**
 * Hook para aplicar debounce a un valor
 * @param value El valor a aplicar debounce
 * @param delay Tiempo de espera en milisegundos
 * @returns El valor después del tiempo de espera
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    // Configurar un timer para actualizar el valor después del retraso
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    // Limpiar el timer si el valor cambia antes del retraso
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}