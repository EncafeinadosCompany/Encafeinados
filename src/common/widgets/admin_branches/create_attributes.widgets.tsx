"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/common/ui/badge"
import { Button } from "@/common/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/ui/dialog"
import { Input } from "@/common/ui/input"
import { X, AlertCircle, Coffee } from "lucide-react"
import { useAttributes } from "@/api/queries/attributes/attributes.query"
import { Attribute, RegisterAttibute } from "@/api/types/attributes/attributes.type"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/common/ui/form"
import { SelectAttributes } from "@/common/molecules/admin_branch/attributes/select_attributes.molecule"
import { TooltipAttributes } from "@/common/molecules/admin_branch/attributes/tooltip_attributes.molecule"
import { CardAttributes } from "@/common/molecules/admin_branch/attributes/card_attributes.molecule"
import { DetailsAttributes } from "@/common/molecules/admin_branch/attributes/details_attributes.molecule"
import { AttributeFormType, RegisterAttributeSchema } from "@/common/utils/schemas/attributes/create_attributes.schema"
import { useCreateAttributeMutation } from "@/api/mutations/attributes/attributes.mutation"


export default function CanvasDashboard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedBadges, setSelectedBadges] = useState<string[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<Attribute[]>([])
    const [selectedAttributes, setSelectedAttributes] = useState<RegisterAttibute[]>([])
    const [badges, setBadges] = useState<RegisterAttibute[]>([])
    const {mutateAsync:useAttribute} =  useCreateAttributeMutation()
    const method = useForm<AttributeFormType>({
        resolver: zodResolver(RegisterAttributeSchema),
        defaultValues: {
            values: []
        }
    })
    
    const { data: attribute } = useAttributes()
    const [attributes, setAttributes] = useState<Attribute[]>([])

    useEffect(() => {
        if (attributes) {
            setAttributes(attribute || [])
        }
    }, [attribute])

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Obtener los tipos de badges que ya están en el canvas
    const usedTypes = badges.map((badge) => badge.attributeId)

    // Filtrar las opciones disponibles (excluir las que ya están en el canvas)
    const availableOptions = attributes.filter((option) => !usedTypes.includes(option.id))

    const handleMultiSelectChange = (option:Attribute) => {
        setSelectedOptions((prev) => {
            const isSelected = prev.some(item => item.id=== option.id);
            return isSelected ? prev.filter(item => item.id !== option.id) : [...prev, option];
        });
    }


    const onSubmit = (data: AttributeFormType) => {
        setBadges(prev => {
            const updatedBadges = [...prev];
            data.values.forEach(newBadge => {
                const existingIndex = updatedBadges.findIndex(b => b.id === newBadge.id);
                if (existingIndex !== -1) {
                    // Update existing badge
                    updatedBadges[existingIndex] = {
                        ...updatedBadges[existingIndex],
                        value: newBadge.value
                    };
                } else {
                    // Add new badge
                    updatedBadges.push(newBadge);
                }
            });
            return updatedBadges;
        });

        setIsDialogOpen(false)
        setSelectedAttributes([])
        method.reset()
    }


    const handleDragStart = (e: React.MouseEvent, badge: RegisterAttibute) => {
        e.preventDefault()
        if (!canvasRef.current) return

        if (!selectedBadges.includes(badge.id) && !e.ctrlKey && !e.shiftKey) {
            setSelectedBadges([badge.id])
        }

        setIsDragging(true)
    }

    const handleAddSelectedOptions = () => {
        if (selectedOptions.length === 0) return

        const timestamp = Date.now()
        const newBadges = selectedOptions.map((type, index) => ({
            id: `${timestamp}-${index}`,
            attributeId: type.id,
            type: type.name,
            value: ""
        }))

        setSelectedAttributes(newBadges)
        method.reset({
            values: newBadges.map(badge => ({
                id: badge.id,
                attributeId: badge.attributeId,
                type: badge.type,
                value: badge.value
            }))
        })
        setIsDialogOpen(true)
        setIsMultiSelectOpen(false)
        setSelectedOptions([])
    }
    const handleSubmit = () => {
         console.log('valores', badges)
        useAttribute(badges)
        setBadges([])
        method.reset()
    }


    const handleBadgeDoubleClick = (badge: RegisterAttibute) => {
        const formValues = {
            values: [{
                id: badge.id,
                attributeId: badge.attributeId,
                type: badge.type,
                value: badge.value
            }]
        }
        method.reset(formValues)
        setSelectedAttributes([badge])
        setIsDialogOpen(true)
    }

    const handleRemoveBadge = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setBadges(badges.filter((badge) => badge.id !== id))
        setSelectedBadges((prev) => prev.filter((badgeId) => badgeId !== id))
    }


    // Función para obtener el nombre legible del tipo de badge
    const getTypeLabel = (type: string) => {
        const option = attributes.find((opt) => opt.name === type)
        return option ? option.name : type
    }


    // Ordenar badges por tipo y luego por fecha de creación
    const sortedBadges = [...badges].sort((a, b) => {
        // Primero ordenar por tipo
        const typeComparison = a.type.localeCompare(b.type)
        if (typeComparison !== 0) return typeComparison

        // Si el tipo es igual, ordenar por fecha de creación
        return (a.createdAt ?? 0) - (b.createdAt ?? 0)
    })

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <div className="mb-6 flex justify-between">
                <SelectAttributes
                    selectedOptions={selectedOptions}
                    setSelectedOptions={setSelectedOptions}
                    isMultiSelectOpen={isMultiSelectOpen}
                    setIsMultiSelectOpen={setIsMultiSelectOpen}
                    handleMultiSelectChange={handleMultiSelectChange}
                    availableOptions={availableOptions}
                    handleAddSelectedOptions={handleAddSelectedOptions}
                />
                <Button
                    className="bg-[#43765C] hover:bg-[#386048] text-white transition-all"
                    onClick={()=>handleSubmit()}
                >
                    Completar registro
                </Button>
            </div>

            <TooltipAttributes
                selectedBadges={selectedBadges}
                availableOptions={availableOptions}
            />

            <CardAttributes
                containerRef={containerRef}
                canvasRef={canvasRef}
                badges={badges}
                handleBadgeDoubleClick={handleBadgeDoubleClick}
                handleDragStart={handleDragStart}
                handleRemoveBadge={handleRemoveBadge}
                getTypeLabel={getTypeLabel}
                selectedBadges={selectedBadges}
                availableOptions={availableOptions}
            ></CardAttributes>

            {selectedBadges.length === 1 && (
                <DetailsAttributes
                    handleBadgeDoubleClick={handleBadgeDoubleClick}
                    selectedBadges={selectedBadges}
                    getTypeLabel={getTypeLabel}
                    badges={badges}
                ></DetailsAttributes>
            )}

            {selectedBadges.length > 1 && (
                <div className="mt-4 p-4 border rounded-md bg-slate-50">
                    <h3 className="font-medium mb-2">Elementos seleccionados:</h3>
                    <p>{selectedBadges.length} elementos seleccionados</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {/* Mostrar badges seleccionados en orden */}
                        {sortedBadges
                            .filter((badge) => selectedBadges.includes(badge.id))
                            .map((badge) => (
                                <Badge key={badge.id} variant="outline">
                                    {getTypeLabel(badge.type)}
                                    {badge.value ? `: ${badge.value}` : ""}
                                </Badge>
                            ))}
                    </div>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-white/95 backdrop-blur-sm border-2 border-[#D4A76A]/20 shadow-xl rounded-xl max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-[#6F4E37] text-xl font-bold flex items-center gap-2">
                            <Coffee className="h-5 w-5 text-[#D4A76A]" />
                            {selectedAttributes.length === 1
                                ? `¿Cuenta con ${getTypeLabel(selectedAttributes[0].type)}?`
                                : "Configurar atributos seleccionados"}
                        </DialogTitle>
                    </DialogHeader>
                    <motion.div
                        className="py-2 overflow-y-auto max-h-[410px] p-3"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Form {...method}>
                            <form onSubmit={method.handleSubmit(onSubmit)} className="space-y-4">
                                {selectedAttributes.map((attr, index) => (
                                    <FormField
                                        key={attr.id}
                                        control={method.control}
                                        name={`values.${index}.value`}
                                        render={({ field, formState }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#6F4E37] font-medium">
                                                    {getTypeLabel(attr.type)}
                                                </FormLabel>
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {attributes.find(e => e.name === attr.type)?.description}
                                                </p>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder={`Ingresa el valor para ${getTypeLabel(attr.type)}`}
                                                        className={`border-2 ${formState.errors.values?.[index]
                                                            ? "border-red-800 focus:border-red-800"
                                                            : "border-[#D4A76A]/30 focus:border-[#D4A76A]"
                                                            }`}
                                                    />
                                                </FormControl>
                                                {formState.errors.values?.[index]?.value?.message && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="bg-red-50 text-red-600 px-3 py-2 rounded-md flex items-center gap-2 mt-2 border border-red-200"
                                                    >
                                                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                                        <span className="text-sm text-red-500">
                                                            {formState.errors.values[index].value?.message}
                                                        </span>
                                                    </motion.div>
                                                )}

                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <div className="flex justify-between items-center pt-4 mt-6 border-t border-[#D4A76A]/20">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsDialogOpen(false)
                                            setSelectedAttributes([])
                                        }}
                                        className="bg-white hover:bg-gray-50 border-2 border-[#D4A76A] text-[#6F4E37] transition-all duration-200"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-[#43765C] to-[#386048] hover:from-[#386048] hover:to-[#2D4F3B] text-white shadow-md hover:shadow-lg transition-all duration-200"
                                    >
                                        <Coffee className="h-4 w-4 mr-2" />
                                        {selectedAttributes.length === 1 ? 'Guardar' : 'Guardar todos'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </motion.div>
                </DialogContent>
            </Dialog>

            <div className="mt-6 text-sm text-slate-500">
                <p>Instrucciones:</p>
                <ul className="list-disc pl-5 mt-1">
                    <li>Haz clic en "Selecciona elementos para añadir" para abrir el menú de selección</li>
                    <li>Solo se muestran los elementos que aún no están en el canvas</li>
                    <li>Marca las casillas de los elementos que quieras añadir y haz clic en "Añadir al canvas"</li>
                    <li>Arrastra los badges para moverlos por el canvas</li>
                    <li>Haz doble clic en un badge para editar su valor</li>
                    <li>Haz clic en la X para eliminar un badge (esto liberará el tipo para poder añadirlo nuevamente)</li>
                </ul>
            </div>
        </div>
    )
}
