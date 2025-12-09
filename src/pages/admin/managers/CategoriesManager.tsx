import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { Trash2, Plus, Edit2, FolderOpen } from 'lucide-react';

const CategoriesManager: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useContent();
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            alert('Category name is required');
            return;
        }

        // Check for duplicates
        if (categories.some(c => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
            alert('Category already exists');
            return;
        }

        try {
            await addCategory({ name: newCategoryName.trim() });
            setNewCategoryName('');
            alert('✓ Category added successfully!');
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category');
        }
    };

    const handleUpdateCategory = async (id: string) => {
        if (!editingName.trim()) {
            alert('Category name is required');
            return;
        }

        try {
            await updateCategory(id, { name: editingName.trim() });
            setEditingId(null);
            setEditingName('');
        } catch (error) {
            console.error('Error updating category:', error);
            alert('Failed to update category');
        }
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (window.confirm(`Delete category "${name}"?\n\nProjects in this category will need to be reassigned.`)) {
            try {
                await deleteCategory(id);
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category');
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FolderOpen className="text-cyan-400" />
                    Project Categories
                </h2>
                <p className="text-gray-400 text-sm">Organize your projects into categories</p>
            </div>

            {/* Add New Category */}
            <div className="bg-gray-800/20 border border-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Plus size={18} className="text-green-400" /> Add New Category
                </h3>
                <div className="flex gap-3">
                    <input
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddCategory()}
                        className="flex-1 bg-black/50 border border-gray-700 rounded px-4 py-2 text-white focus:border-cyan-500 outline-none"
                        placeholder="e.g., Mobile Apps, E-Commerce, AI Projects..."
                    />
                    <button
                        onClick={handleAddCategory}
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium transition-colors"
                    >
                        Add Category
                    </button>
                </div>
            </div>

            {/* Categories List */}
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">All Categories ({categories.length})</h3>

                {categories.length === 0 ? (
                    <div className="bg-gray-800/20 border border-gray-700/50 rounded-xl p-8 text-center">
                        <FolderOpen className="mx-auto text-gray-600 mb-3" size={48} />
                        <p className="text-gray-500">No categories yet. Add your first category above!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {categories.map(category => (
                            <div
                                key={category.id}
                                className="bg-black/40 border border-gray-800 rounded-lg p-4 hover:border-cyan-500/40 transition-colors"
                            >
                                {editingId === category.id ? (
                                    /* Edit Mode */
                                    <div className="flex gap-2">
                                        <input
                                            value={editingName}
                                            onChange={e => setEditingName(e.target.value)}
                                            onKeyPress={e => e.key === 'Enter' && handleUpdateCategory(category.id)}
                                            className="flex-1 bg-black/50 border border-cyan-500 rounded px-3 py-2 text-white text-sm focus:border-cyan-400 outline-none"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleUpdateCategory(category.id)}
                                            className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded text-sm transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingId(null);
                                                setEditingName('');
                                            }}
                                            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                                                <FolderOpen className="text-cyan-400" size={20} />
                                            </div>
                                            <span className="text-white font-medium">{category.name}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingId(category.id);
                                                    setEditingName(category.name);
                                                }}
                                                className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCategory(category.id, category.name)}
                                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesManager;
