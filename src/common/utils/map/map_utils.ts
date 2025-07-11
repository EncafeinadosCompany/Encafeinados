import { LatLngTuple } from '@/api/types/map/map_search.types';

/**
 * Calculates the distance between two geographic points using the Haversine formula
 * @param lat1 Latitude of the first point
 * @param lon1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lon2 Longitude of the second point
 * @returns Distance in kilometers (as a string with 1 decimal place)
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
  const R: number = 6371; // Earth's radius in km
  const dLat: number = (lat2 - lat1) * Math.PI / 180;
  const dLon: number = (lon2 - lon1) * Math.PI / 180;
  const a: number = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance: number = R * c;
  
  return distance.toFixed(1);
};

/**
 * Get saved cafe IDs from localStorage
 * @returns Array of favorite cafe IDs
 */
export const getFavoritesFromStorage = (): number[] => {
  const favorites = localStorage.getItem('favoriteCafes');
  return favorites ? JSON.parse(favorites) : [];
};

/**
 * Creates a simulated route between two points
 * @param from Starting coordinates
 * @param to Ending coordinates
 * @returns Array of route coordinates
 */
export const simulateRoute = (from: LatLngTuple, to: LatLngTuple): LatLngTuple[] => {
  const numPoints = 5;
  const points: LatLngTuple[] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const fraction = i / numPoints;
    const lat = from[0] + (to[0] - from[0]) * fraction;
    const lng = from[1] + (to[1] - from[1]) * fraction;
    
    // Add some variation for a more natural route
    const jitter = i > 0 && i < numPoints ? (Math.random() - 0.5) * 0.005 : 0;
    
    points.push([lat + jitter, lng + jitter]);
  }
  
  return points;
};

/**
 * Format a time string to a more readable format
 * @param time Time string in format "HH:MM" or "HH:MM:SS"
 * @returns Formatted time string in format "HH:MM AM/PM"
 */
export const formatTime = (time: string): string => {
  const timeParts = time.split(':');
  if (timeParts.length < 2) return time;
  
  let hours = parseInt(timeParts[0]);
  const minutes = timeParts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  return `${hours}:${minutes} ${ampm}`;
};

/**
 * Formats the opening hours of a cafe
 * @param openTime Opening time (e.g., "07:00")
 * @param closeTime Closing time (e.g., "20:00")
 * @returns Formatted opening hours (e.g., "7:00 AM - 8:00 PM")
 */
export const formatOpeningHours = (openTime: string, closeTime: string): string => {
  return `${formatTime(openTime)} - ${formatTime(closeTime)}`;
};

/**
 * Check if a cafe is currently open based on its opening hours
 * @param openTime Opening time (e.g., "07:00")
 * @param closeTime Closing time (e.g., "20:00")
 * @returns Boolean indicating if the cafe is currently open
 */
export const isCafeOpen = (openTime: string, closeTime: string): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const [openHour, openMinute] = openTime.split(':').map(Number);
  const [closeHour, closeMinute] = closeTime.split(':').map(Number);
  
  // Convert all to minutes for easier comparison
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const openTimeInMinutes = openHour * 60 + openMinute;
  const closeTimeInMinutes = closeHour * 60 + closeMinute;
  
  // Handle regular case (e.g., 7:00 AM - 8:00 PM)
  if (closeTimeInMinutes > openTimeInMinutes) {
    return currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes;
  }
  // Handle overnight case (e.g., 8:00 PM - 2:00 AM)
  else {
    return currentTimeInMinutes >= openTimeInMinutes || currentTimeInMinutes <= closeTimeInMinutes;
  }
};

/**
 * Gets a rating display text based on a numerical rating
 * @param rating Numerical rating (e.g., 4.5)
 * @returns String describing the rating (e.g., "Excelente")
 */
export const getRatingText = (rating: number | null | undefined): string => {
  // Handle invalid or missing ratings
  if (rating === null || rating === undefined || isNaN(rating)) {
    return "Sin clasificación";
  }
  
  if (rating >= 4.5) return "Excelente";
  if (rating >= 4.0) return "Muy bueno";
  if (rating >= 3.5) return "Bueno";
  if (rating >= 3.0) return "Regular";
  return "Aceptable";
};

/**
 * Sort cafes by a specific criterion
 * @param cafes Array of cafe objects
 * @param criterion Sorting criterion ('distance', 'rating', or 'name')
 * @returns Sorted array of cafes
 */
export const sortCafes = (cafes: any[], criterion: 'distance' | 'rating' | 'name'): any[] => {
  const sortedCafes = [...cafes];
  
  switch (criterion) {
    case 'distance':
      return sortedCafes.sort((a, b) => {
        const aValue = a.distanceValue || 999;
        const bValue = b.distanceValue || 999;
        return aValue - bValue;
      });
    case 'rating':
      return sortedCafes.sort((a, b) => {
        const aRating = a.rating || 0;
        const bRating = b.rating || 0;
        return bRating - aRating;
      });
    case 'name':
      return sortedCafes.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    default:
      return sortedCafes;
  }
};

/**
 * Filter cafes by tags
 * @param cafes Array of cafe objects
 * @param tags Array of tags to filter by
 * @returns Filtered array of cafes that have at least one of the specified tags
 */
export const filterCafesByTags = (cafes: any[], tags: string[]): any[] => {
  if (!tags.length) return cafes;
  
  return cafes.filter(cafe => 
    cafe.tags.some((tag: string) => tags.includes(tag))
  );
};