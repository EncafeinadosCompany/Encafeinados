import React, { useState, useMemo, useEffect } from 'react';
import { Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Cafe } from '@/api/types/map/map_search.types';

interface CafeMarkerProps {
  cafe: Cafe;
  isActive: boolean;
  onClick: () => void;
  hasNearbyCafes?: boolean;
  proximityRadius?: number;
}

const CafeMarker: React.FC<CafeMarkerProps> = ({ 
  cafe, 
  isActive, 
  onClick, 
  hasNearbyCafes = false,
  proximityRadius = 200
}) => {
  const map = useMap();
  const [isHovered, setIsHovered] = useState(false);
  
  const getMarkerSize = () => {
    const zoom = map.getZoom();
    if (zoom < 13) return isActive ? 55 : 50;
    if (zoom < 15) return isActive ? 62 : 56;
    return isActive ? 70 : 65;
  };
  
  const customIcon = useMemo(() => {
    const size = getMarkerSize();
    
    return L.divIcon({
      className: 'custom-cafe-marker',
      html: `
        <div class="${cafe.isOpen ? 'cafe-bounce-wrapper' : ''}">
          <div 
            class="cafe-marker ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''} ${hasNearbyCafes ? 'has-nearby' : ''} ${!cafe.isOpen ? 'closed' : ''}" 
            style="width:${size}px;height:${size}px;"
          >
            ${!cafe.isOpen ? `
              <div class="marker-content">
                <img 
                  src="${cafe.image}" 
                  alt="${cafe.name}" 
                  onerror="this.onerror=null;this.src='https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';" 
                />
                <div class="closed-dot"></div>
              </div>
            ` : `
              <div class="marker-content">
                <img 
                  src="${cafe.image}" 
                  alt="${cafe.name}" 
                  onerror="this.onerror=null;this.src='https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';" 
                />
              </div>
            `}
            
            ${isActive || isHovered ? `
          
            ` : ''}
              
              ${cafe.isOpen ? `
                <!-- Efecto de humo para cafeterías abiertas -->
                <div class="coffee-steam cafe-steam" style="position: absolute; top: -8px; left: 50%; transform: translateX(-50%); width: 24px; height: 20px; z-index: 10;">
                  <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                    <path d="M4 16C2 13 3 10 5 8" stroke="white" stroke-width="2" opacity="0.7" stroke-linecap="round" class="steam-path steam-1"/>
                    <path d="M12 18C9 14 10 10 12 7" stroke="white" stroke-width="2" opacity="0.7" stroke-linecap="round" class="steam-path steam-2"/>
                    <path d="M20 16C22 13 21 10 19 8" stroke="white" stroke-width="2" opacity="0.7" stroke-linecap="round" class="steam-path steam-3"/>
                  </svg>
                </div>
              ` : ''}
            </div>
            ${isActive ? '<div class="pulse-ring"></div>' : ''}
          </div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size],
    });
  }, [cafe.image, cafe.name, cafe.rating, cafe.isOpen, isActive, isHovered, hasNearbyCafes, map.getZoom()]);
  
  useEffect(() => {
    const handleZoom = () => {
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