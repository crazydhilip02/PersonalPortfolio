import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal as TerminalIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TerminalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface LogEntry {
    type: 'command' | 'output' | 'error' | 'success';
    content: string;
}

const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose }) => {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<LogEntry[]>([
        { type: 'output', content: 'Welcome to PortfolioOS v2.0. Type "help" to see available commands.' }
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const logsEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Scroll to bottom on new log
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        const args = cleanCmd.split(' ').slice(1);

        // Add command to log
        setLogs(prev => [...prev, { type: 'command', content: `guest@portfolio:~$ ${cmd}` }]);

        let output: LogEntry = { type: 'output', content: '' };

        switch (cleanCmd.split(' ')[0]) {
            case 'help':
                output = {
                    type: 'success',
                    content: 'Available commands:\n  help      - Show this message\n  about     - Navigate to Bio\n  projects  - View Projects\n  skills  - View Capabilities\n  contact   - Get contact info\n  clear     - Clear terminal\n  whoami    - User identity\n  sudo      - Admin privileges?'
                };
                break;

            case 'clear':
                setLogs([]);
                return;

            case 'about':
                if (window.location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => {
                        const section = document.getElementById('about');
                        if (section) section.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                } else {
                    const section = document.getElementById('about');
                    if (section) section.scrollIntoView({ behavior: 'smooth' });
                }
                output = { type: 'success', content: 'Navigating to About section...' };
                onClose();
                break;

            case 'projects':
                if (window.location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => {
                        const section = document.getElementById('projects');
                        if (section) section.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                } else {
                    const section = document.getElementById('projects');
                    if (section) section.scrollIntoView({ behavior: 'smooth' });
                }
                output = { type: 'success', content: 'Loading Project Modules...' };
                onClose();
                break;

            case 'skills':
                if (window.location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => {
                        const section = document.getElementById('skills');
                        if (section) section.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                } else {
                    const section = document.getElementById('skills');
                    if (section) section.scrollIntoView({ behavior: 'smooth' });
                }
                output = { type: 'success', content: 'Analyzing Capabilities...' };
                onClose();
                break;

            case 'contact':
                if (window.location.pathname !== '/') {
                    navigate('/');
                    setTimeout(() => {
                        const section = document.getElementById('contact');
                        if (section) section.scrollIntoView({ behavior: 'smooth' });
                    }, 500);
                } else {
                    const section = document.getElementById('contact');
                    if (section) section.scrollIntoView({ behavior: 'smooth' });
                }
                output = { type: 'success', content: 'Opening secure frequency...' };
                onClose();
                break;

            case 'whoami':
                output = { type: 'output', content: 'Guest User (Level 1 Access)' };
                break;

            case 'sudo':
                if (args[0] === 'rm' && args[1] === '-rf' && args[2] === '/') {
                    output = { type: 'error', content: 'PERMISSION DENIED. Nice try, hacker. 🚫' };
                } else {
                    output = { type: 'error', content: 'User is not in the sudoers file. This incident will be reported.' };
                }
                break;

            case 'matrix':
                output = { type: 'success', content: 'Follow the white rabbit...' };
                // Could trigger matrix rain here locally if we had access to the context
                break;

            default:
                output = { type: 'error', content: `Command not found: ${cleanCmd}` };
        }

        setLogs(prev => [...prev, output]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Terminal Window */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-[#0c0c0c] border border-gray-800 rounded-lg shadow-2xl overflow-hidden font-mono text-sm relative"
                        >
                            {/* Header Bar */}
                            <div className="bg-[#1a1a1a] px-4 py-2 flex items-center justify-between border-b border-gray-800 select-none">
                                <div className="flex items-center gap-2">
                                    <TerminalIcon size={14} className="text-gray-400" />
                                    <span className="text-gray-400 font-bold text-xs">PortfolioOS --bash --80x24</span>
                                </div>
                                <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Content Area */}
                            <div className="h-[400px] overflow-y-auto p-4 space-y-2 text-gray-300" onClick={() => inputRef.current?.focus()}>
                                {logs.map((log, i) => (
                                    <div key={i} className={`whitespace-pre-wrap ${log.type === 'command' ? 'text-gray-400' :
                                        log.type === 'error' ? 'text-red-400' :
                                            log.type === 'success' ? 'text-green-400' :
                                                'text-gray-300'
                                        }`}>
                                        {log.content}
                                    </div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>

                            {/* Input Line */}
                            <div className="p-4 pt-0 flex items-center gap-2 border-t border-gray-800/50 bg-[#0c0c0c]">
                                <span className="text-green-500">guest@portfolio:~$</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600"
                                    placeholder="Type 'help'..."
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TerminalModal;
