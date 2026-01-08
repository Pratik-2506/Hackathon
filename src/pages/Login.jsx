import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                }
            });
            if (error) alert(error.message);
        } catch (error) {
            alert('Error logging in with Google');
        }
    };


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Attempt to sign in with magic link
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + '/journal',
            }
        });

        if (error) {
            alert(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-lavender-100 items-center text-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                <p className="text-slate-500 mb-8">Sign in to continue your journey.</p>

                {/* Google Button Removed */}


                {sent ? (
                    <div className="bg-mint-50 text-mint-700 p-4 rounded-xl">
                        <p className="font-semibold">Check your email!</p>
                        <p className="text-sm mt-1">We've sent a magic link to {email}</p>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="name@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-100 outline-none transition-all"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-mint-500 text-white rounded-xl font-semibold hover:bg-mint-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="animate-spin" size={20} />}
                            {loading ? 'Sending...' : 'Continue with Email'}
                        </button>
                    </form>
                )}

                <p className="mt-8 text-xs text-slate-400">
                    By continuing, you acknowledge that MindEase is not a replacement for professional help.
                </p>
            </div>
        </div>
    );
}
