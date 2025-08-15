import { Search, X } from "lucide-react";
import { Input } from "@/common/ui/input";
import { Button } from "@/common/ui/button";
import { useState } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative group ${className}`}>
      <div className={`
        absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-200
        ${isFocused || value ? 'text-[#8B5A2B]' : 'text-gray-400'}
      `}>
        <Search className="h-4 w-4" />
      </div>
      
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          pl-10 pr-10 h-11 rounded-xl border-2 transition-all duration-200 bg-white/80 backdrop-blur-sm
          ${isFocused 
            ? 'border-[#DB8935]/40 shadow-md shadow-[#DB8935]/10 bg-white' 
            : 'border-gray-200/60 hover:border-[#DB8935]/20'
          }
          focus:ring-0 focus:ring-offset-0
          placeholder:text-gray-400 placeholder:font-normal
        `}
      />
      
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange("")}
          className={`
            absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-lg
            hover:bg-[#DB8935]/10 text-gray-400 hover:text-[#8B5A2B] 
            transition-all duration-200 opacity-0 group-hover:opacity-100
            ${value ? 'opacity-100' : ''}
          `}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};
