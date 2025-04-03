"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/common/ui/dialog"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { Label } from "@/common/ui/label"
import MapSearch from "@/common/molecules/mapSearch"
import FormRegisterBrands from "@/common/widgets/forms/auth/formRegisterBranches"


interface AddBranchModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (branch: Omit<any, "id" | "isOpen">) => void
}

export function AddBranchModal({ isOpen, onClose, onAdd }: AddBranchModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    latitude: "",
    longitude: "",
    address: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error al editar
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "El número de teléfono es requerido"
    }

    if (!formData.latitude) {
      newErrors.latitude = "La latitud es requerida"
    } else if (isNaN(Number(formData.latitude))) {
      newErrors.latitude = "La latitud debe ser un número"
    }

    if (formData.longitude && isNaN(Number(formData.longitude))) {
      newErrors.longitude = "La longitud debe ser un número"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onAdd({
        name: formData.name,
        phone_number: formData.phone_number,
        latitude: Number(formData.latitude),
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        address: formData.address || undefined,
      })

      // Resetear formulario
      setFormData({
        name: "",
        phone_number: "",
        latitude: "",
        longitude: "",
        address: "",
      })
    }
  }


 
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white shadow-xl border-none">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle className="text-amber-950">AGREGAR NUEVA SUCURSAL</DialogTitle>
        </DialogHeader>
          <FormRegisterBrands>

          </FormRegisterBrands>
          
     
      </DialogContent>
    </Dialog>
  )
}

