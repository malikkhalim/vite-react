import { delay } from '../../utils/async';
import type { PaymentResponse } from './types';

export async function createMockPayment(): Promise<PaymentResponse> {
  // Simulate network delay
  await delay(1500);
  
  // Return a mock successful payment
  return {
    id: `mock-payment-${Date.now()}`,
    status: 'pending',
    amount: '499.00',
    currency: 'SGD',
    url: '#mock-payment'
  };
}

export function simulatePaymentSuccess() {
  // Show a notification first
  alert("This is a test payment. In production, you would be redirected to the payment provider.");
  
  // Then redirect to success page with mock data
  window.location.href = `${window.location.origin}/payment/success?reference=mock-payment-${Date.now()}`;
}