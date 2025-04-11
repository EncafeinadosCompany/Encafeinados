import React from 'react';
import { Polyline } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface DirectRouteLineProps {
  from: LatLngTuple;
  to: LatLngTuple;
  color?: string;
  weight?: number;
  opacity?: number;
}

const DirectRouteLine: React.FC<DirectRouteLineProps> = ({
  from,
  to,
  color = '#6F4E37',
  weight = 4,
  opacity = 0.7
}) => {
  return (
    <Polyline 
      positions={[from, to]}
      pathOptions={{
        color,
        weight,
        opacity,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '5, 10' // Línea punteada para indicar que es una ruta estimada
      }}
    />
  );
};

export default DirectRouteLine;