export * from './error-codes';
export * from './error-messages';

export const AUTH_CREDENTIALS = {
  USERNAME: 'DILTRAVEL002',
  PASSWORD: 'Abc12345',
} as const;

export const CACHE_CONFIG = {
  TTL: {
    FLIGHT_SEARCH: 5 * 60 * 1000, // 5 minutes
    AVAILABILITY: 60 * 1000, // 1 minute
    PRICING: 60 * 1000, // 1 minute
  },
} as const;