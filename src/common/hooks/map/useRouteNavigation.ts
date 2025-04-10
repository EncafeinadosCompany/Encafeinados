import { useState, useCallback, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';

export type TransportMode = 'walking' | 'driving' | 'bicycling';

interface RouteNavigationReturn {
  transportMode: TransportMode;
  setTransportMode: (mode: TransportMode) => void;
  origin: LatLngTuple | null;
  destination: LatLngTuple | null;
  setOrigin: (origin: LatLngTuple | null) => void;
  setDestination: (destination: LatLngTuple | null) => void;
  isCalculatingRoute: boolean;
  setIsCalculatingRoute: (calculating: boolean) => void;
  routeInfo: { distance: number, time: number } | null;
  setRouteInfo: (info: { distance: number, time: number } | null) => void;
  clearRoute: () => void;
  isRouteActive: boolean;
}

export const useRouteNavigation = (
  initialOrigin: LatLngTuple | null = null,
  initialDestination: LatLngTuple | null = null
): RouteNavigationReturn => {
  const [transportMode, setTransportMode] = useState<TransportMode>('walking');
  const [origin, setOrigin] = useState<LatLngTuple | null>(initialOrigin);
  const [destination, setDestination] = useState<LatLngTuple | null>(initialDestination);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);
  const [routeInfo, setRouteInfo] = useState<{ distance: number, time: number } | null>(null);

  // Calcular la distancia directa entre dos puntos
  const calculateDirectDistance = useCallback((start: LatLngTuple, end: LatLngTuple): number => {
    const R = 6371e3; // Radio de la Tierra en metros
    const φ1 = (start[0] * Math.PI) / 180;
    const φ2 = (end[0] * Math.PI) / 180;
    const Δφ = ((end[0] - start[0]) * Math.PI) / 180;
    const Δλ = ((end[1] - start[1]) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d; // Distancia en metros
  }, []);

  // Calcular tiempo estimado basado en distancia y modo de transporte
  const calculateTime = useCallback((distanceMeters: number, mode: TransportMode): number => {
    // Velocidades promedio en m/s
    const speeds = {
      walking: 1.4,      // ~5 km/h
      bicycling: 4.2,    // ~15 km/h
      driving: 11.1      // ~40 km/h
    };
    
    return distanceMeters / speeds[mode]; // Tiempo en segundos
  }, []);

  // Limpiar la ruta
  const clearRoute = useCallback(() => {
    setRouteInfo(null);
    setDestination(null);
  }, []);

  // Recalcular la ruta cuando cambia origen, destino o modo de transporte
  useEffect(() => {
    if (origin && destination) {
      setIsCalculatingRoute(true);
      
      // Simular un pequeño retraso para que la UI muestre "calculando..."
      setTimeout(() => {
        const distance = calculateDirectDistance(origin, destination);
        const time = calculateTime(distance, transportMode);
        
        setRouteInfo({
          distance,
          time
        });
        
        setIsCalculatingRoute(false);
      }, 500);
    } else {
      setRouteInfo(null);
    }
  }, [origin, destination, transportMode, calculateDirectDistance, calculateTime]);

  return {
    transportMode,
    setTransportMode,
    origin,
    destination,
    setOrigin,
    setDestination,
    isCalculatingRoute,
    setIsCalculatingRoute,
    routeInfo,
    setRouteInfo,
    clearRoute,
    isRouteActive: Boolean(origin && destination)
  };
};