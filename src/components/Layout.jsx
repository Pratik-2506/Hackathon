import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Smile, BarChart2, BookOpen, Settings, LogOut, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Layout() {
    const { session, signOut, profile } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect to Onboarding if user is logged in but has no name set in profile
    // Redirect to Onboarding if user is logged in but has no name set in profile
    useEffect(() => {
        // Only redirect if we have a session, we have ALREADY loaded the profile (it's not null),
        // BUT the profile name is missing.
        // Also avoid redirecting if we are already on onboarding or login.
        if (session && profile && profile.name === null && location.pathname !== '/onboarding' && location.pathname !== '/login') {
            navigate('/onboarding');
        }
    }, [session, profile, location.pathname, navigate]);

    const navItems = [
        { label: 'Chat', path: '/chat', icon: MessageCircle },
        { label: 'Journal', path: '/journal', icon: BookOpen },
        { label: 'Garden', path: '/garden', icon: Sprout },
        { label: 'History', path: '/history', icon: BarChart2 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-700 selection:bg-mint-200 selection:text-slate-800">
            {/* Background Gradients */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-mint-50 via-slate-50 to-lavender-50"></div>

            {/* Glass Header */}
            <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm px-6 py-4 flex items-center justify-between transition-all duration-300">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mint-400 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-mint-200 group-hover:shadow-mint-300 transition-all duration-300 group-hover:scale-105">M</div>
                    <span className="font-heading font-bold text-2xl tracking-tight text-slate-800 group-hover:text-mint-600 transition-colors">MindEase</span>
                </Link>

                <nav className="hidden md:flex items-center gap-2 bg-white/50 p-1.5 rounded-full border border-white/40 shadow-inner">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${location.pathname === item.path
                                ? 'text-slate-800 bg-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                                }`}
                        >
                            <item.icon size={18} className={location.pathname === item.path ? 'text-mint-500' : ''} />
                            {item.label}
                            {location.pathname === item.path && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link to="/calm" className="flex items-center gap-2 px-3 py-2 md:px-4 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold hover:bg-indigo-100 transition-colors shadow-sm ring-1 ring-indigo-100">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                        <span className="hidden md:inline">Panic Button</span>
                        <span className="md:hidden">Calm</span>
                    </Link>

                    {session ? (
                        <>
                            <Link to="/settings" className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-white/80 transition-all">
                                <Settings size={20} />
                            </Link>
                            <button onClick={() => signOut()} className="p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all" title="Sign Out">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="px-6 py-2.5 bg-slate-800 text-white font-medium rounded-full hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            Get Started
                        </Link>
                    )}
                </div>
            </header>

            {/* Main Content with Transition */}
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 mb-24 md:mb-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Floating Mobile Bottom Nav */}
            {session && (
                <nav className="md:hidden fixed bottom-6 left-4 right-4 bg-white/90 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl shadow-slate-200/50 flex justify-between p-2 z-50">
                    <Link
                        to="/"
                        className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${location.pathname === '/' ? 'bg-mint-50 text-mint-600' : 'text-slate-400'}`}
                    >
                        <Home size={22} />
                        {location.pathname === '/' && <span className="text-[10px] font-bold mt-1">Home</span>}
                    </Link>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all ${location.pathname === item.path ? 'bg-mint-50 text-mint-600 shadow-inner' : 'text-slate-400 active:scale-95'}`}
                        >
                            <item.icon size={22} />
                            {location.pathname === item.path && <span className="text-[10px] font-bold mt-1">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            )}
        </div>
    );
}
