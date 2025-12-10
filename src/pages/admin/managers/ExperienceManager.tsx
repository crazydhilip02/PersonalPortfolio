import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { useToast } from '../../../context/ToastContext';
import { Plus, Trash2, Briefcase, GraduationCap, Save } from 'lucide-react';
import PageHeader from '../../../components/admin/PageHeader';
import AdminCard from '../../../components/admin/AdminCard';

const ExperienceManager: React.FC = () => {
    const { experience, updateExperience } = useContent();
    const { showToast } = useToast();

    // Local state for form management
    // We expect experience to have { work: [], education: [] }
    const [data, setData] = useState({
        work: [] as any[],
        education: [] as any[]
    });

    useEffect(() => {
        if (experience) {
            setData({
                work: experience.work || [],
                education: experience.education || []
            });
        }
    }, [experience]);

    const handleSave = async () => {
        try {
            await updateExperience(data);
            showToast('Experience timeline updated', 'success');
        } catch (error) {
            showToast('Failed to save changes', 'error');
        }
    };

    const addWork = () => {
        setData(prev => ({
            ...prev,
            work: [...prev.work, { role: '', company: '', period: '', description: '' }]
        }));
    };

    const removeWork = (index: number) => {
        const newWork = [...data.work];
        newWork.splice(index, 1);
        setData({ ...data, work: newWork });
    };

    const updateWorkItem = (index: number, field: string, value: string) => {
        const newWork = [...data.work];
        newWork[index] = { ...newWork[index], [field]: value };
        setData({ ...data, work: newWork });
    };

    const addEducation = () => {
        setData(prev => ({
            ...prev,
            education: [...prev.education, { degree: '', institution: '', year: '', description: '' }]
        }));
    };

    const removeEducation = (index: number) => {
        const newEdu = [...data.education];
        newEdu.splice(index, 1);
        setData({ ...data, education: newEdu });
    };

    const updateEducationItem = (index: number, field: string, value: string) => {
        const newEdu = [...data.education];
        newEdu[index] = { ...newEdu[index], [field]: value };
        setData({ ...data, education: newEdu });
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Journey Protocol"
                subtitle="Career & Educational Timeline"
                action={{
                    label: "Deploy Timeline",
                    icon: <Save size={18} />,
                    onClick: handleSave
                }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Career Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Briefcase className="text-cyan-400" size={24} />
                            Career History
                        </h2>
                        <button onClick={addWork} className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500/20">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.work.map((job, idx) => (
                            <AdminCard key={idx} className="relative group">
                                <button
                                    onClick={() => removeWork(idx)}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="space-y-3">
                                    <input
                                        placeholder="Role / Job Title"
                                        value={job.role}
                                        onChange={e => updateWorkItem(idx, 'role', e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-700 focus:border-cyan-500 text-white font-bold outline-none pb-1"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Company Name"
                                            value={job.company}
                                            onChange={e => updateWorkItem(idx, 'company', e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-700 focus:border-cyan-500 text-cyan-400 text-sm outline-none pb-1"
                                        />
                                        <input
                                            placeholder="Period (e.g. 2023 - Present)"
                                            value={job.period}
                                            onChange={e => updateWorkItem(idx, 'period', e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-700 focus:border-cyan-500 text-gray-400 text-sm outline-none pb-1 text-right"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Brief description of responsibilities..."
                                        value={job.description}
                                        onChange={e => updateWorkItem(idx, 'description', e.target.value)}
                                        rows={2}
                                        className="w-full bg-black/20 rounded p-2 text-sm text-gray-300 outline-none border border-transparent focus:border-white/10 resize-none"
                                    />
                                </div>
                            </AdminCard>
                        ))}
                        {data.work.length === 0 && <p className="text-gray-600 text-sm italic">No career entries yet.</p>}
                    </div>
                </div>

                {/* Education Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <GraduationCap className="text-purple-400" size={24} />
                            Education
                        </h2>
                        <button onClick={addEducation} className="p-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20">
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.education.map((edu, idx) => (
                            <AdminCard key={idx} className="relative group border-purple-500/20">
                                <button
                                    onClick={() => removeEducation(idx)}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="space-y-3">
                                    <input
                                        placeholder="Degree / Course"
                                        value={edu.degree}
                                        onChange={e => updateEducationItem(idx, 'degree', e.target.value)}
                                        className="w-full bg-transparent border-b border-gray-700 focus:border-purple-500 text-white font-bold outline-none pb-1"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            placeholder="Institution / University"
                                            value={edu.institution}
                                            onChange={e => updateEducationItem(idx, 'institution', e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-700 focus:border-purple-500 text-purple-400 text-sm outline-none pb-1"
                                        />
                                        <input
                                            placeholder="Year of Passing"
                                            value={edu.year}
                                            onChange={e => updateEducationItem(idx, 'year', e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-700 focus:border-purple-500 text-gray-400 text-sm outline-none pb-1 text-right"
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Details (Stream, CGPA, etc)..."
                                        value={edu.description}
                                        onChange={e => updateEducationItem(idx, 'description', e.target.value)}
                                        rows={2}
                                        className="w-full bg-black/20 rounded p-2 text-sm text-gray-300 outline-none border border-transparent focus:border-white/10 resize-none"
                                    />
                                </div>
                            </AdminCard>
                        ))}
                        {data.education.length === 0 && <p className="text-gray-600 text-sm italic">No education entries yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExperienceManager;
