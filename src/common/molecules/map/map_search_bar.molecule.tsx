import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from '@/common/ui/icons';

interface MapSearchBarProps {
  searchInputValue: string;
  setSearchInputValue: (value: string) => void;
  searchFocused: boolean;
  setSearchFocused: (focused: boolean) => void;
  isTyping: boolean;
  isSearchProcessing: boolean;
  toggleFilterModal: () => void;
}

const MapSearchBar: React.FC<MapSearchBarProps> = ({
  searchInputValue,
  setSearchInputValue,
  searchFocused,
  setSearchFocused,
  isTyping,
  isSearchProcessing,
  toggleFilterModal
}) => {
  return (
    <motion.div
      className={`relative transition-all duration-300 ${
        searchFocused ? "w-full md:w-96" : "w-48 md:w-64"
      }`}
      layout
    >
      <div className="relative">
        <input
          type="text"
          value={searchInputValue}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
          }}
          placeholder={
            searchInputValue.length < 3 && searchInputValue.length > 0
              ? "Escribe al menos 3 caracteres..."
              : "Buscar cafeterías..."
          }
          className={`w-full h-11 pl-10 pr-12 rounded-full shadow-lg border-none outline-none transition-all duration-300 bg-white border-black/10 ${
            searchInputValue.length < 3 && searchInputValue.length > 0
              ? "focus:ring-2 focus:ring-amber-300"
              : "focus:ring-2 focus:ring-[#D4A76A]"
          }`}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
        />

        {isTyping || isSearchProcessing ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37]"
          >
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </motion.div>
        ) : (
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6F4E37]"
            size={18}
          />
        )}

        {searchInputValue.length > 0 && searchInputValue.length < 3 && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
            {searchInputValue.length}/3
          </div>
        )}
      </div>

      <motion.button
        className="absolute right-1.5 top-1/2 transform -translate-y-1/2 bg-[#6F4E37] text-white p-1.5 rounded-full hover:bg-[#5d4230] transition-colors duration-300"
        whileTap={{ scale: 0.9 }}
        onClick={toggleFilterModal}
      >
        <Filter size={16} />
      </motion.button>
    </motion.div>
  );
};

export default MapSearchBar;