import { useMemo } from "react";
import L from "leaflet";
import { LatLngTuple, Cafe, MarkerPosition } from "@/common/types/map/mapTypes";
import { calculateDistance } from "@/common/utils/map/mapUtils";
import { Branch, BranchesResponse } from "@/api/types/branchesTypes";
import { Store, StoresResponse } from "@/api/types/storesTypes";

/**
 * Hook personalizado para manejar todos los estados derivados y cálculos relacionados con el mapa
 */
export const useMapData = (
  branchesData: BranchesResponse | undefined,
  filteredBranchesData: BranchesResponse | undefined,
  userLocation: LatLngTuple | null,
  activeCafe: number | null,
  storesData: StoresResponse | undefined
) => {
  const defaultCenter: LatLngTuple = [6.2476, -75.5658];

  const cafes: Cafe[] = useMemo(() => {
    if (!branchesData?.branches?.branches) return [];
    const stores = storesData?.stores;
    
    // Primero, obtener los IDs de tiendas aprobadas
    const approvedStoreIds = Array.isArray(stores) 
      ? stores.map((store: Store) => store.id) 
      : [];
    console.log("Approved store IDs:", approvedStoreIds);

    const branches =
      filteredBranchesData?.branches?.branches ||
      branchesData?.branches?.branches ||
      [];
  
    // Ahora filtrar las sucursales basándonos en si su tienda está aprobada
    const filteredBranches = branches.filter((branch) => {
      // Extraer el store_id del objeto store anidado
      const branchStoreId = branch.store?.store_id;
      
      if (!branchStoreId) {
        console.log(`Branch "${branch.name}" has no store_id`);
        return false;
      }
      
      const isApproved = approvedStoreIds.includes(branchStoreId);
      console.log(`Branch "${branch.name}" (Store ID: ${branchStoreId}) - Approved: ${isApproved}`);
      
      return isApproved;
    });

    // Y luego, al mapear los cafés, usar directamente la info de la tienda:
    const mappedCafes = filteredBranches
      .map((branch: Branch) => {
        if (!branch.latitude || !branch.longitude) return null;
        
        // Usar directamente el logo de la tienda de la respuesta API
        const storeLogo = branch.store?.store_logo || 
          "https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

        const baseData = {
          id: branch.id,
          name: branch.name,
          rating: parseFloat(branch.average_rating ?? "4.5") || 4.5,
          reviewCount: Math.floor(Math.random() * 100) + 50,
          openTime: "7:00 AM - 6:00 PM",
          image: storeLogo,
          tags: ["Coffee", "Specialty"],
          latitude: branch.latitude,
          longitude: branch.longitude,
          isOpen: branch.status,
          phone: branch.phone_number,
          address: branch.address,
          storeId: branch.store?.store_id ?? 0,
          storeName: branch.store?.store_name ?? "",
        };

        // Calcular distancia si la ubicación del usuario está disponible
        if (userLocation) {
          const distanceKm = calculateDistance(
            userLocation[0],
            userLocation[1],
            branch.latitude,
            branch.longitude
          );
          return {
            ...baseData,
            distance: `${distanceKm} km`,
            distanceValue: parseFloat(distanceKm),
          };
        }

        // Distancia predeterminada cuando la ubicación del usuario no está disponible
        return {
          ...baseData,
          distance: "Unknown distance",
          distanceValue: 999, // Valor alto para ordenar al final
        };
      })
      .filter(Boolean) as Cafe[];

    return mappedCafes;
  }, [branchesData, filteredBranchesData, userLocation, storesData]);

  // Crear posiciones de marcadores a partir de datos de café
  const cafePositions: MarkerPosition[] = useMemo(
    () =>
      cafes.map((cafe) => ({
        id: cafe.id,
        lat: cafe.latitude,
        lng: cafe.longitude,
      })),
    [cafes]
  );

  // Ya no necesitamos filtrar por searchTerm aquí
  const filteredCafes = cafes;

  // Ordenar cafés por distancia
  const sortedCafes = useMemo(() => cafes, [cafes]);

  // Obtener datos para el café actualmente activo
  const activeCafeData = useMemo(
    () => (activeCafe ? cafes.find((cafe) => cafe.id === activeCafe) : null),
    [activeCafe, cafes]
  );

  // Extraer tiendas disponibles para el filtro
  const availableStores = useMemo(() => {
    if (!storesData?.stores?.stores) return [];

    return storesData.stores.stores.map((store: Store) => ({
      id: store.id,
      name: store.name,
    }));
  }, [storesData]);

  return {
    defaultCenter,
    cafes,
    cafePositions,
    filteredCafes,
    sortedCafes,
    activeCafeData,
    availableStores,
  };
};
