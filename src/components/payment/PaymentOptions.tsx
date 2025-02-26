import React, { useState } from 'react';
import { HitPayCheckout } from './HitPayCheckout';
import { HitPayDropIn } from './HitPayDropIn';
import { PaymentAPI } from '../../services/hitpay/api/payment';
import { HITPAY_CONFIG } from '../../config/hitpay';

interface PaymentOptionsProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PaymentOptions({
  amount,
  email,
  name,
  phone,
  onSuccess,
  onError
}: PaymentOptionsProps) {
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreatePayment = async () => {
    if (!HITPAY_CONFIG.API_KEY) {
      onError('Payment service not configured');
      return;
    }

    setLoading(true);
    try {
      const response = await PaymentAPI.createPayment({
        amount: amount.toFixed(2),
        currency: HITPAY_CONFIG.CURRENCY,
        email,
        name,
        phone,
        reference_number: `PAY-${Date.now()}`
      });

      setPaymentId(response.id);
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Pay with PayNow</h3>
          <HitPayCheckout
            amount={amount}
            email={email}
            name={name}
            phone={phone}
            referenceNumber={`PAYNOW-${Date.now()}`}
            onSuccess={onSuccess}
            onError={onError}
          />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Pay with Card</h3>
          {paymentId ? (
            <HitPayDropIn
              paymentId={paymentId}
              onSuccess={onSuccess}
              onClose={() => setPaymentId(null)}
              onError={onError}
            />
          ) : (
            <button
              onClick={handleCreatePayment}
              disabled={loading}
              className="w-full bg-sky-600 text-white py-3 rounded-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Initializing...' : 'Pay with Card'}
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500 space-y-1">
        <p>• Secure payment powered by HitPay</p>
        <p>• PayNow: Scan QR code with your banking app</p>
        <p>• Card: Pay securely with credit/debit card</p>
      </div>
    </div>
  );
}