import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, HomeIcon, InfoIcon, MenuIcon, XIcon } from '@/common/ui/icons';
import logoIcon from "@/assets/images/logo.ico";


export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: '/', label: 'Inicio', icon: <HomeIcon className="w-5 h-5" /> },
    { href: '/about', label: 'Acerca de', icon: <InfoIcon className="w-5 h-5" /> },
    { href: '/login', label: 'Iniciar Sesión', icon: <UserIcon className="w-5 h-5" /> }
  ];

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      transition: {
        when: "afterChildren"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };


  useEffect(() => {
    const handleScroll = () => {
      // Use a smaller threshold to ensure the effect triggers more reliably
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
  
    // Call handleScroll immediately to set initial state
    handleScroll();
    
    // Add event listener
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out
      ${scrolled 
        ? 'bg-[#2C1810]/90 backdrop-blur-md shadow-lg' 
        : 'bg-[#2C1810]/90'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center space-x-3 group"
        >
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
            className="text-white font-bold text-2xl tracking-wider 
            group-hover:text-[#D4A76A] transition-colors"
          >
            Encafeinados
          </motion.span>
        </Link>

        {/* Navegación Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to={link.href}
                className="text-white/80 hover:text-[#D4A76A] 
                transition-colors flex items-center space-x-2 
                group relative overflow-hidden py-1"
              >

                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-[#D4A76A]"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {link.icon}
                <span className="group-hover:text-[#D4A76A] transition-colors">
                  {link.label}
                </span>
              </Link>
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
            bg-gradient-to-br from-[#2C1810] to-[#6F4E37] 
            backdrop-blur-lg shadow-lg"
          >
            <div className="flex flex-col items-center py-6 space-y-4">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={mobileItemVariants}
                  className="w-full text-center"
                >
                  <Link
                    to={link.href}
                    onClick={toggleMobileMenu}
                    className="text-white/90 hover:text-[#D4A76A] 
                    transition-colors flex items-center justify-center 
                    space-x-3 py-3 w-full group"
                  >
                    {link.icon}
                    <span className="group-hover:text-[#D4A76A] 
                    transition-colors text-lg tracking-wider">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};