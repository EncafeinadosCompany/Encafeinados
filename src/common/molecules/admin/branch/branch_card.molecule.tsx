import React from "react";
import { Card, CardContent } from "@/common/ui/card";
import { Button } from "@/common/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/ui/tooltip";
import { motion } from "framer-motion";
import { Eye, MapPin, CheckCircle2, XCircle } from '@/common/ui/icons';

interface BranchCardProps {
  branch: {
    id: number;
    name: string;
    address?: string;
    status: string;
    latitude?: number;
    longitude?: number;
    phoneNumber?: string;
    store_logo?: string;
    store_email?: string;
    rejection_reason?: string;
    rejected_at?: string;
  };
  index: number;
  onView: (branch: any) => void;
  onApprove?: (branchId: number) => void;
  onReject?: (branchId: number) => void;
  type: "pending" | "approved" | "rejected";
}
export const BranchCard = ({
  branch,
  index,
  onView,
  onApprove,
  onReject,
  type,
}: BranchCardProps) => {  const borderHoverStyles = {
    pending: "hover:border-amber-200/50",
    approved: "hover:border-green-200/50",
    rejected: "hover:border-red-200/50",
  };

  const COFFEE_FALLBACK =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%236F4E37' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 8h1a4 4 0 0 1 0 8h-1'%3E%3C/path%3E%3Cpath d='M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z'%3E%3C/path%3E%3Cline x1='6' y1='1' x2='6' y2='4'%3E%3C/line%3E%3Cline x1='10' y1='1' x2='10' y2='4'%3E%3C/line%3E%3Cline x1='14' y1='1' x2='14' y2='4'%3E%3C/line%3E%3C/svg%3E";
  const handleApprove = () => {
    if (onApprove) onApprove(branch.id);
  };

  const handleReject = () => {
    if (onReject) onReject(branch.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.15, delay: index * 0.03 }}
      className="mb-2 last:mb-1"
    >
      <Card
        className={`bg-white border border-gray-100 hover:shadow-sm ${borderHoverStyles[type]} transition-all duration-200 w-full group`}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">              <div
                className={`w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-${
                  type === "pending" ? "amber" : type === "approved" ? "green" : "red"
                }-50/70 flex items-center justify-center`}
              >
                <img
                  src={branch.store_logo || COFFEE_FALLBACK}
                  alt={branch.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = COFFEE_FALLBACK;
                  }}
                />
              </div>              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-800 truncate text-sm">
                  {branch.name}
                </div>
                <div className="text-xs text-gray-500 truncate flex items-center">
                  <MapPin size={10} className="mr-1 flex-shrink-0" />
                  {branch.address || "Sin dirección"}
                </div>
                {type === "rejected" && branch.rejection_reason && (
                  <div className="text-xs text-red-600 truncate mt-0.5">
                    Motivo: {branch.rejection_reason}
                  </div>
                )}
              </div>
            </div>            <div className="flex space-x-1 items-center">
              {/* Botón Ver Detalles */}
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onView(branch)}
                      className="h-7 w-7 text-blue-600 hover:bg-blue-50/50 hover:text-blue-700 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200 no-arrow"
                  >
                    Ver detalles
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>              {/* Botones para sucursales pendientes */}
              {type === "pending" && (
                <>
                  {/* Botón Aprobar */}
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleApprove}
                          className="h-7 w-7 text-green-600 hover:bg-green-50/50 hover:text-green-700 cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="text-xs font-medium bg-green-50 text-green-700 border-green-200 no-arrow"
                      >
                        Aprobar sucursal
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Botón Rechazar */}
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleReject}
                          className="h-7 w-7 text-red-600 hover:bg-red-50/50 hover:text-red-700 cursor-pointer"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        className="text-xs font-medium bg-red-50 text-red-700 border-red-200 no-arrow"
                      >
                        Rechazar sucursal
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}              {/* Botón para rechazar sucursales aprobadas */}
              {type === "approved" && onReject && (
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleReject}
                        className="h-7 w-7 text-red-600 hover:bg-red-50/50 hover:text-red-700 cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="text-xs font-medium bg-red-50 text-red-700 border-red-200 no-arrow"
                    >
                      Rechazar sucursal
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
