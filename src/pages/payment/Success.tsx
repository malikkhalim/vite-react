import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { PaymentAPI } from '../../services/hitpay/api/payment';
import { Container } from '../../components/layout/Container';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const paymentId = searchParams.get('reference');
    if (!paymentId) {
      navigate('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        const status = await PaymentAPI.getPaymentStatus(paymentId);
        setVerified(status.status === 'completed');
      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerified(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <Container className="py-16">
      <div className="max-w-lg mx-auto text-center">
        {verifying ? (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </>
        ) : verified ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. You will receive a confirmation email shortly.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please try again or contact support if the problem persists.
            </p>
          </>
        )}

        <button
          onClick={() => navigate('/')}
          className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </Container>
  );
}