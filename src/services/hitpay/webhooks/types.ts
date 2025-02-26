export interface WebhookPayload {
  payment_id: string;
  payment_request_id: string;
  phone: string;
  amount: string;
  currency: string;
  status: 'completed' | 'failed' | 'pending';
  reference_number: string;
}

export interface WebhookHeaders {
  'X-HITPAY-SIGNATURE': string;
}