import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { useToast } from '../../../context/ToastContext';
import { compressImage } from '../../../utils/imageHelpers';
import { Save, Mail, MapPin, Phone, MessageCircle, Upload, FileText, User, Type, Tags } from 'lucide-react';
import PageHeader from '../../../components/admin/PageHeader';
import AdminCard from '../../../components/admin/AdminCard';

const ProfileManager: React.FC = () => {
    const { about, contact, updateAbout, updateContact } = useContent();
    const { showToast } = useToast();
    const [aboutForm, setAboutForm] = useState(about || {});
    const [contactForm, setContactForm] = useState(contact || {});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (about) setAboutForm(about);
        if (contact) setContactForm(contact);
    }, [about, contact]);

    const handleProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploading(true);
            try {
                const base64 = await compressImage(file);
                setAboutForm({ ...aboutForm, profileImage: base64 });
                showToast('Profile image updated', 'success');
            } catch (err) {
                console.error(err);
                showToast("Image processing failed", 'error');
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSave = async () => {
        try {
            await updateAbout(aboutForm);
            await updateContact(contactForm);
            showToast("✓ Profile updated successfully!", 'success');
        } catch (e) { showToast("Update failed", 'error'); }
    };

    const InputGroup = ({ icon: Icon, label, value, onChange, placeholder }: any) => (
        <div className="relative group">
            <label className="block text-xs text-gray-500 mb-1 ml-1 uppercase font-mono">{label}</label>
            <div className="relative">
                <Icon className="absolute top-3 left-3 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                <input
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-cyan-500/50 outline-none transition-all"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <PageHeader
                title="Identity Protocol"
                subtitle="Public Profile & Communication Channels"
                action={
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                    >
                        <Save size={18} />
                        SAVE CHANGES
                    </button>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Visual Identity Section */}
                <AdminCard title="Visual Identity" className="border-cyan-500/20">
                    <div className="flex flex-col sm:flex-row gap-8">
                        {/* Profile Image */}
                        <div className="flex flex-col items-center space-y-3">
                            <div className="relative w-40 h-40 rounded-2xl overflow-hidden border-2 border-white/10 group shadow-2xl shadow-cyan-500/10">
                                <img src={aboutForm.profileImage} className="w-full h-full object-cover" alt="Profile" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                    <label className="text-xs text-white cursor-pointer flex flex-col items-center gap-2 hover:text-cyan-400 transition-colors">
                                        <Upload size={24} />
                                        {uploading ? 'UPLOADING...' : 'CHANGE PHOTO'}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleProfileImage} disabled={uploading} />
                                    </label>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 font-mono">REC: 500x500px JPG/PNG</p>
                        </div>

                        {/* Bio & Resume */}
                        <div className="flex-1 space-y-5">
                            <div className="space-y-1">
                                <label className="block text-xs text-gray-500 ml-1 uppercase font-mono">About Section Title</label>
                                <div className="relative">
                                    <Type className="absolute top-3 left-3 text-gray-500" size={16} />
                                    <input
                                        value={aboutForm.title || ''}
                                        onChange={e => setAboutForm({ ...aboutForm, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-cyan-500/50 outline-none"
                                        placeholder="e.g. Architecting Secure Digital Experiences"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs text-gray-500 ml-1 uppercase font-mono">Mission Statement (Bio)</label>
                                <textarea
                                    value={aboutForm.bio || ''}
                                    onChange={e => setAboutForm({ ...aboutForm, bio: e.target.value })}
                                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all placeholder-gray-700 resize-none"
                                    placeholder="Brief introduction..."
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="block text-xs text-gray-500 ml-1 uppercase font-mono">Taglines (Comma Separated)</label>
                                <div className="relative">
                                    <Tags className="absolute top-3 left-3 text-gray-500" size={16} />
                                    <input
                                        value={aboutForm.taglines ? aboutForm.taglines.join(', ') : ''}
                                        onChange={e => setAboutForm({ ...aboutForm, taglines: e.target.value.split(',').map((t: string) => t.trim()) })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:border-cyan-500/50 outline-none"
                                        placeholder="Cybersecurity, Design, React..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminCard>

                {/* Contact Information */}
                <AdminCard title="Communication Channels">
                    <div className="space-y-4">
                        <InputGroup icon={Mail} label="Email Address" value={contactForm.email} onChange={(v: string) => setContactForm({ ...contactForm, email: v })} />
                        <InputGroup icon={Phone} label="Phone Number" value={contactForm.phone} onChange={(v: string) => setContactForm({ ...contactForm, phone: v })} />
                        <InputGroup icon={MapPin} label="Location Base" value={contactForm.location} onChange={(v: string) => setContactForm({ ...contactForm, location: v })} />
                        <InputGroup icon={MessageCircle} label="WhatsApp Contact" value={contactForm.whatsapp} onChange={(v: string) => setContactForm({ ...contactForm, whatsapp: v })} />
                    </div>
                </AdminCard>

                <AdminCard title="Statistics Display">
                    <div className="grid grid-cols-2 gap-4">
                        {aboutForm.stats && aboutForm.stats.map((stat: any, index: number) => (
                            <div key={index} className="space-y-2 p-3 bg-white/5 rounded-lg border border-white/5">
                                <label className="text-[10px] text-gray-500 uppercase font-mono">Label</label>
                                <input
                                    value={stat.label}
                                    onChange={(e) => {
                                        const newStats = [...aboutForm.stats];
                                        newStats[index].label = e.target.value;
                                        setAboutForm({ ...aboutForm, stats: newStats });
                                    }}
                                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white"
                                />
                                <label className="text-[10px] text-gray-500 uppercase font-mono">Value</label>
                                <input
                                    value={stat.value}
                                    onChange={(e) => {
                                        const newStats = [...aboutForm.stats];
                                        newStats[index].value = e.target.value;
                                        setAboutForm({ ...aboutForm, stats: newStats });
                                    }}
                                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-sm text-white"
                                />
                            </div>
                        ))}
                    </div>
                </AdminCard>
            </div>
        </div>
    );
};

export default ProfileManager;
