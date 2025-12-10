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
      whileHover={{ y: -4, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative flex items-center gap-3 px-5 py-3 bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-xl hover:border-white/20 transition-all cursor-default overflow-hidden"
    >
      {/* Dynamic Hover Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
      />

      {/* Icon */}
      <div
        className="relative z-10 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors"
        style={{ color: color }}
      >
        <Icon size={20} />
      </div>

      {/* Text */}
      <span className="relative z-10 text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
        {name}
      </span>

      {/* Bottom Border Highlight */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{ backgroundColor: color }}
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