import React from "react"
import { Search } from "@/common/ui/icons"
import { Input } from "../ui/input"

interface SearchAction {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel?: string;
}

interface SearchProps extends React.ComponentProps<"input"> {
  className?: string;
  actions?: SearchAction[];
}

const SearchCoffee = ({className, actions = [], ...props}:SearchProps) => {
    return (
        <div className={`relative w-full flex items-center max-w-md md:max-w-5xl ${className}`}>
        <Search className="absolute left-3 text-gray-500 z-10" size={20} />
        <Input
          data-testid="custom-input-search"  
          className={`w-full rounded-full border-1 border-gray-100 pl-10 shadow-sm bg-white/80 backdrop-blur-sm relative before:absolute before:inset-0 before:rounded-full before:p-[1px] before:bg-gradient-to-r before:from-blue-300/50 before:via-purple-300/50 before:to-pink-300/50 before:content-[""] before:-z-10 focus-visible:ring-blue-300 ${actions.length > 0 ? 'pr-20' : ''}`}
          placeholder="Buscar cafeterías..."
          {...props}
        />
        {actions.length > 0 && (
          <div className="absolute right-2 flex gap-1 z-10">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                aria-label={action.ariaLabel}
              >
                {action.icon}
              </button>
            ))}
          </div>
        )}
      </div>
    )
}

export default SearchCoffee