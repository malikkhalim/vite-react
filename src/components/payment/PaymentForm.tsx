import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { PaymentSummary } from './PaymentSummary';
import { formatCurrency } from '../../utils/formatting';
import { HitPayCheckout } from './HitPayCheckout';
import { Flight, PassengerCount } from '../../types/flight';

interface PaymentFormProps {
  amount: number;
  passengers: PassengerCount;
  flightPrice: number;
  flight?: Flight;
  returnFlight: Flight | null;
  bookingCode?: string;
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
  flight,
  returnFlight,
  contactDetails,
  onSuccess
}: PaymentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');

  const handlePaymentSuccess = () => {
    onSuccess();
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Payment Summary */}
        <div className="md:col-span-2">
          <PaymentSummary
            amount={amount}
            passengers={passengers}
            flightPrice={flightPrice}
            flight={flight}
            returnFlight={returnFlight}
          />
        </div>

        {/* Right Column - Payment Method */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            <h3 className="text-lg font-semibold">Payment Method</h3>

            {/* Payment Method Selector
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`px-4 py-3 rounded-md text-center font-medium ${paymentMethod === 'card'
                    ? 'bg-sky-100 text-sky-700 border-2 border-sky-500'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
              >
                Credit Card
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`px-4 py-3 rounded-md text-center font-medium ${paymentMethod === 'bank'
                    ? 'bg-sky-100 text-sky-700 border-2 border-sky-500'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
              >
                Bank Transfer
              </button>
            </div> */}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-sky-600">
                {formatCurrency(amount)}
              </span>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 p-3 bg-red-50 rounded-md">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
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

            <div className="space-y-2 text-sm text-gray-500 mt-4">
              <div className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>Secure payment powered by HitPay</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>You will be redirected to HitPay's secure payment page</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>Your payment information is securely processed</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>Confirmation will be sent to your email</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">•</span>
                <span>You will be redirected to our payment processor for secure payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
