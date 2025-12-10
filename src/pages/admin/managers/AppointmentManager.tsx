import { useContent } from '../../../context/ContentContext';
import { Calendar, Trash2, Clock, CheckCircle, User, FileText, XCircle, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { db } from '../../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentManager = () => {
    const { appointments, deleteAppointment } = useContent();

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, 'appointments', id), { status: newStatus });
        } catch (e) {
            console.error("Error updating status", e);
        }
    };

    // Message the USER's phone number (not admin's)
    const openUserWhatsApp = (phone: string, apt: any) => {
        // Clean phone number - remove spaces, dashes, etc
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '');
        const message = `Hi ${apt.name}! 👋\n\nThis is regarding your appointment request:\n📅 Date: ${apt.date}\n⏰ Time: ${apt.time}\n📋 Purpose: ${apt.purpose}\n\nI'd like to confirm this with you.`;
        const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    const pendingCount = appointments.filter((a: any) => a.status !== 'completed' && a.status !== 'cancelled').length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                    <Calendar size={24} className="text-primary" />
                    Appointments
                </h2>
                <div className="flex gap-2">
                    <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-sm font-mono">
                        {pendingCount} Pending
                    </span>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-mono">
                        {appointments.length} Total
                    </span>
                </div>
            </div>

            <div className="grid gap-4">
                <AnimatePresence>
                    {appointments.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 bg-black/20 rounded-xl border border-white/5"
                        >
                            <Calendar size={40} className="mx-auto text-gray-700 mb-3" />
                            <p className="text-gray-500">No appointments yet</p>
                            <p className="text-gray-600 text-sm mt-1">Bookings from the ChatBot will appear here</p>
                        </motion.div>
                    ) : (
                        appointments.map((apt: any) => (
                            <motion.div
                                key={apt.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className={`p-5 rounded-xl border transition-all ${apt.status === 'completed'
                                        ? 'bg-green-900/10 border-green-500/30'
                                        : apt.status === 'cancelled'
                                            ? 'bg-red-900/10 border-red-500/30 opacity-60'
                                            : 'bg-black/40 border-primary/20 hover:border-primary/50'
                                    }`}
                            >
                                {/* Header Row */}
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User size={16} className="text-primary flex-shrink-0" />
                                            <h3 className="text-lg font-bold text-white truncate">{apt.name}</h3>
                                        </div>

                                        {/* Phone Number with WhatsApp Button */}
                                        {apt.phone && (
                                            <button
                                                onClick={() => openUserWhatsApp(apt.phone, apt)}
                                                className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors group"
                                            >
                                                <Phone size={14} />
                                                <span>{apt.phone}</span>
                                                <FaWhatsapp size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`px-2 py-1 rounded-full text-xs uppercase font-mono flex-shrink-0 ${apt.status === 'completed'
                                            ? 'bg-green-500/20 text-green-400'
                                            : apt.status === 'cancelled'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {apt.status || 'PENDING'}
                                    </span>
                                </div>

                                {/* Date & Time */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} className="text-primary/70" /> {apt.date || 'Not set'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} className="text-primary/70" /> {apt.time || 'Not set'}
                                    </span>
                                </div>

                                {/* Purpose */}
                                <div className="bg-white/5 p-3 rounded-lg mb-3">
                                    <div className="flex items-start gap-2">
                                        <FileText size={14} className="text-primary/70 mt-0.5 flex-shrink-0" />
                                        <p className="text-gray-300 text-sm">{apt.purpose || apt.reason || 'No purpose specified'}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-600">
                                        {apt.timestamp ? new Date(apt.timestamp).toLocaleString() : ''}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        {apt.phone && (
                                            <button
                                                onClick={() => openUserWhatsApp(apt.phone, apt)}
                                                className="p-2 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                                                title="Message on WhatsApp"
                                            >
                                                <FaWhatsapp size={18} />
                                            </button>
                                        )}

                                        {apt.status !== 'completed' && apt.status !== 'cancelled' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(apt.id, 'completed')}
                                                    className="p-2 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                                                    title="Mark Completed"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(apt.id, 'cancelled')}
                                                    className="p-2 hover:bg-orange-500/20 text-orange-500 rounded-lg transition-colors"
                                                    title="Cancel"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => deleteAppointment(apt.id)}
                                            className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AppointmentManager;
