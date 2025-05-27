import React from "react"
import { MapPin, Search, SlidersHorizontal } from "@/common/ui/icons"
import { Input } from "../ui/input"
import { Link } from "react-router-dom"

interface SearchProps extends React.ComponentProps<"input"> {
  className?: string;
}

const SearchCoffee = ({className, ...props}:SearchProps) => {
    return (
        <div className={`relative w-full flex items-center max-w-md  md:max-w-5xl ${className}`}>
        <Search className="absolute left-3 text-gray-500 z-10" size={20} />
        <Input
          data-testid="custom-input-search"  
          className='w-full rounded-full border-1 border-gray-100 pl-10 shadow-sm bg-white/80 backdrop-blur-sm relative before:absolute before:inset-0 before:rounded-full before:p-[1px] before:bg-gradient-to-r before:from-blue-300/50 before:via-purple-300/50 before:to-pink-300/50 before:content-[""] before:-z-10 focus-visible:ring-blue-300'
          placeholder="Buscar cafeterías..."
          {...props}
        />
        <div className="absolute right-3 flex gap-2 z-10">
          <SlidersHorizontal className="text-gray-500 cursor-pointer" size={20} />
          <Link to='/coffeelover/map-coffelover'>
            <MapPin className="text-blue-500 cursor-pointer" size={20} />
          </Link>
        </div>
      </div>
    )
}

export default SearchCoffee