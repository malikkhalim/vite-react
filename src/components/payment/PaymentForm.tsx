import React, { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { PaymentMethodSelect } from './PaymentMethodSelect';
import { PaymentSummary } from './PaymentSummary';
import { useHitPayPayment } from '../../hooks/useHitPayPayment';
import { formatCurrency } from '../../utils/formatting';
import type { PaymentMethod } from '../../types/payment';
import { HitPayCheckout } from './HitPayCheckout';

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
  const [showHitPayCheckout, setShowHitPayCheckout] = useState(false);
  const { loading, error } = useHitPayPayment({
    onSuccess,
    onError: console.error
  });

  const handlePaymentSuccess = () => {
    onSuccess();
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHitPayCheckout(true);
  };

  const referenceNumber = `BOOK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>

      <PaymentSummary
        amount={amount}
        passengers={passengers}
        flightPrice={flightPrice}
      />

      {/* Payment method selection is commented out as per original code */}
      {/* <PaymentMethodSelect
        value={paymentMethod}
        onChange={setPaymentMethod}
        disabled={loading}
      /> */}

      {showHitPayCheckout && (
        <HitPayCheckout
          amount={Number(amount.toFixed(2))}
          email={contactDetails.contactEmail}
          name={contactDetails.contactName}
          phone={contactDetails.contactPhone}
          referenceNumber={referenceNumber}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}

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
          disabled={loading || showHitPayCheckout}
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