import { supabase } from './supabase';
import { ngnToUsd } from './payment';
import type { Donation } from './database.types';

/** Record a donation in Supabase */
export const recordDonation = async (opts: {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  amountNgn: number;
  method: 'flutterwave' | 'crypto';
  txRef: string;
  referrerCode?: string | null;
}): Promise<Donation | null> => {
  let referrerId: string | null = null;

  // Resolve referrer code to a profile ID
  if (opts.referrerCode) {
    const { data: referrer } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', opts.referrerCode)
      .single();
    if (referrer) referrerId = referrer.id;
  }

  const { data, error } = await supabase
    .from('donations')
    .insert({
      donor_name: opts.donorName,
      donor_email: opts.donorEmail,
      donor_phone: opts.donorPhone || '',
      amount_ngn: opts.amountNgn,
      amount_usd: ngnToUsd(opts.amountNgn),
      method: opts.method,
      tx_ref: opts.txRef,
      referrer_id: referrerId,
      status: 'completed',
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to record donation:', error.message);
    return null;
  }

  return data as Donation;
};

/** Get donations attributed to a specific referrer */
export const getDonationsByReferrer = async (referrerId: string): Promise<Donation[]> => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('referrer_id', referrerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch referrer donations:', error.message);
    return [];
  }

  return (data || []) as Donation[];
};

/** Get aggregated referral stats for the volunteer dashboard */
export const getReferralStats = async (userId: string) => {
  // 1. People referred (direct referrals)
  const { count: referralCount } = await supabase
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', userId);

  // 2. Donations mobilized through this user's referral code
  const { data: donations } = await supabase
    .from('donations')
    .select('amount_ngn')
    .eq('referrer_id', userId);

  const totalDonations = (donations || []).reduce(
    (sum, d) => sum + Number(d.amount_ngn), 0
  );

  // 3. Rewards: 5% of donations mobilized (50% of the 10% pool)
  const rewards = totalDonations * 0.05;

  // 4. Lives impacted (rough metric: 1 per ₦5,000 donated)
  const livesImpacted = Math.floor(totalDonations / 5000);

  return {
    peopleReferred: referralCount || 0,
    donationsMobilized: totalDonations,
    rewards,
    livesImpacted,
  };
};
