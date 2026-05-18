import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { Loader2, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  FLUTTERWAVE_PUBLIC_KEY, generateTxRef, getReferralCode,
  ORG_NAME, ORG_LOGO
} from '@/lib/payment';

interface Props {
  amount: number;
  currency?: string;
  email: string;
  name: string;
  phone?: string;
  onSuccess: (txRef: string) => void;
  onClose?: () => void;
  disabled?: boolean;
}

const FlutterwaveButton = ({
  amount, currency = 'NGN', email, name, phone = '',
  onSuccess, onClose, disabled
}: Props) => {
  const referralCode = getReferralCode();

  const config = {
    public_key: FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: generateTxRef('EC-FLW'),
    amount,
    currency,
    payment_options: 'card,banktransfer,ussd,mobilemoney,barter',
    customer: { email, phone_number: phone, name },
    meta: {
      ...(referralCode ? { referral_code: referralCode } : {}),
      organisation: ORG_NAME,
      purpose: 'Humanitarian Donation',
    },
    customizations: {
      title: `${ORG_NAME} Donation`,
      description: 'Your gift transforms lives through health, education & empowerment.',
      logo: ORG_LOGO,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const pay = () => {
    handleFlutterPayment({
      callback: (response) => {
        closePaymentModal();
        if (response.status === 'successful' || response.status === 'completed') {
          onSuccess(response.tx_ref);
        }
      },
      onClose: () => onClose?.(),
    });
  };

  return (
    <Button
      variant="gold"
      size="lg"
      className="w-full flex items-center justify-center gap-2 text-base font-bold"
      onClick={pay}
      disabled={disabled || !email || !name}
    >
      {disabled
        ? <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
        : <><CreditCard className="h-5 w-5" /> Pay with Flutterwave</>
      }
    </Button>
  );
};

export default FlutterwaveButton;
