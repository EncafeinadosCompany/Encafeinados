import { useEffect } from "react";
import { useMap } from "react-leaflet";


// Component to recenter map when position changes
export const MapController = ({ position }: { position: [number, number] | null }) => {
    const map = useMap();
    
    useEffect(() => {
      if (position) {
        map.flyTo(position, 17, { // Increased zoom level for better precision
          animate: true,
          duration: 1.5
        });
      }
    }, [position, map]);
    
    return null;
  };