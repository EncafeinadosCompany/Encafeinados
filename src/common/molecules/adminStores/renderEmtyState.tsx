import { Button } from "@/common/ui/button";
import { MapPin, PlusCircle, RefreshCw } from "lucide-react";


interface Props {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const renderEmptyState = ({searchQuery, setSearchQuery, setIsAddModalOpen}: Props) => {


  const handleClearSearch = () => {
  
    setSearchQuery('');
  };
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <div className="h-16 w-16 rounded-full bg-amber-50 flex items-center justify-center mb-3">
          <MapPin className="h-7 w-7 text-amber-600" />
        </div>
        <h3 className="text-lg font-medium text-[#6F4E37] mb-1">No se encontraron sucursales</h3>
        <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
          {searchQuery 
            ? `No hay resultados para "${searchQuery}". Intenta con otra búsqueda.`
            : "Aún no has agregado ninguna sucursal a tu tienda."
          }
        </p>
        {searchQuery ? (
          <Button 
            variant="outline" 
            onClick={handleClearSearch}
            className="border-amber-200 text-amber-700"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Limpiar búsqueda
          </Button>
        ) : (
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] hover:opacity-90 text-white">
            <PlusCircle className="h-4 w-4 mr-2" />
            Agregar primera sucursal
          </Button>
        )}
      </div>
    );
  };