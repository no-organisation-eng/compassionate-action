import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, profileToUser } from '@/lib/auth';
import type { Profile } from '@/lib/database.types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, country: string, state: string, referrerCode?: string | null) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes and fetch profile
  useEffect(() => {
    // Check initial session
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) setUser(profileToUser(profile as Profile));
      }
      setLoading(false);
    };

    initSession();

    // Subscribe to auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Small delay to allow the DB trigger to create the profile
          await new Promise(r => setTimeout(r, 500));
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profile) setUser(profileToUser(profile as Profile));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => { subscription.unsubscribe(); };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login failed. Please try again.');

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (profile) setUser(profileToUser(profile as Profile));
  };

  // Strip any character outside ISO-8859-1 range so the browser fetch API
  // doesn't throw "String contains non ISO-8859-1 code point" when Supabase
  // serialises user_metadata into request headers.
  const toSafeAscii = (str: string) =>
    str.replace(/[^\x00-\xFF]/g, '').trim();

  const register = async (
    name: string, email: string, password: string,
    country: string, state: string, referrerCode?: string | null,
  ) => {
    const safeName    = toSafeAscii(name);
    const safeCountry = toSafeAscii(country);
    const safeState   = toSafeAscii(state);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name: safeName, country: safeCountry, state: safeState },
      },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Registration failed. Please try again.');

    // Handle referral linking
    if (referrerCode) {
      // Wait a moment for the trigger to create the profile
      await new Promise(r => setTimeout(r, 800));

      const { data: referrer } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', referrerCode)
        .single();

      if (referrer) {
        await supabase
          .from('profiles')
          .update({ referred_by: referrer.id })
          .eq('id', data.user.id);

        await supabase
          .from('referrals')
          .insert({ referrer_id: referrer.id, referred_id: data.user.id });
      }
    }

    // Fetch profile
    await new Promise(r => setTimeout(r, 500));
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (profile) setUser(profileToUser(profile as Profile));
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
