import React, { useState } from 'react';
import { useClientReviews } from '@/api/queries/reviews/reviews.query';
import ListClientReviews from '@/common/molecules/coffeelover/reviews/list_client_reviews.molecule';
import { Skeleton } from '@/common/ui/skeleton';
import { MessageSquareOff, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/common/ui/button';

interface ClientReviewsWidgetProps {
  clientId: number;
}

export const ClientReviewsWidget: React.FC<ClientReviewsWidgetProps> = ({ clientId }) => {
  const { data: reviews, isLoading, error } = useClientReviews(clientId);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-6" />
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/60 rounded-lg p-3 shadow-sm border border-amber-50">
              <div className="flex justify-between mb-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-12 w-full" />
              {i % 2 === 0 && (
                <div className="mt-3 flex gap-1.5">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <Skeleton className="h-12 w-12 rounded-md" />
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
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="bg-red-50 rounded-full p-3 mb-3">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No se pudieron cargar tus reseñas</h3>
        <p className="text-gray-500 max-w-sm">
          Ha ocurrido un error al intentar cargar tus reseñas. Por favor, intenta de nuevo más tarde.
        </p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="bg-amber-50 rounded-full p-4 mb-4">
          <MessageSquareOff className="h-8 w-8 text-amber-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No has escrito reseñas todavía</h3>
        <p className="text-gray-500 max-w-sm mb-5">
          Aún no has compartido tu opinión sobre ninguna cafetería. ¡Visita una cafetería y comparte tu experiencia!
        </p>
        <div className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full">
          Tus reseñas ayudan a otros amantes del café
        </div>
      </div>
    );
  }

  // Lógica de paginación
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  return (
    <div className="space-y-4">
      <ListClientReviews reviews={currentReviews} />
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2 border-t border-amber-100/50">
          <div className="text-xs text-amber-700">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className="h-7 px-2 border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Anterior</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className="h-7 px-2 border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Siguiente</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientReviewsWidget;