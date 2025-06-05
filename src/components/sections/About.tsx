import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Code, Brain, Coffee } from 'lucide-react';
import GlitchText from '../effects/GlitchText';
import profile from './images/20250602_1651_Hacker-Themed Portrait_remix_01jwr5xmx0e5mrpedeczjj9hhm.png'

const About: React.FC = () => {
  const stats = [
    // { value: '5+', label: 'Years Experience', icon: <Coffee size={20} /> },
    { value: '10+', label: 'Projects Completed', icon: <Code size={20} /> },
    // { value: '25+', label: 'Secure Systems', icon: <Shield size={20} /> },
    { value: '10+', label: 'Happy Clients', icon: <Brain size={20} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col justify-center py-20"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-sm uppercase tracking-wider text-purple-400 font-mono mb-2">
            About Me
          </h2>
          <h3 className="text-4xl font-bold mb-4">
            <GlitchText text="The Human" className="mr-2" />
            <span className="text-cyan-400">Behind The Code</span>
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-md opacity-75 blur"></div>
              <div className="relative rounded-md overflow-hidden border-2 border-gray-800 aspect-square">
                {/* Profile image would go here */}
                <img src={profile}></img>
                
              </div>
              
              
              <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-500"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-purple-500"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-800">
                <h4 className="text-xl font-bold mb-4 text-white">
                  <span className="text-purple-400">$</span> who am i
                </h4>
                <p className="text-gray-300 mb-4">
                  I'm a passionate software engineer with expertise in building secure, scalable applications. 
                  With a background in cybersecurity and full-stack development, I create solutions that are 
                  both innovative and fortified against modern threats.
                </p>
                {/* <p className="text-gray-300">
                  My approach combines technical excellence with creative problem-solving, allowing me to 
                  develop systems that exceed expectations while maintaining the highest security standards.
                </p> */}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.6 + (index * 0.1) }}
                    className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-gray-800"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-800 rounded-md text-cyan-400">
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <a 
                  href="#contact"
                  className="inline-flex items-center gap-2 text-cyan-400 border border-cyan-500 px-6 py-3 rounded-md hover:bg-cyan-500/10 transition-colors"
                >
                  <span
                  >Contact Me</span>
                  <Code size={16} />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;