import { useState, useCallback, useEffect, useRef } from 'react';
import { LatLngTuple } from '@/api/types/map/map_search.types';
import L from 'leaflet';

/**
 * Tipos de error en la geolocalización
 */
export enum LocationErrorType {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  POSITION_UNAVAILABLE = 'POSITION_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Hook mejorado para manejar la geolocalización del usuario
 */
export const useGeolocation = (mapInstance: L.Map | null) => {
  // Estados
  const [userLocation, setUserLocation] = useState<LatLngTuple | null>(null);
  const [locatingUser, setLocatingUser] = useState<boolean>(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<LocationErrorType | null>(null);

  // Refs
  const progressiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCountRef = useRef<number>(0);
  
  /**
   * Función para obtener la ubicación del usuario con refinamiento progresivo
   */
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      console.error("Geolocalización no soportada");
      return;
    }
    
    setLocatingUser(true);
    setLocationError(null);
    attemptCountRef.current = 0;
    
    // Limpiar timeout previo si existe
    if (progressiveTimeoutRef.current) {
      clearTimeout(progressiveTimeoutRef.current);
    }
    
    // Función para obtener ubicación con precisión progresiva
    const getLocationWithPrecision = (attempt: number) => {
      // Opciones de precisión según el intento
      // 1er intento: baja precisión, rápida respuesta
      // 2do intento: alta precisión, más tiempo de espera
      const options = {
        enableHighAccuracy: attempt > 0,
        timeout: attempt === 0 ? 3000 : 10000,
        maximumAge: attempt === 0 ? 60000 : 0 // En el primer intento permitimos cache
      };
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy: posAccuracy } = position.coords;
          const newLocation: LatLngTuple = [latitude, longitude];
          
          // Actualizar estado
          setUserLocation(newLocation);
          setAccuracy(posAccuracy);
          
          // Mover el mapa según la precisión
          if (mapInstance) {
            // Zoom dinámico según la precisión
            const zoom = posAccuracy < 50 ? 16 : 
                         posAccuracy < 100 ? 15 : 14;
                         
            mapInstance.flyTo(newLocation, zoom, {
              duration: 1.5 // duración en segundos
            });
          }
          
          // Si es el primer intento y la precisión no es buena, intentar mejorarla
          if (attempt === 0 && posAccuracy > 100) {
            progressiveTimeoutRef.current = setTimeout(() => {
              getLocationWithPrecision(1);
            }, 1500);
          } else {
            setLocatingUser(false);
          }
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          
          // Manejar específicamente cada tipo de error
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(LocationErrorType.PERMISSION_DENIED);
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError(LocationErrorType.POSITION_UNAVAILABLE);
              break;
            case error.TIMEOUT:
              setLocationError(LocationErrorType.TIMEOUT);
              
              // Si es timeout y tenemos menos de 2 intentos, reducir la precisión
              if (attempt < 2) {
                progressiveTimeoutRef.current = setTimeout(() => {
                  getLocationWithPrecision(attempt + 1);
                }, 1000);
                return;
              }
              break;
            default:
              setLocationError(LocationErrorType.UNKNOWN);
          }
          
          setLocatingUser(false);
        },
        options
      );
    };
    
    // Comenzar con el primer intento (baja precisión)
    getLocationWithPrecision(0);
    
  }, [mapInstance]);
  
  /**
   * Obtener mensaje de error según el tipo
   */
  const getErrorMessage = useCallback((): string | null => {
    if (!locationError) return null;
    
    switch (locationError) {
      case LocationErrorType.PERMISSION_DENIED:
        return "No podemos acceder a tu ubicación. Por favor, verifica los permisos.";
      case LocationErrorType.POSITION_UNAVAILABLE:
        return "Tu ubicación actual no está disponible. Inténtalo nuevamente.";
      case LocationErrorType.TIMEOUT:
        return "La solicitud de ubicación tomó demasiado tiempo. Señal GPS débil.";
      default:
        return "Error al obtener tu ubicación. Por favor, inténtalo de nuevo.";
    }
  }, [locationError]);

  // Obtener ubicación al montar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      getUserLocation();
    }, 800);
    
    return () => {
      clearTimeout(timer);
      if (progressiveTimeoutRef.current) {
        clearTimeout(progressiveTimeoutRef.current);
      }
    };
  }, [getUserLocation]);
  
  return { 
    userLocation, 
    locatingUser, 
    accuracy,
    locationError,
    errorMessage: getErrorMessage(),
    getUserLocation
  };
};