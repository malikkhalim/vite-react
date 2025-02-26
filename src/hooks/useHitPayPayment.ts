import { useState, useCallback } from 'react';
import { hitpayClient } from '../services/hitpay/api/client';
import { HitPayError } from '../services/hitpay/api/errors';
import type { CreatePaymentRequest } from '../services/hitpay/types';

interface UseHitPayPaymentProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useHitPayPayment({ onSuccess, onError }: UseHitPayPaymentProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(async (data: Omit<CreatePaymentRequest, 'reference_number'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await hitpayClient.createPayment({
        ...data,
        reference_number: `PAY-${Date.now()}`
      });

      if (response.url) {
        // Small delay to ensure state updates complete
        await new Promise(resolve => setTimeout(resolve, 100));
        window.location.href = response.url;
        onSuccess?.();
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (err) {
      const errorMessage = err instanceof HitPayError 
        ? err.message 
        : 'Payment failed. Please try again.';
      
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onSuccess, onError]);

  return {
    createPayment,
    loading,
    error,
    clearError: () => setError(null)
  };
}