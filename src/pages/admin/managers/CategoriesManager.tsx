import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { useToast } from '../../../context/ToastContext';
import { Trash2, Plus, Edit2, FolderOpen, Save, X, GripVertical } from 'lucide-react';
import PageHeader from '../../../components/admin/PageHeader';
import AdminCard from '../../../components/admin/AdminCard';
import { Reorder } from 'framer-motion';

const CategoriesManager: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } = useContent();
    const { showToast } = useToast();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) { showToast('Category name is required', 'warning'); return; }
        if (categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) { showToast('Category already exists', 'error'); return; }
        try {
            await addCategory({ name: newCategoryName.trim() });
            setNewCategoryName('');
            showToast('Category added successfully', 'success');
        } catch (error) { showToast('Failed to add category', 'error'); }
    };

    const handleUpdateCategory = async (id: string) => {
        if (!editingName.trim()) return;
        try {
            await updateCategory(id, { name: editingName.trim() });
            setEditingId(null);
            setEditingName('');
            showToast('Category updated', 'success');
        } catch (error) { showToast('Failed to update', 'error'); }
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (window.confirm(`Delete "${name}"?`)) {
            try {
                await deleteCategory(id);
                showToast(`Deleted category: ${name}`, 'info');
            } catch (error) { showToast('Failed to delete', 'error'); }
        }
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Project Categories"
                subtitle="Drag to Prioritize Order"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add New - Left Column */}
                <div className="lg:col-span-1">
                    <AdminCard title="Register New Category" className="border-green-500/20 sticky top-8">
                        <div className="space-y-4">
                            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 mb-4">
                                <p className="text-xs text-green-400">
                                    Categories help organize project deployments into logical sectors.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-500 mb-2 uppercase font-mono">Category Name</label>
                                <input
                                    value={newCategoryName}
                                    onChange={e => setNewCategoryName(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && handleAddCategory()}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-green-500/50 outline-none transition-all placeholder-gray-600"
                                    placeholder="e.g. Artificial Intelligence"
                                />
                            </div>

                            <button
                                onClick={handleAddCategory}
                                disabled={!newCategoryName.trim()}
                                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Initialize Category
                            </button>
                        </div>
                    </AdminCard>
                </div>

                {/* List - Right Column */}
                <div className="lg:col-span-2 space-y-4">
                    {categories.length === 0 ? (
                        <div className="text-center py-12 text-gray-600">
                            <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No categories found in database.</p>
                        </div>
                    ) : (
                        <Reorder.Group axis="y" values={categories} onReorder={reorderCategories} className="space-y-4">
                            {categories.map(category => (
                                <Reorder.Item key={category.id} value={category}>
                                    <AdminCard className="group hover:border-cyan-500/30 transition-all cursor-move">
                                        <div className="flex items-center gap-4">
                                            <div className="text-gray-600 group-hover:text-cyan-500 transition-colors">
                                                <GripVertical size={20} />
                                            </div>

                                            <div className="flex-grow">
                                                {editingId === category.id ? (
                                                    /* Edit Mode */
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            value={editingName}
                                                            onChange={e => setEditingName(e.target.value)}
                                                            className="flex-1 bg-black/50 border border-cyan-500/50 rounded px-2 py-1 text-white outline-none"
                                                            autoFocus
                                                        />
                                                        <button onClick={() => handleUpdateCategory(category.id)} className="p-1 text-green-400 hover:bg-green-500/10 rounded"><Save size={16} /></button>
                                                        <button onClick={() => setEditingId(null)} className="p-1 text-red-400 hover:bg-red-500/10 rounded"><X size={16} /></button>
                                                    </div>
                                                ) : (
                                                    /* View Mode */
                                                    <h3 className="text-lg font-bold text-gray-200 group-hover:text-white flex items-center gap-2">
                                                        {category.name}
                                                    </h3>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => { setEditingId(category.id); setEditingName(category.name); }}
                                                    className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(category.id, category.name)}
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </AdminCard>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoriesManager;
