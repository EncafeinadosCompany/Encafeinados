import { SetStateAction, useState } from "react";

interface RecentSearch {
  display_name: string;
  lat: string;
  lon: string;
}


const storedSearches: RecentSearch[] = JSON.parse(localStorage.getItem("recentMapSearches") || "[]");

// Función para guardar búsquedas recientes

const  [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
export const saveRecentSearch = (
    
  search: RecentSearch,
  setRecentSearches: React.Dispatch<SetStateAction<RecentSearch[]>>
) => {
  const updatedSearches = [
    search,
    ...storedSearches.filter((item) => item.display_name !== search.display_name),
  ].slice(0, 5);

  setRecentSearches(updatedSearches);
  localStorage.setItem("recentMapSearches", JSON.stringify(updatedSearches));
};