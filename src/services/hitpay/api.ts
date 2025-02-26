import axios from 'axios';
import { HITPAY_CONFIG } from '../../config/hitpay';
import type { CreatePaymentRequest, PaymentResponse, PaymentStatus } from './types';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? HITPAY_CONFIG.API_URL 
    : HITPAY_CONFIG.SANDBOX_API_URL,
  headers: {
    'X-API-Key': HITPAY_CONFIG.API_KEY,
    'Content-Type': 'application/json'
  }
});

export class HitPayAPI {
  static async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await api.post('/payment-requests', {
        ...data,
        webhook: HITPAY_CONFIG.WEBHOOK_URL,
        redirect_url: `${window.location.origin}${HITPAY_CONFIG.SUCCESS_URL}`,
        cancel_url: `${window.location.origin}${HITPAY_CONFIG.CANCEL_URL}`
      });

      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Payment creation failed');
    }
  }

  static async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    try {
      const response = await api.get(`/payment-requests/${paymentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get payment status');
    }
  }
}