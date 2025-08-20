import { useState, useCallback, useEffect } from 'react';
import { getFavoritesFromStorage } from '@/common/utils/map/map_utils';


export const useFavorites = () => {
  const [favorites, setFavorites] = useState<(string | number)[]>([]);

  useEffect(() => {
    setFavorites(getFavoritesFromStorage());
  }, []);

  const toggleFavorite = useCallback((cafeId: string | number): void => {
    setFavorites(currentFavorites => {
      const newFavorites: (string | number)[] = currentFavorites.includes(cafeId)
        ? currentFavorites.filter((id: string | number) => id !== cafeId)
        : [...currentFavorites, cafeId];

      localStorage.setItem('favoriteCafes', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []); 

  return { favorites, toggleFavorite };
};