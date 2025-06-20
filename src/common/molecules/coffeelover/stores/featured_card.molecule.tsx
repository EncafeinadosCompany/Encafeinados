import { FlameIcon as Fire, Coffee } from "@/common/ui/icons";
import { Card } from "@/common/ui/card";
import { useState } from "react";
import { motion } from "framer-motion";
import { ApprovedBranch } from "@/api/types/branches/branches_approval.types";
import { useNavigate } from "react-router-dom";

interface FeaturedCardProps {
  branches: ApprovedBranch;
  isFeatured?: boolean;
  current?: number;
  index?: number;
}

export default function FeaturedCard({ current, branches, isFeatured = false, index = 0 }: FeaturedCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          text: 'Destacado'
        };
      case 'PENDING':
        return {
          color: 'bg-amber-100 text-amber-700 border-amber-200',
          text: 'Próximamente'
        };
      default:
        return {
          color: 'bg-rose-100 text-rose-700 border-rose-200',
          text: 'Cerrado'
        };
    }
  };

  const statusConfig = getStatusConfig(branches.status);

  return (
    <motion.div
      className={`${isFeatured ? "w-[80vh] h-60" : "w-[50vh] h-52"} transition-all duration-300`}
      whileHover={{ scale: 1.03 }}
      style={{touchAction: "pan-y"}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card
        className="w-full h-full overflow-hidden rounded-2xl shadow-lg border-0 cursor-pointer"

        onClick={(e) => {
          e.stopPropagation(); // 👈 esto evita que bloquee el swipe
          navigate(`/coffeelover/prueba?branch=${branches.id}`);
        }}
      >
        {/* Contenedor de imagen con efecto de gradiente */}
        <div className="relative w-full h-full">
          {/* Overlay de carga */}
          <div
            className={`absolute inset-0 bg-[#8B5A2B]/10 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-500 z-10 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
            style={{ pointerEvents: 'none' }}
          >
            <Coffee className="h-8 w-8 text-[#8B5A2B] animate-pulse" />
          </div>

          {/* Imagen principal */}
          <img
            src={branches.store_logo || "/placeholder.svg"}
            alt={branches.name}
            style={{ pointerEvents: 'none' }}
            onLoad={() => setImageLoaded(true)}
            className="w-full h-full object-cover transition-all duration-700"
          />

          {/* Gradiente inferior para mejor contraste del texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

          {/* Nombre de la cafetería (estilo grande como en la referencia) */}

          <div className="absolute bottom-0 flex flex-col justify-center items-center  h-[8vh] md:h-[9vh] w-full bg-black/30 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl text-center">
              <h3
                className="text-[20px] md:text-[18px] font-light text-white mb-2 leading-tight line-clamp-2"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {branches.name}
              </h3>

              <div className="flex items-center gap-2 text-white/80 text-xs">
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="truncate">
                  {branches.address}
                </p>
              </div>
            </div>
          </div>


          {/* Etiqueta de estado */}
          <div className="absolute top-4 left-4">
            <div className="bg-[#F5E4D2] backdrop-blur-sm text-[#5F4B32] text-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Fire className="h-4 w-4" />
              <span>{statusConfig ? statusConfig.text : 'Aprobado'}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}