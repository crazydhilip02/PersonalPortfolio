import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Code, User, Cpu, Rocket, Send, Home, Briefcase, GraduationCap } from 'lucide-react';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  // Separated Home from others to handle the specific layout: Main -> Right(Home) -> Down(Rest)
  const homeItem = { id: 'home', label: 'Home', icon: <Home size={20} /> };
  const menuItems = [
    { id: 'about', label: 'About', icon: <User size={20} /> },
    { id: 'skills', label: 'Skills', icon: <Cpu size={20} /> },
    { id: 'services', label: 'Services', icon: <Briefcase size={20} /> },
    { id: 'experience', label: 'Education', icon: <GraduationCap size={20} /> },
    { id: 'projects', label: 'Projects', icon: <Rocket size={20} /> },
    { id: 'contact', label: 'Contact', icon: <Send size={20} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const allItems = [homeItem, ...menuItems];
      const sections = allItems.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2 // Wait for home button
      }
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20, scale: 0.8 },
    show: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.8 }
  };

  return (
    <>
      {/* 
        Using z-50 for the wrapper ensures this entire nav sits above page content.
        Inside, we manage stacking contexts to ensure row 1 (Home) is above row 2 (Dropdown).
      */}
      <div className="fixed top-8 left-8 z-50 flex flex-col items-start gap-4 pointer-events-none">

        {/* Row 1: Main Toggle -> Home Button */}
        {/* Added z-50 relative to ensure this row sits ON TOP of the row below it */}
        <div className="flex items-center gap-4 relative z-50 pointer-events-auto">
          {/* Main Floating Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`relative w-16 h-16 rounded-full p-[2px] ${scrolled ? 'shadow-2xl shadow-primary/50' : ''
                }`}
            >
              <div className="w-full h-full rounded-full bg-black/90 backdrop-blur-lg flex items-center justify-center">
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl text-white"
                >
                  {isOpen ? '✕' : '◉'}
                </motion.div>
              </div>

              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-2 border-primary"
              />
            </motion.button>
          </motion.div>

          {/* Home Button (Appears to the RIGHT) */}
          <AnimatePresence>
            {isOpen && (
              <motion.button
                initial={{ x: -50, opacity: 0, scale: 0.5 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -20, opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => scrollToSection(homeItem.id)}
                className={`group w-12 h-12 rounded-full p-[1px] shadow-lg relative ${activeSection === homeItem.id
                  ? 'bg-primary shadow-primary/40'
                  : 'bg-gradient-to-r from-gray-700 to-gray-900'
                  }`}
              >
                <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white">
                  {homeItem.icon}
                </div>
                {/* Tooltip: z-50 ensures it's above local content */}
                <div className="absolute top-1/2 left-full ml-3 transform -translate-y-1/2 invisible group-hover:visible transition-opacity bg-black/90 text-primary px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none z-50 border border-primary/30">
                  {homeItem.label}
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Row 2: Dropdown List (Below the Home Button) */}
        {/* relative z-40 ensures this sits BELOW Row 1 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col gap-3 pl-20 pointer-events-auto relative z-40"
            >
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  variants={itemVariants}
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative group w-12 h-12 rounded-full p-[1px] shadow-lg ${activeSection === item.id
                    ? 'bg-primary shadow-primary/40'
                    : 'bg-gradient-to-r from-gray-700 to-gray-900'
                    }`}
                >
                  <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white">
                    {item.icon}
                  </div>
                  <div className="absolute top-1/2 left-full ml-3 transform -translate-y-1/2 invisible group-hover:visible transition-opacity bg-black/90 text-primary px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none z-50 border border-primary/30">
                    {item.label}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
};

export default NavBar;
