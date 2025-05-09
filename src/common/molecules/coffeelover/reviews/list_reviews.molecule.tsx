import React from 'react';
import { SingleReview } from '@/api/types/reviews/review.type';
import { User, Calendar } from 'lucide-react';
import ReviewStars from '@/common/atoms/reviews/review_stars.atom';
import ReviewImages from '@/common/atoms/reviews/review_images.atom';

interface ReviewProps {
  reviews: SingleReview[]
}

export const ListReviews = ({ reviews }: ReviewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900">
          Opiniones de clientes
        </h3>
        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
        </span>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-white rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className="p-4 sm:p-5">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                  <div className="bg-amber-50 h-8 w-8 rounded-full flex items-center justify-center mr-2">
                    <User className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{review.clientName}</h4>
                    <div className="flex items-center text-gray-500 text-xs mt-0.5">
                      <Calendar className="h-3 w-3 mr-1" />
                      <FormatDate dateString={review.createdAt} />
                    </div>
                  </div>
                </div>
                <ReviewStars rating={review.rating} size="sm" />
              </div>

              <p className="text-gray-600 text-sm sm:text-base mb-4 whitespace-pre-line">
                {review.comment}
              </p>
              
              {/* Componente para mostrar imágenes */}
              <ReviewImages images={review.imageUrls} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para formatear la fecha
const FormatDate = ({ dateString }: { dateString: string }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return <span>{formatDate(dateString)}</span>;
};

export default ListReviews;