import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { toast } from 'sonner';

const TIERS = [
  { name: 'Unit Volunteer', amount: 10000 },
  { name: 'Ward Volunteer', amount: 10000 },
  { name: 'LGA Volunteer', amount: 50000 },
  { name: 'State Volunteer', amount: 100000 },
  { name: 'National Volunteer', amount: 500000 },
  { name: 'Continental Volunteer', amount: 1000000 },
  { name: 'International Volunteer', amount: 5000000 },
];

const VolunteerRegistrationForm = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [tier, setTier] = useState(TIERS[0].name);
  const [locationDetails, setLocationDetails] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const selectedTier = TIERS.find((t) => t.name === tier);

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      setLoading(true);
      // Update payment status to Paid
      const { error } = await supabase.from('volunteers').update({
        payment_status: 'Paid',
      }).eq('profile_id', user?.id);

      if (error) throw error;

      toast.success('Registration successful! Awaiting admin approval.');
      setStep(4); // Success step
    } catch (err: any) {
      toast.error(err.message || 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  const processRegistrationAndPay = async () => {
    try {
      setLoading(true);
      let currentPhotoUrl = photoUrl;

      // Upload photo if not already uploaded
      if (photoFile && user && !currentPhotoUrl) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${user.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('volunteer_photos')
          .upload(fileName, photoFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('volunteer_photos')
          .getPublicUrl(fileName);
        
        currentPhotoUrl = publicUrl;
        setPhotoUrl(currentPhotoUrl);
      }

      // Upsert volunteer record as Pending payment
      const { error } = await supabase.from('volunteers').upsert({
        profile_id: user?.id,
        tier: tier,
        payment_status: 'Pending',
        status: 'Pending',
        photo_url: currentPhotoUrl,
        location_context: { details: locationDetails }
      }, { onConflict: 'profile_id' });

      if (error) throw error;

      // Open Flutterwave payment modal
      handleFlutterPayment({
        callback: (response) => {
          closePaymentModal();
          if (response.status === 'successful') {
            handlePaymentSuccess(response);
          } else {
            toast.error('Payment was not successful.');
          }
        },
        onClose: () => {
          toast.info('Payment window closed.');
        },
      });

    } catch (err: any) {
      toast.error(err.message || 'Failed to initiate registration');
    } finally {
      setLoading(false);
    }
  };

  const config = {
    public_key: import.meta.env.VITE_FLW_PUBLIC_KEY || 'FLWPUBK_TEST-SANDBOX',
    tx_ref: Date.now().toString(),
    amount: selectedTier?.amount || 10000,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || '',
      phone_number: '',
      name: user?.name || '',
    },
    customizations: {
      title: 'Compassionate Action',
      description: `Payment for ${tier}`,
      logo: 'https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  if (!user) {
    return <div className="p-8 text-center bg-white rounded-lg shadow">Please log in to register as a volunteer.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-heading text-navy">Select Volunteer Tier</h2>
          <div className="space-y-3">
            {TIERS.map((t) => (
              <div 
                key={t.name}
                onClick={() => setTier(t.name)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${tier === t.name ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gold/50'}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-gold font-bold">₦{t.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={handleNext} className="w-full" variant="gold">Continue</Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-heading text-navy">Details & Photo</h2>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location Details (Ward/LGA/State)</Label>
            <Input 
              id="location" 
              value={locationDetails} 
              onChange={(e) => setLocationDetails(e.target.value)} 
              placeholder="e.g. Ward 3, Ikeja LGA, Lagos State"
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Profile Photo</Label>
            <Input 
              id="photo" 
              type="file" 
              accept="image/*" 
              onChange={handlePhotoChange} 
              required
            />
            <p className="text-sm text-gray-500">This photo will be displayed on the volunteer album after approval.</p>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleBack} variant="outline" className="w-full">Back</Button>
            <Button onClick={handleNext} className="w-full" variant="gold" disabled={!locationDetails || !photoFile}>Continue to Payment</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 text-center">
          <h2 className="text-2xl font-bold font-heading text-navy">Payment Summary</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-gray-600 mb-2">You are registering as:</p>
            <p className="text-xl font-bold text-navy mb-4">{tier}</p>
            <p className="text-gray-600 mb-2">Total Amount:</p>
            <p className="text-3xl font-bold text-gold">₦{selectedTier?.amount.toLocaleString()}</p>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleBack} variant="outline" className="w-full">Back</Button>
            <Button 
              className="w-full" 
              variant="gold"
              disabled={loading}
              onClick={processRegistrationAndPay}
            >
              {loading ? 'Processing...' : 'Pay with Flutterwave'}
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="text-center space-y-6 py-8">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-bold font-heading text-navy">Registration Received!</h2>
          <p className="text-gray-600">Your payment was successful and your application is awaiting admin approval.</p>
          <Button asChild variant="outline" className="mt-4">
            <a href="/volunteer/dashboard">Go to Dashboard</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default VolunteerRegistrationForm;
