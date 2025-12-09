import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { Github, ExternalLink, Code, Lock } from 'lucide-react';
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
    if (!ref.current) return;

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
      className="relative h-full rounded-xl bg-gray-900/40 backdrop-blur-md border border-white/10 group hover:border-cyan-500/50 transition-colors duration-300"
    >
      <div
        style={{
          transform: "translateZ(50px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-gray-900/20 shadow-lg "
      >
        {/* This inner div is just for Z-depth spacing if needed, but we put content directly below */}
      </div>

      {/* CARD CONTENT */}
      <div style={{ transform: "translateZ(20px)" }} className="flex flex-col h-full relative z-10">

        {/* Image */}
        <div className="relative h-48 rounded-t-xl overflow-hidden group">
          <img
            src={project.image || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000"}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Category Badge */}
          {project.category && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-3 py-1 bg-cyan-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-full text-xs text-cyan-300 font-medium shadow-lg shadow-cyan-500/10">
                {project.category}
              </span>
            </div>
          )}
          {/* Overlay with buttons */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            {project.github && project.github !== '#' && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all hover:scale-110"
                title="View Code"
              >
                <Github size={20} />
              </a>
            )}
            {project.link && project.link !== '#' && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-cyan-600/80 hover:bg-cyan-500 rounded-full text-white backdrop-blur-sm transition-all hover:scale-110 shadow-[0_0_15px_rgba(8,145,178,0.5)]"
                title="Live Demo"
              >
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Text Content */}
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.techStack?.map((tech: string) => (
              <span
                key={tech}
                className="text-[10px] font-mono px-2 py-1 rounded-full bg-cyan-900/20 border border-cyan-500/30 text-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_12px_rgba(34,211,238,0.2)] transition-shadow"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cyberpunk Corners */}
      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 border-t-2 border-r-2 border-cyan-500"></div>
      </div>
      <div className="absolute bottom-0 left-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-2 h-2 border-b-2 border-l-2 border-purple-500"></div>
      </div>

    </motion.div>
  );
};

const Projects: React.FC = () => {
  const { projects, categories: firestoreCategories } = useContent();

  // Debug: Log when projects load
  React.useEffect(() => {
    console.log('📊 Projects component: Loaded', projects.length, 'projects');
    console.log('Project data:', projects);
  }, [projects]);

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
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-cyan-500 font-mono tracking-widest mb-4">SYSTEM_PORTFOLIO</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Deployed <GlitchText text="Solutions" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500" />
          </h3>
          <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
        </motion.div>

        {/* Filter (Visual only since we have few projects) */}
        <motion.div
          className="flex justify-center gap-4 mb-12"
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
                  ? 'border-cyan-500 text-cyan-400 bg-cyan-950/30'
                  : 'border-gray-800 text-gray-500 hover:border-gray-600'}`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto perspectives-1000">
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id || i}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
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