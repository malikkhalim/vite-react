import { SoapAdapter } from './soap';
import { transformSearchRequest, transformSearchResponse } from '../transformers/flight';
import { validateFlightSearch } from '../validators/flight';
import type { ApiResponse } from '../types/common';
import type { FlightSearchRequest, FlightSearchResponse } from '../types/flight';

export class FlightAdapter {
  static async searchFlights(params: FlightSearchRequest): Promise<ApiResponse<FlightSearchResponse>> {
    const validationError = validateFlightSearch(params);
    if (validationError) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationError
        }
      };
    }

    const soapRequest = transformSearchRequest(params);
    const response = await SoapAdapter.execute<any>('WsSearchFlight', soapRequest);

    if (!response.success) {
      return response;
    }

    return {
      success: true,
      data: transformSearchResponse(response.data)
    };
  }
}