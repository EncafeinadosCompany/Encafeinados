import { Calendar, Tag } from "lucide-react"
import { getTypeColor } from "./filterButtons"
import { SetStateAction } from "react"
import { Albums } from "@/api/queries/album/albumQueries"


interface AlbumProps {
    album: Albums
    hoveredAlbum: string | null | number
    setHoveredAlbum: React.Dispatch<SetStateAction<number | null>>
    formatDate: (date: string) => string
}


export const CardAlbum = ({hoveredAlbum, album, formatDate}:AlbumProps) => {

    return (
        <div
            className={`relative rounded-lg overflow-hidden transition-all duration-500 transform ${hoveredAlbum === album.id ? "scale-[1.02]" : "scale-100"}group bg-white border-4 border-white shadow-md hover:shadow-xl cursor-pointer`}>
            {/* Esquinas de estampa */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-200 rounded-tl-sm z-10"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-200 rounded-tr-sm z-10"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-200 rounded-bl-sm z-10"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-200 rounded-br-sm z-10"></div>

            {/* Imagen de la cafetería */}
            <div className="relative h-40 overflow-hidden bg-amber-50">
                {/* Patrón de granos de café */}
                {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNvZmZlZSI+PHBhdGggZD0iTTE3IDhoMWE0IDQgMCAxIDEgMCA4aC0xIi8+PHBhdGggZD0iTTMgOGgxNHY5YTQgNCAwIDAgMS00IDRINyBhNCA0IDAgMCAxLTQtNFY4WiIvPjxsaW5lIHgxPSI2IiB5MT0iMiIgeDI9IjYiIHkyPSI0Ii8+PGxpbmUgeDE9IjEwIiB5MT0iMiIgeDI9IjEwIiB5Mj0iNCIvPjxsaW5lIHgxPSIxNCIgeTE9IjIiIHgyPSIxNCIgeTI9IjQiLz48L3N2Zz4=')] opacity-5 bg-repeat"></div> */}

                {/* Gradiente para mejor contraste */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 z-10"></div>

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
                    <div className="absolute -right-6 -top-6 w-24 h-24 rotate-12 z-20">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-600 flex items-center justify-center bg-amber-100/70 text-amber-800 font-bold text-xs transform rotate-[-12deg]">
                                COLECCIONADA
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Contenido de la estampa */}
            <div className="p-3 bg-white relative">
                {/* Textura de papel */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmOGY4ZjgiPjwvcmVjdD4KPC9zdmc+')] opacity-50"></div>


                {/* Título de la cafetería */}
                <h2 className="text-base font-bold text-amber-900 mb-1 truncate relative z-10 group-hover:text-amber-700 transition-colors">
                    {album.title}
                </h2>

                {/* Descripción */}
                <p className="text-xs text-amber-700/80 line-clamp-2 mb-2 h-8 relative z-10">{album.introduccion}</p>

                {/* Metadatos de la cafetería */}
                <div className="flex flex-wrap items-center gap-1 text-xs relative z-10">
                    {/* Tipo de cafetería */}
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md ${getTypeColor(album.type)}`}>
                        <Tag className="h-2.5 w-2.5 mr-1" />
                        {album.type || "Cafetería"}
                    </span>

                    {/* Fecha de visita */}
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-200">
                        <Calendar className="h-2.5 w-2.5 mr-1" />
                        <span className="whitespace-nowrap">{formatDate(album.start_date)}</span>
                    </span>

                    {/* Estado */}
                    <span
                        className={`inline-flex items-center px-1.5 py-0.5 rounded-md ${album.status
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                            }`}
                    >
                        {album.status ? "Visitada" : "Pendiente"}
                    </span>
                </div>
            </div>
        </div>
    )

}