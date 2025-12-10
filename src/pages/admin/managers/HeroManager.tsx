import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { useToast } from '../../../context/ToastContext';
import { Save, Globe, Github, Linkedin, MessageCircle, FileText } from 'lucide-react';
import PageHeader from '../../../components/admin/PageHeader';
import AdminCard from '../../../components/admin/AdminCard';

const HeroManager: React.FC = () => {
    const { hero, updateHero } = useContent();
    const { showToast } = useToast();
    const [formData, setFormData] = useState(hero);

    useEffect(() => {
        if (hero) setFormData(hero);
    }, [hero]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSocialChange = (platform: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [platform]: value }
        }));
    };

    const handleSave = async () => {
        try {
            await updateHero(formData);
            showToast('Hero section updated successfully', 'success');
        } catch (error) {
            showToast('Failed to update Hero section', 'error');
        }
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Hero Protocol"
                subtitle="Configure Main Entry Point"
                action={
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                    >
                        <Save size={18} />
                        DEPLOY UPDATES
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Content */}
                <AdminCard title="Core Identity">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 uppercase font-mono">Main Title</label>
                            <input
                                value={formData.title}
                                onChange={e => handleChange('title', e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 uppercase font-mono">Subtitle / Role</label>
                            <input
                                value={formData.subtitle}
                                onChange={e => handleChange('subtitle', e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-2 uppercase font-mono">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={e => handleChange('description', e.target.value)}
                                rows={4}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                </AdminCard>

                {/* Links */}
                <AdminCard title="Communication Uplinks">
                    <div className="space-y-4">
                        <div className="relative">
                            <Github className="absolute left-4 top-3.5 text-gray-500" size={18} />
                            <input
                                value={formData.socialLinks?.github || ''}
                                onChange={e => handleSocialChange('github', e.target.value)}
                                placeholder="GitHub URL"
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Linkedin className="absolute left-4 top-3.5 text-gray-500" size={18} />
                            <input
                                value={formData.socialLinks?.linkedin || ''}
                                onChange={e => handleSocialChange('linkedin', e.target.value)}
                                placeholder="LinkedIn URL"
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Globe className="absolute left-4 top-3.5 text-gray-500" size={18} />
                            <input
                                value={formData.socialLinks?.instagram || ''}
                                onChange={e => handleSocialChange('instagram', e.target.value)}
                                placeholder="Instagram URL"
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <MessageCircle className="absolute left-4 top-3.5 text-gray-500" size={18} />
                            <input
                                value={formData.socialLinks?.whatsapp || ''}
                                onChange={e => handleSocialChange('whatsapp', e.target.value)}
                                placeholder="WhatsApp Number/Link"
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <FileText className="absolute left-4 top-3.5 text-gray-500" size={18} />
                            <input
                                value={formData.resumeLink || ''}
                                onChange={e => handleChange('resumeLink', e.target.value)}
                                placeholder="Resume / CV Link"
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all"
                            />
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
};

export default HeroManager;
