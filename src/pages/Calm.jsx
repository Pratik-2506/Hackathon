import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';
import BreathingCircle from '../components/BreathingCircle';

export default function Calm() {
    const [soundEnabled, setSoundEnabled] = useState(false);

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 transition-colors duration-1000">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-teal-900/50 to-slate-900 pointer-events-none"></div>

            {/* Header controls */}
            <div className="absolute top-6 right-6 flex items-center gap-4 z-20">
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-3 bg-white/10 rounded-full text-white/70 hover:bg-white/20 transition-all backdrop-blur-sm"
                    title={soundEnabled ? "Mute Sound" : "Play Calming Sound"}
                >
                    {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                </button>
                <Link
                    to="/"
                    className="px-6 py-2 bg-white/10 rounded-full text-white font-medium hover:bg-white/20 transition-all backdrop-blur-sm flex items-center gap-2"
                >
                    <X size={20} />
                    Exit Mode
                </Link>
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 flex flex-col items-center text-center max-w-lg"
            >
                <div className="mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-200 text-sm font-medium mb-4 border border-teal-500/30">
                        <Wind size={16} /> 4-7-8 Breathing Technique
                    </span>
                    <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
                        Breathe In...
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Focus on the circle. Inhale as it expands, hold, then exhale slowly.
                    </p>
                </div>

                <BreathingCircle />

                <div className="mt-12 text-slate-500 text-sm">
                    This simple rhythm helps reset your nervous system.
                </div>
            </motion.div>
        </div>
    );
}
