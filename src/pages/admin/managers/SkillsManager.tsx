import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { Plus, Trash2, Save, Sparkles, Layers } from 'lucide-react';

const SkillsManager: React.FC = () => {
    const { skills, addSkillCategory, deleteSkillCategory, addSkill, deleteSkill } = useContent();
    const [newCategory, setNewCategory] = useState('');
    const [newSkill, setNewSkill] = useState<{ [key: string]: { name: string, level: number, link?: string } }>({});

    const handleAddCategory = async () => {
        if (!newCategory) return;
        await addSkillCategory(newCategory);
        setNewCategory('');
    };

    const handleAddSkill = async (catTitle: string) => {
        const skill = newSkill[catTitle];
        if (!skill || !skill.name) return;
        await addSkill(catTitle, skill);
        setNewSkill({ ...newSkill, [catTitle]: { name: '', level: 50 } });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-gray-900/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Layers className="text-purple-400" />
                        Skill Matrix
                    </h2>
                    <p className="text-gray-400 text-sm">Manage your technical arsenal</p>
                </div>

                <div className="flex gap-2">
                    <input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New Category (e.g. Blockchain)"
                        className="bg-black/50 border border-gray-600 rounded px-4 py-2 text-white focus:border-purple-500 outline-none"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} /> Add Category
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((cat, idx) => (
                    <div key={idx} className="bg-gray-800/20 border border-gray-700/50 rounded-xl p-6 hover:border-cyan-500/30 transition-colors">
                        <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-700">
                            <h3 className="text-xl font-mono text-cyan-400">{cat.title}</h3>
                            <button
                                onClick={() => deleteSkillCategory(cat.title)}
                                className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="space-y-3 mb-6">
                            {cat.skills.map((skill: any) => (
                                <div key={skill.name} className="flex items-center justify-between bg-black/20 p-2 rounded border border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-8 bg-cyan-500/50 rounded-full" />
                                        <div>
                                            <div className="text-white font-medium">{skill.name}</div>
                                            <div className="text-xs text-gray-500">Proficiency: {skill.level}%</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteSkill(cat.title, skill.name)}
                                        className="text-gray-600 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add Skill Form */}
                        <div className="bg-black/30 p-4 rounded-lg border border-gray-800">
                            <div className="space-y-3">
                                <input
                                    placeholder="Skill Name (e.g. React)"
                                    value={newSkill[cat.title]?.name || ''}
                                    onChange={(e) => setNewSkill({
                                        ...newSkill,
                                        [cat.title]: { ...(newSkill[cat.title] || { level: 50 }), name: e.target.value }
                                    })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                />
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-400">Level</span>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={newSkill[cat.title]?.level || 50}
                                        onChange={(e) => setNewSkill({
                                            ...newSkill,
                                            [cat.title]: { ...(newSkill[cat.title] || { name: '' }), level: parseInt(e.target.value) }
                                        })}
                                        className="flex-grow h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    />
                                    <span className="text-xs text-cyan-400 font-mono w-8 text-right">
                                        {newSkill[cat.title]?.level || 50}%
                                    </span>
                                </div>
                                <input
                                    placeholder="Certificate / related URL (optional)"
                                    value={newSkill[cat.title]?.link || ''}
                                    onChange={(e) => setNewSkill({
                                        ...newSkill,
                                        [cat.title]: { ...(newSkill[cat.title] || { name: '', level: 50 }), link: e.target.value }
                                    })}
                                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                />
                                <button
                                    onClick={() => handleAddSkill(cat.title)}
                                    className="w-full bg-cyan-900/30 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-2 rounded text-sm transition-all"
                                >
                                    Append Skill
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsManager;
