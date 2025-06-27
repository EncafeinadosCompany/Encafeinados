import React, { useState, useRef } from 'react';
import { MessageSquare, Search, Star, ChevronLeft, ChevronRight } from '@/common/ui/icons';
import { Input } from '@/common/ui/input';
import { Button } from '@/common/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/ui/select';
import { useReviewsByIdBranches } from '@/api/queries/reviews/reviews.query';
import { useBranchesID } from '@/api/queries/branches/branch.query';
import { getEncryptedItem } from '@/common/utils/security/storage_encrypted.utils';
import { BranchReviewCard } from '@/common/molecules/admin_branch/reviews/branch_review_card.molecule';
import StarsRating from '@/common/atoms/reviews/stars_rating.atom';
import toast from 'react-hot-toast';

const BranchReviewsWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showAll, setShowAll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const branchId = getEncryptedItem("branchId") as string | null;
  
  const { data: branchData, isLoading: isBranchLoading } = useBranchesID(Number(branchId));
  const { data: reviewsData, isLoading: isReviewsLoading, error } = useReviewsByIdBranches(Number(branchId));

  const filteredAndSortedReviews = React.useMemo(() => {
    if (!reviewsData) return [];

    let filtered = reviewsData.filter(review => 
      review.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default:
          return 0;
      }
    });
  }, [reviewsData, searchTerm, sortBy]);

  const displayedReviews = showAll ? filteredAndSortedReviews : filteredAndSortedReviews.slice(0, 3);

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const itemWidth = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollPrev = () => {
    if (!displayedReviews.length) return;
    const newIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const scrollNext = () => {
    if (!displayedReviews.length) return;
    const newIndex = Math.min(displayedReviews.length - 1, currentIndex + 1);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const isLoading = isBranchLoading || isReviewsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              <span className="ml-3 text-[#5F4B32]">Cargando valoraciones...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Error al cargar las valoraciones
              </h3>
              <p className="text-gray-600">
                No se pudieron cargar las valoraciones de la sucursal.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Card de información de la sucursal */}
        {branchData && (
          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#5F4B32] mb-2">
                  {branchData.branch.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <StarsRating value={parseFloat(branchData.branch.average_rating)} size="md" readOnly />
                    <span className="text-lg font-semibold text-amber-600">
                      {branchData.branch.average_rating}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    ({reviewsData?.length || 0} {reviewsData?.length === 1 ? 'valoración' : 'valoraciones'})
                  </span>
                </div>
              </div>
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#5F4B32] flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-[#DB8935]" />
              Valoraciones de clientes
            </h2>
            {!showAll && displayedReviews.length > 1 && (
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
                  disabled={currentIndex === displayedReviews.length - 1}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm ${
                    currentIndex === displayedReviews.length - 1 ? 'bg-gray-300' : 'bg-[#DB8935]'
                  }`}
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por cliente o comentario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-amber-200 focus:border-amber-400 text-sm"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-amber-200 focus:border-amber-400">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="oldest">Más antiguos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {!reviewsData || reviewsData.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>Tu sucursal aún no ha recibido valoraciones</p>
            </div>
          ) : filteredAndSortedReviews.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-lg text-center text-gray-500">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No se encontraron resultados para tu búsqueda</p>
            </div>
          ) : showAll ? (
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <BranchReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <>
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                style={{ scrollBehavior: 'smooth' }}
              >
                {displayedReviews.map((review, index) => (
                  <div 
                    key={review.id}
                    className="flex-shrink-0 w-full snap-center px-0.5"
                  >
                    <BranchReviewCard review={review} />
                  </div>
                ))}
              </div>
              
              {displayedReviews.length > 1 && (
                <div className="flex justify-center gap-1 mt-4">
                  {displayedReviews.map((_, i) => (
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
            </>
          )}

          {filteredAndSortedReviews.length > 3 && (
            <div className="text-center mt-6">
              <Button 
                variant="outline"
                onClick={() => setShowAll(!showAll)}
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                {showAll 
                  ? 'Ver menos comentarios' 
                  : `Ver todos los comentarios (${filteredAndSortedReviews.length})`
                }
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { BranchReviewsWidget };
export default BranchReviewsWidget;
