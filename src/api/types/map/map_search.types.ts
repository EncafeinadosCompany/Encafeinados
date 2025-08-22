import { SocialBranch } from '@/api/types/branches/branches.types';
import { BranchAttribute } from '@/api/types/branches/branch_attributes.types';
/**
 * Geographic coordinates as [latitude, longitude]
 */
export type LatLngTuple = [number, number];

/**
 * Marker position with ID
 */
export interface MarkerPosition {
  id: string | number;
  lat: number;
  lng: number;
}

/**
 * Props for MapFocus component
 */
export interface MapFocusProps {
  cafeId: string | number | null;
  positions: Array<{ id: string | number, lat: number, lng: number }>;
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
  id: string | number;
  name: string;
  rating: number;
  reviewCount: number;
  openTime: string;
  image: string;
  tags: string[];
  latitude: number;
  longitude: number;
  isOpen: boolean;
  status: string;
  phone?: string;
  address?: string;
  distance?: string;
  distanceValue?: number;
  storeId: string | number;
  storeName: string;
  socialNetworks?: SocialBranch[]; 
  attributes?: BranchAttribute[]; 
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