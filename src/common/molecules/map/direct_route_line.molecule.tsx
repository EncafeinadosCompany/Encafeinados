import React, { useEffect, useState } from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import "@/common/styles/mapMarkers.css";

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
  weight = 5, 
  opacity = 0.9, 
  transportMode = 'walking'
}) => {
  const [animated, setAnimated] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, [routeCoordinates]);

  const getLineStyle = () => {
    switch(transportMode) {
      case 'walking':
        return { 
          dashArray: '5, 10', 
          color: '#007BFF', 
          weight: weight,
          className: animated ? 'pulse-walking' : ''
        };
      case 'cycling':
        return { 
          dashArray: '10, 10', 
          color: '#00B74A', 
          weight: weight,
          className: animated ? 'pulse-cycling' : ''
        };
      case 'driving':
        return { 
          dashArray: undefined, 
          color: '#E53935', 
          weight: weight,
          className: animated ? 'pulse-driving' : ''
        };
      default:
        return { 
          dashArray: undefined, 
          color: color, 
          weight: weight,
          className: animated ? 'pulse-default' : ''
        };
    }
  };

  const lineStyle = getLineStyle();
  
  const createPathOptions = (): L.PathOptions => {
    return {
      color: lineStyle.color,
      weight: lineStyle.weight,
      opacity: opacity,
      dashArray: lineStyle.dashArray,
      className: lineStyle.className,
      lineCap: 'round' as L.LineCapShape,
      lineJoin: 'round' as L.LineJoinShape,
    };
  };

  const pathOptions = createPathOptions();
  
  if (routeCoordinates && routeCoordinates.length > 1) {
    return (
      <>
        <Polyline 
          positions={routeCoordinates}
          pathOptions={{
            color: '#FFFFFF',
            weight: lineStyle.weight + 4,
            opacity: 0.5,
            lineCap: 'round',
            lineJoin: 'round'
          }}
        />
        
        <Polyline 
          positions={routeCoordinates}
          pathOptions={pathOptions}
        >
          <Tooltip direction="top" permanent={false} sticky>
            {transportMode === 'walking' ? 'Caminando' : 
             transportMode === 'cycling' ? 'En bicicleta' : 'En automóvil'}
          </Tooltip>
        </Polyline>
        
        {routeCoordinates.length > 2 && (
          <>
            <Polyline 
              positions={[routeCoordinates[0], routeCoordinates[1]]}
              pathOptions={{
                color: lineStyle.color,
                weight: lineStyle.weight + 3,
                opacity: 1.0,
                dashArray: undefined
              }}
            />
            <Polyline 
              positions={[routeCoordinates[routeCoordinates.length-2], routeCoordinates[routeCoordinates.length-1]]}
              pathOptions={{
                color: lineStyle.color,
                weight: lineStyle.weight + 3,
                opacity: 1.0,
                dashArray: undefined
              }}
            />
          </>
        )}
      </>
    );
  }
  
  return (
    <>
      <Polyline 
        positions={[from, to]}
        pathOptions={{
          color: '#FFFFFF',
          weight: weight + 4,
          opacity: 0.5,
          dashArray: undefined
        }}
      />
      {/* Línea principal */}
      <Polyline 
        positions={[from, to]}
        pathOptions={{
          color: color,
          weight: weight,
          opacity: opacity,
          dashArray: '5,10'
        }}
      />
    </>
  );
};

export default DirectRouteLine;