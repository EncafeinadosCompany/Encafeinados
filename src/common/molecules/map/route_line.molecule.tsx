import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';
import { RouteLineProps, LatLngTuple } from '@/api/types/map/map_search.types';
import { simulateRoute } from '@/common/utils/map/map_utils';

/**
 * Component to draw a route line between two points
 */
const RouteLine: React.FC<RouteLineProps> = ({ from, to }) => {
  const [routePoints, setRoutePoints] = useState<LatLngTuple[]>([]);
  
  useEffect(() => {
    if (!from || !to) return;
    setRoutePoints(simulateRoute(from, to));
  }, [from, to]);
  
  if (!routePoints.length) return null;
  
  return (
    <Polyline 
      positions={routePoints}
      color="#6F4E37"
      weight={4}
      opacity={0.7}
      dashArray="10, 10"
    />
  );
};

export default RouteLine;