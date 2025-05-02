import { FeaturedStoresWidget } from '@/common/widgets/coffeelovers/featureStoresWidget'
import SearchCoffee from '@/common/atoms/search';
import { useState, useCallback } from 'react';
import { Coffee, MapPin } from 'lucide-react';
import { CoffeeBackground } from '@/common/widgets/CoffeeBackground';


const PrincipalCoffeelover = () => {
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  
  const handleGlobalSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalSearchTerm(e.target.value);
  }, []);

  return (
    <div className='flex flex-col max-w-full overflow-hidden'>
       <CoffeeBackground 
        coffeeCount={10} 
        circleCount={6}
        opacity={70} 
        zIndex={0}
        gradientFrom="#FFFDF9"
        gradientTo="#FAF3E0"
      />
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md px-4 pt-4 pb-2 border-b border-amber-100 shadow-sm">
        <div className="flex flex-col gap-3 max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-amber-100 to-amber-50 p-1.5 rounded-lg">
                <Coffee className="h-5 w-5 text-amber-700" />
              </div>
              <h1 className="text-lg font-semibold text-[#2C1810]">Descubre cafeterías</h1>
            </div>
            <div className="flex items-center">
              <div className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Explora lugares</span>
              </div>
            </div>
          </div>
          
          <SearchCoffee
            value={globalSearchTerm}
            onChange={handleGlobalSearchChange}
            className="mb-2"
            placeholder="Buscar cafeterías..."
          />
        </div>
      </div>
      
      <div className="flex flex-col p-4 gap-6 max-w-5xl mx-auto w-full">
        <FeaturedStoresWidget 
          globalSearchTerm={globalSearchTerm} 
          setGlobalSearchTerm={setGlobalSearchTerm}
        />
      </div>
    </div>
  )
}

export default PrincipalCoffeelover