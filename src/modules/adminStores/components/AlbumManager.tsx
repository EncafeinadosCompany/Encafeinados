import React from "react";
import { CreateAlbumWidget } from "@/common/widgets/admin/CreateAlbumWidget"; 
import { Book, BookOpen, CalendarDays } from "lucide-react";
import { useAlbumsQuery } from "@/api/queries/admin/albumQueries";

const AlbumManager = () => {
  const { data: albums = [], isLoading } = useAlbumsQuery();

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810] flex items-center gap-2">
            <BookOpen className="text-[#6F4E37]" />
            Álbumes de Cafeterías
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona colecciones especiales de cafeterías
          </p>
        </div>
        <CreateAlbumWidget />
      </div>
    </div>
  );
};

export default AlbumManager;