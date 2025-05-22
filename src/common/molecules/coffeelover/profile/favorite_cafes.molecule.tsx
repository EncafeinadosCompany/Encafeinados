import React, { useRef, useState } from 'react';
import { Coffee, Star, MapPin, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWindowSize } from '@/common/hooks/useWindowSize';
import SafeNumericDisplay from '@/common/atoms/SafeNumericDisplay';

interface FavoriteCafesProps {
  heightAdjustment?: boolean;
}

// Datos de ejemplo para cafeterías favoritas
const favoriteCafes = [
  {
    id: 1,
    name: "Café Aromático",
    address: "Calle 123 #45-67",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    isFavorite: true
  },
  {
    id: 2,
    name: "El Buen Café",
    address: "Carrera 78 #90-12",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    isFavorite: true
  },
  {
    id: 3,
    name: "Café Express",
    address: "Avenida Principal #34",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    isFavorite: true
  },
  {
    id: 4,
    name: "Café del Parque",
    address: "Parque Central #10",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    isFavorite: true
  },
  {
    id: 5,
    name: "Café Gourmet",
    address: "Calle del Gourmet #5",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    isFavorite: true
  },
  {
    id: 6,
    name: "Café de la Calle",
    address: "Calle 45 #67-89",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    isFavorite: false
  }
];

export const FavoriteCafes: React.FC<FavoriteCafesProps> = ({ heightAdjustment = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { height } = useWindowSize();
  
  const cardHeight = heightAdjustment ? 
    (height > 900 ? "h-56" : height > 800 ? "h-48" : "h-40") : 
    "h-40";
  
  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
  };

  const showLeftArrow = scrollPosition > 10;
  const showRightArrow = scrollContainerRef.current
    ? scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth &&
      scrollPosition < scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 10
    : true;

  return (
    <div className={`px-4 ${heightAdjustment ? 'mt-4' : 'mt-2'}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-[#5F4B32] flex items-center">
          <Coffee className="h-4 w-4 mr-2 text-[#DB8935]" />
          Favoritos
        </h2>
        <div className="flex gap-1">
          {showLeftArrow && (
            <button 
              onClick={scrollPrev} 
              className="w-6 h-6 rounded-full bg-[#DB8935] flex items-center justify-center shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
          )}
          {showRightArrow && (
            <button 
              onClick={scrollNext} 
              className="w-6 h-6 rounded-full bg-[#DB8935] flex items-center justify-center shadow-sm"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef} 
        className={`flex overflow-x-auto pb-4 hide-scrollbar gap-3 ${heightAdjustment ? 'mb-6' : 'mb-4'}`}
        onScroll={handleScroll}
        style={{ scrollBehavior: 'smooth', scrollSnapType: 'x mandatory' }}
      >
        {favoriteCafes.map((cafe) => (
          <Link
            key={cafe.id}
            to={`/coffeelover/map-coffelover?cafeId=${cafe.id}`}
            className="flex-shrink-0 w-[calc(100%-30px)] max-w-[250px] scroll-snap-align-start"
            style={{ scrollSnapAlign: 'start' }}
          >
            <div className={`relative rounded-lg overflow-hidden w-full ${cardHeight} shadow-sm`}>
              <img 
                src={cafe.image} 
                alt={cafe.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
              <div className="absolute bottom-2 left-2 text-white">
                <div className="font-medium text-sm">{cafe.name}</div>                <div className="flex items-center text-xs">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="ml-1">
                    <SafeNumericDisplay 
                      value={cafe.rating} 
                      format={(val) => val.toFixed(1)} 
                      defaultValue="..." 
                    />
                  </span>
                </div>
              </div>
              <button className="absolute bottom-2 right-2 bg-white/80 p-1.5 rounded-full">
                <Heart className="w-3.5 h-3.5 fill-[#DB8935] text-[#DB8935]" />
              </button>
            </div>
          </Link>
        ))}
      </div>
      
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}</style>
    </div>
  );
};

export default FavoriteCafes;