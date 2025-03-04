// src/services/hitpay/vite-proxy-client.ts

import { HITPAY_CONFIG } from '../../config/hitpay';

interface CreatePaymentOptions {
  amount: number;
  currency?: string;
  name?: string;
  email?: string;
  phone?: string;
  reference_number?: string;
  redirect_url?: string;
  webhook?: string;
  cancel_url?: string;
  payment_methods?: string[];
}

interface PaymentResponse {
  id: string;
  status: string;
  amount: string;
  currency: string;
  url: string;
  redirect_url: string | null;
  webhook: string | null;
  reference_number: string | null;
}

/**
 * Creates a payment request via HitPay API through Vite's development proxy
 */
export async function createPayment(options: CreatePaymentOptions): Promise<PaymentResponse> {
  try {
    // Generate reference number if not provided
    const reference = options.reference_number || 
      `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    
    // Prepare request data
    const origin = window.location.origin;
    const requestData = {
      amount: options.amount.toFixed(2),
      currency: options.currency || HITPAY_CONFIG.CURRENCY,
      reference_number: reference,
      redirect_url: options.redirect_url || `${origin}${HITPAY_CONFIG.SUCCESS_URL}`,
      webhook: options.webhook || `${origin}${HITPAY_CONFIG.WEBHOOK_PATH}`,
      cancel_url: options.cancel_url || `${origin}${HITPAY_CONFIG.CANCEL_URL}`,
    };
    
    // Add optional fields
    if (options.name) requestData.name = options.name;
    if (options.email) requestData.email = options.email;
    if (options.phone) requestData.phone = options.phone;
    if (options.payment_methods) requestData.payment_methods = options.payment_methods;
    
    // Use Vite's proxy to make the request
    const response = await fetch('/api/hitpay/payment-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BUSINESS-API-KEY': HITPAY_CONFIG.API_KEY
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('HitPay payment creation error:', error);
    throw error;
  }
}

/**
 * Development mode: Mock HitPay API for testing
 */
export function mockCreatePayment(options: CreatePaymentOptions): Promise<PaymentResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reference = options.reference_number || 
        `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      const origin = window.location.origin;
      const mockId = `mock-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
      
      resolve({
        id: mockId,
        status: 'pending',
        amount: options.amount.toFixed(2),
        currency: options.currency || HITPAY_CONFIG.CURRENCY,
        url: `https://securecheckout.sandbox.hit-pay.com/payment-request/@mock/${mockId}/checkout`,
        redirect_url: options.redirect_url || `${origin}${HITPAY_CONFIG.SUCCESS_URL}`,
        webhook: options.webhook || `${origin}${HITPAY_CONFIG.WEBHOOK_PATH}`,
        reference_number: reference
      });
    }, 800);
  });
}