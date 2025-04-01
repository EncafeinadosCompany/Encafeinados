import { useState, useCallback, useEffect } from 'react';
import { getFavoritesFromStorage } from '@/common/utils/map/mapUtils';

/**
 * Hook para manejar los cafés favoritos
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    setFavorites(getFavoritesFromStorage());
  }, []);

  const toggleFavorite = useCallback((cafeId: number): void => {
    const newFavorites: number[] = favorites.includes(cafeId)
      ? favorites.filter((id: number) => id !== cafeId)
      : [...favorites, cafeId];

    setFavorites(newFavorites);
    localStorage.setItem('favoriteCafes', JSON.stringify(newFavorites));
  }, [favorites]);

  return { favorites, toggleFavorite };
};