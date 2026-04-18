import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { paymentApi } from '../lib/api';
import { Button } from '../components/ui/button';

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [attempts, setAttempts] = useState(0);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    const pollPaymentStatus = async () => {
      try {
        const res = await paymentApi.getStatus(sessionId);
        const data = res.data;

        if (data.payment_status === 'paid') {
          setStatus('success');
          return;
        }

        if (data.status === 'expired') {
          setStatus('expired');
          return;
        }

        // Continue polling
        if (attempts < 10) {
          setTimeout(() => {
            setAttempts(prev => prev + 1);
          }, 2000);
        } else {
          setStatus('pending');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus('error');
      }
    };

    pollPaymentStatus();
  }, [sessionId, attempts]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" data-testid="payment-loading">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#E31E24] animate-spin mx-auto mb-4" />
          <p className="text-[#777777]">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" data-testid="payment-success">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-[2rem] p-8 lg:p-12 text-center">
            <div className="w-20 h-20 bg-[#34C759] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#111111] mb-4">
              Payment Successful!
            </h1>
            <p className="text-[#777777] mb-8">
              Thank you for your payment. Your repair appointment is confirmed. We'll send you a confirmation email shortly.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-[#E31E24] hover:bg-[#C01017] text-white rounded-full py-6"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center" data-testid="payment-status">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-[2rem] p-8 lg:p-12 text-center">
          <h1 className="font-display text-2xl font-bold text-[#111111] mb-4">
            {status === 'expired' ? 'Payment Expired' : 
             status === 'pending' ? 'Payment Pending' : 'Payment Error'}
          </h1>
          <p className="text-[#777777] mb-8">
            {status === 'expired' 
              ? 'Your payment session has expired. Please try again.'
              : status === 'pending'
              ? 'Your payment is still being processed. Please check your email for confirmation.'
              : 'There was an issue processing your payment. Please contact us for assistance.'}
          </p>
          <Button
            onClick={() => navigate('/')}
            className="w-full bg-[#E31E24] hover:bg-[#C01017] text-white rounded-full py-6"
          >
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
