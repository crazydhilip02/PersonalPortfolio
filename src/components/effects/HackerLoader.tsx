import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUOTES = [
    "\"Experience is the name everyone gives to their mistakes.\"",
    "\"It’s not a bug. It’s a feature.\"",
    "Decrypting Matrix...",
    "\"Simple is better than complex.\"",
    "Injecting Coffee...",
];

const HackerLoader = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
    const [progress, setProgress] = useState(0);
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [statusText, setStatusText] = useState("INITIALIZING...");

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onLoadingComplete, 800);
                    return 100;
                }
                return Math.min(prev + Math.floor(Math.random() * 3) + 1, 100);
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onLoadingComplete]);

    // Cycle quotes and status randomly
    useEffect(() => {
        const quoteInterval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
        }, 2000); // Slower rotation for reading quotes

        return () => clearInterval(quoteInterval);
    }, []);

    // Dynamic status text based on progress
    useEffect(() => {
        if (progress < 30) setStatusText("ESTABLISHING CONNECTION...");
        else if (progress < 60) setStatusText("DOWNLOADING ASSETS...");
        else if (progress < 90) setStatusText("CONFIGURING VIRTUAL ENVIRONMENT...");
        else setStatusText("SYSTEM READY.");
    }, [progress]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-darker overflow-hidden text-primary font-mono select-none">
            {/* Matrix/Grid Background Overlay */}
            <div className="absolute inset-0 bg-cyber-grid opacity-20 pointer-events-none" />

            <div className="z-10 text-center space-y-12 max-w-4xl px-4 w-full">
                {/* Main Dynamic Quote - Replaces "SYSTEM INITIALIZATION" */}
                <div className="min-h-[120px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.h1
                            key={quoteIndex}
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(5px)" }}
                            transition={{ duration: 0.4 }}
                            className="text-3xl md:text-5xl font-bold glitch-effect tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary"
                            data-text={QUOTES[quoteIndex]}
                        >
                            {QUOTES[quoteIndex]}
                        </motion.h1>
                    </AnimatePresence>
                </div>

                {/* Progress Bar Container */}
                <div className="max-w-xl mx-auto w-full space-y-2">
                    <div className="flex justify-between text-xs text-tertiary uppercase tracking-widest">
                        <span>{statusText}</span>
                        <span>{progress}%</span>
                    </div>

                    <div className="h-2 bg-gray-900 border border-gray-800 rounded-sm relative overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-tertiary via-primary to-secondary"
                            initial={{ width: "0%" }}
                            animate={{ width: `${progress}%` }}
                            transition={{ ease: "linear", duration: 0.1 }}
                        />
                        {/* Shimmer/Scanline */}
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[loadingBar_1s_linear_infinite]" />
                    </div>
                </div>
            </div>

            {/* Decorative corners */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary opacity-50" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-secondary opacity-50" />
        </div>
    );
};

export default HackerLoader;
