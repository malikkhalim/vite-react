import React from 'react';
import { AlertOctagon } from 'lucide-react';
import { Container } from '../../components/layout/Container';

export default function PaymentFailed() {
  // Get the referrer or previous page to enable going back
  const referrer = document.referrer || '/';
  
  // Return to previous page (payment page)
  const handleRetry = () => {
    window.location.href = referrer.includes('/payment') ? '/' : referrer;
  };
  
  // Return to home page
  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <Container className="py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertOctagon className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Apologies, Payment Unsuccessful</h2>
        <p className="text-gray-600 mb-6">
          We couldn't process your payment at this time. Your account has not been charged.
          This might be due to temporary issues with the payment system or your payment method.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
          >
            Retry Payment
          </button>
          
          <div>
            <button
              onClick={handleReturnHome}
              className="text-sky-600 hover:underline mt-4 block mx-auto"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}