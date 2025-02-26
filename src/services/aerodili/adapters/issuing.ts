import { SoapClient } from '../client/soap-client';
import { SOAP_CREDENTIALS } from '../config/endpoints';
import { IssuingTransformer } from '../utils/issuing-transformer';
import type { IssuingRequest, IssuingResult } from '../types/issuing';

export class IssuingAdapter {
  static async issueTicket(bookingCode: string): Promise<IssuingResult> {
    try {
      const request: IssuingRequest = {
        Username: SOAP_CREDENTIALS.USERNAME,
        Password: SOAP_CREDENTIALS.PASSWORD,
        BookingCode: bookingCode
      };

      const response = await SoapClient.execute('WsIssuing', request);

      if (!response.success || response.error) {
        return {
          success: false,
          error: response.error || {
            code: 'UNKNOWN_ERROR',
            message: 'Failed to issue ticket'
          }
        };
      }

      return IssuingTransformer.transformResponse(response.data);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ISSUING_ERROR',
          message: error instanceof Error ? error.message : 'Failed to issue ticket'
        }
      };
    }
  }
}