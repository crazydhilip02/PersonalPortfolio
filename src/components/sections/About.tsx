import React, { useEffect, useState } from 'react';
import { motion, useTransform, useMotionValue, animate } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, Download, Cpu, Shield } from 'lucide-react';
import GlitchText from '../effects/GlitchText';
import { useContent } from '../../context/ContentContext';

// --- Animated Counter Component ---
const Counter = ({ value, label }: { value: string, label: string }) => {
  const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // FIX: Using animate() function instead of method on MotionValue
    const controls = animate(count, numericValue, { duration: 2 });
    const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [numericValue, count, rounded]);

  return (
    <div className="bg-gray-900/25 backdrop-blur-md border border-white/10 hover:border-primary/30 p-6 rounded-xl relative overflow-hidden transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      <div className="absolute top-0 right-0 p-2 opacity-100">
        <Cpu size={16} className="text-primary" />
      </div>

      <h4 className="text-4xl font-bold text-white mb-2 flex items-baseline gap-1">
        <span className="text-primary">
          {displayValue}{suffix}
        </span>
      </h4>
      <p className="text-sm text-gray-400 font-mono tracking-wide uppercase">{label}</p>
    </div>
  );
};

const About: React.FC = () => {
  const { about, experience } = useContent();
  const [showTimeline, setShowTimeline] = useState(false);

  const stats = about?.stats || [
    { value: '20+', label: 'Projects Deployed' },
    { value: '100%', label: 'Secure Code' },
  ];

  const taglines = about?.taglines || ['Cybersecurity Enthusiast', 'Full Stack Developer', 'Problem Solver'];
  const profileImage = about?.profileImage || "https://via.placeholder.com/400"; // Fallback to avoid empty src

  return (
    <div className="relative overflow-hidden bg-transparent">
      {/* Background Matrix/Tech Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

      {/* SECTION 1: BIO & HOLO-PROFILE */}
      <section className="min-h-screen py-24 flex items-center relative z-10">
        <div className="container mx-auto px-4">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* HOLO PROFILE COLUMN */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto w-full max-w-md"
            >
              {/* Rotating Rings */}
              <div className="absolute -inset-10 border border-primary/20 rounded-full animate-[spin_8s_linear_infinite] pointer-events-none" />
              <div className="absolute -inset-20 border border-dotted border-primary/20 rounded-full animate-[spin_12s_linear_infinite_reverse] pointer-events-none" />

              {/* Profile Container */}
              <div className="relative group rounded-2xl p-1 bg-gradient-to-b from-primary/50 to-transparent">
                <div className="relative rounded-xl overflow-hidden bg-gray-900 border border-primary/30 aspect-[4/5] shadow-[0_0_50px_-10px_rgba(0,0,0,0.3)] shadow-primary/30">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />

                  {/* Scanning Line - CSS Animation */}
                  <div className="absolute left-0 right-0 h-1 bg-primary/80 shadow-[0_0_20px_var(--primary)] animate-scanline pointer-events-none" />

                  {/* Corner Accents */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary" />

                  {/* Floating ID Tag */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-primary font-mono mb-1">ID: 0xKD7</div>
                        <div className="text-white font-bold text-sm">Full Stack Architect</div>
                      </div>
                      <Shield size={20} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CONTENT COLUMN */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-mono tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  SYSTEM_DETECTED
                </div>
              </div>

              <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">I Design</span> <br />
                <GlitchText text="Secure_Future" className="text-primary" />
              </h2>

              <p className="text-gray-400 text-lg leading-relaxed mb-6 max-w-xl border-l-2 border-primary/30 pl-6">
                {about?.bio || "Crafting digital experiences that merge aesthetic elegance with military-grade security."}
              </p>

              {/* Skill Highlights with Animation */}
              <div className="mb-8 flex flex-wrap gap-2 max-w-xl">
                {['Full Stack Development', 'Cloud Architecture', 'AI/ML Integration', 'DevOps & CI/CD'].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="px-4 py-2 bg-gradient-to-r from-primary/10 to-transparent border border-primary/30 rounded-full text-sm font-mono text-primary hover:bg-primary/20 transition-all cursor-default"
                  >
                    <span className="text-primary/70">//</span> {skill}
                  </motion.div>
                ))}
              </div>

              {/* Animated Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {stats.map((stat: any, index: number) => (
                  <Counter key={index} value={stat.value} label={stat.label} />
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {/* Resume Button */}
                <a
                  href={about?.resumeLink || "#"}
                  className="group relative px-8 py-4 bg-primary text-black font-bold font-mono overflow-hidden clip-path-polygon hover:bg-white transition-colors"
                >
                  <div className="absolute inset-0 w-full h-full bg-white transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 mix-blend-difference" />
                  <span className="relative flex items-center gap-2">
                    <Download size={18} />
                    INITIATE_DOWNLOAD
                  </span>
                </a>

                {/* Timeline Toggle Button */}
                {(experience?.work?.length > 0 || experience?.education?.length > 0) && (
                  <button
                    onClick={() => setShowTimeline(!showTimeline)}
                    className="group relative px-8 py-4 bg-gray-900/25 backdrop-blur-md border border-white/10 hover:border-secondary/40 text-white font-bold font-mono overflow-hidden rounded-lg transition-all"
                  >
                    <div className="absolute inset-0 w-full h-full bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative flex items-center gap-2">
                      {showTimeline ? <GraduationCap size={18} /> : <Briefcase size={18} />}
                      {showTimeline ? 'HIDE_CHRONICLES' : 'VIEW_CHRONICLES'}
                    </span>
                  </button>
                )}

                {/* Social/Tech Tags */}
                <div className="flex gap-3">
                  {taglines.map((tag: string) => (
                    <span key={tag} className="text-xs font-mono text-gray-500 border border-gray-800 px-3 py-1 rounded hover:border-primary/50 hover:text-primary transition-colors cursor-default">
                      #{tag.replace(/\s/g, '_')}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: TIMELINE (Hideable/Showable) */}
      {showTimeline && (experience?.work?.length > 0 || experience?.education?.length > 0) && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
          className="py-32 relative border-t border-cyan-900/20 bg-gradient-to-b from-transparent to-cyan-900/5"
        >
          <div className="container mx-auto px-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <h2 className="text-6xl font-black text-white/5 absolute left-4 -top-10 select-none hidden md:block">CHRONICLE</h2>
              <div className="relative">
                <h2 className="text-primary font-mono tracking-widest mb-2">TIMELINE</h2>
                <h3 className="text-4xl font-bold text-white">Professional <span className="text-secondary">Chronicles</span></h3>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-7xl mx-auto">

              {/* WORK */}
              <div className="space-y-12">
                <div className="flex items-center gap-4 text-primary border-b border-primary/20 pb-4">
                  <Briefcase size={28} />
                  <h3 className="text-2xl font-bold font-mono">EXECUTION_LOG</h3>
                </div>

                <div className="space-y-0 border-l border-primary/20 ml-3">
                  {experience?.work?.map((job: any, index: number) => (
                    <div key={index} className="relative pl-12 pb-12 group last:pb-0">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-gray-900 rounded-full border border-primary group-hover:bg-primary group-hover:scale-125 transition-all duration-300" />

                      <motion.div
                        whileHover={{ x: 10 }}
                        className="p-6 bg-gray-900/25 backdrop-blur-sm border border-white/10 hover:border-primary/40 rounded-r-xl transition-all"
                      >
                        <span className="inline-block px-2 py-1 mb-3 text-xs font-mono text-primary bg-primary/10 rounded">{job.period}</span>
                        <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{job.role}</h4>
                        <h5 className="text-gray-400 mb-4 font-mono text-sm">{job.company}</h5>
                        <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                          {job.description}
                        </p>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

              {/* EDUCATION */}
              <div className="space-y-12">
                <div className="flex items-center gap-4 text-secondary border-b border-secondary/20 pb-4">
                  <GraduationCap size={28} />
                  <h3 className="text-2xl font-bold font-mono">KNOWLEDGE_BASE</h3>
                </div>

                <div className="space-y-0 border-l border-secondary/20 ml-3">
                  {experience?.education?.map((edu: any, index: number) => (
                    <div key={index} className="relative pl-12 pb-12 group last:pb-0">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-gray-900 rounded-full border border-secondary group-hover:bg-secondary group-hover:scale-125 transition-all duration-300" />

                      <motion.div
                        whileHover={{ x: 10 }}
                        className="p-6 bg-gray-900/25 backdrop-blur-sm border border-white/10 hover:border-secondary/40 rounded-r-xl transition-all"
                      >
                        <div className="flex items-center gap-2 mb-3 text-xs font-mono text-secondary">
                          <Calendar size={12} />
                          {edu.year}
                        </div>
                        <h4 className="text-xl font-bold text-white group-hover:text-secondary transition-colors">{edu.degree}</h4>
                        <h5 className="text-gray-400 mb-4 font-mono text-sm">{edu.institution}</h5>
                        <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                          {edu.description}
                        </p>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default About;