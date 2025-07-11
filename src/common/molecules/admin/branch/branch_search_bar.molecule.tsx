import React from 'react'
import { Input } from '@/common/ui/input'
import { Search, X } from'@/common/ui/icons'

interface BranchSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export const BranchSearchBar = ({ value, onChange }: BranchSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder="Buscar sucursales..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-8 h-9 text-sm focus-visible:ring-amber-200 focus-visible:ring-2 focus-visible:ring-offset-0 border-gray-200"
      />
      {value && (
        <button
          className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
          onClick={() => onChange('')}
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}