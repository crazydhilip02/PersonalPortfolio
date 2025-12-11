import React from 'react';
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
                                whileHover={{ y: -6, scale: 1.02 }}
                                className="group relative h-full"
                            >
                                {/* Animated Gradient Border */}
                                <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-secondary to-primary rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 animate-gradient-xy" />

                                {/* Card Container with Glassmorphism - More Compact */}
                                <div className="relative bg-gradient-to-br from-gray-900/20 via-gray-900/15 to-gray-800/25 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-primary/40 transition-all duration-300 h-full flex flex-col overflow-hidden shadow-xl">

                                    {/* Animated Background Gradient */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                    {/* Floating Particles Effect */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-primary rounded-full animate-ping" />
                                        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary rounded-full animate-ping delay-75" />
                                    </div>

                                    {/* Icon with 3D Effect - Smaller */}
                                    <div className="relative mb-4 z-10">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-primary/50">
                                            <div className="transform group-hover:scale-110 transition-transform">
                                                {iconMap[service.icon] || <Briefcase size={24} />}
                                            </div>
                                        </div>
                                        {/* Icon Glow */}
                                        <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                                    </div>

                                    {/* Title with Gradient - Smaller */}
                                    <h3 className="relative text-lg font-bold mb-2 z-10 bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text text-transparent group-hover:from-primary group-hover:via-white group-hover:to-secondary transition-all duration-500">
                                        {service.title}
                                    </h3>

                                    {/* Description - Shorter with line clamp */}
                                    <p className="relative text-gray-400 text-xs leading-relaxed mb-4 flex-grow z-10 group-hover:text-gray-300 transition-colors line-clamp-2">
                                        {service.description}
                                    </p>

                                    {/* Enhanced Book Button - Smaller */}
                                    <button
                                        onClick={() => handleBookNow(service.title)}
                                        className="relative w-full px-4 py-2.5 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border border-primary/30 rounded-lg text-primary font-mono text-xs font-bold hover:from-primary hover:via-primary hover:to-secondary hover:text-black transition-all duration-500 flex items-center justify-center gap-2 group/btn overflow-hidden z-10 shadow-lg hover:shadow-primary/50"
                                    >
                                        {/* Button Shine Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />

                                        <span className="relative z-10">BOOK_NOW</span>
                                        <Zap size={14} className="relative z-10 group-hover/btn:rotate-12 transition-transform" />
                                    </button>

                                    {/* Corner Accent */}
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-2xl opacity-50" />
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
