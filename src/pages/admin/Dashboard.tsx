import React from 'react';
import { useContent } from '../../context/ContentContext';
import { Briefcase, Layers, User, FolderOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminCard from '../../components/admin/AdminCard';
import PageHeader from '../../components/admin/PageHeader';

const Dashboard: React.FC = () => {
    const { projects, skills, categories } = useContent();

    const totalSkills = skills.reduce((acc, cat) => acc + cat.skills.length, 0);

    const StatCard = ({ title, value, icon: Icon, to, color }: any) => (
        <Link to={to} className="group relative overflow-hidden bg-[#0F0F13] border border-white/5 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={64} />
            </div>

            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color.replace('text-', 'bg-')}/10 ${color}`}>
                    <Icon size={24} />
                </div>

                <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">{title}</p>

                <div className="mt-4 flex items-center gap-2 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Manage {title} <ArrowRight size={12} />
                </div>
            </div>
        </Link>
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title="System Overview"
                subtitle="Metrics & Status Reports"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <StatCard
                    title="Projects"
                    value={projects.length}
                    icon={Briefcase}
                    to="/admin/projects"
                    color="text-cyan-400"
                />
                <StatCard
                    title="Skill Nodes"
                    value={totalSkills}
                    icon={Layers}
                    to="/admin/skills"
                    color="text-purple-400"
                />
                <StatCard
                    title="Categories"
                    value={categories.length}
                    icon={FolderOpen}
                    to="/admin/categories"
                    color="text-orange-400"
                />
                <StatCard
                    title="Identity"
                    value="ACTIVE"
                    icon={User}
                    to="/admin/profile"
                    color="text-green-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AdminCard title="Recent Deployments">
                    {projects.slice(0, 3).map(p => (
                        <div key={p.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 px-3 -mx-3 rounded transition-colors">
                            <img src={p.image} className="w-12 h-12 rounded-lg object-cover" alt="Thumb" />
                            <div className="flex-1">
                                <h4 className="text-white font-medium text-sm">{p.title}</h4>
                                <p className="text-xs text-gray-500">{p.category}</p>
                            </div>
                            <div className="text-xs text-gray-600 font-mono">
                                {new Date(p.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && <p className="text-gray-500 text-sm py-4">No projects deployed yet.</p>}

                    <Link to="/admin/projects" className="block text-center text-xs text-cyan-400 mt-4 hover:underline">
                        View All Projects
                    </Link>
                </AdminCard>

                <AdminCard title="System Status" delay={0.1}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-gray-400 text-sm">Frontend Status</span>
                            <span className="flex items-center gap-2 text-green-400 text-xs font-mono bg-green-500/10 px-2 py-1 rounded">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                OPERATIONAL
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-gray-400 text-sm">Database Connection</span>
                            <span className="flex items-center gap-2 text-green-400 text-xs font-mono bg-green-500/10 px-2 py-1 rounded">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                CONNECTED
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                            <span className="text-gray-400 text-sm">Last Backup</span>
                            <span className="text-gray-500 text-xs font-mono">
                                AUTO-SYNC ENABLED
                            </span>
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
};

export default Dashboard;
