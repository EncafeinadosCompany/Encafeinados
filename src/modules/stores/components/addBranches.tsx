"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/common/ui/dialog"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { Label } from "@/common/ui/label"
import MapSearch from "@/common/molecules/mapSearch"


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


  const onLocationSelect = (lat: number, lng: number, address: string) =>{
    console.log(lat, lng, address)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white shadow-xl border-none">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>Agregar Nueva Sucursal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* <div className="space-y-2">
            <Label htmlFor="name">
              Nombre <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">
              Número de Teléfono <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={errors.phone_number ? "border-destructive" : ""}
            />
            {errors.phone_number && <p className="text-xs text-destructive">{errors.phone_number}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <MapSearch
                 onLocationSelect={onLocationSelect}
               ></MapSearch>
            </div>

          </div> */}

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" name="address" value={formData.address} onChange={handleChange} />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" className="bg-red-900 text-white" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="bg-[#DB8935] text-white" type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

