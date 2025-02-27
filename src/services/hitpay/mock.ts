import { delay } from '../../utils/async';
import { CreatePaymentRequest, PaymentResponse } from '../hitpay/types';

export class MockPaymentService {
  static async createPayment(data: Omit<CreatePaymentRequest, 'reference_number'>): Promise<PaymentResponse> {
    // Simulate API delay
    await delay(1000);
    
    const paymentId = `mock_${Date.now()}`;
    const referenceNumber = data.reference_number || `PAY-${Date.now()}`;
    
    // Mock successful payment response
    return {
      id: paymentId,
      status: 'pending',
      amount: typeof data.amount === 'string' ? data.amount : data.amount.toString(),
      currency: data.currency || 'USD',
      url: `${window.location.origin}/payment/success?reference=${paymentId}`,
      qr_code_data: {
        qr_code: 'https://example.com/mock-qr',
        qr_code_expiry: null
      }
    };
  }

  static async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    // Simulate API delay
    await delay(800);
    
    // Always return completed for testing
    return {
      id: paymentId,
      status: 'completed',
      amount: '399.00',
      currency: 'USD',
      url: `${window.location.origin}/payment/success?reference=${paymentId}`
    };
  }
}