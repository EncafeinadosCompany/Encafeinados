import { useMemo } from "react";
import { LatLngTuple, Cafe, MarkerPosition } from "@/common/types/map/mapTypes";
import { calculateDistance } from "@/common/utils/map/mapUtils";
import { Branch, BranchesResponse, SocialBranch } from "@/api/types/branchesTypes";
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

  const branches = useMemo(() => 
    filteredBranchesData?.branches?.branches ||
    branchesData?.branches?.branches ||
    [],
  [filteredBranchesData?.branches?.branches, branchesData?.branches?.branches]);
  
  const filteredBranches = useMemo(() => 
    branches.filter((branch) => branch.status === "APPROVED"),
  [branches]);

  const cafes: Cafe[] = useMemo(() => {
    if (!branchesData?.branches?.branches) return [];
    
    return filteredBranches
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
          isOpen: true, // Ya está filtrado por APPROVED
          status: branch.status,
          phone: branch.phone_number,
          address: branch.address,
          storeId: branch.store?.store_id ?? 0,
          storeName: branch.store?.store_name ?? "",
          socialNetworks: branch.social_branches || []
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
  }, [filteredBranches, userLocation]);

  // 4. Memoizar las posiciones de los marcadores
  const cafePositions: MarkerPosition[] = useMemo(
    () => cafes.map((cafe) => ({
      id: cafe.id,
      lat: cafe.latitude,
      lng: cafe.longitude,
    })),
    [cafes]
  );

  // 5. Ahora sí ordenamos correctamente por distancia
  const sortedCafes = useMemo(() => {
    if (!userLocation) return cafes;
    return [...cafes].sort((a, b) => 
      (a.distanceValue || 999) - (b.distanceValue || 999)
    );
  }, [cafes, userLocation]);

  // 6. Memoizar activeCafeData
  const activeCafeData = useMemo(
    () => activeCafe ? cafes.find((cafe) => cafe.id === activeCafe) : null,
    [activeCafe, cafes]
  );

  // 7. Memoizar las tiendas disponibles para el filtro
  const availableStores = useMemo(() => {
    if (!storesData?.stores?.stores) return [];

    return storesData.stores.stores.map((store: Store) => ({
      id: store.id,
      name: store.name,
    }));
  }, [storesData?.stores?.stores]);

  return {
    defaultCenter,
    cafes,
    cafePositions,
    filteredCafes: cafes, // Para mantener la compatibilidad con el API existente
    sortedCafes,
    activeCafeData,
    availableStores,
  };
};
