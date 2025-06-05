import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import GlitchText from '../effects/GlitchText';

const Experience: React.FC = () => {
  const [activeTab, setActiveTab] = useState('work');
  
  const experiences = {
    work: [
      {
        title: "Senior Software Engineer",
        company: "TechCorp Industries",
        location: "San Francisco, CA",
        period: "2021 - Present",
        description: [
          "Led development of secure fintech applications with React and Node.js",
          "Implemented OAuth 2.0 and JWT authentication systems",
          "Reduced API response times by 40% through optimization",
          "Mentored junior developers and conducted code reviews"
        ]
      },
      {
        title: "Full Stack Developer",
        company: "DataSecure Solutions",
        location: "Remote",
        period: "2019 - 2021",
        description: [
          "Built secure data management applications with Vue.js and Django",
          "Implemented encryption systems for sensitive client information",
          "Developed automated testing pipelines reducing bugs by 35%",
          "Collaborated with security team to conduct penetration testing"
        ]
      },
      {
        title: "Frontend Engineer",
        company: "WebMatrix Inc.",
        location: "New York, NY",
        period: "2017 - 2019",
        description: [
          "Developed responsive web applications with React and TypeScript",
          "Optimized frontend performance improving load times by 50%",
          "Integrated RESTful APIs and implemented state management",
          "Collaborated in agile team of 8 developers"
        ]
      }
    ],
    education: [
      {
        title: "M.S. in Computer Science",
        company: "Stanford University",
        location: "Stanford, CA",
        period: "2015 - 2017",
        description: [
          "Specialized in Cybersecurity and Machine Learning",
          "Thesis: 'Neural Network Approaches to Intrusion Detection Systems'",
          "GPA: 3.9/4.0",
          "Teaching Assistant for Advanced Algorithms"
        ]
      },
      {
        title: "B.S. in Computer Engineering",
        company: "MIT",
        location: "Cambridge, MA",
        period: "2011 - 2015",
        description: [
          "Minor in Mathematics",
          "Member of Cybersecurity Club",
          "Senior Project: Secure IoT Communication Protocol",
          "Dean's List all semesters"
        ]
      }
    ],
    certifications: [
      {
        title: "Certified Ethical Hacker (CEH)",
        company: "EC-Council",
        location: "Online",
        period: "2022",
        description: [
          "Advanced penetration testing methodologies",
          "Vulnerability assessment and exploitation techniques",
          "Network security and cryptography",
          "Web application security"
        ]
      },
      {
        title: "AWS Certified Solutions Architect",
        company: "Amazon Web Services",
        location: "Online",
        period: "2021",
        description: [
          "Designing distributed systems on AWS",
          "Security best practices for cloud architectures",
          "Cost optimization strategies",
          "High availability and disaster recovery planning"
        ]
      },
      {
        title: "Microsoft Certified: Azure Security Engineer",
        company: "Microsoft",
        location: "Online",
        period: "2020",
        description: [
          "Identity and access management",
          "Platform protection strategies",
          "Data and application security",
          "Security operations management"
        ]
      }
    ]
  };

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
            Professional Journey
          </h2>
          <h3 className="text-4xl font-bold mb-4">
            <GlitchText text="Experience" className="mr-2 text-white" />
            <span className="text-cyan-400">& Timeline</span>
          </h3>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 flex justify-center space-x-4"
          >
            {['work', 'education', 'certifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500' 
                    : 'text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600'
                }`}
              >
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 h-full w-1 bg-gradient-to-b from-cyan-500 via-purple-500 to-cyan-500 opacity-30"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {experiences[activeTab as keyof typeof experiences].map((exp, index) => (
                <motion.div
                  key={exp.title}
                  initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                  className={`relative md:w-1/2 ${
                    index % 2 === 0 ? 'md:ml-auto md:pl-8' : 'md:mr-auto md:pr-8'
                  }`}
                >
                  {/* Timeline dot */}
                  <div className={`absolute top-0 ${
                    index % 2 === 0 ? 'left-0 md:-left-4' : 'left-0 md:-left-4 md:left-auto md:-right-4'
                  } w-8 h-8 rounded-full bg-black border-2 border-cyan-500 flex items-center justify-center`}>
                    {activeTab === 'work' && <Briefcase size={16} className="text-cyan-400" />}
                    {activeTab === 'education' && <Calendar size={16} className="text-cyan-400" />}
                    {activeTab === 'certifications' && <Calendar size={16} className="text-cyan-400" />}
                  </div>

                  <div className="bg-gray-900/30 backdrop-blur-sm p-6 rounded-lg border border-gray-800 ml-10 md:ml-0">
                    <div className="mb-4">
                      <span className="text-xs font-mono text-cyan-400 bg-cyan-900/30 px-2 py-1 rounded">
                        {exp.period}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{exp.title}</h4>
                    <h5 className="text-gray-300 mb-2 font-mono text-sm">@{exp.company}</h5>
                    <div className="flex items-center text-gray-400 mb-4 text-sm">
                      <MapPin size={14} className="mr-1" />
                      {exp.location}
                    </div>
                    <ul className="space-y-2 text-gray-300">
                      {exp.description.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-purple-400 mr-2">▹</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Experience;