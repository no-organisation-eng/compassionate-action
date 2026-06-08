import { supabase } from './supabase';
import type { Profile } from './database.types';

// ─── Public User type (what the rest of the app consumes) ───────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  country: string;
  state: string;
  joinDate: string;
  avatar: string;
  referralCode: string;
  isAdmin: boolean;
}

/** Convert a Supabase profile row into the app's User shape */
export const profileToUser = (p: Profile): User => ({
  id: p.id,
  name: p.name,
  email: p.email,
  bio: p.bio,
  country: p.country,
  state: p.state,
  joinDate: p.created_at,
  avatar: p.avatar,
  referralCode: p.referral_code,
  isAdmin: !!p.is_admin,
});

/** Get the currently authenticated user + their profile */
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!profile) return null;
  return profileToUser(profile as Profile);
};

/** Register a new user */
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  country = '',
  state = '',
  referrerCode?: string | null,
): Promise<User> => {
  // 1. Sign up via Supabase Auth (the DB trigger creates the profile row)
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { name: name.trim(), country, state },
    },
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Registration failed. Please try again.');

  // 2. If there's a referrer code, link the referral
  if (referrerCode) {
    const { data: referrer } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', referrerCode)
      .single();

    if (referrer) {
      // Update the new user's referred_by field
      await supabase
        .from('profiles')
        .update({ referred_by: referrer.id })
        .eq('id', data.user.id);

      // Create a referral record
      await supabase
        .from('referrals')
        .insert({ referrer_id: referrer.id, referred_id: data.user.id });
    }
  }

  // 3. Fetch the created profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (!profile) throw new Error('Profile creation failed. Please try again.');
  return profileToUser(profile as Profile);
};

/** Log in an existing user */
export const loginUser = async (email: string, password: string): Promise<User> => {
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

  if (!profile) throw new Error('Profile not found.');
  return profileToUser(profile as Profile);
};

/** Log out */
export const logoutUser = async (): Promise<void> => {
  await supabase.auth.signOut();
};

/** Get total member count */
export const getMemberCount = async (): Promise<number> => {
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  return count || 0;
};
