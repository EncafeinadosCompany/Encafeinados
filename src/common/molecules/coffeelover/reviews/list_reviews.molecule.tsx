import React, { useState, useEffect } from 'react';
import { SingleReview } from '../../../../api/types/reviews/review.type';
import ImageCarousel from '../../admin_branch/imagen_carousel';

// Datos de ejemplo (en producción deberías obtenerlos de una API
// Componente para mostrar estrellas de calificación
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="text-amber-600 text-xl mb-3">
      {[...Array(5)].map((_, i) => (
        <span key={i}>{i < rating ? "★" : "☆"}</span>
      ))}
    </div>
  );
};

// Componente para formatear la fecha
const FormatDate = ({ dateString }: { dateString: string }) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  return <span className="text-stone-500 text-sm">{formatDate(dateString)}</span>;
};

interface ReviewProps {
  reviews: SingleReview[]
}

export const ListReviews = ({reviews}:ReviewProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h2 className="text-3xl md:text-4xl font-serif text-center text-amber-900 mb-8">
        Lo que dicen nuestros clientes
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-gradient-to-b from-stone-100 to-amber-50 rounded-lg p-5 shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-stone-800 font-medium text-lg">{review.clientName}</h3>
              <FormatDate dateString={review.createdAt} />
            </div>
            
            <StarRating rating={review.rating} />
            
            <p className="text-stone-700 mb-2 leading-relaxed">{review.comment}</p>
            
            {review.imageUrls.length > 0 && (
              <div className="flex flex-wrap gap-2">
                    <ImageCarousel
                     images={review.imageUrls}
                     alt='imagenes'>  
                    </ImageCarousel>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListReviews;