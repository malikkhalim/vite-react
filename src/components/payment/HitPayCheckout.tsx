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
  
  // Generate a session ID to track this payment attempt
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  };
  
  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate reference number if not provided
      const reference = referenceNumber || 
        `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      // Create a session ID for this payment attempt
      const sessionId = generateSessionId();
      
      // Store payment information in session storage with the session ID
      const paymentData = {
        id: sessionId,
        reference,
        amount,
        name,
        email,
        phone,
        timestamp: Date.now(),
        status: 'pending'
      };
      
      // Save payment data to localStorage
      localStorage.setItem(`hitpay_payment_${reference}`, JSON.stringify(paymentData));
      
      // Also save the active session ID to easily retrieve the current payment
      localStorage.setItem('hitpay_active_session', sessionId);
      localStorage.setItem('hitpay_active_reference', reference);
      
      // Check if we should use the direct form approach as a fallback
      const useFallback = !HITPAY_CONFIG.API_KEY || 
                         process.env.NODE_ENV === 'development';
                         
      if (useFallback) {
        // Use the direct form approach instead
        submitDirectForm(reference, sessionId);
        return;
      }
      
      // Prepare request data
      const origin = window.location.origin;
      const requestData = {
        amount: amount.toFixed(2),
        currency: HITPAY_CONFIG.CURRENCY,
        reference_number: reference,
        redirect_url: `${origin}${HITPAY_CONFIG.SUCCESS_URL}?session=${sessionId}`,
        webhook: `${origin}${HITPAY_CONFIG.WEBHOOK_PATH}`,
        cancel_url: `${origin}${HITPAY_CONFIG.CANCEL_URL}?session=${sessionId}`,
        payment_methods: ['card', 'paynow_online'],
        // Include API key in the body for the Vercel API route
        apiKey: HITPAY_CONFIG.API_KEY
      };
      
      // Add optional fields if they exist
      if (name) requestData.name = name;
      if (email) requestData.email = email;
      if (phone) requestData.phone = phone;
      
      console.log('Sending payment request to:', `${origin}/api/hitpay/payment-requests`);
      
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
      
      // Update payment info with hitpay payment ID
      if (data.id) {
        const updatedPaymentData = {
          ...paymentData,
          hitpay_id: data.id
        };
        localStorage.setItem(`hitpay_payment_${reference}`, JSON.stringify(updatedPaymentData));
      }
      
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
      
      // Try the fallback method if API fails
      if (confirm('Payment service error. Would you like to try an alternative payment method?')) {
        const reference = referenceNumber || 
          `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const sessionId = generateSessionId();
        submitDirectForm(reference, sessionId);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Fallback approach using direct form submission
  const submitDirectForm = (reference: string, sessionId: string) => {
    // Create a form element
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://securecheckout.sandbox.hit-pay.com/payment-request';
    form.style.display = 'none';
    
    // Add form fields
    const origin = window.location.origin;
    const formFields = {
      'api_key': HITPAY_CONFIG.API_KEY,
      'amount': amount.toFixed(2),
      'currency': HITPAY_CONFIG.CURRENCY,
      'reference_number': reference,
      'redirect_url': `${origin}${HITPAY_CONFIG.SUCCESS_URL}?session=${sessionId}`,
      'webhook': `${origin}${HITPAY_CONFIG.WEBHOOK_PATH}`,
      'cancel_url': `${origin}${HITPAY_CONFIG.CANCEL_URL}?session=${sessionId}`
    };
    
    // Add optional fields
    if (name) formFields['name'] = name;
    if (email) formFields['email'] = email;
    if (phone) formFields['phone'] = phone;
    
    // Create form inputs
    Object.entries(formFields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    
    // Submit the form
    document.body.appendChild(form);
    form.submit();
    
    // Optional callback
    onSuccess?.();
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