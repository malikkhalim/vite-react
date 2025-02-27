import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { PaymentMethodSelect } from './PaymentMethodSelect';
import { PaymentSummary } from './PaymentSummary';
import { useHitPayPayment } from '../../hooks/useHitPayPayment';
import { formatCurrency } from '../../utils/formatting';
import type { PaymentMethod } from '../../types/payment';

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const { createPayment, loading, error } = useHitPayPayment({
    onSuccess,
    onError: console.error
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createPayment({
      amount: Number(amount.toFixed(2)),
      currency: 'USD',
      email: contactDetails.contactEmail,
      name: contactDetails.contactName,
      phone: contactDetails.contactPhone,
      payment_methods: [paymentMethod]
    });
  };

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
        disabled={loading}
      />

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
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

        <div className="text-sm text-gray-500 space-y-1">
          <p>• Secure payment powered by HitPay</p>
          <p>• You will be redirected to HitPay's secure payment page</p>
          <p>• A confirmation email will be sent after successful payment</p>
        </div>
      </div>
    </form>
  );
}