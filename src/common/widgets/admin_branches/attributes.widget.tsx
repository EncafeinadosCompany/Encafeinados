"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/common/ui/badge"
import { Dialog } from "@/common/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { FormAttributes } from "@/common/molecules/admin_branch/attributes/form_atributes.molecule"
import { SelectAttributes } from "@/common/molecules/admin_branch/attributes/select_attributes.molecule"
import { TooltipAttributes } from "@/common/molecules/admin_branch/attributes/tooltip_attributes.molecule"
import { CardAttributes } from "@/common/molecules/admin_branch/attributes/card_attributes.molecule"
import { DetailsAttributes } from "@/common/molecules/admin_branch/attributes/details_attributes.molecule"

import { Attribute, RegisterAttibute } from "@/api/types/attributes/attributes.type"
import { useAttributes, useBranchAttributes } from "@/api/queries/attributes/attributes.query"
import { AttributeFormType, RegisterAttributeSchema } from "@/common/utils/schemas/attributes/create_attributes.schema"
import { useCreateAttributeMutation, useUpdateAttributeMutation } from "@/api/mutations/attributes/attributes.mutation"
import { getAuthStorage } from "@/common/utils/auth_storage.utils"
import { ChevronDown, Coffee } from "lucide-react"
import { ScrollIndicator } from "@/common/atoms/indicator"


export default function AttributesDashboard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedBadges, setSelectedBadges] = useState<string[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isMultiSelectOpen, setIsMultiSelectOpen] = useState(false)
    const [selectedOptions, setSelectedOptions] = useState<Attribute[]>([])
    const [badges, setBadges] = useState<RegisterAttibute[]>([])
    const { storeOrBranch } = getAuthStorage()
    const [attributes, setAttributes] = useState<Attribute[]>([])
    const [selectedAttributes, setSelectedAttributes] = useState<RegisterAttibute[]>([])
    
    if (!storeOrBranch) return null
    const { data: attributesByID } = useBranchAttributes(storeOrBranch)
    const { data: attribute } = useAttributes()
    
    const { mutateAsync: useAttribute } = useCreateAttributeMutation()
    const { mutateAsync: useUpdateMutation } = useUpdateAttributeMutation()


    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

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


    const handleMultiSelectChange = (option: Attribute) => {
        setSelectedOptions((prev) => {
            const isSelected = prev.some(item => item.id === option.id);
            return isSelected ? prev.filter(item => item.id !== option.id) : [...prev, option];
        });
    }

    const onSubmit = async (data: AttributeFormType) => {
        try {
            const existingAttr = attributesByID?.attributes.find(
                attr => attr.attributeId === data.values[0].attributeId
            );
            if (existingAttr) {
                await useUpdateMutation({ data: data.values[0] });
            } else {
                await useAttribute(data.values);
            }
            
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
        const option = attributes.find((opt) => opt.id === type)
        return option ? option.name : type
    }



    return (
        <div className="container h-full flex flex-col  justify-center  px-2 mx-auto  max-w-6xl ">
            <div ref={scrollContainerRef} className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] h-full min-h-[90vh] max-h-[70vh] overflow-y-auto scrollbar-subtle p-6">
                <div className="mb-8 mt-4 text-center">
                    <div className="inline-flex items-center justify-center mb-2">
                        <div className="bg-[#6F4E37] p-2 rounded-full mr-3">
                            <Coffee className="text-white" size={24} />
                        </div>
                        <h2 className="text-2xl font-semibold text-[#2C1810]">Atributos de Especialidad</h2>
                    </div>
                    <p className="text-[#6B7280] text-sm">Define las características que hacen único tu café</p>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
                    <ScrollIndicator className="bg-[#6F4E37]/10 hover:bg-[#6F4E37]/20" containerRef={scrollContainerRef as React.RefObject<HTMLElement>}></ScrollIndicator>

                </div>

                <div className="mb-6 flex justify-center">
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

      

                <div className="mt-8 p-4 bg-gray-50/10 rounded-xl border border-[#E5E7EB]">
                    <h3 className="text-[#2C1810] font-medium mb-2">Guía Rápida</h3>
                    <ul className="space-y-2 text-sm text-[#6B7280]">
                        <li className="flex items-center">
                            <ChevronDown className="mr-2" size={16} />
                            Haz doble clic en un atributo para editarlo
                        </li>
                        <li className="flex items-center">
                            <ChevronDown className="mr-2" size={16} />
                            Usa el botón "Añadir Atributo" para crear nuevos
                        </li>
                        <li className="flex items-center">
                            <ChevronDown className="mr-2" size={16} />
                            Los atributos ayudan a los clientes a encontrar tu café
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
