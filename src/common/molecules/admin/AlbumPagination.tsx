import React from "react";
import { Button } from "@/common/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AlbumPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
}

export const AlbumPagination: React.FC<AlbumPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange
}) => {
    if (totalPages <= 1) return null;

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    // Para muchas páginas, mostrar un selector más compacto
    const renderPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                    key={page}
                    onClick={() => onPageChange(page)}
                    variant={currentPage === page ? "default" : "ghost"}
                    className={`w-7 h-7 p-0 rounded-full ${currentPage === page
                        ? 'bg-[#D4A76A] text-white hover:bg-[#C19559]'
                        : 'text-[#6F4E37] hover:bg-[#FAF3E0] hover:text-[#6F4E37]'
                        }`}
                >
                    {page}
                </Button>
            ));
        }

        // Para muchas páginas, mostrar primera, última y algunas alrededor de la actual
        const items = [];
        
        // Primera página
        items.push(
            <Button
                key={1}
                onClick={() => onPageChange(1)}
                variant={currentPage === 1 ? "default" : "ghost"}
                className={`w-7 h-7 p-0 rounded-full ${currentPage === 1
                    ? 'bg-[#D4A76A] text-white hover:bg-[#C19559]'
                    : 'text-[#6F4E37] hover:bg-[#FAF3E0] hover:text-[#6F4E37]'
                    }`}
            >
                1
            </Button>
        );

        // Ellipsis al inicio si es necesario
        if (currentPage > 3) {
            items.push(<span key="start-ellipsis" className="px-1">...</span>);
        }

        // Páginas alrededor de la actual
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Button
                    key={i}
                    onClick={() => onPageChange(i)}
                    variant={currentPage === i ? "default" : "ghost"}
                    className={`w-7 h-7 p-0 rounded-full ${currentPage === i
                        ? 'bg-[#D4A76A] text-white hover:bg-[#C19559]'
                        : 'text-[#6F4E37] hover:bg-[#FAF3E0] hover:text-[#6F4E37]'
                        }`}
                >
                    {i}
                </Button>
            );
        }

        // Ellipsis al final si es necesario
        if (currentPage < totalPages - 2) {
            items.push(<span key="end-ellipsis" className="px-1">...</span>);
        }

        // Última página
        if (totalPages > 1) {
            items.push(
                <Button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    variant={currentPage === totalPages ? "default" : "ghost"}
                    className={`w-7 h-7 p-0 rounded-full ${currentPage === totalPages
                        ? 'bg-[#D4A76A] text-white hover:bg-[#C19559]'
                        : 'text-[#6F4E37] hover:bg-[#FAF3E0] hover:text-[#6F4E37]'
                        }`}
                >
                    {totalPages}
                </Button>
            );
        }

        return items;
    };

    return (
        <div className="flex items-center justify-center mt-4 mb-1 space-x-1">
            <Button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                variant="outline"
                className={`p-1 h-7 w-7 rounded-full ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FAF3E0] hover:text-[#6F4E37] border-amber-200'}`}
                size="icon"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm px-2 rounded-full shadow-sm">
                {renderPageNumbers()}
            </div>

            <Button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                className={`p-1 h-7 w-7 rounded-full ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FAF3E0] hover:text-[#6F4E37] border-amber-200'}`}
                size="icon"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};