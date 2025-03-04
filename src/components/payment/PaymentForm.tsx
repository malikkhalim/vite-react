import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { PaymentSummary } from './PaymentSummary';
import { formatCurrency } from '../../utils/formatting';
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
  const [error, setError] = useState<string | null>(null);

  const handlePaymentSuccess = () => {
    onSuccess();
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>

      <PaymentSummary
        amount={amount}
        passengers={passengers}
        flightPrice={flightPrice}
      />

      <div className="bg-white rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600">Total Amount to Pay</span>
          <span className="text-2xl font-bold text-sky-600">
            {formatCurrency(amount)}
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        <HitPayCheckout
          amount={Number(amount.toFixed(2))}
          email={contactDetails.contactEmail}
          name={contactDetails.contactName}
          phone={contactDetails.contactPhone}
          referenceNumber={`BOOK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />

        <div className="text-sm text-gray-500 space-y-1 mt-4">
          <p>• Secure payment powered by HitPay</p>
          <p>• You will be redirected to HitPay's secure payment page</p>
          <p>• A confirmation email will be sent after successful payment</p>
        </div>
      </div>
    </div>
  );
}