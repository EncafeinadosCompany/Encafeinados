
import { CreateAlbumWidget } from "@/common/widgets/admin/CreateAlbumWidget"; 
import { BookOpen} from "lucide-react";
import { ListAlbumWidget } from "@/common/widgets/admin/listAlbumWidget";

const AlbumManager = () => {
  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="text-[#6F4E37]" />
              Galería de Álbumes
          </h1>
          <p className="text-gray-500 mt-1">
            Gestiona colecciones especiales de cafeterías
          </p>
        </div>
        <CreateAlbumWidget />
      </div>
      <ListAlbumWidget></ListAlbumWidget>
    </div>
  );
};

export default AlbumManager;