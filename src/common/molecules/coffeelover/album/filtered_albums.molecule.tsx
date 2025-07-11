import { Coffee }  from'@/common/ui/icons'
import React from "react";




interface FilterAlbumsProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    activeFilter: string | null;
    setActiveFilter: React.Dispatch<React.SetStateAction<string | null>>;
}


export const FilterAlbums = ({ searchTerm, activeFilter, setActiveFilter, setSearchTerm }: FilterAlbumsProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center border border-amber-100">
        <div className="mb-4 flex justify-center">
            <div className="relative">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                    <Coffee className="h-8 w-8 text-amber-600" />
                </div>
                <div className="absolute top-1 -right-1 w-8 h-8 rounded-full bg-amber-50 opacity-70"></div>
                <div className="absolute -bottom-1 -left-2 w-6 h-6 rounded-full bg-amber-50 opacity-70"></div>
            </div>
        </div>
        <h3 className="text-xl font-medium text-amber-900 mb-3">No se encontraron álbumes</h3>
        <p className="text-amber-700/80 max-w-sm mx-auto">
            {searchTerm || activeFilter ?
                "No hay resultados para tu búsqueda. Intenta con otros términos o quita los filtros." :
                "Aún no hay álbumes disponibles en la colección."}
        </p>
        {(searchTerm || activeFilter) && (
            <button
                onClick={() => { setSearchTerm(""); setActiveFilter(null); }}
                className="mt-4 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-all duration-200"
            >
                Limpiar búsqueda y filtros
            </button>
        )}
    </div>
    )
}