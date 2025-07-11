import React from "react";
import { Card, CardContent } from '@/common/ui/card';
import { motion } from "framer-motion";

/**
 * Component that simulates the appearance of a StoreCard during loading
 */
export const StoreCardSkeleton = () => {
  return (
    <Card  className="overflow-hidden h-full bg-white rounded-2xl border-0 shadow-md">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Skeleton for image */}
        <div className="relative h-48 sm:h-52 overflow-hidden rounded-t-2xl bg-gray-300 animate-pulse">
          {/* Top gradient (simulation) */}
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-gray-300 to-transparent z-10"></div>
          
          {/* Skeleton for favorites button */}
          <div className="absolute top-3 left-3 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          </div>
          
          {/* Skeleton for distance indicator */}
          <div className="absolute bottom-3 left-3 z-20 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
            <div className="w-12 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>
        
        {/* Skeleton for content */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Nombre de la tienda */}
          <div className="flex justify-between items-start mb-2">
            <div className="h-6 bg-gray-300 rounded-md w-3/4 animate-pulse"></div>
          </div>
          
          {/* Información adicional */}
          <div className="flex flex-col space-y-2 mt-1">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-300 mr-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded-md w-3/4 animate-pulse"></div>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gray-300 mr-2 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded-md w-2/3 animate-pulse"></div>
            </div>
          </div>
          
          {/* Línea divisoria */}
          <div className="my-3 w-full">
            <div className="h-px bg-gray-300 animate-pulse"></div>
          </div>
          
          {/* Skeleton for button */}
          <div className="mt-auto pt-2">
            <div className="h-10 bg-gray-300 rounded-lg w-full animate-pulse"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};