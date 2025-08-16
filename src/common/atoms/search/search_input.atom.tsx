import { Search, X } from "lucide-react";
import { Input } from "@/common/ui/input";
import { Button } from "@/common/ui/button";
import { useState, useCallback, useEffect } from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
  debounceMs = 300,
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Efecto para sincronizar valor externo con local
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce para optimizar búsquedas
  useEffect(() => {
    if (localValue === value) return;
    
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange, debounceMs]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
  }, [onChange]);

  return (
    <div className={`relative group ${className}`}>
      <div className={`
        absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-200
        ${isFocused || localValue ? 'text-[#8B5A2B]' : 'text-gray-400'}
      `}>
        <Search className="h-4 w-4" />
      </div>
      
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={handleInputChange}
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
      
      {localValue && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className={`
            absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 rounded-lg
            hover:bg-[#DB8935]/10 text-gray-400 hover:text-[#8B5A2B] 
            transition-all duration-200 opacity-0 group-hover:opacity-100
            ${localValue ? 'opacity-100' : ''}
          `}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};
