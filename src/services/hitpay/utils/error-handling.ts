export class HitPayError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public status?: number
  ) {
    super(message);
    this.name = 'HitPayError';
  }
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message === 'Failed to fetch';
}

export function handleApiError(error: unknown): HitPayError {
  if (error instanceof HitPayError) {
    return error;
  }

  if (isNetworkError(error)) {
    return new HitPayError(
      'Network error: Please check your internet connection',
      'NETWORK_ERROR'
    );
  }

  if (error instanceof Error) {
    return new HitPayError(error.message);
  }

  return new HitPayError('An unknown error occurred');
}