import React, { useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface HitPayMockSandboxProps {
  amount: number;
  currency: string;
  reference: string;
  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Mock sandbox for local testing of HitPay payment flow without actual API calls.
 * This component simulates the HitPay checkout experience for development.
 */
export function HitPayMockSandbox({
  amount,
  currency,
  reference,
  onSuccess,
  onCancel
}: HitPayMockSandboxProps) {
  const [paymentState, setPaymentState] = useState<'initial' | 'processing' | 'success' | 'failed'>('initial');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      alert('Please fill in all card details');
      return;
    }
    
    // Simulate payment processing
    setPaymentState('processing');
    
    // Simulate processing delay
    setTimeout(() => {
      // Simulate success for card number ending in 4242, failure for 4444
      if (cardNumber.endsWith('4242')) {
        setPaymentState('success');
        // Store success in localStorage to simulate redirect
        localStorage.setItem('hitpay_payment_success', JSON.stringify({
          reference,
          timestamp: Date.now()
        }));
        // Wait a moment to show success before calling callback
        setTimeout(() => onSuccess(), 1500);
      } else if (cardNumber.endsWith('4444')) {
        setPaymentState('failed');
      } else {
        // Random success/failure for other card numbers
        const success = Math.random() > 0.3;
        setPaymentState(success ? 'success' : 'failed');
        if (success) {
          localStorage.setItem('hitpay_payment_success', JSON.stringify({
            reference,
            timestamp: Date.now()
          }));
          setTimeout(() => onSuccess(), 1500);
        }
      }
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">HitPay Sandbox Checkout</h2>
          <p className="text-sm text-gray-500">This is a mock payment page for development</p>
        </div>

        {paymentState === 'initial' && (
          <>
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold">{currency} {amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reference:</span>
                <span className="font-mono text-sm">{reference}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="4242 4242 4242 4242"
                    className="pl-10 w-full p-2 border border-gray-300 rounded"
                    maxLength={19}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Try 4242 4242 4242 4242 for success, 4444 4444 4444 4444 for failure
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    className="w-full p-2 border border-gray-300 rounded"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    className="w-full p-2 border border-gray-300 rounded"
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Name on card"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Pay {currency} {amount.toFixed(2)}
                </button>
              </div>
            </form>
          </>
        )}

        {paymentState === 'processing' && (
          <div className="text-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-xl font-medium">Processing Payment...</p>
            <p className="text-gray-500">Please do not close this window</p>
          </div>
        )}

        {paymentState === 'success' && (
          <div className="text-center py-10">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-xl font-medium text-green-600">Payment Successful!</p>
            <p className="text-gray-500 mb-6">Thank you for your payment</p>
            <p className="text-xs text-gray-400">Redirecting back to merchant...</p>
          </div>
        )}

        {paymentState === 'failed' && (
          <div className="text-center py-10">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <p className="text-xl font-medium text-red-600">Payment Failed</p>
            <p className="text-gray-500 mb-6">Your payment could not be processed</p>
            <button
              onClick={() => setPaymentState('initial')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}