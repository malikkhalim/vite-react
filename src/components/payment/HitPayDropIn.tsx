import React, { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface HitPayDropInProps {
  paymentId: string;
  onSuccess: () => void;
  onClose: () => void;
  onError: (error: string) => void;
}

export function HitPayDropIn({
  paymentId,
  onSuccess,
  onClose,
  onError
}: HitPayDropInProps) {
  const initialized = useRef(false);

  useEffect(() => {
    // Load HitPay script
    const script = document.createElement('script');
    script.src = 'https://sandbox.hit-pay.com/hitpay.js';
    script.async = true;
    script.onload = initializeHitPay;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeHitPay = () => {
    if (!window.HitPay || initialized.current) return;

    window.HitPay.init(
      'https://securecheckout.sandbox.hit-pay.com/payment-request/@test-1/',
      {
        domain: 'sandbox.hit-pay.com',
        apiDomain: 'sandbox.hit-pay.com'
      },
      {
        onSuccess: (data: any) => {
          console.log('Payment successful:', data);
          onSuccess();
        },
        onClose: () => {
          console.log('Payment window closed');
          onClose();
        },
        onError: (error: string) => {
          console.error('Payment error:', error);
          onError(error);
        }
      }
    );

    initialized.current = true;
  };

  const handleShowDropIn = () => {
    if (!window.HitPay?.inited) {
      onError('Payment system not initialized');
      return;
    }

    window.HitPay.toggle({
      paymentRequest: paymentId
    });
  };

  return (
    <button
      onClick={handleShowDropIn}
      disabled={!window.HitPay?.inited}
      className="w-full bg-sky-600 text-white py-3 rounded-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {!window.HitPay?.inited ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Initializing...
        </>
      ) : (
        'Pay with Card'
      )}
    </button>
  );
}