
import { Input } from "@/common/ui/input";
import { Search, X } from "lucide-react"


interface SearchBranchesProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  } 

export const SearchBranches = ({searchQuery, setCurrentPage, setSearchQuery}:SearchBranchesProps) => {
    return ( 
        <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
        <Input
          type="search"
          placeholder="Buscar por nombre o dirección..."
          className="w-full pl-10 pr-4 py-2 
            border border-gray-200
            focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-transparent
            rounded-lg placeholder:text-sm text-gray-600 search-highlight:bg-gray-100
            transition-colors duration-200
            hover:border-gray-300"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={(e) => {
              setSearchQuery("")
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>
    )
}