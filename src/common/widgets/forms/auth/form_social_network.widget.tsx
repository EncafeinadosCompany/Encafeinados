"use client"

import { useFieldArray, UseFormRegister } from "react-hook-form"
import { Trash2, Globe, Link as MessageSquare } from "@/common/ui/icons"
import type { SocialNetworksType } from "@/api/queries/social_networks/social_networks.query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/common/ui/card"
import { Label } from "@/common/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/ui/select"
import { Button } from "@/common/ui/button"
import { Input } from "@/common/ui/input"
import { Textarea } from "@/common/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { UseNetworkInputConfig } from "@/common/hooks/social_network/use_networks.hook"
import { SocialBranch } from "@/api/types/branches/branches.types"
import { useState } from "react"
import { TextError } from "@/common/atoms/forms/text_error.atom"

interface DynamicSocialNetworksFormProps {
    availableSocialNetworks: SocialNetworksType | undefined
    register: UseFormRegister<any>
    control: any
    error?: any
    idSocialNetworks?: SocialBranch[]
}

export default function SocialNetworksForm({ availableSocialNetworks, register, control, error }: DynamicSocialNetworksFormProps) {


    const { fields, append, remove } = useFieldArray({ control, name: "social_networks", })
    const [currentSelection, setCurrentSelection] = useState<string>("")

    const availableNetworks = availableSocialNetworks?.social

    const handleAddNetwork = (networkIdStr: string) => {
        const networkId = parseInt(networkIdStr)
        const network = availableSocialNetworks?.social.find((n) => n.id === networkId)
        if (!network) return

        append({
            social_network_id: networkIdStr,
            value: "",
            name: network.name,
            description: "",
        })

        setCurrentSelection("")
    }

    return (
        <Card className="w-full max-w-3xl mx-auto border-none shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 pb-6">
                <CardTitle className="flex items-center gap-2 text-xl text-amber-900">
                    <Globe className="h-5 w-5 text-amber-600" />
                    Redes Sociales
                </CardTitle>
                <CardDescription className="text-amber-700">
                    Agrega tus redes sociales favoritas para que los coffeelovers puedan conocer más sobre ti
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 p-6 bg-white">
                {/* Selector with improved styling */}
                <div className="flex items-end gap-3">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="network-select" className="text-sm font-medium text-gray-700">
                            Agregar Red Social
                        </Label>
                        <Select
                            onValueChange={(value) => {
                                setCurrentSelection(value)
                                handleAddNetwork(value)
                            }}
                            value={currentSelection}
                            disabled={availableNetworks?.length === 0}
                        >
                            <SelectTrigger
                                id="network-select"
                                className="bg-white border border-gray-300 rounded-lg shadow-sm hover:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all"
                            >
                                <SelectValue
                                    placeholder={
                                        availableNetworks?.length === 0
                                            ? "No hay más redes disponibles"
                                            : "Selecciona  una red social"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg">
                                {availableNetworks?.length === 0 ? (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                        No more networks available
                                    </div>
                                ) : (
                                    availableNetworks?.map((network) => (
                                        <SelectItem
                                            key={network.id}
                                            value={network.id.toString()}
                                            className="hover:bg-amber-50"
                                        >
                                            {network.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Empty state with illustration */}
                <AnimatePresence>
                    {fields.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-10 px-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50"
                        >
                            <Globe className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600 font-medium"> Aún no has agregado redes sociales </p>
                            <p className="text-sm text-gray-500 mt-1">
                                Agregá tu primera red usando el selector de arriba
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dynamic fields with animations */}
                <AnimatePresence>
                    <div className="space-y-4">
                        {fields.map((field, index) => {

                            const inputConfig = UseNetworkInputConfig((field as any).name);
                            return (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                                        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 bg-gray-50 border-b border-gray-200">
                                            <CardTitle className="text-md font-medium flex items-center gap-2 text-gray-800">
                                                <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                                                    <Globe className="h-3.5 w-3.5 text-amber-600" />
                                                </div>
                                                {(field as any).name || (field as any).description}
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </CardHeader>
                                        <CardContent className="py-5 px-5 space-y-5 bg-white">
                                            <input
                                                type="hidden"
                                                {...register(`social_networks.${index}.social_network_id`, { valueAsNumber: true })}
                                            />
                                            <div className="grid gap-2">
                                                <Label htmlFor={`value-${index}`} className="flex items-center gap-1.5 text-gray-700">
                                                    {inputConfig.icon}
                                                    {inputConfig.label}
                                                </Label>
                                                <Input
                                                    id={`value-${index}`}
                                                    type={inputConfig.type}
                                                    inputMode={inputConfig.inputMode}
                                                    placeholder={inputConfig.placeholder}
                                                    className="border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
                                                    {...register(`social_networks.${index}.value`)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={`description-${index}`} className="flex items-center gap-1.5 text-gray-700">
                                                    <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
                                                    Texto del enlace
                                                </Label>
                                                <Textarea
                                                    id={`description-${index}`}
                                                    placeholder={inputConfig.slogan}
                                                    className="min-h-[80px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-200 focus:border-amber-400"
                                                    {...register(`social_networks.${index}.description`)}
                                                />
                                                {error?.social_networks?.[index]?.description && (
                                                    <TextError>
                                                        {error.social_networks[index].description.message || error.social_networks[index].description}
                                                    </TextError>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </div>
                </AnimatePresence>
            </CardContent>
        </Card>

    )
}
