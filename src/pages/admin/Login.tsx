import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Shield, Terminal } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContent();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetMode, setResetMode] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            setSuccess('Access granted! Redirecting...');
            setTimeout(() => navigate('/admin'), 1000);
        } catch (err: any) {
            setError(err.message || 'Authentication failed. Check credentials.');
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess('Password reset email sent! Check your inbox.');
            setTimeout(() => setResetMode(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#050508] flex items-center justify-center p-4">
            {/* Background Grid & Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-0 -left-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Neon Border Container */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                    <div className="relative bg-[#0F0F13]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.8 }}
                                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-xl mb-4 border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                            >
                                <Terminal size={32} className="text-cyan-400" />
                            </motion.div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                                Dhilip's <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Command Center</span>
                            </h1>
                            <p className="text-gray-400 text-sm">
                                {resetMode ? 'Enter email to reset password' : 'Secure Admin Access Protocol'}
                            </p>
                        </div>

                        {/* Status Messages */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm"
                                >
                                    <Shield size={14} />
                                    {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"
                                >
                                    {success}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={resetMode ? handlePasswordReset : handleLogin} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs text-cyan-400 font-mono uppercase tracking-wider ml-1">Identity (Email)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-gray-600 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
                                        placeholder="admin@dhilip.me"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            {!resetMode && (
                                <div className="space-y-1">
                                    <label className="text-xs text-purple-400 font-mono uppercase tracking-wider ml-1">Cipher (Password)</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors" size={18} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-12 py-3.5 text-white placeholder-gray-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all font-mono"
                                            placeholder="••••••••••••"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-2">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full relative group overflow-hidden bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed hidden-cursor"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : resetMode ? (
                                            'Initialize Reset Protocol'
                                        ) : (
                                            <>Authenticate Access <span className="font-mono">→</span></>
                                        )}
                                    </span>
                                </motion.button>
                            </div>

                            <div className="text-center pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResetMode(!resetMode);
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className="text-xs text-gray-500 hover:text-cyan-400 transition-colors font-mono"
                                >
                                    {resetMode ? '[ Return to Login ]' : '< Forgot Passcode? />'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-600 font-mono">
                        SYSTEM SECURE • ENCRYPTED CONNECTION
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
