import React from 'react';
import { motion } from 'framer-motion';

interface AdminCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    delay?: number;
}

const AdminCard: React.FC<AdminCardProps> = ({ children, className = "", title, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`
                relative bg-[#0F0F13]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl overflow-hidden
                ${className}
            `}
        >
            {/* Top Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-20" />

            {title && (
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    {title}
                </h3>
            )}

            <div className="relative z-10 h-full flex flex-col">
                {children}
            </div>
        </motion.div>
    );
};

export default AdminCard;
