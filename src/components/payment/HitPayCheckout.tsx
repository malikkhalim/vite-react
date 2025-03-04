
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { HITPAY_CONFIG } from '../../config/hitpay';

interface HitPayCheckoutProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  referenceNumber?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function HitPayCheckout({
  amount,
  email,
  name,
  phone,
  referenceNumber,
  onSuccess,
  onError
}: HitPayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate reference number if not provided
      const reference = referenceNumber || 
        `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      // Prepare request data
      const origin = window.location.origin;
      const requestData = {
        amount: amount.toFixed(2),
        currency: HITPAY_CONFIG.CURRENCY,
        reference_number: reference,
        redirect_url: `${origin}${HITPAY_CONFIG.SUCCESS_URL}`,
        webhook: `${origin}${HITPAY_CONFIG.WEBHOOK_PATH}`,
        cancel_url: `${origin}${HITPAY_CONFIG.CANCEL_URL}`,
        payment_methods: ['card', 'paynow_online'],
        // Include API key in the body for the Vercel API route
        apiKey: HITPAY_CONFIG.API_KEY
      };
      
      // Add optional fields if they exist
      if (name) requestData.name = name;
      if (email) requestData.email = email;
      if (phone) requestData.phone = phone;
      
      // Make request to our Vercel API route (not directly to HitPay)
      const response = await fetch('/api/hitpay/payment-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      // Parse the response
      const data = await response.json();
      
      // Check for errors
      if (!response.ok) {
        throw new Error(data.error || data.message || `API error: ${response.status}`);
      }
      
      // Store payment info in localStorage for tracking
      localStorage.setItem(`hitpay_payment_${data.id || reference}`, JSON.stringify({
        id: data.id,
        reference: data.reference_number || reference,
        amount,
        timestamp: Date.now(),
        status: 'pending'
      }));
      
      // Redirect to the HitPay checkout URL
      if (data.url) {
        console.log('Redirecting to HitPay checkout:', data.url);
        window.location.href = data.url;
        onSuccess?.();
      } else {
        throw new Error('No payment URL received from HitPay');
      }
    } catch (err) {
      console.error('Payment creation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
          {error}
        </div>
      )}
      
      <button
        onClick={handlePayment}
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
    </div>
  );
}
