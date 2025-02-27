import { HITPAY_CONFIG } from '../../config/hitpay';
import { generateReference } from './utils/reference';
import type { CreatePaymentRequest, PaymentResponse } from './types';

export class PaymentService {
  private static readonly baseUrl = process.env.NODE_ENV === 'production' 
    ? HITPAY_CONFIG.API_URL 
    : HITPAY_CONFIG.SANDBOX_API_URL;

  static async createPayment(data: Omit<CreatePaymentRequest, 'reference_number'>): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': HITPAY_CONFIG.API_KEY,
          'X-BUSINESS-ID': HITPAY_CONFIG.API_KEY.split('_')[0]
        },
        body: JSON.stringify({
          ...data,
          reference_number: generateReference(),
          redirect_url: `${window.location.origin}${HITPAY_CONFIG.SUCCESS_URL}`,
          webhook: `${window.location.origin}${HITPAY_CONFIG.WEBHOOK_URL}`,
          cancel_url: `${window.location.origin}${HITPAY_CONFIG.CANCEL_URL}`
        })
      });

      if (!response.ok) {
        throw new Error('Payment request failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Payment creation failed');
    }
  }

  static async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-requests/${paymentId}`, {
        headers: {
          'X-API-Key': HITPAY_CONFIG.API_KEY,
          'X-BUSINESS-ID': HITPAY_CONFIG.API_KEY.split('_')[0]
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get payment status');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to check payment status');
    }
  }
}