import { HITPAY_CONFIG } from '../../../config/hitpay';

export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? HITPAY_CONFIG.API_URL 
    : HITPAY_CONFIG.SANDBOX_API_URL,
  RETRY: {
    ATTEMPTS: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 5000
  },
  TIMEOUT: 30000
} as const;