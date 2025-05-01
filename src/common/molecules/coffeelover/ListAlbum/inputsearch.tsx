import { Search, X } from "lucide-react"

interface InputSearchProps {
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}


export const InputSearch = ({searchTerm, setSearchTerm}:InputSearchProps) => {



    return (
        <div className="relative w-full md:w-72 lg:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-amber-500" />
        </div>
        <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            className="pl-10 pr-4 py-3 w-full border border-amber-200 rounded-xl bg-white/90 
                focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500
                shadow-sm transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
            <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-500 hover:text-amber-700"
                onClick={() => setSearchTerm("")}
            >
                <X className="h-5 w-5" />
            </button>
        )}
    </div>
    )
}