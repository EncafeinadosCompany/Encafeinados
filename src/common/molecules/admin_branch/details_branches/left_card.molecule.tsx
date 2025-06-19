import { Badge } from "@/common/ui/badge"
import { Card } from "@/common/ui/card"
import ImageCarousel from "../imagen_carousel"
import { AlertCircle, PhoneIcon, Star } from "lucide-react"
import { BrancheIDresponse } from "@/api/types/branches/branches.types";

interface LeftCardProps {
    branches: BrancheIDresponse;
    imagen: any;
}

export const LeftCardBranch = ({branches, imagen}:LeftCardProps) => {
    return (
        <Card className="p-3 sm:p-4 md:p-6 bg-white h-full shadow-lg rounded-xl border-none overflow-hidden">
            <div className="flex flex-col h-full">
                <div className="flex-1 relative">
                    <Badge 
                        className={`
                            ${branches?.branch.status == 'APPROVED' 
                                ? 'bg-emerald-200/60 border-emerald-700 text-emerald-800' 
                                : 'bg-orange-200/60 border-orange-500 text-orange-800'
                            } 
                            absolute z-10 right-0 top-0 text-xs sm:text-sm px-2 py-1 font-medium
                        `}
                    >
                        {branches?.branch.status === 'APPROVED' ? 'Aprobada' : 'Pendiente'}
                    </Badge>
                    
                    <div className="h-[30vh] sm:h-[35vh] md:h-[40vh] relative rounded-lg overflow-hidden">
                        {imagen && imagen?.length > 0 ? (
                            <ImageCarousel images={imagen || []} alt="Branch Images" />
                        ) : (
                            <div className="flex flex-col items-center h-full justify-center p-4 sm:p-6 bg-gray-50 rounded-lg">
                                <div className="text-gray-400 mb-2">
                                    <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8" />
                                </div>
                                <p className="text-gray-600 font-medium text-sm sm:text-base text-center">
                                    No hay imágenes disponibles
                                </p>
                                <p className="text-gray-400 text-xs sm:text-sm mt-1 text-center">
                                    Por favor, agregue imágenes de la sucursal
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <div className="mx-auto text-center mt-4 sm:mt-6">
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 truncate">
                            {branches?.branch.name}
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base text-center mb-4 sm:mb-6 line-clamp-2">
                            {branches?.branch.address}
                        </p>
                    </div>
                    
                    <div className="w-full text-xs sm:text-sm text-gray-600 space-y-3">
                        <div className="flex items-center">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-yellow-400 flex-shrink-0" />
                            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                                <p className="whitespace-nowrap">Rating</p>
                                <div className="flex items-center flex-wrap">
                                    <p className="font-semibold">{branches?.branch.average_rating || "0.0"}</p>
                                    <span className="text-gray-400 mx-1">/</span>
                                    <p className="text-gray-400">5.0</p>
                                    <div className="flex ml-1 sm:ml-2 flex-shrink-0">
                                        {[...Array(5)].map((_, index) => (
                                            <Star
                                                key={index}
                                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                                    index < Math.floor(Number(branches?.branch.average_rating || 0))
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full mr-2 flex-shrink-0"></span>
                            <PhoneIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-2 flex-shrink-0" />
                            <div className="flex space-x-2 min-w-0 items-center">
                                <p className="whitespace-nowrap">Teléfono</p>
                                <p className="truncate">{branches?.branch.phone_number || "No disponible"}</p>
                            </div>
                        </div>
                        
                        <div className="pt-3">
                            <div className="flex flex-col w-full border-t border-gray-200 space-y-3 pt-3">
                                <p className="font-medium text-sm sm:text-base">Redes Sociales</p>
                                {branches?.branch.social_branches && branches.branch.social_branches.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 sm:gap-3">
                                        {branches?.branch.social_branches.map((social) => (
                                            <a
                                                key={social.social_network_id}
                                                href={social.value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center px-2 sm:px-3 py-1 sm:py-1.5 
                                                           bg-gray-100 hover:bg-gray-200 rounded-full 
                                                           transition-colors text-xs sm:text-sm text-gray-700"
                                            >
                                                <span className="truncate max-w-[120px]">{social.description}</span>
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs sm:text-sm text-gray-400 italic">
                                        No hay redes sociales registradas
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}