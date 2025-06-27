import React from 'react';
import { Star, MessageSquare, Image } from '@/common/ui/icons';
import StarsRating from '@/common/atoms/reviews/stars_rating.atom';
import { SingleReview } from '@/api/types/reviews/review.type';

interface ReviewsStatsProps {
  reviews: SingleReview[];
  branchName: string;
}

export const ReviewsStats: React.FC<ReviewsStatsProps> = ({ reviews, branchName }) => {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(review => review.rating === rating).length,
    percentage: totalReviews > 0 ? (reviews.filter(review => review.rating === rating).length / totalReviews) * 100 : 0
  }));

  return (
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200 shadow-sm">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#5F4B32] mb-2">
          Valoraciones de {branchName}
        </h3>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="text-4xl font-bold text-amber-600">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex flex-col items-start">
            <StarsRating value={averageRating} size="lg" readOnly />
            <span className="text-sm text-gray-600 mt-1">
              {totalReviews} {totalReviews === 1 ? 'valoración' : 'valoraciones'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-600 fill-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Calificación promedio</p>
              <p className="text-xl font-bold text-[#5F4B32]">
                {averageRating.toFixed(1)}/5
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de reseñas</p>
              <p className="text-xl font-bold text-[#5F4B32]">{totalReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Image className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Con imágenes</p>
              <p className="text-xl font-bold text-[#5F4B32]">
                {reviews.filter(r => r.imageUrls && r.imageUrls.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[#5F4B32] mb-3">
          Distribución de calificaciones
        </h4>
        {ratingDistribution.map(({ rating, count, percentage }) => (
          <div key={rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-12">
              <span className="text-sm text-gray-600">{rating}</span>
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 w-8 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
