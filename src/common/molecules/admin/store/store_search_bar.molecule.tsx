import React from "react";
import { Input } from "@/common/ui/input";
import { Search } from'@/common/ui/icons';

interface StoreSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const StoreSearchBar = ({ value, onChange }: StoreSearchBarProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
      <Input 
        placeholder="Buscar..." 
        className="pl-7 h-7 text-xs bg-white border-gray-200 rounded-md focus-visible:ring-1 focus-visible:ring-amber-400 w-full" 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};