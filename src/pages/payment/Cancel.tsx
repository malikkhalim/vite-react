import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Container } from '../../components/layout/Container';

export default function PaymentCancel() {
  const navigate = useNavigate();
  
  // Clear any pending payment data on cancel
  useEffect(() => {
    // Find and remove any pending payment data from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('hitpay_payment_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          // Only remove if status is pending
          if (data.status === 'pending') {
            localStorage.removeItem(key);
          }
        } catch (err) {
          // Ignore JSON parse errors
        }
      }
    });
  }, []);

  return (
    <Container className="py-16">
      <div className="max-w-lg mx-auto text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          Your payment has been cancelled. No charges have been made to your account.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
          >
            Return to Home
          </button>
          <div>
            <button
              onClick={() => navigate(-1)} // Go back to previous page
              className="text-sky-600 hover:underline"
            >
              Return to Checkout
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
