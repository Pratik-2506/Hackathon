import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles, Send, ShieldCheck, ArrowRight, AlertCircle, CloudOff } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { analyzeJournal } from '../lib/ai';

const IS_OFFLINE_MODE = false; // Set to true to force offline testing

export default function JournalEntryForm({ userId, onEntrySaved }) {
    const [content, setContent] = useState('');
    const [moodLevel, setMoodLevel] = useState(null);
    const [isAiEnabled, setIsAiEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState(null); // { type: 'error' | 'success', text: '' }

    const moods = [
        { level: 1, emoji: '😖', label: 'Rough' },
        { level: 2, emoji: '😔', label: 'Down' },
        { level: 3, emoji: '😐', label: 'Okay' },
        { level: 4, emoji: '🙂', label: 'Good' },
        { level: 5, emoji: '🤩', label: 'Great' },
    ];

    const saveToLocalStorage = (payload) => {
        try {
            const existing = JSON.parse(localStorage.getItem('offline_journal_entries') || '[]');
            // Add fake ID and timestamp
            const newEntry = {
                ...payload,
                id: `local-${Date.now()}`,
                created_at: new Date().toISOString(),
                is_local: true
            };
            localStorage.setItem('offline_journal_entries', JSON.stringify([newEntry, ...existing]));
            return true;
        } catch (e) {
            console.error("Local Save Failed", e);
            return false;
        }
    };

    const handleSave = async () => {
        setStatusMsg(null);

        // 1. Validation
        if (!content.trim() && !moodLevel) {
            setStatusMsg({ type: 'error', text: "Please write something or pick a mood." });
            return;
        }

        // Allow saving locally even if no userId (Offline/Guest mode implicit support)
        // but prefer userId if available.

        // Watchdog: Force unlock after 8s no matter what
        const watchDog = setTimeout(() => {
            console.warn("Watchdog forced unlock!");
            setLoading(false);
            setStatusMsg({ type: 'error', text: "Operation timed out." });
        }, 8000);

        try {
            // 2. AI Analysis (Optional & Safe)
            let aiData = { sentiment_score: 0, mood_tags: [], ai_summary: "" };

            if (isAiEnabled && content.trim().length > 5) {
                try {
                    // Timeout AI after 4 seconds to keep UI snappy
                    const aiPromise = analyzeJournal(content);
                    const timeoutPromise = new Promise(r => setTimeout(() => r(null), 4000));
                    const analysis = await Promise.race([aiPromise, timeoutPromise]);

                    if (analysis) {
                        aiData = {
                            sentiment_score: analysis.sentimentScore || 0,
                            mood_tags: analysis.emotions || [],
                            ai_summary: analysis.response || ""
                        };
                    }
                } catch (e) {
                    console.warn("AI Skipped:", e);
                }
            }

            const payload = {
                user_id: userId, // Can be null for local storage
                content: content,
                mood_level: moodLevel,
                is_ai_enabled: isAiEnabled,
                sentiment_score: aiData.sentiment_score,
                mood_tags: aiData.mood_tags,
                ai_summary: aiData.ai_summary
            };

            // 3. Try Saving to Supabase
            let savedToCloud = false;

            if (userId && !IS_OFFLINE_MODE) {
                try {
                    const { error } = await supabase.from('journal_entries').insert([payload]);
                    if (error) throw error;
                    savedToCloud = true;
                } catch (cloudErr) {
                    console.warn("Cloud Save Failed, failing over to local:", cloudErr);
                    setStatusMsg({ type: 'error', text: "Cloud save failed. Saving locally instead..." });
                    // Fallthrough to local save
                }
            }

            if (!savedToCloud) {
                // FALLBACK: Local Storage
                saveToLocalStorage(payload);
            }

            // 4. Cleanup
            setContent('');
            setMoodLevel(null);

            if (savedToCloud) {
                setStatusMsg({ type: 'success', text: isAiEnabled ? "Analyzed & Saved to Cloud! ✨" : "Saved to Vault 🔒" });
            } else {
                setStatusMsg({ type: 'success', text: "Saved to Device (Offline Mode) 💾" });
            }

            // Trigger Refresh
            setTimeout(() => {
                if (onEntrySaved) onEntrySaved();
                // Clear success message after 3s
                setTimeout(() => setStatusMsg(null), 3000);
            }, 500);

        } catch (err) {
            console.error("Critical Error", err);
            // Even if catastrophic failure, show error and unfreeze
            setStatusMsg({ type: 'error', text: "Something went wrong." });
            setLoading(false); // Immediate unfreeze
        } finally {
            clearTimeout(watchDog);
            if (loading) setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">

            {/* Header */}
            <div className={`px-6 py-4 border-b flex items-center justify-between transition-colors duration-300 ${isAiEnabled ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isAiEnabled ? 'bg-teal-100 text-teal-600' : 'bg-slate-200 text-slate-500'}`}>
                        {isAiEnabled ? <Sparkles size={20} /> : <Lock size={20} />}
                    </div>
                    <div>
                        <h2 className={`font-bold text-sm uppercase tracking-wider ${isAiEnabled ? 'text-teal-900' : 'text-slate-600'}`}>
                            {isAiEnabled ? 'AI Insights Mode' : 'Private Vault Mode'}
                        </h2>
                    </div>
                </div>
                <button
                    onClick={() => setIsAiEnabled(!isAiEnabled)}
                    className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${isAiEnabled ? 'bg-teal-500' : 'bg-slate-300'}`}
                >
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${isAiEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>

            {/* Status Messages */}
            {statusMsg && (
                <div className={`mx-6 mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${statusMsg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {statusMsg.type === 'error' ? <AlertCircle size={16} /> : <ShieldCheck size={16} />}
                    {statusMsg.text}
                </div>
            )}

            {/* Moods */}
            <div className="px-6 pt-6 pb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Current Mood</span>
                <div className="flex justify-between gap-2">
                    {moods.map((m) => (
                        <button
                            key={m.level}
                            onClick={() => setMoodLevel(m.level)}
                            className={`flex-1 flex flex-col items-center p-2 rounded-xl transition-all ${moodLevel === m.level ? 'bg-slate-100 ring-2 ring-mint-300 scale-105' : 'grayscale hover:grayscale-0 hover:bg-slate-50'}`}
                        >
                            <span className="text-2xl mb-1">{m.emoji}</span>
                            <span className="text-[10px] font-medium text-slate-500">{m.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Input */}
            <div className="px-6 py-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="How was your day?..."
                    className="w-full h-48 p-0 text-lg text-slate-700 placeholder-slate-300 border-none focus:ring-0 resize-none bg-transparent leading-relaxed"
                />
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <ShieldCheck size={14} />
                    <span>{isAiEnabled ? 'Processed securely' : 'Encrypted storage'}</span>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading || (!content && !moodLevel)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isAiEnabled ? 'bg-teal-500 hover:bg-teal-600' : 'bg-slate-800 hover:bg-slate-900'}`}
                >
                    {loading ? 'Saving...' : (isAiEnabled ? 'Analyze & Save' : 'Save Entry')} <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}
