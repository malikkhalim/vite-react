import { hitpayClient } from './client';
import { HITPAY_CONFIG } from '../../../config/hitpay';
import { HitPayError } from './errors';
import type { CreatePaymentRequest, PaymentResponse } from '../types';

export class PaymentAPI {
  // static async createPayment(data: Omit<CreatePaymentRequest, 'currency'>): Promise<PaymentResponse> {
  //   try {
  //     if (!HITPAY_CONFIG.API_KEY) {
  //       throw new HitPayError('Payment service not configured', 'CONFIG_ERROR');
  //     }

  //     const response = await hitpayClient.createPayment({
  //       ...data,
  //       currency: HITPAY_CONFIG.CURRENCY,
  //       reference_number: data.reference_number || `PAY-${Date.now()}`
  //     });

  //     return response;
  //   } catch (error) {
  //     console.error('Payment creation failed:', error);
  //     if (error instanceof HitPayError) {
  //       throw error;
  //     }
  //     throw new HitPayError(
  //       'Unable to process payment. Please try again later.',
  //       'PAYMENT_ERROR'
  //     );
  //   }
  // }

  static async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const origin = window.location.origin;
      
      const paymentData = {
        ...data,
        redirect_url: `${origin}${HITPAY_CONFIG.SUCCESS_URL}`,
        webhook: `${origin}${HITPAY_CONFIG.WEBHOOK_PATH}`,
        cancel_url: `${origin}${HITPAY_CONFIG.CANCEL_URL}`
      };
  
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment API error:', errorText);
        throw new Error('Payment request failed');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Payment failed. Please try again.');
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