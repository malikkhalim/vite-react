import { create } from 'soap';
import { SOAP_CONFIG } from '../config/soap';
import { logger } from './logging';
import { handleSoapError } from './error-handling';
import type { ApiResponse } from '../types/common';

class SoapClient {
  private static instance: SoapClient;
  private client: any = null;

  private constructor() {}

  static getInstance(): SoapClient {
    if (!SoapClient.instance) {
      SoapClient.instance = new SoapClient();
    }
    return SoapClient.instance;
  }

  async getClient() {
    if (!this.client) {
      try {
        this.client = await create(SOAP_CONFIG.WSDL_URL, {
          wsdl_options: {
            timeout: SOAP_CONFIG.TIMEOUT
          }
        });

        // Add logging
        this.client.on('request', (xml: string) => {
          logger.log('debug', 'SOAP_REQUEST', xml);
        });

        this.client.on('response', (xml: string) => {
          logger.log('debug', 'SOAP_RESPONSE', xml);
        });

      } catch (error) {
        logger.error('SOAP_CLIENT_ERROR', error);
        throw error;
      }
    }

    return this.client;
  }

  async execute<T>(action: string, params: any): Promise<ApiResponse<T>> {
    try {
      const client = await this.getClient();
      const [result] = await client[action](params);

      return {
        success: true,
        data: result as T
      };
    } catch (error) {
      return {
        success: false,
        error: handleSoapError(error)
      };
    }
  }
}

export const soapClient = SoapClient.getInstance();