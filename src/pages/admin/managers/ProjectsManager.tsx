import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { useToast } from '../../../context/ToastContext';
import { compressImage } from '../../../utils/imageHelpers';
import { Plus, Trash2, Upload, Github, ExternalLink, Image as ImageIcon, Camera, Code, Edit2, Save, Rocket } from 'lucide-react';
import AdminCard from '../../../components/admin/AdminCard';
import PageHeader from '../../../components/admin/PageHeader';

// --- UI Helper Component (MUST be outside to prevent re-creation) ---
const InputField = ({ label, value, onChange, placeholder }: any) => (
    <div>
        <label className="block text-xs text-gray-500 mb-1 uppercase font-mono">{label}</label>
        <input
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 outline-none transition-all placeholder-gray-600"
            placeholder={placeholder}
        />
    </div>
);

const ProjectsManager: React.FC = () => {
    const { projects, addProject, deleteProject, updateProject, categories } = useContent();
    const { showToast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    // New Project State
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        longDescription: "",
        category: "",
        link: "",
        github: "",
        image: "",
        techStackInput: "",
        tags: ""
    });

    // --- Helper Logic (Thumbnail, Upload, Add) ---

    const handleGenerateThumbnail = async (isEditing = false, projectId?: string) => {
        const url = isEditing ? projects.find(p => p.id === projectId)?.link : newProject.link;
        if (!url) { showToast('Please enter a Live Demo URL first.', 'error'); return; }
        try { new URL(url); } catch { showToast('Please enter a valid URL', 'error'); return; }

        setGeneratingThumbnail(true);
        try {
            const encodedUrl = encodeURIComponent(url);
            const screenshotUrl = `https://s.wordpress.com/mshots/v1/${encodedUrl}?w=1280&h=800`;
            const img = new Image();
            await new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
                img.src = screenshotUrl;
            });

            if (isEditing && projectId) {
                const project = projects.find(p => p.id === projectId);
                if (project) await updateProject(projectId, { ...project, image: screenshotUrl });
            } else {
                setNewProject({ ...newProject, image: screenshotUrl });
            }
            showToast('✓ Screenshot captured! Verification successful.', 'success');
        } catch (err) {
            console.error('Failed to capture:', err);
            showToast('Could not capture screenshot. Try manual upload.', 'error');
        } finally {
            setGeneratingThumbnail(false);
        }
    };


    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side validation
        if (!file.type.startsWith('image/')) { showToast('Please upload an image file', 'error'); return; }
        if (file.size > 5 * 1024 * 1024) { showToast('Image too large (Max 5MB)', 'error'); return; }

        setUploading(true);
        try {
            // Compress and convert to Base64
            const base64Image = await compressImage(file);
            setNewProject({ ...newProject, image: base64Image });
            showToast('Image processed successfully!', 'success');
        } catch (err: any) {
            console.error(err);
            showToast(`Processing failed: ${err.message}`, 'error');
        } finally {
            setUploading(false);
        }
    };

    const startEditing = (project: any) => {
        setEditingId(project.id);
        setNewProject({
            title: project.title || '',
            description: project.description || '',
            longDescription: project.longDescription || '',
            category: project.category || '',
            link: project.link || '',
            github: project.github || '',
            image: project.image || '',
            techStackInput: Array.isArray(project.techStack) ? project.techStack.join(', ') : '',
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : ''
        });
        setShowForm(true);
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSaveProject = async () => {
        const errors = [];
        if (!newProject.title.trim()) errors.push('Title');
        if (!newProject.description.trim()) errors.push('Description');
        if (!newProject.techStackInput.trim()) errors.push('Tech Stack');
        // if (!newProject.link.trim() && !newProject.github.trim()) errors.push('Link or GitHub');

        if (errors.length > 0) {
            showToast(`Missing: ${errors.join(', ')}`, 'warning');
            return;
        }

        try {
            const techStack = newProject.techStackInput.split(',').map(t => t.trim()).filter(t => t);
            const projectData = {
                title: newProject.title,
                description: newProject.description,
                longDescription: newProject.longDescription,
                category: newProject.category || 'development',
                link: newProject.link,
                github: newProject.github,
                image: newProject.image,
                techStack,
                updatedAt: new Date().toISOString()
            };

            if (editingId) {
                await updateProject(editingId, projectData);
                showToast('Project updated successfully!', 'success');
            } else {
                await addProject({
                    ...projectData,
                    createdAt: new Date().toISOString()
                });
                showToast('Project deployed successfully!', 'success');
            }

            // Reset form
            setNewProject({ title: "", description: "", longDescription: "", category: "development", link: "", github: "", image: "", techStackInput: "", tags: "" });
            setEditingId(null);
            setShowForm(false);
        } catch (error: any) {
            showToast(`Operation failed: ${error.message}`, 'error');
        }
    };



    return (
        <div className="space-y-8">
            <PageHeader
                title="Project Command"
                subtitle="Deploy & Manage Portfolio Units"
                action={{
                    label: showForm ? "Cancel Operation" : "Deploy New Unit",
                    icon: showForm ? <Trash2 size={18} /> : <Plus size={18} />,
                    onClick: () => {
                        setShowForm(!showForm);
                        if (showForm) {
                            // Cancelled, so clear edit state
                            setEditingId(null);
                            setNewProject({ title: "", description: "", longDescription: "", category: "development", link: "", github: "", image: "", techStackInput: "", tags: "" });
                        }
                    }
                }}
            />

            {/* Add New Project Form */}
            {showForm && (
                <AdminCard title={editingId ? "Update Protocol" : "New Deployment Protocol"} className="mb-8 border-cyan-500/30">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Col */}
                        <div className="space-y-4">
                            <InputField label="Project Code Name" value={newProject.title} onChange={(v: string) => setNewProject({ ...newProject, title: v })} placeholder="e.g. Neural Link Interface" />

                            <div>
                                <label className="block text-xs text-gray-500 mb-1 uppercase font-mono">Category</label>
                                <select
                                    value={newProject.category}
                                    onChange={e => setNewProject({ ...newProject, category: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 outline-none"
                                >
                                    <option value="">-- Select Category --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <InputField label="Tech Stack (CSV)" value={newProject.techStackInput} onChange={(v: string) => setNewProject({ ...newProject, techStackInput: v })} placeholder="React, Three.js, Node" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <Github className="absolute top-8 left-3 text-gray-500" size={16} />
                                    <InputField label="Source Code" value={newProject.github} onChange={(v: string) => setNewProject({ ...newProject, github: v })} placeholder="       GitHub URL" />
                                </div>
                                <div className="relative">
                                    <ExternalLink className="absolute top-8 left-3 text-gray-500" size={16} />
                                    <InputField label="Live Demo" value={newProject.link} onChange={(v: string) => setNewProject({ ...newProject, link: v })} placeholder="       Public URL" />
                                </div>
                            </div>
                        </div>

                        {/* Right Col */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-xs text-gray-500 uppercase font-mono">Briefing</label>
                                <textarea
                                    value={newProject.description}
                                    onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 outline-none h-20 placeholder-gray-600"
                                    placeholder="Short overview..."
                                />
                            </div>

                            {/* Image Controls */}
                            <div className="space-y-4 p-4 bg-black/20 rounded-xl border border-white/5">
                                <label className="block text-xs text-gray-500 uppercase font-mono">Visual Asset</label>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleGenerateThumbnail()}
                                        disabled={!newProject.link || generatingThumbnail}
                                        className="flex-1 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/30 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2"
                                    >
                                        {generatingThumbnail ? '⏳ Capturing...' : <><Camera size={14} /> Auto-Capture</>}
                                    </button>
                                    <label className="flex-1 bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-2 cursor-pointer">
                                        <Upload size={14} /> Upload File
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                    </label>
                                </div>

                                {newProject.image && (
                                    <img src={newProject.image} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-white/10" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSaveProject}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
                        >
                            {editingId ? <Save size={20} /> : <Rocket size={20} />}
                            {editingId ? "UPDATE SYSTEM" : "INITIALIZE DEPLOYMENT"}
                        </button>
                    </div>
                </AdminCard>
            )}

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(p => (
                    <AdminCard key={p.id} className={`group transition-all duration-300 h-full flex flex-col ${editingId === p.id ? 'border-cyan-500 ring-1 ring-cyan-500/50' : 'hover:border-cyan-500/30'}`}>
                        {/* Content Wrapper for Flex Grow */}
                        <div className="flex-grow">
                            <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden">
                                {p.image ? (
                                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.title} />
                                ) : (
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                        <ImageIcon className="text-gray-700" size={32} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F13] to-transparent opacity-80" />

                                <div className="absolute bottom-3 left-6 right-6 flex justify-between items-end">
                                    <span className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] rounded uppercase tracking-wider backdrop-blur-sm">
                                        {p.category}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
                            <p className="text-gray-400 text-sm line-clamp-2 h-10 mb-4">{p.description}</p>

                            <div className="flex gap-2 flex-wrap mb-6">
                                {p.techStack?.slice(0, 3).map((t: string, i: number) => (
                                    <span key={i} className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Footer - Pushed to bottom */}
                        <div className="flex gap-2 border-t border-white/5 pt-4 mt-auto">
                            <button
                                onClick={() => startEditing(p)}
                                className="flex-1 py-2 bg-white/5 hover:bg-cyan-500/10 text-white hover:text-cyan-400 text-xs rounded transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit2 size={14} /> Edit Data
                            </button>
                            <button
                                onClick={() => window.confirm('Permanently delete project?') && deleteProject(p.id)}
                                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs rounded transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </AdminCard>
                ))}
            </div>
        </div>
    );
};

export default ProjectsManager;
