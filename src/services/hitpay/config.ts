const HITPAY_API_KEY = import.meta.env.VITE_HITPAY_API_KEY || '0c4970e1f1986c9648489edd9e871ed276523472762e1edfeb3835091411de55';
const HITPAY_SALT = import.meta.env.VITE_HITPAY_SALT || '0R3e9G7UiLJk2XzJTroEjZqJcCnKFov5v9WlvDeew7HU0PFa6gBiHIGMGJFrtRMi';

export const HITPAY_CONFIG = {
  API_URL: 'https://api.hit-pay.com/v1',
  SANDBOX_API_URL: 'https://api.sandbox.hit-pay.com/v1',
  API_KEY: HITPAY_API_KEY,
  SALT: HITPAY_SALT,
  WEBHOOK_PATH: '/api/hitpay/webhook',
  SUCCESS_URL: '/payment/success',
  CANCEL_URL: '/payment/cancel',
  CURRENCY: 'USD'
} as const;