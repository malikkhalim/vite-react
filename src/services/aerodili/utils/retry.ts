import { delay } from '../../../utils/async';
import { AERODILI_CONFIG } from '../config';

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: boolean;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? AERODILI_CONFIG.RETRY_ATTEMPTS;
  const delayMs = options.delayMs ?? 1000;
  const backoff = options.backoff ?? true;

  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) break;
      
      const waitTime = backoff ? delayMs * attempt : delayMs;
      await delay(waitTime);
    }
  }

  throw lastError!;
}