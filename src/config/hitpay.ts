
const HITPAY_API_KEY = import.meta.env.VITE_HITPAY_API_KEY || '';
const HITPAY_SALT = import.meta.env.VITE_HITPAY_SALT || '';

export const HITPAY_CONFIG = {
  API_URL: 'https://api.hit-pay.com/v1',
  SANDBOX_API_URL: 'https://api.sandbox.hit-pay.com/v1',
  API_KEY: HITPAY_API_KEY,
  SALT: HITPAY_SALT,
  WEBHOOK_PATH: '/api/hitpay/webhook',
  SUCCESS_URL: '/payment/success',
  CANCEL_URL: '/payment/cancel',
  CURRENCY: 'SGD',
  SANDBOX: process.env.NODE_ENV !== 'production',
} as const;