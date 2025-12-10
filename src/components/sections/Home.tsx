import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, Github, Linkedin, Code, ExternalLink, Instagram } from 'lucide-react';
import TerminalText from '../effects/TerminalText';
import GlitchText from '../effects/GlitchText';
import { FaWhatsapp } from 'react-icons/fa';
import { useContent } from '../../context/ContentContext';

const Home: React.FC = () => {
  const { hero } = useContent();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!hero) return null;

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
          <GlitchText text={hero.title || "Full Stack Developer"} as="span" className="text-glow" />
        </motion.h1>

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-2xl md:text-3xl font-bold mb-8 inline-block text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(to right, var(--primary), var(--secondary), var(--primary))` }}
        >
          {hero.subtitle}
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mb-12 text-gray-300 text-lg max-w-2xl mx-auto"
        >
          <TerminalText
            text={hero.description}
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
            className="px-8 py-3 rounded-md text-black font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 bg-primary"
          >
            View Projects <Code size={18} />
          </motion.button>

          <motion.a
            href={hero.resumeLink || "#"}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-md bg-black border border-secondary text-white font-medium flex items-center gap-2 hover:bg-secondary/10 hover:shadow-lg hover:shadow-secondary/20 transition-all duration-300"
          >
            My Resume <ExternalLink size={18} />
          </motion.a>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.7 }}
          className="mt-12 flex justify-center gap-6"
        >
          {hero.socialLinks?.github && (
            <motion.a
              href={hero.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Github size={24} />
            </motion.a>
          )}
          {hero.socialLinks?.linkedin && (
            <motion.a
              href={hero.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Linkedin size={24} />
            </motion.a>
          )}
          {hero.socialLinks?.instagram && (
            <motion.a
              href={hero.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, scale: 1.1 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram size={24} />
            </motion.a>
          )}
          {hero.socialLinks?.whatsapp && (
            <motion.a
              href={hero.socialLinks.whatsapp}
              target="_blank"
              whileHover={{ y: -5, scale: 1.1 }}
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaWhatsapp size={24} />
            </motion.a>
          )}
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
        <ArrowDown className="text-primary" />
      </motion.div>
    </motion.div>
  );
};

export default Home;
