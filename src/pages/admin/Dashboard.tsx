import React, { useState, useEffect } from 'react';
import { useContent } from '../../context/ContentContext';
import { Briefcase, Layers, User, FolderOpen, ArrowRight, Activity, Globe, Shield, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminCard from '../../components/admin/AdminCard';
import PageHeader from '../../components/admin/PageHeader';
import { motion } from 'framer-motion';

// Mock Logs for "Live" effect
const LOG_TYPES = ['INFO', 'WARN', 'SUCCESS'];
const LOG_MESSAGES = [
    'Connection established from 192.168.X.X',
    'Project data cached successfully',
    'New visitor from London, UK',
    'Rate limit check passed',
    'Theme engine updated',
    'Database sync completed',
    'Bot traffic filtered'
];

const Dashboard: React.FC = () => {
    const { projects, skills, categories, theme } = useContent();
    const [logs, setLogs] = useState<any[]>([]);

    // Simulate incoming logs
    useEffect(() => {
        const interval = setInterval(() => {
            const type = LOG_TYPES[Math.floor(Math.random() * LOG_TYPES.length)];
            const msg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
            setLogs(prev => [...prev.slice(-9), { time: new Date().toLocaleTimeString(), type, msg }]);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);

    const StatCard = ({ title, value, icon: Icon, to, color, delay }: any) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Link to={to} className="group relative overflow-hidden bg-[#0F0F13] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 block h-full">
                <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
                    <Icon size={80} />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-white/5 ${color} group-hover:scale-110 transition-transform`}>
                            <Icon size={24} />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{value}</h3>
                        <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        ACCESS MODULE <ArrowRight size={12} />
                    </div>
                </div>
            </Link>
        </motion.div>
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title="Command Center"
                subtitle="Live System Metrics & Surveillance"
            />

            {/* Top Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <StatCard title="Deployed Units" value={projects.length} icon={Briefcase} to="/admin/projects" color="text-cyan-400" delay={0.1} />
                <StatCard title="Neural Nodes" value={totalSkills} icon={Layers} to="/admin/skills" color="text-purple-400" delay={0.2} />
                <StatCard title="Data Buckets" value={categories.length} icon={FolderOpen} to="/admin/categories" color="text-orange-400" delay={0.3} />
                <StatCard title="Admin Identity" value="ONLINE" icon={Shield} to="/admin/profile" color="text-green-400" delay={0.4} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Visual Map / Activity Graph */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Global Traffic Map">
                        <div className="h-[300px] bg-[#050508] rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center">
                            {/* Stylized World Map SVG or CSS shapes */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center invert filter brightness-50 contrast-200"></div>

                            {/* Pulsing Dots Mocking Locations */}
                            <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-cyan-500 rounded-full animate-ping" />
                            <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-cyan-500 rounded-full" />

                            <div className="absolute top-[40%] left-[50%] w-2 h-2 bg-purple-500 rounded-full animate-ping delay-300" />
                            <div className="absolute top-[40%] left-[50%] w-2 h-2 bg-purple-500 rounded-full" />

                            <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-green-500 rounded-full animate-ping delay-700" />
                            <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-green-500 rounded-full" />

                            <div className="z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded border border-cyan-500/30 text-xs font-mono text-cyan-400">
                                LOCATING SIGNALS...
                            </div>
                        </div>
                    </AdminCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdminCard title="Resource Usage">
                            <div className="space-y-4 pt-2">
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-gray-400">
                                        <span>CPU LOAD</span>
                                        <span>42%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-cyan-500 w-[42%] animate-pulse" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-gray-400">
                                        <span>MEMORY</span>
                                        <span>68%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[68%]" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1 text-gray-400">
                                        <span>STORAGE</span>
                                        <span>21%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[21%]" />
                                    </div>
                                </div>
                            </div>
                        </AdminCard>

                        <AdminCard title="System Health">
                            <div className="flex items-center gap-4 h-full">
                                <div className="relative w-24 h-24 flex items-center justify-center border-4 border-gray-800 rounded-full border-t-cyan-500 border-r-purple-500 rotate-45">
                                    <div className="absolute inset-0 border-4 border-transparent border-l-green-500 rounded-full opacity-50 -rotate-90"></div>
                                    <span className="text-xl font-bold text-white -rotate-45">98%</span>
                                </div>
                                <div className="text-sm space-y-1">
                                    <div className="flex items-center gap-2 text-green-400"><span className="w-2 h-2 bg-green-500 rounded-full" /> Server Active</div>
                                    <div className="flex items-center gap-2 text-blue-400"><span className="w-2 h-2 bg-blue-500 rounded-full" /> DB Connected</div>
                                    <div className="flex items-center gap-2 text-purple-400"><span className="w-2 h-2 bg-purple-500 rounded-full" /> CDN Online</div>
                                </div>
                            </div>
                        </AdminCard>
                    </div>
                </div>

                {/* Right Column: Terminal Logs & Recent Projects */}
                <div className="space-y-6">
                    <AdminCard title="Real-time Terminal">
                        <div className="bg-black p-4 rounded-lg border border-gray-800 font-mono text-[10px] h-[300px] overflow-y-auto flex flex-col-reverse shadow-inner">
                            {logs.map((log, i) => (
                                <div key={i} className="mb-1 break-words">
                                    <span className="text-gray-500">[{log.time}]</span>{' '}
                                    <span className={`${log.type === 'WARN' ? 'text-yellow-500' :
                                            log.type === 'SUCCESS' ? 'text-green-500' :
                                                'text-blue-400'
                                        }`}>{log.type}</span>:{' '}
                                    <span className="text-gray-300">{log.msg}</span>
                                </div>
                            ))}
                            <div className="text-gray-600 italic">-- System Logs Initialized --</div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Recent Deployments">
                        {projects.slice(0, 4).map(p => (
                            <Link to={`/admin/projects`} key={p.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0 hover:bg-white/5 -mx-2 px-2 rounded transition-colors group">
                                <div className="w-2 h-2 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors" />
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-white text-xs font-medium truncate group-hover:text-cyan-400">{p.title}</h4>
                                    <p className="text-[10px] text-gray-500 truncate">{p.category}</p>
                                </div>
                                <span className="text-[10px] text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</span>
                            </Link>
                        ))}
                        {projects.length === 0 && <p className="text-gray-500 text-xs">No activity yet.</p>}
                    </AdminCard>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
