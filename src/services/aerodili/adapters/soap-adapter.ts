import { soapClient } from '../utils/soap-client';
import { createSoapHeaders, createAuthHeader } from '../utils/soap-headers';
import { logger } from '../utils/logging';
import type { ApiResponse } from '../types/common';

export class SoapAdapter {
  static async execute<T>(action: string, params: any): Promise<ApiResponse<T>> {
    try {
      logger.log('info', action, 'Starting SOAP request', params);

      const headers = {
        ...createSoapHeaders(action),
        ...createAuthHeader()
      };

      const response = await soapClient.execute<T>(action, {
        ...params,
        ...headers
      });

      logger.log('info', action, 'SOAP request successful', response);

      return response;
    } catch (error) {
      logger.error(action, 'SOAP request failed', error);
      throw error;
    }
  }
}