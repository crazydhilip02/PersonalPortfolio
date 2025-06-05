import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Code, User, Cpu, Clock, Rocket, Send } from 'lucide-react';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'home', label: 'Home', icon: <Code size={20} /> },
    { id: 'about', label: 'About', icon: <User size={20} /> },
    { id: 'skills', label: 'Skills', icon: <Cpu size={20} /> },
    // { id: 'experience', label: 'Experience', icon: <Clock size={20} /> },
    { id: 'projects', label: 'Projects', icon: <Rocket size={20} /> },
    { id: 'contact', label: 'Contact', icon: <Send size={20} /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navItems.map(item => item.id);
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

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-8 left-8 z-50"
      >
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`relative w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-[2px] ${scrolled ? 'shadow-2xl shadow-cyan-500/50' : ''
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
            className="absolute inset-0 rounded-full border-2 border-cyan-400"
          />
          <motion.div
            animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-full border border-purple-400"
          />
        </motion.button>
      </motion.div>

      {/* Radial Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none"
          >
            {navItems.map((item, index) => {
              const startAngle = -20;
              const endAngle = 110;
              const totalAngle = endAngle - startAngle;
              const angleStep = totalAngle / (navItems.length - 1);
              const angle = startAngle + index * angleStep;

              const radius = 150;
              const radian = (angle * Math.PI) / 180;
              const x = Math.cos(radian) * radius;
              const y = Math.sin(radian) * radius;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0, x: 32, y: 32 }}
                  animate={{ opacity: 1, scale: 1, x: x + 32, y: y + 32 }}
                  exit={{ opacity: 0, scale: 0, x: 32, y: 32 }}
                  transition={{ delay: index * 0.1, type: 'spring' }}
                  className="absolute top-8 left-8 pointer-events-auto"
                >
                  <motion.button
                    onClick={() => scrollToSection(item.id)}
                    whileHover={{ scale: 1.2, rotateZ: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative group w-12 h-12 rounded-full bg-gradient-to-r ${activeSection === item.id
                        ? 'from-yellow-400 to-orange-500'
                        : 'from-gray-700 to-gray-900'
                      } p-[1px] transition-all duration-300`}
                  >
                    <div className="w-full h-full rounded-full bg-black/80 backdrop-blur-sm flex items-center justify-center text-white">
                      {item.icon}
                    </div>

                    {/* Tooltip */}
                    <div
                      className="absolute top-1/2 left-full ml-2 transform -translate-y-1/2 invisible group-hover:visible transition-opacity bg-black/90 text-cyan-400 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none"
                    >
                      {item.label}
                    </div>

                  </motion.button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
