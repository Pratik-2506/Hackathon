import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState(null);

    useEffect(() => {
        let mounted = true;

        const initSession = async () => {
            try {
                // 1. Check for URL Tokens first (Magic Link Landing)
                const isHash = window.location.hash && (
                    window.location.hash.includes('access_token') ||
                    window.location.hash.includes('type=magiclink')
                );

                if (isHash) {
                    console.log("Hash detected, prioritizing listener...");
                    // Do not 'return' here. We still want to let getSession() run 
                    // just in case, or at least fallback to the listener.
                }

                // 2. Normal Session Check
                const { data: { session } } = await supabase.auth.getSession();
                if (mounted) {
                    // Only update if we actually got a session. 
                    // If isHash is true but session is null, we wait for the listener event.
                    if (session) {
                        setSession(session);
                        if (session.user) {
                            await fetchProfile(session.user.id);
                        }
                    }
                    // Do NOT set loading to false yet if we suspect a hash is processing
                    if (!isHash) {
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error("Session init error:", error);
            } finally {
                // If NO hash, we are done. If Hash, wait for Listener.
                if (mounted && !window.location.hash.includes('access_token')) {
                    setLoading(false);
                }
            }
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (mounted) {
                setSession(session);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
                setLoading(false);
            }
        });

        // Safety timeout to prevent infinite white screen
        const timer = setTimeout(() => {
            if (mounted) setLoading(false);
        }, 3000);

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

            if (error) {
                // Handle "Row not found" (User exists in Auth but not in Profiles table)
                if (error.code === 'PGRST116') {
                    console.log("Profile missing, creating fallback...");
                    const newProfile = { id: userId, name: null, streak_count: 0 };

                    // Create missing profile
                    const { error: insertError } = await supabase.from('profiles').insert([newProfile]);

                    if (!insertError) {
                        setProfile(newProfile);
                        return;
                    }
                }
                console.error('Error fetching profile:', error);
                return;
            }

            if (data) {
                setProfile(data);
                checkStreak(data);
            }
        } catch (error) {
            console.error("Profile fetch error:", error);
        }
    };

    const checkStreak = async (profileData) => {
        if (!profileData) return;

        const now = new Date();
        const last = profileData.last_check_in ? new Date(profileData.last_check_in) : null;

        let newStreak = profileData.streak_count || 0;
        let shouldUpdate = false;

        if (!last) {
            newStreak = 1;
            shouldUpdate = true;
        } else {
            const lastDate = new Date(last);
            lastDate.setHours(0, 0, 0, 0);
            const nowDate = new Date(now);
            nowDate.setHours(0, 0, 0, 0);
            const diffTime = nowDate - lastDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays === 0) {
                // Same calendar day, already checked in, no update needed
                shouldUpdate = false;
            } else if (diffDays === 1) {
                // Streak continues (Yesterday -> Today)
                newStreak += 1;
                shouldUpdate = true;
            } else {
                // Missed a day or more -> Reset
                newStreak = 1;
                shouldUpdate = true;
            }
        }

        if (shouldUpdate) {
            const updates = {
                streak_count: newStreak,
                last_check_in: now.toISOString()
            };

            await supabase.from('profiles').update(updates).eq('id', profileData.id);
            setProfile({ ...profileData, ...updates }); // Optimistic update
        }
    };

    const value = {
        session,
        profile,
        user: session?.user,
        signOut: () => {
            // 1. Immediate Local Wipe (Don't wait for server)
            setSession(null);
            setProfile(null);
            localStorage.clear();
            sessionStorage.clear();

            // 2. Fire and forget Supabase cleanup (in background)
            supabase.auth.signOut();

            // 3. Instant Redirect
            window.location.href = '/login';
        },
        refreshProfile: () => {
            if (session?.user) fetchProfile(session.user.id);
        },
        loginWithGoogle: () => supabase.auth.signInWithOAuth({ provider: 'google' }),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : <div className="h-screen w-full flex items-center justify-center bg-offwhite text-lavender-500">Loading...</div>}
        </AuthContext.Provider>
    );
};
