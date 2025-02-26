import { useState } from 'react';
import { PaymentMethod, PaymentDetails } from '../types/payment';
import { generatePaymentReference } from '../utils/payment';

export function usePayment(amount: number, onComplete: (details: PaymentDetails) => void) {
  const [method, setMethod] = useState<PaymentMethod>('credit_card');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (formData: any) => {
    setError(null);
    setIsProcessing(true);

    try {
      // In a real app, this would make an API call to process payment
      const paymentDetails: PaymentDetails = {
        method,
        amount,
        currency: 'USD',
        reference: generatePaymentReference()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onComplete(paymentDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    method,
    setMethod,
    error,
    isProcessing,
    handleSubmit
  };
}