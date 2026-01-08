import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import JournalEntryForm from '../components/JournalEntryForm';
import { Lock, Sparkles, Calendar, Database, HardDrive } from 'lucide-react';
import { format } from 'date-fns';

export default function Journal() {
    const { user } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState('cloud'); // 'cloud' | 'local'

    // Unified Fetcher (Cloud + Local)
    const fetchEntries = async () => {
        setLoading(true);
        let allEntries = [];
        let src = 'cloud';

        // 1. Try Cloud
        if (user) {
            try {
                const { data, error } = await supabase
                    .from('journal_entries')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    allEntries = [...data];
                }
            } catch (e) {
                console.warn("Cloud Fetch Failed", e);
            }
        }

        // 2. Merge Local Storage (Offline Mode Fallback)
        try {
            const localRaw = localStorage.getItem('offline_journal_entries');
            if (localRaw) {
                const localData = JSON.parse(localRaw);
                // Prepend local entries (newer first usually)
                allEntries = [...localData, ...allEntries];

                // If we found local data but no cloud data, we are effectively 'mixed' or 'local'
                if (localData.length > 0 && allEntries.length === localData.length) {
                    src = 'local';
                }
            }
        } catch (e) {
            console.warn("Local Read Failed", e);
        }

        // Deduplicate just in case
        const seen = new Set();
        const uniqueEntries = allEntries.filter(e => {
            const duplicate = seen.has(e.id);
            seen.add(e.id);
            return !duplicate;
        });

        // Sort by date desc
        uniqueEntries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setEntries(uniqueEntries);
        setSource(src);
        setLoading(false);
    };

    useEffect(() => {
        fetchEntries();
    }, [user]);

    return (
        <div className="min-h-screen bg-off-white pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-800 mb-1">Daily Journal</h1>
                        <p className="text-slate-500">Document your journey (Auto-saves to Device if Offline).</p>
                    </div>
                    <JournalEntryForm userId={user?.id} onEntrySaved={fetchEntries} />
                </div>

                {/* Right: List */}
                <div className="lg:col-span-1 border-l border-slate-100 lg:pl-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-700 font-heading">Recent Entries</h2>
                        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1">
                            {source === 'cloud' ? <Database size={10} /> : <HardDrive size={10} />}
                            {source === 'cloud' ? 'Synced' : 'Local Storage'}
                        </span>
                    </div>

                    {loading ? (
                        <div className="space-y-4 animate-pulse">
                            {[1, 2].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl w-full"></div>)}
                        </div>
                    ) : entries.length === 0 ? (
                        <div className="p-8 bg-white rounded-3xl border border-dashed border-slate-200 text-center">
                            <span className="text-4xl mb-2 block">📝</span>
                            <p className="text-slate-400 text-sm">No entries yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                            {entries.map((entry) => (
                                <div key={entry.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wide">
                                            <Calendar size={12} />
                                            {format(new Date(entry.created_at), 'MMM d')}
                                            {entry.is_local && <HardDrive size={10} className="text-orange-400" title="Saved on Device" />}
                                        </div>
                                        <div>
                                            {entry.is_ai_enabled ? <Sparkles size={14} className="text-teal-400" /> : <Lock size={14} className="text-slate-300" />}
                                        </div>
                                    </div>
                                    <p className="text-slate-700 text-sm line-clamp-4 font-serif leading-relaxed mb-3">
                                        {entry.content}
                                    </p>
                                    {entry.ai_summary && (
                                        <div className="bg-teal-50 rounded-xl p-3 border border-teal-100 mt-2">
                                            <p className="text-[11px] text-teal-800 italic leading-snug">"{entry.ai_summary}"</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
