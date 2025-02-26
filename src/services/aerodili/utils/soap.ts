import { create } from 'soap';
import { AERODILI_CONFIG } from '../config';
import { logger } from './logging';
import type { SoapFault, ApiError } from '../types/common';

export async function createSoapClient() {
  try {
    const client = await create(AERODILI_CONFIG.WSDL_URL, {
      wsdl_options: {
        timeout: AERODILI_CONFIG.TIMEOUT
      }
    });

    // Add logging
    client.on('request', (xml: string) => {
      logger.debug('SOAP Request:', xml);
    });

    client.on('response', (xml: string) => {
      logger.debug('SOAP Response:', xml);
    });

    return client;
  } catch (error) {
    logger.error('Failed to create SOAP client:', error);
    throw error;
  }
}

export function isSoapFault(error: any): error is SoapFault {
  return error && typeof error === 'object' && 'faultcode' in error;
}

export function handleSoapError(error: any): ApiError {
  if (isSoapFault(error)) {
    return {
      code: error.faultcode,
      message: error.faultstring,
      details: error.detail
    };
  }

  return {
    code: 'INTERNAL_ERROR',
    message: error.message || 'An unknown error occurred'
  };
}