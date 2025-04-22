"use client"

import { useState, useEffect } from "react"
import { Search, PlusCircle, Store, RefreshCw, MapPin, X } from "lucide-react"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/common/ui/card"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/common/ui/select"
import { BranchCard } from "@/common/molecules/adminStores/brandCard"
import { AddBranchModal } from "./addBranches"
import { AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/ui/tooltip"
import { useBranchByStore } from "@/api/queries/stores/storesQueries"
import { Branch } from "@/api/types/branchesTypes"

import { Badge } from "@/common/ui/badge"
import { renderSkeletons } from "@/common/molecules/adminStores/renderSkeletons"
import { renderEmptyState } from "@/common/molecules/adminStores/renderEmtyState"
import { BranchDetails } from "./branchDetails"




export default function PrincipalStores() {
  // Estado para las sucursales
  // const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshAnimation, setRefreshAnimation] = useState(false)
  const storeId = localStorage.getItem("storeOrBranchId")


  const { data: branchesList } = useBranchByStore(Number(storeId))

  // Estado para el modal de agregar sucursal
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Estado para el modal de detalles
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)


  const [isEditing, setIsEditing] = useState(false)
  const [BranchEdit, setBranchEdit] = useState<Branch | null>(null)
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false)

  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState("")

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>([])


  useEffect(() => {
    if (branchesList) {
      setLoading(false)
      const data = branchesList?.branches.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          branch.address?.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setFilteredBranches(data)
    }
  }, [branchesList, searchQuery])


  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBranches = filteredBranches?.slice(indexOfFirstItem, indexOfLastItem) || []
  const totalPages = Math.ceil((filteredBranches?.length || 0) / itemsPerPage)

  const viewBranchDetails = (branch: Branch) => {
    setSelectedBranch(branch)
    setIsFormDialogOpen(true)
 
  }

  const closeDetails = () => {
    setSelectedBranch(null)
  }


  const handleRefresh = () => {
    setRefreshAnimation(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setRefreshAnimation(false);
    }, 1000);
  };


  const handleEditClick = (card: Branch) => {
    setIsEditing(true)
    setBranchEdit(card)
    setIsAddModalOpen(true)
  }

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
          renderEmptyState({ searchQuery, setSearchQuery, setIsAddModalOpen })
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {currentBranches.map((branch, index) => (
                <BranchCard
                  key={branch.id}
                  branch={branch}
                  onViewDetails={() => viewBranchDetails(branch)}
                  onEdit={() => handleEditClick(branch)}
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

      {/* MODALS */}

      <AddBranchModal isOpen={isAddModalOpen} onClose={() => {setIsAddModalOpen(false), setIsEditing(false)}} initialData={isEditing ? BranchEdit: null}  mode={isEditing ? "edit" : "add"}/>


      {selectedBranch && <BranchDetails branch={selectedBranch} isOpen={!!selectedBranch} onClose={closeDetails} />}
    </Card>
  )
}

