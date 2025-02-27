import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { hitpayClient } from '../../../services/hitpay/api/client';
import { HITPAY_CONFIG } from '../../../config/hitpay';

interface HitPayCheckoutProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  referenceNumber: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function HitPayCheckout({
  amount,
  email,
  name,
  phone,
  referenceNumber,
  onSuccess,
  onError
}: HitPayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    if (!HITPAY_CONFIG.API_KEY) {
      onError('Payment service is not configured');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await hitpayClient.createPayment({
        amount: amount.toFixed(2),
        currency: HITPAY_CONFIG.CURRENCY,
        email,
        name,
        phone,
        reference_number: referenceNumber
      });

      if (response.url) {
        window.location.href = response.url;
        onSuccess();
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (err) {
      console.error('Payment creation error:', err);
      const message = err instanceof Error ? err.message : 'Failed to create payment';
      setErrorMessage(message);
      onError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {errorMessage}
        </div>
      )}
      
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-sky-600 text-white py-3 rounded-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </button>
    </div>
  );
}