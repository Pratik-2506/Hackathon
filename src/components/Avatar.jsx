import { motion } from 'framer-motion';

export default function Avatar({ mood = 'neutral', className = '' }) {
    // Define colors based on mood logic
    const colors = {
        neutral: 'from-mint-300 to-lavender-300',
        happy: 'from-yellow-200 to-mint-300',
        sad: 'from-blue-200 to-lavender-300',
        anxious: 'from-orange-200 to-lavender-300',
        calm: 'from-teal-100 to-mint-200',
    };

    const gradient = colors[mood] || colors.neutral;

    return (
        <div className={`relative w-40 h-40 flex items-center justify-center ${className}`}>
            {/* Outer Glow */}
            <motion.div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} opacity-60 blur-xl`}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Main Body */}
            <motion.div
                className={`w-full h-full rounded-full bg-gradient-to-br ${colors[mood]} shadow-inner flex items-center justify-center relative z-10`}
                animate={{
                    y: [0, -15, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Glassy Overlay for depth */}
                <div className="absolute inset-1 rounded-full bg-white/20 backdrop-blur-sm" />

                {/* Face Elements */}
                <div className="relative z-20 flex flex-col items-center gap-2 mt-4">
                    <div className="flex gap-8">
                        {/* Eyes */}
                        <motion.div
                            className="w-3 h-4 bg-slate-600/60 rounded-full"
                            animate={{ scaleY: [1, 0.1, 1] }} // Blink
                            transition={{ repeat: Infinity, delay: Math.random() * 5 + 2, duration: 0.2 }}
                        />
                        <motion.div
                            className="w-3 h-4 bg-slate-600/60 rounded-full"
                            animate={{ scaleY: [1, 0.1, 1] }}
                            transition={{ repeat: Infinity, delay: Math.random() * 5 + 2, duration: 0.2 }}
                        />
                    </div>
                    {/* Mouth - Simple neutral smile */}
                    <div className="w-4 h-1 bg-slate-600/40 rounded-full" />
                </div>
            </motion.div>
        </div>
    );
}
