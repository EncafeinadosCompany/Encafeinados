import React from 'react';
import { Polyline } from 'react-leaflet';

interface DirectRouteLineProps {
  from: [number, number];
  to: [number, number];
  routeCoordinates?: [number, number][];
  color?: string;
  weight?: number;
  opacity?: number;
  transportMode?: 'walking' | 'cycling' | 'driving';
}

const DirectRouteLine: React.FC<DirectRouteLineProps> = ({ 
  from, 
  to, 
  routeCoordinates, 
  color = '#6F4E37', 
  weight = 4, 
  opacity = 0.7,
  transportMode = 'walking'
}) => {
  // Personalización según el modo de transporte
  const getLineStyle = () => {
    switch(transportMode) {
      case 'walking':
        return { dashArray: '1,10', color: '#4285F4', weight: weight };
      case 'cycling':
        return { dashArray: '10,15', color: '#0F9D58', weight: weight };
      case 'driving':
        return { dashArray: undefined, color: color, weight: weight };
      default:
        return { dashArray: undefined, color: color, weight: weight };
    }
  };

  const lineStyle = getLineStyle();
  
  if (routeCoordinates && routeCoordinates.length > 1) {
    return (
      <>
        <Polyline 
          positions={routeCoordinates}
          color={lineStyle.color}
          weight={lineStyle.weight}
          opacity={opacity}
          dashArray={lineStyle.dashArray}
        />
        
        {routeCoordinates.length > 2 && (
          <>
            <Polyline 
              positions={[routeCoordinates[0], routeCoordinates[1]]}
              color={lineStyle.color}
              weight={lineStyle.weight + 2}
              opacity={opacity + 0.2}
            />
            <Polyline 
              positions={[routeCoordinates[routeCoordinates.length-2], routeCoordinates[routeCoordinates.length-1]]}
              color={lineStyle.color}
              weight={lineStyle.weight + 2}
              opacity={opacity + 0.2}
            />
          </>
        )}
      </>
    );
  }
  
  return (
    <Polyline 
      positions={[from, to]}
      color={color}
      weight={weight}
      opacity={opacity * 0.6}
      dashArray="5,10"
    />
  );
};

export default DirectRouteLine;