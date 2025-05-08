import React from 'react';
import { SingleReview } from '../../../../api/types/reviews/review.type';
import ImageCarousel from '../../admin_branch/imagen_carousel';

interface ListReviewsProps {
  reviews: SingleReview[];
}

const ListReviews: React.FC<ListReviewsProps> = ({ reviews }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Reseñas de Clientes</h2>
      
      {reviews.length === 0 ? (
        <p className="text-gray-500">No hay reseñas disponibles</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{review.clientName}</h3>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="mt-3 text-gray-700">{review.comment}</p>
              
              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="mt-4">
                  <ImageCarousel images={review.imageUrls.map(url => url.replace(/`/g, ''))} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListReviews;