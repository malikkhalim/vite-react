import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { Container } from '../../components/layout/Container';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Get payment data from the URL
    const status = searchParams.get('status');
    const reference = searchParams.get('reference');
    const paymentId = searchParams.get('id');
    
    if (!reference && !paymentId) {
      navigate('/');
      return;
    }

    const verifyPayment = async () => {
      try {
        // For HitPay, status is returned in the URL
        if (status === 'completed') {
          setVerified(true);
          setPaymentData({
            reference,
            id: paymentId
          });
          
          // Store successful payment in localStorage to communicate between tabs
          localStorage.setItem('hitpay_payment_success', JSON.stringify({
            reference,
            id: paymentId,
            timestamp: Date.now()
          }));
        } else {
          // If status is not in URL, check localStorage (for mock sandbox)
          const storedData = localStorage.getItem('hitpay_payment_success');
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData.reference === reference || parsedData.id === paymentId) {
              setVerified(true);
              setPaymentData(parsedData);
            } else {
              setVerified(false);
            }
          } else {
            setVerified(false);
          }
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerified(false);
      } finally {
        setVerifying(false);
      }
    };

    // Add slight delay to simulate verification process
    setTimeout(verifyPayment, 1000);
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
            {paymentData && paymentData.reference && (
              <p className="text-sm font-mono bg-gray-100 p-2 rounded mb-6">
                Reference: {paymentData.reference}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Verification Failed</h2>
            <p className="text-gray-600 mb-6">
              We couldn't verify your payment. Please contact customer support if you believe this is an error.
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