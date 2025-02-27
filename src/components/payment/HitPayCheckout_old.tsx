import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { hitpayClient } from '../../services/hitpay/api/client';
import { HitPayError } from '../../services/hitpay/api/errors';
import { HITPAY_CONFIG } from '../../config/hitpay';

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

  const handlePayment = async () => {
    if (!HITPAY_CONFIG.API_KEY) {
      onError('Payment service is not configured');
      return;
    }

    setLoading(true);

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
        throw new HitPayError('Invalid payment response', 'RESPONSE_ERROR');
      }
    } catch (err) {
      console.error('Payment creation error:', err);
      const errorMessage = err instanceof HitPayError 
        ? err.message 
        : 'Failed to create payment';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || !HITPAY_CONFIG.API_KEY}
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
  );
}