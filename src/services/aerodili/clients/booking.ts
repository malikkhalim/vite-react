import { createSoapClient, handleSoapError, createSoapHeaders } from '../utils/soap';
import { SOAP_ACTIONS } from '../config';
import type { ApiResponse } from '../types/common';
import type {
  BookingRequest,
  BookingResponse,
  BookingStatusRequest,
  BookingStatusResponse,
} from '../types/booking';

export class BookingClient {
  private static async execute<T>(action: string, params: any): Promise<ApiResponse<T>> {
    try {
      const client = await createSoapClient();
      const headers = createSoapHeaders(action);
      
      const [result] = await client[action](params, { headers });
      
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

  static createBooking(params: BookingRequest): Promise<ApiResponse<BookingResponse>> {
    return this.execute(SOAP_ACTIONS.BOOKING.CREATE, params);
  }

  static getStatus(params: BookingStatusRequest): Promise<ApiResponse<BookingStatusResponse>> {
    return this.execute(SOAP_ACTIONS.BOOKING.GET_STATUS, params);
  }

  static cancelBooking(params: BookingStatusRequest): Promise<ApiResponse<void>> {
    return this.execute(SOAP_ACTIONS.BOOKING.CANCEL, params);
  }
}