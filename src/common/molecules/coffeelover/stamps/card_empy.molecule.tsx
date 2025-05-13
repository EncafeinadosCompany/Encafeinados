import { Card } from "@/common/ui/card"
import { Stamp } from "lucide-react"
import { motion } from "framer-motion"
import { Bean, Gift } from "lucide-react"
import { CardContent } from "@/common/ui/card"

export const CardEmpy = () => {
    return (
        <div className=" max-w-lg mx-auto">
            <Card className="border-none shadow-xl overflow-hidden bg-white" >
                <div className="md:h-24 relative overflow-hidden bg-cream-50">
                    {/* Paper texture background */}
                    <div className="absolute inset-0 bg-[radial-gradient(#f8f8f8_2px,transparent_2px)] [background-size:20px_20px] opacity-70"></div>

                    {/* Color gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-100/80 to-amber-100/80"></div>

                    {/* Stamp collector's illustration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-4 transform">
                            <div className="relative">
                                <Stamp className="h-16 w-16 text-orange-300" />
                                <motion.div
                                    className="absolute inset-0"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [1, 0.8, 1]
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Stamp className="h-16 w-16 text-orange-200" />
                                </motion.div>
                            </div>
                            <span className="text-orange-700 tracking-widest text-xs uppercase font-medium bg-cream-50 px-4 py-1 rounded-full shadow-sm">
                                Sin sellos disponibles
                            </span>
                        </div>
                    </div>

                    {/* Decorative coffee bean patterns */}
                    <div className="absolute top-5 left-5 opacity-20 rotate-[-15deg]">
                        <Bean className="h-8 w-8 text-orange-800" />
                    </div>
                    <div className="absolute bottom-5 right-5 opacity-20 rotate-[15deg]">
                        <Bean className="h-8 w-8 text-orange-800" />
                    </div>
                </div>

                <CardContent className="p-7 md:p-8" aria-describedby={undefined}>
                    <h3 className="text-xl font-medium text-gray-900 mb-3 text-center">
                        No hay sellos disponibles
                    </h3>
                    <p className="text-gray-600 text-center text-sm">
                        Actualmente no hay sellos para mostrar en esta página. Por favor, vuelve más tarde para descubrir nuevas colecciones.
                    </p>

                    <div className="mt-7 flex flex-col gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-cream-50 text-sm text-gray-700">
                            <Bean className="h-5 w-5 text-orange-400 shrink-0" />
                            <span>Explora otras páginas para encontrar sellos disponibles</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-cream-50 text-sm text-gray-700">
                            <Gift className="h-5 w-5 text-orange-400 shrink-0" />
                            <span>Vuelve pronto para descubrir nuevas colecciones</span>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    )

}