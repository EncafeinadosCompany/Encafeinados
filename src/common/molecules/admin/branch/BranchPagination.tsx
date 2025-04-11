import React from 'react'
import { Button } from '@/common/ui/button'
import { Select } from '@/common/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BranchPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (value: number) => void
}

export const BranchPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}: BranchPaginationProps) => {
  const showingFrom = Math.min(((currentPage - 1) * itemsPerPage) + 1, totalItems)
  const showingTo = Math.min(currentPage * itemsPerPage, totalItems)
  
  return (
    <div className="w-full py-2 px-3 border-t border-gray-200 flex items-center justify-between">
      <div className="text-xs text-gray-500">
        Mostrando <span className="font-medium text-gray-700">{showingFrom}-{showingTo}</span> de <span className="font-medium text-gray-700">{totalItems}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 mr-2">
          <span className="text-xs text-gray-500">Mostrar:</span>
          <select
            className="h-6 text-xs rounded border-gray-200 focus:border-amber-200 focus:ring-1 focus:ring-amber-200 focus:outline-none"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-7 w-7 text-gray-600 hover:bg-gray-100"
        >
          <ChevronLeft size={16} />
        </Button>
        
        <div className="text-xs font-medium bg-gray-100 rounded-md py-1 px-2.5">
          {currentPage}/{totalPages || 1}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-7 w-7 text-gray-600 hover:bg-gray-100"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}