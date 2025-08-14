import {
  FlameIcon as Fire,
  Coffee,
  MapPin,
  Star,
  Clock,
  Heart,
} from "@/common/ui/icons";
import { Card } from "@/common/ui/card";
import { useState } from "react";
import { motion } from "framer-motion";
import { ApprovedBranch } from "@/api/types/branches/branches_approval.types";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/common/ui/badge";
import { Flame } from "lucide-react";

interface FeaturedCardProps {
  branches: ApprovedBranch;
  isFeatured?: boolean;
  current?: number;
  index?: number;
  onLike?: (branchId: number) => void;
  isLiked?: boolean;
}

export default function FeaturedCard({
  current,
  branches,
  isFeatured = false,
  index = 0,
  onLike,
  isLiked = false,
}: FeaturedCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  console.log("RAITING", branches)

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "APPROVED":
        return {
          color: "bg-[#f5e4d2] text-amber-800 border border-none",
          icon: Flame,
          text: "Destacado",
        };
      case "PENDING":
        return {
          color: "bg-amber-50 text-amber-700 border border-amber-200",
          icon: "⏳",
          text: "Próximamente",
        };
      default:
        return {
          color: "bg-rose-50 text-rose-700 border border-rose-200",
          icon: "🔒",
          text: "Cerrado",
        };
    }
  };

  const statusConfig = getStatusConfig(branches.status);

  // Generar rating falso para demostración (en producción vendría de la API)
  const rating = branches.average_rating
    ? parseFloat(branches.average_rating)
    : 4.2;
  const isOpen = branches.status ?? true;

  return (
    <motion.div
      className={`${
        isFeatured ? "w-[80vh] h-64" : "w-[50vh] h-60"
      } transition-all duration-300`}
      whileHover={{ scale: 1.02, y: -4 }}
      style={{ touchAction: "pan-y" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="w-full h-full overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl border-0 cursor-pointer bg-white transition-all duration-300"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/coffeelover/details?branch=${branches.id}`);
        }}
      >
        {/* Contenedor de imagen con efecto de gradiente */}
        <div className="relative w-full h-full group">
          {/* Overlay de carga mejorado */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 backdrop-blur-sm flex items-center justify-center transition-all duration-500 z-10 ${
              imageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="flex flex-col items-center gap-3 ">
              <div className="relative">
                <Coffee className="h-10 w-10 text-amber-600 animate-pulse" />
                <div className="absolute inset-0 h-10 w-10 bg-amber-200 rounded-full animate-ping opacity-20"></div>
              </div>
              <p className="text-amber-700 text-sm font-medium">
                Cargando cafetería...
              </p>
            </div>
          </div>

          {/* Imagen principal con overlay de hover */}
          <div className="relative w-full h-full overflow-hidden">
            <img
              src={branches.store_logo || "/placeholder.svg"}
              alt={branches.name}
              style={{ pointerEvents: "none" }}
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />

            {/* Overlay de hover */}
            <div
              className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            ></div>
          </div>

          {/* Gradientes mejorados */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent"></div>

          {/* Información principal mejorada */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <div className="space-y-3">
              {/* Nombre y rating */}
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold text-white leading-tight flex-1 line-clamp-2">
                  {branches.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-white text-sm font-semibold">
                    {branches.average_rating}
                  </span>
                </div>
              </div>

              {/* Dirección */}
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm truncate max-w-[280px]">
                  {branches.address || "Dirección no disponible"}
                </p>
              </div>

              {/* Información adicional en hover */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between text-white/80 text-xs"
              >
                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  ☕ Especialidad en café
                </span>
                {/* <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  📍 {Math.floor(Math.random() * 5) + 1} km
                </span> */}
              </motion.div>
            </div>
          </div>

          {/* Botón de favorito */}
          {/* <motion.button
            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(branches.id);
            }}
          >
            <Heart
              className={`h-5 w-5 transition-colors duration-200 ${
                isLiked
                  ? "text-red-500 fill-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </motion.button> */}

          {/* Etiqueta de estado mejorada */}
          <div className="absolute top-4 left-4 z-20">
            <Badge
              className={`${statusConfig.color} px-3 py-1 rounded-full flex items-center gap-2 font-medium shadow-lg backdrop-blur-sm`}
            >
              {typeof statusConfig.icon === 'string' ? (
                <span className="text-sm">{statusConfig.icon}</span>
              ) : (
                <statusConfig.icon className="h-4 w-4 text-black" />
              )}
              <span className="text-sm">{statusConfig.text}</span>
            </Badge>
          </div>

          {/* Indicador de horario */}
          <div className="absolute top-4 right-4 z-20">
            <Badge
              className={`px-3 py-1 rounded-full flex items-center gap-2 font-medium shadow-lg backdrop-blur-sm ${
                isOpen
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              <Clock className="h-3 w-3" />
              <span className="text-xs">{isOpen ? "Abierto" : "Cerrado"}</span>
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
