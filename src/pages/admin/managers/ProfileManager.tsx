import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { storage } from '../../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Save, User, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';

const ProfileManager: React.FC = () => {
    const { about, contact, updateAbout, updateContact } = useContent();
    const [aboutForm, setAboutForm] = useState(about || {});
    const [contactForm, setContactForm] = useState(contact || {});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (about) setAboutForm(about);
        if (contact) setContactForm(contact);
    }, [about, contact]);

    const handleFileUpload = async (file: File): Promise<string> => {
        const storageRef = ref(storage, `profile/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    const handleProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploading(true);
            try {
                const url = await handleFileUpload(file);
                setAboutForm({ ...aboutForm, profileImage: url });
            } catch (err) {
                console.error(err);
                alert("Upload failed");
            } finally {
                setUploading(false);
            }
        }
    };

    const handleSave = async () => {
        await updateAbout(aboutForm);
        await updateContact(contactForm);
        alert("Profile & Contact updated successfully!");
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-gray-900/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <User className="text-cyan-400" />
                        Identity & Comms
                    </h2>
                    <p className="text-gray-400 text-sm">Manage personal details and contact channels</p>
                </div>

                <button
                    onClick={handleSave}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-cyan-500/20 transition-all"
                >
                    <Save size={18} /> SAVE CHANGES
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* About Section */}
                <div className="space-y-6">
                    <h3 className="text-xl text-white font-mono border-b border-gray-800 pb-2">About Me</h3>

                    <div className="flex gap-6 items-start">
                        <div className="w-32 h-32 bg-gray-800 rounded-lg overflow-hidden border border-gray-600 relative group">
                            <img src={aboutForm.profileImage} className="w-full h-full object-cover" />
                            <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-xs text-white text-center p-2">
                                {uploading ? '...' : 'Change Photo'}
                                <input type="file" className="hidden" accept="image/*" onChange={handleProfileImage} />
                            </label>
                        </div>
                        <div className="flex-grow space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Bio / Manifesto</label>
                                <textarea
                                    value={aboutForm.bio || ''}
                                    onChange={e => setAboutForm({ ...aboutForm, bio: e.target.value })}
                                    className="w-full h-24 bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Resume URL (PDF/Drive)</label>
                                <input
                                    value={aboutForm.resumeLink || ''}
                                    onChange={e => setAboutForm({ ...aboutForm, resumeLink: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none"
                                    placeholder="https://drive.google.com/..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="space-y-6">
                    <h3 className="text-xl text-white font-mono border-b border-gray-800 pb-2">Contact Channels</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Mail className="absolute top-2.5 left-3 text-gray-500" size={16} />
                            <input
                                value={contactForm.email || ''}
                                onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                                placeholder="Email"
                                className="w-full bg-black/50 border border-gray-700 rounded pl-10 pr-4 py-2 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div className="relative">
                            <Phone className="absolute top-2.5 left-3 text-gray-500" size={16} />
                            <input
                                value={contactForm.phone || ''}
                                onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                                placeholder="Phone"
                                className="w-full bg-black/50 border border-gray-700 rounded pl-10 pr-4 py-2 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute top-2.5 left-3 text-gray-500" size={16} />
                            <input
                                value={contactForm.location || ''}
                                onChange={e => setContactForm({ ...contactForm, location: e.target.value })}
                                placeholder="Location"
                                className="w-full bg-black/50 border border-gray-700 rounded pl-10 pr-4 py-2 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                        <div className="relative">
                            <MessageCircle className="absolute top-2.5 left-3 text-gray-500" size={16} />
                            <input
                                value={contactForm.whatsapp || ''}
                                onChange={e => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                                placeholder="WhatsApp"
                                className="w-full bg-black/50 border border-gray-700 rounded pl-10 pr-4 py-2 text-white focus:border-cyan-500 outline-none"
                            />
                        </div>
                    </div>

                    <h4 className="text-sm text-gray-500 font-bold mt-4">Social Profiles</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            value={contactForm.github || ''}
                            onChange={e => setContactForm({ ...contactForm, github: e.target.value })}
                            placeholder="GitHub URL"
                            className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none"
                        />
                        <input
                            value={contactForm.linkedin || ''}
                            onChange={e => setContactForm({ ...contactForm, linkedin: e.target.value })}
                            placeholder="LinkedIn URL"
                            className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none"
                        />
                        <input
                            value={contactForm.twitter || ''}
                            onChange={e => setContactForm({ ...contactForm, twitter: e.target.value })}
                            placeholder="Twitter / X URL"
                            className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileManager;
