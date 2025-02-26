import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { HitPayCheckout } from '../payment/HitPayCheckout';
import type { CargoSummary } from '../../types/cargo';

interface CargoCheckoutProps {
  summary: CargoSummary;
  onSubmit: () => void;
}

export function CargoCheckout({ summary, onSubmit }: CargoCheckoutProps) {
  const [error, setError] = useState<string | null>(null);

  const handlePaymentSuccess = () => {
    onSubmit();
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        {/* Payment Method */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-sky-600">
                ${summary.totalAmount.toFixed(2)}
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 mb-4">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}

            <HitPayCheckout
              amount={summary.totalAmount}
              email={summary.contactDetails.shipper.email}
              name={summary.contactDetails.shipper.contactPerson}
              phone={summary.contactDetails.shipper.phone}
              referenceNumber={`CARGO-${Math.random().toString(36).substring(2, 10).toUpperCase()}`}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}