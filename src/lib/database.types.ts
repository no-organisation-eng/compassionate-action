// ─── Database type definitions matching the Supabase schema ─────────────────

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  country: string;
  state: string;
  referral_code: string;
  referred_by: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface Volunteer {
  id: string;
  profile_id: string;
  tier: string;
  status: string;
  payment_status: string;
  photo_url: string | null;
  is_executive: boolean;
  location_context: any;
  created_at: string;
  updated_at: string;
  // Joined fields
  profiles?: Profile;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  // Joined fields
  profiles?: Profile;
  comments?: Comment[];
  likes?: Like[];
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  // Joined fields
  profiles?: Profile;
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount_ngn: number;
  amount_usd: number | null;
  method: 'flutterwave' | 'crypto';
  tx_ref: string;
  referrer_id: string | null;
  status: string;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  created_at: string;
  // Joined fields
  referred_profile?: Profile;
}
