import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function Onboarding() {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleComplete = async () => {
        if (!name.trim()) return;
        setLoading(true);

        try {
            // Optimistically attempt to save profile
            await supabase.from('profiles').upsert({
                id: user?.id,
                name: name
            });

            // CRITICAL: Refresh context so Layout knows we have a name now
            await refreshProfile();

            // Short delay to allow state propagate
            setTimeout(() => {
                navigate('/chat');
            }, 500);

        } catch (err) {
            console.error(err);
            navigate('/chat');
        }
    };

    return (
        <div className="max-w-xl mx-auto pt-10">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-lavender-100">
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-lavender-600 mb-4">
                            <AlertCircle size={32} />
                            <h2 className="text-2xl font-bold">Important Safety Notice</h2>
                        </div>
                        <div className="space-y-4 text-slate-600 leading-relaxed">
                            <p>MindEase is an AI companion, <strong className="text-slate-900">not a mental health professional</strong>.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>We cannot diagnose or treat mental health conditions.</li>
                                <li>We cannot provide medical advice.</li>
                                <li>If you are in crisis, please contact emergency services immediately.</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setStep(2)}
                            className="w-full py-3 bg-mint-500 text-white rounded-xl font-semibold hover:bg-mint-600 transition-all mt-6"
                        >
                            I Understand & Agree
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right duration-500">
                        <div className="flex items-center gap-3 text-mint-500 mb-4">
                            <CheckCircle2 size={32} />
                            <h2 className="text-2xl font-bold">Let's Get Started</h2>
                        </div>
                        <p className="text-slate-600">What should I call you?</p>
                        <input
                            type="text"
                            placeholder="Your First Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-100 outline-none transition-all"
                        />
                        <button
                            onClick={handleComplete}
                            disabled={!name.trim() || loading}
                            className="w-full py-3 bg-mint-500 text-white rounded-xl font-semibold hover:bg-mint-600 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Setting up...' : 'Start Chatting'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
