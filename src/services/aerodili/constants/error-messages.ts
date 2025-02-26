import { ERROR_CODES } from './error-codes';

export const ERROR_MESSAGES: Record<keyof typeof ERROR_CODES, string> = {
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

export function getErrorMessage(code: keyof typeof ERROR_CODES): string {
  return ERROR_MESSAGES[code] || 'An unknown error occurred';
}