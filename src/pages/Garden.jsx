import React, { useEffect, useState } from 'react';
import Plant from '../components/Plant';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function Garden() {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(false);

    // Profile is already loaded by AuthContext
    useEffect(() => {
        if (!profile) setLoading(true);
        else setLoading(false);
    }, [profile]);

    return (
        <div className="min-h-screen bg-off-white pt-24 pb-24 px-4">
            <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-3xl font-heading font-bold text-slate-800 mb-2">My Mind Garden</h1>
                <p className="text-slate-600 mb-8">Consistency helps your mind (and your garden) grow.</p>

                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
                    {/* Force Render Plant - Debug Mode */}
                    <Plant streak={profile?.streak_count || 0} />

                    <div className="mt-8 grid grid-cols-3 gap-4 w-full">
                        <div className="p-4 bg-mint-50 rounded-2xl">
                            <span className="block text-2xl font-bold text-mint-600">{profile?.streak_count || 0}</span>
                            <span className="text-xs text-mint-800 uppercase font-bold tracking-wide">Current Streak</span>
                        </div>
                        <div className="p-4 bg-lavender-50 rounded-2xl">
                            <span className="block text-2xl font-bold text-lavender-600">3</span>
                            <span className="text-xs text-lavender-800 uppercase font-bold tracking-wide">Next Milestone</span>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-2xl">
                            <span className="block text-2xl font-bold text-blue-600">Level 1</span>
                            <span className="text-xs text-blue-800 uppercase font-bold tracking-wide">Garden Level</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <Link to="/chat" className="inline-block bg-slate-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors">
                        Chat to Water Your Plant
                    </Link>
                </div>
            </div>
        </div>
    );
}
