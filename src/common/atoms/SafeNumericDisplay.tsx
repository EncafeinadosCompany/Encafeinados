import React from 'react';
import { useSafeNumericValue } from '../hooks/useSafeNumericValue';

interface SafeNumericDisplayProps {
  value: number | null | undefined;
  defaultValue?: React.ReactNode;
  format?: (value: number) => string | number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * Componente para mostrar valores numéricos de forma segura,
 * especialmente en dispositivos móviles donde puede haber problemas de renderizado inicial.
 */
const SafeNumericDisplay: React.FC<SafeNumericDisplayProps> = ({
  value,
  defaultValue = '...',
  format,
  prefix = '',
  suffix = '',
  className = ''
}) => {
  const { safeValue, isReady } = useSafeNumericValue(value);
  
  // Si no está listo o el valor es null/undefined, mostramos el valor por defecto
  if (!isReady || safeValue === null || safeValue === undefined) {
    return <span className={className}>{defaultValue}</span>;
  }
  
  // Formateamos el valor si se proporciona una función de formato
  const displayValue = format ? format(safeValue as number) : safeValue;
  
  return (
    <span className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
};

export default SafeNumericDisplay;
