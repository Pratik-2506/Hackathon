import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Trash2, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        if (confirm("Are you sure you want to delete all your data? This action cannot be undone.")) {
            // In a real app, call a backend function to delete the user.
            // Here we'll simulate by deleting their profile and moods.
            await supabase.from('moods').delete().eq('user_id', user.id);
            await supabase.from('profiles').delete().eq('id', user.id);
            await signOut();
            navigate('/');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-lavender-50">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <User size={20} className="text-mint-500" /> Account
                    </h2>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b border-slate-50">
                        <div>
                            <p className="font-medium text-slate-700">Email Address</p>
                            <p className="text-slate-500 text-sm">{user?.email}</p>
                        </div>
                    </div>
                    <div className="pt-4">
                        <button onClick={() => signOut()} className="text-slate-600 hover:text-slate-900 font-medium text-sm flex items-center gap-2">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-lavender-50">
                    <h2 className="text-lg font-semibold text-red-500 mb-4 flex items-center gap-2">
                        Danger Zone
                    </h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Deleting your account will permanently remove all your mood history, chat logs, and profile information.
                    </p>
                    <button
                        onClick={handleDeleteAccount}
                        className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                        <Trash2 size={18} /> Delete My Data
                    </button>
                </div>
            </div>
        </div>
    );
}
