import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BreathingCircle() {
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
    const [timeLeft, setTimeLeft] = useState(4);

    useEffect(() => {
        let timer;
        
        const runCycle = async () => {
            // Inhale (4s)
            setPhase('Inhale');
            setTimeLeft(4);
            await new Promise(r => setTimeout(r, 4000));
            
            // Hold (7s)
            setPhase('Hold');
            setTimeLeft(7);
            await new Promise(r => setTimeout(r, 7000));
            
            // Exhale (8s)
            setPhase('Exhale');
            setTimeLeft(8);
            await new Promise(r => setTimeout(r, 8000));
            
            // Loop functionality if needed, for now useEffect wrapper handles re-renders if we put it in dependencies or just rely on react state update triggering re-run?
            // Actually, infinite loop is better handled with recursion or strict timeout chain.
            runCycle();
        };

        // Instead of complex async loop that fights React, let's use variants for animation
        // and a simpler text cycler.
    }, []);

    // Better approach: Pure CSS/Framer animation for the visual, simple keyframes
    
    return (
        <div className="relative flex flex-col items-center justify-center py-10">
            <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Outer Glow Ring */}
                <motion.div
                    className="absolute inset-0 bg-mint-200 rounded-full opacity-30 blur-xl"
                    animate={{
                        scale: [1, 1.5, 1.5, 1], // Inhale(Big), Hold(Big), Exhale(Small)
                    }}
                    transition={{
                        duration: 19, // 4 + 7 + 8
                        times: [0, 4/19, 11/19, 1], // Keyframe percentages
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Main Breathing Circle */}
                <motion.div
                    className="w-48 h-48 bg-gradient-to-br from-mint-400 to-teal-400 rounded-full shadow-2xl flex items-center justify-center z-10 relative"
                    animate={{
                        scale: [1, 1.3, 1.3, 1],
                    }}
                    transition={{
                        duration: 19,
                        times: [0, 4/19, 11/19, 1],
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    {/* Inner Text Anims */}
                    <InstructionText />
                </motion.div>
                
                {/* Particle Ring (Optional visual flair) */}
                <motion.div 
                    className="absolute w-full h-full border-2 border-mint-300 rounded-full opacity-50"
                    animate={{ scale: [1, 1.4, 1.4, 1], opacity: [0.5, 0, 0, 0.5] }}
                    transition={{ duration: 19, times: [0, 4/19, 11/19, 1], repeat: Infinity }}
                />
            </div>
        </div>
    );
}

function InstructionText() {
    const [text, setText] = useState('Inhale');
    
    useEffect(() => {
        const cycle = () => {
            setText('Inhale (4s)');
            setTimeout(() => {
                setText('Hold (7s)');
                setTimeout(() => {
                    setText('Exhale (8s)');
                    setTimeout(cycle, 8000);
                }, 7000);
            }, 4000);
        };
        cycle();
        return () => {}; // Cleanup?
    }, []);

    return (
        <motion.span 
            key={text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-white text-xl font-bold font-heading tracking-widest uppercase"
        >
            {text}
        </motion.span>
    );
}
