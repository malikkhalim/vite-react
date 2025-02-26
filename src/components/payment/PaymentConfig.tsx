import React from 'react';
import { HitPayCheckout } from './HitPayCheckout';
import { formatCurrency } from '../../utils/formatting';

interface PaymentConfigProps {
  amount: number;
  contactDetails: {
    name: string;
    email: string;
    phone: string;
  };
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentConfig({ amount, contactDetails, onSuccess, onError }: PaymentConfigProps) {
  const generateReference = () => {
    return `FLIGHT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount to Pay</span>
            <span className="text-xl font-bold text-sky-600">{formatCurrency(amount)}</span>
          </div>

          <HitPayCheckout
            amount={amount}
            email={contactDetails.email}
            name={contactDetails.name}
            phone={contactDetails.phone}
            referenceNumber={generateReference()}
            onSuccess={onSuccess}
            onError={onError}
          />

          <div className="text-sm text-gray-500 space-y-1">
            <p>• Secure payment powered by HitPay</p>
            <p>• You will be redirected to HitPay's secure payment page</p>
            <p>• A confirmation email will be sent after successful payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}