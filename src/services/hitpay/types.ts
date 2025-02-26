export interface CreatePaymentRequest {
  amount: string;
  currency: string;
  email?: string;
  name?: string;
  phone?: string;
  purpose?: string;
  reference_number?: string;
  payment_methods?: string[];
  redirect_url?: string;
  webhook?: string;
  allow_repeated_payments?: boolean;
  expiry_date?: string;
}

export interface PaymentResponse {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  amount: string;
  currency: string;
  url: string;
  qr_code_data?: {
    qr_code: string;
    qr_code_expiry: string | null;
  };
}

export interface WebhookPayload {
  payment_id: string;
  payment_request_id: string;
  phone: string;
  amount: string;
  currency: string;
  status: 'completed' | 'failed';
  reference_number: string;
  hmac: string;
}