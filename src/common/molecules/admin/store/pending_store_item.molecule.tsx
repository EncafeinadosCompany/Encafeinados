import React from "react";
import { Button } from "@/common/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/common/ui/avatar";
import { Check, X, Eye, Clock } from "@/common/ui/icons";
import { StoreDto } from "@/api/types/stores/stores.type";
import { Badge } from "@/common/ui/badge";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/ui/tooltip";

interface PendingStoreItemProps {
  store: StoreDto;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onViewDetails: (store: StoreDto) => void;
}

export const PendingStoreItem = ({
  store,
  onApprove,
  onReject,
  onViewDetails,
}: PendingStoreItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="group relative flex items-center justify-between p-4  border-gray-100 hover:bg-gradient-to-r hover:from-amber-50/30 hover:to-transparent transition-all duration-200"
    >
      {/* Línea decorativa lateral en hover */}
      <motion.div 
        initial={{ opacity: 0, height: "0%" }}
        whileHover={{ opacity: 1, height: "70%" }}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-gradient-to-b from-[#D4A76A] to-[#6F4E37] rounded-full"
      />
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-12 w-12 ring-2 ring-[#D4A76A]/10 ring-offset-2 ring-offset-white group-hover:ring-[#D4A76A]/30 transition-all duration-300">
            <AvatarImage 
              src={store.logo || ""} 
              alt={store.name} 
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-[#D4A76A]/80 to-[#6F4E37]/80 text-white font-medium">
              {store.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge
                  variant="outline"
                  className="absolute -top-2 -right-2 text-[10px] border border-amber-200 bg-amber-50 text-amber-700 px-1 py-0"
                >
                  <Clock className="h-2.5 w-2.5 mr-0.5" />
                  <span>Pendiente</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Esperando aprobación</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-1">
          <div className="font-medium text-gray-800 group-hover:text-[#6F4E37] transition-colors">
            {store.name}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <span>{store.email}</span>
            {store.phone_number && (
              <>
                <span className="text-xs text-gray-300">•</span>
                <span>{store.phone_number}</span>
              </>
            )}
          </div>
          {store.type_document && (
            <div className="text-xs text-gray-400">
              {store.type_document}: {store.number_document}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-1.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(store)}
                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all"
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-1.5">Ver</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Ver detalles completos</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onApprove(store.id)}
                className="text-green-600 hover:bg-green-50 hover:text-green-700 transition-all"
              >
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Check className="h-4 w-4" />
                </motion.span>
                <span className="sr-only md:not-sr-only md:ml-1.5">Aprobar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Aprobar esta tienda</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReject(store.id)}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
              >
                <motion.span
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ rotate: [0, -20, 20, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <X className="h-4 w-4" />
                </motion.span>
                <span className="sr-only md:not-sr-only md:ml-1.5">Rechazar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Rechazar esta tienda</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};