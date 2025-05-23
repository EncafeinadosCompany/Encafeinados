import React from "react";
import { CreateAlbumWidget } from "@/common/widgets/admin/album/create_album.widget"; 
import { BookOpen } from "lucide-react";
import { ListAlbumWidget } from "@/common/widgets/admin/album/list_album_admin.widget";
import { useSearchParams } from "react-router-dom";

const AlbumManager = () => {
  const [searchParams] = useSearchParams();
  const start_time = searchParams.get("start_time")
  const end_time = searchParams.get("end_time")

  console.log(searchParams.get("event"), start_time, end_time)

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <header className="flex-shrink-0 bg-white/95 border-b border-gray-100 py-6 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2C1810] flex items-center gap-2">
            <BookOpen className="text-[#6F4E37]" />
            Galería de Álbumes
          </h1>
          <p className="text-amber-700/70 text-sm mt-1">
            Gestiona colecciones especiales de cafeterías
          </p>
        </div>
        <CreateAlbumWidget className="sm:self-start" />
      </header>
      
      <div className="flex-1 min-h-0 overflow-hidden">
        <ListAlbumWidget />
      </div>
    </div>
  );
};

export default AlbumManager;