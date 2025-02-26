import { useState } from 'react';
import { PaymentAPI } from '../api/payment';
import { generateReference } from '../utils/reference';
import type { CreatePaymentRequest } from '../types';

interface UsePaymentProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePayment({ onSuccess, onError }: UsePaymentProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (data: Omit<CreatePaymentRequest, 'reference_number'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await PaymentAPI.createPayment({
        ...data,
        reference_number: generateReference()
      });

      if (response.url) {
        window.location.href = response.url;
        onSuccess?.();
      } else {
        throw new Error('Invalid payment response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    loading,
    error,
    clearError: () => setError(null)
  };
}