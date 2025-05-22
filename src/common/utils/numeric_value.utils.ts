/**
 * Utilidades para manejar y mostrar valores numéricos de forma segura.
 */

/**
 * Determina si un valor es un número válido (no es NaN, undefined o null).
 * @param value El valor a comprobar
 * @returns true si es un número válido
 */
export const isValidNumber = (value: any): boolean => {
  return value !== undefined && value !== null && !isNaN(Number(value));
};

/**
 * Proporciona un valor de respaldo si el valor original no es un número válido.
 * @param value El valor original
 * @param fallback Valor de respaldo si el original no es válido
 * @returns El valor original si es válido, o el valor de respaldo
 */
export const safeNumber = <T,>(
  value: T | null | undefined, 
  fallback: T | null = null
): T | null => {
  if (value === undefined || value === null) {
    return fallback;
  }
  
  if (typeof value === 'number' && isNaN(value)) {
    return fallback;
  }
  
  return value;
};

/**
 * Formatea un número para mostrar un número específico de decimales.
 * @param value El valor a formatear
 * @param decimals El número de decimales a mostrar
 * @param fallback Valor a devolver si no es un número válido
 * @returns El número formateado o el valor de respaldo
 */
export const formatNumberWithDecimals = (
  value: number | null | undefined,
  decimals: number = 2,
  fallback: string = '0'
): string => {
  if (!isValidNumber(value)) {
    return fallback;
  }
  
  return Number(value).toFixed(decimals);
};

/**
 * Formatea un precio según la configuración regional.
 * @param value El valor a formatear
 * @param locale La configuración regional (por defecto es 'es-CO')
 * @param currency La moneda (por defecto es 'COP')
 * @param fallback Valor a devolver si no es un número válido
 * @returns El precio formateado o el valor de respaldo
 */
export const formatPrice = (
  value: number | null | undefined,
  locale: string = 'es-CO',
  currency: string = 'COP',
  fallback: string = '$0'
): string => {
  if (!isValidNumber(value)) {
    return fallback;
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Number(value));
};
