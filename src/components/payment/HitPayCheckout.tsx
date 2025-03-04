import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { createPayment, mockCreatePayment } from '../../services/hitpay/api-client';
import { HITPAY_CONFIG } from '../../config/hitpay';

interface HitPayCheckoutProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  referenceNumber?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
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
  const [error, setError] = useState<string | null>(null);
  
  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use mock in development if configured
      const useMock = HITPAY_CONFIG.DEV_MOCK && process.env.NODE_ENV === 'development';
      
      // Create the payment request (real or mock)
      const paymentFunction = useMock ? mockCreatePayment : createPayment;
      const response = await paymentFunction({
        amount,
        email,
        name,
        phone,
        reference_number: referenceNumber,
        payment_methods: ['card', 'paynow_online']
      });
      
      // Store payment tracking info
      localStorage.setItem(`hitpay_payment_${response.id}`, JSON.stringify({
        id: response.id,
        reference: response.reference_number,
        amount,
        timestamp: Date.now(),
        status: 'pending'
      }));
      
      // Redirect to the checkout URL
      if (response.url) {
        console.log('Redirecting to HitPay checkout:', response.url);
        window.location.href = response.url;
        onSuccess?.();
      } else {
        throw new Error('Invalid payment URL received');
      }
      
    } catch (err) {
      console.error('Payment creation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
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
      
      {HITPAY_CONFIG.DEV_MOCK && process.env.NODE_ENV === 'development' && (
        <div className="mt-2 text-xs text-center text-gray-500">
          Using mock in development mode
        </div>
      )}
    </div>
  );
}