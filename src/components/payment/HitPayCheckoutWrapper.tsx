import React, { useState, useEffect } from 'react';
import { HitPayCheckout } from './HitPayCheckout';
import { HitPayMockSandbox } from './HitPayMockSandbox';
import { HITPAY_CONFIG } from '../../config/hitpay';

interface HitPayCheckoutWrapperProps {
  amount: number;
  email: string;
  name: string;
  phone: string;
  referenceNumber?: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

/**
 * A wrapper component that provides both direct HitPay integration
 * and a mock sandbox for local development.
 */
export function HitPayCheckoutWrapper({
  amount,
  email,
  name,
  phone,
  referenceNumber,
  onSuccess,
  onError
}: HitPayCheckoutWrapperProps) {
  // State to track if we should use mock sandbox
  const [useMockSandbox, setUseMockSandbox] = useState(false);
  // Generate reference number if not provided
  const [ref] = useState(referenceNumber || `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  // Track if mock sandbox is visible
  const [showMockSandbox, setShowMockSandbox] = useState(false);

  // Determine if we should use mock sandbox based on environment and config
  useEffect(() => {
    // Use mock sandbox in development mode and when configured
    const shouldUseMock = 
      process.env.NODE_ENV === 'development' && 
      HITPAY_CONFIG.SANDBOX && 
      !HITPAY_CONFIG.API_KEY;
      
    setUseMockSandbox(shouldUseMock);
  }, []);

  // Handle actual payment with HitPay
  const handlePayment = () => {
    if (useMockSandbox) {
      setShowMockSandbox(true);
    }
    // When using real integration, the form submit in HitPayDirectCheckout
    // will handle the navigation
  };

  // Handle success from the mock sandbox
  const handleMockSuccess = () => {
    setShowMockSandbox(false);
    onSuccess();
  };

  // Handle cancel from the mock sandbox
  const handleMockCancel = () => {
    setShowMockSandbox(false);
    onError('Payment cancelled');
  };

  // Check for successful payment on page load (when returning from HitPay)
  useEffect(() => {
    const checkPaymentSuccess = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const reference = urlParams.get('reference');
      
      if (status === 'completed' && reference) {
        // Store success in localStorage to notify other tabs
        localStorage.setItem('hitpay_payment_success', JSON.stringify({
          reference,
          timestamp: Date.now()
        }));
        onSuccess();
      }
    };
    
    checkPaymentSuccess();
  }, [onSuccess]);

  return (
    <>
      {/* Direct HitPay integration */}
      {!useMockSandbox ? (
        <HitPayCheckout
          amount={amount}
          email={email}
          name={name}
          phone={phone}
          referenceNumber={ref}
          onSuccess={onSuccess}
          onError={onError}
        />
      ) : (
        <button
          onClick={handlePayment}
          className="w-full bg-sky-600 text-white py-3 rounded-md hover:bg-sky-700 transition-colors"
        >
          Pay Now
        </button>
      )}
      
      {/* Mock Sandbox (for development only) */}
      {useMockSandbox && showMockSandbox && (
        <HitPayMockSandbox
          amount={amount}
          currency={HITPAY_CONFIG.CURRENCY}
          reference={ref}
          onSuccess={handleMockSuccess}
          onCancel={handleMockCancel}
        />
      )}
      
      {/* Development mode indicator */}
      {useMockSandbox && (
        <div className="mt-2 text-xs text-center text-gray-500">
          Using mock sandbox for development
        </div>
      )}
    </>
  );
}