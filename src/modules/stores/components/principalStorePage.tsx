"use client"

import { useState, useEffect } from "react"
import { Search, PlusCircle, Store, RefreshCw, MapPin } from "lucide-react"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/common/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/common/ui/select"
import { Skeleton } from "@/common/ui/skeleton"
import { BranchCard } from "@/common/molecules/adminStores/brandCard"
import { AddBranchModal } from "./addBranches"
import {  AnimatePresence } from "framer-motion"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/common/ui/tooltip"
import { useBranchByStore } from "@/api/queries/stores/storesQueries"
import { Branch, BranchesResponse } from "@/api/types/branchesTypes"
import { use } from "chai"
import { Badge } from "@/common/ui/badge"



export function PrincipalStores() {
  // Estado para las sucursales
  // const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshAnimation, setRefreshAnimation] = useState(false)
  const storeId = localStorage.getItem("storeOrBranchId")

 
  const {data:branchesList} = useBranchByStore(Number(storeId)) 
  
  console.log('hola',branchesList)
  
  // Estado para el modal de agregar sucursal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Estado para el modal de detalles
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState("")

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [filteredBranches , setFilteredBranches] = useState<Branch[]>([]) 


useEffect(() => {
  if (branchesList) {
    setLoading(false)
     const data =  branchesList?.branches.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.address?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setFilteredBranches(data)
    }
    console.log(filteredBranches, 'gbbb')
},[branchesList, searchQuery])
 

  // Calcular sucursales para la página actual
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBranches = filteredBranches?.slice(indexOfFirstItem, indexOfLastItem) || []
  const totalPages = Math.ceil((filteredBranches?.length || 0) / itemsPerPage)



  // Función para ver detalles de una sucursal
  const viewBranchDetails = (branch:Branch) => {
    setSelectedBranch(branch)
  }

  // Función para cerrar el modal de detalles
  const closeDetails = () => {
    setSelectedBranch(null)
  }

  // Función para refrescar los datos (simulada)
  const handleRefresh = () => {
    setRefreshAnimation(true);
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      setRefreshAnimation(false);
    }, 1000);
  };


  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <div key={index} className="h-[220px]">
        <Card className="h-full">
          <CardContent className="p-4 h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div>
                  <Skeleton className="h-4 w-36 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <div className="space-y-3 mt-4">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="mt-6">
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    ));
  };

  // Renderizar mensaje cuando no hay resultados
  const renderEmptyState = () => {
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
            onClick={() => setSearchQuery("")}
            className="border-amber-200 text-amber-700"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Limpiar búsqueda
          </Button>
        ) : (
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-[#D4A76A] to-[#6F4E37] hover:opacity-90 text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Agregar primera sucursal
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className="border-none">
      <CardHeader className="bg-gradient-to-r from-amber-50 border-none to-orange-50/80 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#D4A76A]/20 to-[#6F4E37]/20 p-1.5 rounded-md">
              <Store className="h-5 w-5 text-[#6F4E37]" />
            </div>
            <CardTitle className="text-lg font-semibold text-[#6F4E37]">
              Gestión de Sucursales
            </CardTitle>
          </div>
          <Badge 
            variant="outline" 
            className="bg-amber-50/80 border-amber-200 text-amber-700 font-normal"
          >
            {filteredBranches.length} {filteredBranches.length === 1 ? "sucursal" : "sucursales"} 
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Buscar por nombre o dirección..."
              className="pl-8 border-gray-400 focus-visible:ring-amber-400 rounded-full placeholder:text-xs "
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
          
          <div className="flex gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleRefresh}
                    className="h-10 w-10 border-gray-200"
                    disabled={refreshAnimation}
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshAnimation ? 'animate-spin' : ''}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs font-medium bg-gray-800 text-gray-100 border-gray-700">
                  Actualizar
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#DB8935] text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar Sucursal
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {renderSkeletons()}
          </div>
        ) : currentBranches.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {currentBranches.map((branch, index) => (
                <BranchCard 
                  key={branch.id} 
                  branch={branch} 
                  onViewDetails={() => viewBranchDetails(branch)}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
      
      {(filteredBranches?.length || 0) > itemsPerPage && (
        <CardFooter className="border-t border-gray-100 py-3 px-5 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredBranches?.length || 0)} de {filteredBranches?.length || 0}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="h-8 w-8 p-0 border-gray-200"
            >
              <span className="sr-only">Página anterior</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8 p-0 border-gray-200"
            >
              <span className="sr-only">Página siguiente</span>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
            
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-16 h-8 text-xs border-gray-200">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="9">9</SelectItem>
                <SelectItem value="12">12</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardFooter>
      )}

      {/* Modal para agregar sucursal */}
      <AddBranchModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}/>

      {/* Modal para ver detalles (Descomentado al estar implementado) */}
      {/* {selectedBranch && <BranchDetails branch={selectedBranch} isOpen={!!selectedBranch} onClose={closeDetails} />} */}
    </Card>
  )
}

