import { TransportMode } from '@/common/hooks/map/useRouteNavigation';

/**
 * Formatea la distancia para mostrarla al usuario
 * @param meters Distancia en metros
 * @returns Texto formateado (ej: "500 m" o "2.5 km")
 */
export const formatDistance = (meters: number): string => {
  if (!meters && meters !== 0) return "Calculando...";
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

/**
 * Formatea el tiempo en minutos a un formato legible
 * @param minutes Tiempo en minutos
 * @returns Texto formateado (ej: "5 min" o "1 h 25 min")
 */
export const formatDuration = (minutes: number): string => {
  if (!minutes && minutes !== 0) return "Calculando...";
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${remainingMinutes} min`;
};

/**
 * Obtiene el ícono y color para cada modo de transporte
 */
export const getTransportModeInfo = (mode: TransportMode) => {
  switch (mode) {
    case 'walking':
      return { icon: 'footsteps', color: '#3498db', label: 'A pie' };
    case 'driving':
      return { icon: 'car', color: '#e74c3c', label: 'En auto' };
    case 'cycling':
      return { icon: 'bicycle', color: '#2ecc71', label: 'En bici' };
    default:
      return { icon: 'footsteps', color: '#3498db', label: 'A pie' };
  }
};