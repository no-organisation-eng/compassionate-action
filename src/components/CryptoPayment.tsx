import { useState } from 'react';
import { Copy, CheckCircle2, ExternalLink, AlertCircle, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BASE_WALLET_ADDRESS, ngnToUsdc, formatNgn } from '@/lib/payment';
import { toast } from 'sonner';

interface Props {
  amountNgn: number;
  donorName: string;
  onConfirm: (txHash: string) => void;
}

const STEPS = [
  { n: 1, text: 'Open MetaMask, Coinbase Wallet, or any Base-compatible wallet.' },
  { n: 2, text: 'Switch your network to Base (Ethereum L2 by Coinbase). If you don\'t have it, add it at chainlist.org — Chain ID: 8453.' },
  { n: 3, text: 'Send USDC (or ETH) to the address below. USDC on Base is preferred for stable value.' },
  { n: 4, text: 'Copy your transaction hash from your wallet and paste it below to confirm.' },
];

const CryptoPayment = ({ amountNgn, donorName, onConfirm }: Props) => {
  const [copied, setCopied] = useState(false);
  const [txHash, setTxHash] = useState('');
  const usdcAmount = ngnToUsdc(amountNgn);

  // QR code via free public API (no npm package needed)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(BASE_WALLET_ADDRESS)}&bgcolor=ffffff&color=1a2f5e`;

  const copyAddress = () => {
    navigator.clipboard.writeText(BASE_WALLET_ADDRESS);
    setCopied(true);
    toast.success('Wallet address copied!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirm = () => {
    if (!txHash.trim()) { toast.error('Please enter your transaction hash.'); return; }
    if (!txHash.startsWith('0x') || txHash.length < 60) {
      toast.error('That doesn\'t look like a valid transaction hash. It should start with 0x and be 66 characters long.');
      return;
    }
    onConfirm(txHash.trim());
  };

  return (
    <div className="space-y-6">
      {/* Amount banner */}
      <div className="bg-navy rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-gold-light/60 text-xs font-semibold uppercase tracking-wider">Donation Amount</p>
          <p className="text-gold font-mono font-extrabold text-2xl mt-0.5">{formatNgn(amountNgn)}</p>
          <p className="text-gold-light/60 text-xs mt-0.5">≈ {usdcAmount} USDC on Base</p>
        </div>
        <Coins className="h-10 w-10 text-gold/30" />
      </div>

      {/* Network badge */}
      <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
        <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Base Network (Ethereum L2 · Chain ID 8453)</span>
        <a href="https://base.org" target="_blank" rel="noopener noreferrer" className="ml-auto">
          <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
        </a>
      </div>

      {/* Wallet address + QR */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-4">
        <h4 className="font-heading font-bold text-navy dark:text-gold-light text-sm">Send USDC / ETH to this address on Base:</h4>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <img src={qrUrl} alt="Base wallet QR" className="h-44 w-44 rounded-xl border border-border shadow-md shrink-0" />
          <div className="flex-1 space-y-3 w-full">
            <div className="bg-secondary/50 rounded-lg p-3 font-mono text-xs break-all text-navy dark:text-gold-light leading-relaxed border border-border">
              {BASE_WALLET_ADDRESS}
            </div>
            <Button variant="gold" onClick={copyAddress} className="w-full flex items-center gap-2">
              {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Wallet Address'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Accepted: <span className="font-semibold">USDC</span> · <span className="font-semibold">ETH</span> on Base only
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-step guide */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <h4 className="font-heading font-bold text-navy dark:text-gold-light text-sm">How to pay with crypto:</h4>
        <div className="space-y-2">
          {STEPS.map(s => (
            <div key={s.n} className="flex gap-3 items-start text-xs text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-white text-[10px] font-bold shrink-0 mt-0.5">{s.n}</span>
              <span className="leading-relaxed">{s.text}</span>
            </div>
          ))}
        </div>
        <a href="https://www.coinbase.com/wallet" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gold hover:underline font-semibold mt-1">
          <ExternalLink className="h-3 w-3" /> Don't have a wallet? Get Coinbase Wallet →
        </a>
      </div>

      {/* Warning */}
      <div className="flex gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2.5 text-xs text-amber-700 dark:text-amber-400">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <span>Send only on the <strong>Base network</strong>. Sending on Ethereum mainnet or other chains may result in permanent loss of funds.</span>
      </div>

      {/* TX Hash confirmation */}
      <div className="bg-card rounded-xl border border-border p-5 space-y-3">
        <h4 className="font-heading font-bold text-navy dark:text-gold-light text-sm">Confirm your payment</h4>
        <p className="text-xs text-muted-foreground">After sending, paste your transaction hash (TX ID) here so we can verify and acknowledge your donation.</p>
        <Input
          placeholder="0x... (your transaction hash)"
          value={txHash}
          onChange={e => setTxHash(e.target.value)}
          className="font-mono text-xs"
        />
        <Button variant="default" className="w-full" onClick={handleConfirm} disabled={!txHash.trim()}>
          Confirm Crypto Donation
        </Button>
        <a href={`https://basescan.org/address/${BASE_WALLET_ADDRESS}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-xs text-gold hover:underline font-semibold">
          <ExternalLink className="h-3 w-3" /> View wallet on BaseScan →
        </a>
      </div>
    </div>
  );
};

export default CryptoPayment;
