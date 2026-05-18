// ─── Shared payment utilities ───────────────────────────────────────────────

/** Generate a unique transaction reference */
export const generateTxRef = (prefix = 'EC') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

/** Extract referral code from the current URL ?ref= param */
export const getReferralCode = (): string | null => {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
};

/** Approximate NGN → USD conversion (update rate as needed) */
export const ngnToUsd = (ngn: number, rate = 1600): number =>
  parseFloat((ngn / rate).toFixed(2));

/** Approximate NGN → USDC (stable, 1 USDC ≈ $1) */
export const ngnToUsdc = (ngn: number, rate = 1600): number =>
  parseFloat((ngn / rate).toFixed(4));

/** Format Nigerian Naira */
export const formatNgn = (amount: number) =>
  `₦${amount.toLocaleString('en-NG')}`;

// ─── Configuration (replace with your real keys before going live) ──────────

export const FLUTTERWAVE_PUBLIC_KEY =
  import.meta.env.VITE_FLW_PUBLIC_KEY || 'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X';

/** Your organisation's wallet address on the Base network */
export const BASE_WALLET_ADDRESS =
  import.meta.env.VITE_BASE_WALLET_ADDRESS || '0xYourBaseWalletAddressHere';

export const ORG_NAME = 'Enlighten Community';
export const ORG_LOGO = `${window.location.origin}/favicon.jpeg`;
