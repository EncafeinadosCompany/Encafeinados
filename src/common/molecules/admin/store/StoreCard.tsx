import React from 'react';
import { Store } from "@/api/types/storesTypes";
import { Card, CardContent } from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/ui/tooltip";
import { motion } from "framer-motion";
import { Eye, CheckCircle2, XCircle } from "lucide-react";
import { StoreAvatar } from "@/common/atoms/StoreAvatar";

interface StoreCardProps {
  store: Store;
  index: number;
  onView: (store: Store) => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  type?: 'pending' | 'approved' | 'rejected';
}

export const StoreCard = ({ store, index, onView, onApprove, onReject, type = 'pending' }: StoreCardProps) => {
  const borderHoverStyles = {
    pending: "hover:border-amber-200/50",
    approved: "hover:border-green-200/50",
    rejected: "hover:border-red-200/50"
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      className="mb-2 last:mb-1"
    >
      <Card className={`bg-white border border-gray-100 hover:shadow-sm ${borderHoverStyles[type]} transition-all duration-200 w-full group`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <StoreAvatar 
                logo={store.logo} 
                name={store.name} 
                type={type} 
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-800 truncate text-sm">{store.name}</div>
                <div className="text-xs text-gray-500 truncate">
                  {store.email?.substring(0, 14)}...
                </div>
              </div>
            </div>
          
            <div className="flex space-x-1 items-center">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(store)}
                      className="h-7 w-7 text-blue-600 hover:bg-blue-50/50 hover:text-blue-700"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 no-arrow">
                    Ver detalles
                  </TooltipContent>
                </Tooltip>

                {type === 'pending' && (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onApprove(store.id)}
                          className="h-7 w-7 text-green-600 hover:bg-green-50/50 hover:text-green-700"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs font-medium bg-green-50 text-green-700 border-green-200 no-arrow">
                        Aprobar tienda
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onReject(store.id)}
                          className="h-7 w-7 text-red-600 hover:bg-red-50/50 hover:text-red-700"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs font-medium bg-red-50 text-red-700 border-red-200 no-arrow">
                        Rechazar tienda
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};