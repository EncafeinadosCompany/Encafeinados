import { Card } from "@/common/ui/card"
import { AlertCircle, Star } from '@/common/ui/icons'
import { motion } from "framer-motion"
import { Attribute, RegisterAttibute } from "@/api/types/attributes/attributes.type"




interface CardAttributesProps {
    selectedBadges: string[]
    availableOptions: Attribute[]
    badges: RegisterAttibute[]
    handleDragStart: (e: React.MouseEvent<HTMLDivElement>, badge: RegisterAttibute) => void
    handleBadgeDoubleClick: (badge: RegisterAttibute) => void
    handleRemoveBadge: (badgeId: string, e: React.MouseEvent<HTMLButtonElement>) => void
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
    containerRef: React.MutableRefObject<HTMLDivElement | null>
    getTypeLabel: (type: number) => string | number
}

export const CardAttributes = ({ containerRef, canvasRef, badges, selectedBadges, handleBadgeDoubleClick, handleDragStart, handleRemoveBadge, getTypeLabel }: CardAttributesProps) => {

    return (
        <Card
            className="w-full h-[300px] relative overflow-y-auto overflow-x-hidden border-2 border-dashed border-slate-200 bg-[#fafbfc]"
            ref={containerRef}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />

            {badges.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>Selecciona elementos para añadirlos al canvas</p>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
                    {badges.map((badge) => (
                        <motion.div
                            key={badge.id}
                            className={`relative p-4 rounded-xl transition-all duration-300 h-full  min-h-[10vh] ${selectedBadges.includes(badge.id)
                                ? "bg-[#FAF3E0] ring-2 ring-[#D4A76A]"
                                : "bg-white hover:bg-[#FAF3E0]/50"
                                } shadow-lg hover:shadow-xl cursor-pointer transform hover:-translate-y-1 flex flex-col`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            onDoubleClick={() => handleBadgeDoubleClick(badge)}
                            style={{ height: "auto" }}
                        >
                            <div className="flex items-center gap-3 mb-2 bg-inherit">
                                <Star className="h-5 w-5 text-[#D4A76A] flex-shrink-0" />
                                <span className="font-semibold text-[#6F4E37] truncate">{getTypeLabel(badge.attributeId)}</span>
                            </div>
                            {badge.value && (
                                <div className="text-sm text-[#A67C52] font-medium bg-[#FAF3E0]/50 p-2 rounded-lg">
                                    <p className="break-words line-clamp-3">{badge.value}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </Card>
    )
}