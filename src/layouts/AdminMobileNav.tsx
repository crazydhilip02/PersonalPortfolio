import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Cpu,
    User,
    Terminal,
    Palette,
    LogOut,
    Settings,
    Menu,
    X,
    Rocket,
    Tags,
    Calendar,
    Briefcase
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';

const AdminMobileNav = () => {
    const { logout } = useContent();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const toggleMenu = () => setIsOpen(!isOpen);

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
        { path: '/admin/hero', icon: <Terminal size={20} />, label: 'Hero Protocol' },
        { path: '/admin/experience', icon: <Cpu size={20} />, label: 'Journey' },
        { path: '/admin/projects', icon: <Rocket size={20} />, label: 'Projects' },
        { path: '/admin/skills', icon: <Cpu size={20} />, label: 'Skills' },
        { path: '/admin/categories', icon: <Tags size={20} />, label: 'Categories' },
        { path: '/admin/services', icon: <Briefcase size={20} />, label: 'Services' },
        { path: '/admin/profile', icon: <User size={20} />, label: 'Profile' },
        { path: '/admin/appointments-manager', icon: <Calendar size={20} />, label: 'Appointments' },
        { path: '/admin/theme', icon: <Palette size={20} />, label: 'Theme Engine' },
    ];

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Terminal className="text-cyan-400" size={16} />
                    </div>
                    <span className="font-bold text-white tracking-wide text-sm">DHILIP'S CMD CENTER</span>
                </div>

                <button
                    onClick={toggleMenu}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/80 z-40 lg:hidden glass-backdrop"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-16 left-0 bottom-0 w-64 bg-[#050508] border-r border-white/10 z-50 lg:hidden flex flex-col"
                        >
                            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.end}
                                        onClick={() => setIsOpen(false)}
                                        className={({ isActive }) => `
                                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                                            ${isActive
                                                ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-cyan-400'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                ))}
                            </nav>

                            <div className="p-4 border-t border-white/10">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default AdminMobileNav;
