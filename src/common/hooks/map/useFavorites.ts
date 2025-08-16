import { useState, useCallback, useEffect } from 'react';
import { getFavoritesFromStorage } from '@/common/utils/map/map_utils';


export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    setFavorites(getFavoritesFromStorage());
  }, []);

  const toggleFavorite = useCallback((cafeId: number): void => {
    setFavorites(currentFavorites => {
      const newFavorites: number[] = currentFavorites.includes(cafeId)
        ? currentFavorites.filter((id: number) => id !== cafeId)
        : [...currentFavorites, cafeId];

      localStorage.setItem('favoriteCafes', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []); 

  return { favorites, toggleFavorite };
};