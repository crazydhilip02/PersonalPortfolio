import React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Layout, Code2, Cpu, Globe, Terminal, Shield, Layers } from 'lucide-react';
import GlitchText from '../effects/GlitchText';
import { useContent } from '../../context/ContentContext';

// --- CONFIGURATION ---
// STRICT REVERT: No react-icons imports to ensure site stability.
const DEFAULT_COLOR = "var(--primary)"; // Primary Theme Color

// Simple mapping for Lucide icons
const getSkillConfig = (skillName: string) => {
  const n = skillName.toLowerCase();

  if (n.includes('react') || n.includes('vue') || n.includes('angular') || n.includes('web') || n.includes('html') || n.includes('css')) return { Icon: Layout, color: '#61DAFB' };
  if (n.includes('node') || n.includes('server') || n.includes('java') || n.includes('php') || n.includes('go')) return { Icon: Server, color: '#339933' };
  if (n.includes('python') || n.includes('ai') || n.includes('data') || n.includes('ml')) return { Icon: Cpu, color: '#3776AB' };
  if (n.includes('db') || n.includes('sql') || n.includes('mongo') || n.includes('firebase')) return { Icon: Database, color: '#47A248' };
  if (n.includes('aws') || n.includes('cloud') || n.includes('docker') || n.includes('kube')) return { Icon: Globe, color: '#FF9900' };
  if (n.includes('security') || n.includes('cyber')) return { Icon: Shield, color: '#FF0000' };
  if (n.includes('git') || n.includes('bash') || n.includes('linux') || n.includes('terminal')) return { Icon: Terminal, color: '#F05032' };
  if (n.includes('design') || n.includes('figma')) return { Icon: Layers, color: '#F24E1E' };

  return { Icon: Code2, color: DEFAULT_COLOR };
};

const SkillPill = ({ name }: { name: string }) => {
  const { Icon, color } = getSkillConfig(name);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex items-center gap-4 px-6 py-4 bg-gradient-to-br from-gray-900/20 via-gray-800/15 to-gray-900/25 backdrop-blur-xl border border-white/10 rounded-2xl hover:border-white/30 transition-all cursor-pointer overflow-hidden shadow-lg hover:shadow-2xl"
    >
      {/* Animated Gradient Border on Hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${color}, transparent, ${color})` }}
      />

      {/* Dynamic Glow Effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none blur-2xl"
        style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
      />

      {/* Animated Background Shine */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />

      {/* Icon Container with 3D Effect */}
      <div
        className="relative z-10 p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 group-hover:from-white/20 group-hover:to-white/10 transition-all duration-300 shadow-lg group-hover:shadow-xl transform group-hover:rotate-12 group-hover:scale-110"
        style={{
          color: color,
          boxShadow: `0 0 20px ${color}20, inset 0 0 20px ${color}10`
        }}
      >
        <Icon size={24} strokeWidth={2.5} />
      </div>

      {/* Text with Gradient */}
      <span
        className="relative z-10 text-base font-bold text-gray-200 group-hover:text-white transition-colors tracking-wide"
        style={{
          textShadow: `0 0 20px ${color}40`
        }}
      >
        {name}
      </span>

      {/* Animated Bottom Border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`
        }}
      />

      {/* Corner Glow */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-2xl"
        style={{ background: `radial-gradient(circle at top right, ${color}, transparent)` }}
      />
    </motion.div>
  );
};

const CategoryGroup = ({ category, index }: { category: any, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-12 last:mb-0"
    >
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-1.5 h-8 rounded-full" style={{ backgroundColor: `var(--primary)` }} />
          {category.title}
        </h3>
        <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
      </div>

      <div className="flex flex-wrap gap-4">
        {category.skills.map((skill: any, i: number) => (
          <SkillPill key={i} name={skill.name} />
        ))}
      </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const { skills: skillCategories } = useContent();

  return (
    <section className="min-h-screen py-24 relative flex flex-col justify-center">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:30px_30px] opacity-[0.03] pointer-events-none" />

      <div className="container mx-auto px-4 z-10 max-w-6xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center max-w-2xl mx-auto"
        >
          <h2 className="font-mono tracking-widest mb-2" style={{ color: `var(--primary)` }}>CAPABILITIES</h2>
          <h3 className="text-5xl font-bold mb-6 text-white">
            Tech <span style={{ color: `var(--primary)` }}><GlitchText text="Arsenal" /></span>
          </h3>
          <p className="text-gray-400 text-lg leading-relaxed">
            Leveraging industry-standard protocols and cutting-edge frameworks to architect scalable digital solutions.
          </p>
        </motion.div>

        <div className="space-y-4">
          {skillCategories.map((category, index) => (
            <CategoryGroup key={index} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;