import { SoapClient } from '../client/soap-client';
import { SOAP_CREDENTIALS } from '../config/endpoints';
import { RetrievePNRTransformer } from '../utils/retrieve-pnr-transformer';
import type { BookingDetails } from '../types/retrieve-pnr';

export class RetrievePNRAdapter {
  static async retrieveBooking(bookingCode: string): Promise<BookingDetails> {
    try {
      const request = {
        Username: SOAP_CREDENTIALS.USERNAME,
        Password: SOAP_CREDENTIALS.PASSWORD,
        BookingCode: bookingCode
      };

      const response = await SoapClient.execute('WsRetrievePNR', request);

      if (!response.success || response.error) {
        throw new Error(response.error?.message || 'Failed to retrieve booking');
      }

      return RetrievePNRTransformer.transformResponse(response.data);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to retrieve booking');
    }
  }
}