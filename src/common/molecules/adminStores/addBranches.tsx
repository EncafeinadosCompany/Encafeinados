"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog"
import FormRegisterBrands from "@/common/widgets/forms/auth/formRegisterBranches"
import { Branch } from "@/api/types/branchesTypes"
import { Description } from "@radix-ui/react-dialog"
import FormEditBrands from "@/common/widgets/forms/auth/formEditBranches"


interface AddBranchModalProps {
  isOpen: boolean
  onClose: () => void
  initialData: Branch | null
  mode: "add" | "edit"
}

export function AddBranchModal({ isOpen, onClose, initialData, mode }: AddBranchModalProps) {


  console.log("initialData", initialData, "mode", mode)
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          id="branch-dialog"
          aria-labelledby="branch-dialog-title"
          aria-describedby="branch-dialog-description"
          className="w-[95vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] 2xl:w-[45vw] max-h-[90vh]  bg-white shadow-xl border-none rounded-lg p-4 sm:p-6 md:p-8">
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-amber-950">
              {mode === "add" ? "AGREGAR NUEVA SUCURSAL" : "EDITAR SUCURSAL"}
            </DialogTitle>
          </DialogHeader>
          <Description className="mx-auto"> Formulario para {mode === "add" ? "agregar" : "editar"} una sucursal.</Description>


          {
            mode === "edit" ? (
              <FormEditBrands onClose={onClose} data={initialData}></FormEditBrands>
            ) : (
              <FormRegisterBrands onClose={onClose}></FormRegisterBrands>
            )

          }

        </DialogContent>
      </Dialog>

    </>
  )
}

