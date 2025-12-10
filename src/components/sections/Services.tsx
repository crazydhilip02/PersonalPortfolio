import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, Database, Palette, Shield, Zap, Globe, Cpu, Server } from 'lucide-react';
import GlitchText from '../effects/GlitchText';
import { useContent } from '../../context/ContentContext';

// Icon mapping for dynamic icon selection
const iconMap: Record<string, React.ReactNode> = {
    Briefcase: <Briefcase />,
    Code: <Code />,
    Database: <Database />,
    Palette: <Palette />,
    Shield: <Shield />,
    Zap: <Zap />,
    Globe: <Globe />,
    Cpu: <Cpu />,
    Server: <Server />
};

interface ServicesProps {
    onBookService?: (serviceName: string) => void;
}

const Services: React.FC<ServicesProps> = ({ onBookService }) => {
    const { services } = useContent();

    const handleBookNow = (serviceName: string) => {
        if (onBookService) {
            onBookService(serviceName);
        }
    };

    return (
        <section id="services" className="py-24 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-tech-grid opacity-10 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-mono mb-4">
                        <span className="animate-pulse">●</span> AVAILABLE_SERVICES
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        What I <GlitchText text="Offer" className="text-primary" />
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Professional services tailored to bring your vision to life
                    </p>
                </motion.div>

                {/* Services Grid */}
                {services.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        <Code className="mx-auto mb-4 opacity-50" size={48} />
                        <p>No services configured yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="group relative"
                            >
                                <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 h-full flex flex-col">
                                    {/* Hover Glow Effect */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                                    {/* Icon */}
                                    <div className="relative mb-4">
                                        <div className="w-16 h-16 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                                            {iconMap[service.icon] || <Briefcase />}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                        {service.description}
                                    </p>

                                    {/* Book Button */}
                                    <button
                                        onClick={() => handleBookNow(service.title)}
                                        className="w-full px-6 py-3 bg-primary/10 border border-primary/30 rounded-lg text-primary font-mono text-sm hover:bg-primary hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                                    >
                                        <span>BOOK_NOW</span>
                                        <Zap size={16} className="group-hover/btn:animate-pulse" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Services;
