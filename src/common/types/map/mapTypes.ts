/**
 * Geographic coordinates as [latitude, longitude]
 */
export type LatLngTuple = [number, number];

/**
 * Marker position with ID
 */
export interface MarkerPosition {
  id: number;
  lat: number;
  lng: number;
}

/**
 * Props for MapFocus component
 */
export interface MapFocusProps {
  cafeId: number | null;
  positions: Array<{ id: number, lat: number, lng: number }>;
  userLocation: LatLngTuple | null;
}

/**
 * Props for UserLocationMarker component
 */
export interface UserLocationMarkerProps {
  position: LatLngTuple | null;
  pulsing?: boolean;
}

/**
 * Props for RouteLine component
 */
export interface RouteLineProps {
  from: LatLngTuple | null;
  to: LatLngTuple | null;
}

/**
 * Cafe data structure
 */
export interface Cafe {
  id: number;
  name: string;
  rating: number;
  reviewCount: number;
  openTime: string;
  image: string;
  tags: string[];
  latitude: number;
  longitude: number;
  isOpen: boolean;
  phone: string;
  address: string;
  distance: string;
  distanceValue: number;
  storeId: number;
  storeName: string;
}

/**
 * Animation variants for card animations
 */
export interface CardVariants {
  hidden: {
    opacity: number;
    y: number;
  };
  visible: (i: number) => {
    opacity: number;
    y: number;
    transition: {
      delay: number;
      duration: number;
    };
  };
  [key: string]: any;
}