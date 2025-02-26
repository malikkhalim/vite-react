import { ERROR_CODES, getErrorMessage } from '../constants';
import type { SoapFault, ApiError } from '../types/common';

export function isSoapFault(error: any): error is SoapFault {
  return error && typeof error === 'object' && 'faultcode' in error;
}

export function handleSoapError(error: any): ApiError {
  if (isSoapFault(error)) {
    const errorCode = mapSoapFaultToErrorCode(error.faultcode);
    return {
      code: errorCode,
      message: getErrorMessage(errorCode),
      details: error.detail
    };
  }

  if (error.code === 'ETIMEDOUT') {
    return {
      code: ERROR_CODES.TIMEOUT,
      message: getErrorMessage(ERROR_CODES.TIMEOUT)
    };
  }

  if (error.code === 'ECONNREFUSED') {
    return {
      code: ERROR_CODES.CONNECTION_FAILED,
      message: getErrorMessage(ERROR_CODES.CONNECTION_FAILED)
    };
  }

  return {
    code: ERROR_CODES.INTERNAL_ERROR,
    message: error.message || getErrorMessage(ERROR_CODES.INTERNAL_ERROR)
  };
}

function mapSoapFaultToErrorCode(faultCode: string): keyof typeof ERROR_CODES {
  const faultMap: Record<string, keyof typeof ERROR_CODES> = {
    'soap:Server': ERROR_CODES.INTERNAL_ERROR,
    'soap:Client': ERROR_CODES.INVALID_REQUEST,
    'soap:MustUnderstand': ERROR_CODES.INVALID_REQUEST,
    'soap:VersionMismatch': ERROR_CODES.INVALID_REQUEST,
  };

  return faultMap[faultCode] || ERROR_CODES.INTERNAL_ERROR;
}