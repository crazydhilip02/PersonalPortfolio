import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calendar, ChevronLeft, ChevronRight, CheckCircle, User, Clock, FileText, Phone } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

type Step = 'start' | 'name' | 'phone' | 'purpose' | 'date' | 'time' | 'confirm' | 'success';

interface Message {
    type: 'bot' | 'user';
    text: string;
    component?: 'calendar' | 'timeSlots' | 'summary';
}

const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

interface ChatBotProps {
    initialPurpose?: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ initialPurpose }) => {
    const { addAppointment } = useContent();
    const [isOpen, setIsOpen] = useState(false);

    // Form State
    const [step, setStep] = useState<Step>('start');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        purpose: initialPurpose || '',
        date: '',
        time: ''
    });
    const [inputValue, setInputValue] = useState('');
    const [history, setHistory] = useState<Message[]>([
        { type: 'bot', text: "👋 Hi! I can help you schedule an appointment. Click below to get started." }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Calendar State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history, isOpen, step]);

    // Auto-open ChatBot when initialPurpose is set (from Services)
    useEffect(() => {
        if (initialPurpose) {
            setIsOpen(true);
            setFormData(prev => ({ ...prev, purpose: initialPurpose }));
            setStep('name'); // Skip to name step since purpose is already set
            setHistory([
                { type: 'bot', text: `Great! You want to book: "${initialPurpose}". Let's get started!` }
            ]);
        }
    }, [initialPurpose]);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        return { firstDay, daysInMonth };
    };

    const isDateDisabled = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today || date.getDay() === 0;
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleDateSelect = (day: number) => {
        if (isDateDisabled(day)) return;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(date);
        const formatted = formatDate(date);
        setFormData(prev => ({ ...prev, date: formatted }));
        setHistory(prev => [
            ...prev,
            { type: 'user', text: formatted },
            { type: 'bot', text: "⏰ Pick a time slot:", component: 'timeSlots' }
        ]);
        setStep('time');
    };

    const handleTimeSelect = (time: string) => {
        setFormData(prev => ({ ...prev, time }));
        setHistory(prev => [
            ...prev,
            { type: 'user', text: time },
            { type: 'bot', text: "📋 Review your booking:", component: 'summary' }
        ]);
        setStep('confirm');
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = inputValue.trim();
        setHistory(prev => [...prev, { type: 'user', text: userMsg }]);
        setInputValue('');

        if (step === 'name') {
            setFormData(prev => ({ ...prev, name: userMsg }));
            setHistory(prev => [...prev, { type: 'bot', text: "📱 Enter your phone number (with country code):" }]);
            setStep('phone');
        } else if (step === 'phone') {
            // Basic phone validation
            const phoneClean = userMsg.replace(/\D/g, '');
            if (phoneClean.length < 10) {
                setHistory(prev => [...prev, { type: 'bot', text: "⚠️ Please enter a valid phone number with country code (e.g., +91 9876543210)" }]);
                return;
            }
            setFormData(prev => ({ ...prev, phone: userMsg }));
            setHistory(prev => [...prev, { type: 'bot', text: "📝 What's the purpose of this meeting?" }]);
            setStep('purpose');
        } else if (step === 'purpose') {
            setFormData(prev => ({ ...prev, purpose: userMsg }));
            setHistory(prev => [...prev, { type: 'bot', text: "📅 Select a date:", component: 'calendar' }]);
            setStep('date');
        }
    };

    const handleConfirm = async () => {
        setHistory(prev => [...prev, { type: 'bot', text: "⏳ Saving..." }]);

        const appointmentData = {
            name: formData.name,
            phone: formData.phone,
            purpose: formData.purpose,
            date: formData.date,
            time: formData.time,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        try {
            const success = await addAppointment(appointmentData);

            if (success) {
                setHistory(prev => [...prev, { type: 'bot', text: "✅ Appointment booked! You'll receive a confirmation soon." }]);
                setStep('success');
            } else {
                setHistory(prev => [...prev, { type: 'bot', text: "❌ Failed to save. Please try again." }]);
            }
        } catch (err) {
            console.error('Booking error:', err);
            setHistory(prev => [...prev, { type: 'bot', text: "❌ Something went wrong. Please try again." }]);
        }
    };

    const startChat = () => {
        setHistory(prev => [...prev, { type: 'bot', text: "👤 What's your name?" }]);
        setStep('name');
    };

    const resetChat = () => {
        setStep('start');
        setFormData({ name: '', phone: '', purpose: '', date: '', time: '' });
        setSelectedDate(null);
        setHistory([{ type: 'bot', text: "👋 Hi! I can help you schedule an appointment. Click below to get started." }]);
    };

    // Calendar Component
    const CalendarPicker = () => {
        const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const disabled = isDateDisabled(day);
            const isSelected = selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === currentMonth.getMonth();

            days.push(
                <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    disabled={disabled}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all
                        ${disabled ? 'text-gray-600 cursor-not-allowed' : 'hover:bg-primary/20 text-white'}
                        ${isSelected ? 'bg-primary text-black font-bold' : ''}`}
                >
                    {day}
                </button>
            );
        }

        return (
            <div className="bg-black/60 rounded-xl p-3 border border-primary/20 mt-2">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-1 hover:bg-white/10 rounded">
                        <ChevronLeft size={14} className="text-gray-400" />
                    </button>
                    <span className="text-xs font-bold text-white">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-1 hover:bg-white/10 rounded">
                        <ChevronRight size={14} className="text-gray-400" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                        <div key={i} className="text-[10px] text-gray-500">{d}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">{days}</div>
            </div>
        );
    };

    // Time Slots
    const TimeSlots = () => (
        <div className="grid grid-cols-2 gap-2 mt-2">
            {TIME_SLOTS.map(time => (
                <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className="py-2 px-2 bg-black/50 border border-primary/20 rounded-lg text-xs text-white hover:bg-primary/20 transition-all flex items-center justify-center gap-1"
                >
                    <Clock size={10} /> {time}
                </button>
            ))}
        </div>
    );

    // Summary
    const Summary = () => (
        <div className="bg-black/60 rounded-xl p-3 border border-primary/30 space-y-2 mt-2">
            <div className="flex items-center gap-2 text-xs">
                <User size={12} className="text-primary" />
                <span className="text-gray-400">Name:</span>
                <span className="text-white">{formData.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <Phone size={12} className="text-primary" />
                <span className="text-gray-400">Phone:</span>
                <span className="text-white">{formData.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <FileText size={12} className="text-primary" />
                <span className="text-gray-400">Purpose:</span>
                <span className="text-white truncate">{formData.purpose}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <Calendar size={12} className="text-primary" />
                <span className="text-gray-400">Date:</span>
                <span className="text-white">{formData.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <Clock size={12} className="text-primary" />
                <span className="text-gray-400">Time:</span>
                <span className="text-white">{formData.time}</span>
            </div>
            <button
                onClick={handleConfirm}
                className="w-full mt-2 py-2 bg-primary text-black font-bold rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-1 text-sm"
            >
                <CheckCircle size={14} /> Confirm
            </button>
        </div>
    );

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.9 }}
                            className="mb-4 w-80 md:w-96 bg-black/95 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
                        >
                            {/* Header */}
                            <div className="p-3 bg-primary/10 border-b border-primary/20 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-bold text-white text-sm">Book Appointment</span>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar" ref={scrollRef}>
                                {history.map((msg, i) => (
                                    <div key={i}>
                                        <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`rounded-xl p-2 max-w-[85%] text-sm
                                                ${msg.type === 'user'
                                                    ? 'bg-primary/20 border border-primary/30 text-white'
                                                    : 'bg-gray-800/70 text-gray-200'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                        {msg.component === 'calendar' && step === 'date' && <CalendarPicker />}
                                        {msg.component === 'timeSlots' && step === 'time' && <TimeSlots />}
                                        {msg.component === 'summary' && step === 'confirm' && <Summary />}
                                    </div>
                                ))}

                                {step === 'start' && history.length === 1 && (
                                    <button
                                        onClick={startChat}
                                        className="w-full py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl text-primary font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Calendar size={16} /> Start Booking
                                    </button>
                                )}
                            </div>

                            {/* Input */}
                            {(step === 'name' || step === 'phone' || step === 'purpose') && (
                                <form onSubmit={handleSend} className="p-3 bg-gray-900/70 border-t border-white/10 flex gap-2">
                                    <input
                                        type={step === 'phone' ? 'tel' : 'text'}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={
                                            step === 'name' ? "Your name..." :
                                                step === 'phone' ? "+91 9876543210" :
                                                    "Purpose of meeting..."
                                        }
                                        className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                                        autoFocus
                                    />
                                    <button type="submit" className="p-2 rounded-lg bg-primary text-black font-bold hover:brightness-110">
                                        <Send size={16} />
                                    </button>
                                </form>
                            )}

                            {step === 'success' && (
                                <div className="p-3 bg-green-900/20 border-t border-green-500/30 text-center">
                                    <p className="text-green-400 text-sm flex items-center justify-center gap-2 mb-2">
                                        <CheckCircle size={14} /> Booked!
                                    </p>
                                    <button onClick={resetChat} className="text-xs text-gray-400 hover:text-white">
                                        Book Another
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle Button */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-full shadow-lg shadow-primary/30 flex items-center justify-center bg-primary"
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div key="close" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                                <X size={24} className="text-black" />
                            </motion.div>
                        ) : (
                            <motion.div key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                <Calendar size={24} className="text-black" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );
};

export default ChatBot;
