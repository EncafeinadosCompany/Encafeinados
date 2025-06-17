import React, { useRef, useState, useEffect } from 'react';
import { MessageSquare, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useWindowSize } from '@/common/hooks/useWindowSize';
import { useClientReviews } from '@/api/queries/reviews/reviews.query';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ReviewImages from '@/common/atoms/reviews/review_images.atom';
import StarsRating from '@/common/atoms/reviews/stars_rating.atom';
import { getEncryptedItem } from '@/common/utils/security/storage_encrypted.utils';

interface UserReviewsProps {
  heightAdjustment?: boolean;
}

export const UserReviews: React.FC<UserReviewsProps> = ({ heightAdjustment = false }) => {
  const userId = React.useMemo(() => {
    try {
      const id = getEncryptedItem("userId");
      return id || 4; 
    } catch (error) {
      console.error('Error getting user ID:', error);
      return 4;
    }
  }, []);

  const { data: clientReviews, isLoading, error } = useClientReviews(userId as number);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { height } = useWindowSize();
  
  const commentCardHeight = heightAdjustment && height > 800 ? "min-h-[180px]" : "";
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [clientReviews]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'd MMM yyyy', { locale: es });
    } catch (e) {
      return dateStr;
    }
  };
  
  const scrollPrev = () => {
    if (!clientReviews?.reviews.length) return;
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const scrollNext = () => {
    if (!clientReviews?.reviews.length) return;
    const newIndex = Math.min(clientReviews.reviews.length - 1, currentIndex + 1);
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
    if (scrollContainerRef.current && clientReviews?.reviews.length) {
      const itemWidth = scrollContainerRef.current.offsetWidth;
      const newIndex = Math.round(scrollContainerRef.current.scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 pb-16">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium text-[#5F4B32] flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-[#DB8935]" />
            Mis comentarios
          </h2>
        </div>
        <div className="animate-pulse bg-gray-200 rounded-lg h-40"></div>
      </div>
    );
  }

  if (error) {
    const is404 = (error as any)?.response?.status === 404;
    
    return (
      <div className="px-4 pb-16">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium text-[#5F4B32] flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-[#DB8935]" />
            Mis comentarios
          </h2>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
          {is404 ? "No se encontraron reseñas" : "No se pudieron cargar tus reseñas"}
        </div>
      </div>
    );
  }

  if (!clientReviews || !clientReviews.reviews || clientReviews.reviews.length === 0) {
    return (
      <div className="px-4 pb-16">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium text-[#5F4B32] flex items-center">
            <MessageSquare className="h-4 w-4 mr-2 text-[#DB8935]" />
            Mis comentarios
          </h2>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
          No has dejado reseñas aún
        </div>
      </div>
    );
  }

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
            disabled={currentIndex === clientReviews.reviews.length - 1}
            className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
              currentIndex === clientReviews.reviews.length - 1 ? 'bg-gray-300' : 'bg-[#DB8935]'
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
        {clientReviews.reviews.map((review, idx) => (
          <div 
            key={review.id}
            className={`flex-shrink-0 w-full snap-center px-0.5 ${heightAdjustment ? 'pb-4' : ''}`}
          >
            <div className={`bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100 ${commentCardHeight}`}>
              <div className="flex items-center gap-2 mb-3">
                <div>
                  <h4 className="font-medium text-[#5F4B32]">
                    {review.branchName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(review.createdAt)}</span>
                  </div>                </div>
                <div className="ml-auto">
                  <StarsRating value={review.rating} size="xs" readOnly />
                </div>
              </div>
              
              <p className="text-gray-700 text-sm">{review.comment}</p>
              
              {review.imageUrls && review.imageUrls.length > 0 && (
                <ReviewImages images={review.imageUrls} />
              )}          
            </div>
          </div>
        ))}
      </div>
      
      {clientReviews.reviews.length > 1 && (
        <div className={`flex justify-center gap-1 mt-3 ${heightAdjustment ? 'mb-6' : ''}`}>
          {clientReviews.reviews.map((_, i) => (
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
      )}
    </div>
  );
};

export default UserReviews;