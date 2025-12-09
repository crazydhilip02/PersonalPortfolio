import React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Layout, Code2, cpu } from 'lucide-react';
import GlitchText from '../effects/GlitchText';
import { useContent } from '../../context/ContentContext';

const SkillCard = ({ category, index }: { category: any, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="group relative bg-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-colors duration-300"
    >
      {/* Hover Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

      <div className="relative h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
            {category.title.includes('MERN') ? <Layout size={24} /> :
              category.title.includes('Java') ? <Server size={24} /> :
                <Code2 size={24} />}
          </div>
          <h3 className="text-xl font-bold text-white">{category.title}</h3>
        </div>

        <div className="space-y-4 flex-grow">
          {category.skills.map((skill: any, i: number) => (
            <div key={i} className="group/skill">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-gray-300 group-hover/skill:text-cyan-300 transition-colors">{skill.name}</span>
                <span className="text-gray-500 font-mono">{skill.level}%</span>
              </div>
              <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                  className={`h-full rounded-full ${category.title.includes('MERN') ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                      category.title.includes('Java') ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                        'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Skills: React.FC = () => {
  const { skills: skillCategories } = useContent();

  return (
    <section className="min-h-screen py-24 relative flex items-center">
      {/* Background Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none" />

      <div className="container mx-auto px-4 z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center max-w-2xl mx-auto"
        >
          <h2 className="text-cyan-500 font-mono tracking-widest mb-2">CAPABILITIES</h2>
          <h3 className="text-4xl font-bold mb-4 text-white">
            Technical <GlitchText text="Arsenal" className="text-purple-400" />
          </h3>
          <p className="text-gray-400">
            A comprehensive suite of technologies driven by performance, scalability, and security.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <SkillCard key={index} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;