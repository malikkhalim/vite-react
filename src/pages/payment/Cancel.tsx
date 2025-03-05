import React, { useEffect } from 'react';
import { XCircle } from 'lucide-react';
import { Container } from '../../components/layout/Container';

export default function PaymentCancel() {
  useEffect(() => {
    // Clean up URL parameters
    if (window.location.search) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Clear the active payment session
    localStorage.removeItem('hitpay_active_session');
    localStorage.removeItem('hitpay_active_reference');
  }, []);
  
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
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Unsuccessful</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but your payment was not completed. No charges have been made to your account.
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
              className="text-sky-600 hover:underline"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}