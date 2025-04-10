import { TransportMode } from '@/common/hooks/map/useRouteNavigation';

// Velocidades promedio por modo de transporte (km/h)
const AVERAGE_SPEEDS = {
  walking: 5,      // 5 km/h caminando
  driving: 40,     // 40 km/h en ciudad
  bicycling: 15    // 15 km/h en bicicleta
};

/**
 * Calcula el tiempo estimado de viaje en minutos
 * @param distanceInKm Distancia en kilómetros
 * @param mode Modo de transporte (walking, driving, bicycling)
 * @returns Tiempo estimado en minutos
 */
export const calculateRouteTime = (distanceInKm: number, mode: TransportMode): number => {
  const speedKmH = AVERAGE_SPEEDS[mode];
  const timeInHours = distanceInKm / speedKmH;
  return Math.round(timeInHours * 60); // Convertir a minutos y redondear
};

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
 * Formatea el tiempo en segundos a un formato legible
 * @param seconds Tiempo en segundos
 * @returns Texto formateado (ej: "5 min" o "1 h 25 min")
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds && seconds !== 0) return "Calculando...";
  
  const minutes = Math.round(seconds / 60);
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
    case 'bicycling':
      return { icon: 'bicycle', color: '#2ecc71', label: 'En bici' };
    default:
      return { icon: 'footsteps', color: '#3498db', label: 'A pie' };
  }
};