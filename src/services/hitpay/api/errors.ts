export class HitPayError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public status?: number,
    public cause?: unknown
  ) {
    super(message);
    this.name = 'HitPayError';
  }

  static fromApiError(error: any): HitPayError {
    return new HitPayError(
      error.message || 'Payment request failed',
      error.code || 'API_ERROR',
      error.status
    );
  }

  static fromNetworkError(error: TypeError): HitPayError {
    return new HitPayError(
      'Unable to connect to payment service',
      'NETWORK_ERROR',
      undefined,
      error
    );
  }
}