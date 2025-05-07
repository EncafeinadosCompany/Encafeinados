"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog"
import FormRegisterBrands from "@/common/widgets/forms/auth/form_register_branches.widget"
import { Branch } from "@/api/types/branches/branches.types"
import { Description } from "@radix-ui/react-dialog"
import FormEditBrands from "@/common/widgets/forms/auth/form_edit_branches.widget"
import { Coffee } from "lucide-react"


interface AddBranchModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Branch | null
  mode: "add" | "edit"
}

export function AddBranchModal({ isOpen, onClose, initialData, mode }: AddBranchModalProps) {

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          id="branch-dialog"
          aria-labelledby="branch-dialog-title"
          aria-describedby="branch-dialog-description"
          className="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[95vw] 2xl:w-[45vw] max-h-[72vh] sm:max-h-[90vh] max-w-[90vh] bg-white shadow-xl border-none rounded-lg">

          <div className="p-4 relative">
            <div className="absolute opacity-5 -right-7 -top-6">
              <Coffee className="text-[#2B2B2B]" size={120} />
            </div>

            <DialogHeader className="flex flex-col items-center relative z-10">
              <div className="flex items-center justify-center mb-2">
                <div className="bg-[#DB8935] p-2 rounded-full mr-3">
                  <Coffee className="text-white" size={24} />
                </div>
                <DialogTitle className="text-[#020F17] font-semibold text-xl">
                  {mode === "add" ? "Nueva Sucursal" : "Editar Sucursal"}
                </DialogTitle>
              </div>
              <div className="flex items-center space-x-1 ">
                <div className="h-[2px] w-12 bg-[#DC3545]"></div>
                <div className="text-[#DB8935]">●</div>
                <div className="h-[2px] w-12 bg-[#DC3545]"></div>
              </div>
              <Description className="text-[#546F75] text-sm text-center max-w-xs">
                {mode === "add"
                  ? "Agrega una nueva ubicación para servir nuestro café de especialidad"
                  : "Actualiza la información de esta sucursal de café"}
              </Description>
            </DialogHeader>
          </div>


          <div className="bg-[#FAFAFA] sm:p-2 rounded-md border border-[#D4D4D4] shadow-inner relative z-10">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-3 text-[#DB8935] text-xs font-medium">
                FORMULARIO
              </div>
              {mode === "edit" ? (
                <FormEditBrands onClose={onClose} data={initialData} />
              ) : (
                <FormRegisterBrands onClose={onClose} />
              )}
            </div>

        </DialogContent>
      </Dialog>

    </>
  )
}

