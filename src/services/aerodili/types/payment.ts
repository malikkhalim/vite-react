export interface PaymentRequest {
  bookingReference: string;
  amount: number;
  currency: string;
  method: 'credit_card' | 'paynow';
  returnUrl: string;
}

export interface PaymentResponse {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed';
  redirectUrl?: string; // For credit card payments
  qrCode?: string; // For PayNow
}

export interface PaymentVerificationRequest {
  paymentId: string;
}

export interface PaymentVerificationResponse {
  paymentId: string;
  status: 'completed' | 'pending' | 'failed';
  transactionId?: string;
  completedAt?: string;
}