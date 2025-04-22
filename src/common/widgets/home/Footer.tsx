import React, { useState, useEffect, useRef, MouseEvent } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Instagram, ArrowUp, Coffee, MapPin, Music2, Mail, ChevronDown } from '@/common/ui/icons';
import { SocialIcon } from '@/common/atoms/SocialIcon';
import logoIcon from "@/assets/images/logo.ico";
import { useScrollNavigation } from '@/common/hooks/useScrollNavigation';

interface FooterProps {
  sections?: Array<{
    name: string;
    id: string;
  }>;
}

export const Footer = ({ sections }: FooterProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [instagramMenuOpen, setInstagramMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const defaultSections = [
    { name: 'Inicio', id: 'home' },
    { name: 'Mapa', id: 'map' },
    { name: 'Tiendas', id: 'stores' },
    { name: 'Beneficios', id: 'benefits' }
  ];

  const navLinks = sections || defaultSections;

  const sectionIds = navLinks.map(link => link.id);
  const { scrollToSection, isActive } = useScrollNavigation(sectionIds);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setInstagramMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside as EventListener);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside as EventListener);
    };
  }, [menuRef]);

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      sectionIds.forEach(id => {
        const element = document.getElementById(id);
        console.log(`Sección "${id}": ${element ? 'Encontrada' : 'NO ENCONTRADA'}`);
      });
    }
  }, [sectionIds]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: {
        duration: 0.3
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleInstagramMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setInstagramMenuOpen(!instagramMenuOpen);
  };

  const footerBackground = `
    data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.415L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415 9.9-9.9v-2.828zm0 5.657L51.515 47.8l1.414 1.413 7.07-7.07v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 47.8v-2.83zm0 5.657l-2.828 2.83 1.414 1.413L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413L30 11.8l7.07 7.414v-.001zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.243 4.242zm-2.83 2.827l1.415-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E
  `;

  const InstagramMenuButton = () => (
    <div className="relative" ref={menuRef}>
      <div 
        onClick={toggleInstagramMenu}
        className="flex items-center cursor-pointer"
        aria-label="Instagram"
      >
        <SocialIcon
          icon={<Instagram size={20} />}
          href="#"
          label="Instagram"
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
          }}
        />
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform duration-300 ${instagramMenuOpen ? 'rotate-180' : ''} text-white`}
        />
      </div>
      
      <AnimatePresence>
        {instagramMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white/10 backdrop-blur-sm ring-1 ring-white/20 z-20 overflow-hidden"
          >
            <div className="py-1">
              <a
                href="https://www.instagram.com/encafeinados_tienda/"
                className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={16} className="mr-2" />
                <span>Encafeinados tienda</span>
              </a>
              <a
                href="https://www.instagram.com/encafeinados.club/"
                className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={16} className="mr-2" />
                <span>Encafeinados club</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <footer
      className="relative bg-gradient-to-br from-[#2C1810] to-[#6F4E37] text-white overflow-hidden"
      style={{ backgroundImage: `url("${footerBackground}")` }}
      ref={ref}
    >
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[#D4A76A]/10"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              fontSize: `${Math.random() * 2 + 1}rem`,
              rotate: `${Math.random() * 360}deg`
            }}
            animate={{
              y: [0, -15, 0],
              rotate: [`${Math.random() * 360}deg`, `${Math.random() * 360 + 40}deg`]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          >
            <Coffee size={Math.random() * 24 + 16} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="flex flex-wrap justify-between gap-8"
        >
          {/* Logo y About */}
          <motion.div
            variants={itemVariants}
            className="flex-grow basis-64 max-w-md"
          >
            <div className="flex items-center mb-6">
              <img src={logoIcon} alt="Encafeinados Logo" className="h-8 w-8 mr-2" />
              <h2 className="text-2xl font-bold tracking-tight">Encafeinados</h2>
            </div>
            <p className="text-white/80 mb-6">
              Conectamos a los amantes del café con las mejores cafeterías locales de Medellín, promoviendo la rica cultura cafetera de Colombia.
            </p>
            <div className="flex space-x-4 relative">
              <InstagramMenuButton />
              
              <SocialIcon
                icon={<Music2 size={20} />}
                href="https://www.tiktok.com/@encafeinados.comp"
                label="TikTok"
              />
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex-grow basis-40 max-w-xs"
          >
            <h3 className="text-lg font-semibold mb-4 text-[#D4A76A]">Enlaces</h3>
            <ul className="space-y-2">
              {navLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <button
                    className={`text-white/70 hover:text-[#D4A76A] transition-colors inline-block py-1 cursor-pointer ${
                      isActive(link.id) ? 'text-[#D4A76A]' : ''
                    }`}
                    onClick={() => scrollToSection(link.id, { offset: -80 })}
                  >
                    {link.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contacto */}
          <motion.div
            variants={itemVariants}
            className="flex-grow basis-64 max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4 text-[#D4A76A]">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-[#D4A76A] mr-2 mt-0.5" />
                <span className="text-white/70">Calle 10 #42-45, Poblado, Medellín, Colombia</span>
              </li>
              {/* <li className="flex items-center">
                <Phone size={18} className="text-[#D4A76A] mr-2" />
                <span className="text-white/70">+57 (604) 123-4567</span>
              </li> */}
              <li className="flex items-center">
                <Mail size={18} className="text-[#D4A76A] mr-2" />
                <span className="text-white/70">encafeinadoscompany@gmail.com</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-[#D4A76A] mr-2" />
                <span className="text-white/70">3166093889</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-white/60 text-sm">
          <motion.p variants={itemVariants}>
            © {new Date().getFullYear()} Encafeinados. Todos los derechos reservados.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-4 mt-4 sm:mt-0"
          >
            <span>Hecho con ☕ en Medellín</span>
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="bg-[#D4A76A] p-2 rounded-full shadow-lg hover:bg-[#A67C52] transition-colors"
            >
              <ArrowUp size={16} />
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-0 transform translate-y-1">
        <svg
          className="relative block w-full h-12 sm:h-16"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-[#FAF3E0]/10"
          ></path>
        </svg>
      </div>
    </footer>
  );
};