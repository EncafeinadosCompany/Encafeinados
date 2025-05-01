import { X } from "lucide-react";

interface FilterButtonsProps {
    uniqueTypes: string[];
    activeFilter: string | null;
    setActiveFilter: React.Dispatch<React.SetStateAction<string | null>>
    handleFilterClick: (type: string) => void;
}

export const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
        "arabica": "bg-emerald-100 text-emerald-800 border-emerald-200",
        "robusta": "bg-amber-100 text-amber-800 border-amber-200",
        "specialty": "bg-purple-100 text-purple-800 border-purple-200",
        "blend": "bg-blue-100 text-blue-800 border-blue-200",
        "limited": "bg-rose-100 text-rose-800 border-rose-200"
    };
    const baseType = type?.toLowerCase().split(' ')[0];
    return colorMap[baseType] || "bg-slate-100 text-slate-800 border-slate-200";

}

export const FilterButtons = ({ uniqueTypes, handleFilterClick, activeFilter, setActiveFilter }: FilterButtonsProps) => {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {uniqueTypes.map(type => (
                <button
                    key={type}
                    onClick={() => handleFilterClick(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${activeFilter === type
                        ? getTypeColor(type) + " shadow-md"
                        : "bg-white/70 border-slate-200 text-slate-600 hover:border-amber-300"
                        }`}
                >
                    {type}
                    {activeFilter === type && (
                        <X className="h-3 w-3 ml-2 inline-block" />
                    )}
                </button>
            ))}
            {activeFilter && (
                <button
                    onClick={() => setActiveFilter(null)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all duration-200"
                >
                    Limpiar filtros
                </button>
            )}
        </div>
    )
}