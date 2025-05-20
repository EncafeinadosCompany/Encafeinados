"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/common/ui/badge"
import { Dialog} from "@/common/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { FormAttributes } from "@/common/molecules/admin_branch/attributes/form_atributes.molecule"
import { SelectAttributes } from "@/common/molecules/admin_branch/attributes/select_attributes.molecule"
import { TooltipAttributes } from "@/common/molecules/admin_branch/attributes/tooltip_attributes.molecule"
import { CardAttributes } from "@/common/molecules/admin_branch/attributes/card_attributes.molecule"
import { DetailsAttributes } from "@/common/molecules/admin_branch/attributes/details_attributes.molecule"

import { Attribute,RegisterAttibute } from "@/api/types/attributes/attributes.type"
import { useAttributes, useBranchAttributes } from "@/api/queries/attributes/attributes.query"
import { AttributeFormType, RegisterAttributeSchema } from "@/common/utils/schemas/attributes/create_attributes.schema"
import { useCreateAttributeMutation } from "@/api/mutations/attributes/attributes.mutation"
import { getAuthStorage } from "@/common/utils/auth_storage.utils"

export default function AttributesDashboard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedBadges, setSelectedBadges] = useState<string[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<Attribute[]>([])
    const [badges, setBadges] = useState<RegisterAttibute[]>([])
    const {storeOrBranch} = getAuthStorage()
    const [attributes, setAttributes] = useState<Attribute[]>([])
    const [selectedAttributes, setSelectedAttributes] = useState<RegisterAttibute[]>([])
    
    if(!storeOrBranch) return null
    const {data:attributesByID}=useBranchAttributes(storeOrBranch)
    const { data: attribute } = useAttributes()
    const {mutateAsync:useAttribute} =  useCreateAttributeMutation()
   
   
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const usedTypes = badges.map((badge) => badge.attributeId)
    const availableOptions = attributes.filter((option) => !usedTypes.includes(option.id))


    const method = useForm<AttributeFormType>({
        resolver: zodResolver(RegisterAttributeSchema),
        defaultValues: {
            values: []
        }
    })
    
    useEffect(() => {
        if (attributes) {
            setAttributes(attribute || [])
        }
    }, [attribute])


    useEffect(() => {
        if (attributesByID) {
          const existingBadges: RegisterAttibute[] = attributesByID.attributes.map(attr => ({
            id: `${attr.attributeId}`,
            attributeId: attr.attributeId,
            value: attr.value
          }))
          setBadges(existingBadges) 
        }
    }, [attributesByID])

  
    const handleMultiSelectChange = (option:Attribute) => {
        setSelectedOptions((prev) => {
            const isSelected = prev.some(item => item.id=== option.id);
            return isSelected ? prev.filter(item => item.id !== option.id) : [...prev, option];
        });
    }

    const onSubmit = async (data: AttributeFormType) => {
        try {
             data.values.map(newAttr => {
                const existingAttr = attributesByID?.attributes.find(
                    attr => attr.attributeId === newAttr.attributeId
                );
                if (existingAttr) {
                    console.log('Updating existing attribute:', data);
                } else {
                    useAttribute(data.values);
                }
                return newAttr;
            });
            setIsDialogOpen(false);
            setSelectedAttributes([]);
            method.reset();
        } catch (error) {
            console.error('Error updating attributes:', error);
        }
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

    const handleBadgeDoubleClick = (badge: RegisterAttibute) => {
        const formValues = {
            values: [{
                id: badge.id,
                attributeId: badge.attributeId,
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

    const getTypeLabel = (type: number) => {
        const option = attributes.find((opt) => opt.id=== type)
        return option ? option.name : type
    }

   

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
                        {badges
                            .filter((badge) => selectedBadges.includes(badge.id))
                            .map((badge) => (
                                <Badge key={badge.id} variant="outline">
                                    {badge.value ? `: ${badge.value}` : ""}
                                </Badge>
                            ))}
                    </div>
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <FormAttributes
                    method={method}
                    selectedAttributes={selectedAttributes}
                    attributes={attributes}
                    onSubmit={onSubmit}
                    getTypeLabel={getTypeLabel}
                    setSelectedAttributes={setSelectedAttributes}
                    setIsDialogOpen={setIsDialogOpen}
                    />     
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
