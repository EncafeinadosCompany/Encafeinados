"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { BranchCard } from "@/common/molecules/adminStores/brandCard"
import { AddBranchModal } from "./addBranches"
// import { BranchCard } from "@/common/branch-card"
// import { AddBranchModal } from "@/common/add-branch-modal"
// import { BranchDetails } from "@/common/branch-details"
// import { Pagination } from "@/components/pagination"

// Tipo para la estructura de una sucursal
export type Branch = {
  id: string
  name: string
  phone_number: string
  latitude: number
  longitude?: number
  isOpen: boolean
  address?: string
}

export function PrincipalStores() {
  // Estado para las sucursales
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: "1",
      name: "Aroma Montaña - Poblado",
      phone_number: "123456789",
      latitude: 6.210296692451014,
      longitude: -75.5673828,
      isOpen: true,
      address: "Calle 10 #43-12, El Poblado",
    },
    {
      id: "2",
      name: "Aroma Montaña - Laureles",
      phone_number: "987654321",
      latitude: 6.2450422,
      longitude: -75.5918271,
      isOpen: false,
      address: "Carrera 76 #33-24, Laureles",
    },
    {
      id: "3",
      name: "Aroma Montaña - Centro",
      phone_number: "456789123",
      latitude: 6.2518401,
      longitude: -75.5636038,
      isOpen: true,
      address: "Calle 50 #45-12, Centro",
    },
  ])

  // Estado para el modal de agregar sucursal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // Estado para el modal de detalles
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)

  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState("")

  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filtrar sucursales por búsqueda
  const filteredBranches = branches.filter(
    (branch) =>
      branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      branch.address?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calcular sucursales para la página actual
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBranches = filteredBranches.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage)

  // Función para agregar una nueva sucursal
  const addBranch = (branch: Omit<Branch, "id" | "isOpen">) => {
    const newBranch: Branch = {
      ...branch,
      id: (branches.length + 1).toString(),
      isOpen: false,
    }
    setBranches([...branches, newBranch])
    setIsAddModalOpen(false)
  }

  // Función para ver detalles de una sucursal
  const viewBranchDetails = (branch: Branch) => {
    setSelectedBranch(branch)
  }

  // Función para cerrar el modal de detalles
  const closeDetails = () => {
    setSelectedBranch(null)
  }

  return (
    <div className="space-y-6  ">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full mt-4 sx:ml-12 xl:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar sucursales..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1) // Resetear a la primera página al buscar
            }}
          />
        </div>
        <Button className="m-4 bg-black text-white" onClick={() => setIsAddModalOpen(true)}>Agregar Sucursal</Button>
      </div>

      {currentBranches.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">No se encontraron sucursales</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentBranches.map((branch) => (
            <BranchCard key={branch.id} branch={branch} onViewDetails={() => viewBranchDetails(branch)} />
          ))}
        </div>
      )}

      {/* {filteredBranches.length > itemsPerPage && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )} */}

      {/* Modal para agregar sucursal */}
      <AddBranchModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={addBranch} />

      {/* Modal para ver detalles */}
      {/* {selectedBranch && <BranchDetails branch={selectedBranch} isOpen={!!selectedBranch} onClose={closeDetails} />} */}
    </div>
  )
}

