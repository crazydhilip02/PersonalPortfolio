import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { storage } from '../../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Trash2, Upload, Briefcase, Github, ExternalLink, Image as ImageIcon, Camera } from 'lucide-react';

const ProjectsManager: React.FC = () => {
    const { projects, addProject, deleteProject, updateProject, categories } = useContent();
    const [uploading, setUploading] = useState(false);
    const [generatingThumbnail, setGeneratingThumbnail] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // New Project State
    const [newProject, setNewProject] = useState({
        title: "",
        description: "", // Short
        longDescription: "", // Rich/Long
        category: "", // Category name (keeping as string for compatibility)
        link: "",
        github: "",
        image: "", // Keep as image for now
        techStackInput: "", // Helper for comma-separated input
        tags: "" // New field
    });

    // Auto-generate thumbnail from live URL
    const handleGenerateThumbnail = async (isEditing = false, projectId?: string) => {
        const url = isEditing ?
            projects.find(p => p.id === projectId)?.link :
            newProject.link;

        const title = isEditing ?
            projects.find(p => p.id === projectId)?.title :
            newProject.title;

        if (!url && !title) {
            alert('Please enter either a live demo URL or project title first');
            return;
        }

        setGeneratingThumbnail(true);
        try {
            let thumbnailUrl;

            // Try URL-based screenshot first
            if (url) {
                try {
                    const encodedUrl = encodeURIComponent(url);
                    const timestamp = Date.now(); // Prevent caching
                    thumbnailUrl = `https://api.screenshotmachine.com?key=demo&url=${encodedUrl}&dimension=1200x800&device=desktop&format=jpg&cacheLimit=0&delay=2000&timestamp=${timestamp}`;
                    console.log('✓ Thumbnail generated from URL:', url);
                    console.log('Screenshot URL:', thumbnailUrl);
                } catch (urlError) {
                    console.warn('URL screenshot failed, using title fallback');
                    thumbnailUrl = null;
                }
            }

            // Fallback: Generate thumbnail from title using placeholder service
            if (!thumbnailUrl && title) {
                const cleanTitle = encodeURIComponent(title);
                const colors = ['1a1a2e/00f2ea', '16213e/e94560', '0f3460/e94560', '533483/6f4c5b', '2b580c/a9f1df'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                thumbnailUrl = `https://via.placeholder.com/1200x800/${randomColor}?text=${cleanTitle}`;
                console.log('✓ Placeholder generated for title:', title);
            }

            // Ensure we have a valid thumbnail URL
            if (!thumbnailUrl) {
                throw new Error('Failed to generate thumbnail');
            }

            if (isEditing && projectId) {
                const project = projects.find(p => p.id === projectId);
                if (project) {
                    await updateProject(projectId, { ...project, image: thumbnailUrl });
                }
            } else {
                setNewProject({ ...newProject, image: thumbnailUrl });
            }

        } catch (err) {
            console.error('Failed to generate thumbnail:', err);
            alert('Could not generate thumbnail. You can upload an image manually.');
        } finally {
            setGeneratingThumbnail(false);
        }
    };

    const handleFileUpload = async (file: File): Promise<string> => {
        if (!file) return '';

        console.log('Starting upload...', file.name);

        try {
            const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
            const uploadTask = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(uploadTask.ref);

            console.log('Upload complete! URL:', downloadURL);
            return downloadURL;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log('=== Starting Image Upload ===');
        console.log('File name:', file.name);
        console.log('File size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('File type:', file.type);

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image too large! Please use an image smaller than 5MB');
            return;
        }

        setUploading(true);
        try {
            console.log('Uploading to Firebase Storage...');
            const url = await handleFileUpload(file);
            console.log('✓ Upload SUCCESS! URL:', url);
            setNewProject({ ...newProject, image: url });
            alert('Image uploaded successfully!');
        } catch (err: any) {
            console.error('=== UPLOAD FAILED ===');
            console.error('Error:', err);
            console.error('Error message:', err.message);
            console.error('Error code:', err.code);
            alert(`Upload failed: ${err.message}\n\nCheck browser console (F12) for details.`);
        } finally {
            setUploading(false);
            console.log('=== Upload Complete ===');
        }
    };

    const handleAddProject = async () => {
        console.log('=== DEPLOYING PROJECT ===');
        console.log('Project data:', newProject);

        // Comprehensive validation
        const errors = [];

        if (!newProject.title.trim()) errors.push('Project Title');
        if (!newProject.description.trim()) errors.push('Short Description');
        if (!newProject.longDescription.trim()) errors.push('Full Description');
        if (!newProject.techStackInput.trim()) errors.push('Tech Stack');
        if (!newProject.image.trim()) errors.push('Project Image');
        if (!newProject.link.trim() && !newProject.github.trim()) {
            errors.push('At least one Link (Live Demo or GitHub)');
        }

        if (errors.length > 0) {
            alert(`⚠️ Missing Required Fields:\n\n${errors.map(e => `• ${e}`).join('\n')}\n\nPlease fill all required information before deploying.`);
            return;
        }

        try {
            // Process tech stack
            const techStack = newProject.techStackInput.split(',').map(t => t.trim()).filter(t => t);

            if (techStack.length === 0) {
                alert('Please add at least one technology in Tech Stack');
                return;
            }

            console.log('Adding project to Firestore...');

            await addProject({
                title: newProject.title,
                description: newProject.description,
                longDescription: newProject.longDescription,
                category: newProject.category,
                link: newProject.link,
                github: newProject.github,
                image: newProject.image,
                techStack,
                createdAt: new Date().toISOString()
            });

            console.log('✓ Project deployed successfully!');

            // Success message
            alert(`🎉 PROJECT DEPLOYED SUCCESSFULLY!\n\n"${newProject.title}" has been added to your portfolio.\n\nView it on your website at: http://localhost:5173/#projects`);

            // Reset form
            setNewProject({
                title: "", description: "", longDescription: "",
                category: "development", link: "", github: "",
                image: "", techStackInput: "", tags: ""
            });

        } catch (error: any) {
            console.error('=== DEPLOYMENT FAILED ===');
            console.error('Error:', error);
            alert(`❌ Deployment failed: ${error.message}\n\nCheck console (F12) for details.`);
        }
    };

    const handleEditProject = async (projectId: string, field: string, value: any) => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            await updateProject(projectId, { ...project, [field]: value });
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="text-cyan-400" />
                    Project Command Center
                </h2>
                <p className="text-gray-400 text-sm">Deploy new projects to your portfolio</p>
            </div>

            {/* Add Form */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Plus size={18} className="text-green-400" /> New Deployment
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Col */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Project Code Name</label>
                            <input
                                value={newProject.title}
                                onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none"
                                placeholder="e.g. Threat Detection System"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Category</label>
                            <select
                                value={newProject.category}
                                onChange={e => setNewProject({ ...newProject, category: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none appearance-none"
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            {categories.length === 0 && (
                                <p className="text-xs text-yellow-400 mt-1">
                                    No categories yet. Add them in the Categories tab.
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Tech Stack (comma separated)</label>
                            <input
                                value={newProject.techStackInput}
                                onChange={e => setNewProject({ ...newProject, techStackInput: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none"
                                placeholder="React, Firebase, Python..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <Github className="absolute top-2.5 left-3 text-gray-500" size={16} />
                                <input
                                    value={newProject.github}
                                    onChange={e => setNewProject({ ...newProject, github: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-700 rounded pl-10 pr-4 py-2 text-white focus:border-cyan-500 outline-none"
                                    placeholder="GitHub URL"
                                />
                            </div>
                            <div className="relative">
                                <ExternalLink className="absolute top-2.5 left-3 text-gray-500" size={16} />
                                <input
                                    value={newProject.link}
                                    onChange={e => setNewProject({ ...newProject, link: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-700 rounded pl-10 pr-4 py-2 text-white focus:border-cyan-500 outline-none"
                                    placeholder="Live Demo URL"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Col */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Short Brief (Card View)</label>
                            <textarea
                                value={newProject.description}
                                onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none h-20"
                                placeholder="Brief overview for the card..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Detailed Spec (Deep Dive)</label>
                            <textarea
                                value={newProject.longDescription}
                                onChange={e => setNewProject({ ...newProject, longDescription: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none h-32"
                                placeholder="Full capabilities, architecture details, etc..."
                            />
                        </div>

                        {/* Auto-Generate Thumbnail */}
                        <div>
                            <button
                                type="button"
                                onClick={() => handleGenerateThumbnail()}
                                disabled={(!newProject.link && !newProject.title) || generatingThumbnail}
                                className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 py-2.5 rounded text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {generatingThumbnail ? (
                                    <>⏳ Generating Screenshot...</>
                                ) : (
                                    <>
                                        <Camera size={16} />
                                        📸 Auto-Generate Thumbnail
                                    </>
                                )}
                            </button>
                            <p className="text-xs text-gray-600 mt-1 text-center">
                                {newProject.link ? 'From live URL' : 'From project title'}
                            </p>
                        </div>

                        {/* Manual Image URL Input */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Or paste image URL directly</label>
                            <input
                                value={newProject.image || ''}
                                onChange={e => setNewProject({ ...newProject, image: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-xs focus:border-cyan-500 outline-none"
                                placeholder="https://example.com/image.jpg"
                            />
                            <p className="text-xs text-gray-600 mt-1">Direct image URL (fastest option)</p>
                        </div>

                        {/* Image Upload */}
                        <div className="mt-2">
                            {newProject.image ? (
                                /* Image Preview with Actions */
                                <div className="border-2 border-green-500/30 rounded-lg overflow-hidden">
                                    <div className="relative">
                                        <img src={newProject.image} className="w-full h-40 object-cover" alt="Preview" />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setNewProject({ ...newProject, image: '' })}
                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-medium transition-colors"
                                            >
                                                ✕ Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-green-900/20 p-2 text-center">
                                        <p className="text-xs text-green-400">✓ Image Ready</p>
                                        <label className="inline-block mt-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs cursor-pointer transition-colors">
                                            Change Image
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                /* Upload Area */
                                <label className="flex flex-col items-center justify-center w-full border-2 border-gray-700 border-dashed rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <Upload className={`mb-2 ${uploading ? 'animate-bounce' : ''} text-gray-400`} />
                                        <p className="text-sm text-gray-500">
                                            {uploading ? "UPLOADING... Please wait" : "Click to upload cover image"}
                                        </p>
                                        <p className="text-xs text-gray-600 mt-1">JPG, PNG, WEBP • Max 5MB</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleAddProject}
                        disabled={uploading}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-green-500/20 transform hover:scale-105 active:scale-95"
                    >
                        {uploading ? '⏳ UPLOADING IMAGE...' : '🚀 DEPLOY PROJECT'}
                    </button>
                </div>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 gap-4">
                {projects.map(p => (
                    <div key={p.id} className="group bg-black/40 border border-gray-800 rounded-lg hover:border-cyan-500/40 transition-colors">
                        {editingId === p.id ? (
                            /* EDIT MODE */
                            <div className="p-6 space-y-4">
                                <h4 className="text-cyan-400 font-bold mb-4 flex items-center gap-2">
                                    <Briefcase size={18} />
                                    Editing: {p.title}
                                </h4>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Left Column */}
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Project Title</label>
                                            <input
                                                value={p.title || ''}
                                                onChange={e => handleEditProject(p.id, 'title', e.target.value)}
                                                className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Category</label>
                                            <select
                                                value={p.category || 'development'}
                                                onChange={e => handleEditProject(p.id, 'category', e.target.value)}
                                                className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                            >
                                                <option value="development">Development</option>
                                                <option value="security">Security</option>
                                                <option value="ai">AI / ML</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Tech Stack (comma-separated)</label>
                                            <input
                                                value={p.techStack?.join(', ') || ''}
                                                onChange={e => handleEditProject(p.id, 'techStack', e.target.value.split(',').map(t => t.trim()))}
                                                className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">GitHub URL</label>
                                                <input
                                                    value={p.github || ''}
                                                    onChange={e => handleEditProject(p.id, 'github', e.target.value)}
                                                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                                    placeholder="https://github.com/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Live Demo URL</label>
                                                <input
                                                    value={p.link || ''}
                                                    onChange={e => handleEditProject(p.id, 'link', e.target.value)}
                                                    className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Short Description</label>
                                            <textarea
                                                value={p.description || ''}
                                                onChange={e => handleEditProject(p.id, 'description', e.target.value)}
                                                className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none h-20"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Full Description</label>
                                            <textarea
                                                value={p.longDescription || ''}
                                                onChange={e => handleEditProject(p.id, 'longDescription', e.target.value)}
                                                className="w-full bg-black/50 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-cyan-500 outline-none h-24"
                                            />
                                        </div>

                                        {/* Auto-Generate Thumbnail for Existing Project */}
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleGenerateThumbnail(true, p.id)}
                                                disabled={!p.link || generatingThumbnail}
                                                className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 py-2 rounded text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {generatingThumbnail ? (
                                                    <>⏳ Generating...</>
                                                ) : (
                                                    <>
                                                        <Camera size={14} />
                                                        Generate Thumbnail from URL
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Current Image Preview */}
                                        {p.image && (
                                            <div className="border border-gray-700 rounded p-2">
                                                <img src={p.image} alt={p.title} className="w-full h-32 object-cover rounded" />
                                                <p className="text-xs text-gray-600 mt-1">Current thumbnail</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4 border-t border-gray-800">
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm font-medium transition-colors"
                                    >
                                        ✓ Save & Close
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Delete this project?')) {
                                                deleteProject(p.id);
                                                setEditingId(null);
                                            }
                                        }}
                                        className="ml-auto px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded text-sm transition-colors"
                                    >
                                        Delete Project
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* VIEW MODE */
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                                        {p.image ? (
                                            <img src={p.image} className="w-full h-full object-cover" alt={p.title} />
                                        ) : (
                                            <ImageIcon className="text-gray-700 m-6" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold">{p.title}</h4>
                                        <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                            <span>{p.category}</span>
                                            <span>•</span>
                                            <span>{p.techStack?.length || 0} Technologies</span>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">{p.description}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingId(p.id)}
                                        className="px-4 py-2 text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/30 rounded text-sm transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => window.confirm('Delete this project?') && deleteProject(p.id)}
                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsManager;
