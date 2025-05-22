import { useState, useEffect } from 'react';
import { useDeviceDetection } from './useDeviceDetection';

/**
 * Hook personalizado para manejar valores numéricos de forma segura,
 * especialmente en dispositivos móviles donde puede haber problemas de renderizado inicial.
 * 
 * @param value - El valor numérico a manejar
 * @param defaultValue - Valor por defecto a mostrar antes de que el valor real esté listo
 * @param readyDelay - Tiempo de espera (ms) en dispositivos móviles antes de mostrar el valor real
 * @returns Objeto con el valor seguro y bandera que indica si está listo para mostrar
 */
export function useSafeNumericValue<T>(
  value: T | null | undefined,
  defaultValue: T | null = null,
  readyDelay: number = 100
) {
  const [safeValue, setSafeValue] = useState<T | null>(defaultValue);
  const [isReady, setIsReady] = useState(false);
  const { isMobile } = useDeviceDetection();

  useEffect(() => {
    // En dispositivos móviles, retrasamos la asignación del valor para asegurar
    // que el componente esté completamente montado y evitar problemas de renderizado
    if (isMobile) {
      const timer = setTimeout(() => {
        if (value !== undefined) {
          setSafeValue(value);
        }
        setIsReady(true);
      }, readyDelay);

      return () => clearTimeout(timer);
    } else {
      // En dispositivos de escritorio, podemos asignar el valor inmediatamente
      if (value !== undefined) {
        setSafeValue(value);
      }
      setIsReady(true);
    }
  }, [value, isMobile, readyDelay]);

  return { safeValue, isReady };
}
