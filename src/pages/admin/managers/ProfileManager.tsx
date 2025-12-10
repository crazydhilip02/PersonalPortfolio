import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { useToast } from '../../../context/ToastContext';
import { compressImage } from '../../../utils/imageHelpers';
import { Save, Mail, MapPin, Phone, MessageCircle, Upload, Github, Linkedin, Twitter, FileText } from 'lucide-react';
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
                action={{
                    label: "Save Changes",
                    icon: <Save size={18} />,
                    onClick: handleSave
                }}
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
                                <label className="block text-xs text-gray-500 ml-1 uppercase font-mono">Mission Statement (Bio)</label>
                                <textarea
                                    value={aboutForm.bio || ''}
                                    onChange={e => setAboutForm({ ...aboutForm, bio: e.target.value })}
                                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none transition-all placeholder-gray-700"
                                    placeholder="Brief introduction..."
                                />
                            </div>
                            <InputGroup
                                icon={FileText}
                                label="Resume / CV Link"
                                value={aboutForm.resumeLink}
                                onChange={(v: string) => setAboutForm({ ...aboutForm, resumeLink: v })}
                                placeholder="https://drive.google.com/..."
                            />
                        </div>
                    </div>
                </AdminCard>

                {/* Comms Channels Section */}
                <AdminCard title="Signal Channels" className="border-purple-500/20" delay={0.1}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                        <InputGroup icon={Mail} label="Email Address" value={contactForm.email} onChange={(v: string) => setContactForm({ ...contactForm, email: v })} />
                        <InputGroup icon={Phone} label="Contact Number" value={contactForm.phone} onChange={(v: string) => setContactForm({ ...contactForm, phone: v })} />
                        <InputGroup icon={MapPin} label="Base Location" value={contactForm.location} onChange={(v: string) => setContactForm({ ...contactForm, location: v })} />
                        <InputGroup icon={MessageCircle} label="WhatsApp" value={contactForm.whatsapp} onChange={(v: string) => setContactForm({ ...contactForm, whatsapp: v })} />
                    </div>

                    <div className="border-t border-white/5 pt-6">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <span className="w-1 h-4 bg-purple-500 rounded-full" />
                            Network Uplinks
                        </h4>
                        <div className="space-y-4">
                            <InputGroup icon={Github} label="GitHub Profile" value={contactForm.github} onChange={(v: string) => setContactForm({ ...contactForm, github: v })} placeholder="https://github.com/..." />
                            <InputGroup icon={Linkedin} label="LinkedIn Profile" value={contactForm.linkedin} onChange={(v: string) => setContactForm({ ...contactForm, linkedin: v })} placeholder="https://linkedin.com/in/..." />
                            <InputGroup icon={Twitter} label="Twitter / X Comms" value={contactForm.twitter} onChange={(v: string) => setContactForm({ ...contactForm, twitter: v })} placeholder="https://twitter.com/..." />
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
};

export default ProfileManager;
