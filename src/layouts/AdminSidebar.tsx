import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Rocket,
    Cpu,
    Tags,
    LogOut,
    Settings,
    User
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
    const { logout } = useContent();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard', end: true },
        { path: '/admin/projects', icon: <Rocket size={20} />, label: 'Projects' },
        { path: '/admin/skills', icon: <Cpu size={20} />, label: 'Skills' },
        { path: '/admin/categories', icon: <Tags size={20} />, label: 'Categories' },
        { path: '/admin/profile', icon: <User size={20} />, label: 'Profile' },
    ];

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-black/40 backdrop-blur-xl border-r border-white/10 z-40"
        >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Settings className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="font-bold text-white tracking-wider">COMMAND</h2>
                        <p className="text-xs text-cyan-400 font-mono">CENTER v2.0</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                            ${isActive
                                ? 'bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                            }
                        `}
                    >
                        <span className="relative z-10">{item.icon}</span>
                        <span className="relative z-10 font-medium">{item.label}</span>

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-xl bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </NavLink>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20 group"
                >
                    <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </motion.div>
    );
};

export default AdminSidebar;
