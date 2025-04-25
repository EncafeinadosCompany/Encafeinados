import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, ChevronUp, X, Coffee, Linkedin, Twitter, Globe } from 'lucide-react';

interface Member {
  name: string;
  role: string;
  imagenUrl?: string;
  bio?: string;
}

interface TeamCardProps {
  members: Member[];
  variant?: 'leadership' | 'developers' | 'partners';
}

export const TeamCard: React.FC<TeamCardProps> = ({ members, variant = 'developers' }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  if (!members || members.length === 0) {
    return <div className="text-center py-8 text-[#6F4E37]">No hay miembros para mostrar.</div>;
  }

  // Control de miembros visibles con configuración por variante
  const initialVisible = variant === 'partners' ? 4 : 8;
  const showExpandButton = members.length > initialVisible;
  const visibleMembers = expanded ? members : showExpandButton ? members.slice(0, initialVisible) : members;

  // Manejar clic en miembro para expandir detalles
  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
  };

  // Cerrar modal de detalles
  const closeDetails = () => {
    setSelectedMember(null);
  };

  return (
    <div className="w-full relative">
      {/* Grid de perfiles circulares */}
      <div className="w-full mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
          {visibleMembers.map((member, index) => (
            <CircleProfile 
              key={`${member.name}-${index}`} 
              member={member} 
              index={index}
              variant={variant} 
              onClick={() => handleMemberClick(member)}
            />
          ))}
        </div>
      </div>
      
      {/* Botón "Ver más" */}
      {showExpandButton && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#D4A76A] hover:bg-[#C3966A] text-white rounded-full transition-colors shadow-md hover:shadow-lg text-sm font-medium"
          >
            {expanded ? (
              <>
                <span>Ver menos</span>
                <ChevronUp size={18} />
              </>
            ) : (
              <>
                <span>Ver {members.length - initialVisible} más</span>
                <ChevronDown size={18} />
              </>
            )}
          </button>
        </div>
      )}

      {/* Modal de detalles del miembro seleccionado */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={closeDetails}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white rounded-2xl overflow-hidden max-w-md w-full shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeDetails}
                className="absolute top-3 right-3 bg-white/80 hover:bg-white text-[#6F4E37] rounded-full p-1.5 z-10"
              >
                <X size={20} />
              </button>

              <div className="relative bg-gradient-to-br from-[#D4A76A] to-[#6F4E37] h-32 overflow-hidden">
                {/* Patrón decorativo de granos de café */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                    <Coffee size={80} color="#fff" />
                  </div>
                  <div className="absolute top-3/4 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                    <Coffee size={60} color="#fff" />
                  </div>
                </div>
              </div>

              {/* Foto de perfil */}
              <div className="relative flex justify-center">
                <div className="absolute -top-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-[#D4A76A]/10 shadow-lg">
                  {selectedMember.imagenUrl ? (
                    <img 
                      src={selectedMember.imagenUrl} 
                      alt={selectedMember.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=D4A76A&color=fff&size=128`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Información del miembro */}
              <div className="pt-20 px-6 pb-6">
                <h3 className="text-xl font-bold text-[#2C1810] text-center">{selectedMember.name}</h3>
                <div className="bg-[#D4A76A]/10 text-[#6F4E37] px-4 py-1.5 rounded-full text-sm font-medium text-center my-2">
                  {selectedMember.role}
                </div>
                
                {selectedMember.bio && (
                  <p className="text-[#6F4E37] mt-4 text-center leading-relaxed">
                    {selectedMember.bio}
                  </p>
                )}
                
                {/* Íconos de redes sociales */}
                <div className="flex justify-center gap-3 mt-6">
                  <SocialButton icon={<Linkedin size={18} />} color="#0077B5" />
                  <SocialButton icon={<Twitter size={18} />} color="#1DA1F2" />
                  <SocialButton icon={<Globe size={18} />} color="#6F4E37" />
                  <SocialButton icon={<Coffee size={18} />} color="#D4A76A" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Componente de perfil circular
interface CircleProfileProps {
  member: Member;
  index: number;
  variant?: 'leadership' | 'developers' | 'partners';
  onClick: () => void;
}

const CircleProfile = ({ member, index, variant, onClick }: CircleProfileProps) => {
  // Tamaños de círculos según variante
  const size = 
    variant === 'leadership' ? "w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36" :
    variant === 'partners' ? "w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40" :
    "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.8) }}
      className="flex flex-col items-center"
    >
      {/* Círculo con borde decorativo */}
      <motion.button
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(212, 167, 106, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        className={`
          ${size} rounded-full overflow-hidden cursor-pointer relative
          bg-white shadow-md hover:shadow-xl transition-all duration-300
          border-2 border-[#D4A76A] p-1
        `}
        onClick={onClick}
      >
        {/* Borde con efecto de grano de café */}
        <span className="absolute inset-0 rounded-full border-[3px] border-[#D4A76A]/20 border-dashed"></span>
        
        {/* Foto o avatar */}
        <div className="w-full h-full rounded-full overflow-hidden bg-[#D4A76A]/10 relative">
          {member.imagenUrl ? (
            <img 
              src={member.imagenUrl} 
              alt={member.name} 
              className="w-full h-full object-cover hover:scale-110 transition-all duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=D4A76A&color=fff&size=120`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={variant === 'leadership' ? 40 : 32} className="text-[#6F4E37]" />
            </div>
          )}
          
          {/* Efecto de superposición al hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2C1810]/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
            <span className="text-white text-xs font-medium bg-[#D4A76A]/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
              Ver perfil
            </span>
          </div>
        </div>
      </motion.button>
      
      <h3 className="mt-3 font-medium text-[#2C1810] text-center max-w-[120px] mx-auto truncate">
        {member.name}
      </h3>
      <p className="text-[#D4A76A] text-xs text-center max-w-[120px] mx-auto truncate">
        {member.role}
      </p>
    </motion.div>
  );
};

interface SocialButtonProps {
  icon: React.ReactNode;
  color: string;
}

const SocialButton = ({ icon, color }: SocialButtonProps) => (
  <a 
    href="#" 
    className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 hover:border-[#D4A76A] transition-colors duration-300"
    style={{ color }}
  >
    {icon}
  </a>
);
