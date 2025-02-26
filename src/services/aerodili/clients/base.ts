import { createSoapClient, handleSoapError, createSoapHeaders } from '../utils/soap';
import { withRetry } from '../utils/retry';
import { logger } from '../utils/logging';
import type { ApiResponse } from '../types/common';

export abstract class BaseClient {
  protected static async execute<T>(action: string, params: any): Promise<ApiResponse<T>> {
    try {
      logger.log('debug', action, 'Starting request', params);

      const result = await withRetry(async () => {
        const client = await createSoapClient();
        const headers = createSoapHeaders(action);
        const [response] = await client[action](params, { headers });
        return response;
      });

      logger.log('info', action, 'Request successful', result);

      return {
        success: true,
        data: result as T
      };
    } catch (error) {
      const apiError = handleSoapError(error);
      logger.log('error', action, apiError.message, error);

      return {
        success: false,
        error: apiError
      };
    }
  }
}