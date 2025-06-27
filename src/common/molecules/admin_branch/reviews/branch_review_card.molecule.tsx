import React from 'react';
import { Calendar, User } from '@/common/ui/icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ReviewImages from '@/common/atoms/reviews/review_images.atom';
import StarsRating from '@/common/atoms/reviews/stars_rating.atom';
import { SingleReview } from '@/api/types/reviews/review.type';

interface BranchReviewCardProps {
  review: SingleReview;
}

export const BranchReviewCard: React.FC<BranchReviewCardProps> = ({ review }) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'd MMM yyyy', { locale: es });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-[#5F4B32] text-sm">
              {review.clientName}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarsRating value={review.rating} size="sm" readOnly />
          <span className="text-sm font-medium text-amber-600">
            {review.rating.toFixed(1)}
          </span>
        </div>
      </div>
      
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {review.comment}
      </p>
      
      {review.imageUrls && review.imageUrls.length > 0 && (
        <ReviewImages images={review.imageUrls} />
      )}
    </div>
  );
};
