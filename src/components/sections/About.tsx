import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Cpu, Shield, Zap } from 'lucide-react';
import GlitchText from '../effects/GlitchText';
import { useContent } from '../../context/ContentContext';

const About: React.FC = () => {
  const { about } = useContent();

  const stats = about.stats || [
    { value: '20+', label: 'Projects Deployed' },
    { value: '100%', label: 'Secure Code' },
  ];

  return (
    <section className="min-h-screen py-24 flex items-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-900/10 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Visual Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative group perspective-1000"
          >
            {/* Decorative Rings */}
            <div className="absolute inset-0 border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite] w-[450px] h-[450px] -left-10 -top-10 hidden lg:block" />
            <div className="absolute inset-0 border border-purple-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse] w-[400px] h-[400px] left-0 top-0 hidden lg:block" />

            {/* Profile Image Card */}
            <div className="relative w-full max-w-md mx-auto transform transition-transform duration-500 hover:rotate-y-6 hover:rotate-x-6 preserve-3d">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />

              <div className="relative bg-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden aspect-square shadow-2xl">
                <img
                  src={about.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />

                {/* Overlay Details */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                  <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    SYSTEM_ONLINE
                  </div>
                  <h3 className="text-white font-bold text-lg">Full Stack Security Architect</h3>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="text-cyan-500" size={20} />
              <span className="text-cyan-500 font-mono text-sm tracking-wider">ABOUT_ME</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Architecting <GlitchText text="Secure" className="text-cyan-400" /> <br />
              Digital Experiences
            </h2>

            <div className="space-y-6 text-gray-300 mb-8 leading-relaxed">
              <p>
                I am not just a developer; I am a digital architect who bridges the gap between
                <strong> robust engineering</strong> and <strong>impenetrable security</strong>.
                With expertise spanning the <strong>MERN Stack</strong> and <strong>Java Full Stack</strong> ecosystems,
                I build applications that are not only high-performing but also inherently secure by design.
              </p>
              <p>
                My philosophy is simple: <strong>Code is law, but security is survival.</strong>
                While I craft intuitive user interfaces with React and Tailwind, I simultaneously fortify the backend
                with Spring Boot and Node.js, ensuring that every data transmission is encrypted and every endpoint is defended.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat: any, index: number) => (
                <div key={index} className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cyan-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                  <h4 className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{stat.value}</h4>
                  <p className="text-sm text-gray-400 font-mono">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tech Tagline */}
            <div className="flex flex-wrap gap-3">
              {['Cybersecurity Enthusiast', 'Full Stack Developer', 'Problem Solver'].map((tag) => (
                <span key={tag} className="px-3 py-1 bg-cyan-900/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300 font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;