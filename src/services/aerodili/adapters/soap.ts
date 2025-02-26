import { create } from 'soap';
import { AERODILI_CONFIG } from '../config';
import { logger } from '../utils/logging';
import { handleSoapError } from '../utils/error-handling';
import type { ApiResponse } from '../types/common';

export class SoapAdapter {
  private static async createClient() {
    try {
      return await create(AERODILI_CONFIG.WSDL_URL);
    } catch (error) {
      logger.error('SOAP_CLIENT_ERROR', error);
      throw error;
    }
  }

  static async execute<T>(action: string, params: any): Promise<ApiResponse<T>> {
    try {
      const client = await this.createClient();
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