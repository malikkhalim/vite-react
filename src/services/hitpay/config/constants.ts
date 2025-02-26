export const HITPAY_ENDPOINTS = {
  PAYMENT_REQUESTS: '/payment-requests',
  PAYMENT_STATUS: (id: string) => `/payment-requests/${id}`
} as const;

export const HITPAY_CURRENCIES = {
  USD: 'USD',
  SGD: 'SGD'
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
} as const;