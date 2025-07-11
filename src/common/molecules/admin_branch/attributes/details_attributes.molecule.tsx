import {motion} from "framer-motion"
import { Coffee, Star } from'@/common/ui/icons'
import { Button } from "@/common/ui/button"
import { RegisterAttibute } from "@/api/types/attributes/attributes.type"





interface DetailsAttributesProps {
    selectedBadges: string[]
    badges: RegisterAttibute[]
    handleBadgeDoubleClick: (badge: RegisterAttibute) => void 
    getTypeLabel: (type: number) => string | number
}

export const DetailsAttributes = ({selectedBadges, badges, handleBadgeDoubleClick, getTypeLabel}:DetailsAttributesProps)=>{
    return (
        <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-6 border-2 border-[#D4A76A]/20 rounded-xl bg-gradient-to-br from-[#FAF3E0] to-[#FFF8ED] shadow-lg"
    >
        <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#D4A76A]/10 p-2 rounded-lg">
                <Coffee className="h-5 w-5 text-[#D4A76A]" />
            </div>
            <h3 className="font-semibold text-lg text-[#6F4E37]">
                Detalles del elemento
            </h3>
        </div>

        {badges.find((b) => b.id === selectedBadges[0]) && (
            <div className="space-y-4">
                <div className="bg-white/60 p-4 rounded-lg border border-[#D4A76A]/20">
                    <p className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 text-[#D4A76A]" />
                        <span className="font-medium text-[#6F4E37]">Tipo:</span>
                        <span className="text-[#A67C52] bg-[#FAF3E0] px-3 py-1 rounded-full text-sm">
                            {/* {getTypeLabel(badges.find((b) => b.id === selectedBadges[0])!.id)} */}
                        </span>
                    </p>
                    <div className="space-y-2">
                        <span className="font-medium text-[#6F4E37] block">Descripción:</span>
                        <div className="bg-white p-3 rounded-lg border border-[#D4A76A]/10 min-h-[60px]">
                            <p className="text-[#A67C52] whitespace-pre-wrap break-words">
                                {badges.find((b) => b.id === selectedBadges[0])!.value ||
                                    <span className="text-[#A67C52]/60 italic">Sin descripción</span>}
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    size="sm"
                    className="w-full bg-[#D4A76A] hover:bg-[#C19559] text-white transition-all duration-300 hover:shadow-md"
                    onClick={() => handleBadgeDoubleClick(badges.find((b) => b.id === selectedBadges[0])!)}
                >
                    <Coffee className="h-4 w-4 mr-2" />
                    Editar valor
                </Button>
            </div>
        )}
    </motion.div>
    )
}