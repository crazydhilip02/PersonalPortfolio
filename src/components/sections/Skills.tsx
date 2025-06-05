import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import GlitchText from '../effects/GlitchText';

const Skills: React.FC = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: [
        { name: "React", level: 90 },
        { name: "TypeScript", level: 85 },
        // { name: "Vue.js", level: 75 },
        // { name: "Next.js", level: 80 },
        { name: "Tailwind CSS", level: 90 },
      ]
    },
    {
      title: "Backend",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Java", level: 80 },
        { name: "Express", level: 85 },
        // { name: "Django", level: 75 },
        // { name: "GraphQL", level: 70 },
      ]
    },
    {
      title: "Security",
      skills: [
        // { name: "Penetration Testing", level: 80 },
        // { name: "OAuth/JWT", level: 90 },
        { name: "Encryption", level: 85 },
        { name: "Security Audits", level: 75 },
        { name: "Secure Architecture", level: 85 },
      ]
    },
    // {
    //   title: "DevOps",
    //   skills: [
    //     { name: "Docker", level: 80 },
    //     { name: "CI/CD", level: 75 },
    //     { name: "AWS", level: 70 },
    //     { name: "Kubernetes", level: 65 },
    //     { name: "Terraform", level: 60 },
    //   ]
    // }
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
            Technical Arsenal
          </h2>
          <h3 className="text-4xl font-bold mb-4">
            <span className="text-white">Skills &</span>
            <GlitchText text=" Expertise" className="ml-2 text-cyan-400" />
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-lg border border-gray-800"
            >
              <h4 className="text-xl font-bold mb-4 text-white flex items-center">
                <span className="text-purple-400 font-mono mr-2">./</span>
                {category.title}
              </h4>

              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.3, 
                      delay: (categoryIndex * 0.1) + (skillIndex * 0.1) 
                    }}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-gray-300">
                        <span className="text-cyan-400">≫</span> {skill.name}
                      </span>
                      <span className="text-gray-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${
                          skill.level > 80 
                            ? 'bg-gradient-to-r from-cyan-500 to-purple-500' 
                            : skill.level > 60 
                              ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                              : 'bg-gradient-to-r from-indigo-500 to-blue-500'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16"
        >
          {/* <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-gray-800">
            <h4 className="text-xl font-bold mb-4 text-white">
              <span className="text-purple-400 font-mono mr-2">$</span>
              Additional Capabilities
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "UI/UX Design", "Database Architecture", "API Development",
                "System Architecture", "Performance Optimization", "WebGL/Three.js",
                "Mobile Development", "Data Visualization", "Web Security",
                "Testing & QA", "Blockchain", "Microservices"
              ].map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ x: -10, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 1 + (index * 0.05) }}
                  className="flex items-center gap-2"
                >
                  <Check size={16} className="text-green-500" />
                  <span className="text-gray-300">{skill}</span>
                </motion.div>
              ))}
            </div>
          </div> */}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Skills;