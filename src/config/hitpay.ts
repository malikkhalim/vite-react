const HITPAY_API_KEY = import.meta.env.VITE_HITPAY_API_KEY;
const HITPAY_SALT = import.meta.env.VITE_HITPAY_SALT;

if (!HITPAY_API_KEY || !HITPAY_SALT) {
  console.warn('HitPay credentials not found. Using development mock for payments.');
}

export const HITPAY_CONFIG = {
  API_URL: 'https://api.hit-pay.com/v1',
  SANDBOX_API_URL: 'https://api.sandbox.hit-pay.com/v1',
  API_KEY: HITPAY_API_KEY || 'dev_mock_key',
  SALT: HITPAY_SALT || 'dev_mock_salt',
  WEBHOOK_PATH: '/api/hitpay/webhook',
  SUCCESS_URL: '/payment/success',
  CANCEL_URL: '/payment/cancel',
  CURRENCY: 'SGD',
  SANDBOX: process.env.NODE_ENV !== 'production',
  
  // Direct checkout URLs (for form submission)
  CHECKOUT_URL: process.env.NODE_ENV !== 'production'
    ? 'https://securecheckout.sandbox.hit-pay.com/payment-request'
    : 'https://securecheckout.hit-pay.com/payment-request',
    
  // Enable mock development mode when no API key is provided
  DEV_MOCK: !HITPAY_API_KEY && process.env.NODE_ENV !== 'production'
} as const;