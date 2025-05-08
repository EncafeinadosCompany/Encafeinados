import React from 'react';
import { useReviewsByIdBranches } from '@/api/queries/reviews/reviews.query';
import ListReviews from '@/common/molecules/coffeelover/reviews/list_reviews.molecule';
import { Skeleton } from '@/common/ui/skeleton';

interface ReviewsWidgetProps {
  branchId: number;
}

export const ReviewsWidget: React.FC<ReviewsWidgetProps> = ({ branchId }) => {
  const { data: reviews, isLoading, error } = useReviewsByIdBranches(branchId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error al cargar las reseñas</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="text-gray-500">No hay reseñas disponibles para esta sucursal</div>;
  }

  return <ListReviews reviews={reviews} />;
};

export default ReviewsWidget;