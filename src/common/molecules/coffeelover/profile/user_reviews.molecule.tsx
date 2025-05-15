import React, { useRef, useState } from 'react';
import { MessageSquare, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWindowSize } from '@/common/hooks/useWindowSize';

interface UserReviewsProps {
  heightAdjustment?: boolean;
}

const userReviews = [
  {
    id: 1,
    cafeName: "Café Aromático",
    cafeId: 1,
    rating: 5,
    comment: "Excelente café y servicio. El barista fue muy amable y el café tenía notas a chocolate y caramelo. Definitivamente regresaré.",
    date: "2023-10-15",
    image: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    cafeName: "El Buen Café",
    cafeId: 2,
    rating: 4,
    comment: "Me gustó mucho el ambiente, aunque el café podría ser un poco más fuerte. El servicio fue rápido y el lugar muy acogedor.",
    date: "2023-09-22",
    image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    cafeName: "Café Express",
    cafeId: 3,
    rating: 5,
    comment: "La mejor experiencia de café que he tenido en mucho tiempo. El método V60 que preparan es excepcional, con un equilibrio perfecto.",
    date: "2023-08-30",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
  }
];

export const UserReviews: React.FC<UserReviewsProps> = ({ heightAdjustment = false }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { height } = useWindowSize();
  
  // Determinar el espacio adicional para pantallas grandes
  const commentCardHeight = heightAdjustment && height > 800 ? "min-h-[180px]" : "";
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const scrollPrev = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const scrollNext = () => {
    const newIndex = Math.min(userReviews.length - 1, currentIndex + 1);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
      const itemWidth = scrollContainerRef.current.offsetWidth;
      const newIndex = Math.round(scrollContainerRef.current.scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <div className={`px-4 ${heightAdjustment ? 'mt-auto' : 'mt-2'} pb-16`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-medium text-[#5F4B32] flex items-center">
          <MessageSquare className="h-4 w-4 mr-2 text-[#DB8935]" />
          Mis comentarios
        </h2>
        <div className="flex gap-1">
          <button 
            onClick={scrollPrev}
            disabled={currentIndex === 0}
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
              currentIndex === 0 ? 'bg-gray-300' : 'bg-[#DB8935]'
            }`}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button 
            onClick={scrollNext}
            disabled={currentIndex === userReviews.length - 1}
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
              currentIndex === userReviews.length - 1 ? 'bg-gray-300' : 'bg-[#DB8935]'
            }`}
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollContainerRef} 
        className={`flex overflow-x-auto snap-x snap-mandatory hide-scrollbar ${commentCardHeight}`}
        onScroll={handleScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        {userReviews.map((review) => (
          <div 
            key={review.id}
            className={`flex-shrink-0 w-full snap-center px-0.5 ${heightAdjustment ? 'pb-4' : ''}`}
          >
            <div className={`bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 ${commentCardHeight}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-10 w-10 rounded-md overflow-hidden">
                  <img 
                    src={review.image} 
                    alt={review.cafeName} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-[#5F4B32]">
                    {review.cafeName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(review.date)}</span>
                  </div>
                </div>
                <div className="ml-auto flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 text-sm">{review.comment}</p>
              
              <Link 
                to={`/coffeelover/map-coffelover?cafeId=${review.cafeId}`}
                className="mt-3 inline-flex items-center text-xs text-[#DB8935] hover:text-[#8B5A2B] transition-colors"
              >
                Ver cafetería
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicador de página con posición fixed para dispositivos grandes */}
      <div className={`flex justify-center gap-1 mt-3 ${heightAdjustment ? 'mb-6' : ''}`}>
        {userReviews.map((_, i) => (
          <button 
            key={i}
            className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-[#DB8935]' : 'bg-gray-300'}`}
            onClick={() => {
              setCurrentIndex(i);
              scrollToIndex(i);
            }}
          />
        ))}
      </div>
      
      {/* Añadir clase CSS para soporte de safe-area en dispositivos modernos */}
      <style>{`
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 1rem);
        }
      `}</style>
    </div>
  );
};

export default UserReviews;