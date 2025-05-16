import { useMemo } from "react";
import { LatLngTuple, Cafe, MarkerPosition } from "@/api/types/map/map_search.types";
import { calculateDistance } from "@/common/utils/map/map_utils";
import { Branch, BranchesResponse} from "@/api/types/branches/branches.types";
import { Store, StoresResponse } from "@/api/types/stores/stores.type";

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
       
        const storeLogo = branch.store?.store_logo ||
          "https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";


        const baseData = {
          id: branch.id,
          name: branch.name,
          rating: branch.average_rating ? parseFloat(branch.average_rating) : null,
          openTime: "7:00 AM - 6:00 PM",
          image: storeLogo,
          tags: ["Coffee", "Specialty"], // Mantener como fallback
          latitude: branch.latitude,
          longitude: branch.longitude,
          isOpen: branch.is_open !== undefined ? branch.is_open : true,
          status: branch.status,
          phone: branch.phone_number,
          address: branch.address,
          storeId: branch.store?.store_id ?? 0,
          storeName: branch.store?.store_name ?? "",
          socialNetworks: branch.social_branches || [],
        };

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
        
        return {
          ...baseData,
          distance: "Unknown distance",
          distanceValue: 999, 
        };
      })
      .filter(Boolean) as Cafe[];
  }, [filteredBranches, userLocation]);

  const cafePositions: MarkerPosition[] = useMemo(
    () => cafes.map((cafe) => ({
      id: cafe.id,
      lat: cafe.latitude,
      lng: cafe.longitude,
    })),
    [cafes]
  );

  const sortedCafes = useMemo(() => {
    if (!userLocation) return cafes;
    return [...cafes].sort((a, b) =>
      (a.distanceValue || 999) - (b.distanceValue || 999)
    );
  }, [cafes, userLocation]);

  const activeCafeData = useMemo(
    () => activeCafe ? cafes.find((cafe) => cafe.id === activeCafe) : null,
    [activeCafe, cafes]
  );

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
    filteredCafes: cafes, 
    sortedCafes,
    activeCafeData,
    availableStores,
  };
};



