import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'
import { usePendingBranchesQuery } from '@/api/queries/stores/branchesQueries'
import { PendingBranch } from '@/api/types/branchesTypes'
import { useForm } from 'react-hook-form'

export const usePendingBranchesWidget = () => {
  // Query de datos - Asegúrate de extraer refetch
  const { data = [], isLoading, error, refetch } = usePendingBranchesQuery()
  
  // Estados para manejo de UI
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBranch, setSelectedBranch] = useState<PendingBranch | null>(null)
  const [refreshAnimation, setRefreshAnimation] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  
  // Para rechazar
  const [rejectReason, setRejectReason] = useState('')
  const [rejectFormOpen, setRejectFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Diálogo de confirmación
  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    action: '',
    branchId: 0
  })
  
  // Formulario de rechazo
  const methods = useForm({
    defaultValues: {
      reason: ''
    }
  })

  // Filtrar sucursales por término de búsqueda
  const filteredBranches = data
    ? data.filter(branch => 
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (branch.address?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      )
    : []

  // Calcular total de páginas
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage)
  
  // Obtener sucursales para la página actual
  const paginatedBranches = filteredBranches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  
  // Si cambia la búsqueda, volver a la primera página
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])
  
  // Refrescar datos
  const handleRefresh = useCallback(() => {
    setRefreshAnimation(true)
    refetch()
      .then(() => {
        toast.success('Datos actualizados')
      })
      .catch(() => {
        toast.error('Error al actualizar')
      })
      .finally(() => {
        setTimeout(() => setRefreshAnimation(false), 500)
      })
  }, [refetch])
  
  // Cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  // Ver detalles de sucursal - Corregir el tipo de parámetro
  const handleViewDetails = (branch: PendingBranch) => {
    setSelectedBranch(branch)
  }
  
  // Preparar para aprobar - Corregir el tipo de parámetro
  const handleApprove = (branch: PendingBranch) => {
    setConfirmationDialog({
      isOpen: true,
      action: 'approve',
      branchId: branch.id
    })
  }
  
  // Preparar para rechazar - Corregir el tipo de parámetro
  const handleReject = (branch: PendingBranch) => {
    setSelectedBranch(branch)
    setRejectFormOpen(true)
  }
  
  // Enviar formulario de rechazo
  const onRejectFormSubmit = (data: { reason: string }) => {
    setRejectReason(data.reason)
    setRejectFormOpen(false)
    setConfirmationDialog({
      isOpen: true,
      action: 'reject',
      branchId: selectedBranch?.id || 0
    })
  }
  
  // Confirmar acción (aprobar o rechazar)
  const confirmAction = () => {
    // Por ahora solo simulamos la acción y mostramos un toast
    setIsSubmitting(true)
    
    setTimeout(() => {
      const actionText = confirmationDialog.action === 'approve' ? 'aprobada' : 'rechazada'
      toast.success(`Sucursal ${actionText} correctamente`)
      
      setIsSubmitting(false)
      setConfirmationDialog({...confirmationDialog, isOpen: false})
      setSelectedBranch(null)
      
      // Refrescar datos después de la acción
      handleRefresh()
    }, 1000)
  }
  
  return {
    // Data - Asegúrate de incluir refetch aquí
    data,
    isLoading,
    error,
    refetch,
    filteredBranches,
    paginatedBranches,
    totalPages,
    
    // State
    searchTerm,
    selectedBranch,
    confirmationDialog,
    refreshAnimation,
    rejectReason,
    rejectFormOpen,
    isSubmitting,
    currentPage,
    itemsPerPage,
    
    // Form
    methods,
    
    // Actions
    setSearchTerm,
    setSelectedBranch,
    setConfirmationDialog,
    setRejectFormOpen,
    setItemsPerPage,
    handlePageChange,
    handleApprove,
    handleReject,
    handleViewDetails,
    handleRefresh,
    onRejectFormSubmit,
    confirmAction
  }
}