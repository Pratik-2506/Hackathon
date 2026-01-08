import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { analyzeJournal } from '../lib/ai';
import { Sparkles, Tag, ArrowRight } from 'lucide-react';

export default function Mood() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [mood, setMood] = useState(null); // 1 to 5
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [insight, setInsight] = useState(null);

    const moods = [
        { level: 1, emoji: '😖', label: 'Overwhelmed' },
        { level: 2, emoji: '😔', label: 'Down' },
        { level: 3, emoji: '😐', label: 'Okay' },
        { level: 4, emoji: '🙂', label: 'Good' },
        { level: 5, emoji: '🤩', label: 'Great' },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mood) return;
        setLoading(true);

        // 1. Get AI Insight if note is present
        let analysis = null;
        if (note.length > 10) {
            analysis = await analyzeJournal(note);
            setInsight(analysis); // Show immediate feedback
        }

        const { error } = await supabase.from('moods').insert([
            {
                user_id: user.id,
                mood_level: mood,
                note: note,
                sentiment_score: analysis?.sentimentScore || null,
                ai_tags: analysis?.emotions || null,
                ai_response: analysis?.response || null
            },
        ]);

        setLoading(false);

        if (error) {
            alert('Error saving mood');
        } else {
            // Check streak logic is handled in AuthContext or here if needed, 
            // but AuthContext handles it on 'Login' check. 
            // We could also force update here if we want instant gratification?
            if (!analysis) navigate('/history');
            // If text analysis exists, we stay on page to show the results, then user clicks 'Done'
        }
    };

    if (insight) {
        return (
            <div className="min-h-screen bg-off-white pt-24 px-4 pb-12">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-mint-100 text-mint-600 rounded-full mb-6">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-slate-800 mb-2">AI Insight</h2>
                        <p className="text-slate-600 mb-6">Here's what I gathered from your entry:</p>

                        {/* Sentiment Bar */}
                        <div className="mb-6 text-left">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Emotional Balance</label>
                            <div className="h-4 bg-slate-100 rounded-full overflow-hidden relative">
                                <div
                                    className="h-full bg-gradient-to-r from-lavender-400 to-mint-400 transition-all duration-1000 ease-out"
                                    style={{ width: `${insight.sentimentScore}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>Distressed</span>
                                <span>Thriving</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-6 flex flex-wrap gap-2 justify-center">
                            {insight.emotions.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 text-sm font-medium rounded-full border border-slate-100 flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {tag}
                                </span>
                            ))}
                        </div>

                        {/* AI Response */}
                        <div className="bg-mint-50 p-6 rounded-2xl mb-8 relative">
                            <div className="absolute -top-3 left-6 w-6 h-6 bg-mint-50 rotate-45"></div>
                            <p className="text-slate-700 italic font-medium leading-relaxed">"{insight.response}"</p>
                        </div>

                        <button
                            onClick={() => navigate('/history')}
                            className="w-full bg-slate-800 text-white py-4 rounded-xl font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Save to History <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-off-white pt-24 px-4 pb-12">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-heading font-bold text-slate-800 mb-2">Daily Check-in</h1>
                <p className="text-slate-600 mb-8">How are you feeling right now?</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Emoji Selector */}
                    <div className="grid grid-cols-5 gap-2">
                        {moods.map((m) => (
                            <button
                                key={m.level}
                                type="button"
                                onClick={() => setMood(m.level)}
                                className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-200 ${mood === m.level
                                        ? 'bg-white shadow-md scale-110 ring-2 ring-mint-300'
                                        : 'hover:bg-white/50 grayscale hover:grayscale-0'
                                    }`}
                            >
                                <span className="text-4xl mb-2 filter drop-shadow-sm">{m.emoji}</span>
                                <span className={`text-xs font-medium ${mood === m.level ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {m.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Journal Input */}
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">
                            Journal (Optional)
                        </label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Write about your day... The AI will analyze this for you."
                            className="w-full h-40 bg-slate-50 rounded-xl p-4 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mint-300 resize-none transition-all"
                        />
                        <div className="mt-2 text-xs text-right text-slate-400 flex items-center justify-end gap-1">
                            <Sparkles className="w-3 h-3 text-mint-400" /> AI Insights enabled
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={!mood || loading}
                        className="w-full bg-slate-800 text-white py-4 rounded-xl font-medium hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">Analyzing...</span>
                        ) : (
                            <>Save Entry <ArrowRight className="w-4 h-4" /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
