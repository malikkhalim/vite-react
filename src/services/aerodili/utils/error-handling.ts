import { ERROR_CODES, getErrorMessage } from '../constants';
import type { ApiError } from '../types/common';

export function handleApiError(error: any): ApiError {
  // Handle API errors
  if (error?.response?.data) {
    return {
      code: error.response.data.code || ERROR_CODES.INTERNAL_ERROR,
      message: error.response.data.message || getErrorMessage(ERROR_CODES.INTERNAL_ERROR)
    };
  }

  // Handle network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    return {
      code: ERROR_CODES.CONNECTION_FAILED,
      message: getErrorMessage(ERROR_CODES.CONNECTION_FAILED)
    };
  }

  // Handle timeout
  if (error.code === 'ETIMEDOUT') {
    return {
      code: ERROR_CODES.TIMEOUT,
      message: getErrorMessage(ERROR_CODES.TIMEOUT)
    };
  }

  // Handle other errors
  return {
    code: ERROR_CODES.INTERNAL_ERROR,
    message: error.message || getErrorMessage(ERROR_CODES.INTERNAL_ERROR)
  };
}