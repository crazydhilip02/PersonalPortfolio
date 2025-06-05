import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, Github, Linkedin, Code, ExternalLink, Instagram } from 'lucide-react';
import TerminalText from '../effects/TerminalText';
import GlitchText from '../effects/GlitchText';
import { FaWhatsapp } from 'react-icons/fa';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col items-center justify-center relative py-20"
    >
      <div className="z-10 text-center max-w-4xl px-4">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl md:text-7xl font-bold mb-4 text-white"
        >
          <GlitchText text="Dhilip kumar " as="span" className="text-glow" />
        </motion.h1>

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-2xl md:text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 inline-block text-transparent bg-clip-text"
        >
          Full Stack Developer
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mb-12 text-gray-300 text-lg max-w-2xl mx-auto"
        >
          <TerminalText 
            text="I craft secure, elegant code and build cutting-edge applications. Specializing in full-stack development  and system architecture."
            speed={30}
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToProjects}
            className="px-8 py-3 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
          >
            View Projects <Code size={18} />
          </motion.button>
          
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-md bg-black border border-purple-500 text-white font-medium flex items-center gap-2 hover:bg-purple-500/10 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
          >
            Hire Me <ExternalLink size={18} />
          </motion.a>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="mt-12 flex justify-center gap-6"
        >
          <motion.a 
            href="https://github.com/crazydhilip02" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ y: -5, scale: 1.1 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github size={24} />
          </motion.a>
          <motion.a 
            href="https://www.linkedin.com/in/dhilipkumar03" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ y: -5, scale: 1.1 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Linkedin size={24} />
          </motion.a>
          <motion.a 
            href="https://www.instagram.com/crazy_dhilip2/" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ y: -5, scale: 1.1 }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Instagram size={24} />
          </motion.a>
          <motion.a
            href="https://wa.me/6374106956"
            target="_blank"
            whileHover={{ y: -5, scale: 1.1 }}
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaWhatsapp size={24} />
          </motion.a>
        </motion.div>
      </div>

      {/* Floating Arrow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 2, duration: 1 },
          y: { repeat: Infinity, duration: 1.5 }
        }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <ArrowDown className="text-cyan-400" />
      </motion.div>
    </motion.div>
  );
};

export default Home;
