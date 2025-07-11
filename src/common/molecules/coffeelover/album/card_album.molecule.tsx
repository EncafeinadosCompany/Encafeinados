import {ChevronRight } from'@/common/ui/icons'
import { SetStateAction } from "react"
import { AlbumResponse } from "@/api/types/album/album.types"


interface AlbumProps {
    album: AlbumResponse
    hoveredAlbum: string | null | number
    setHoveredAlbum: React.Dispatch<SetStateAction<number | null>>
    formatDate: (date: string) => string
}

export const CardAlbum = ({hoveredAlbum, album, formatDate}:AlbumProps) => {

    let statusConfig;

    if (album.type === "ANNUAL") {
      statusConfig = {
        text: "Anual",
        dotColor: "bg-[#DB8935]",
        bgColor: "bg-[#F5E4D2]",
        textColor: "text-[#A67C52]",
      };
    } else if (album.type === "EVENT") {
      statusConfig = {
        text: "Eventos",
        dotColor: "bg-[#359BDB]",
        bgColor: "bg-[#D2E4F5]",
        textColor: "text-[#527CA6]",
      }; 
    }
    
    
    return (
        <div
        className={`relative rounded-xl overflow-hidden transition-all duration-500 transform ${hoveredAlbum === album.id ? "scale-[1.02]" : "scale-100"} group bg-[#f2f5f2] shadow-md hover:shadow-xl cursor-pointer`}>
        
        {/* Imagen de la cafetería */}
        <div className="relative h-40 overflow-hidden">
            {/* Gradiente para mejor contraste */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10 z-10"></div>

            {/* Imagen de la cafetería */}
            <img
                src={album.logo || "/placeholder.svg"}
                alt={album.title}
                onError={(e) =>
                (e.currentTarget.src =
                    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80")
                }
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Sello de colección */}
            {album.status && (
                <div className="absolute right-3 top-3 z-20">
                    <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-emerald-700">
                        {statusConfig?.text}
                    </div>
                </div>
            )}
        </div>

        {/* Contenido de la estampa */}
        <div className="p-4 bg-white relative">
            {/* Fecha */}
            <div className="text-xs text-gray-500 mb-1">
                {formatDate(album.start_date)}
            </div>
            
            {/* Título de la cafetería */}
            <h2 className="text-xl font-bold min-h-[6vh] max-h-[6vh] overflow-hidden text-ellipsis line-clamp-2 text-gray-900 mb-3 relative z-10 group-hover:text-amber-800 transition-colors">
                {album.title}
            </h2>

            {/* Ver fotos link */}
            <div className="flex items-center justify-between">
              
                <div className="flex items-center w-full  justify-center rounded-md p-1 bg-[#f2f5f2] text-[#68a517] hover:text-amber-900 text-sm font-medium">
                    Ver detalles
                    <ChevronRight className="h-4 w-4 ml-1" />
                </div>
            </div>
        </div>
    </div>
    )

}