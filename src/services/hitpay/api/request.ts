import { API_CONFIG } from './config';
import { HitPayError } from './errors';
import { getConnectionStatus } from './connection';

interface RequestOptions extends RequestInit {
  timeout?: number;
  validateConnection?: boolean;
}

async function withTimeout<T>(
  promise: Promise<T>, 
  timeoutMs: number
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(HitPayError.fromTimeout()), timeoutMs);
  });

  return Promise.race([promise, timeout]);
}

export async function makeRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { 
    timeout = API_CONFIG.TIMEOUT, 
    validateConnection = true,
    ...fetchOptions 
  } = options;

  if (validateConnection) {
    const { connected, url } = await getConnectionStatus();
    if (!connected) {
      throw HitPayError.fromConnectionError(url);
    }
  }

  try {
    const response = await withTimeout(
      fetch(endpoint, {
        ...fetchOptions,
        mode: 'cors',
        credentials: 'omit'
      }),
      timeout
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw HitPayError.fromApiError({
        ...errorData,
        status: response.status
      });
    }

    return await response.json();
  } catch (error) {
    if (error instanceof HitPayError) {
      throw error;
    }
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw HitPayError.fromNetworkError(error);
    }
    throw new HitPayError('Request failed', 'REQUEST_ERROR', undefined, error);
  }
}