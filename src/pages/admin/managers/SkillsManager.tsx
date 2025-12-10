import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { useToast } from '../../../context/ToastContext';
import { Plus, Trash2, Cpu, Award } from 'lucide-react';
import PageHeader from '../../../components/admin/PageHeader';
import AdminCard from '../../../components/admin/AdminCard';

const SkillsManager: React.FC = () => {
    const { skills, addSkillCategory, deleteSkillCategory, addSkill, deleteSkill } = useContent();
    const { showToast } = useToast();
    const [newCategory, setNewCategory] = useState('');
    const [newSkill, setNewSkill] = useState<{ [key: string]: { name: string, level: number, link?: string } }>({});

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            await addSkillCategory(newCategory.trim());
            setNewCategory('');
            showToast('Skill Category Added', 'success');
        } catch (e) { showToast('Failed to add category', 'error'); }
    };

    const handleAddSkill = async (catTitle: string) => {
        const skill = newSkill[catTitle];
        if (!skill || !skill.name.trim()) return;
        try {
            await addSkill(catTitle, skill);
            setNewSkill({ ...newSkill, [catTitle]: { name: '', level: 50, link: '' } });
            showToast(`Added skill: ${skill.name}`, 'success');
        } catch (e) { showToast('Failed to add skill', 'error'); }
    };


    return (
        <div className="space-y-8">
            <PageHeader
                title="Skill Matrix Control"
                subtitle={`${skills.length} Competency Vectors`}
            />

            {/* Add Category Section */}
            <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 p-1 rounded-xl">
                <div className="bg-[#050508] p-4 rounded-[10px] flex gap-3">
                    <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddCategory()}
                        placeholder="Initialize New Skill Vector (Category Name)..."
                        className="flex-1 bg-transparent border-none text-white focus:ring-0 placeholder-gray-500"
                    />
                    <button
                        onClick={handleAddCategory}
                        disabled={!newCategory.trim()}
                        className="bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 text-white px-6 py-2 rounded-lg font-bold transition-all shadow-lg shadow-purple-500/20"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((cat, idx) => (
                    <AdminCard
                        key={idx}
                        className="group hover:border-purple-500/30 transition-all duration-300"
                        delay={idx * 0.1}
                    >
                        {/* Category Header */}
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Cpu size={18} className="text-cyan-400" />
                                    {cat.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1 font-mono uppercase">
                                    {cat.skills.length} Capabilities
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (window.confirm(`Delete entire category "${cat.title}"?`)) {
                                        deleteSkillCategory(cat.title);
                                        showToast(`Deleted category: ${cat.title}`, 'info');
                                    }
                                }}
                                className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        {/* Skills Cloud */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {cat.skills.length === 0 && (
                                <p className="text-sm text-gray-600 italic">No skills initialized yet.</p>
                            )}

                            {cat.skills.map((skill: any) => (
                                <div
                                    key={skill.name}
                                    className="relative group/skill flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
                                >
                                    <span className="text-sm text-gray-200">{skill.name}</span>

                                    {/* Level Indicator Dot */}
                                    <div
                                        className={`w-1.5 h-1.5 rounded-full ${skill.level > 80 ? 'bg-green-500' : skill.level > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                        title={`Proficiency: ${skill.level}%`}
                                    />

                                    {/* Delete Action (Hidden until hover) */}
                                    <button
                                        onClick={() => deleteSkill(cat.title, skill.name)}
                                        className="ml-1 text-gray-600 hover:text-red-400 opacity-0 group-hover/skill:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Skill Form */}
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                            <div className="flex gap-2">
                                <input
                                    placeholder="Skill Name"
                                    value={newSkill[cat.title]?.name || ''}
                                    onChange={(e) => setNewSkill({
                                        ...newSkill,
                                        [cat.title]: { ...(newSkill[cat.title] || { level: 80 }), name: e.target.value }
                                    })}
                                    onKeyPress={e => e.key === 'Enter' && handleAddSkill(cat.title)}
                                    className="flex-1 bg-transparent border-b border-gray-700 focus:border-cyan-500 text-white text-sm py-1 outline-none px-2"
                                />
                                {newSkill[cat.title]?.name && (
                                    <button
                                        onClick={() => handleAddSkill(cat.title)}
                                        className="text-cyan-400 hover:text-cyan-300"
                                    >
                                        <Plus size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Expandable options when typing */}
                            {newSkill[cat.title]?.name && (
                                <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs text-gray-500 uppercase font-mono w-12">Level</span>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={newSkill[cat.title]?.level || 80}
                                            onChange={(e) => setNewSkill({
                                                ...newSkill,
                                                [cat.title]: { ...newSkill[cat.title], level: parseInt(e.target.value) }
                                            })}
                                            className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                        />
                                        <span className="text-xs text-cyan-400 w-8">{newSkill[cat.title]?.level}%</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Award size={14} className="text-gray-600" />
                                        <input
                                            placeholder="Certificate URL (Optional)"
                                            value={newSkill[cat.title]?.link || ''}
                                            onChange={(e) => setNewSkill({
                                                ...newSkill,
                                                [cat.title]: { ...newSkill[cat.title], link: e.target.value }
                                            })}
                                            className="flex-1 bg-transparent border-none text-xs text-gray-400 focus:ring-0 placeholder-gray-700"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </AdminCard>
                ))}
            </div>
        </div>
    );
};

export default SkillsManager;
