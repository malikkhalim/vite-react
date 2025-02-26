import { HITPAY_CONFIG } from '../../../config/hitpay';
import { HitPayError } from './errors';
import type { CreatePaymentRequest, PaymentResponse } from '../types';

class HitPayClient {
  private static instance: HitPayClient;
  private baseUrl: string;
  private proxyUrl: string = '/api/hitpay';
  private scriptLoaded: boolean = false;

  private constructor() {
    this.baseUrl = HITPAY_CONFIG.SANDBOX 
      ? HITPAY_CONFIG.SANDBOX_API_URL 
      : HITPAY_CONFIG.API_URL;
  }

  static getInstance(): HitPayClient {
    if (!HitPayClient.instance) {
      HitPayClient.instance = new HitPayClient();
    }
    return HitPayClient.instance;
  }

  private async loadScript(): Promise<void> {
    if (this.scriptLoaded) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = HITPAY_CONFIG.SANDBOX 
        ? 'https://sandbox.hit-pay.com/hitpay.js'
        : 'https://hit-pay.com/hitpay.js';
      script.async = true;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load HitPay SDK'));
      };
      document.body.appendChild(script);
    });
  }

  private validateConfig() {
    if (!HITPAY_CONFIG.API_KEY) {
      throw new HitPayError('HitPay API key is not configured', 'CONFIG_ERROR');
    }
  }

  private getHeaders(): HeadersInit {
    this.validateConfig();
    return {
      'X-BUSINESS-API-KEY': HITPAY_CONFIG.API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin,
      'mode': 'cors'
    };
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
    try {
      // Use proxy URL for development to avoid CORS
      const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const url = isLocalDev 
        ? `${this.proxyUrl}${endpoint}` 
        : `${this.baseUrl}${endpoint}`;
      
      console.log("Making request to:", url);
      console.log("Request body:", options.body);
      
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders()
      });

      const responseData = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", responseData);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        throw new HitPayError(
          errorData.message || 'Request failed',
          'API_ERROR',
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Payment API error:", error);
      
      if (error instanceof HitPayError) {
        throw error;
      }
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new HitPayError(
          'Unable to connect to payment service. Please check your internet connection and try again.',
          'NETWORK_ERROR'
        );
      }
      throw new HitPayError(
        'An unexpected error occurred with the payment service',
        'UNKNOWN_ERROR',
        undefined,
        error
      );
    }
  }

  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      this.validateConfig();
      
      let paymentMethods = data.payment_methods || ['card'];
      const validMethods = ['card', 'paynow_online', 'wechat'];

      paymentMethods = paymentMethods.filter(method => validMethods.includes(method));
      
      if (paymentMethods.length === 0) {
        paymentMethods = ['card'];
      }
      
      const payload = {
        ...data,
        payment_methods: paymentMethods,
        redirect_url: `${window.location.origin}${HITPAY_CONFIG.SUCCESS_URL}`,
        webhook: `${window.location.origin}${HITPAY_CONFIG.WEBHOOK_PATH}`,
        cancel_url: `${window.location.origin}${HITPAY_CONFIG.CANCEL_URL}`,
        send_email: true,
        allow_repeated_payments: false
      };
  
      return this.makeRequest<PaymentResponse>('/payment-requests', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
    return this.makeRequest<PaymentResponse>(`/payment-requests/${paymentId}`, {
      method: 'GET'
    });
  }

  async initializeDropIn(paymentId: string, callbacks: {
    onSuccess: () => void;
    onError: (error: string) => void;
    onClose: () => void;
  }): Promise<void> {
    await this.loadScript();

    if (!window.HitPay) {
      throw new HitPayError('HitPay SDK not loaded', 'SDK_ERROR');
    }

    window.HitPay.init(
      HITPAY_CONFIG.SANDBOX 
        ? 'https://securecheckout.sandbox.hit-pay.com'
        : 'https://securecheckout.hit-pay.com',
      {
        paymentRequest: paymentId,
        apiDomain: HITPAY_CONFIG.SANDBOX ? 'sandbox.hit-pay.com' : 'hit-pay.com'
      },
      callbacks
    );
  }
}

export const hitpayClient = HitPayClient.getInstance();