import React from 'react';
import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  className = '', 
  as: Component = 'span' 
}) => {
  return (
    <Component 
      className={`relative inline-block glitch-effect ${className}`} 
      data-text={text}
    >
      <motion.span
        initial={{ opacity: 1 }}
        animate={{
          opacity: [1, 0.8, 0.9, 1],
          x: [0, -1, 1, 0],
          y: [0, 1, -1, 0]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatType: 'mirror',
          repeatDelay: 5
        }}
      >
        {text}
      </motion.span>
    </Component>
  );
};

export default GlitchText;