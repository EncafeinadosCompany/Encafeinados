import { Badge } from "@/common/ui/badge"
import { Card } from "@/common/ui/card"
import ImageCarousel from "../imagen_carousel"
import { AlertCircle, PhoneIcon, Star } from "lucide-react"
import { BrancheIDresponse } from "@/api/types/branches/branches.types";

interface LeftCardProps {
    branches: BrancheIDresponse;
    imagen: any;
}
export const LeftCardBranch = ({branches, imagen}:LeftCardProps) =>{
    return (
        <Card className="p-6 bg-white h-full  shadow-lg rounded-xl border-none">
                        <div className="flex flex-col h-full">
                            <div className="flex-1 relative">
                                <Badge className={`${branches?.branch.status == 'APPROVED' ? 'bg-emerald-200/60 border-emerald-700' : 'bg-orange-300 border-orange-500'} p-1 px-2 rounded-full absolute z-10  right-0`}>{branches?.branch.status === 'APPROVED' ? 'Aprobada' : 'Pediente'}</Badge>
                                <div className="h-[40vh] relative">
                                {
                                    imagen && imagen?.length > 0 ? (
                                        <ImageCarousel images={imagen || []} alt="Branch Images" />
                                    ) : (
                                        <div className="flex flex-col items-center h-full justify-center p-6 bg-gray-50 rounded-lg">
                                            <div className="text-gray-400 mb-2">
                                                <AlertCircle className="h-8 w-8" />
                                            </div>
                                            <p className="text-gray-600 font-medium">No hay imágenes disponibles</p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                Por favor, agregue imágenes de la sucursal
                                            </p>
                                        </div>
                                    )
                                }
                                </div>
                                <div className="mx-auto text-center">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 mt-6 ">{branches?.branch.name}</h2>
                                    <p className="text-gray-500 text-center mb-6">{branches?.branch.address}</p>
                                </div>
                                <div className="w-full text-sm text-gray-600 space-y-2.5">

                                    <div className="flex items-center">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                                        <div className="flex items-center space-x-2">
                                            <p>Rating</p>
                                            <div className="flex items-center">
                                                <p className="font-semibold">{branches?.branch.average_rating}</p>
                                                <span className="text-gray-400 mx-1">/</span>
                                                <p className="text-gray-400">5.0</p>
                                                <div className="flex ml-2">
                                                    {[...Array(5)].map((_, index) => (
                                                        <Star
                                                            key={index}
                                                            className={`w-4 h-4 ${index < Math.floor(Number(branches?.branch.average_rating))
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
                                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                                        <PhoneIcon className="w-3 h-3 mr-2" />
                                        <div className="flex space-x-2">
                                            <p>Teléfono</p>
                                            <p>{branches?.branch.phone_number}</p>
                                        </div>

                                    </div>
                                    <div className="flex items-center">
                                        <div className="flex flex-col w-full border-t border-gray-200 space-y-4">
                                            <p className="font-medium mt-4">Redes Sociales</p>
                                            <div className="flex flex-wrap gap-3">
                                                {branches?.branch.social_branches.map((social) => (
                                                    <a
                                                        key={social.social_network_id}
                                                        href={social.value}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                                    >
                                                        {/* Here you could add social media icons based on the network */}
                                                        <span className="text-sm text-gray-700">{social.description}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
    )
}