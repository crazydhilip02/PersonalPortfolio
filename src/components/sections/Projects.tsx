import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Code, Lock, Database, Server } from 'lucide-react';
import GlitchText from '../effects/GlitchText';
import project1 from './images/project1.png';

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const projects = [
    {
      title: "A1kitchensHub",
      description: " A home-style food ordering website",
      image: project1,
      tags: ["security", "react", "node"],
      category: "development",
      link: "https://www.a1cookinghub.com/",
      github: "https://github.com/crazydhilip02/a1cookinghub.git",
      techStack: ["React", "Node.js", "Typescript"]
    },
    // {
    //   title: "DataGuardian",
    //   description: "Secure file sharing platform with military-grade encryption",
    //   image: "https://images.pexels.com/photos/2882630/pexels-photo-2882630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //   tags: ["security", "encryption", "aws"],
    //   category: "security",
    //   link: "#",
    //   github: "#",
    //   techStack: ["Vue.js", "Python", "AWS S3", "PostgreSQL"]
    // },
    // {
    //   title: "CodeNexus",
    //   description: "Real-time collaborative IDE with version control and AI assistance",
    //   image: "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //   tags: ["react", "websockets", "ai"],
    //   category: "development",
    //   link: "#",
    //   github: "#",
    //   techStack: ["React", "Socket.io", "Express", "MongoDB"]
    // },
    // {
    //   title: "CloudGuard",
    //   description: "Cloud security monitoring dashboard with threat detection",
    //   image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //   tags: ["security", "cloud", "monitoring"],
    //   category: "security",
    //   link: "#",
    //   github: "#",
    //   techStack: ["Angular", "Node.js", "AWS Lambda", "Elasticsearch"]
    // },
    // {
    //   title: "QuantumChat",
    //   description: "Encrypted messaging platform with quantum-resistant cryptography",
    //   image: "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //   tags: ["security", "cryptography", "real-time"],
    //   category: "security",
    //   link: "#",
    //   github: "#",
    //   techStack: ["React Native", "GraphQL", "Node.js", "PostgreSQL"]
    // },
    // {
    //   title: "DevOpsHub",
    //   description: "CI/CD pipeline management tool with security scanning",
    //   image: "https://images.pexels.com/photos/1261427/pexels-photo-1261427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    //   tags: ["devops", "security", "automation"],
    //   category: "development",
    //   link: "#",
    //   github: "#",
    //   techStack: ["TypeScript", "Docker", "Kubernetes", "Redis"]
    // }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'security', label: 'Security', icon: <Lock size={14} /> },
    { id: 'development', label: 'Development', icon: <Code size={14} /> }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="min-h-screen py-20 flex items-center"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-sm uppercase tracking-wider text-purple-400 font-mono mb-2">
            Featured Work
          </h2>
          <h3 className="text-4xl font-bold mb-4">
            <span className="text-white">Recent</span>
            <GlitchText text=" Projects" className="ml-2 text-cyan-400" />
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto"></div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12 flex-wrap gap-2"
        >
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeFilter === category.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500'
                  : 'text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600'
              }`}
            >
              {category.icon}
              {category.label}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg border-2 border-gray-800 h-full flex flex-col bg-gray-900/30 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300">
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 z-20 p-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-xs bg-black/50 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/30">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Project Info */}
                <div className="p-6 flex-grow flex flex-col">
                  <h4 className="text-xl font-bold text-white mb-2">{project.title}</h4>
                  <p className="text-gray-300 mb-6 flex-grow">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <a 
                      href={project.github} 
                      className="text-gray-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={20} />
                    </a>
                    <a 
                      href={project.link} 
                      className="text-gray-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Projects;