import React from 'react';
import { useReviewsByIdBranches } from '@/api/queries/reviews/reviews.query';
import ListReviews from '@/common/molecules/coffeelover/reviews/list_reviews.molecule';
import { Skeleton } from '@/common/ui/skeleton';
import { MessageSquareOff, AlertTriangle } from 'lucide-react';

interface ReviewsWidgetProps {
  branchId: number;
}

export const ReviewsWidget: React.FC<ReviewsWidgetProps> = ({ branchId }) => {
  const { data: reviews, isLoading, error } = useReviewsByIdBranches(branchId);

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-6" />
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/60 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-28 mb-3" />
              <Skeleton className="h-16 w-full" />
              {i % 2 === 0 && (
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-16 w-16 rounded-md" />
                  <Skeleton className="h-16 w-16 rounded-md" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="bg-red-50 rounded-full p-3 mb-3">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No se pudieron cargar las reseñas</h3>
        <p className="text-gray-500 max-w-sm">
          Ha ocurrido un error al intentar cargar las reseñas. Por favor, intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="bg-amber-50 rounded-full p-4 mb-4">
          <MessageSquareOff className="h-8 w-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin reseñas todavía</h3>
        <p className="text-gray-500 max-w-sm mb-6">
          Esta cafetería aún no tiene reseñas. ¡Sé el primero en compartir tu experiencia!
        </p>
        <div className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full">
          Las reseñas ayudan a otros amantes del café
        </div>
      </div>
    );
  }

  return <ListReviews reviews={reviews} />;
};

export default ReviewsWidget;