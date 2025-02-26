import React, { useEffect, useState } from 'react';
import { PaymentService } from '../../services/hitpay/payment.service';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface PaymentStatusProps {
  paymentId: string;
  onComplete: () => void;
}

export function PaymentStatus({ paymentId, onComplete }: PaymentStatusProps) {
  const [status, setStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await PaymentService.getPaymentStatus(paymentId);
        setStatus(response.status);
        
        if (response.status === 'completed') {
          onComplete();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check payment status');
        setStatus('failed');
      }
    };

    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [paymentId, onComplete]);

  return (
    <div className="text-center p-8">
      {status === 'pending' && (
        <div className="space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-sky-600 mx-auto" />
          <p className="text-lg font-medium">Checking payment status...</p>
        </div>
      )}

      {status === 'completed' && (
        <div className="space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <p className="text-lg font-medium text-green-600">Payment successful!</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="space-y-4">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="text-lg font-medium text-red-600">Payment failed</p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </div>
  );
}