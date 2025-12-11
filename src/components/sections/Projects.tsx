import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import GlitchText from '../effects/GlitchText';
import { useContent } from '../../context/ContentContext';

const ROTATION_RANGE = 20.5;
const HALF_ROTATION_RANGE = 20.5 / 2;

const Project3DCard = ({ project }: { project: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Only apply 3D effect on larger screens
    if (!ref.current || window.innerWidth < 768) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-full rounded-xl bg-gray-900/25 backdrop-blur-md border border-white/10 group hover:border-primary/40 transition-all duration-300 flex flex-col"
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-gray-900/20 shadow-lg hidden md:block" // Hide depth placeholder on mobile
      />

      {/* CARD CONTENT */}
      <div style={{ transform: "translateZ(20px)" }} className="flex flex-col h-full relative z-10">

        {/* Image */}
        <div className="relative h-48 rounded-t-xl overflow-hidden group">
          <img
            src={project.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000"}
            alt={project.title}
            className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-110"
            loading="lazy"
          />
          {/* Category Badge */}
          {project.category && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className="px-3 py-1 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full text-xs text-primary font-medium shadow-lg"
              >
                {project.category}
              </span>
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="p-5 flex-grow flex flex-col">
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>

          {/* Client/Company Name - Always Visible */}
          {project.client && (
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs font-mono text-primary/70">for</span>
              <span className="text-sm font-medium text-primary/90">{project.client}</span>
            </div>
          )}

          {/* Description - Hidden on Mobile, Visible clamped on Desktop */}
          <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow hidden md:block line-clamp-4">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.techStack?.slice(0, 4).map((tech: string) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-2 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary"
              >
                {tech}
              </span>
            ))}
            {project.techStack?.length > 4 && (
              <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-gray-800 border border-gray-700 text-gray-400">
                +{project.techStack.length - 4}
              </span>
            )}
          </div>

          {/* Fixed Bottom Action Bar */}
          <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between gap-3">
            {project.github && project.github !== '#' ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition-colors"
              >
                <Github size={16} /> <span className="hidden sm:inline">CODE</span>
              </a>
            ) : <div />}

            {project.link && project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/50 rounded-lg text-primary text-xs font-bold tracking-wide transition-all"
              >
                LIVE DEMO <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const { projects, categories: firestoreCategories } = useContent();
  const [activeFilter, setActiveFilter] = React.useState('all');

  // Build filter categories dynamically from Firestore
  const categories = [
    { id: 'all', label: 'All Projects' },
    ...firestoreCategories.map(cat => ({
      id: cat.name,
      label: cat.name
    }))
  ];

  const filteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <section className="min-h-screen py-24 flex flex-col justify-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-primary font-mono tracking-widest mb-4">SYSTEM_PORTFOLIO</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Deployed <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary"><GlitchText text="Solutions" /></span>
          </h3>
          <div className="h-1 w-24 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full shadow-[0_0_15px_var(--primary)]" />
        </motion.div>

        {/* Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-full font-mono text-xs border transition-all duration-300 flex items-center gap-2
                 ${activeFilter === cat.id
                  ? 'border-primary text-primary bg-primary/20'
                  : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto perspectives-1000">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id || i}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="h-full"
            >
              <Project3DCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;