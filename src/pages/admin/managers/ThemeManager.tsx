import React, { useState, useEffect } from 'react';
import { useContent } from '../../../context/ContentContext';
import { Save, RefreshCw, Palette } from 'lucide-react';

const PRESETS = [
    { name: 'Cyber Cyan', primary: '#00FFFF', secondary: '#FF00FF', accent: '#39FF14' },
    { name: 'Matrix Green', primary: '#00FF00', secondary: '#003300', accent: '#CCFF00' },
    { name: 'Sunset Orange', primary: '#FF4500', secondary: '#8A2BE2', accent: '#FFD700' },
    { name: 'Royal Purple', primary: '#9D00FF', secondary: '#00E5FF', accent: '#FF0099' },
    { name: 'Deep Ocean', primary: '#00BFFF', secondary: '#00008B', accent: '#7FFFD4' },
];

const ThemeManager: React.FC = () => {
    const { theme, updateTheme } = useContent();
    const [localTheme, setLocalTheme] = useState(theme);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (theme) setLocalTheme(theme);
    }, [theme]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateTheme(localTheme);
            // alert('Theme Updated!'); // In a real app use toast
        } catch (error) {
            console.error("Failed to update theme", error);
        }
        setSaving(false);
    };

    const applyPreset = (preset: any) => {
        setLocalTheme({
            primary: preset.primary,
            secondary: preset.secondary,
            accent: preset.accent
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Palette className="text-cyan-500" /> Theme Engine
                </h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 transition-all"
                >
                    {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Applying...' : 'Deploy Theme'}
                </button>
            </div>

            {/* Live Preview Card */}
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
                <h3 className="text-gray-400 mb-4 font-mono text-sm">LIVE PREVIEW</h3>
                <div
                    className="p-8 rounded-lg border flex flex-col items-center justify-center gap-4 transition-colors duration-500"
                    style={{
                        borderColor: localTheme.primary,
                        background: `linear-gradient(135deg, ${localTheme.secondary}20, transparent)`
                    }}
                >
                    <h2
                        className="text-4xl font-bold transition-colors duration-500"
                        style={{ color: localTheme.primary, textShadow: `0 0 10px ${localTheme.primary}` }}
                    >
                        Hero Title Hook
                    </h2>
                    <button
                        className="px-6 py-2 rounded font-bold text-black transition-colors duration-500"
                        style={{ backgroundColor: localTheme.accent, boxShadow: `0 0 15px ${localTheme.accent}` }}
                    >
                        CTA Button
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Manual Controls */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Manual Override</h3>

                    {['primary', 'secondary', 'accent'].map((key) => (
                        <div key={key} className="space-y-2">
                            <label className="text-gray-400 text-sm font-mono uppercase">{key} Color</label>
                            <div className="flex gap-4">
                                <input
                                    type="color"
                                    value={(localTheme as any)[key] || '#000000'}
                                    onChange={(e) => setLocalTheme({ ...localTheme, [key]: e.target.value })}
                                    className="h-10 w-20 rounded bg-transparent border border-gray-700 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={(localTheme as any)[key] || ''}
                                    onChange={(e) => setLocalTheme({ ...localTheme, [key]: e.target.value })}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 text-white font-mono"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Presets */}
                <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">System Presets</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {PRESETS.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="group flex items-center justify-between p-3 rounded-lg bg-black/40 border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition-all text-left"
                            >
                                <span className="font-mono text-gray-300 group-hover:text-white">{preset.name}</span>
                                <div className="flex gap-2">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }} />
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeManager;
