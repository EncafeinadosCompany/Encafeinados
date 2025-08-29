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
    isHead?: boolean
}

export default function SocialNetworksForm({ availableSocialNetworks, register, control, error, isHead=false }: DynamicSocialNetworksFormProps) {
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
        <Card className="w-full border-0 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
           {
            isHead && (
                 <CardHeader className="bg-gradient-to-br from-[#DB8935]/5 via-white to-[#8B5A2B]/5 pb-8 pt-8 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#DB8935]/5 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#8B5A2B]/5 rounded-full translate-y-4 -translate-x-4"></div>
                
                <div className="relative z-10 px-6 md:px-8">
                    <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-3">
                        <div className="p-2.5 bg-[#DB8935]/10 rounded-xl">
                            <Globe className="h-6 w-6 text-[#8B5A2B]" />
                        </div>
                        Redes Sociales
                        <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            Opcional
                        </span>
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-base leading-relaxed">
                        Conecta tus redes sociales para que los coffeelovers puedan conocer más sobre ti y mantenerse en contacto. 
                        <span className="font-medium text-[#8B5A2B]"> Es completamente opcional</span> y puedes continuar sin agregarlas.
                    </CardDescription>
                </div>
            </CardHeader>
            )
           }

            <CardContent className="space-y-8 px-4 py-8 md:px-6 lg:px-8 bg-white">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 w-4 bg-[#DB8935] rounded-full"></div>
                        <Label className="text-lg font-semibold text-gray-800">
                            Agregar Nueva Red Social
                        </Label>
                    </div>
                    
                    <div className="bg-gradient-to-r from-gray-50 to-gray-50/50 p-6 rounded-2xl border border-gray-100">
                        <Select
                            onValueChange={(value) => {
                                setCurrentSelection(value)
                                handleAddNetwork(value)
                            }}
                            value={currentSelection}
                            disabled={availableNetworks?.length === 0}
                        >
                            <SelectTrigger
                                className={`
                                    h-12 bg-white border-2 rounded-xl shadow-sm transition-all duration-200
                                    ${availableNetworks?.length === 0 
                                        ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                                        : 'border-gray-200 hover:border-[#DB8935]/40 focus:border-[#DB8935] focus:ring-4 focus:ring-[#DB8935]/10'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-[#DB8935]/10 rounded-lg">
                                        <Globe className="h-4 w-4 text-[#8B5A2B]" />
                                    </div>
                                    <SelectValue
                                        placeholder={
                                            availableNetworks?.length === 0
                                                ? "🚫 No hay más redes disponibles"
                                                : "🌐 Selecciona una red social para agregar"
                                        }
                                    />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-white border-2 border-gray-100 shadow-xl rounded-xl p-2">
                                {availableNetworks?.length === 0 ? (
                                    <div className="px-4 py-6 text-center">
                                        <Globe className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                                        <p className="text-sm text-gray-500 font-medium">No hay más redes disponibles</p>
                                        <p className="text-xs text-gray-400 mt-1">Ya has agregado todas las redes sociales</p>
                                    </div>
                                ) : (
                                    availableNetworks?.map((network) => (
                                        <SelectItem
                                            key={network.id}
                                            value={network.id.toString()}
                                            className="hover:bg-[#DB8935]/5 focus:bg-[#DB8935]/10 rounded-lg p-3 cursor-pointer transition-all duration-150"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-[#DB8935]/10 rounded-lg">
                                                    <Globe className="h-3.5 w-3.5 text-[#8B5A2B]" />
                                                </div>
                                                <span className="font-medium">{network.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <AnimatePresence>
                    {fields.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="text-center py-16 px-8 relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-[#DB8935]/5 rounded-2xl"></div>
                            <div className="absolute top-4 right-4 w-12 h-12 bg-[#DB8935]/5 rounded-full"></div>
                            <div className="absolute bottom-4 left-4 w-8 h-8 bg-[#8B5A2B]/5 rounded-full"></div>
                            
                            <div className="relative z-10">
                                <div className="relative mb-6 inline-block">
                                    <div className="p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
                                        <Globe className="h-12 w-12 text-[#8B5A2B]" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#DB8935] rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">+</span>
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                    ¡Conecta tus redes sociales!
                                </h3>
                                <p className="text-gray-600 mb-2 max-w-md mx-auto leading-relaxed">
                                    Aún no has agregado ninguna red social. Puedes continuar sin agregarlas o usar el selector de arriba para conectar tus perfiles.
                                </p>
                                <p className="text-sm text-[#8B5A2B] font-medium">
                                    💡 Esto ayudará a los coffeelovers a conocerte mejor
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                    {fields.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-1"
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-1 w-4 bg-[#8B5A2B] rounded-full"></div>
                                <Label className="text-lg font-semibold text-gray-800">
                                    Tus Redes Sociales ({fields.length})
                                </Label>
                            </div>
                            
                            <div className="grid gap-4">
                                {fields.map((field, index) => {
                                    const inputConfig = UseNetworkInputConfig((field as any).name);
                                    return (
                                        <motion.div
                                            key={field.id}
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, x: -100, scale: 0.95 }}
                                            transition={{ 
                                                duration: 0.3,
                                                delay: index * 0.1,
                                                type: "spring",
                                                stiffness: 100
                                            }}
                                            layout
                                        >
                                            <Card className="group border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:border-[#DB8935]/20 transition-all duration-300 bg-white overflow-hidden">
                                                <CardHeader className="py-4 px-6 bg-gradient-to-r from-gray-50/50 to-white border-b border-gray-100/50 flex flex-row items-center justify-between space-y-0">
                                                    <CardTitle className="text-lg font-semibold flex items-center gap-3 text-gray-800">
                                                        <div className="p-2 bg-[#DB8935]/10 rounded-xl group-hover:bg-[#DB8935]/15 transition-colors">
                                                            <Globe className="h-4 w-4 text-[#8B5A2B]" />
                                                        </div>
                                                        <div>
                                                            <span className="block">{(field as any).name}</span>
                                                            {(field as any).description && (
                                                                <span className="text-sm font-normal text-gray-500 block">
                                                                    {(field as any).description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </CardTitle>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => remove(index)}
                                                        className="h-9 w-9 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 shrink-0"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </CardHeader>
                                                <CardContent className="py-6 px-6 space-y-6 bg-white">
                                                    <input
                                                        type="hidden"
                                                        {...register(`social_networks.${index}.social_network_id`, { valueAsNumber: true })}
                                                    />
                                                    
                                                    <div className="space-y-3">
                                                        <Label htmlFor={`value-${index}`} className="flex items-center gap-2 text-gray-700 font-medium">
                                                            {inputConfig.icon}
                                                            {inputConfig.label}
                                                        </Label>
                                                        <Input
                                                            id={`value-${index}`}
                                                            type={inputConfig.type}
                                                            inputMode={inputConfig.inputMode}
                                                            placeholder={inputConfig.placeholder}
                                                            className="h-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#DB8935]/10 focus:border-[#DB8935] transition-all duration-200 bg-gray-50/50 focus:bg-white"
                                                            {...register(`social_networks.${index}.value`)}
                                                        />
                                                    </div>
                                                    
                                                    <div className="space-y-3">
                                                        <Label htmlFor={`description-${index}`} className="flex items-center gap-2 text-gray-700 font-medium">
                                                            <MessageSquare className="h-4 w-4 text-gray-500" />
                                                            Texto del enlace
                                                        </Label>
                                                        <Textarea
                                                            id={`description-${index}`}
                                                            placeholder={inputConfig.slogan}
                                                            className="min-h-[100px] border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#DB8935]/10 focus:border-[#DB8935] transition-all duration-200 bg-gray-50/50 focus:bg-white resize-none"
                                                            {...register(`social_networks.${index}.description`)}
                                                        />
                                                        {error?.social_networks?.[index]?.description && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: -10 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                className="bg-red-50 border border-red-200 rounded-lg p-3"
                                                            >
                                                                <TextError>
                                                                    {error.social_networks[index].description.message || error.social_networks[index].description}
                                                                </TextError>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>

    )
}
