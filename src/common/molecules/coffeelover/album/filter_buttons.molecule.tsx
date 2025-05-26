import { X, Filter } from "lucide-react";

interface FilterButtonsProps {
    uniqueTypes: string[];
    activeFilter: string | null;
    setActiveFilter: React.Dispatch<React.SetStateAction<string | null>>
    handleFilterClick: (type: string) => void;
}

export const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
        "arabica": "bg-green-50 text-green-700 border-green-100",
        "robusta": "bg-amber-50 text-amber-700 border-amber-100",
        "specialty": "bg-violet-50 text-violet-700 border-violet-100",
        "blend": "bg-blue-50 text-blue-700 border-blue-100",
        "limited": "bg-pink-50 text-pink-700 border-pink-100",
        "event": "bg-indigo-50 text-indigo-700 border-indigo-100",
        "annual": "bg-orange-50 text-orange-700 border-orange-100"
    };
    const baseType = type?.toLowerCase().split(' ')[0];
    return colorMap[baseType] || "bg-gray-50 text-gray-700 border-gray-100";
}

// Get icon color for active filters
export const getIconColor = (type: string) => {
    const colorMap: Record<string, string> = {
        "arabica": "text-green-500",
        "robusta": "text-amber-500",
        "specialty": "text-violet-500",
        "blend": "text-blue-500",
        "limited": "text-pink-500",
        "event": "text-indigo-500",
        "annual": "text-orange-500"
    };
    const baseType = type?.toLowerCase().split(' ')[0];
    return colorMap[baseType] || "text-gray-500";
}

const filter = (text: string) => {
    switch(text.toUpperCase()) {
        case "EVENT":
            return "EVENTOS";
        case "ANNUAL":
            return "ANUAL";
        default:
            return text;
    }
}

export const FilterButtons = ({ uniqueTypes, handleFilterClick, activeFilter, setActiveFilter }: FilterButtonsProps) => {
    return (
        <div className="mb-2">
            <div className="flex items-center gap-2 mb-3 mt-2">
                <Filter className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-medium text-gray-700">Filtros</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {uniqueTypes.map(type => (
                    <button
                        key={type}
                        onClick={() => handleFilterClick(type)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                            activeFilter === type
                                ? getTypeColor(type) + " shadow-sm"
                                : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 hover:border-amber-200"
                        }`}
                    >
                        {activeFilter === type && (
                            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${getIconColor(type)}`}></span>
                        )}
                        {filter(type)}
                        {activeFilter === type && (
                            <X className="h-3 w-3 ml-1.5 inline-block opacity-70" />
                        )}
                    </button>
                ))}
                
                {activeFilter && (
                    <button
                        onClick={() => setActiveFilter(null)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all duration-200 flex items-center"
                    >
                        <X className="h-3 w-3 mr-1 text-gray-400" />
                        Limpiar
                    </button>
                )}
            </div>
        </div>
    )
}