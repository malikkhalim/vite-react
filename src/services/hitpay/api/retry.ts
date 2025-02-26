import { API_CONFIG } from './config';
import { HitPayError } from './errors';

const RETRYABLE_ERROR_CODES = [
  'NETWORK_ERROR',
  'TIMEOUT_ERROR',
  '429', // Too Many Requests
  '503', // Service Unavailable
  '504', // Gateway Timeout
];

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof HitPayError)) return false;
  
  return RETRYABLE_ERROR_CODES.includes(error.code) || 
         RETRYABLE_ERROR_CODES.includes(error.status?.toString() || '');
}

function getDelayMs(attempt: number): number {
  const delay = API_CONFIG.RETRY.INITIAL_DELAY * Math.pow(2, attempt - 1);
  return Math.min(delay, API_CONFIG.RETRY.MAX_DELAY);
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  attempt: number = 1
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (!isRetryableError(error) || attempt >= API_CONFIG.RETRY.ATTEMPTS) {
      throw error;
    }

    await new Promise(resolve => setTimeout(resolve, getDelayMs(attempt)));
    return withRetry(operation, attempt + 1);
  }
}