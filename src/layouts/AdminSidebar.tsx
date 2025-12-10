import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Cpu,
    User,
    Terminal,
    Palette,
    Calendar,
    Rocket,
    Tags,
    Briefcase
} from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { logout } = useContent();

    const handleLogout = async () => {
        await logout();
        navigate('/admin/login');
    };

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
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-black/40 backdrop-blur-xl border-r border-white/10 z-40"
        >
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Terminal className="text-white" size={20} />
                    </div>
                    <div>
                        <h2 className="text-white font-bold">Admin</h2>
                        <p className="text-xs text-gray-500">Control Panel</p>
                    </div>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 p-4 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        className={({ isActive }) => `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 text-primary shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'text-gray-400 border border-transparent hover:bg-white/5 hover:text-white hover:border-white/10'}`}
                    >
                        <span className="relative z-10">{item.icon}</span>
                        <span className="relative z-10 font-medium">{item.label}</span>
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </NavLink>
                ))}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all flex items-center gap-3"
                >
                    <Terminal size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </motion.div>
    );
};

export default AdminSidebar;
