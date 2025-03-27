import { useMemo } from 'react';
import L from 'leaflet';
import { LatLngTuple, Cafe, MarkerPosition } from '@/common/types/map/mapTypes';
import { calculateDistance } from '@/common/utils/map/mapUtils';
import { Branch, BranchesResponse } from '@/api/types/branchesTypes';
import { Store, StoresResponse } from '@/api/types/storesTypes';

/**
 * Hook personalizado para manejar todos los estados derivados y cálculos relacionados con el mapa
 */
export const useMapData = (
  branchesData: BranchesResponse | undefined,
  filteredBranchesData: BranchesResponse | undefined,
  userLocation: LatLngTuple | null,
  activeCafe: number | null,
  searchTerm: string,
  storesData: StoresResponse | undefined
) => {
  // Centro predeterminado del mapa (Medellín)
  const defaultCenter: LatLngTuple = [6.2476, -75.5658];

  // Transformar branches de la API a nuestra estructura de datos de café
  const cafes: Cafe[] = useMemo(() => {
    if (!branchesData?.branches?.branches) return [];

    // Determinar qué datos de branches usar (filtrados o todos)
    const branches = filteredBranchesData?.branches?.branches || branchesData.branches.branches || [];
    
    return branches.map((branch: Branch) => {
      // Omitir branches con datos de ubicación faltantes
      if (!branch.latitude || !branch.longitude) return null;
      
      // Buscar el logo de la tienda correspondiente
      const storeLogo = storesData?.stores?.store?.find(
        store => store.name === branch.store_name
      )?.logo || "https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
      
      const baseData = {
        id: branch.id,
        name: branch.name,
        rating: parseFloat(branch.average_rating) || 4.5, // Convertir string a número
        reviewCount: Math.floor(Math.random() * 100) + 50, // Recuento de reseñas aleatorio (50-150)
        openTime: "7:00 AM - 8:00 PM", // Horario de apertura predeterminado
        image: storeLogo,
        tags: ["Coffee", "Specialty"], // Etiquetas predeterminadas
        latitude: branch.latitude,
        longitude: branch.longitude,
        isOpen: branch.status,
        phone: branch.phone_number,
        address: branch.address,
        storeId: 1, // Asumiendo que todas las branches pertenecen a la tienda con ID 1
        storeName: branch.store_name,
      };
      
      // Calcular distancia si la ubicación del usuario está disponible
      if (userLocation) {
        const distanceKm = calculateDistance(
          userLocation[0], userLocation[1], 
          branch.latitude, branch.longitude
        );
        return {
          ...baseData,
          distance: `${distanceKm} km`,
          distanceValue: parseFloat(distanceKm)
        };
      }
      
      // Distancia predeterminada cuando la ubicación del usuario no está disponible
      return {
        ...baseData,
        distance: "Unknown distance",
        distanceValue: 999 // Valor alto para ordenar al final
      };
    }).filter(Boolean) as Cafe[]; // Filtrar valores nulos y hacer cast de tipo
  }, [branchesData, filteredBranchesData, userLocation, storesData]);

  // Crear posiciones de marcadores a partir de datos de café
  const cafePositions: MarkerPosition[] = useMemo(() => 
    cafes.map(cafe => ({
      id: cafe.id,
      lat: cafe.latitude,
      lng: cafe.longitude
    })), 
  [cafes]);

  // Filtrar cafés por término de búsqueda
  const filteredCafes = useMemo(() => {
    if (!searchTerm) return cafes;
    
    const lowerSearch = searchTerm.toLowerCase();
    return cafes.filter(cafe => 
      cafe.name.toLowerCase().includes(lowerSearch) || 
      cafe.address.toLowerCase().includes(lowerSearch) ||
      cafe.storeName.toLowerCase().includes(lowerSearch)
    );
  }, [cafes, searchTerm]);
  
  // Ordenar cafés por distancia
  const sortedCafes = useMemo(() => 
    [...filteredCafes].sort((a, b) => a.distanceValue - b.distanceValue), 
  [filteredCafes]);
  
  // Obtener datos para el café actualmente activo
  const activeCafeData = useMemo(() => 
    activeCafe ? cafes.find(cafe => cafe.id === activeCafe) : null,
  [activeCafe, cafes]);
  
  // Extraer tiendas disponibles para el filtro
  const availableStores = useMemo(() => {
    if (!storesData?.stores?.store) return [];
    
    return storesData.stores.store.map((store: Store) => ({
      id: store.id,
      name: store.name
    }));
  }, [storesData]);
  
  // Icono de marcador personalizado
  const customIcon = useMemo(() => new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    shadowSize: [41, 41]
  }), []);

  return {
    defaultCenter,
    cafes,
    cafePositions,
    filteredCafes,
    sortedCafes,
    activeCafeData,
    availableStores,
    customIcon
  };
};