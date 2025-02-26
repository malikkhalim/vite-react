import { useState, useEffect } from 'react';
import { PaymentAPI } from '../services/hitpay/api/payment';
import { PAYMENT_STATUS } from '../services/hitpay/config/constants';
import type { PaymentResponse } from '../services/hitpay/types';

interface UsePaymentStatusProps {
  paymentId: string;
  pollInterval?: number;
  onComplete?: () => void;
}

export function usePaymentStatus({ 
  paymentId, 
  pollInterval = 5000,
  onComplete 
}: UsePaymentStatusProps) {
  const [status, setStatus] = useState<keyof typeof PAYMENT_STATUS>(PAYMENT_STATUS.PENDING);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number;

    const checkStatus = async () => {
      try {
        const response = await PaymentAPI.getPaymentStatus(paymentId);
        setStatus(response.status);
        
        if (response.status === PAYMENT_STATUS.COMPLETED) {
          onComplete?.();
        } else if (response.status === PAYMENT_STATUS.PENDING) {
          timeoutId = window.setTimeout(checkStatus, pollInterval);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check payment status');
        setStatus(PAYMENT_STATUS.FAILED);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [paymentId, pollInterval, onComplete]);

  return {
    status,
    loading,
    error,
    isComplete: status === PAYMENT_STATUS.COMPLETED
  };
}