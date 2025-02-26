export const ERROR_CODES = {
  // Connection errors
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  TIMEOUT: 'TIMEOUT',
  INVALID_ENDPOINT: 'INVALID_ENDPOINT',
  
  // Authentication errors
  AUTH_FAILED: 'AUTH_FAILED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // Request errors
  INVALID_REQUEST: 'INVALID_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED: 'MISSING_REQUIRED',
  
  // Response errors
  INVALID_RESPONSE: 'INVALID_RESPONSE',
  PARSE_ERROR: 'PARSE_ERROR',
  
  // Business logic errors
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  
  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  MAINTENANCE_MODE: 'MAINTENANCE_MODE',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export function getErrorMessage(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    CONNECTION_FAILED: 'Failed to connect to the server',
    TIMEOUT: 'Request timed out',
    INVALID_ENDPOINT: 'Invalid API endpoint',
    AUTH_FAILED: 'Authentication failed',
    INVALID_CREDENTIALS: 'Invalid credentials provided',
    TOKEN_EXPIRED: 'Authentication token has expired',
    INVALID_REQUEST: 'Invalid request parameters',
    VALIDATION_ERROR: 'Request validation failed',
    MISSING_REQUIRED: 'Missing required fields',
    INVALID_RESPONSE: 'Invalid response from server',
    PARSE_ERROR: 'Failed to parse server response',
    NOT_FOUND: 'Requested resource not found',
    ALREADY_EXISTS: 'Resource already exists',
    INSUFFICIENT_FUNDS: 'Insufficient funds for this operation',
    INTERNAL_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Service is currently unavailable',
    MAINTENANCE_MODE: 'System is under maintenance'
  };

  return messages[code] || 'An unknown error occurred';
}