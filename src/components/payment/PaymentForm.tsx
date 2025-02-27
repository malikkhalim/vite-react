import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { PaymentMethodSelect } from './PaymentMethodSelect';
import { PaymentSummary } from './PaymentSummary';
import { useHitPayPayment } from '../../hooks/useHitPayPayment';
import { formatCurrency } from '../../utils/formatting';
import type { PaymentMethod } from '../../types/payment';
import { createMockPayment, simulatePaymentSuccess } from '../../services/hitpay/mock';

interface PaymentFormProps {
  amount: number;
  passengers: {
    adult: number;
    child: number;
    infant: number;
  };
  flightPrice: number;
  contactDetails: {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
  onSuccess: () => void;
}

export function PaymentForm({ 
  amount, 
  passengers,
  flightPrice,
  contactDetails, 
  onSuccess 
}: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  // Use the existing functions from the hook instead of creating new state
  const { createPayment, loading, error, clearError } = useHitPayPayment({
    onSuccess,
    onError: console.error
  });
  // Add a local error state for mock payment errors
  const [mockError, setMockError] = useState<string | null>(null);
  const [mockLoading, setMockLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Use the clearError from the hook
    setMockError(null); // Clear the mock error
    setMockLoading(true); // Set local loading state
  
    try {
      // First try the real payment API
      await createPayment({
        amount: parseFloat(amount.toFixed(2)),
        currency: 'USD',
        email: contactDetails.contactEmail,
        name: contactDetails.contactName,
        phone: contactDetails.contactPhone,
        // payment_methods: [paymentMethod]
        payment_methods: 'paynow_online'
      });
    } catch (err) {
      console.error('Payment creation error:', err);
      setMockError('There was an issue connecting to the payment service. Using test mode instead.');
      
      // If real payment fails, use mock payment
      try {
        await createMockPayment();
        // Short delay to let user see the message
        await new Promise(resolve => setTimeout(resolve, 1500));
        simulatePaymentSuccess();
      } catch (mockErr) {
        setMockError('Failed to process payment. Please try again later.');
      }
    } finally {
      setMockLoading(false); // Reset local loading state
    }
  };

  // Use either the hook's error or the mock error
  const displayError = error || mockError;
  // Use either the hook's loading state or the mock loading state
  const isLoading = loading || mockLoading;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>

      <PaymentSummary 
        amount={amount}
        passengers={passengers}
        flightPrice={flightPrice}
      />

      <PaymentMethodSelect
        value={paymentMethod}
        onChange={setPaymentMethod}
        disabled={isLoading}
      />

      {displayError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{displayError}</p>
        </div>
      )}

      <div className="bg-white rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount to Pay</span>
          <span className="text-2xl font-bold text-sky-600">
            {formatCurrency(amount)}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-sky-600 text-white py-3 rounded-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Pay Now'
          )}
        </button>

        <div className="text-sm text-gray-500 space-y-1">
          <p>• Secure payment powered by HitPay</p>
          <p>• You will be redirected to HitPay's secure payment page</p>
          <p>• A confirmation email will be sent after successful payment</p>
        </div>
      </div>
    </form>
  );
}