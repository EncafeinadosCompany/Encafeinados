import React, { useEffect, useMemo } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Cafe } from '@/common/types/map/mapTypes';

interface CafeMarkerProps {
  cafe: Cafe;
  isActive: boolean;
  onClick: () => void;
}

const CafeMarker: React.FC<CafeMarkerProps> = ({ cafe, isActive, onClick }) => {
  const map = useMap();
  
  // Crear icono personalizado con el logo de la tienda
  const customIcon = useMemo(() => {
    const size = isActive ? 48 : 40;
    
    return L.divIcon({
      className: 'custom-cafe-marker',
      html: `
        <div class="cafe-marker ${isActive ? 'active' : ''}" style="width:${size}px;height:${size}px;">
          <img 
            src="${cafe.image}" 
            alt="${cafe.name}" 
            onerror="this.onerror=null;this.src='https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';" 
          />
          ${isActive ? '<div class="pulse-ring"></div>' : ''}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size],
      popupAnchor: [0, -size/2],
    });
  }, [cafe.image, cafe.name, isActive]);
  
  // Adaptación al nivel de zoom (como Airbnb)
  useEffect(() => {
    const updateMarkerSize = () => {
      const zoomLevel = map.getZoom();
      const markerElements = document.querySelectorAll('.cafe-marker');
      
      markerElements.forEach((element) => {
        const el = element as HTMLElement;
        if (zoomLevel < 13) {
          el.style.transform = 'scale(0.6)';
        } else if (zoomLevel < 15) {
          el.style.transform = 'scale(0.8)';
        } else {
          el.style.transform = 'scale(1)';
        }
      });
    };
    
    map.on('zoomend', updateMarkerSize);
    updateMarkerSize();
    
    return () => {
      map.off('zoomend', updateMarkerSize);
    };
  }, [map]);
  
  return (
    <Marker
      position={[cafe.latitude, cafe.longitude]}
      icon={customIcon}
      zIndexOffset={isActive ? 1000 : 0}
      eventHandlers={{
        click: onClick,
      }}
    />
  );
};

export default CafeMarker;