import React from "react";
import { Button } from "@/common/ui/button";
import { ChevronLeft, ChevronRight } from'@/common/ui/icons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select";

interface StorePaginationProps {
  currentPage: number; 
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
}

export const StorePagination = ({ 
  currentPage, 
  totalPages, 
  totalItems,
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}: StorePaginationProps) => {
  return (
    <div className="flex items-center justify-between gap-1 py-1.5 px-2 text-xs">
      <div className="text-gray-500">
        {totalItems > 0 
          ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} de ${totalItems}`
          : "0 resultados"}
      </div>
      
      <div className="flex items-center gap-1">
        {totalPages > 1 && (
          <>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-6 w-6 rounded-md"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            
            <span className="text-xs px-2 font-medium">
              {currentPage} / {totalPages}
            </span>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-6 w-6 rounded-md"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
        
        <Select
          value={itemsPerPage.toString()}
          onValueChange={(value) => onItemsPerPageChange(Number(value))}
        >
          <SelectTrigger className="h-6 w-[45px] border-gray-200 text-xs ml-1">
            <SelectValue placeholder={itemsPerPage.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};