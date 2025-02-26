import { hitpayClient } from './client';
import { HITPAY_CONFIG } from '../../../config/hitpay';
import { HitPayError } from './errors';
import type { CreatePaymentRequest, PaymentResponse } from '../types';

export class PaymentAPI {
  static async createPayment(data: Omit<CreatePaymentRequest, 'currency'>): Promise<PaymentResponse> {
    try {
      if (!HITPAY_CONFIG.API_KEY) {
        throw new HitPayError('Payment service not configured', 'CONFIG_ERROR');
      }

      const response = await hitpayClient.createPayment({
        ...data,
        currency: HITPAY_CONFIG.CURRENCY,
        reference_number: data.reference_number || `PAY-${Date.now()}`
      });

      return response;
    } catch (error) {
      console.error('Payment creation failed:', error);
      if (error instanceof HitPayError) {
        throw error;
      }
      throw new HitPayError(
        'Unable to process payment. Please try again later.',
        'PAYMENT_ERROR'
      );
    }
  }

  static async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    try {
      if (!HITPAY_CONFIG.API_KEY) {
        throw new HitPayError('Payment service not configured', 'CONFIG_ERROR');
      }

      return await hitpayClient.getPaymentStatus(paymentId);
    } catch (error) {
      console.error('Payment status check failed:', error);
      if (error instanceof HitPayError) {
        throw error;
      }
      throw new HitPayError(
        'Unable to check payment status',
        'STATUS_ERROR'
      );
    }
  }
}