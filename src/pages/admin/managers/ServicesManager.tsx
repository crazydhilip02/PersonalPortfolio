import React, { useState } from 'react';
import { useContent } from '../../../context/ContentContext';
import { useToast } from '../../../context/ToastContext';
import { Plus, Trash2, Edit2, Save, X, Briefcase, GripVertical } from 'lucide-react';
import AdminCard from '../../../components/admin/AdminCard';
import PageHeader from '../../../components/admin/PageHeader';
import { Reorder } from 'framer-motion';

// UI Helper (outside component to prevent re-creation)
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

const ServicesManager: React.FC = () => {
    const { services, addService, updateService, deleteService, reorderServices } = useContent();
    const { showToast } = useToast();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newService, setNewService] = useState({
        title: '',
        description: '',
        icon: 'Briefcase',
        order: services.length
    });

    const iconOptions = ['Briefcase', 'Code', 'Database', 'Palette', 'Shield', 'Zap', 'Globe', 'Cpu', 'Server'];

    const handleSave = async () => {
        if (!newService.title.trim() || !newService.description.trim()) {
            showToast('Title and description are required', 'warning');
            return;
        }

        try {
            if (editingId) {
                await updateService(editingId, newService);
                showToast('Service updated successfully!', 'success');
            } else {
                await addService(newService);
                showToast('Service added successfully!', 'success');
            }
            setNewService({ title: '', description: '', icon: 'Briefcase', order: services.length });
            setEditingId(null);
            setShowForm(false);
        } catch (error: any) {
            showToast(`Failed: ${error.message}`, 'error');
        }
    };

    const startEditing = (service: any) => {
        setEditingId(service.id);
        setNewService({
            title: service.title || '',
            description: service.description || '',
            icon: service.icon || 'Briefcase',
            order: service.order || 0
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this service?')) {
            try {
                await deleteService(id);
                showToast('Service deleted', 'success');
            } catch (error: any) {
                showToast(`Delete failed: ${error.message}`, 'error');
            }
        }
    };

    return (
        <div className="space-y-8">
            <PageHeader
                title="Services Command"
                subtitle="Drag to Prioritize Order"
                action={{
                    label: showForm ? 'Cancel' : 'Add Service',
                    icon: showForm ? <X size={18} /> : <Plus size={18} />,
                    onClick: () => {
                        setShowForm(!showForm);
                        if (showForm) {
                            setEditingId(null);
                            setNewService({ title: '', description: '', icon: 'Briefcase', order: services.length });
                        }
                    }
                }}
            />

            {/* Add/Edit Form */}
            {showForm && (
                <AdminCard title={editingId ? 'Edit Service' : 'New Service'} className="mb-8">
                    <div className="grid grid-cols-1 gap-6">
                        <InputField
                            label="Service Title"
                            value={newService.title}
                            onChange={(v: string) => setNewService({ ...newService, title: v })}
                            placeholder="e.g. Full Stack Development"
                        />

                        <div>
                            <label className="block text-xs text-gray-500 mb-1 uppercase font-mono">Description</label>
                            <textarea
                                value={newService.description}
                                onChange={e => setNewService({ ...newService, description: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 outline-none h-24"
                                placeholder="Describe the service..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 uppercase font-mono">Icon</label>
                                <select
                                    value={newService.icon}
                                    onChange={e => setNewService({ ...newService, icon: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-cyan-500/50 outline-none"
                                >
                                    {iconOptions.map(icon => (
                                        <option key={icon} value={icon}>{icon}</option>
                                    ))}
                                </select>
                            </div>

                            <InputField
                                label="Order"
                                value={newService.order}
                                onChange={(v: string) => setNewService({ ...newService, order: parseInt(v) || 0 })}
                                placeholder="0"
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> {editingId ? 'Update' : 'Create'} Service
                        </button>
                    </div>
                </AdminCard>
            )}

            {/* Services List */}
            {services.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    <Briefcase className="mx-auto mb-4 opacity-50" size={48} />
                    <p>No services yet. Click "Add Service" to create one.</p>
                </div>
            ) : (
                <Reorder.Group axis="y" values={services} onReorder={reorderServices} className="space-y-4">
                    {services.map(service => (
                        <Reorder.Item key={service.id} value={service}>
                            <AdminCard className="group hover:border-cyan-500/30 transition-all cursor-move">
                                <div className="flex items-start gap-4">
                                    <div className="text-gray-600 group-hover:text-cyan-500 transition-colors mt-1">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 flex-shrink-0">
                                        <Briefcase size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{service.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEditing(service)}
                                                className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded text-blue-500 text-xs hover:bg-blue-600/30 transition-all flex items-center gap-1"
                                            >
                                                <Edit2 size={12} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded text-red-500 text-xs hover:bg-red-600/30 transition-all flex items-center gap-1"
                                            >
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </AdminCard>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}
        </div>
    );
};

export default ServicesManager;
