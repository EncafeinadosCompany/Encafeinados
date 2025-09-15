import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserIcon,
  HomeIcon,
  InfoIcon,
  MenuIcon,
  XIcon,
} from "@/common/ui/icons";
import logoIcon from "@/assets/images/logo.ico";
import { getEncryptedItem } from "@/common/utils/security/storage_encrypted.utils";
import { UserData } from "@/api/types/auth/auth.types";
import { useAuth } from "@/common/hooks/auth/use_auth.hook";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = getEncryptedItem("user") as UserData;
  const fullName = localStorage.getItem("userFullName");
  const navigate = useNavigate();
  const { pagesPermissions } = useAuth();
  
  // Usamos un ref para el observador
  const topSentinelRef = React.useRef<HTMLDivElement>(null);

  const handleUserNavigation = () => {
    if (user && user.roles) {
      pagesPermissions(user.roles, navigate);
    } else {
      navigate("/login");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    {
      href: "/",
      label: "Inicio",
      icon: <HomeIcon className="w-5 h-5" />,
      isAction: false,
    },
    {
      href: "/about",
      label: "Acerca de",
      icon: <InfoIcon className="w-5 h-5" />,
      isAction: false,
    },
    user
      ? {
          href: "#",
          label: user.name || fullName ? user.name || fullName : "Cuenta",
          icon: <UserIcon className="w-5 h-5" />,
          isAction: true,
          action: handleUserNavigation,
        }
      : {
          href: "/login",
          label: "Iniciar Sesión",
          icon: <UserIcon className="w-5 h-5" />,
          isAction: false,
        },
  ];

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      transition: {
        when: "afterChildren",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  // Utilizamos Intersection Observer en lugar de detectar scroll
  useEffect(() => {
    // Elemento para observar - cuando este elemento ya no es visible, significa que hemos scrolleado
    if (!topSentinelRef.current) return;
    
    const observerOptions = {
      rootMargin: "-1px 0px 0px 0px", // Activar inmediatamente con el mínimo scroll
      threshold: 0 // Activar tan pronto como el elemento deje de ser visible
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      // Si el elemento ya no es visible (scrolled hacia arriba), activamos el efecto
      setScrolled(!entry.isIntersecting);
      
      // Debugging
      console.log("Scroll change detected:", !entry.isIntersecting, "at:", new Date().toISOString());
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(topSentinelRef.current);
    
    // Establecer el estado inicial correctamente al montar el componente
    // Si ya hemos scrolleado un poco antes de montar el componente
    if (window.scrollY > 10) {
      setScrolled(true);
    }
    
    return () => {
      if (topSentinelRef.current) {
        observer.unobserve(topSentinelRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Elemento invisible que sirve como punto de referencia para el Intersection Observer */}
      <div 
        ref={topSentinelRef}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0,
          height: '2px', 
          width: '100%', 
          zIndex: -100,
          pointerEvents: 'none'
        }} 
      />
      
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
        ${
          scrolled
            ? "bg-gradient-to-b from-[#382a22] to-[#433b2f] shadow-lg  border-transparent py-1 transform-gpu" 
            : "bg-transparent border-b border-transparent py-3 transform-gpu" 
        }`}
      >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.img
            src={logoIcon}
            alt="Encafeinados logo"
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="h-10 w-10 object-contain group-hover:scale-110 transition-transform"
          />
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#F5E6D0] font-bold text-2xl tracking-wider 
            group-hover:text-[#E8C99B] transition-colors"
          >
            Encafeinados
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {link.isAction ? (
                <button
                  onClick={() => {
                    if (link.action) {
                      link.action();
                    }
                  }}
                  className={`hover:text-[#E8C99B] 
                  transition-all duration-300 flex items-center space-x-2 
                  group relative overflow-hidden py-1 px-3 rounded-md
                  ${scrolled 
                    ? "text-[#F5E6D0]/90 font-medium" 
                    : "text-[#F5E6D0] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] bg-[#5A3921]/30 backdrop-blur-sm"
                  }`}
                >
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4A76A]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {link.icon}
                  <span className="group-hover:text-[#E8C99B] transition-colors">
                    {link.label}
                  </span>
                </button>
              ) : (
                <Link
                  to={link.href}
                  className={`hover:text-[#E8C99B] 
                  transition-all duration-300 flex items-center space-x-2 
                  group relative overflow-hidden py-1 px-3 rounded-md
                  ${scrolled 
                    ? "text-[#F5E6D0]/90 font-medium" 
                    : "text-[#F5E6D0] font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)] bg-[#5A3921]/30 backdrop-blur-sm"
                  }`}
                >
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4A76A]"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  {link.icon}
                  <span className="group-hover:text-[#E8C99B] transition-colors">
                    {link.label}
                  </span>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.9 }}
          className="md:hidden text-white"
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: 0 }}
                animate={{ rotate: 180 }}
                exit={{ rotate: 0 }}
              >
                <XIcon className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 0 }}
                animate={{ rotate: 180 }}
                exit={{ rotate: 0 }}
              >
                <MenuIcon className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="md:hidden absolute top-full left-0 right-0 
            bg-gradient-to-br from-[#3C2A21] to-[#1A1207] 
            backdrop-blur-lg shadow-lg border-t border-[#D4A76A]/20"
          >
            <div className="flex flex-col items-center py-6 space-y-4">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={mobileItemVariants}
                  className="w-full text-center"
                >
                  {link.isAction ? (
                    <button
                      onClick={() => {
                        if (link.action) {
                          link.action();
                        }
                        toggleMobileMenu();
                      }}
                      className="text-white/90 hover:text-[#D4A76A] 
                      transition-colors flex items-center justify-center 
                      space-x-3 py-3 w-full group"
                    >
                      {link.icon}
                      <span
                        className="group-hover:text-[#D4A76A] 
                      transition-colors text-lg tracking-wider"
                      >
                        {link.label}
                      </span>
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={toggleMobileMenu}
                      className="text-white/90 hover:text-[#D4A76A] 
                      transition-colors flex items-center justify-center 
                      space-x-3 py-3 w-full group"
                    >
                      {link.icon}
                      <span
                        className="group-hover:text-[#D4A76A] 
                      transition-colors text-lg tracking-wider"
                      >
                        {link.label}
                      </span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
};
