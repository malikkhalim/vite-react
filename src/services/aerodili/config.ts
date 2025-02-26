export const AERODILI_CONFIG = {
  API_URL: 'https://api.aerodili.com/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Use REST API instead of SOAP for browser compatibility
export const API_ENDPOINTS = {
  FLIGHT: {
    SEARCH: '/flights/search',
    AVAILABILITY: '/flights/availability',
    PRICING: '/flights/pricing'
  },
  BOOKING: {
    CREATE: '/bookings',
    STATUS: '/bookings/status',
    CANCEL: '/bookings/cancel'
  },
  PAYMENT: {
    CREATE: '/payments',
    VERIFY: '/payments/verify'
  }
} as const;