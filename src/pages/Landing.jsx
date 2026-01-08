import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Avatar from '../components/Avatar';
import { ArrowRight, Shield, Clock, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
    const { session } = useAuth();

    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
                <motion.div
                    animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-10 left-10 w-72 h-72 bg-mint-300 rounded-full mix-blend-multiply filter blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, -70, 0], y: [0, 80, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 right-10 w-96 h-96 bg-lavender-300 rounded-full mix-blend-multiply filter blur-3xl"
                />
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 50, 0], scale: [1, 1.3, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl"
                />
            </div>

            {/* Main Content */}
            <div className="text-center max-w-3xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 flex justify-center"
                >
                    <Avatar mood="happy" className="drop-shadow-2xl" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight tracking-tight font-heading"
                >
                    Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint-500 to-teal-500">MindEase</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed"
                >
                    Your safe space for reflection, emotional support, and mindful growth. AI-powered, privacy-first.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link to={session ? "/journal" : "/login"} className="group relative px-8 py-4 bg-slate-800 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-mint-500/20 transition-all hover:-translate-y-1 overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-mint-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>

                    <Link to="/about" className="px-8 py-4 bg-white/50 backdrop-blur-sm text-slate-700 border border-white rounded-2xl font-semibold text-lg hover:bg-white transition-all hover:shadow-lg">
                        How it works
                    </Link>
                </motion.div>

                {/* Features Mesh */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    {[
                        { title: "24/7 AI Companion", desc: "Empathetic support whenever you need to vent.", icon: Clock, color: "text-mint-600", bg: "bg-mint-50" },
                        { title: "Private Vault", desc: "Your thoughts are encrypted and yours alone.", icon: Shield, color: "text-blue-600", bg: "bg-blue-50" },
                        { title: "Visual Growth", desc: "Watch your mind garden bloom as you heal.", icon: Heart, color: "text-lavender-600", bg: "bg-lavender-50" }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            className={`p-6 bg-white/60 backdrop-blur-md rounded-3xl shadow-sm border border-white hover:shadow-xl transition-all duration-300 text-left`}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 + (i * 0.1) }}
                            whileHover={{ y: -5 }}
                        >
                            <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                            <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
