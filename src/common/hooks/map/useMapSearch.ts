import { useState, useEffect, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useMapSearch = (
  mapInstance: L.Map | null,
  sortedCafes: any[],
  userLocation: [number, number] | null,
  setActiveCafe: (id: number | null) => void,
  setShowSidebar: (show: boolean) => void,
  setViewMode: (mode: "map" | "list") => void,
  setApiSearchTerm: (term: string) => void
) => {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSearchProcessing, setIsSearchProcessing] = useState(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const lastToastRef = useRef("");
  const [searchTerm, setSearchTermLocal] = useState<string>("");
  const lastProcessedSearchRef = useRef<string>("");
  const currentSearchRef = useRef<string>("");
  
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInputValue !== debouncedSearchValue) {
        setDebouncedSearchValue(searchInputValue);
      }
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInputValue, debouncedSearchValue]);
  
  useEffect(() => {
    if (!debouncedSearchValue || debouncedSearchValue.length < 3) {
      setIsTyping(false);
      if (debouncedSearchValue === "") {
        setSearchTermLocal("");
        setApiSearchTerm("");
        lastProcessedSearchRef.current = "";
        currentSearchRef.current = "";
      }
      return;
    }

    setIsSearchProcessing(true);
    setIsTyping(false);

    const currentSearch = debouncedSearchValue.trim();
    currentSearchRef.current = currentSearch;

    const filterTimer = setTimeout(() => {
      if (currentSearchRef.current !== currentSearch) {
        setIsSearchProcessing(false);
        return;
      }

      setSearchTermLocal(currentSearch);
      setApiSearchTerm(currentSearch);
    }, 200);

    return () => clearTimeout(filterTimer);
  }, [debouncedSearchValue, setApiSearchTerm]);

  useEffect(() => {
    const currentSearch = currentSearchRef.current;
    
    if (!currentSearch || currentSearch.length < 3 || lastProcessedSearchRef.current === currentSearch) {
      return;
    }

    if (searchTerm !== currentSearch) {
      return;
    }

    const resultTimer = setTimeout(() => {
      if (currentSearchRef.current !== currentSearch || lastProcessedSearchRef.current === currentSearch) {
        setIsSearchProcessing(false);
        return;
      }

      lastProcessedSearchRef.current = currentSearch;
      
      const searchHash = `${currentSearch}-${sortedCafes.length}`;
      const shouldShowToast = lastToastRef.current !== searchHash;

      if (sortedCafes.length > 0) {
        if (userLocation) {
          const closestCafe = sortedCafes[0];
          if (shouldShowToast) {
            setActiveCafe(closestCafe.id);

            if (mapInstance) {
              mapInstance.flyTo(
                [closestCafe.latitude, closestCafe.longitude],
                16,
                { duration: 1.5, animate: true }
              );
            }
          }
        } else {
          const firstResult = sortedCafes[0];
          if (shouldShowToast) {
            setActiveCafe(firstResult.id);

            if (mapInstance) {
              mapInstance.flyTo(
                [firstResult.latitude, firstResult.longitude],
                16,
                { duration: 1.5, animate: true }
              );
            }
          }
        }

        if (window.innerWidth < 768) {
          setShowSidebar(false);
          setViewMode("map");
        }

        if (shouldShowToast) {
          lastToastRef.current = searchHash;

          if (sortedCafes.length === 1) {
            toast.success(`¡Encontrada "${sortedCafes[0].name}"!`, {
              icon: "🎯",
              duration: 2000,
              id: searchHash,
            });
          } else {
            toast.success(
              `Mostrando el más cercano de ${sortedCafes.length} resultados`,
              {
                icon: "📍",
                duration: 2000,
                id: searchHash,
              }
            );
          }
        }
      } else if (shouldShowToast) {
        lastToastRef.current = searchHash;
        toast.error("No se encontraron cafeterías con ese nombre", {
          duration: 2000,
          id: searchHash,
        });
      }

      setIsSearchProcessing(false);
    }, 400);

    return () => clearTimeout(resultTimer);
  }, [sortedCafes, userLocation, mapInstance, searchTerm, setActiveCafe, setShowSidebar, setViewMode]);
  
  const handleSearchChange = useCallback((value: string) => {
    setSearchInputValue(value);
    setIsTyping(true);
    
    if (value !== searchInputValue) {
      lastProcessedSearchRef.current = "";
      currentSearchRef.current = value.trim();
    }
  }, [searchInputValue]);
  
  const clearSearch = useCallback(() => {
    setSearchInputValue("");
    setDebouncedSearchValue("");
    setSearchTermLocal("");
    setApiSearchTerm("");
    setIsSearchProcessing(false);
    setIsTyping(false);
    lastToastRef.current = "";
    lastProcessedSearchRef.current = "";
    currentSearchRef.current = "";
  }, [setApiSearchTerm]);
  
  return {
    searchInputValue,
    setSearchInputValue,
    isTyping,
    setIsTyping,
    isSearchProcessing,
    searchFocused,
    setSearchFocused,
    searchTerm,
    handleSearchChange,
    clearSearch
  };
};