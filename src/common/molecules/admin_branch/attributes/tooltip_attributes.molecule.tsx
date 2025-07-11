import { Attribute } from "@/api/types/attributes/attributes.type"
import { Badge } from "@/common/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/common/ui/tooltip"
import { motion} from "framer-motion"

interface TooltipAttributesProps {
    selectedBadges: string[]
    availableOptions: Attribute[]
}


export const TooltipAttributes = ({selectedBadges, availableOptions}:TooltipAttributesProps)=>{
    return (
        <motion.div
        className="flex flex-wrap items-center gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
    >

        {selectedBadges.length > 0 && (
            <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-sm text-[#6F4E37] font-medium bg-$[#FAF3E0] px-3 py-1 rounded-full"
            >
                {selectedBadges.length} elemento(s) seleccionado(s)
            </motion.span>
        )}

        <motion.div
            className="ml-auto flex flex-wrap gap-2 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
        >
            <span className="text-sm text-[#6F4E37] font-medium">Atributos disponibles:</span>
            <div className="flex flex-wrap gap-2">
                {availableOptions.length > 0 ? (
                    availableOptions.map((option) => (
                        <motion.div
                            key={option.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge
                                            variant="outline"
                                            className="text-sm cursor-pointer rounded-full bg-white border-none text-[#6F4E37] px-4 py-1 shadow-2xl"
                                        >
                                            {option.name}
                                        </Badge>

                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        <div className="bg-white shadow-2xl border-1 border-gray-400 rounded-full py-2">
                                            <p>✨{option.description}✨</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                        </motion.div>
                    ))
                ) : (
                    <span className="text-sm text-[#A67C52] italic">Ninguno disponible</span>
                )}
            </div>
        </motion.div>
    </motion.div>
    )
}