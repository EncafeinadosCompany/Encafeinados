"use client"
import { Button } from "@/common/ui/button"
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from "@/common/ui/dialog"
import { AlertTriangle } from'@/common/ui/icons'

interface BranchStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentStatus: boolean;
    onConfirm: () => void;
    message?: string;
}

export default function BranchStatusModal({ isOpen, onClose, currentStatus, onConfirm, message}: BranchStatusModalProps) {
    const newStatus = currentStatus === true ? "cerrada" : "abierta"

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-white rounded-lg shadow-lg border-none">
            <DialogHeader className="space-y-3">
                <DialogTitle className="flex items-center gap-3 text-xl">
                    <div className={`p-2 rounded-full ${currentStatus ? 'bg-red-100' : 'bg-green-100'}`}>
                        <AlertTriangle className={`h-6 w-6 ${currentStatus ? 'text-red-500' : 'text-green-500'}`} />
                    </div>
                    <span>{currentStatus ? 'Cerrar' : 'Abrir'} Sucursal</span>
                </DialogTitle>
                <DialogDescription className="text-gray-600 text-base">
                {message || `¿Está seguro que desea ${currentStatus ? "cerrar" : "abrir"} la sucursal?`}
                </DialogDescription>
            </DialogHeader>

            <div className="py-6 px-2">
                <p className={`p-4 rounded-lg ${currentStatus ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    Al confirmar esta acción, la sucursal quedará <strong>{newStatus}</strong> y se actualizará su estado en el sistema.
                </p>
            </div>

            <DialogFooter className="flex sm:justify-between gap-3">
                <Button
                    variant="outline"
                    onClick={onClose}
                    className="hover:bg-gray-100"
                >
                    Cancelar
                </Button>
                <Button
                    onClick={onConfirm}
                    className={`${currentStatus
                        ? 'bg-rose-400 hover:bg-rose-500'
                        : 'bg-emerald-400 hover:bg-emerald-500'}`}
                >
                    Sí, {currentStatus ? "cerrar" : "abrir"} sucursal
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}