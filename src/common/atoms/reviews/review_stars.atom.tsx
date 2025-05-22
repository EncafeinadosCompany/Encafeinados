import React from 'react';
import { Star } from 'lucide-react';
import { useSafeNumericValue } from '@/common/hooks/useSafeNumericValue';

interface ReviewStarsProps {
  rating: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const ReviewStars: React.FC<ReviewStarsProps> = ({ rating, size = 'md' }) => {
  const { safeValue } = useSafeNumericValue(rating);
  
  const starSizes = {
    xs: 'h-2.5 w-2.5',
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const containerClasses = {
    xs: 'gap-0.5',
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1'
  };

  return (
    <div className={`flex ${containerClasses[size]}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`${starSizes[size]} ${star <= (safeValue as number) 
            ? 'text-amber-400 fill-amber-400' 
            : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

export default ReviewStars;