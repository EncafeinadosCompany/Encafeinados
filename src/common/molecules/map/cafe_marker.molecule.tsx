import React, { useState, useMemo, useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Cafe } from '@/api/types/map/map_search.types';

interface CafeMarkerProps {
  cafe: Cafe;
  isActive: boolean;
  onClick: () => void;
  hasNearbyCafes?: boolean;  // Añadida esta propiedad
  proximityRadius?: number;
}

const CafeMarker: React.FC<CafeMarkerProps> = ({ 
  cafe, 
  isActive, 
  onClick, 
  hasNearbyCafes = false, // Valor por defecto
  proximityRadius = 200
}) => {
  const map = useMap();
  const [isHovered, setIsHovered] = useState(false);
  
  // Calcular tamaño basado en zoom
  const getMarkerSize = () => {
    const zoom = map.getZoom();
    if (zoom < 13) return isActive ? 32 : 28;
    if (zoom < 15) return isActive ? 38 : 34;
    return isActive ? 44 : 40;
  };
  
  // Crear icono personalizado con el logo de la tienda
  const customIcon = useMemo(() => {
    const size = getMarkerSize();
    
    return L.divIcon({
      className: 'custom-cafe-marker',
      html: `
        <div 
          class="cafe-marker ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''} ${hasNearbyCafes ? 'has-nearby' : ''} ${!cafe.isOpen ? 'closed' : ''}" 
          style="width:${size}px;height:${size}px;"
        >
          <div class="marker-content">
            <img 
              src="${cafe.image}" 
              alt="${cafe.name}" 
              onerror="this.onerror=null;this.src='https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';" 
            />
            ${!cafe.isOpen ? '<div class="closed-badge">Cerrado</div>' : ''}
            ${isActive || isHovered ? `
              <div class="cafe-label">
                <span>${cafe.name}</span>
                <div class="rating">
                  ${Array(Math.round(cafe.rating || 4.5)).fill('★').join('')}
                  ${Array(5 - Math.round(cafe.rating || 4.5)).fill('☆').join('')}
                </div>
                ${!cafe.isOpen ? '<div class="closed-label">Cerrado</div>' : ''}
              </div>
            ` : ''}
          </div>
          ${isActive ? '<div class="pulse-ring"></div>' : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size],
    });
  }, [cafe.image, cafe.name, cafe.rating, cafe.isOpen, isActive, isHovered, hasNearbyCafes, map.getZoom()]);
  
  // Escuchar cambios de zoom
  useEffect(() => {
    const handleZoom = () => {
      // Forzar actualización del componente
      setIsHovered(h => h);
    };
    
    map.on('zoom', handleZoom);
    return () => {
      map.off('zoom', handleZoom);
    };
  }, [map]);
  
  return (
    <Marker
      position={[cafe.latitude, cafe.longitude]}
      icon={customIcon}
      zIndexOffset={isActive ? 1000 : (isHovered ? 500 : 0)}
      eventHandlers={{
        click: onClick,
        mouseover: () => setIsHovered(true),
        mouseout: () => setIsHovered(false)
      }}
    />
  );
};

export default CafeMarker;