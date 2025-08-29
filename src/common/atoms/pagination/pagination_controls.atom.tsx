import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/common/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/ui/select";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
}

export const PaginationControls = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
}: PaginationControlsProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 7;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);

    if (endPage - startPage + 1 < showPages) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    // Always show first page
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis-start');
      }
    }

    // Show middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Always show last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E6D7C3]/40 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Items info and per page selector */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#8B5A2B]/80 font-medium">
            <span className="bg-[#F5E4D2]/50 px-2 py-1 rounded-lg">
              {startItem}-{endItem}
            </span>
            <span>de</span>
            <span className="bg-[#DB8935]/10 px-2 py-1 rounded-lg text-[#8B5A2B]">
              {totalItems}
            </span>
            <span>resultados</span>
          </div>

          {showItemsPerPage && onItemsPerPageChange && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#8B5A2B]/70 font-medium whitespace-nowrap">
                Mostrar:
              </span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
              >
                <SelectTrigger className="w-20 h-9 rounded-xl border-[#E6D7C3]/60 bg-white hover:bg-[#F5E4D2]/20 focus:ring-[#DB8935]/20 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#E6D7C3]/60">
                  <SelectItem value="10" className="rounded-lg">10</SelectItem>
                  <SelectItem value="20" className="rounded-lg">20</SelectItem>
                  <SelectItem value="50" className="rounded-lg">50</SelectItem>
                  <SelectItem value="100" className="rounded-lg">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className={`
              h-9 w-9 p-0 rounded-xl transition-all duration-200 
              ${currentPage === 1 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-[#DB8935]/10 hover:text-[#8B5A2B] text-gray-500'
              }
            `}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              h-9 w-9 p-0 rounded-xl transition-all duration-200 
              ${currentPage === 1 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-[#DB8935]/10 hover:text-[#8B5A2B] text-gray-500'
              }
            `}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 mx-2">
            {getPageNumbers().map((page, index) => (
              <div key={`${page}-${index}`}>
                {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                  <div className="h-9 w-9 flex items-center justify-center text-gray-400">
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    className={`
                      h-9 w-9 p-0 rounded-xl font-medium transition-all duration-200 
                      ${currentPage === page 
                        ? 'bg-gradient-to-r from-[#DB8935] to-[#C8A882] text-white shadow-md hover:opacity-90' 
                        : 'hover:bg-[#DB8935]/10 hover:text-[#8B5A2B] text-gray-600'
                      }
                    `}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              h-9 w-9 p-0 rounded-xl transition-all duration-200 
              ${currentPage === totalPages 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-[#DB8935]/10 hover:text-[#8B5A2B] text-gray-500'
              }
            `}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className={`
              h-9 w-9 p-0 rounded-xl transition-all duration-200 
              ${currentPage === totalPages 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-[#DB8935]/10 hover:text-[#8B5A2B] text-gray-500'
              }
            `}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
