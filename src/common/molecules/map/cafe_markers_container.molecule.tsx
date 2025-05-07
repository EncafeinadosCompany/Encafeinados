import React, { useMemo } from 'react';
import { Cafe } from '@/api/types/map/map_search.types';
import CafeMarker from './cafe_marker.molecule';
import L from 'leaflet';

// Extender el tipo Cafe para incluir la propiedad de proximidad
interface CafeWithProximity extends Cafe {
  hasNearbyCafes?: boolean;
}

interface CafeMarkersContainerProps {
  cafes: Cafe[];
  activeCafe: number | null;
  setActiveCafe: (id: number) => void;
  setShowSidebar: (show: boolean) => void;
}

const CafeMarkersContainer: React.FC<CafeMarkersContainerProps> = ({ 
  cafes, 
  activeCafe, 
  setActiveCafe, 
  setShowSidebar 
}) => {
  // Identificamos grupos de cafés cercanos para aplicarles estilos especiales
  const cafesWithProximityInfo = useMemo(() => {
    // Crear una copia y convertir al tipo extendido
    const result: CafeWithProximity[] = cafes.map(cafe => ({...cafe}));
    
    // Calcular distancia entre cafés
    for (let i = 0; i < result.length; i++) {
      const current = result[i];
      let hasNearbyCafes = false;
      
      for (let j = 0; j < result.length; j++) {
        if (i === j) continue;
        
        const other = result[j];
        const distance = L.latLng(
          current.latitude, current.longitude
        ).distanceTo(
          L.latLng(other.latitude, other.longitude)
        );
        
        // Si está a menos de 200m, considerar cercano
        if (distance < 200) {
          hasNearbyCafes = true;
          break;
        }
      }
      
      // Agregar propiedad
      current.hasNearbyCafes = hasNearbyCafes;
    }
    
    return result;
  }, [cafes]);
  
  return (
    <>
      {cafesWithProximityInfo.map(cafe => (
        <CafeMarker
          key={cafe.id}
          cafe={cafe}
          isActive={activeCafe === cafe.id}
          hasNearbyCafes={cafe.hasNearbyCafes || false}
          onClick={() => {
            setActiveCafe(cafe.id);
            if (window.innerWidth >= 768) {
              setShowSidebar(true);
            }
          }}
          proximityRadius={200}
        />
      ))}
    </>
  );
};

export default CafeMarkersContainer;