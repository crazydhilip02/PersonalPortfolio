import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Rocket,
    Cpu,
    Tags,
    LogOut,
    Settings,
    Menu,
    X
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
        { path: '/admin/projects', icon: <Rocket size={20} />, label: 'Projects' },
        { path: '/admin/skills', icon: <Cpu size={20} />, label: 'Skills' },
        { path: '/admin/categories', icon: <Tags size={20} />, label: 'Categories' },
    ];

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                        <Settings className="text-white" size={16} />
                    </div>
                    <span className="font-bold text-white tracking-wide">COMMAND CENTER</span>
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

                            <div className="p-4 border-t border-white/10 bg-black/20">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
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
