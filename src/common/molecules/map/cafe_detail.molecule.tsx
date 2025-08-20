import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Star,MapPin,Navigation,Phone,ChevronDown,ChevronUp,MessageSquare,X,Tag,Clock} from "@/common/ui/icons";
import { Cafe } from "@/api/types/map/map_search.types";
import {normalizeSocialNetwork,SocialNetworkType} from "@/common/utils/social_networks.utils";
import ReviewsDialog from "@/common/molecules/coffeelover/reviews/reviews_dialog.molecule";
import WeeklySchedule from "@/common/molecules/schedules/weekly_schedule.molecule";
import { useBranchSchedules } from "@/api/queries/schedules/schedule.query";
import toast from "react-hot-toast";

import SafeNumericDisplay from "@/common/atoms/common/safe_numeric_display.atom";
import { useBranchAttributes } from "@/api/queries/branches/branch.query";

const determineNetworkType = (
  social: any
): "facebook" | "instagram" | "twitter" | "other" => {
  if (!social || !social.url) return "other";

  const url = social.url.toLowerCase();

  if (url.includes("facebook") || url.includes("fb.com")) return "facebook";
  if (url.includes("instagram") || url.includes("ig.com")) return "instagram";
  if (url.includes("twitter") || url.includes("x.com")) return "twitter";

  if (social.social_network_id === 1) return "facebook";
  if (social.social_network_id === 2) return "instagram";
  if (social.social_network_id === 3) return "twitter";

  return "other";
};

const getNetworkDisplayName = (social: any, networkType: string): string => {
  if (social.social_network_name) return social.social_network_name;
  switch (networkType) {
    case "facebook":
      return "Facebook";
    case "instagram":
      return "Instagram";
    case "twitter":
      return "Twitter";
    default:
      return "Sitio web";
  }
};

const renderSocialIcon = (type: SocialNetworkType) => {
  switch (type) {
    case "facebook":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3V2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "instagram":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="20"
            rx="5"
            ry="5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "twitter":
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="2"
            y1="12"
            x2="22"
            y2="12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
};

interface CafeDetailProps {
  cafe: Cafe;
  favorites: (string | number)[];
  toggleFavorite: (id: string | number) => void;
  navigateToCafe: (id: string | number) => void;
  startRoute: (id: string | number) => void;
  onClose: () => void;
  copyToClipboard: (text: string) => void;
  copied: boolean;
}

const arePropsEqual = (prevProps: CafeDetailProps, nextProps: CafeDetailProps) => {
  if (
    prevProps.cafe.id !== nextProps.cafe.id ||
    prevProps.copied !== nextProps.copied ||
    prevProps.favorites.length !== nextProps.favorites.length
  ) {
    return false;
  }

  for (let i = 0; i < prevProps.favorites.length; i++) {
    if (prevProps.favorites[i] !== nextProps.favorites[i]) {
      return false;
    }
  }

  return true;
};

const CafeDetail: React.FC<CafeDetailProps> = React.memo(({
  cafe,
  favorites,
  toggleFavorite,
  navigateToCafe,
  startRoute,
  onClose,
  copyToClipboard,
  copied,
}) => {
  const { data: attributesData, isLoading: attributesLoading } =useBranchAttributes(cafe.id);
  const { data: schedulesData, isLoading: schedulesLoading } = useBranchSchedules(cafe.id);
  const [showAllTags, setShowAllTags] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleOpenReviews = React.useCallback(() => {
    setIsReviewsOpen(true);
  }, []);

  const handleCloseReviews = React.useCallback(() => {
    setIsReviewsOpen(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current && contentRef.current.scrollTop > 20) {
        setShowScrollIndicator(false);
      } else {
        setShowScrollIndicator(true);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", handleScroll);

      const needsScroll =
        contentElement.scrollHeight > contentElement.clientHeight + 50;
      setShowScrollIndicator(needsScroll);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [cafe]);

  const renderSocialNetworks = () => {
    if (!cafe.socialNetworks || cafe.socialNetworks.length === 0) {
      return null;
    }
    const hasManyNetworks = cafe.socialNetworks.length > 3;

    return (
      <div
        className={`py-3 ${!hasManyNetworks ? "border-b border-gray-100" : ""}`}
      >
        <h4 className="font-medium text-[#2C1810] mb-2 flex items-center justify-between">
          <span>Redes Sociales</span>
          {hasManyNetworks && (
            <span className="text-xs text-[#6F4E37]/70">
              {cafe.socialNetworks.length} available
            </span>
          )}
        </h4>

        <div
          className={`${
            hasManyNetworks
              ? "grid grid-cols-2 md:grid-cols-3 gap-2"
              : "flex flex-wrap gap-2"
          }`}
        >
          {cafe.socialNetworks.map((social, idx) => {
            const normalizedNetwork = normalizeSocialNetwork(social);
            return (
              <a
                key={idx}
                href={normalizedNetwork.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 bg-white/80 hover:bg-white text-[#6F4E37] ${
                  hasManyNetworks
                    ? "px-3 py-2 rounded-md"
                    : "px-3 py-1.5 rounded-full"
                } transition-colors hover:shadow-sm`}
              >
                {renderSocialIcon(normalizedNetwork.type)}
                <span
                  className={`${
                    hasManyNetworks ? "text-xs" : "text-sm"
                  } font-medium truncate`}
                >
                  {normalizedNetwork.displayName}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTags = () => {
    if (attributesLoading) {
      return (
        <div className="py-3 border-t md:border-t-0 border-gray-100">
          <h4 className="font-medium text-[#2C1810] mb-2 flex items-center gap-1.5">
            <Tag size={14} className="text-[#6F4E37]" />
            <span>Especialidades</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="inline-block h-6 w-20 bg-[#F3D19E]/10 animate-pulse rounded-full"
              ></div>
            ))}
          </div>
        </div>
      );
    }

    if (attributesData?.attributes && attributesData.attributes.length > 0) {
      const hasManyAttributes = attributesData.attributes.length > 6;
      const displayAttributes = showAllTags
        ? attributesData.attributes
        : attributesData.attributes.slice(0, 6);

      return (
        <div className="py-3 border-t md:border-t-0 border-gray-100 overflow-x-hidden">
          <h4 className="font-medium text-[#2C1810] mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Tag size={14} className="text-[#6F4E37]" />
              <span>Especialidades</span>
            </div>
            {hasManyAttributes && (
              <span className="text-xs text-[#6F4E37]/70">
                {attributesData.attributes.length} en total
              </span>
            )}
          </h4>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 relative">
              {displayAttributes.map((attr, idx) => (
                <div key={idx} className="group">
                  <span
                    className="inline-block px-2.5 py-1 bg-[#F5E4D2] text-[#8B5A2B] hover:bg-[#EAD7C1] transition-colors text-xs rounded-full truncate max-w-[180px]"
                    title={attr.attributeName}
                  >
                    {attr.attributeName}
                  </span>

                  <div className="fixed opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-50 pointer-events-none">
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg p-2 text-xs shadow-lg max-w-[200px] w-max">
                      <div className="font-medium mb-0.5">
                        {attr.attributeName}
                      </div>
                      <div className="text-gray-600">{attr.value}</div>
                      <div className="absolute w-2 h-2 bg-white border-b border-r border-gray-200 transform rotate-45 -bottom-1 left-1/2 -translate-x-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasManyAttributes && (
              <div className="flex justify-center">
                <button
                  onClick={() => setShowAllTags(!showAllTags)}
                  className="bg-[#F5E4D2] hover:bg-[#EAD7C1] text-[#8B5A2B] text-xs font-medium px-3 py-1 rounded-full transition-colors flex items-center gap-1"
                >
                  <span>{showAllTags ? "Ver menos" : "Ver todos"}</span>
                  {showAllTags ? (
                    <ChevronUp size={12} />
                  ) : (
                    <ChevronDown size={12} />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (cafe.tags && cafe.tags.length > 0) {
      return (
        <div className="py-3 border-t md:border-t-0 border-gray-100">
          <h4 className="font-medium text-[#2C1810] mb-2 flex items-center gap-1.5">
            <Tag size={14} className="text-[#6F4E37]" />
            <span>Características</span>
          </h4>
          <div
            className={`flex flex-wrap gap-2 ${
              cafe.tags.length > 6 ? "max-h-24 overflow-y-auto pr-1" : ""
            }`}
          >
            {cafe.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-block px-2.5 py-1 bg-[#F3D19E]/20 text-[#6F4E37] text-xs rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden bg-[#FBF7F4] rounded-t-3xl md:rounded-3xl">
        <div className="relative h-48 sm:h-56 md:h-auto md:w-[40%] lg:w-[40%] xl:w-1/3 flex-shrink-0">
          <img
            src={cafe.image}
            alt={cafe.name}
            className="w-full h-full object-cover md:rounded-l-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:rounded-l-3xl"></div>

          <button
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-4 top-4 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full 
    hover:bg-white transition-all duration-300 text-[#5F4B32] hover:text-[#8B5A2B] hover:scale-110"
          >
            <X size={20} />
          </button>
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="font-bold text-2xl md:text-3xl lg:text-3xl text-white line-clamp-2">
              {cafe.name}
            </h3>{" "}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-amber-500">
                {cafe.rating ? (
                  <>
                    <Star size={16} className="fill-amber-500" />
                    <span className="font-medium text-white">
                      <SafeNumericDisplay
                        value={cafe.rating}
                        format={(val) => val.toFixed(1)}
                      />
                    </span>
                    <button
                      onClick={handleOpenReviews}
                      className="md:hidden ml-1 bg-white/20 backdrop-blur-sm rounded-full px-1.5 py-0.5 text-[10px] text-white/90 hover:bg-white/30 transition-colors flex items-center gap-0.5"
                    >
                      <MessageSquare size={10} />
                      <span>Ver</span>
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-white/90 font-medium">
                    Sin reseñas aún
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar md:pb-16 pb-24"
          >
            <div className="p-4 md:p-5 lg:p-6">
              <h2 className="text-xl font-bold text-[#2C1810] flex items-center gap-2">
                {cafe.name}
                {cafe.isOpen ? (
                  <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Abierto
                  </span>
                ) : (
                  <span className="text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    Cerrado
                  </span>
                )}
              </h2>
              <div className="flex items-center justify-between mt-2">
                {" "}
                <div className="flex items-center gap-1 text-amber-500">
                  {cafe.rating ? (
                    <>
                      <Star size={16} className="fill-amber-500" />
                      <span className="font-medium">
                        <SafeNumericDisplay
                          value={cafe.rating}
                          format={(val) => val.toFixed(1)}
                        />
                      </span>
                      <span className="text-sm text-gray-500">
                        (Reseñas disponibles)
                      </span>
                    </>
                  ) : (
                    <div className="text-sm text-gray-500 flex items-center gap-1.5">
                      <Star size={16} className="text-gray-300" />
                      <span>Sé el primero en reseñar esta cafetería</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-6 lg:gap-6 xl:grid-cols-12">
                <div className="xl:col-span-5">
                  <div className="mb-4 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <h4 className="font-medium text-[#2C1810] mb-1 flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#6F4E37]" />
                      <span>Dirección</span>
                    </h4>
                    <p className="text-gray-700 pl-5">
                      {cafe.address || "Dirección no disponible"}
                    </p>
                  </div>

                  <div className="bg-[#FBF7F4] rounded-lg">
                    {renderSocialNetworks()}
                  </div>
                </div>
                <div className="xl:col-span-7 md:pl-0 lg:pl-1">
                  {cafe.phone && (
                    <div className="mb-4">
                      <h4 className="font-medium text-[#2C1810] mb-2 flex items-center gap-1.5">
                        <Phone size={14} className="text-[#6F4E37]" />
                        <span>Teléfono</span>
                      </h4>
                      <div className="pl-5 flex items-center">
                        <a
                          href={`tel:${cafe.phone}`}
                          className="text-[#6F4E37] hover:underline font-medium"
                        >
                          {cafe.phone}
                        </a>
                        <button
                          onClick={() =>
                            window.open(`tel:${cafe.phone}`, "_self")
                          }
                          className="ml-2 bg-amber-50 hover:bg-amber-100 text-amber-600 p-1 rounded-full"
                          aria-label="Llamar"
                        >
                          <Phone size={14} />
                        </button>
                      </div>
                    </div>
                  )}

                  {renderTags()}
                </div>
              </div>

              {/* Horario de atención */}
              <div className="mt-6">
                <h4 className="font-medium text-[#2C1810] mb-2 flex items-center gap-1.5">
                  <Clock size={14} className="text-[#6F4E37]" />
                  <span>Horario de atención</span>
                </h4>

                <div className="bg-[#F5E4D2] bg-opacity-10 p-4 rounded-lg">
                  {schedulesData && schedulesData.length > 0 ? (
                    <WeeklySchedule schedules={schedulesData} />
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Horario no disponible
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showScrollIndicator && (
              <motion.div
                className="absolute bottom-[80px] md:bottom-[72px] left-0 w-full flex justify-center items-center pointer-events-none z-10"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-full py-1.5 px-3 flex items-center gap-1.5 border border-[#E6D7C3]/50">
                  <span className="text-xs text-[#6F4E37]/90 font-medium">
                    Más información
                  </span>
                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ChevronDown size={16} className="text-[#6F4E37]/90" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute md:relative bottom-0 left-0 right-0 py-4 md:py-5 px-4 md:px-6 bg-[#FBF7F4]/95 md:bg-[#FBF7F4] backdrop-blur-sm md:backdrop-filter-none border-t border-[#E6D7C3]/50 z-10">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex gap-2">
                <motion.button
                  className={`flex-1 py-3 md:py-2.5 rounded-full font-medium transition-all duration-300 
    transform hover:scale-[1.02] shadow-md hover:shadow-lg 
    flex items-center justify-center gap-1.5 ${
      cafe.isOpen
        ? "bg-[#6F4E37] text-white hover:bg-[#5d4230]"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
                  whileHover={cafe.isOpen ? { scale: 1.02 } : {}}
                  whileTap={cafe.isOpen ? { scale: 0.98 } : {}}
                  onClick={() => {
                    if (cafe.isOpen) {
                      startRoute(cafe.id);
                    } else {
                      toast.error("Esta cafetería está cerrada actualmente", {
                        icon: "⏰",
                        duration: 3000,
                      });
                    }
                  }}
                  disabled={!cafe.isOpen}
                >
                  <Navigation size={16} className="hidden sm:inline" />
                  <span>
                    {window.innerWidth <= 380
                      ? cafe.isOpen
                        ? "Ruta"
                        : "Cerrado"
                      : cafe.isOpen
                      ? "Iniciar ruta"
                      : "Cerrado - No disponible"}
                  </span>
                </motion.button>

                <motion.button
                  className="flex-1 md:max-w-[200px] bg-white border border-[#DB8935] text-[#DB8935] 
    py-3 md:py-2.5 rounded-full font-medium hover:bg-[#DB8935]/5 transition-all 
    duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg 
    flex items-center justify-center gap-1.5"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOpenReviews}
                >
                  <MessageSquare size={16} className="h-5 w-5" />
                  <span>
                    {cafe.rating
                      ? window.innerWidth <= 380
                        ? "Reseñas"
                        : "Ver reseñas"
                      : window.innerWidth <= 380
                      ? "Reseñar"
                      : "Ver reseñas"}
                  </span>
                </motion.button>
              </div>

              {/* <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <motion.button
                      className="w-10 h-10 flex items-center justify-center border border-[#6F4E37] text-[#6F4E37] rounded-xl hover:bg-[#6F4E37] hover:text-white transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 size={16} />
                    </motion.button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-64 md:w-72 z-[500] p-0 bg-white shadow-xl border-none rounded-2xl"
                    align="end"
                    side={window.innerWidth < 768 ? "top" : "right"}
                    sideOffset={16}
                    avoidCollisions={true}
                  >
                    <div className="p-4 sm:p-5 border-b border-[#E6D7C3]/50">
                      <h3 className="font-medium text-[#5F4B32] text-base sm:text-lg flex items-center justify-between gap-2 border-b border-[#E6D7C3] pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-[#DB8935]/10 p-1.5 rounded-full">
                            <Share2 size={14} className="text-[#DB8935]" />
                          </div>
                          <span>Compartir cafetería</span>
                        </div>
                      </h3>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3">
                      <button
                        className="group relative overflow-hidden rounded-xl bg-white/80 hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 w-full p-3 flex items-center gap-3"
                        onClick={() =>
                          copyToClipboard(
                            `https://maps.google.com/maps?q=${cafe.latitude},${cafe.longitude}`
                          )
                        }
                      >
                        <div className="rounded-full bg-[#DB8935]/10 p-2">
                          <Copy size={16} className="text-[#DB8935]" />
                        </div>
                        <span className="flex-1 text-[#5F4B32] text-sm font-medium">
                          {copied ? "Link copiado! ✓" : "Copiar enlace"}
                        </span>
                      </button>

                      <a
                        className="group relative overflow-hidden rounded-xl bg-white/80 hover:bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 w-full p-3 flex items-center gap-3"
                        href={`https://maps.google.com/maps?q=${cafe.latitude},${cafe.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="rounded-full bg-[#DB8935]/10 p-2">
                          <ExternalLink size={16} className="text-[#DB8935]" />
                        </div>
                        <span className="flex-1 text-[#5F4B32] text-sm font-medium">
                          Abrir en Google Maps
                        </span>
                      </a>
                    </div>
                  </PopoverContent>
                </Popover>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <ReviewsDialog
        branchId={cafe.id}
        branchName={cafe.name}
        isOpen={isReviewsOpen}
        onClose={handleCloseReviews}
      />
    </>
  );
}, arePropsEqual);

CafeDetail.displayName = 'CafeDetail';

export default CafeDetail;
